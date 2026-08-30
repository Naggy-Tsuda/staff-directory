import StaffForm from '@/app/_components/StaffForm';
import { connection } from 'next/server';

export default async function NewStaffPage() {
  await connection();

  return <StaffForm mode="new" />;
}