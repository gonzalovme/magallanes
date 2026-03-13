import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Flame, BookOpen, ArrowRight, Target, Users, DollarSign, TrendingUp, Settings, Trophy } from 'lucide-react'

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

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.onboarding_completed) redirect('/onboarding')

  const { data: completions } = await supabase
    .from('challenge_completions').select('day_number').eq('user_id', user.id).eq('area', profile.area)

  const completedDays = new Set((completions || []).map((c: { day_number: number }) => c.day_number))
  const challengeDay = profile.challenge_day || 0
  const nextDay = Math.min(challengeDay + 1, 30)
  const todayCompleted = completedDays.has(nextDay)

  const { data: todayChallenge } = await supabase
    .from('challenges').select('*').eq('area', profile.area).eq('day_number', nextDay).single()

  const area = AREA_CONFIG[profile.area] || AREA_CONFIG.estrategia
  const firstName = profile.full_name?.split(' ')[0] || user.email?.split('@')[0]
  const streak = profile.streak_count || 0
  const progressPct = (challengeDay / 30) * 100

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <p className="text-xs text-chalk-dim/30 tracking-widest uppercase mb-2">Tu espacio · {area.label}</p>
        <h1 className="text-4xl font-light text-chalk mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Hola, <em style={{ color: area.accent, fontStyle: 'italic' }}>{firstName}</em>
        </h1>
        <p className="text-chalk-dim/40 text-sm">
          {challengeDay === 0 ? 'Tu ruta de 30 días te espera. ¿Empezamos?' : challengeDay === 30 ? '¡Has completado los 30 días!' : `Llevas ${challengeDay} día${challengeDay > 1 ? 's' : ''} de exploración.`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
        <div className="bg-ink-soft/60 border border-white/5 rounded-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Flame size={14} className={streak > 0 ? 'text-gold' : 'text-chalk-dim/20'} />
            <span className={`text-2xl font-light ${streak > 0 ? 'text-chalk' : 'text-chalk-dim/30'}`} style={{ fontFamily: 'var(--font-display)' }}>{streak}</span>
          </div>
          <p className="text-xs text-chalk-dim/30">Racha</p>
          {streak > 0 && !todayCompleted && <p className="text-xs text-gold/50 mt-1">¡Completa hoy!</p>}
        </div>
        <div className="bg-ink-soft/60 border border-white/5 rounded-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl font-light text-chalk" style={{ fontFamily: 'var(--font-display)' }}>{challengeDay}</span>
            <span className="text-chalk-dim/30 text-sm">/30</span>
          </div>
          <p className="text-xs text-chalk-dim/30">Días</p>
        </div>
        <div className="bg-ink-soft/60 border border-white/5 rounded-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Trophy size={14} className="text-chalk-dim/20" />
            <span className="text-2xl font-light text-chalk-dim/50" style={{ fontFamily: 'var(--font-display)' }}>{profile.longest_streak || 0}</span>
          </div>
          <p className="text-xs text-chalk-dim/30">Mejor racha</p>
        </div>
      </div>

      {challengeDay < 30 && (
        <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <p className="text-xs text-chalk-dim/30 tracking-widest uppercase mb-3">{todayCompleted ? '✓ Completado hoy' : 'Ejercicio de hoy'}</p>
          <Link href="/dashboard/reto">
            <div className={`relative overflow-hidden rounded-sm border p-6 transition-all duration-300 group cursor-pointer ${todayCompleted ? 'border-white/5 bg-ink-soft/40' : 'border-white/10 bg-ink-soft/70 hover:border-gold/25'}`}>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1" style={{ backgroundColor: todayCompleted ? 'rgba(255,255,255,0.05)' : area.accent }} />
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs tracking-widest uppercase block mb-2" style={{ color: `${area.accent}80` }}>Día {nextDay}</span>
                  {todayChallenge ? (
                    <>
                      <h2 className="text-xl font-light text-chalk mb-3" style={{ fontFamily: 'var(--font-display)' }}>{todayChallenge.title}</h2>
                      <p className="text-chalk-dim/50 text-sm leading-relaxed line-clamp-2">{todayChallenge.premise}</p>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-chalk-dim/40 italic" style={{ fontFamily: 'var(--font-display)' }}>&ldquo;{todayChallenge.key_question}&rdquo;</p>
                      </div>
                    </>
                  ) : (
                    <h2 className="text-xl font-light text-chalk" style={{ fontFamily: 'var(--font-display)' }}>Tu reto de {area.label} te espera</h2>
                  )}
                </div>
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-1 ${todayCompleted ? 'bg-white/5' : 'bg-gold/10 group-hover:bg-gold/20'}`}>
                  <ArrowRight size={14} className={todayCompleted ? 'text-chalk-dim/20' : 'text-gold'} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-chalk-dim/30 tracking-widest uppercase">Tu ruta de 30 días</p>
          <div className="flex items-center gap-2">
            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, backgroundColor: area.accent }} />
            </div>
            <span className="text-xs text-chalk-dim/30">{challengeDay}/30</span>
          </div>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1
            const isCompleted = completedDays.has(day)
            const isCurrent = day === nextDay && !todayCompleted
            return (
              <div key={day} className={`relative aspect-square rounded-sm flex items-center justify-center transition-all duration-200 ${isCompleted ? 'bg-gold/20 border border-gold/30' : isCurrent ? 'border-2 animate-pulse' : 'bg-white/3 border border-white/5 opacity-40'}`}
                style={{ borderColor: isCurrent ? area.accent : undefined, backgroundColor: isCurrent ? `${area.accent}15` : undefined }}>
                {isCompleted ? <span className="text-gold/70 text-xs">✓</span> : <span className={`text-[10px] font-medium ${isCurrent ? 'text-chalk' : 'text-chalk-dim/20'}`}>{day}</span>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gold/20 border border-gold/30" /><span className="text-xs text-chalk-dim/25">Completado</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border-2" style={{ borderColor: area.accent, backgroundColor: `${area.accent}15` }} /><span className="text-xs text-chalk-dim/25">Hoy</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-white/3 border border-white/5" /><span className="text-xs text-chalk-dim/25">Pendiente</span></div>
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <Link href="/dashboard/explorar">
          <div className="bg-ink-soft/40 border border-white/5 rounded-sm p-5 hover:border-white/10 transition-all duration-300 group flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-white/15 transition-colors">
                <BookOpen size={15} className="text-chalk-dim/40" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-chalk-dim/70 font-medium">Exploración libre</p>
                <p className="text-xs text-chalk-dim/30 mt-0.5">Elige área y dilema. Sin límites.</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-chalk-dim/20 group-hover:text-chalk-dim/40 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
