'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { StatCard } from '@/components/dashboard/stat-card';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/skeleton';
import { SensorTable } from '@/components/dashboard/sensor-table';
import { CommandTable } from '@/components/dashboard/command-table';
import { CreateCommandModal } from '@/components/dashboard/create-command-modal';
import { LuxGauge, ArrayLuxBadge } from '@/components/dashboard/lux-gauge';
import { AngleDisplay } from '@/components/dashboard/angle-display';

import type { SensorReading, SensorHistoryResponse } from '@/types/sensor';
import type { Command, CommandListResponse } from '@/types/command';

const REFRESH_INTERVAL_MS = 5_000; // 5 s for live feel

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchLatest = useCallback(async () => {
    const res = await fetch('/api/sensor/latest', { cache: 'no-store' });
    if (res.status === 401) { router.push('/auth/login'); return; }
    if (!res.ok) throw new Error(`Sensor latest: ${res.status}`);
    // route.ts now unwraps { reading } → returns SensorReading | null directly
    const data: SensorReading | null = await res.json();
    setLatest(data);
    setLastUpdated(new Date());
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
    setIsLive(true);
    try {
      await Promise.all([fetchLatest(), fetchHistory(), fetchCommands()]);
    } catch {
      // silent — don't overwrite main error state on refresh fail
    } finally {
      setTimeout(() => setIsLive(false), 600);
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
      ? Math.abs(latest.lux_left - latest.lux_right)
      : null;

  const limitStatus =
    latest?.limit_sw_left || latest?.limit_sw_right ? 'TRIGGERED' : 'Normal';

  const hasSolarData = latest?.lux_left != null || latest?.lux_right != null;
  const hasArrayData =
    latest?.lux_l != null ||
    latest?.lux_ml != null ||
    latest?.lux_mr != null ||
    latest?.lux_r != null;

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

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-text">
            Solar Tracker Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Live pulse indicator */}
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isLive ? 'bg-primary' : 'bg-muted/40'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? 'bg-primary' : 'bg-muted/40'
                }`}
              />
            </span>
            <p className="text-xs text-muted">
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString('th-TH')}`
                : 'Auto-refresh every 5 seconds'}
            </p>
          </div>
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

      {/* ── Stat cards (Solar Lux + Limit switch) ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
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
              sub="Solar sensor left"
            />
            <StatCard
              label="Lux Right"
              value={latest?.lux_right}
              unit="lux"
              icon="☀️"
              sub="Solar sensor right"
            />
            <StatCard
              label="Lux Balance"
              value={luxBalance !== null ? luxBalance : undefined}
              unit="Δ lux"
              icon="⚖️"
              accent={
                luxBalance != null && luxBalance > 200 ? 'text-yellow-400' : 'text-primary'
              }
              sub={
                luxBalance != null
                  ? luxBalance < 100
                    ? 'Balanced ✓'
                    : 'Tracking…'
                  : 'No solar data'
              }
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

      {/* ── Visual panels: Lux Gauges + Angle dial ────────────────────────── */}
      {!loadingLatest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

          {/* Solar Lux Gauges */}
          <div className="bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">☀️</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-widest">
                Solar Panels (BH1750)
              </span>
            </div>
            {hasSolarData ? (
              <div className="flex justify-around">
                <LuxGauge
                  value={latest?.lux_left}
                  label="Left"
                  color="#F6E05E"
                  size={130}
                />
                <LuxGauge
                  value={latest?.lux_right}
                  label="Right"
                  color="#ED8936"
                  size={130}
                />
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-4">
                No solar sensor data yet
              </p>
            )}
          </div>

          {/* Array Lux (TCA9548A × 4) */}
          <div className="bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-primary text-lg">📊</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-widest">
                Array Sensors (×4)
              </span>
            </div>
            {hasArrayData ? (
              <div className="flex flex-col gap-3">
                <ArrayLuxBadge value={latest?.lux_l}  label="Array Left"       color="#4FD1C5" />
                <ArrayLuxBadge value={latest?.lux_ml} label="Array Mid-Left"   color="#63B3ED" />
                <ArrayLuxBadge value={latest?.lux_mr} label="Array Mid-Right"  color="#9F7AEA" />
                <ArrayLuxBadge value={latest?.lux_r}  label="Array Right"      color="#FC8181" />
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-4">
                No array sensor data yet
              </p>
            )}
          </div>

          {/* Roter Angle + Limit Switches */}
          <AngleDisplay
            angle={latest?.roter_angle}
            limitLeft={latest?.limit_sw_left}
            limitRight={latest?.limit_sw_right}
          />
        </div>
      )}

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
