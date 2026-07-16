'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Command } from '@/types/command';

interface CommandListResponse {
  commands: Command[];
  count: number;
}

export default function TablePage() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  
  // Pagination
  const limit = 20;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCommands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      let url = `/api/commands/history?limit=${limit}&offset=${offset}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (userFilter !== 'all') url += `&from_user=${userFilter}`;

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data: CommandListResponse = await res.json();
      setCommands(data.commands ?? []);
      setHasMore((data.commands ?? []).length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCommands([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, userFilter]);

  useEffect(() => {
    fetchCommands();
  }, [fetchCommands]);

  const handleFilterChange = () => {
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">Command History</h1>
          <p className="text-xs text-muted mt-1">View and filter active commands</p>
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
            className="bg-bg border border-muted/30 rounded-lg px-3 py-1.5 text-text text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="0">Pending (0)</option>
            <option value="1">Completed (1)</option>
            <option value="2">Failed (2)</option>
          </select>
          <select
            value={userFilter}
            onChange={(e) => { setUserFilter(e.target.value); handleFilterChange(); }}
            className="bg-bg border border-muted/30 rounded-lg px-3 py-1.5 text-text text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Users</option>
            <option value="dashboard">Dashboard</option>
            <option value="ML_AI">ML / AI</option>
          </select>
          <button
            onClick={fetchCommands}
            className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm hover:bg-primary/20 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-muted animate-pulse">Loading data from API...</div>
      ) : commands.length === 0 ? (
        <div className="p-10 text-center bg-surface border border-border/40 rounded-2xl flex flex-col items-center gap-3">
          <span className="text-4xl">📭</span>
          <h3 className="text-lg font-medium text-text">No commands found</h3>
          <p className="text-sm text-muted max-w-md">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-border/40 rounded-2xl shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 border-b border-border/40">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted">ID</th>
                <th className="px-4 py-3 font-semibold text-muted">Time</th>
                <th className="px-4 py-3 font-semibold text-muted">Source</th>
                <th className="px-4 py-3 font-semibold text-muted">Type</th>
                <th className="px-4 py-3 font-semibold text-muted">Target Value</th>
                <th className="px-4 py-3 font-semibold text-muted">End Lux L/R</th>
                <th className="px-4 py-3 font-semibold text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {commands.map((row) => (
                <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">#{row.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{new Date(row.created_at).toLocaleString('th-TH')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${row.from_user === 'ML_AI' ? 'bg-purple-500/10 text-purple-400' : 'bg-primary/10 text-primary'}`}>
                      {row.from_user}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.target_type}</td>
                  <td className="px-4 py-3">{row.target_value ?? '-'}</td>
                  <td className="px-4 py-3">
                    {row.lux_left ?? '-'} / {row.lux_right ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={
                      row.status === 0 ? 'text-yellow-400' : 
                      row.status === 1 ? 'text-green-400' : 'text-red-400'
                    }>
                      {row.status === 0 ? 'Pending' : row.status === 1 ? 'Success' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-surface border border-border/40 rounded-lg text-sm text-text hover:bg-muted/10 disabled:opacity-50 transition-colors"
        >
          &larr; Previous
        </button>
        <span className="text-sm text-muted">Page {page}</span>
        <button
          disabled={!hasMore}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-surface border border-border/40 rounded-lg text-sm text-text hover:bg-muted/10 disabled:opacity-50 transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
