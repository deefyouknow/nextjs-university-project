// src/components/dashboard/lux-gauge.tsx
'use client';

interface LuxGaugeProps {
  value: number | null | undefined;
  max?: number;
  label: string;
  color?: string;
  size?: number;
  isOffline?: boolean;
}

export function LuxGauge({
  value,
  max = 4000,
  label,
  color = '#4FD1C5',
  size = 120,
  isOffline,
}: LuxGaugeProps) {
  const radius = 48;
  const cx = 60;
  const cy = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc from -220deg to 40deg (220deg sweep)
  const sweep = 220;
  const startAngle = -220; // in SVG degrees from 3-o'clock
  const pct = value != null ? Math.min(value / max, 1) : 0;
  const dashLength = (sweep / 360) * circumference * pct;
  const totalArcLength = (sweep / 360) * circumference;

  // Convert sweep arc to SVG path
  function polarToXY(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(startDeg: number, endDeg: number, r: number) {
    const s = polarToXY(startDeg, r);
    const e = polarToXY(endDeg, r);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const arcStart = -110; // degrees (bottom-left)
  const arcEnd = 110;    // degrees (bottom-right)
  const arcEndFilled = arcStart + (arcEnd - arcStart) * pct;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* Track arc */}
        <path
          d={describeArc(arcStart, arcEnd, radius)}
          fill="none"
          stroke="rgba(160,174,192,0.2)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {value != null && (
          <path
            d={describeArc(arcStart, arcEndFilled, radius)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${color}80)`,
              transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
        )}
        {/* Center text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="15"
          fontWeight="700"
          fill="currentColor"
          className="text-text"
        >
          {isOffline ? 'No signal' : (value != null ? value : '—')}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(160,174,192,0.9)"
        >
          lux
        </text>
      </svg>
      <span className="text-xs text-muted font-medium tracking-wide">{label}</span>
    </div>
  );
}

// Simpler inline number badge for array lux sensors
interface ArrayLuxBadgeProps {
  value: number | null | undefined;
  label: string;
  color?: string;
  isOffline?: boolean;
}
export function ArrayLuxBadge({ value, label, color = '#4FD1C5', isOffline }: ArrayLuxBadgeProps) {
  const max = 4000;
  const pct = value != null ? Math.min(value / max, 1) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted font-medium">{label}</span>
        <span className="text-sm font-bold text-text tabular-nums">
          {isOffline ? 'No signal' : (value != null ? `${value} lux` : '—')}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted/15 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: value != null ? `0 0 6px ${color}60` : 'none',
          }}
        />
      </div>
    </div>
  );
}
