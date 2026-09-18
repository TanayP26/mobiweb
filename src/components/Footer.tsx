import type { NavigateFn, Page } from "../data"

const EXPLORE_LINKS: { label: string; page: Page }[] = [
  { label: "About", page: "about" },
  { label: "Events", page: "events" },
  { label: "Team", page: "team" },
  { label: "Projects", page: "projects" },
  { label: "Gallery", page: "gallery" },
  { label: "Archive", page: "archive" },
]

interface FooterProps {
  navigate: NavigateFn
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer
      className="mobile-safe-page"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        padding: "80px 32px 40px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 64,
            paddingBottom: 64,
            borderBottom: "1px solid var(--border)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.01em",
                color: "#F8FAFC",
                marginBottom: 16,
              }}
            >
              MOBILON
            </div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--muted)",
                marginBottom: 24,
              }}
            >
              Building products.
              <br />
              Growing builders.
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "rgba(148,163,184,0.5)",
                textTransform: "uppercase",
              }}
            >
              Bennett University
              <br />
              Greater Noida
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              Explore
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {EXPLORE_LINKS.map((l) => (
                <button
                  key={l.page}
                  onClick={() => navigate(l.page)}
                  style={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    padding: 0,
                    cursor: "pointer",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 14,
                    color: "var(--muted)",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "var(--muted)")
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              <button type="button" aria-label="Connect — Contact" onClick={() => navigate("contact")} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "inherit", letterSpacing: "inherit", textTransform: "inherit", cursor: "pointer" }}>Connect</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com/company/mobilon-bu/", icon: "in" },
                { label: "Instagram", href: "https://www.instagram.com/mobilon_bu/", icon: "ig" },
                { label: "GitHub", href: "https://github.com/Mobilon-Mobile-Technologies", icon: "gh" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 14,
                    color: "var(--muted)",
                    textDecoration: "none",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--muted)")
                  }
                >
                  <SocialIcon type={s.icon} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "rgba(148,163,184,0.4)",
              letterSpacing: "0.06em",
            }}
          >
            © 2026 MOBILON
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "rgba(148,163,184,0.4)",
              letterSpacing: "0.06em",
            }}
          >
            DESIGNED & ENGINEERED BY TANAY PRASAD
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </footer>
  )
}

function SocialIcon({ type }: { type: string }) {
  const size = 16
  if (type === "in")
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  if (type === "ig")
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}
