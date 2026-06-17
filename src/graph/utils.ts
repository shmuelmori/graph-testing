import type { ProfilePoint } from './types';

/** X accessor: cumulative distance in meters. */
export const getDistance = (d: ProfilePoint): number => d.cumulativeDistance;

/** Format meters as a compact distance label (km when large). */
export function formatDistance(meters: number): string {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(2)} km`
    : `${Math.round(meters)} m`;
}

/** Format an elevation value in meters. */
export function formatMeters(value: number): string {
  return `${Math.round(value)} m`;
}

/** Format a lat/lon pair for the tooltip. */
export function formatLatLon(lat: number, lon: number): string {
  return `${lat.toFixed(5)}°, ${lon.toFixed(5)}°`;
}
