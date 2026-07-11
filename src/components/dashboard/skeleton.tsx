// src/components/dashboard/skeleton.tsx
'use client';

/** Skeleton pulse block */
function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/20 ${className}`} />;
}

/** Matches StatCard height/layout */
export function StatCardSkeleton() {
  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Pulse className="h-5 w-5 rounded-full" />
        <Pulse className="h-3 w-20" />
      </div>
      <Pulse className="h-9 w-28" />
      <Pulse className="h-3 w-16" />
    </div>
  );
}

/** Matches table height — `rows` controls how many row placeholders appear */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-3">
      {/* "header" bar */}
      <Pulse className="h-4 w-40" />
      {/* divider */}
      <div className="border-t border-muted/20" />
      {/* rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 flex-1" />
          <Pulse className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
