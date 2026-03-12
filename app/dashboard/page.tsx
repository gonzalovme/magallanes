import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Compass, Target, Users, DollarSign, TrendingUp, Settings, LogOut, Flame, BookOpen } from 'lucide-react'

const AREA_CONFIG: Record<string, { label: string; icon: typeof Target; accent: string }> = {
  estrategia: { label: 'Estrategia', icon: Target, accent: '#C9A84C' },
  liderazgo: { label: 'Liderazgo', icon: Users, accent: '#7C9EE8' },
  finanzas: { label: 'Finanzas', icon: DollarSign, accent: '#6ECC8E' },
  marketing: { label: 'Marketing', icon: TrendingUp, accent: '#E87C9E' },
  operaciones: { label: 'Operaciones', icon: Settings, accent: '#B87CE8' },
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  const area = AREA_CONFIG[profile.area] || AREA_CONFIG.estrategia
  const firstName = profile.full_name?.split(' ')[0] || user.email?.split('@')[0]

  return (
    <main className="min-h-screen gradient-mesh">
      {/* Decorative lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass size={22} className="text-gold" strokeWidth={1.25} />
            <span
              className="text-sm tracking-[0.2em] uppercase text-chalk-dim/80 font-light"
              style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.2em' }}
            >
              Magallanes
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: area.accent }}
              />
              <span className="text-xs text-chalk-dim/50 hidden sm:block">{area.label}</span>
            </div>

            <form action="/auth/signout" method="post">
              <button
                formAction={async () => {
                  'use server'
                  const supabaseServer = createClient()
                  await supabaseServer.auth.signOut()
                  redirect('/auth/login')
                }}
                className="text-chalk-dim/30 hover:text-chalk-dim transition-colors"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12 animate-fade-up">
          <p className="text-xs text-chalk-dim/40 tracking-widest uppercase mb-3">
            Tu espacio · {area.label}
          </p>
          <h1
            className="text-4xl font-light text-chalk mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Hola, <em className="text-gold-gradient">{firstName}</em>
          </h1>
          <p className="text-chalk-dim/50 text-sm max-w-md leading-relaxed">
            Tu exploración intelectual continúa aquí. Elige un camino para comenzar.
          </p>
        </div>

        {/* Main CTAs */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-fade-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          {/* Reto 30 días */}
          <div className="bg-ink-soft/80 border border-white/5 rounded-sm p-6 hover:border-gold/20 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Flame size={18} className="text-gold" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-chalk-dim/30 tracking-widest">DÍA 1</span>
            </div>
            <h3
              className="text-lg font-light text-chalk mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Reto 30 Días
            </h3>
            <p className="text-chalk-dim/40 text-xs leading-relaxed mb-6">
              Un ejercicio diario de pensamiento crítico. Cada día, un nuevo reto de {area.label.toLowerCase()}.
            </p>
            <div className="w-full h-px bg-white/5 mb-4" />
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gold rounded-full" />
              </div>
              <span className="text-xs text-chalk-dim/30">0/30</span>
            </div>
          </div>

          {/* Exploración libre */}
          <div className="bg-ink-soft/80 border border-white/5 rounded-sm p-6 hover:border-white/15 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                <BookOpen size={18} className="text-chalk-dim/50" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-chalk-dim/30 tracking-widest">LIBRE</span>
            </div>
            <h3
              className="text-lg font-light text-chalk mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Exploración libre
            </h3>
            <p className="text-chalk-dim/40 text-xs leading-relaxed mb-6">
              Elige cualquier área, cualquier dilema. El pensamiento sin fronteras.
            </p>
            <div className="w-full h-px bg-white/5 mb-4" />
            <p className="text-xs text-chalk-dim/25 italic" style={{ fontFamily: 'var(--font-display)' }}>
              "El mapa no es el territorio"
            </p>
          </div>
        </div>

        {/* Areas */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <p className="text-xs text-chalk-dim/30 tracking-widest uppercase mb-4">Todas las áreas</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AREA_CONFIG).map(([key, config]) => {
              const Icon = config.icon
              const isActive = key === profile.area
              return (
                <button
                  key={key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs transition-all duration-200
                    ${isActive
                      ? 'border-white/10 bg-ink-muted text-chalk-dim'
                      : 'border-white/5 bg-ink-soft/30 text-chalk-dim/40 hover:text-chalk-dim/60 hover:border-white/10'
                    }`}
                >
                  <Icon size={12} strokeWidth={1.5} style={{ color: isActive ? config.accent : undefined }} />
                  {config.label}
                  {isActive && (
                    <span className="text-xs opacity-50">(tu área)</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
