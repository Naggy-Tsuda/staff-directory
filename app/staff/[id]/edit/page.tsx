import StaffForm from '@/app/_components/StaffForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

type EditStaffPageProps = {
  params: Promise<{ id: string }>;
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  await connection();

  const { id } = await params;
  const supabase = await createClient();

  // get staff data from supabase
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', Number(id))
    .single();

  // show 404 if staff member does not exist
  if (error || !data) {
    notFound();
  }

  return <StaffForm mode="edit" editingId={Number(id)} initialStaff={data} />;
}