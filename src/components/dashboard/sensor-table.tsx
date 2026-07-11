// src/components/dashboard/sensor-table.tsx
'use client';

import type { SensorReading } from '@/types/sensor';

function fmt(v: number | null | undefined): string {
  return v === null || v === undefined ? '—' : String(v);
}

function fmtBool(v: boolean | null | undefined): string {
  if (v === null || v === undefined) return '—';
  return v ? 'ON' : 'OFF';
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

interface SensorTableProps {
  readings: SensorReading[];
}

export function SensorTable({ readings }: SensorTableProps) {
  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl overflow-hidden">
      {/* header */}
      <div className="px-5 py-4 border-b border-muted/20 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">📡 Sensor History</h2>
        <span className="text-xs text-muted">{readings.length} records</span>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wider border-b border-muted/10">
              <th className="px-4 py-3 text-left font-medium">Time</th>
              <th className="px-4 py-3 text-right font-medium">Lux L</th>
              <th className="px-4 py-3 text-right font-medium">Lux R</th>
              <th className="px-4 py-3 text-right font-medium">Angle</th>
              <th className="px-4 py-3 text-center font-medium">SW Left</th>
              <th className="px-4 py-3 text-center font-medium">SW Right</th>
            </tr>
          </thead>
          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted text-xs">
                  No data available
                </td>
              </tr>
            ) : (
              readings.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-muted/10 hover:bg-muted/5 transition-colors duration-100"
                >
                  <td className="px-4 py-2.5 text-text text-xs font-mono">{fmtTime(r.time)}</td>
                  <td className="px-4 py-2.5 text-right text-text tabular-nums">{fmt(r.lux_left)}</td>
                  <td className="px-4 py-2.5 text-right text-text tabular-nums">{fmt(r.lux_right)}</td>
                  <td className="px-4 py-2.5 text-right text-text tabular-nums">
                    {r.roter_angle !== null && r.roter_angle !== undefined ? `${r.roter_angle}°` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <LimitBadge value={r.limit_sw_left} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <LimitBadge value={r.limit_sw_right} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LimitBadge({ value }: { value: boolean | null | undefined }) {
  if (value === null || value === undefined) {
    return <span className="text-muted text-xs">—</span>;
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        value
          ? 'bg-red-500/15 text-red-400'
          : 'bg-green-500/15 text-green-400'
      }`}
    >
      {value ? 'ON' : 'OFF'}
    </span>
  );
}
