'use client';

import { useEffect, useState } from 'react';
import type { SensorLog, SensorHistoryResponse } from '@/types/sensor';

export default function TablePage() {
  const [readings, setReadings] = useState<SensorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sensors/history?limit=100', { cache: 'no-store' });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data: SensorHistoryResponse = await res.json();
        setReadings(data.readings ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLastFetchTime(new Date());
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Sensor Data History (Table)</h1>
          <p className="text-xs text-muted mt-1">Data from PostgreSQL Database (updates every 5 mins)</p>
        </div>
        {lastFetchTime && (
          <p className="text-sm text-muted bg-surface px-3 py-1.5 rounded-lg border border-border/40">
            Last checked: {lastFetchTime.toLocaleTimeString('th-TH')}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-muted animate-pulse">Loading data from API...</div>
      ) : readings.length === 0 ? (
        <div className="p-10 text-center bg-surface border border-border/40 rounded-2xl flex flex-col items-center gap-3">
          <span className="text-4xl">📭</span>
          <h3 className="text-lg font-medium text-text">No data found in Database</h3>
          <p className="text-sm text-muted max-w-md">
            The API connection is working normally (checked at {lastFetchTime?.toLocaleTimeString('th-TH')}), 
            but no sensor data has been saved to the database yet. 
            Remember that the data is saved every 5 minutes.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-border/40 rounded-2xl shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 border-b border-border/40">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted">Time</th>
                <th className="px-4 py-3 font-semibold text-muted">Lux (L/R)</th>
                <th className="px-4 py-3 font-semibold text-muted">Array (L/ML/MR/R)</th>
                <th className="px-4 py-3 font-semibold text-muted">Voltage (mV)</th>
                <th className="px-4 py-3 font-semibold text-muted">Current (mA)</th>
                <th className="px-4 py-3 font-semibold text-muted">Power (mW)</th>
                <th className="px-4 py-3 font-semibold text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {readings.map((row) => (
                <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{new Date(row.timestamp_slot).toLocaleString('th-TH')}</td>
                  <td className="px-4 py-3">
                    {row.lux_panel_left ?? 0} / {row.lux_panel_right ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {row.lux_l ?? 0} / {row.lux_ml ?? 0} / {row.lux_mr ?? 0} / {row.lux_r ?? 0}
                  </td>
                  <td className="px-4 py-3">{row.voltage ?? 0}</td>
                  <td className="px-4 py-3">{row.current ?? 0}</td>
                  <td className="px-4 py-3">{row.power ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={row.is_online ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                      {row.is_online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
