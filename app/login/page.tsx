'use client'

import { useActionState } from "react";
import { Box, Button, Paper, TextField } from "@mui/material";
import { login, signup } from "./actions";

const initialState: string | null = null;

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(
    login,
    initialState,
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signup,
    initialState,
  );

  return (
    <Paper sx={{ width: 400, p: 8, mx: "auto", mt: 4 }}>
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
        {loginState && <p style={{ color: 'red ' }}>{loginState}</p>}
        {signupState && <p style={{ color: 'red ' }}>{signupState}</p>}
        <br />
        <Button formAction={loginAction} type="submit" variant="contained" disabled={loginPending}>
          Login
        </Button>
        <Button formAction={signupAction} type="submit" variant="outlined" disabled={signupPending}>
          Sign Up
        </Button>
      </Box>
    </Paper>
  )
}