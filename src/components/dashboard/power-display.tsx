'use client';

function fmt(v: number | null | undefined, isOffline?: boolean): string {
  if (isOffline) return 'No signal';
  return v === null || v === undefined ? '—' : String(v);
}

interface PowerDisplayProps {
  voltage: number | null | undefined;
  current: number | null | undefined;
  power: number | null | undefined;
  isOffline?: boolean;
}

export function PowerDisplay({ voltage, current, power, isOffline }: PowerDisplayProps) {
  return (
    <div className="bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-lg">⚡</span>
        <span className="text-xs font-semibold text-muted uppercase tracking-widest">
          Power Monitor (INA219)
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 justify-center">
        <div className="flex items-center justify-between p-3 rounded-xl bg-bg border border-muted/10">
          <span className="text-xs text-muted font-medium">Voltage (mV)</span>
          <span className="text-sm font-mono text-green-300 font-semibold">{fmt(voltage, isOffline)}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-bg border border-muted/10">
          <span className="text-xs text-muted font-medium">Current (mA)</span>
          <span className="text-sm font-mono text-green-300 font-semibold">{fmt(current, isOffline)}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-bg border border-muted/10">
          <span className="text-xs text-muted font-medium">Power (mW)</span>
          <span className="text-sm font-mono text-green-300 font-bold">{fmt(power, isOffline)}</span>
        </div>
      </div>
    </div>
  );
}
