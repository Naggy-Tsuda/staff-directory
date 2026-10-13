import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { LogoutButton } from './LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/supabase/auth';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

// Top bar runs on server so it can check who is logged in
export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Hide Header if user is not logged in yet
  if (!user) {
    return null;
  }

  const isAdmin = await isCurrentUserAdmin();

  // Display header only if user is logged in
  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Link href={'/staff'} style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <Image src="/logo.png" alt="Logo" width={32} height={24} priority />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'inherit' }}>
                Staff Directory
              </Typography>
            </Link>
            <Stack direction="row" sx={{ mr: 2 }}>
              <Button href="/staff" color="inherit">
                Staff
              </Button>
              {isAdmin && (
                <Button href="/users" color="inherit">
                  Users
                </Button>
              )}
            </Stack>
          </Box>
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box >
  );
}