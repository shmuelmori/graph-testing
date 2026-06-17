import type { GeoPoint, ProfilePoint } from './types';

const EARTH_RADIUS_M = 6_371_000;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Great-circle (haversine) distance between two lat/lon points, in meters.
 */
export function haversineMeters(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Deterministic pseudo-random generator (mulberry32) so the mocked path is
 * stable across reloads — important for predictable visual testing.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a realistic-looking flight/path profile of `count` points.
 *
 * The path is a gentle geographic walk (starting near the Alps). Terrain
 * (`dtm`) follows rolling hills, the flight `elevation` is a smooth arc that
 * mostly clears the terrain, and the antenna reception line dips where the
 * craft loses line-of-sight altitude. `cumulativeDistance` is derived from the
 * haversine distance between consecutive coordinates.
 */
export function generateProfileData(count = 30, seed = 42): ProfilePoint[] {
  const rng = mulberry32(seed);

  // Starting coordinate (Western Alps-ish).
  let lat = 45.92;
  let lon = 6.87;

  const raw: GeoPoint[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1); // 0..1 progress along the path

    // Walk roughly north-east with small jitter.
    lat += 0.004 + (rng() - 0.5) * 0.0015;
    lon += 0.006 + (rng() - 0.5) * 0.0015;

    // Rolling terrain: two sine waves + noise, ~600m..1800m.
    const dtm =
      1100 +
      420 * Math.sin(t * Math.PI * 2.2) +
      180 * Math.sin(t * Math.PI * 5.5 + 1) +
      (rng() - 0.5) * 90;

    // Flight elevation: a smooth climb-cruise-descent arc that clears terrain.
    const arc = Math.sin(t * Math.PI); // 0 -> 1 -> 0
    const elevation = dtm + 250 + arc * 900 + (rng() - 0.5) * 60;

    const dtmPlus300 = dtm + 300;

    // Antenna minimum line-of-sight altitude: tracks terrain with a buffer
    // that grows where the path is far from the (mocked) base station.
    const receptionLossHeight = dtm + 120 + Math.abs(Math.sin(t * Math.PI * 3)) * 260;

    raw.push({
      id: i,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lon.toFixed(6)),
      elevation: Math.round(elevation),
      dtm: Math.round(dtm),
      dtmPlus300: Math.round(dtmPlus300),
      receptionLossHeight: Math.round(receptionLossHeight),
    });
  }

  // Derive cumulative distance from the coordinates.
  let cumulative = 0;
  return raw.map((p, i) => {
    if (i > 0) {
      const prev = raw[i - 1];
      cumulative += haversineMeters(prev.latitude, prev.longitude, p.latitude, p.longitude);
    }
    return { ...p, cumulativeDistance: cumulative };
  });
}
