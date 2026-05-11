import { Redirect } from 'expo-router'

// Phone OTP flow removed — login is now email/password on the login screen.
export default function VerifyScreen() {
  return <Redirect href="/(auth)/login" />
}
