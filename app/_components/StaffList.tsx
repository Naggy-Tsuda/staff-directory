'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createClient } from '@/lib/supabase/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  avatar_url: string | null;
};

export default function StaffList() {
  // Create supabase instance to use supabase functions
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [rows, setRows] = useState<Staff[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch staff data from Supabase
  const loadStaff = useCallback(async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('id');

    if (!error && data) {
      setRows(data);
    }

  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    loadStaff();
  }, [loadStaff]);

  // Deletes a person but asks first just in case
  async function handleDelete(id: number) {
    // Display confirmation message
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    // Display error if Supabase failed
    if (error) {
      alert(error.message);
      return;
    }

    loadStaff();
  }

  // The columns shown in the table
  const columns: GridColDef[] = [
    {
      field: 'avatar_url',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => (
        <Avatar src={params.row.avatar_url ?? undefined} />
      ),
    },
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'subject', headerName: 'Subject', flex: 1.5 },
    {
      field: 'edit',
      headerName: '',
      width: 120,
      // The edit button for each row
      renderCell: (params) => (
        <Button onClick={() => router.push(`/staff/${params.row.id}/edit`)}
          startIcon={<EditIcon />}>
          Edit
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: '',
      width: 120,
      // The delete buttons for each row
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.row.id)} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Staff
        </Typography>
        <Button variant="contained" onClick={() => router.push('/staff/new')}>
          Add Staff
        </Button>
      </Box>

      {/* Table section */}
      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          showToolbar
        />
      </Paper>
    </Box>
  );
}