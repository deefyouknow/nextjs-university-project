'use client';

import type { SensorLog } from '@/types/sensor';

interface SensorHistoryTableProps {
  data: SensorLog[];
}

export function SensorHistoryTable({ data }: SensorHistoryTableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-surface border border-border/40 rounded-2xl shadow-sm flex flex-col mt-4">
      <div className="p-4 border-b border-border/40">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Raw Sensor Logs</h3>
        <p className="text-xs text-muted">Latest 20 readings (including 5-minute heartbeats)</p>
      </div>
      
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface sticky top-0 z-10 border-b border-border/40 shadow-sm">
            <tr>
              <th className="px-4 py-2 font-semibold text-muted text-xs">Time</th>
              <th className="px-4 py-2 font-semibold text-muted text-xs">Status</th>
              <th className="px-4 py-2 font-semibold text-muted text-xs">Panel L / R</th>
              <th className="px-4 py-2 font-semibold text-muted text-xs">Array Sensors</th>
              <th className="px-4 py-2 font-semibold text-muted text-xs">Power (mW)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {data.slice(0, 20).map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/5 transition-colors">
                <td className="px-4 py-2 font-mono text-xs">
                  {new Date(row.timestamp_slot).toLocaleTimeString('th-TH')}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${row.is_online ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {row.is_online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-text">
                  {row.lux_panel_left ?? '-'} / {row.lux_panel_right ?? '-'}
                </td>
                <td className="px-4 py-2 text-xs text-text">
                  {row.lux_l ?? '-'}/{row.lux_ml ?? '-'}/{row.lux_mr ?? '-'}/{row.lux_r ?? '-'}
                </td>
                <td className="px-4 py-2 text-xs text-text font-mono">
                  {row.power ? row.power.toFixed(1) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
