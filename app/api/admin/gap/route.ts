import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// ── Levenshtein similarity (0–1) ─────────────────────────────────────────────
function similarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matrix: number[][] = Array.from({ length: s2.length + 1 }, (_, i) =>
    Array.from({ length: s1.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      matrix[i][j] =
        s2[i - 1] === s1[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }

  const maxLen = Math.max(s1.length, s2.length);
  return (maxLen - matrix[s2.length][s1.length]) / maxLen;
}

const FUZZY_THRESHOLD = 0.80;

export interface RosterEmployee {
  employee_name: string;
  employee_email: string;
  department: string;
}

export interface GapResult {
  employee_name: string;
  employee_email: string;
  department: string;
  status: 'complete' | 'not_started';
  match_type: 'email' | 'fuzzy' | 'none';
  matched_name: string | null;
  completed_at: string | null;
}

export async function POST(req: NextRequest) {
  // Auth check
  const key = req.nextUrl.searchParams.get('key');
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roster }: { roster: RosterEmployee[] } = await req.json();

  if (!Array.isArray(roster) || roster.length === 0) {
    return NextResponse.json({ error: 'Roster is empty.' }, { status: 400 });
  }

  // Fetch all completed records from Supabase
  const db = supabaseAdmin();
  const { data: records, error } = await db
    .from('employee_records')
    .select('employee_name, employee_email, completed_at');

  if (error) {
    console.error('[gap] Supabase error:', error);
    return NextResponse.json({ error: 'Failed to fetch records.' }, { status: 500 });
  }

  // Build lookup maps for fast matching
  const byEmail = new Map<string, typeof records[0]>();
  for (const r of records ?? []) {
    if (r.employee_email) byEmail.set(r.employee_email.toLowerCase().trim(), r);
  }

  // Match each roster employee
  const results: GapResult[] = roster.map((emp) => {
    const emailKey = emp.employee_email?.toLowerCase().trim();

    // 1. Try email match
    if (emailKey && byEmail.has(emailKey)) {
      const match = byEmail.get(emailKey)!;
      return {
        employee_name: emp.employee_name,
        employee_email: emp.employee_email,
        department: emp.department,
        status: 'complete',
        match_type: 'email',
        matched_name: match.employee_name,
        completed_at: match.completed_at,
      };
    }

    // 2. Fuzzy name match fallback
    let bestScore = 0;
    let bestRecord: typeof records[0] | null = null;
    for (const r of records ?? []) {
      const score = similarity(emp.employee_name, r.employee_name);
      if (score > bestScore) {
        bestScore = score;
        bestRecord = r;
      }
    }

    if (bestScore >= FUZZY_THRESHOLD && bestRecord) {
      return {
        employee_name: emp.employee_name,
        employee_email: emp.employee_email,
        department: emp.department,
        status: 'complete',
        match_type: 'fuzzy',
        matched_name: bestRecord.employee_name,
        completed_at: bestRecord.completed_at,
      };
    }

    // 3. No match — not started
    return {
      employee_name: emp.employee_name,
      employee_email: emp.employee_email,
      department: emp.department,
      status: 'not_started',
      match_type: 'none',
      matched_name: null,
      completed_at: null,
    };
  });

  return NextResponse.json({ results });
}