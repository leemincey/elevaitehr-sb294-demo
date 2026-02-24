import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('employee_records')
      .insert([
        {
          first_name: body.firstName,
          last_name: body.lastName,
          employee_name: `${body.firstName} ${body.lastName}`.trim(),
          employee_email: body.email,
          department: body.department,
          signature_base64: body.signatureBase64,
          contact_name: body.contactName,
          contact_phone: body.contactPhone,
          contact_relationship: body.contactRelationship,
          authorize_detention: body.authorizeDetention,
          language: body.languagePreference ?? 'en',
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
