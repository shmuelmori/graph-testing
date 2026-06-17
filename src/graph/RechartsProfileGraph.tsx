import { useMemo } from 'react';

import RechartsProfileChart from './RechartsProfileChart';
import Legend from './Legend';
import { generateProfileData } from './mockData';
import type { ProfilePoint } from './types';

interface RechartsProfileGraphProps {
  data?: ProfilePoint[];
  height?: number;
}

/** Fluid Recharts elevation profile (sized via Recharts' own ResponsiveContainer). */
export default function RechartsProfileGraph({ data, height = 460 }: RechartsProfileGraphProps) {
  const points = useMemo(() => data ?? generateProfileData(30), [data]);

  return (
    <div style={{ width: '100%' }}>
      <Legend />
      <div
        style={{
          width: '100%',
          height,
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <RechartsProfileChart data={points} />
      </div>
      <p style={{ margin: '10px 2px 0', fontSize: 12, color: '#64748b' }}>
        Scroll to zoom · drag to pan · double-click to zoom in · hover for values · use the buttons to reset.
      </p>
    </div>
  );
}
