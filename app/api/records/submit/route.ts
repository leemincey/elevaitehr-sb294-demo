import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.firstName?.trim()) {
      return NextResponse.json({ error: 'First name is required.' }, { status: 400 });
    }
    if (!body.signatureBase64) {
      return NextResponse.json({ error: 'Signature is required.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? null;
    const userAgent = req.headers.get('user-agent') ?? null;

    const { data, error } = await supabase
      .from('employee_records')
      .insert({
        first_name: body.firstName.trim(),
        last_name: body.lastName.trim(),
        employee_name: `${body.firstName} ${body.lastName}`.trim(),
        employee_email: body.email?.trim() || null,
        department: body.department?.trim() || null,
        signature_base64: body.signatureBase64,
        contact_name: body.contactName?.trim() || null,
        contact_phone: body.contactPhone?.trim() || null,
        contact_relationship: body.contactRelationship?.trim() || null,
        authorize_detention: body.authorizeDetention ?? false,
        language: body.languagePreference ?? 'en',
        language_preference: body.languagePreference ?? 'en',
        ip_address: ip,
        user_agent: userAgent,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('[submit] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save record.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, recordId: data.id });
  } catch (err) {
    console.error('[submit] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
