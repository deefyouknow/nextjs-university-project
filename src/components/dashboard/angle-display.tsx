// src/components/dashboard/angle-display.tsx
'use client';

interface AngleDisplayProps {
  angle: number | null | undefined;
  limitLeft: boolean | null | undefined;
  limitRight: boolean | null | undefined;
}

export function AngleDisplay({ angle, limitLeft, limitRight }: AngleDisplayProps) {
  const deg = angle ?? 0;
  // Normalize 0-360 for display
  const rotation = angle != null ? deg : 0;

  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary text-lg">🔄</span>
          <span className="text-xs font-semibold text-muted uppercase tracking-widest">
            Roter Angle
          </span>
        </div>
        <span className="text-2xl font-bold text-text tabular-nums">
          {angle != null ? `${angle}°` : '—'}
        </span>
      </div>

      {/* Compass-style dial */}
      <div className="flex items-center justify-center">
        <div className="relative w-28 h-28">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-muted/20 bg-bg" />
          {/* Tick marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((t) => (
            <div
              key={t}
              className="absolute inset-0"
              style={{ transform: `rotate(${t}deg)` }}
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 rounded-full bg-muted/30" />
            </div>
          ))}
          {/* Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <div className="w-0.5 h-10 -mt-10 rounded-full bg-primary shadow-[0_0_8px_rgba(79,209,197,0.6)]" />
          </div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_rgba(79,209,197,0.8)]" />
          </div>
        </div>
      </div>

      {/* Limit switch status */}
      <div className="flex gap-3">
        <LimitSwitchBadge label="Limit L" active={limitLeft} />
        <LimitSwitchBadge label="Limit R" active={limitRight} />
      </div>
    </div>
  );
}

function LimitSwitchBadge({
  label,
  active,
}: {
  label: string;
  active: boolean | null | undefined;
}) {
  const on = active === true;
  return (
    <div
      className={`flex-1 flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
        on ? 'bg-red-500/15 border border-red-500/30' : 'bg-muted/10 border border-muted/10'
      }`}
    >
      <span className="text-xs text-muted font-medium">{label}</span>
      <span
        className={`text-xs font-bold ${on ? 'text-red-400' : 'text-green-400'}`}
      >
        {on ? '⚠ ON' : '✓ OFF'}
      </span>
    </div>
  );
}
