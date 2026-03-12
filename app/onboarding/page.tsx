'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Compass, TrendingUp, Users, DollarSign, Target, Settings, ArrowRight, ChevronRight } from 'lucide-react'

const AREAS = [
  {
    id: 'estrategia',
    label: 'Estrategia',
    description: 'Ventaja competitiva, posicionamiento y decisiones de largo plazo',
    icon: Target,
    accent: '#C9A84C',
  },
  {
    id: 'liderazgo',
    label: 'Liderazgo',
    description: 'Gestión de equipos, cultura organizacional y desarrollo del talento',
    icon: Users,
    accent: '#7C9EE8',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    description: 'Análisis financiero, valoración y toma de decisiones con datos',
    icon: DollarSign,
    accent: '#6ECC8E',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Posicionamiento de marca, crecimiento y comportamiento del consumidor',
    icon: TrendingUp,
    accent: '#E87C9E',
  },
  {
    id: 'operaciones',
    label: 'Operaciones',
    description: 'Eficiencia de procesos, cadena de valor y excelencia operativa',
    icon: Settings,
    accent: '#B87CE8',
  },
]

type Step = 'welcome' | 'area' | 'ready'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('welcome')
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'explorador'
        setUserName(name.split(' ')[0])
      }
    }
    getUser()
  }, [])

  async function handleComplete() {
    if (!selectedArea) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        area: selectedArea,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen gradient-mesh flex items-center justify-center px-4 py-12">
      {/* Decorative lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      </div>

      <div className="w-full max-w-lg relative">

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div className="text-center animate-fade-up">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute w-24 h-24 rounded-full bg-gold/5 blur-2xl" />
              <Compass size={48} className="text-gold relative" strokeWidth={1} />
            </div>

            <h1
              className="text-5xl font-light text-chalk mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Bienvenido,<br />
              <em className="text-gold-gradient">{userName}</em>
            </h1>

            <p className="text-chalk-dim/60 text-sm leading-relaxed mb-3 max-w-sm mx-auto">
              Magallanes es tu espacio para pensar con rigor, cuestionar con profundidad
              y decidir con criterio.
            </p>
            <p className="text-chalk-dim/40 text-xs mb-12 max-w-xs mx-auto">
              Como el navegante que trazó nuevas rutas, aquí explorarás territorios
              que pocos se atreven a cartografiar.
            </p>

            <button
              onClick={() => setStep('area')}
              className="inline-flex items-center gap-3 bg-gold text-ink font-medium py-3 px-8 rounded-sm
                hover:bg-gold-light transition-all duration-300 text-sm tracking-wide"
            >
              Comenzar exploración
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step: Area Selection */}
        {step === 'area' && (
          <div className="animate-fade-up">
            <div className="text-center mb-10">
              <p className="text-xs text-gold/60 tracking-widest uppercase mb-3">Paso 1 de 1</p>
              <h2
                className="text-3xl font-light text-chalk mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Elige tu área principal
              </h2>
              <p className="text-chalk-dim/50 text-xs">
                Esto personalizará tu experiencia. Podrás explorar otras áreas libremente.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {AREAS.map((area) => {
                const Icon = area.icon
                const isSelected = selectedArea === area.id

                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`w-full text-left p-4 rounded-sm border transition-all duration-300 group
                      ${isSelected
                        ? 'bg-ink-muted border-gold/30'
                        : 'bg-ink-soft/50 border-white/5 hover:border-white/15 hover:bg-ink-muted/50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-300`}
                        style={{
                          backgroundColor: isSelected ? `${area.accent}20` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isSelected ? `${area.accent}40` : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <Icon
                          size={16}
                          style={{ color: isSelected ? area.accent : '#C8C6BE60' }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium transition-colors ${isSelected ? 'text-chalk' : 'text-chalk-dim'}`}
                          >
                            {area.label}
                          </span>
                          {isSelected && (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: area.accent }}
                            />
                          )}
                        </div>
                        <p className="text-xs text-chalk-dim/40 mt-0.5 leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`flex-shrink-0 transition-all duration-300 ${isSelected ? 'text-gold opacity-100' : 'text-chalk-dim/20 opacity-0 group-hover:opacity-100'}`}
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleComplete}
              disabled={!selectedArea || loading}
              className="btn-primary"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border border-ink/30 border-t-ink rounded-full animate-spin" />
                  Preparando tu espacio...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Entrar a Magallanes
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
