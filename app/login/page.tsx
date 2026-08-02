'use client'

import { Box, Button, TextField } from "@mui/material";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <>
      <h1 style={{ textAlign: "center", fontSize: "32px" }}>
        Login Form
      </h1>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', mt: 4 }}
      >
        <TextField
          label="Email"
          name="email" // Required for Server Actions to read the value
          type="email"
          required
        />
        <TextField
          label="Password"
          name="password" // Required for Server Actions to read the value
          type="password"
          required
        />

        <Button formAction={login} type="submit" variant="contained">
          Login
        </Button>

        <Button formAction={signup} type="submit" variant="outlined">
          Sign Up
        </Button>
      </Box>
    </>
  )
}