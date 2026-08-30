import { connection } from 'next/server';
import StaffPage from '../_components/StaffList';

export default async function Page() {
  await connection();

  return <StaffPage />;
}