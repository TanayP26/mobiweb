import { useState, useRef, useCallback, useEffect } from "react";
import type { NavigateFn } from "../data";
import { EVENTS, ACHIEVEMENTS } from "../data";

interface HomeProps {
  navigate: NavigateFn;
}

/* ── Scroll-reveal hook ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Home({ navigate }: HomeProps) {
  return (
    <div className="mobile-safe-page">
      <HeroSection navigate={navigate} />
      <IdentityStrip />
      <AboutPreview navigate={navigate} />
      <WhatWeDo />
      <FeaturedEvent navigate={navigate} />
      <AchievementsPreview navigate={navigate} />
      <CtaStrip navigate={navigate} />
    </div>
  );
}

/* ── Hero ── */
function HeroSection({ navigate }: { navigate: NavigateFn }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = heroRef.current;
      const glow = glowRef.current;
      if (!el || !glow) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.background = `radial-gradient(820px circle at ${x}% ${y}%, rgba(124,58,237,0.08) 0%, rgba(99,102,241,0.03) 45%, transparent 70%)`;
    });
  }, []);

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="hero-grid mobile-hero"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 96,
        paddingBottom: 80,
      }}
    >
      {/* Mouse glow */}
      <div ref={glowRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", transition: "background 0.08s" }} />

      {/* Bottom vignette */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to bottom, transparent, rgba(13,8,40,0.6))",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          width: "100%",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px 64px",
          alignItems: "center",
        }}
        className="hero-cols"
      >
        {/* Left: text */}
        <div>
          <div className="eyebrow fade-up d1" style={{ marginBottom: 28 }}>
            MOBILON · BENNETT UNIVERSITY
          </div>

          <div
            className="fade-up d2"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(44px, 6.5vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#F8FAFC",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            WE BUILD
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #8B5CF6 0%, #6366F1 50%, #2563EB 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WHAT&apos;S NEXT.
            </span>
          </div>

          <p
            className="fade-up d3"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "clamp(15px, 1.4vw, 17px)",
              lineHeight: 1.75,
              color: "var(--muted)",
              maxWidth: 460,
              marginBottom: 44,
            }}
          >
            Mobilon is Bennett University&apos;s community of developers, designers
            and builders — turning ideas into meaningful technology.
          </p>

          <div className="fade-up d4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate("about")}>
              Explore Mobilon
            </button>
            <button className="btn-ghost" onClick={() => navigate("events")}>
              View Events →
            </button>
          </div>

          {/* Stats */}
          <div
            className="fade-up d5"
            style={{
              display: "flex",
              gap: 36,
              marginTop: 72,
              paddingTop: 32,
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
              rowGap: 20,
            }}
          >
            {[
              { n: "200+", label: "Members" },
              { n: "4+",   label: "Years" },
              { n: "12+",  label: "Awards" },
              { n: "5",    label: "Products" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: 26,
                    letterSpacing: "-0.02em",
                    color: "#F8FAFC",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginTop: 3,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated phone */}
        <div
          className="fade-up d3"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <AnimatedPhone />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-cols {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 0 20px !important;
          }
          .hero-cols > div:last-child {
            display: none !important;
          }
          .mobile-hero {
            min-height: auto !important;
            padding-top: 88px !important;
            padding-bottom: 48px !important;
          }
          .mobile-hero .btn-primary,
          .mobile-hero .btn-ghost {
            width: 100% !important;
            justify-content: center !important;
          }
          .mobile-hero .fade-up {
            animation-delay: 0s !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Animated Phone ── */
function AnimatedPhone() {
  const [screen, setScreen] = useState(0);
  const SCREENS = 3;

  useEffect(() => {
    const t = setInterval(() => setScreen((s) => (s + 1) % SCREENS), 3200);
    return () => clearInterval(t);
  }, []);

  const phoneW = 220;
  const phoneH = 440;
  const cornerR = 30;
  const screenPad = 12;

  return (
    <div
      style={{
        position: "relative",
        width: phoneW + 80,
        height: phoneH + 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow aura */}
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)",
          animation: "pulseGlow 3.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Phone wrapper with bob animation */}
      <div
        style={{
          animation: "phoneBob 4.5s ease-in-out infinite",
          position: "relative",
          width: phoneW,
          height: phoneH,
        }}
      >
        {/* Phone body */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: cornerR,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Side sheen */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "45%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)",
              borderRadius: `${cornerR}px ${cornerR}px 0 0`,
              pointerEvents: "none",
            }}
          />

          {/* Dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 72,
              height: 22,
              borderRadius: 11,
              background: "rgba(0,0,0,0.55)",
              zIndex: 10,
            }}
          />

          {/* Screen */}
          <div
            style={{
              position: "absolute",
              inset: screenPad,
              borderRadius: cornerR - screenPad,
              overflow: "hidden",
              background: "#0A0620",
            }}
          >
            {/* Screen 0: Chat app */}
            <AppScreen visible={screen === 0}>
              <ChatScreen />
            </AppScreen>

            {/* Screen 1: Dashboard */}
            <AppScreen visible={screen === 1}>
              <DashScreen />
            </AppScreen>

            {/* Screen 2: Home / icon grid */}
            <AppScreen visible={screen === 2}>
              <HomeScreen />
            </AppScreen>
          </div>

          {/* Home bar */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.35)",
            }}
          />
        </div>

        {/* Platform badges floating around */}
        <FloatingBadge top={-16} left={-20} delay="0s" color="#3DDC84" label="Android" />
        <FloatingBadge top={60} right={-24} delay="0.8s" color="#54C5F8" label="Flutter" />
        <FloatingBadge bottom={80} left={-28} delay="1.5s" color="#A2AAAD" label="iOS" />
      </div>
    </div>
  );
}

function AppScreen({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.97)",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

/* Screen 1: AI chat interface */
function ChatScreen() {
  return (
    <div style={{ height: "100%", background: "linear-gradient(160deg, #0D0828 0%, #1A0D42 100%)", padding: "42px 14px 16px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #2563EB)" }} />
        <div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 11, color: "#F8FAFC" }}>Samvad AI</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#6366F1", letterSpacing: "0.06em" }}>ONLINE</div>
        </div>
      </div>
      {/* Messages */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
        <MsgBubble text="When is the next Mobile Next event?" align="right" />
        <MsgBubble text="Mobile Next 4.0 is on Oct 18–19 at the Innovation Hub! Register now →" align="left" ai />
        <MsgBubble text="What's the prize pool?" align="right" />
        <MsgBubble text="₹1,00,000+ in prizes across all tracks." align="left" ai />
      </div>
      {/* Input bar */}
      <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center" }}>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9, color: "rgba(148,163,184,0.5)", flex: 1 }}>Ask anything...</span>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 8 }}>↑</span>
        </div>
      </div>
    </div>
  );
}

function MsgBubble({ text, align, ai }: { text: string; align: "left" | "right"; ai?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "75%",
          padding: "6px 10px",
          borderRadius: align === "right" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
          background: align === "right"
            ? "linear-gradient(135deg, #7C3AED, #4F46E5)"
            : ai ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.05)",
          border: ai ? "1px solid rgba(99,102,241,0.25)" : "none",
          fontFamily: "'Manrope',sans-serif",
          fontSize: 9,
          color: align === "right" ? "#fff" : "rgba(248,250,252,0.85)",
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* Screen 2: Dashboard */
function DashScreen() {
  return (
    <div style={{ height: "100%", background: "linear-gradient(160deg, #0C1840 0%, #0D0828 100%)", padding: "44px 12px 14px", overflow: "hidden" }}>
      <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13, color: "#F8FAFC", marginBottom: 4 }}>TrackIt</div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "var(--indigo)", letterSpacing: "0.08em", marginBottom: 14 }}>SEMESTER 5 · WEEK 9</div>
      {/* GPA card */}
      <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.2))", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "rgba(148,163,184,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Current GPA</div>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 24, color: "#F8FAFC", lineHeight: 1.2 }}>8.7</div>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 8, color: "#6EE7B7" }}>↑ +0.3 from last semester</div>
      </div>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
        {[{ l: "Attendance", v: "88%", c: "#8B5CF6" }, { l: "Assignments", v: "12/14", c: "#6366F1" }].map(s => (
          <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(148,163,184,0.5)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>Weekly Study Hours</div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36 }}>
          {[0.5, 0.7, 0.4, 0.9, 0.8, 0.6, 0.3].map((h, i) => (
            <div key={i} style={{ flex: 1, background: `linear-gradient(to top, #7C3AED, #2563EB)`, height: `${h * 100}%`, borderRadius: "2px 2px 0 0", opacity: 0.7 + i * 0.04 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Screen 3: App home screen */
function HomeScreen() {
  const apps = [
    { name: "Samvad", color: "linear-gradient(135deg,#7C3AED,#4F46E5)", icon: "💬" },
    { name: "TrackIt", color: "linear-gradient(135deg,#2563EB,#0891B2)", icon: "📊" },
    { name: "Campus", color: "linear-gradient(135deg,#059669,#0D9488)", icon: "🏫" },
    { name: "Events", color: "linear-gradient(135deg,#D97706,#DC2626)", icon: "🎯" },
    { name: "Code",   color: "linear-gradient(135deg,#1D4ED8,#4F46E5)", icon: "⌨️" },
    { name: "Design", color: "linear-gradient(135deg,#DB2777,#7C3AED)", icon: "✦" },
  ];

  return (
    <div style={{ height: "100%", background: "linear-gradient(160deg, #1A0D42 0%, #0C1840 100%)", padding: "44px 16px 16px" }}>
      {/* Time */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 32, color: "#F8FAFC", letterSpacing: "-0.02em" }}>9:41</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "rgba(248,250,252,0.5)", letterSpacing: "0.06em" }}>SAT, OCT 18</div>
      </div>
      {/* App grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {apps.map((a) => (
          <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              {a.icon}
            </div>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 8, color: "rgba(248,250,252,0.7)", fontWeight: 500 }}>{a.name}</span>
          </div>
        ))}
      </div>
      {/* Dock */}
      <div style={{ position: "absolute", bottom: 24, left: 12, right: 12, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "8px 12px", display: "flex", justifyContent: "space-around" }}>
        {["📞", "✉️", "📷", "🌐"].map((ic, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{ic}</div>
        ))}
      </div>
    </div>
  );
}

function FloatingBadge({
  top, bottom, left, right, delay, color, label,
}: {
  top?: number; bottom?: number; left?: number; right?: number; delay: string; color: string; label: string;
}) {
  const pos: React.CSSProperties = {};
  if (top    !== undefined) pos.top    = top;
  if (bottom !== undefined) pos.bottom = bottom;
  if (left   !== undefined) pos.left   = left;
  if (right  !== undefined) pos.right  = right;

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        animation: `orbitX 3.5s ease-in-out infinite`,
        animationDelay: delay,
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20,
        padding: "4px 8px 4px 5px",
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "rgba(248,250,252,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ── Identity Strip ── */
function IdentityStrip() {
  const { ref, inView } = useInView();
  const items = ["Product Engineering", "Mobile", "AI", "Design", "Hackathons", "Innovation"];
  return (
    <div
      ref={ref}
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "28px 32px",
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 0,
          flexWrap: "wrap",
        }}
      >
        {items.map((item, i) => (
          <div key={item} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: i % 2 === 0 ? "rgba(248,250,252,0.7)" : "var(--indigo)",
                whiteSpace: "nowrap",
                padding: "0 24px",
              }}
            >
              {item}
            </span>
            {i < items.length - 1 && (
              <span style={{ color: "var(--border)", fontSize: 16, userSelect: "none" }}>·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── About Preview ── */
function AboutPreview({ navigate }: { navigate: NavigateFn }) {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref}
      style={{ padding: "120px 32px", maxWidth: 1280, margin: "0 auto" }}
    >
      <div className="eyebrow" style={{ marginBottom: 56 }}>WHO WE ARE</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px 96px",
          alignItems: "start",
        }}
        className="about-grid"
      >
        {/* Left: big statement */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(24px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "#F8FAFC",
              margin: 0,
            }}
          >
            More than
            <br />a coding club.
          </h2>
        </div>

        {/* Right: copy */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(24px)",
            transition: "opacity 0.8s 0.15s cubic-bezier(0.16,1,0.3,1), transform 0.8s 0.15s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--muted)",
              margin: "0 0 32px",
            }}
          >
            Mobilon is the place at Bennett University where students stop consuming
            technology and start building it. We&apos;re a community of developers,
            designers, and product thinkers who learn together, ship real software,
            and compete at the highest level.
          </p>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--muted)",
              margin: "0 0 40px",
            }}
          >
            Every semester we run workshops, hackathons, and showcases. Every year we
            ship products that get used. Our members go on to internships and jobs at
            top technology companies — not because of their degrees, but because of
            what they built here.
          </p>
          <button className="arrow-link" onClick={() => navigate("about")}>
            Explore Mobilon <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── What We Do ── */
const DOMAINS = [
  {
    id: "build",
    number: "01",
    title: "Build Products",
    desc: "We don't build to learn — we learn by building. Real apps, real users, real feedback.",
    size: "large",
    accent: true,
  },
  {
    id: "hack",
    number: "02",
    title: "Hackathons",
    desc: "We compete across India, from SIH to private invites. We build fast and we build well.",
    size: "medium",
  },
  {
    id: "work",
    number: "03",
    title: "Workshops",
    desc: "Hands-on sessions run by practitioners. Flutter, LLMs, system design, UI craft.",
    size: "medium",
  },
  {
    id: "ai",
    number: "04",
    title: "AI & Software",
    desc: "From LLM-powered tools to on-device ML — we explore the edge of what's possible.",
    size: "small",
  },
  {
    id: "mobile",
    number: "05",
    title: "Mobile Dev",
    desc: "Mobile-first, always. Native and cross-platform, shipped to real app stores.",
    size: "small",
  },
  {
    id: "design",
    number: "06",
    title: "Design",
    desc: "Product design, systems, motion. We believe the best engineers also think in craft.",
    size: "small",
  },
];

function WhatWeDo() {
  const { ref, inView } = useInView(0.08);

  return (
    <section
      ref={ref}
      style={{
        padding: "0 32px 120px",
        maxWidth: 1280,
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.7s",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 56 }}>WHAT WE DO</div>

      {/* Asymmetric grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto auto auto",
          gap: 1,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 6,
          overflow: "hidden",
        }}
        className="wwd-grid"
      >
        {/* BUILD PRODUCTS — large, tall */}
        <DomainCell
          item={DOMAINS[0]}
          style={{ gridColumn: "1", gridRow: "1 / 3", minHeight: 320 }}
          large
        />
        {/* HACKATHONS */}
        <DomainCell item={DOMAINS[1]} style={{ gridColumn: "2", gridRow: "1" }} />
        {/* WORKSHOPS */}
        <DomainCell item={DOMAINS[2]} style={{ gridColumn: "3", gridRow: "1" }} />
        {/* AI */}
        <DomainCell item={DOMAINS[3]} style={{ gridColumn: "2", gridRow: "2" }} />
        {/* MOBILE */}
        <DomainCell item={DOMAINS[4]} style={{ gridColumn: "3", gridRow: "2" }} />
        {/* DESIGN */}
        <DomainCell item={DOMAINS[5]} style={{ gridColumn: "1", gridRow: "3" }} />
        {/* Accent strip */}
        <div
          style={{
            gridColumn: "2 / 4",
            gridRow: "3",
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            padding: "32px 40px",
          }}
        >
          <span
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.5vw, 28px)",
              letterSpacing: "-0.01em",
              color: "rgba(248,250,252,0.18)",
            }}
          >
            LEARN&nbsp;&nbsp;·&nbsp;&nbsp;BUILD&nbsp;&nbsp;·&nbsp;&nbsp;SHIP
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .wwd-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: auto !important;
          }
          .wwd-grid > div {
            min-height: 220px !important;
          }
        }
        @media (max-width: 600px) {
          .wwd-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            border-radius: 12px !important;
          }
          .wwd-grid > div {
            grid-column: auto !important;
            grid-row: auto !important;
            min-height: 180px !important;
            padding: 26px 20px !important;
          }
          .wwd-grid > div:last-child {
            min-height: 120px !important;
          }
        }
      `}</style>
    </section>
  );
}

function DomainCell({
  item,
  style,
  large,
}: {
  item: (typeof DOMAINS)[0];
  style?: React.CSSProperties;
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(20,12,48,0.85)" : "rgba(13,8,32,0.7)",
        padding: large ? "48px 44px" : "36px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: large ? "flex-end" : "space-between",
        transition: "background 0.2s",
        cursor: "default",
        ...style,
      }}
    >
      {large && (
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--indigo)",
            textTransform: "uppercase",
            marginBottom: "auto",
          }}
        >
          {item.number}
        </div>
      )}
      <div>
        {!large && (
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "var(--indigo)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {item.number}
          </div>
        )}
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: large ? "clamp(24px, 3vw, 38px)" : 18,
            letterSpacing: "-0.02em",
            color: "#F8FAFC",
            textTransform: "uppercase",
            marginBottom: 14,
            lineHeight: 1.1,
          }}
        >
          {item.title}
        </div>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: large ? 15 : 13,
            lineHeight: 1.7,
            color: hovered ? "rgba(248,250,252,0.65)" : "var(--muted)",
            margin: 0,
            transition: "color 0.2s",
          }}
        >
          {item.desc}
        </p>
      </div>
    </div>
  );
}

/* ── Featured Event ── */
function FeaturedEvent({ navigate }: { navigate: NavigateFn }) {
  const { ref, inView } = useInView(0.1);
  const event = EVENTS.find((e) => e.id === "flutter-away-3")!;

  return (
    <section
      ref={ref}
      style={{
        padding: "0 32px 120px",
        maxWidth: 1280,
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 40 }}>UPCOMING</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          overflow: "hidden",
        }}
        className="event-feature-grid"
      >
        {/* Image */}
        <div
          className="img-zoom"
          style={{
            background: "#0A0B16",
            minHeight: 480,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={event.image}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(5,5,10,0.2) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 28,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "rgba(124,58,237,0.85)",
                color: "#fff",
                padding: "5px 12px",
                borderRadius: 2,
              }}
            >
              {event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            background: "var(--surface-solid)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "56px 52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "#F8FAFC",
                margin: "0 0 24px",
              }}
            >
              {event.title}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 28,
                paddingBottom: 28,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <MetaRow icon="📅" text={event.date} />
              <MetaRow icon="📍" text={event.venue} />
            </div>

            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 15,
                lineHeight: 1.75,
                color: "var(--muted)",
                margin: "0 0 28px",
              }}
            >
              {event.description}
            </p>

            {event.highlights && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {event.highlights.slice(0, 4).map((h) => (
                  <div key={h} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--indigo)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 13,
                        color: "rgba(248,250,252,0.6)",
                      }}
                    >
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <button className="btn-primary" onClick={() => navigate("event-detail", { id: event.id })}>
              View Event →
            </button>
            <button className="btn-ghost" onClick={() => navigate("events")}>
              Register →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .event-feature-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function MetaRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "var(--muted)" }}>{text}</span>
    </div>
  );
}

/* ── Achievements Preview ── */
function AchievementsPreview({ navigate }: { navigate: NavigateFn }) {
  const { ref, inView } = useInView(0.1);
  const allAchievements = ACHIEVEMENTS.flatMap((yearGroup) =>
    yearGroup.items.map((item) => ({ ...item, year: yearGroup.year })),
  ).sort((a, b) => {
    const yearA = parseInt((a.year.match(/\d{4}/)?.[0] ?? "0"), 10);
    const yearB = parseInt((b.year.match(/\d{4}/)?.[0] ?? "0"), 10);
    return yearB - yearA;
  });

  return (
    <section
      ref={ref}
      style={{
        padding: "0 32px 120px",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 80,
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(16px)",
          transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>RECOGNITION</div>
          </div>
          <button className="arrow-link" onClick={() => navigate("archive")}>
            Full archive <span className="arrow">→</span>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {allAchievements.map((item, i) => (
            <div
              key={`${item.year}-${item.event}`}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr)",
                gap: "12px",
                padding: "26px 0",
                borderBottom: i < allAchievements.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "start",
              }}
              className="ach-row"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#F8FAFC",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.event}
                  </span>
                  <span className="tag tag-violet">{item.result}</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  {item.organizer && (
                    <span
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 13,
                        color: "var(--muted)",
                      }}
                    >
                      {item.organizer}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      color: "#CBD5E1",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .ach-row { grid-template-columns: 40px 1fr !important; }
          .ach-row > div:last-child { grid-column: 2; }
        }
      `}</style>
    </section>
  );
}

/* ── CTA Strip ── */
function CtaStrip({ navigate }: { navigate: NavigateFn }) {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      ref={ref}
      style={{
        padding: "0 32px 120px",
        maxWidth: 1280,
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.8s",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 6,
          padding: "72px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(24px, 3.5vw, 40px)",
              letterSpacing: "-0.025em",
              color: "#F8FAFC",
              margin: "0 0 10px",
            }}
          >
            Ready to build something?
          </h2>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "var(--muted)", margin: 0 }}>
            Mobilon recruits every year. Applications open now.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => navigate("contact")}>
            Join Mobilon →
          </button>
          <button className="btn-ghost" onClick={() => navigate("team")}>
            Meet the team
          </button>
        </div>
      </div>
    </section>
  );
}
