'use client'
import { useState, useTransition, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../auth-actions'
import { UI } from '@/lib/theme'

const ACCENT = '#C15A35'

// Only redirect to the apex or a *.clubf1.tech subdomain (prevents open redirect).
function safeRedirect(raw: string | null): string | null {
  if (!raw) return null
  if (raw.startsWith('/')) return raw // relative path on the hub
  try {
    const u = new URL(raw)
    if (u.hostname === 'clubf1.tech' || u.hostname.endsWith('.clubf1.tech')) return u.toString()
  } catch { /* not a URL */ }
  return null
}

export default function LoginPage() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await login(email, password)
      if (!res.ok) { setError(res.error); return }
      const next = safeRedirect(new URLSearchParams(window.location.search).get('next'))
      // No explicit destination → owners go to Team Access, others to the hub.
      const target = next ?? (res.owner ? '/admin' : '/')
      if (target.startsWith('http')) window.location.assign(target)
      else { router.replace(target); router.refresh() }
    })
  }

  const inputStyle: CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: 15,
    background: UI.surface, border: `1px solid ${UI.borderStrong}`,
    borderRadius: UI.radiusSm, color: UI.text, outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: UI.bg, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: UI.surface, borderRadius: UI.radius, border: `1px solid ${UI.border}`, boxShadow: UI.shadow, padding: '40px 36px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fahrenheit-one-logo.png" alt="Fahrenheit One" style={{ height: 38, width: 'auto', display: 'block', margin: '0 auto 8px' }} />
        <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.22em', color: UI.textFaint, textTransform: 'uppercase', marginBottom: 32 }}>
          Club F1 Tech
        </div>

        <form onSubmit={submit}>
          <label style={{ display: 'block', fontSize: 12, color: UI.textMuted, marginBottom: 6 }}>Email</label>
          <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@fahrenheitone.com" style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ display: 'block', fontSize: 12, color: UI.textMuted, marginBottom: 6 }}>Password</label>
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" style={inputStyle} />

          {error && (
            <div style={{ marginTop: 16, padding: '10px 12px', background: '#FFF1EF', border: `1px solid ${ACCENT}`, borderRadius: UI.radiusSm, fontSize: 13, color: '#8B3A2E' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={pending}
            style={{ width: '100%', marginTop: 24, padding: '12px', fontSize: 15, fontWeight: 600, background: pending ? '#A8482380' : UI.text, color: '#fff', border: 'none', borderRadius: UI.radiusSm, cursor: pending ? 'default' : 'pointer' }}>
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
