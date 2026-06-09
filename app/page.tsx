import { TOOLS } from '@/lib/tools'
import { UI } from '@/lib/theme'
import { getSessionUser } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/access'

const ACCENT = '#C15A35' // Fahrenheit One terracotta

export const dynamic = 'force-dynamic'

export default async function Landing() {
  const session = await getSessionUser()
  const owner = session ? isSuperAdmin(session) : false

  const link: React.CSSProperties = { fontSize: 13, color: UI.textMuted, textDecoration: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: UI.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Account bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, padding: '16px 28px' }}>
        {session ? (
          <>
            <span style={{ fontSize: 13, color: UI.text }}>{session.email}</span>
            {owner && <a href="/admin" style={{ ...link, color: ACCENT, fontWeight: 600 }}>Team Access</a>}
            <a href="/logout" style={link}>Sign out</a>
          </>
        ) : (
          <a href="/login" style={{ ...link, color: ACCENT, fontWeight: 600 }}>Sign in →</a>
        )}
      </div>

      {/* Hero */}
      <header style={{ textAlign: 'center', padding: '60px 24px 56px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fahrenheit-one-logo.png" alt="Fahrenheit One" style={{ height: 64, width: 'auto', margin: '0 auto' }} />
        <div style={{ marginTop: 16, fontSize: 12, letterSpacing: '0.32em', textTransform: 'uppercase', color: UI.textFaint }}>
          Technology Suite
        </div>
        <h1 style={{ marginTop: 28, fontSize: 34, fontWeight: 600, color: UI.text, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Operational technology,<br />built in-house.
        </h1>
        <p style={{ marginTop: 16, fontSize: 16, color: UI.textMuted, maxWidth: 560, margin: '16px auto 0', lineHeight: 1.6 }}>
          A suite of tools powering Fahrenheit One @ Hakoah White City — from pre-opening
          sales intelligence to day-to-day mission control.
        </p>
      </header>

      {/* Tool grid */}
      <main style={{ flex: 1, width: '100%', maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {TOOLS.map(tool => (
            <div key={tool.key} style={{
              background: UI.surface, border: `1px solid ${UI.border}`, borderRadius: UI.radius,
              boxShadow: UI.shadow, padding: 28, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ height: 3, width: 40, background: ACCENT, borderRadius: 2, marginBottom: 18 }} />
              <div style={{ fontSize: 19, fontWeight: 600, color: UI.text }}>{tool.name}</div>
              <p style={{ marginTop: 10, fontSize: 14, color: UI.textMuted, lineHeight: 1.6, flex: 1 }}>{tool.description}</p>
              <div style={{ marginTop: 22 }}>
                {tool.live ? (
                  <a href={tool.url} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                    background: UI.text, color: '#fff', borderRadius: UI.radiusSm, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  }}>Open →</a>
                ) : (
                  <span style={{
                    display: 'inline-flex', padding: '10px 18px', background: UI.surfaceAlt,
                    color: UI.textFaint, border: `1px solid ${UI.border}`, borderRadius: UI.radiusSm, fontSize: 14, fontWeight: 500,
                  }}>Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${UI.border}`, padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: UI.textFaint, letterSpacing: '0.1em' }}>
          FAHRENHEIT ONE · CLUB F1 TECH
        </div>
      </footer>
    </div>
  )
}
