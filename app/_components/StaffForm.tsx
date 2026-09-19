'use client';

import { useMemo, useState } from 'react';
import { Avatar, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const MAX_NAME_LENGTH = 20;

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  avatar_url: string | null;
};

type StaffFormProps = {
  mode: 'new' | 'edit';
  editingId?: number;
  initialStaff?: Staff | null
}

export default function StaffForm({
  mode,
  editingId,
  initialStaff,
}: StaffFormProps) {
  // Create supabase instance to use supabase functions
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(initialStaff?.first_name ?? '');
  const [lastName, setLastName] = useState(initialStaff?.last_name ?? '');
  const [email, setEmail] = useState(initialStaff?.email ?? '');
  const [subject, setSubject] = useState(initialStaff?.subject ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialStaff?.avatar_url ?? '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Checks if form is filled in right, returns errors
  function validateForm() {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (firstName.length > MAX_NAME_LENGTH) {
      errors.firstName = `First name must be ${MAX_NAME_LENGTH} characters or less`;
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (lastName.length > MAX_NAME_LENGTH) {
      errors.lastName = `Last name must be ${MAX_NAME_LENGTH} characters or less`;
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email adress';
    }

    if (!subject.trim()) {
      errors.subject = 'Subject is required';
    }

    return errors;
  }

  // When the user types save it and hide that box's error message
  function handleFieldChange(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    field: string,
  ) {
    setter(value);
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
  }

  // Add a new person or updates the person we are editing
  async function saveStaff() {
    // Stops us if we are already editing (so no double clicks)
    if (isSaving) {
      return;
    }

    // If the form is wrong, show the errors and stop
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      let newAvatarUrl = initialStaff?.avatar_url ?? null;

      if (avatarFile) {
        const path = `${Date.now()}-${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile);

        if (uploadError) {
          alert(uploadError.message);
          return;
        }

        newAvatarUrl = supabase.storage
          .from('avatars')
          .getPublicUrl(path)
          .data.publicUrl;
      }

      // No editingId means we are adding a brand new person
      if (mode === 'new') {
        const { error } = await supabase.from('staff').insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          subject: subject,
          avatar_url: newAvatarUrl,
        });

        if (error) {
          alert(error.message);
          return;
        }
      } else {
        // editingId is set, so we update that person instead
        const { error } = await supabase
          .from('staff')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            subject: subject,
            avatar_url: newAvatarUrl,
          })
          .eq('id', editingId);

        if (error) {
          alert(error.message);
          return;
        }
      }

      // Refresh the table so we can see the new/ updated person
      router.push('/staff');
      router.refresh();
    } catch {
      alert('Something went wrong.');
    } finally {
      // Always let the button be clickable again
      setIsSaving(false);
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {mode === 'new' ? 'Add Staff' : 'Edit Staff'}
      </Typography>

      {/* Form section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={avatarPreview || undefined} sx={{ width: 64, height: 64 }} />
            <Button component='label' variant='outlined'>
              Choose Avatar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
          </Box>

          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => handleFieldChange(setFirstName, e.target.value, 'firstName')}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange(setLastName, e.target.value, 'lastName')}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => handleFieldChange(setEmail, e.target.value, 'email')}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => handleFieldChange(setSubject, e.target.value, 'subject')}
            error={!!formErrors.subject}
            helperText={formErrors.subject}
          />

          <Button variant="contained" onClick={saveStaff}>
            {mode === 'new' ? 'Add Staff' : 'Update Staff'}
          </Button>

          <Button variant="outlined" onClick={() => router.push('/staff')}>
            Back to list
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}