// src/components/dashboard/stat-card.tsx
'use client';

import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  icon: ReactNode;
  /** optional subtle accent color class, e.g. "text-primary" */
  accent?: string;
  /** sub-description shown below value */
  sub?: string;
}

export function StatCard({ label, value, unit, icon, accent = 'text-primary', sub }: StatCardProps) {
  const displayValue = value === null || value === undefined ? '—' : String(value);

  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-2xl">
      {/* top row: icon + label */}
      <div className="flex items-center gap-2">
        <span className={`text-xl ${accent}`}>{icon}</span>
        <span className="text-xs font-medium text-muted uppercase tracking-widest">{label}</span>
      </div>

      {/* value */}
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold text-text leading-none">{displayValue}</span>
        {unit && <span className="text-sm text-muted pb-0.5">{unit}</span>}
      </div>

      {/* optional sub text */}
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}
