import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roster } = await req.json();
  if (!Array.isArray(roster) || roster.length === 0) {
    return NextResponse.json({ error: 'Roster is empty.' }, { status: 400 });
  }

  const db = supabaseAdmin();
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const emp of roster) {
    const email = emp.employee_email?.toLowerCase().trim() || null;

    // Check if employee already exists by email
    if (email) {
      const { data: existing } = await db
        .from('employer_roster')
        .select('id, status')
        .eq('employee_email', email)
        .single();

      if (existing) {
        if (existing.status === 'terminated') {
          // Don't auto-reactivate terminated employees — skip and flag
          skipped++;
          continue;
        }
        // Update name/department for existing active employee
        await db
          .from('employer_roster')
          .update({
            employee_name: emp.employee_name,
            department: emp.department || 'Unassigned',
            uploaded_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        updated++;
        continue;
      }
    }

    // Insert new employee
    await db.from('employer_roster').insert({
      employee_name: emp.employee_name,
      employee_email: email,
      department: emp.department || 'Unassigned',
      status: 'active',
    });
    added++;
  }

  return NextResponse.json({ success: true, added, updated, skipped });
}