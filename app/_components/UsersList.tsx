'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, MenuItem, Paper, Select, Typography } from '@mui/material';
import { createClient } from '@/lib/supabase/client';

type UserRow = {
  user_id: string;
  email: string;
  role: string;
};

export default function UsersList() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);

    // authorisation lives in the DB function, a non-admin call returns an error
    const { data, error } = await supabase.rpc('get_all_users');

    if (error) {
      alert(error.message);
      return;
    }

    setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    loadUsers();
  }, [loadUsers]);

  async function handleRoleChange(row: UserRow, nextRole: string) {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    const { error } = await supabase.rpc('set_user_role', {
      target_id: row.user_id,
      new_role: nextRole,
    });

    setIsUpdating(false);

    if (error) {
      alert(error.message);
      return;
    }

    loadUsers();
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Users
      </Typography>

      <Paper sx={{ p: 2 }}>
        {rows.map((row) => (
          <Box
            key={row.user_id}
            sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}
          >
            <Typography sx={{ flexGrow: 1 }}>{row.email}</Typography>
            <Select
              value={row.role}
              size="small"
              disabled={isUpdating || row.user_id === currentUserId}
              onChange={(e) => handleRoleChange(row, e.target.value)}
            >
              <MenuItem value="standard_user">Standard User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}