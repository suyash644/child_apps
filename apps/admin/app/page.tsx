import { redirect } from 'next/navigation'

// Root → middleware handles auth; this just covers the bare / route
export default function RootPage() {
  redirect('/dashboard')
}
