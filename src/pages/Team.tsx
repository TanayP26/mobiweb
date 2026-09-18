import { useState, useRef, useEffect } from "react";
import type { NavigateFn, Member } from "../data";
import { TEAM } from "../data";

interface TeamProps {
  navigate: NavigateFn;
}

type Category = "office-bearer" | "senior-core" | "junior-core" | "faculty";
const TABS: { id: Category; label: string }[] = [
  { id: "office-bearer", label: "Office Bearers" },
  { id: "senior-core",   label: "Senior Core" },
  { id: "junior-core",   label: "Junior Core" },
  { id: "faculty",       label: "Faculty" },
];

function useInView(threshold = 0.1) {
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

export default function Team({ navigate: _navigate }: TeamProps) {
  const [active, setActive] = useState<Category>("office-bearer");
  const members = TEAM.filter((m) => m.category === active);
  const isOfficeBearers = active === "office-bearer";

  const s1 = useInView(0.05);

  return (
    <div className="mobile-safe-page" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "128px 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow fade-up d1" style={{ marginBottom: 20 }}>THE PEOPLE</div>
        <h1
          className="fade-up d2"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(44px, 7vw, 80px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            textTransform: "uppercase",
            color: "#F8FAFC",
            margin: "0 0 24px",
          }}
        >
          Our Team
        </h1>
        <p
          className="fade-up d3"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--muted)",
            maxWidth: 480,
            margin: 0,
          }}
        >
          The people behind Mobilon. Every year, a new generation of builders takes the club forward.
        </p>
      </div>

      {/* Filter tabs */}
      <div
        ref={s1.ref}
        style={{
          padding: "0 32px 64px",
          maxWidth: 1280,
          margin: "0 auto",
          opacity: s1.inView ? 1 : 0,
          transition: "opacity 0.6s",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`filter-tab${active === t.id ? " active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {isOfficeBearers ? (
          <OfficeBearersLayout members={members} />
        ) : (
          <RegularGrid members={members} />
        )}
      </div>
    </div>
  );
}

function OfficeBearersLayout({ members }: { members: Member[] }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 24,
        flexWrap: "wrap",
        maxWidth: 1200,
        margin: "0 auto",
      }}
      className="ob-row"
    >
      {members.map((m, i) => (
        <div key={`${m.id}-${i}`} style={{ flex: "0 1 260px", maxWidth: 300, width: "100%" }}>
          <MemberCard member={m} large />
        </div>
      ))}

      <style>{`
        @media (max-width: 700px) {
          .ob-row { justify-content: center; }
        }
      `}</style>
    </div>
  );
}

function RegularGrid({ members }: { members: Member[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 24,
      }}
      className="member-grid"
    >
      {members.map((m, i) => (
        <MemberCard key={`${m.id}-${i}`} member={m} />
      ))}

      <style>{`
        @media (max-width: 1024px) {
          .member-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .member-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

function MemberCard({ member, large }: { member: Member; large?: boolean }) {
  const [hovered, setHovered] = useState(false);

  const imgSize = large ? 320 : 260;

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      {/* Photo */}
      <div
        style={{
          height: imgSize,
          overflow: "hidden",
          borderRadius: 3,
          border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`,
          transition: "border-color 0.35s",
          position: "relative",
          background: "#0A0B16",
          marginBottom: 16,
        }}
      >
        <img
          src={member.photo.startsWith("photo-") ? `https://images.unsplash.com/${member.photo}?w=400&h=480&fit=crop&auto=format&face` : member.photo}
          alt={member.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.03)" : "scale(1)",
            filter: hovered ? "brightness(1.08)" : "brightness(0.92)",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s",
          }}
        />
        {/* Socials overlay on hover (desktop) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px 16px 16px",
            background: "linear-gradient(to top, rgba(5,5,10,0.9) 0%, transparent 100%)",
            display: "flex",
            gap: 8,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
          className="socials-overlay"
        >
          <Socials member={member} />
        </div>
      </div>

      {/* Info */}
      <div>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: large ? 17 : 15,
            letterSpacing: "-0.01em",
            color: "#F8FAFC",
            marginBottom: 4,
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--indigo)",
            marginBottom: member.year ? 4 : 0,
          }}
        >
          {member.designation}
        </div>
        {member.year && (
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "rgba(148,163,184,0.55)" }}>
            {member.year}
          </div>
        )}
        {/* Socials — always visible on mobile */}
        <div
          className="socials-mobile"
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
          }}
        >
          <Socials member={member} />
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .socials-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .socials-overlay { display: none !important; }
          .socials-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

function Socials({ member }: { member: Member }) {
  const links = [
    { key: "linkedin",  href: member.socials.linkedin,  icon: <LinkedInIcon /> },
    { key: "github",    href: member.socials.github,    icon: <GitHubIcon /> },
    { key: "instagram", href: member.socials.instagram, icon: <InstagramIcon /> },
    { key: "portfolio", href: member.socials.portfolio, icon: <PortfolioIcon /> },
    { key: "email",     href: member.socials.email,     icon: <EmailIcon /> },
  ].filter((l) => l.href);

  return (
    <>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 3,
            background: "rgba(10,11,22,0.8)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "rgba(248,250,252,0.7)",
            textDecoration: "none",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(124,58,237,0.6)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#F8FAFC";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.2)";
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,250,252,0.7)";
          }}
        >
          {l.icon}
        </a>
      ))}
    </>
  );
}

const iconSize = 12;
function LinkedInIcon()  { return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>; }
function GitHubIcon()    { return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>; }
function InstagramIcon() { return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }
function PortfolioIcon() { return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function EmailIcon()     { return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }
