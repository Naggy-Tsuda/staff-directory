import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { LogoutButton } from "./LogoutButton"
import { createClient } from "@/lib/supabase/server"


export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Hide Header if user is not logged in yet
  if (!user) {
    return null
  }

  // Display header only if user is logged in
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Staff Directory
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  )
}