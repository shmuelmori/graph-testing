import { SERIES } from './constants';

/** Shared legend used by both the visx and Recharts graphs. */
export default function Legend() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 12,
        fontSize: 13,
        color: '#334155',
      }}
    >
      {SERIES.map((s) => (
        <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <svg width={26} height={10} aria-hidden>
            <line
              x1={0}
              y1={5}
              x2={26}
              y2={5}
              stroke={s.color}
              strokeWidth={s.key === 'elevation' ? 3 : 2.4}
              strokeDasharray={s.dashArray}
            />
          </svg>
          {s.label}
        </span>
      ))}
    </div>
  );
}
