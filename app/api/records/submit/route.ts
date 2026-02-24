import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      employeeName,
      employeeEmail,
      signatureBase64,
      contactName,
      contactPhone,
      contactRelationship,
      authorizeDetention,
      language,
    } = body;

    // Basic server-side validation
    if (!employeeName?.trim()) {
      return NextResponse.json(
        { error: 'Employee name is required.' },
        { status: 400 }
      );
    }

    if (!signatureBase64) {
      return NextResponse.json(
        { error: 'Signature is required.' },
        { status: 400 }
      );
    }

    // Grab request metadata
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      null;
    const userAgent = req.headers.get('user-agent') ?? null;

    const db = supabaseAdmin();

    const { data, error } = await db
      .from('employee_records')
      .insert({
        employee_name: employeeName.trim(),
        employee_email: employeeEmail?.trim() || null,
        signature_base64: signatureBase64,
        contact_name: contactName?.trim() || null,
        contact_phone: contactPhone?.trim() || null,
        contact_relationship: contactRelationship?.trim() || null,
        authorize_detention: authorizeDetention ?? false,
        language: language ?? 'en',
        ip_address: ip,
        user_agent: userAgent,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('[submit] Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save record. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, recordId: data.id });
  } catch (err) {
    console.error('[submit] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}