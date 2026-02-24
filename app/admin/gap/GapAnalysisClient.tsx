'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, Download, RefreshCw, AlertTriangle, Archive, Users } from 'lucide-react';
import Link from 'next/link';

interface RosterEmployee {
  id: string;
  employee_name: string;
  employee_email: string | null;
  department: string;
  status: 'active' | 'terminated';
  terminated_at: string | null;
  compliance_status: 'complete' | 'not_started';
  match_type: 'email' | 'fuzzy' | 'none';
  matched_name: string | null;
  completed_at: string | null;
}

function DonutChart({ complete, total }: { complete: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#111827">{pct}%</text>
        <text x="70" y="83" textAnchor="middle" fontSize="11" fill="#6b7280">complete</text>
      </svg>
      <p className="text-sm text-gray-500 mt-1">{complete} of {total} active employees</p>
    </div>
  );
}

function parseCSV(text: string) {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const nameIdx = headers.findIndex((h) => h.includes('name'));
  const emailIdx = headers.findIndex((h) => h.includes('email'));
  const deptIdx = headers.findIndex((h) => h.includes('dept') || h.includes('department'));
  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    return {
      employee_name: nameIdx >= 0 ? cols[nameIdx] ?? '' : '',
      employee_email: emailIdx >= 0 ? cols[emailIdx] ?? '' : '',
      department: deptIdx >= 0 ? cols[deptIdx] ?? '' : 'Unassigned',
    };
  }).filter((r) => r.employee_name.length > 0);
}

export default function GapAnalysisClient() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') ?? '';

  const [all, setAll] = useState<RosterEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ added: number; updated: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [deptFilter, setDeptFilter] = useState('All');

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/roster?key=${key}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAll(data.results);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load roster.');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadResult(null);
    setError(null);
    try {
      const text = await file.text();
      const roster = parseCSV(text);
      if (roster.length === 0) {
        setError('Could not parse CSV. Ensure columns: employee_name, employee_email, department');
        return;
      }
      const res = await fetch(`/api/admin/roster/upload?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploadResult(data);
      await fetchRoster();
    } catch (e: any) {
      setError(e.message ?? 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (id: string, action: 'terminate' | 'reactivate') => {
    await fetch(`/api/admin/roster/${id}?key=${key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    await fetchRoster();
  };

  const active = all.filter((r) => r.status === 'active');
  const archived = all.filter((r) => r.status === 'terminated');
  const displayed = tab === 'active' ? active : archived;
  const departments = ['All', ...Array.from(new Set(active.map((r) => r.department || 'Unassigned'))).sort()];
  const filtered = deptFilter === 'All' ? displayed : displayed.filter((r) => r.department === deptFilter);
  const activeComplete = active.filter((r) => r.compliance_status === 'complete').length;

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Department', 'Roster Status', 'Compliance', 'Match Type', 'Completed At'];
    const rows = filtered.map((r) => [
      r.employee_name, r.employee_email ?? '', r.department,
      r.status, r.compliance_status === 'complete' ? 'Complete' : 'Not Started',
      r.match_type, r.completed_at ? new Date(r.completed_at).toLocaleDateString() : '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sb294-gap-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Gap Analysis</h1>
          <p className="text-gray-500 text-sm mt-1">Live compliance status against your employee roster</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchRoster} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer">
            <Upload size={14} />
            {uploading ? 'Uploading…' : 'Update Roster'}
            <input type="file" accept=".csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
          <Link href={`/admin?key=${key}`} className="text-sm text-gray-500 hover:text-blue-600">← Dashboard</Link>
        </div>
      </div>

      {uploadResult && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 flex justify-between">
          <span>✅ Roster updated — {uploadResult.added} added, {uploadResult.updated} updated
            {uploadResult.skipped > 0 && `, ${uploadResult.skipped} skipped (terminated)`}
          </span>
          <button onClick={() => setUploadResult(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {!loading && all.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No roster uploaded yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Upload a CSV with employee_name, employee_email, department</p>
          <button
            onClick={() => {
              const sample = `employee_name,employee_email,department\nJane Smith,jane@company.com,Warehouse\nJohn Doe,john@company.com,Office`;
              const blob = new Blob([sample], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'roster-template.csv'; a.click();
            }}
            className="text-xs text-blue-500 underline"
          >
            Download sample template
          </button>
        </div>
      )}

      {!loading && all.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-center">
              <DonutChart complete={activeComplete} total={active.length} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-center">
              <p className="text-sm text-gray-500">Complete</p>
              <p className="text-4xl font-bold text-emerald-600 mt-1">{activeComplete}</p>
              <p className="text-xs text-gray-400 mt-1">active employees signed</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-center">
              <p className="text-sm text-gray-500">Not Started</p>
              <p className="text-4xl font-bold text-red-500 mt-1">{active.length - activeComplete}</p>
              <p className="text-xs text-gray-400 mt-1">active employees pending</p>
            </div>
          </div>

          {departments.length > 2 && tab === 'active' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">By Department</h2>
              <div className="space-y-3">
                {departments.filter((d) => d !== 'All').map((dept) => {
                  const dTotal = active.filter((r) => r.department === dept).length;
                  const dComplete = active.filter((r) => r.department === dept && r.compliance_status === 'complete').length;
                  const pct = dTotal === 0 ? 0 : Math.round((dComplete / dTotal) * 100);
                  const bar = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';
                  return (
                    <div key={dept}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{dept}</span>
                        <span className="text-gray-500">{dComplete}/{dTotal} · {pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setTab('active')}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${tab === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                <Users size={14} /> Active ({active.length})
              </button>
              <button onClick={() => setTab('archived')}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${tab === 'archived' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                <Archive size={14} /> Archived ({archived.length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              {tab === 'active' && (
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none">
                  {departments.map((d) => <option key={d}>{d}</option>)}
                </select>
              )}
              <button onClick={exportCSV}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-gray-400">
                {tab === 'archived' ? 'No archived employees.' : 'No employees match this filter.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Employee', 'Email', 'Department',
                        tab === 'active' ? 'Compliance' : 'Archived On',
                        'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((r) => (
                      <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${r.compliance_status === 'not_started' && tab === 'active' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-4 py-3 font-medium text-gray-900">{r.employee_name}</td>
                        <td className="px-4 py-3 text-gray-500">{r.employee_email ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{r.department}</td>
                        <td className="px-4 py-3">
                          {tab === 'active' ? (
                            <span className="inline-flex items-center gap-1">
                              {r.compliance_status === 'complete' ? (
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">✅ Complete</span>
                              ) : (
                                <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">🔴 Not Started</span>
                              )}
                              {r.match_type === 'fuzzy' && (
                                <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle size={10} /> Fuzzy
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              {r.terminated_at ? new Date(r.terminated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {tab === 'active' ? (
                            <button
                              onClick={() => { if (confirm(`Archive ${r.employee_name}?`)) updateStatus(r.id, 'terminate'); }}
                              className="text-xs text-red-500 hover:text-red-700 hover:underline"
                            >
                              Archive
                            </button>
                          ) : (
                            <button
                              onClick={() => { if (confirm(`Reactivate ${r.employee_name}?`)) updateStatus(r.id, 'reactivate'); }}
                              className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              Reactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {loading && (
        <div className="text-center py-16 text-sm text-gray-400">
          <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
          Loading roster…
        </div>
      )}
    </div>
  );
}
