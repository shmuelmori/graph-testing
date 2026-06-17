import { MARGIN } from './constants';

export interface RechartsZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

/** Floating zoom in / out / reset buttons for the Recharts profile chart. */
export default function RechartsZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: RechartsZoomControlsProps) {
  const btn: React.CSSProperties = {
    width: 30,
    height: 30,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 15,
    lineHeight: 1,
    color: '#334155',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  };
  // Stop pan-drag from starting when interacting with the buttons.
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div
      onMouseDown={stop}
      style={{
        position: 'absolute',
        top: MARGIN.top + 8,
        right: MARGIN.right + 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <button style={btn} title="Zoom in" onClick={onZoomIn}>+</button>
      <button style={btn} title="Zoom out" onClick={onZoomOut}>−</button>
      <button style={{ ...btn, fontSize: 12 }} title="Reset zoom" onClick={onReset}>⟳</button>
    </div>
  );
}
