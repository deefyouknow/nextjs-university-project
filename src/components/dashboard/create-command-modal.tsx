// src/components/dashboard/create-command-modal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import type { CreateCommandRequest } from '@/types/command';

interface CreateCommandModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCommandModal({ open, onClose, onSuccess }: CreateCommandModalProps) {
  const [targetLuxL, setTargetLuxL] = useState<string>('');
  const [targetLuxR, setTargetLuxR] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // focus first input when modal opens
  useEffect(() => {
    if (open) {
      setTargetLuxL('');
      setTargetLuxR('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body: CreateCommandRequest = {
      source: 'manual',
      target_lux_l: targetLuxL ? parseInt(targetLuxL) : undefined,
      target_lux_r: targetLuxR ? parseInt(targetLuxR) : undefined,
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
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm mx-4 bg-surface rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
        {/* title */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">⚙️ New Command</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted uppercase tracking-wider font-medium">
              Target Lux Left
            </label>
            <input
              ref={inputRef}
              id="target_lux_l"
              type="number"
              min={0}
              placeholder="e.g. 1000"
              value={targetLuxL}
              onChange={(e) => setTargetLuxL(e.target.value)}
              className="bg-bg border border-muted/30 rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted uppercase tracking-wider font-medium">
              Target Lux Right
            </label>
            <input
              id="target_lux_r"
              type="number"
              min={0}
              placeholder="e.g. 1200"
              value={targetLuxR}
              onChange={(e) => setTargetLuxR(e.target.value)}
              className="bg-bg border border-muted/30 rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}

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
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send Command'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
