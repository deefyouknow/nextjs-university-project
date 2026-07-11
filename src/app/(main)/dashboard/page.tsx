'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { StatCard } from '@/components/dashboard/stat-card';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/skeleton';
import { SensorTable } from '@/components/dashboard/sensor-table';
import { CommandTable } from '@/components/dashboard/command-table';
import { CreateCommandModal } from '@/components/dashboard/create-command-modal';

import type { SensorReading, SensorHistoryResponse } from '@/types/sensor';
import type { Command, CommandListResponse } from '@/types/command';

const REFRESH_INTERVAL_MS = 10_000;

export default function DashboardPage() {
  const router = useRouter();

  const [latest, setLatest] = useState<SensorReading | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);

  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCommands, setLoadingCommands] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchLatest = useCallback(async () => {
    const res = await fetch('/api/sensor/latest', { cache: 'no-store' });
    if (res.status === 401) { router.push('/auth/login'); return; }
    if (!res.ok) throw new Error(`Sensor latest: ${res.status}`);
    const data: SensorReading = await res.json();
    setLatest(data);
  }, [router]);

  const fetchHistory = useCallback(async () => {
    const res = await fetch('/api/sensor/history?limit=50', { cache: 'no-store' });
    if (res.status === 401) { router.push('/auth/login'); return; }
    if (!res.ok) throw new Error(`Sensor history: ${res.status}`);
    const data: SensorHistoryResponse = await res.json();
    setHistory(data.readings ?? []);
  }, [router]);

  const fetchCommands = useCallback(async () => {
    const res = await fetch('/api/commands/history?limit=50', { cache: 'no-store' });
    if (res.status === 401) { router.push('/auth/login'); return; }
    if (!res.ok) throw new Error(`Command history: ${res.status}`);
    const data: CommandListResponse = await res.json();
    setCommands(data.commands ?? []);
  }, [router]);

  // ── Initial load ───────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([
        fetchLatest().finally(() => setLoadingLatest(false)),
        fetchHistory().finally(() => setLoadingHistory(false)),
        fetchCommands().finally(() => setLoadingCommands(false)),
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  }, [fetchLatest, fetchHistory, fetchCommands]);

  // ── Silent refresh (no loading spinners) ───────────────────────────────────
  const refreshSilent = useCallback(async () => {
    try {
      await Promise.all([fetchLatest(), fetchHistory(), fetchCommands()]);
    } catch {
      // silent — don't overwrite main error state on refresh fail
    }
  }, [fetchLatest, fetchHistory, fetchCommands]);

  useEffect(() => {
    loadAll();
    timerRef.current = setInterval(refreshSilent, REFRESH_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadAll, refreshSilent]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const luxBalance =
    latest?.lux_left != null && latest?.lux_right != null
      ? (latest.lux_left - latest.lux_right).toFixed(0)
      : null;

  const limitStatus =
    latest?.limit_sw_left || latest?.limit_sw_right ? 'TRIGGERED' : 'Normal';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full p-4 flex flex-col gap-6">

      {/* ── Error banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-3 flex items-center justify-between">
          <p className="text-sm text-red-400">⚠️ {error}</p>
          <button
            onClick={loadAll}
            className="text-xs text-red-400 border border-red-400/40 rounded-lg px-3 py-1 hover:bg-red-500/10 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Top bar: title + refresh indicator + new command button ───────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-text">Solar Tracker Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">Auto-refresh every 10 seconds</p>
        </div>
        <button
          id="btn-new-command"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <span>＋</span>
          <span>New Command</span>
        </button>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {loadingLatest ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Lux Left"
              value={latest?.lux_left}
              unit="lux"
              icon="☀️"
              sub="Left panel sensor"
            />
            <StatCard
              label="Lux Right"
              value={latest?.lux_right}
              unit="lux"
              icon="☀️"
              sub="Right panel sensor"
            />
            <StatCard
              label="Roter Angle"
              value={latest?.roter_angle}
              unit="°"
              icon="🔄"
              sub={luxBalance !== null ? `Balance: ${luxBalance} lux` : undefined}
            />
            <StatCard
              label="Limit Switches"
              value={limitStatus}
              icon="🔀"
              accent={limitStatus === 'TRIGGERED' ? 'text-red-400' : 'text-primary'}
              sub={`L: ${latest?.limit_sw_left ? 'ON' : 'OFF'} · R: ${latest?.limit_sw_right ? 'ON' : 'OFF'}`}
            />
          </>
        )}
      </div>

      {/* ── Sensor history table ──────────────────────────────────────────── */}
      {loadingHistory ? (
        <TableSkeleton rows={6} />
      ) : (
        <SensorTable readings={history} />
      )}

      {/* ── Command history table ─────────────────────────────────────────── */}
      {loadingCommands ? (
        <TableSkeleton rows={4} />
      ) : (
        <CommandTable commands={commands} />
      )}

      {/* ── Create Command Modal ──────────────────────────────────────────── */}
      <CreateCommandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refreshSilent}
      />
    </div>
  );
}

