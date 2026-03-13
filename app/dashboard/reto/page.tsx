import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Target, Users, DollarSign, TrendingUp, Settings } from 'lucide-react'
import ChallengeView from '@/components/ChallengeView'

const AREA_CONFIG: Record<string, { label: string; icon: typeof Target; accent: string }> = {
  estrategia: { label: 'Estrategia', icon: Target, accent: '#C9A84C' },
  liderazgo: { label: 'Liderazgo', icon: Users, accent: '#7C9EE8' },
  finanzas: { label: 'Finanzas', icon: DollarSign, accent: '#6ECC8E' },
  marketing: { label: 'Marketing', icon: TrendingUp, accent: '#E87C9E' },
  operaciones: { label: 'Operaciones', icon: Settings, accent: '#B87CE8' },
}

export default async function RetoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  const { data: completions } = await supabase
    .from('challenge_completions')
    .select('day_number, completed_at, reflection')
    .eq('user_id', user.id)
    .eq('area', profile.area)
    .order('day_number', { ascending: true })

  const completedDays = new Set((completions || []).map((c: { day_number: number }) => c.day_number))
  const challengeDay = profile.challenge_day || 0
  const nextDay = Math.min(challengeDay + 1, 30)
  const todayCompleted = completedDays.has(nextDay)

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('area', profile.area)
    .eq('day_number', nextDay)
    .single()

  const area = AREA_CONFIG[profile.area] || AREA_CONFIG.estrategia

  return (
    <ChallengeView
      profile={profile}
      challenge={challenge}
      area={area}
      currentDay={nextDay}
      totalDays={30}
      completedDays={Array.from(completedDays) as number[]}
      todayCompleted={todayCompleted}
      userId={user.id}
    />
  )
}
