// src/components/dashboard/power-display.tsx
'use client';

interface PowerDisplayProps {
  voltage: number | null | undefined;   // millivolts
  current: number | null | undefined;   // milliamps
  power: number | null | undefined;     // milliwatts
  limitLeft: boolean | null | undefined;
  limitRight: boolean | null | undefined;
}

export function PowerDisplay({ voltage, current, power, limitLeft, limitRight }: PowerDisplayProps) {
  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center gap-2">
        <span className="text-primary text-lg">⚡</span>
        <span className="text-xs font-semibold text-muted uppercase tracking-widest">
          INA219 Power Monitor
        </span>
      </div>

      {/* INA219 stat cards */}
      <div className="flex flex-col gap-2">
        <PowerStatCard icon="⚡" label="Voltage" value={voltage} unit="mV" color="text-yellow-400" />
        <PowerStatCard icon="🔌" label="Current" value={current} unit="mA" color="text-blue-400" />
        <PowerStatCard icon="💡" label="Power" value={power} unit="mW" color="text-green-400" />
      </div>

      {/* Limit switch status */}
      <div className="flex gap-3">
        <LimitSwitchBadge label="Limit L" active={limitLeft} />
        <LimitSwitchBadge label="Limit R" active={limitRight} />
      </div>
    </div>
  );
}

function PowerStatCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: string;
  label: string;
  value: number | null | undefined;
  unit: string;
  color: string;
}) {
  const display = value ?? 0;
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-muted/10 border border-muted/10">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-muted font-medium">{label}</span>
      </div>
      <span className={`text-sm font-bold tabular-nums ${color}`}>
        {display} <span className="text-xs font-normal text-muted">{unit}</span>
      </span>
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
