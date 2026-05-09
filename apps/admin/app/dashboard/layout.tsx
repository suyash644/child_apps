import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, admin_role, admin_role_langs')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen">
      <Sidebar
        adminRole={profile?.admin_role ?? null}
        displayName={profile?.display_name ?? user.id.slice(0, 8)}
      />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
