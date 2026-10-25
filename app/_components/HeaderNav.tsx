'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { usePathname } from 'next/navigation';

type Props = {
  isAdmin: boolean
}

export default function HeaderNav({ isAdmin }: Props) {
  const pathName = usePathname();

  const isStaffActive = pathName.startsWith('/staff');
  const isUserActive = pathName.startsWith('/users');

  return (
    <Stack direction="row" sx={{ mr: 2 }}>
      <Button href="/staff" color="inherit"
        sx={{
          borderBottom: isStaffActive ? 2 : 0,
          borderRadius: 0,
          color: theme => isStaffActive ? theme.palette.secondary.main : 'inherit'
        }}>
        Staff
      </Button>

      {isAdmin && (
        <Button href="/users" color="inherit"
          sx={{
            borderBottom: isUserActive ? 2 : 0,
            borderRadius: 0,
            color: theme => isUserActive ? theme.palette.secondary.main : 'inherit'
          }}>
          Users
        </Button>
      )}
    </Stack>
  );
}