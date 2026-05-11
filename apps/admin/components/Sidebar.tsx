'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/pb/client'
import type { AdminRole } from '@/lib/types'

interface Props {
  adminRole: AdminRole | null
  displayName: string
}

// Nav items shown per role. super_admin sees everything.
const NAV = [
  { href: '/dashboard',            label: 'Overview',   roles: ['super_admin', 'content_manager', 'translator', 'analytics_viewer'] },
  { href: '/dashboard/stories',    label: 'Stories',    roles: ['super_admin', 'content_manager', 'translator'] },
  { href: '/dashboard/shlokas',    label: 'Shlokas',    roles: ['super_admin', 'content_manager', 'translator'] },
  { href: '/dashboard/quizzes',    label: 'Quizzes',    roles: ['super_admin', 'content_manager', 'translator'] },
  { href: '/dashboard/analytics',  label: 'Analytics',  roles: ['super_admin', 'analytics_viewer'] },
  { href: '/dashboard/badges',     label: 'Badges',     roles: ['super_admin'] },
  { href: '/dashboard/users',      label: 'Users',      roles: ['super_admin'] },
]

export default function Sidebar({ adminRole, displayName }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const pb = createClient()

  const visibleNav = NAV.filter(
    (item) => adminRole === 'super_admin' || item.roles.includes(adminRole ?? ''),
  )

  async function signOut() {
    pb.authStore.clear()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col min-h-screen shrink-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <p className="font-bold text-orange-600">Dharma Seekho</p>
        <p className="text-xs text-gray-400 mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visibleNav.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-orange-50 text-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-700 truncate">{displayName}</p>
        <p className="text-xs text-gray-400 capitalize mb-3">
          {adminRole?.replace('_', ' ') ?? ''}
        </p>
        <button
          onClick={signOut}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
