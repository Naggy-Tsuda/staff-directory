import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { LogoutButton } from './LogoutButton';
import { createClient } from '@/lib/supabase/server';

// Top bar runs on server so it can check who is logged in
export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Hide Header if user is not logged in yet
  if (!user) {
    return null;
  }

  // Display header only if user is logged in
  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Image src="/logo.png" alt="Logo" width={32} height={24} priority />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Staff Directory
            </Typography>
          </Box>
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}