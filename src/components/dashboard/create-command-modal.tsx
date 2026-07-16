'use client';

import { useState, useRef, useEffect } from 'react';
import type { CreateCommandRequest } from '@/types/command';

interface CreateCommandModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCommandModal({ open, onClose, onSuccess }: CreateCommandModalProps) {
  const [mode, setMode] = useState<'error' | 'light_bias'>('error');
  const [targetValue, setTargetValue] = useState<string>('50');
  const [tolerance, setTolerance] = useState<string>('10');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, mode]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body: CreateCommandRequest = {
      from_user: 'dashboard',
      target_type: mode,
      target_value: mode === 'error' ? parseFloat(targetValue) : undefined,
      // AI Mode does not send ratios from frontend
      tolerance: mode === 'error' ? parseFloat(tolerance) : 0, // AI might not need tolerance from frontend
    };

    try {
      const res = await fetch('/api/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        setError('Session expired — please log in again.');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? `Error: ${res.status}`);
        return;
      }

      onSuccess?.();
      onClose();
    } catch {
      setError('Network error — check connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm mx-4 bg-surface rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">⚙️ New Command</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 p-1 bg-bg rounded-lg border border-muted/10">
          <button
            type="button"
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'error' ? 'bg-primary text-white shadow' : 'text-muted hover:text-text'}`}
            onClick={() => {
              setMode('error');
              setTolerance('10');
            }}
          >
            User Mode
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'light_bias' ? 'bg-primary text-white shadow' : 'text-muted hover:text-text'}`}
            onClick={() => {
              setMode('light_bias');
              setTolerance('0.02');
            }}
          >
            AI Mode
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'error' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Target Error</label>
                <input
                  ref={inputRef}
                  type="number"
                  step="0.1"
                  min={0}
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="bg-bg border border-muted/30 rounded-lg px-3 py-2 text-text text-sm focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Tolerance</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                  className="bg-bg border border-muted/30 rounded-lg px-3 py-2 text-text text-sm focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center gap-3">
              <span className="text-4xl">🤖</span>
              <p className="text-sm text-text font-medium">AI Auto-Tracking Mode</p>
              <p className="text-xs text-muted max-w-[250px]">
                The backend ML model will automatically calculate the optimal light bias ratio and adjust the solar panels.
              </p>
            </div>
          )}

          {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-muted/30 text-muted text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50 ${mode === 'error' ? 'bg-primary' : 'bg-purple-500'}`}
            >
              {loading ? 'Processing…' : (mode === 'error' ? 'Send Command' : 'Activate AI')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
