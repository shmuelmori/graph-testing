import type { SeriesConfig } from './types';

/** Inner-chart margins (space reserved for axes / labels). */
export const MARGIN = { top: 24, right: 28, bottom: 56, left: 64 } as const;

/** Zoom scale limits applied via the constrain callback. */
export const ZOOM = {
  scaleMin: 1,
  scaleMax: 24,
  /** Wheel sensitivity: <1 zooms out, >1 zooms in. */
  wheelDeltaPerLine: 0.0015,
} as const;

/**
 * The four lines, in render + legend order. The order also controls
 * stacking — later entries paint on top.
 */
export const SERIES: SeriesConfig[] = [
  {
    key: 'dtm',
    label: 'DTM Profile (terrain)',
    color: '#6b8e23', // earthy olive/green
  },
  {
    key: 'dtmPlus300',
    label: 'DTM + 300m Buffer',
    color: '#e8590c', // orange/red
    dashArray: '8 5',
  },
  {
    key: 'receptionLossHeight',
    label: 'Antenna Loss Line',
    color: '#b5179e', // magenta/purple
  },
  {
    key: 'elevation',
    label: 'Original Path',
    color: '#1971c2', // vibrant blue
  },
];
