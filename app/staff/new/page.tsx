import StaffForm from '@/app/_components/StaffForm';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { isCurrentUserAdmin } from '@/lib/supabase/auth';

export default async function NewStaffPage() {
  await connection();

  if (!(await isCurrentUserAdmin())) {
    redirect('/staff');
  }

  return <StaffForm mode="new" />;
}