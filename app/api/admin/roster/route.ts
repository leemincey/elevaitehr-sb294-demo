import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

type RosterRow = {
  id: string;
  employee_name: string;
  employee_email: string | null;
  department: string;
  status: 'active' | 'terminated';
  terminated_at: string | null;
  uploaded_at: string;
};

type RecordRow = {
  employee_name: string;
  employee_email: string | null;
  completed_at: string;
};

function similarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1;
  if (!s1.length || !s2.length) return 0;
  const matrix: number[][] = Array.from({ length: s2.length + 1 }, (_, i) =>
    Array.from({ length: s1.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      matrix[i][j] =
        s2[i - 1] === s1[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
    }
  }
  const maxLen = Math.max(s1.length, s2.length);
  return (maxLen - matrix[s2.length][s1.length]) / maxLen;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();

  const [rosterRes, recordsRes] = await Promise.all([
    db.from('employer_roster').select('*').order('employee_name'),
    db.from('employee_records').select('employee_name, employee_email, completed_at'),
  ]);

  if (rosterRes.error || recordsRes.error) {
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }

  const roster = (rosterRes.data ?? []) as RosterRow[];
  const records = (recordsRes.data ?? []) as RecordRow[];

  const byEmail = new Map(
    records
      .filter((r) => r.employee_email)
      .map((r) => [r.employee_email!.toLowerCase().trim(), r])
  );

  const results = roster.map((emp) => {
    const emailKey = emp.employee_email?.toLowerCase().trim();

    // 1. Email match
    if (emailKey && byEmail.has(emailKey)) {
      const match = byEmail.get(emailKey)!;
      return {
        ...emp,
        compliance_status: 'complete',
        match_type: 'email',
        matched_name: match.employee_name,
        completed_at: match.completed_at,
      };
    }

    // 2. Fuzzy name match
    let bestScore = 0;
    let bestRecord: RecordRow | null = null;
    for (const r of records) {
      const score = similarity(emp.employee_name, r.employee_name);
      if (score > bestScore) { bestScore = score; bestRecord = r; }
    }
    if (bestScore >= 0.8 && bestRecord) {
      return {
        ...emp,
        compliance_status: 'complete',
        match_type: 'fuzzy',
        matched_name: bestRecord.employee_name,
        completed_at: bestRecord.completed_at,
      };
    }

    // 3. No match
    return {
      ...emp,
      compliance_status: 'not_started',
      match_type: 'none',
      matched_name: null,
      completed_at: null,
    };
  });

  return NextResponse.json({ results });
}