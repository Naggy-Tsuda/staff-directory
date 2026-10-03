'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { sendPasswordResetLink } from './actions';

export default function ForgotPasswordPage() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // avoid multiple submits
    if (isSending) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('origin', window.location.origin);

    setIsSending(true);
    const result = await sendPasswordResetLink(null, formData);
    setIsSending(false);

    setIsSuccess(result?.startsWith('If that email') ?? false);
    setMessage(result);

  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', mt: 4 }}
    >
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        Reset Password
      </Typography>

      <TextField
        label="Email"
        name="email"
        type="email"
        required
      />

      {message && <p style={{ color: isSuccess ? 'green' : 'red' }}>{message}</p>}

      <Button type="submit" variant="contained" disabled={isSending}>
        Send reset link
      </Button>

      <Button variant="outlined" href="/login">
        Back to login
      </Button>
    </Box>
  );
}