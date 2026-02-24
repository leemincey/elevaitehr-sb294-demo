import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.recordId) {
      return NextResponse.json({ error: 'Record ID is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('employee_records')
      .update({ language_preference: body.languagePreference ?? 'en' })
      .eq('id', body.recordId);

    if (error) {
      console.error('[update] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update record.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[update] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
