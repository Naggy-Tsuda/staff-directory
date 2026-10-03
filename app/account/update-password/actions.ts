'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const MIN_PASSWORD_LENGTH = 8;

export async function updatePassword(
  prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient();

  const password = formData.get('password') as string;

  if (password.length < MIN_PASSWORD_LENGTH + 1) {
    return `Password must be greater than ${MIN_PASSWORD_LENGTH} characters`;
  }

  // Update user failed error
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return error.message;
  }

  revalidatePath('/login', 'layout');
  redirect('/login');
}
