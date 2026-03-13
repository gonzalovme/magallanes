'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, LogOut, LayoutDashboard, Flame, BookOpen } from 'lucide-react'

const AREA_ACCENTS: Record<string, string> = {
  estrategia: '#C9A84C',
  liderazgo: '#7C9EE8',
  finanzas: '#6ECC8E',
  marketing: '#E87C9E',
  operaciones: '#B87CE8',
}

interface Props {
  profile: {
    full_name: string
    area: string
    streak_count?: number
    challenge_day?: number
  }
}

export default function DashboardNav({ profile }: Props) {
  const pathname = usePathname()
  const accent = AREA_ACCENTS[profile.area] || '#C9A84C'

  async function handleSignOut() {
    await fetch('/auth/signout', { method: 'POST' })
    window.location.href = '/auth/login'
  }

  const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/dashboard/reto', label: 'Reto 30 Días', icon: Flame },
    { href: '/dashboard/explorar', label: 'Explorar', icon: BookOpen },
  ]

  return (
    <header className="border-b border-white/5 sticky top-0 z-50 bg-ink/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Compass size={20} className="text-gold transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.25} />
          <span className="text-sm tracking-[0.2em] uppercase text-chalk-dim/70 font-light hidden sm:block" style={{ letterSpacing: '0.2em' }}>
            Magallanes
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link key={href} href={href} className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-all duration-200 ${isActive ? 'text-chalk bg-white/5' : 'text-chalk-dim/40 hover:text-chalk-dim/70'}`}>
                <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          {(profile.streak_count ?? 0) > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-gold/10 border border-gold/15">
              <Flame size={11} className="text-gold" />
              <span className="text-xs text-gold/80 font-medium">{profile.streak_count}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-xs text-chalk-dim/40 hidden sm:block capitalize">{profile.area}</span>
          </div>
          <button onClick={handleSignOut} className="text-chalk-dim/25 hover:text-chalk-dim/60 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <div className="md:hidden flex border-t border-white/5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href} className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${isActive ? 'text-chalk' : 'text-chalk-dim/30'}`}>
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px]">{label}</span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}
