'use client';

import { useActionState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { updatePassword } from './actions';

const initialState: string | null = null;

export default function UpdatePasswordPage() {
  const [state, fromAction, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <Box
      component="form"
      action={fromAction}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', mt: 4 }}
    >
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        Set a new password
      </Typography>

      {state && <p style={{ color: 'red' }}>{state}</p>}

      <TextField
        label="New password"
        name="password"
        type="password"
        required
      />

      <Button type="submit" variant="contained" disabled={pending}>
        Update password
      </Button>
    </Box>
  );
}