import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { MARGIN, SERIES, ZOOM } from './constants';
import type { ProfilePoint } from './types';
import { formatDistance, formatMeters, getDistance } from './utils';
import RechartsTooltip from './RechartsTooltip';
import RechartsZoomControls from './RechartsZoomControls';

export interface RechartsProfileChartProps {
  data: ProfilePoint[];
}

type Domain = [number, number];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Recharts version of the elevation profile. Recharts has no native zoom, so
 * we replicate the visx behaviour with controlled axis domains:
 *  - mouse wheel  → zoom in/out around the cursor (X + Y)
 *  - drag         → pan
 *  - double-click → zoom in at cursor
 *  - buttons      → zoom in / out / reset
 */
export default function RechartsProfileChart({ data }: RechartsProfileChartProps) {
  // Full data extents (the "reset" view).
  const xFull = useMemo<Domain>(() => {
    const xs = data.map(getDistance);
    return [Math.min(...xs), Math.max(...xs)];
  }, [data]);

  const yFull = useMemo<Domain>(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const d of data) {
      lo = Math.min(lo, d.elevation, d.dtm, d.receptionLossHeight);
      hi = Math.max(hi, d.elevation, d.dtmPlus300);
    }
    const pad = (hi - lo) * 0.08 || 10;
    return [lo - pad, hi + pad];
  }, [data]);

  const [xDomain, setXDomain] = useState<Domain>(xFull);
  const [yDomain, setYDomain] = useState<Domain>(yFull);

  // Reset the view whenever the underlying data (or its extent) changes.
  useEffect(() => {
    setXDomain(xFull);
    setYDomain(yFull);
  }, [xFull, yFull]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Measure our own width (used only for the X-axis tick density) instead of
  // depending on a sizing helper — Recharts' ResponsiveContainer handles fit.
  const [measuredWidth, setMeasuredWidth] = useState(0);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setMeasuredWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep current domains in a ref so the native wheel listener isn't stale.
  const domainsRef = useRef({ x: xDomain, y: yDomain });
  domainsRef.current = { x: xDomain, y: yDomain };

  /** Convert a pointer event into focus values in data space. */
  const focusFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = wrapperRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const plotW = rect.width - MARGIN.left - MARGIN.right;
      const plotH = rect.height - MARGIN.top - MARGIN.bottom;
      if (plotW <= 0 || plotH <= 0) return null;

      const rx = clamp((clientX - rect.left - MARGIN.left) / plotW, 0, 1);
      const ry = clamp((clientY - rect.top - MARGIN.top) / plotH, 0, 1);

      const { x, y } = domainsRef.current;
      return {
        x: x[0] + rx * (x[1] - x[0]),
        y: y[1] - ry * (y[1] - y[0]), // Y axis is inverted (top = max)
        plotW,
        plotH,
      };
    },
    [],
  );

  /** Zoom one axis around a focus value, clamped to the full extent + max scale. */
  const zoomAxis = useCallback(
    (domain: Domain, full: Domain, focus: number, factor: number): Domain => {
      const span = domain[1] - domain[0];
      const fullSpan = full[1] - full[0];
      const minSpan = fullSpan / ZOOM.scaleMax;
      const newSpan = clamp(span * factor, minSpan, fullSpan);
      const ratio = span === 0 ? 0.5 : (focus - domain[0]) / span;
      let a = focus - ratio * newSpan;
      let b = a + newSpan;
      if (a < full[0]) { a = full[0]; b = a + newSpan; }
      if (b > full[1]) { b = full[1]; a = b - newSpan; }
      return [a, b];
    },
    [],
  );

  const applyZoom = useCallback(
    (factor: number, clientX?: number, clientY?: number) => {
      const focus =
        clientX != null && clientY != null ? focusFromEvent(clientX, clientY) : null;
      const fx = focus ? focus.x : (domainsRef.current.x[0] + domainsRef.current.x[1]) / 2;
      const fy = focus ? focus.y : (domainsRef.current.y[0] + domainsRef.current.y[1]) / 2;
      setXDomain((d) => zoomAxis(d, xFull, fx, factor));
      setYDomain((d) => zoomAxis(d, yFull, fy, factor));
    },
    [focusFromEvent, zoomAxis, xFull, yFull],
  );

  // Native wheel listener so we can preventDefault (React onWheel is passive).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      applyZoom(factor, e.clientX, e.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyZoom]);

  // --- Drag to pan ---
  const dragRef = useRef<
    | { startX: number; startY: number; x: Domain; y: Domain; plotW: number; plotH: number }
    | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const f = focusFromEvent(e.clientX, e.clientY);
      if (!f) return;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        x: domainsRef.current.x,
        y: domainsRef.current.y,
        plotW: f.plotW,
        plotH: f.plotH,
      };
      setIsDragging(true);
    },
    [focusFromEvent],
  );

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const spanX = drag.x[1] - drag.x[0];
    const spanY = drag.y[1] - drag.y[0];
    const dxData = ((e.clientX - drag.startX) / drag.plotW) * spanX;
    const dyData = ((e.clientY - drag.startY) / drag.plotH) * spanY;

    // Pan within the full extent (preserve span).
    let nx0 = drag.x[0] - dxData;
    nx0 = clamp(nx0, xFull[0], xFull[1] - spanX);
    let ny0 = drag.y[0] + dyData; // screen-down = data-up
    ny0 = clamp(ny0, yFull[0], yFull[1] - spanY);

    setXDomain([nx0, nx0 + spanX]);
    setYDomain([ny0, ny0 + spanY]);
  }, [xFull, yFull]);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const reset = useCallback(() => {
    setXDomain(xFull);
    setYDomain(yFull);
  }, [xFull, yFull]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'crosshair',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onDoubleClick={(e) => applyZoom(1 / 1.6, e.clientX, e.clientY)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: MARGIN.top, right: MARGIN.right, bottom: MARGIN.bottom, left: MARGIN.left }}
        >
          <CartesianGrid stroke="#eef1f5" />
          <XAxis
            type="number"
            dataKey="cumulativeDistance"
            domain={xDomain}
            allowDataOverflow
            tickFormatter={(v: number) => formatDistance(v)}
            tickCount={Math.max(2, Math.floor((measuredWidth - MARGIN.left - MARGIN.right) / 90))}
            stroke="#94a3b8"
            tick={{ fill: '#475569', fontSize: 11 }}
            label={{
              value: 'Cumulative distance',
              position: 'insideBottom',
              offset: -12,
              fill: '#334155',
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            domain={yDomain}
            allowDataOverflow
            tickFormatter={(v: number) => formatMeters(v)}
            stroke="#94a3b8"
            tick={{ fill: '#475569', fontSize: 11 }}
            label={{
              value: 'Elevation (m)',
              angle: -90,
              position: 'insideLeft',
              offset: 8,
              style: { textAnchor: 'middle', fill: '#334155', fontSize: 12 },
            }}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 3', opacity: 0.7 }}
            content={<RechartsTooltip />}
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="linear"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={s.key === 'elevation' ? 2.5 : 1.8}
              strokeDasharray={s.dashArray}
              dot={{ r: 2.5, fill: s.color, stroke: s.color, strokeWidth: 1 }}
              activeDot={{ r: 5, fill: s.color, stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <RechartsZoomControls
        onZoomIn={() => applyZoom(1 / 1.3)}
        onZoomOut={() => applyZoom(1.3)}
        onReset={reset}
      />
    </div>
  );
}
