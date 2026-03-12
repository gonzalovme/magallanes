'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Compass } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos. Verifica tus datos.')
      setLoading(false)
      return
    }

    // Check onboarding status
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_completed) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <main className="min-h-screen gradient-mesh flex items-center justify-center px-4">
      {/* Decorative lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/3 to-transparent" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <Compass
                size={32}
                className="text-gold"
                strokeWidth={1.25}
              />
              <div className="absolute inset-0 blur-xl bg-gold/20 rounded-full" />
            </div>
            <span
              className="text-2xl tracking-[0.2em] uppercase text-chalk-dim font-light"
              style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.25em' }}
            >
              Magallanes
            </span>
          </div>
          <p className="text-chalk-dim/60 text-xs tracking-widest uppercase">
            IBS · Pensamiento Crítico
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-ink-soft/80 backdrop-blur-sm border border-white/5 rounded-sm p-8 animate-fade-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          <h1
            className="text-2xl font-light text-chalk mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Bienvenido de vuelta
          </h1>
          <p className="text-chalk-dim/50 text-xs mb-8 tracking-wide">
            Continúa tu exploración
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-chalk-dim/60 mb-2 tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-chalk-dim/60 mb-2 tracking-widest uppercase">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-gold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-chalk-dim/40 hover:text-chalk-dim transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-sm px-3 py-2">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border border-ink/30 border-t-ink rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-chalk-dim/40">
              ¿Primera vez?{' '}
              <Link
                href="/auth/register"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-chalk-dim/20 mt-8 tracking-widest">
          IBS · 2025
        </p>
      </div>
    </main>
  )
}
