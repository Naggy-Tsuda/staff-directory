import { connection } from 'next/server';
import StaffList from '../_components/StaffList';
import { isCurrentUserAdmin } from '@/lib/supabase/auth';


export default async function Page() {
  await connection();

  const isAdmin = await isCurrentUserAdmin();

  return <StaffList canEdit={isAdmin} />;;
}