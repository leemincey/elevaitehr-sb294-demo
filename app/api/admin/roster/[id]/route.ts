import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (!['terminate', 'reactivate'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from('employer_roster')
    .update({
      status: action === 'terminate' ? 'terminated' : 'active',
      terminated_at: action === 'terminate' ? new Date().toISOString() : null,
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}