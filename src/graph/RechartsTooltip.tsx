import type { TooltipContentProps } from 'recharts';

import { SERIES } from './constants';
import type { ProfilePoint } from './types';
import { formatDistance, formatLatLon, formatMeters } from './utils';

/**
 * Custom Recharts tooltip: point index, lat/lon and all four series values.
 * Recharts injects `active` / `payload` at runtime, so the props are partial.
 */
export default function RechartsTooltip({
  active,
  payload,
}: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload as ProfilePoint | undefined;
  if (!point) return null;

  return (
    <div
      style={{
        background: 'rgba(20, 24, 33, 0.94)',
        color: '#f5f7fa',
        padding: '10px 12px',
        borderRadius: 8,
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
        lineHeight: 1.35,
        minWidth: 210,
        fontSize: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 6,
          paddingBottom: 6,
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <strong style={{ fontSize: 13 }}>Point #{point.id}</strong>
        <span style={{ fontSize: 11, opacity: 0.75 }}>
          {formatDistance(point.cumulativeDistance)}
        </span>
      </div>
      <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 8 }}>
        {formatLatLon(point.latitude, point.longitude)}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {SERIES.map((s) => (
            <tr key={s.key}>
              <td style={{ paddingRight: 10, paddingBottom: 3 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: s.color,
                    marginRight: 6,
                    verticalAlign: 'middle',
                  }}
                />
                {s.label}
              </td>
              <td
                style={{
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                  paddingBottom: 3,
                }}
              >
                {formatMeters(point[s.key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
