'use client'

import { useActionState } from "react";
import { Box, Button, Paper, TextField } from "@mui/material";
import { login, signup } from "./actions";

const initialState: string | null = null;

export default function LoginPage() {
  // useActionState gives us the result of the server action and if it's pending
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
      {/* Show the error message if login/ signup failed */}
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', mt: 4 }}
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
        />
        {/* Error when login failed */}
        {loginState && <p style={{ color: 'red ' }}>{loginState}</p>}
        {/* Error when signup failed */}
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