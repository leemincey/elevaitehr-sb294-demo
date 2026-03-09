import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      department,
      signatureBase64,
      contactName,
      contactPhone,
      contactRelationship,
      authorizeDetention,
      languagePreference,
      prospectId,
    } = body;

    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '';
    const userAgent = req.headers.get('user-agent') ?? '';

    const { error } = await supabase.from('employee_records').insert({
      first_name: firstName,
      last_name: lastName,
      employee_name: `${firstName} ${lastName}`,
      employee_email: email,
      department: department ?? '',
      signature_base64: signatureBase64,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_relationship: contactRelationship,
      authorize_detention: authorizeDetention,
      language_preference: languagePreference ?? 'en',
      prospect_id: prospectId ?? '',
      ip_address: ip,
      user_agent: userAgent,
      completed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
