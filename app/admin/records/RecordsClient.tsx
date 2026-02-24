'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Download, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface EmployeeRecord {
  id: string;
  employee_name: string;
  employee_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  authorize_detention: boolean;
  language: string;
  ip_address: string | null;
  completed_at: string;
  created_at: string;
}

export default function RecordsClient() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') ?? '';

  const [records, setRecords] = useState<EmployeeRecord[]>([]);
  const [filtered, setFiltered] = useState<EmployeeRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/records?key=${key}`);
      if (!res.ok) throw new Error('Failed to fetch records');
      const data = await res.json();
      setRecords(data.records);
      setFiltered(data.records);
    } catch (e) {
      setError('Could not load records.');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      records.filter(
        (r) =>
          r.employee_name.toLowerCase().includes(q) ||
          (r.employee_email ?? '').toLowerCase().includes(q) ||
          (r.contact_name ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, records]);

  const exportCSV = () => {
    const headers = [
      'ID', 'Name', 'Email', 'Emergency Contact', 'Contact Phone',
      'Authorize Detention', 'Language', 'IP Address', 'Completed At',
    ];
    const rows = filtered.map((r) => [
      r.id,
      r.employee_name,
      r.employee_email ?? '',
      r.contact_name ?? '',
      r.contact_phone ?? '',
      r.authorize_detention ? 'Yes' : 'No',
      r.language,
      r.ip_address ?? '',
      new Date(r.completed_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sb294-records-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Records</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} of {records.length} records
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRecords}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-gray-400">Loading…</p>
        ) : error ? (
          <p className="px-6 py-12 text-center text-sm text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-400">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'Emergency Contact', 'Detention Auth', 'Completed'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.employee_name}</td>
                    <td className="px-4 py-3 text-gray-500">{r.employee_email ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {r.contact_name ? `${r.contact_name} · ${r.contact_phone}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {r.authorize_detention ? (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Yes</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(r.completed_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
