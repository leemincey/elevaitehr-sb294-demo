import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();

  const { data, error } = await db
    .from('employee_records')
    .select(
      'id, employee_name, employee_email, contact_name, contact_phone, authorize_detention, language, ip_address, completed_at, created_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin/records] Supabase error:', error);
    return NextResponse.json({ error: 'Failed to fetch records.' }, { status: 500 });
  }

  return NextResponse.json({ records: data });
}