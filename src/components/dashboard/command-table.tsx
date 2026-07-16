'use client';

import type { Command, CommandStatus } from '@/types/command';

function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function fmt(v: number | null | undefined): string {
  return v === null || v === undefined ? '—' : String(v);
}

const statusConfig: Record<CommandStatus, { label: string; className: string }> = {
  0: { label: 'Waiting', className: 'bg-yellow-500/15 text-yellow-400' },
  1: { label: 'Success', className: 'bg-green-500/15 text-green-400' },
  2: { label: 'Interrupt', className: 'bg-red-500/15 text-red-400' },
};

interface CommandTableProps {
  commands: Command[];
  title?: string;
}

export function CommandTable({ commands, title = '⚙️ Command History' }: CommandTableProps) {
  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-muted/20 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        <span className="text-xs text-muted">{commands.length} records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wider border-b border-muted/10">
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-left font-medium">From</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Target</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Completed</th>
            </tr>
          </thead>
          <tbody>
            {commands.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted text-xs">
                  No commands found
                </td>
              </tr>
            ) : (
              commands.map((cmd) => {
                const cfg = statusConfig[cmd.status] ?? statusConfig[2];
                let targetDisplay = '—';
                if (cmd.target_type === 'error') {
                  targetDisplay = `E: ${fmt(cmd.target_value)} (±${cmd.tolerance})`;
                } else if (cmd.target_type === 'light_bias') {
                  targetDisplay = `R: ${fmt(cmd.target_left_ratio)} : ${fmt(cmd.target_right_ratio)} (±${cmd.tolerance})`;
                }
                
                return (
                  <tr
                    key={cmd.id}
                    className="border-b border-muted/10 hover:bg-muted/5 transition-colors duration-100"
                  >
                    <td className="px-4 py-2.5 text-text text-xs font-mono">{fmtTime(cmd.created_at)}</td>
                    <td className="px-4 py-2.5 text-muted text-xs capitalize">{cmd.from_user}</td>
                    <td className="px-4 py-2.5 text-muted text-xs capitalize">{cmd.target_type}</td>
                    <td className="px-4 py-2.5 text-right text-text whitespace-nowrap text-xs tabular-nums">{targetDisplay}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted text-xs font-mono">{fmtTime(cmd.completed_at)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
