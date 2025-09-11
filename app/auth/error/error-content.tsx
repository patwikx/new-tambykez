"use client"

import { useSearchParams } from "next/navigation"
import { Typography, Alert } from "@mui/material"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
  AccountDeactivated: "Your account has been deactivated. Please contact support.",
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
}

export default function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"

  const message = errorMessages[error] || errorMessages.Default

  return (
    <>
      <Alert
        severity="error"
        sx={{
          mb: 4,
          bgcolor: "#B71C1C",
          color: "white",
          "& .MuiAlert-icon": {
            color: "white",
          },
        }}
      >
        {message}
      </Alert>

      <Typography variant="body2" sx={{ color: "#999", mb: 4 }}>
        If this problem persists, please contact our support team.
      </Typography>
    </>
  )
}
