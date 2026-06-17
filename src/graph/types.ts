/**
 * Core domain types for the profile graph.
 */

/** A single geographical sample as provided by the source data. */
export interface GeoPoint {
  id: number;
  latitude: number;
  longitude: number;
  elevation: number; // Line 1: Original flight path profile (meters)
  dtm: number; // Line 2: Ground terrain elevation (meters)
  dtmPlus300: number; // Line 3: Ground terrain + 300m buffer (meters)
  receptionLossHeight: number; // Line 4: Minimum antenna communication line (meters)
}

/**
 * A {@link GeoPoint} enriched with the cumulative ground distance from the
 * first point of the path. This is what we actually plot on the X-axis.
 */
export interface ProfilePoint extends GeoPoint {
  /** Cumulative great-circle distance from point[0], in meters. */
  cumulativeDistance: number;
}

/** Keys of {@link GeoPoint} that map to a plotted Y series. */
export type SeriesKey = 'elevation' | 'dtm' | 'dtmPlus300' | 'receptionLossHeight';

/** Static description of one rendered line. */
export interface SeriesConfig {
  key: SeriesKey;
  label: string;
  color: string;
  /** SVG stroke-dasharray, when the line should be dashed. */
  dashArray?: string;
}
