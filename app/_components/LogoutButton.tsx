'use client'

import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const supabase = createClient()
  async function onLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return <button onClick={onLogout}>Log out</button>
}