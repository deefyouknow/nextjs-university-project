'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SensorLog } from '@/types/sensor';

interface SensorChartProps {
  onDateChange: (date: string) => void;
  selectedDate: string;
  data: SensorLog[];
  loading?: boolean;
}

export function SensorChart({ onDateChange, selectedDate, data, loading }: SensorChartProps) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Filter lines toggles
  const [showLux, setShowLux] = useState({
    lux_panel_left: true,
    lux_panel_right: true,
    lux_l: false,
    lux_ml: false,
    lux_mr: false,
    lux_r: false,
  });

  useEffect(() => {
    async function fetchDates() {
      try {
        const res = await fetch('/api/sensors/available-dates', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setAvailableDates(json.dates ?? []);
          
          // Auto-select latest date if none selected and dates exist
          if (!selectedDate && json.dates?.length > 0) {
            onDateChange(json.dates[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dates:', err);
      } finally {
        setLoadingDates(false);
      }
    }
    fetchDates();
  }, [selectedDate, onDateChange]);

  const toggleLux = (key: keyof typeof showLux) => {
    setShowLux((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Format data for chart
  const chartData = [...data].reverse().map(d => ({
    ...d,
    time: new Date(d.timestamp_slot).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <div className="w-full bg-surface rounded-2xl shadow-xl p-5 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-primary text-xl">📈</span>
          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Daily Sensor History</h3>
            <p className="text-xs text-muted">View lux and power data over time</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted font-medium uppercase">Date:</label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            disabled={loadingDates || availableDates.length === 0}
            className="bg-bg border border-muted/30 rounded-lg px-3 py-1.5 text-text text-sm focus:border-primary focus:outline-none transition-colors"
          >
            {availableDates.length === 0 && <option value="">No dates available</option>}
            {availableDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-[300px] w-full flex items-center justify-center bg-bg/50 rounded-xl border border-muted/10 animate-pulse">
          <span className="text-muted text-sm font-medium">Loading data...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-[300px] w-full flex items-center justify-center bg-bg/50 rounded-xl border border-muted/10">
          <span className="text-muted text-sm font-medium">No data for selected date</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Lux Chart */}
          <div className="h-[300px] w-full">
            <h4 className="text-xs text-center text-muted font-medium mb-2">Lux Readings (BH1750)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted/20" vertical={false} />
                <XAxis dataKey="time" stroke="currentColor" className="text-muted text-xs" tickMargin={10} />
                <YAxis stroke="currentColor" className="text-muted text-xs" tickFormatter={(v) => `${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}
                />
                
                {showLux.lux_panel_left && <Line type="monotone" dataKey="lux_panel_left" name="Panel L" stroke="#F6E05E" dot={false} strokeWidth={2} />}
                {showLux.lux_panel_right && <Line type="monotone" dataKey="lux_panel_right" name="Panel R" stroke="#ED8936" dot={false} strokeWidth={2} />}
                
                {showLux.lux_l && <Line type="monotone" dataKey="lux_l" name="Array L" stroke="#4FD1C5" dot={false} />}
                {showLux.lux_ml && <Line type="monotone" dataKey="lux_ml" name="Array ML" stroke="#63B3ED" dot={false} />}
                {showLux.lux_mr && <Line type="monotone" dataKey="lux_mr" name="Array MR" stroke="#9F7AEA" dot={false} />}
                {showLux.lux_r && <Line type="monotone" dataKey="lux_r" name="Array R" stroke="#FC8181" dot={false} />}
              </LineChart>
            </ResponsiveContainer>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showLux.lux_panel_left} onChange={() => toggleLux('lux_panel_left')} className="accent-[#F6E05E]" />
                <span className="text-xs text-text">Panel L</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showLux.lux_panel_right} onChange={() => toggleLux('lux_panel_right')} className="accent-[#ED8936]" />
                <span className="text-xs text-text">Panel R</span>
              </label>
              <span className="text-muted/30">|</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showLux.lux_l} onChange={() => toggleLux('lux_l')} className="accent-[#4FD1C5]" />
                <span className="text-xs text-text">Arr L</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showLux.lux_ml} onChange={() => toggleLux('lux_ml')} className="accent-[#63B3ED]" />
                <span className="text-xs text-text">Arr ML</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showLux.lux_mr} onChange={() => toggleLux('lux_mr')} className="accent-[#9F7AEA]" />
                <span className="text-xs text-text">Arr MR</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showLux.lux_r} onChange={() => toggleLux('lux_r')} className="accent-[#FC8181]" />
                <span className="text-xs text-text">Arr R</span>
              </label>
            </div>
          </div>

          <hr className="border-border/30" />

          {/* Power Chart */}
          <div className="h-[250px] w-full">
            <h4 className="text-xs text-center text-muted font-medium mb-2">Power Monitor (INA219)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted/20" vertical={false} />
                <XAxis dataKey="time" stroke="currentColor" className="text-muted text-xs" tickMargin={10} />
                <YAxis stroke="currentColor" className="text-muted text-xs" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                <Line type="monotone" dataKey="power" name="Power (mW)" stroke="#4ade80" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
