'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Flame, CheckCircle, ArrowRight } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  premise: string
  context?: string
  key_question: string
  day_number: number
  area: string
}

interface Area {
  label: string
  accent: string
}

interface Profile {
  id: string
  area: string
  full_name: string
  challenge_day: number
  streak_count: number
  longest_streak: number
  last_completed_date: string | null
}

interface Props {
  profile: Profile
  challenge: Challenge | null
  area: Area
  currentDay: number
  totalDays: number
  completedDays: number[]
  todayCompleted: boolean
  userId: string
}

export default function ChallengeView({ profile, challenge, area, currentDay, completedDays, todayCompleted, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [reflection, setReflection] = useState('')
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(todayCompleted)
  const [showReflection, setShowReflection] = useState(false)

  const completedSet = new Set(completedDays)
  const progressPct = ((profile.challenge_day || 0) / 30) * 100

  async function handleComplete() {
    if (completing || completed) return
    setCompleting(true)

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const lastDate = profile.last_completed_date

    let newStreak = 1
    if (lastDate === yesterday) {
      newStreak = (profile.streak_count || 0) + 1
    } else if (lastDate === today) {
      newStreak = profile.streak_count || 1
    }

    const newLongest = Math.max(newStreak, profile.longest_streak || 0)

    await supabase.from('challenge_completions').upsert({
      user_id: userId,
      day_number: currentDay,
      area: profile.area,
      reflection: reflection || null,
      completed_at: new Date().toISOString(),
    })

    await supabase.from('profiles').update({
      challenge_day: currentDay,
      streak_count: newStreak,
      longest_streak: newLongest,
      last_completed_date: today,
      updated_at: new Date().toISOString(),
    }).eq('id', userId)

    setCompleted(true)
    setCompleting(false)
    setTimeout(() => router.refresh(), 1500)
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-light text-chalk mb-3" style={{ fontFamily: 'var(--font-display)' }}>Reto no disponible</h2>
        <p className="text-chalk-dim/40 text-sm max-w-xs">El ejercicio del día {currentDay} aún no está disponible.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-widest uppercase" style={{ color: `${area.accent}70` }}>Día {currentDay} de 30</span>
            {completed && (
              <span className="flex items-center gap-1 text-xs text-gold/60 bg-gold/10 px-2 py-0.5 rounded-sm border border-gold/15">
                <CheckCircle size={10} className="text-gold/60" /> Completado
              </span>
            )}
          </div>
          {(profile.streak_count || 0) > 0 && (
            <div className="flex items-center gap-1">
              <Flame size={12} className="text-gold" />
              <span className="text-xs text-gold/70">{profile.streak_count}</span>
            </div>
          )}
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, backgroundColor: area.accent }} />
        </div>
      </div>

      <div className="bg-ink-soft/70 border border-white/8 rounded-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <div className="h-0.5 w-full" style={{ backgroundColor: area.accent }} />
        <div className="p-8">
          <h1 className="text-3xl font-light text-chalk mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{challenge.title}</h1>
          <div className="mb-6">
            <p className="text-xs text-chalk-dim/30 tracking-widest uppercase mb-3">El escenario</p>
            <p className="text-chalk-dim/70 text-sm leading-relaxed">{challenge.premise}</p>
            {challenge.context && (
              <p className="text-chalk-dim/50 text-sm leading-relaxed mt-3 border-l-2 border-white/10 pl-4">{challenge.context}</p>
            )}
          </div>
          <div className="rounded-sm p-5 border" style={{ backgroundColor: `${area.accent}08`, borderColor: `${area.accent}20` }}>
            <p className="text-xs text-chalk-dim/30 tracking-widest uppercase mb-3">La pregunta central</p>
            <p className="text-lg font-light text-chalk leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>{challenge.key_question}</p>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          {!showReflection ? (
            <button onClick={() => setShowReflection(true)} className="w-full text-left bg-ink-soft/40 border border-white/5 rounded-sm p-4 hover:border-white/10 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-chalk-dim/60 mb-0.5">Añadir reflexión <span className="text-chalk-dim/25">(opcional)</span></p>
                  <p className="text-xs text-chalk-dim/30">¿Cuál es tu posición? ¿Qué argumentos te resultan más sólidos?</p>
                </div>
                <ArrowRight size={14} className="text-chalk-dim/20 group-hover:text-chalk-dim/40 transition-colors" />
              </div>
            </button>
          ) : (
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="¿Cuál es tu posición ante este dilema? ¿Qué argumentos te resultan más sólidos?"
              rows={5}
              className="input-gold resize-none text-sm leading-relaxed w-full"
            />
          )}
          <button onClick={handleComplete} disabled={completing} className="btn-primary mt-4 flex items-center justify-center gap-2">
            {completing ? (
              <><span className="w-4 h-4 border border-ink/30 border-t-ink rounded-full animate-spin" />Guardando...</>
            ) : (
              <><CheckCircle size={16} />Marcar como completado</>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-fade-up text-center py-8" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="w-14 h-14 rounded-sm flex items-center justify-center mx-auto mb-4 border" style={{ backgroundColor: `${area.accent}15`, borderColor: `${area.accent}30` }}>
            <CheckCircle size={24} style={{ color: area.accent }} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-light text-chalk mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {currentDay < 30 ? `Día ${currentDay} completado` : '¡30 días. Lo has logrado.'}
          </h3>
          <p className="text-chalk-dim/40 text-sm mb-6">
            {currentDay < 30 ? `Vuelve mañana para el día ${currentDay + 1}.` : 'Has completado la ruta de 30 días.'}
          </p>
          {(profile.streak_count || 0) > 1 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-gold/10 border border-gold/20">
              <Flame size={14} className="text-gold" />
              <span className="text-sm text-gold/80">{profile.streak_count} días de racha</span>
            </div>
          )}
        </div>
      )}

      <div className="animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <p className="text-xs text-chalk-dim/25 tracking-widest uppercase mb-3">Tu ruta</p>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1
            const isCompleted = completedSet.has(day)
            const isCurrent = day === currentDay
            return (
              <div key={day} className={`aspect-square rounded-sm transition-all duration-200 ${isCompleted ? 'bg-gold/25 border border-gold/30' : isCurrent ? 'border-2' : 'bg-white/3 border border-white/5 opacity-30'}`}
                style={{ borderColor: isCurrent ? area.accent : undefined, backgroundColor: isCurrent && !isCompleted ? `${area.accent}15` : undefined }} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
