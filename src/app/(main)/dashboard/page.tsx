'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { StatCard } from '@/components/dashboard/stat-card';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/skeleton';
import { SensorTable } from '@/components/dashboard/sensor-table';
import { CommandTable } from '@/components/dashboard/command-table';
import { CreateCommandModal } from '@/components/dashboard/create-command-modal';
import { LuxGauge, ArrayLuxBadge } from '@/components/dashboard/lux-gauge';
import { PowerDisplay } from '@/components/dashboard/power-display';

import type { SensorLog, SensorHistoryResponse } from '@/types/sensor';
import type { Command, CommandListResponse } from '@/types/command';

const REFRESH_INTERVAL_MS = 5_000;

export default function DashboardPage() {
  const router = useRouter();

  const [latest, setLatest] = useState<SensorLog | null>(null);
  const [history, setHistory] = useState<SensorLog[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);

  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCommands, setLoadingCommands] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLatest = useCallback(async () => {
    const res = await fetch('/api/sensors/latest', { cache: 'no-store' });
    if (res.status === 401) { router.push('/auth/login'); return; }
    if (!res.ok) throw new Error(`Sensor latest: ${res.status}`);
    const json = await res.json();
    const data: SensorLog | null = json?.reading ?? null;
    setLatest(data);
    setLastUpdated(new Date());
  }, [router]);

  const fetchHistory = useCallback(async () => {
    const res = await fetch('/api/sensors/history?limit=50', { cache: 'no-store' });
    if (res.status === 401) { router.push('/auth/login'); return; }
    if (!res.ok) throw new Error(`Sensor history: ${res.status}`);
    const data: SensorHistoryResponse = await res.json();
    setHistory(data.readings ?? []);
  }, [router]);

  const fetchCommands = useCallback(async () => {
    try {
      const res = await fetch('/api/commands/history?limit=50', { cache: 'no-store' });
      if (res.status === 401) { router.push('/auth/login'); return; }
      if (!res.ok) {
        setCommands([]);
        return;
      }
      const data: CommandListResponse = await res.json();
      setCommands(data.commands ?? []);
    } catch (err) {
      setCommands([]);
    }
  }, [router]);

  const loadAll = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([
        fetchLatest().finally(() => setLoadingLatest(false)),
        fetchHistory().finally(() => setLoadingHistory(false)),
      ]);
      await fetchCommands().finally(() => setLoadingCommands(false));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  }, [fetchLatest, fetchHistory, fetchCommands]);

  const refreshSilent = useCallback(async () => {
    setIsLive(true);
    try {
      await Promise.all([fetchLatest(), fetchHistory(), fetchCommands()]);
    } catch {
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

  const luxBalance =
    latest?.lux_panel_left != null && latest?.lux_panel_right != null
      ? Math.abs(latest.lux_panel_left - latest.lux_panel_right)
      : null;

  const hasSolarData = latest?.lux_panel_left != null || latest?.lux_panel_right != null;
  const hasArrayData =
    latest?.lux_l != null ||
    latest?.lux_ml != null ||
    latest?.lux_mr != null ||
    latest?.lux_r != null;

  return (
    <div className="w-full p-4 flex flex-col gap-6">
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

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-text">
            Solar Tracker Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-primary' : 'bg-muted/40'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-primary' : 'bg-muted/40'}`} />
            </span>
            <p className="text-xs text-muted">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('th-TH')}` : 'Auto-refresh every 5 seconds'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <span>＋</span>
          <span>New Command</span>
        </button>
      </div>

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
              value={latest?.lux_panel_left}
              unit="lux"
              icon="☀️"
              sub="Solar sensor left"
            />
            <StatCard
              label="Lux Right"
              value={latest?.lux_panel_right}
              unit="lux"
              icon="☀️"
              sub="Solar sensor right"
            />
            <StatCard
              label="Lux Balance"
              value={luxBalance !== null ? luxBalance : undefined}
              unit="Δ lux"
              icon="⚖️"
              accent={luxBalance != null && luxBalance > 200 ? 'text-yellow-400' : 'text-primary'}
              sub={luxBalance != null ? luxBalance < 100 ? 'Balanced ✓' : 'Tracking…' : 'No solar data'}
            />
            <StatCard
              label="ESP32 Status"
              value={latest?.is_online ? 'ONLINE' : 'OFFLINE'}
              icon="📶"
              accent={latest?.is_online ? 'text-green-400' : 'text-red-400'}
              sub={latest?.is_online ? 'Receiving data' : 'Connection lost'}
            />
          </>
        )}
      </div>

      {!loadingLatest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">☀️</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-widest">
                Solar Panels (BH1750)
              </span>
            </div>
            {hasSolarData ? (
              <div className="flex justify-around">
                <LuxGauge value={latest?.lux_panel_left} label="Left" color="#F6E05E" size={130} />
                <LuxGauge value={latest?.lux_panel_right} label="Right" color="#ED8936" size={130} />
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-4">No solar sensor data yet</p>
            )}
          </div>

          <div className="bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-primary text-lg">📊</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-widest">
                Array Sensors (×4)
              </span>
            </div>
            {hasArrayData ? (
              <div className="flex flex-col gap-3">
                <ArrayLuxBadge value={latest?.lux_l} label="Array Left" color="#4FD1C5" />
                <ArrayLuxBadge value={latest?.lux_ml} label="Array Mid-Left" color="#63B3ED" />
                <ArrayLuxBadge value={latest?.lux_mr} label="Array Mid-Right" color="#9F7AEA" />
                <ArrayLuxBadge value={latest?.lux_r} label="Array Right" color="#FC8181" />
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-4">No array sensor data yet</p>
            )}
          </div>

          <PowerDisplay
            voltage={latest?.voltage}
            current={latest?.current}
            power={latest?.power}
          />
        </div>
      )}

      {loadingHistory ? <TableSkeleton rows={6} /> : <SensorTable readings={history} />}
      {loadingCommands ? <TableSkeleton rows={4} /> : <CommandTable commands={commands} />}

      <CreateCommandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refreshSilent}
      />
    </div>
  );
}
