import { createClient } from '@/lib/pb/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import type { AdminRole } from '@/lib/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pb = createClient()
  if (!pb.authStore.isValid) redirect('/login')

  const user = pb.authStore.model as Record<string, unknown> | null
  const adminRole = (user?.admin_role as AdminRole) ?? null
  const displayName = (user?.name as string) || (user?.email as string) || 'Admin'

  return (
    <div className="flex min-h-screen">
      <Sidebar adminRole={adminRole} displayName={displayName} />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
