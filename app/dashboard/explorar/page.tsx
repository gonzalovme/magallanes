import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, ArrowRight } from 'lucide-react'

const AREA_CONFIG: Record<string, { label: string; accent: string }> = {
  estrategia: { label: 'Estrategia', accent: '#C9A84C' },
  liderazgo: { label: 'Liderazgo', accent: '#7C9EE8' },
  finanzas: { label: 'Finanzas', accent: '#6ECC8E' },
  marketing: { label: 'Marketing', accent: '#E87C9E' },
  operaciones: { label: 'Operaciones', accent: '#B87CE8' },
}

export default async function ExplorarPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="animate-fade-up">
        <p className="text-xs text-chalk-dim/30 tracking-widest uppercase mb-3">Exploración libre</p>
        <h1 className="text-4xl font-light text-chalk mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Elige tu terreno
        </h1>
        <p className="text-chalk-dim/40 text-sm">Sin estructura. Sin día asignado. Solo tú, un dilema y tu criterio.</p>
      </div>
      <div className="animate-fade-up space-y-3" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <p className="text-xs text-chalk-dim/30 tracking-widest uppercase">Selecciona un área</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(AREA_CONFIG).map(([key, config]) => {
            const isUserArea = key === profile.area
            return (
              <button key={key} className={`text-left p-4 rounded-sm border transition-all duration-200 group ${isUserArea ? 'border-white/10 bg-ink-soft/70' : 'border-white/5 bg-ink-soft/30 hover:border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.accent }} />
                    <span className="text-sm text-chalk-dim/70">{config.label}</span>
                    {isUserArea && <span className="text-xs text-chalk-dim/25">(tu área)</span>}
                  </div>
                  <ArrowRight size={12} className="text-chalk-dim/20 group-hover:text-chalk-dim/40 transition-colors" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="animate-fade-up border border-white/5 rounded-sm p-6 text-center" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <BookOpen size={24} className="text-chalk-dim/20 mx-auto mb-3" strokeWidth={1.25} />
        <p className="text-lg font-light text-chalk-dim/50 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Próximamente</p>
        <p className="text-chalk-dim/30 text-xs leading-relaxed max-w-xs mx-auto">La exploración libre con IA se activa en la Sesión 1.3. Por ahora, el Reto de 30 Días ya está listo.</p>
      </div>
    </div>
  )
}
