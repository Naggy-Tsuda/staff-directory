import { createClient } from '@/lib/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims ?? null

  return (
    <div>
      <h1>Account</h1>
      {claims ? <p>Logged in as: {claims.email}</p> : <p>Not logged in</p>}

      <form action="/auth/signout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </div>
  )
}