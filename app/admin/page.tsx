import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Users, TrendingUp, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
  const db = supabaseAdmin();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalResult, weekResult, recentResult] = await Promise.all([
    db.from('employee_records').select('id', { count: 'exact', head: true }),
    db.from('employee_records')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString()),
    db.from('employee_records')
      .select('id, employee_name, employee_email, authorize_detention, language, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return {
    total: totalResult.count ?? 0,
    thisWeek: weekResult.count ?? 0,
    recent: recentResult.data ?? [],
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const key = params.key ?? '';
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">SB 294 Compliance Portal overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          label="Total Records"
          value={stats.total}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          label="This Week"
          value={stats.thisWeek}
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Latest Submission"
          value={stats.recent[0]
            ? new Date(stats.recent[0].created_at).toLocaleDateString()
            : '—'}
          bg="bg-amber-50"
        />
      </div>

{/* Gap analysis CTA */}
<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white flex items-center justify-between">
  <div>
    <h2 className="font-semibold text-lg">Compliance Gap Analysis</h2>
    <p className="text-blue-100 text-sm mt-1">Upload your roster to see who still needs to complete SB 294</p>
  </div>
  <Link
    href={`/admin/gap?key=${key}`}
    className="shrink-0 bg-white text-blue-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
  >
    Run Analysis →
  </Link>
</div>

      {/* Recent records */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
          <Link
            href={`/admin/records?key=${key}`}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recent.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">No records yet.</p>
          ) : (
            stats.recent.map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.employee_name}</p>
                  <p className="text-xs text-gray-400">{r.employee_email ?? 'No email'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                  {r.authorize_detention && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Emergency contact
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}