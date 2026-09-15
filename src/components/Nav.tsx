import { useState, useEffect } from "react";
import type { NavigateFn, Page } from "../data";
import mobilonLogo from "@/imports/WhatsApp_Image_2026-09-06_at_14.56.30.jpeg";

const LINKS: { label: string; page: Page }[] = [
  { label: "Home",     page: "home" },
  { label: "About",    page: "about" },
  { label: "Events",   page: "events" },
  { label: "Team",     page: "team" },
  { label: "Projects", page: "projects" },
  { label: "Gallery",  page: "gallery" },
  { label: "Archive",  page: "archive" },
  { label: "Contact",  page: "contact" },
];

interface NavProps {
  navigate: NavigateFn;
  currentPage: Page;
}

export default function Nav({ navigate, currentPage }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function go(page: Page) {
    navigate(page);
    setMobileOpen(false);
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
          background: scrolled
            ? "rgba(13, 8, 40, 0.82)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(139,92,246,0.18)"
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="nav-shell"
        >
          {/* Logo */}
          <button
            onClick={() => go("home")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#fff",
                padding: 3,
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={mobilonLogo}
                alt="Mobilon"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.01em",
                color: "#F8FAFC",
              }}
            >
              MOBILON
            </span>
          </button>

          {/* Desktop links */}
          <nav className="hidden lg:flex" style={{ alignItems: "center", gap: 6 }}>
            {LINKS.map((l) => (
              <button
                key={l.page}
                onClick={() => go(l.page)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 13,
                  fontWeight: currentPage === l.page ? 600 : 500,
                  color: currentPage === l.page ? "#F8FAFC" : "var(--muted)",
                  letterSpacing: "0.005em",
                  position: "relative",
                  transition: "color 0.18s",
                }}
                onMouseEnter={(e) => { if (currentPage !== l.page) (e.currentTarget as HTMLButtonElement).style.color = "#F8FAFC"; }}
                onMouseLeave={(e) => { if (currentPage !== l.page) (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
              >
                {l.label}
                {currentPage === l.page && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 14,
                      right: 14,
                      height: 1,
                      background: "var(--violet-soft)",
                      borderRadius: 1,
                    }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => go("contact")}
              className="hidden lg:flex"
              style={{
                background: "none",
                border: "1px solid var(--border-hover)",
                padding: "9px 20px",
                borderRadius: 3,
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#F8FAFC",
                letterSpacing: "0.01em",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.12)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-active)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
              }}
            >
              Join Mobilon →
            </button>

            {/* Hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                padding: 8,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "#F8FAFC",
                  borderRadius: 1,
                  transition: "transform 0.25s, opacity 0.25s",
                  transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "#F8FAFC",
                  borderRadius: 1,
                  opacity: mobileOpen ? 0 : 1,
                  transition: "opacity 0.25s",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "#F8FAFC",
                  borderRadius: 1,
                  transition: "transform 0.25s, opacity 0.25s",
                  transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(13,8,36,0.97)",
          backdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          paddingTop: 96,
          paddingLeft: 24,
          paddingRight: 24,
          margin: 12,
          borderRadius: 18,
          border: "1px solid rgba(139,92,246,0.18)",
          transition: "opacity 0.28s, visibility 0.28s",
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? "visible" : "hidden",
        }}
        className="lg:hidden"
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LINKS.map((l, i) => (
            <button
              key={l.page}
              onClick={() => go(l.page)}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "14px 0",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: currentPage === l.page ? "#F8FAFC" : "rgba(248,250,252,0.55)",
                letterSpacing: "-0.01em",
                transition: "color 0.15s",
                transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms",
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 40 }}>
          <button className="btn-primary" onClick={() => go("contact")}>
            Join Mobilon →
          </button>
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingBottom: 40,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.08em",
          }}
        >
          MOBILON · BENNETT UNIVERSITY
        </div>
      </div>
    </>
  );
}

<style>{`
  @media (max-width: 1023px) {
    .nav-shell {
      padding-left: 16px !important;
      padding-right: 16px !important;
      height: 58px !important;
    }
  }
`}</style>

