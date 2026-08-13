'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Google_Sans_Code } from 'next/font/google'

const MIN_PASSWORD_LENGTH = 8

// Runs when the user clicks 'log in'
export async function login(
  prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (data.password.length < MIN_PASSWORD_LENGTH + 1) {
    return `Password must be greater than ${MIN_PASSWORD_LENGTH} characters`
  }

  // Try to log the user in with their email and password
  const { error } = await supabase.auth.signInWithPassword(data)

  // If something goes wrong, show the error message
  if (error) {
    return error.message
  }

  // They are logged in now, got to the staff page
  revalidatePath('/staff', 'layout')
  redirect('/staff')
}

// Runs when the user clicks 'sign up'
export async function signup(
  prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (data.password.length < MIN_PASSWORD_LENGTH + 1) {
    return `Password must be greater than ${MIN_PASSWORD_LENGTH} characters`
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return error.message
  }

  // All good, send them to the account page
  revalidatePath('/', 'layout')
  redirect('/account')
}