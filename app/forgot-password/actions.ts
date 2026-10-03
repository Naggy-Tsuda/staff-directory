'use server';

import { createClient } from '@/lib/supabase/server';

export async function sendPasswordResetLink(
  prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient();

  const email = String(formData.get('email') ?? '').trim();
  // origin is base URL of app (e.g. http://localhost:3000 part before path in URL)
  const origin = String(formData.get('origin') ?? '');

  if (!email) {
    return 'Email is required';
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/account/update-password`,
  });

  if (error) {
    return error.message;
  }

  // display UI after sending reset email
  return 'If that email is registered, a reset link has been sent';
}