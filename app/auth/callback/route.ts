import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  // code is one-time redemption code supabase include in reset email link
  const code = searchParams.get('code');
  // next is destination page to redirect after code is exchanged
  const next = searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Password reset code exchange failed', error.message);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}