import { RechartsProfileGraph } from './graph';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '32px 24px',
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#0f172a',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Flight Path Elevation Profile
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Cumulative distance vs. altitude (m), with terrain, buffer and antenna
            reception lines — rendered with <strong>Recharts</strong>.
          </p>
        </header>

        <RechartsProfileGraph height={480} />
      </div>
    </div>
  );
}
