import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { isCurrentUserAdmin } from '@/lib/supabase/auth';
import UsersList from '../_components/UsersList';

export default async function UsersPage() {
  await connection();

  if (!(await isCurrentUserAdmin())) {
    redirect('/staff');
  }

  return <UsersList />;
}