import { TOOLS } from '@/lib/tools'
import { UI } from '@/lib/theme'
import { getSessionUser } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

export default async function Landing() {
  const session = await getSessionUser()
  const owner = session ? isSuperAdmin(session) : false

  // Account links sit on the plum hero band, so they wear on-plum text.
  const link: React.CSSProperties = { fontSize: 13, color: UI.onPlumMuted, textDecoration: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: UI.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Plum hero band — the same glow gradient the marketing site uses */}
      <header className="hero-band" style={{ background: UI.glow, borderBottom: `1px solid ${UI.plumLine}`, padding: '0 0 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 18, padding: '16px 28px' }}>
          {session ? (
            <>
              <span style={{ fontSize: 13, color: UI.onPlum }}>{session.email}</span>
              {owner && <a href="/admin" style={{ ...link, color: UI.clayText, fontWeight: 600 }}>Team Access</a>}
              <a href="/logout" style={link}>Sign out</a>
            </>
          ) : (
            <a href="/login" style={{ ...link, color: UI.clayText, fontWeight: 600 }}>Sign in →</a>
          )}
        </div>

        <div style={{ textAlign: 'center', padding: '36px 24px 0' }}>
          {/* Cream wordmark — the clay logo disappears against plum */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/f1-wordmark-cream.png" alt="Fahrenheit One" style={{ height: 72, width: 'auto', margin: '0 auto', display: 'block' }} />
          <div style={{ marginTop: 18, fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase', color: UI.clayText }}>
            Technology Suite
          </div>
          <h1 className="serif" style={{ marginTop: 26, fontSize: 'clamp(30px, 4.2vw, 46px)', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.08 }}>
            Operational technology,<br />built in-house.
          </h1>
          <p style={{ marginTop: 18, fontSize: 15.5, color: UI.onPlumMuted, maxWidth: 560, margin: '18px auto 0', lineHeight: 1.7 }}>
            A suite of tools powering Fahrenheit One @ Hakoah Paddington — from pre-opening
            sales intelligence to day-to-day mission control.
          </p>
        </div>
      </header>

      {/* Tool grid */}
      <main style={{ flex: 1, width: '100%', maxWidth: 960, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {TOOLS.map(tool => (
            <div key={tool.key} className="tool-card">
              <div className="rule" />
              <div className="serif" style={{ fontSize: 22, fontWeight: 500, color: UI.text }}>{tool.name}</div>
              <p style={{ marginTop: 10, fontSize: 14, color: UI.textMuted, lineHeight: 1.65, flex: 1 }}>{tool.description}</p>
              <div style={{ marginTop: 22 }}>
                {tool.live ? (
                  <a href={tool.url} className="btn-solid">Open →</a>
                ) : (
                  <span style={{
                    display: 'inline-flex', padding: '10px 20px', background: UI.surfaceAlt,
                    color: UI.textFaint, border: `1px solid ${UI.border}`, borderRadius: 4,
                    fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                  }}>Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Plum footer band */}
      <footer style={{ background: UI.glow, borderTop: `1px solid ${UI.plumLine}`, padding: '28px 24px', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10, color: UI.onPlumFaint, letterSpacing: '0.22em' }}>
          FAHRENHEIT ONE · CLUB F1 TECH
        </div>
        <div style={{ marginTop: 8, fontSize: 11.5, color: UI.onPlumMuted, letterSpacing: '0.04em' }}>
          @ Hakoah Paddington · Eastern Suburbs Sydney
        </div>
      </footer>
    </div>
  )
}
