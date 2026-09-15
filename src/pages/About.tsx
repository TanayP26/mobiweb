import { useState, useRef, useEffect } from "react";
import type { NavigateFn } from "../data";

interface AboutProps {
  navigate: NavigateFn;
}

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

const VALUES = [
  { n: "01", title: "Ship over theorise", desc: "Working software matters more than perfect plans. We build iteratively, release early, and improve constantly." },
  { n: "02", title: "Learn by doing", desc: "Workshops end with something you made. Projects are how we learn the hardest lessons. There is no substitute." },
  { n: "03", title: "Lift as you go", desc: "Senior members mentor juniors. Winners share their knowledge. Mobilon grows because its members grow." },
  { n: "04", title: "Quality over quantity", desc: "We would rather ship one excellent product than five mediocre ones. Craft matters here." },
];

export default function About({ navigate }: AboutProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const s1 = useInView(0.1);
  const s2 = useInView(0.1);
  const s3 = useInView(0.08);
  const s4 = useInView(0.08);

  return (
    <div className="mobile-safe-page" style={{ background: "var(--bg)" }}>
      {/* Page hero */}
      <div
        ref={heroRef}
        style={{
          paddingTop: 128,
          paddingBottom: 80,
          paddingLeft: 32,
          paddingRight: 32,
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div className="eyebrow fade-up d1" style={{ marginBottom: 24 }}>ABOUT MOBILON</div>
        <h1
          className="fade-up d2"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(44px, 7vw, 88px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "#F8FAFC",
            textTransform: "uppercase",
            maxWidth: 800,
            margin: "0 0 40px",
          }}
        >
          Building
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(248,250,252,0.3)" }}>
            Builders.
          </span>
        </h1>
        <p
          className="fade-up d3"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            lineHeight: 1.8,
            color: "var(--muted)",
            maxWidth: 560,
            margin: 0,
          }}
        >
          Mobilon is Bennett University&apos;s community for students who want to go beyond
          the curriculum and build technology that matters.
        </p>
      </div>

      {/* Hero image */}
      <div
        className="fade-up d4"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px 120px",
        }}
      >
        <div
          style={{
            height: "clamp(320px, 40vw, 560px)",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid var(--border)",
            position: "relative",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=700&fit=crop&auto=format"
            alt="Mobilon team collaboration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(5,5,10,0.5) 0%, rgba(5,5,10,0.1) 60%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* Mission */}
      <section
        ref={s1.ref}
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
          opacity: s1.inView ? 1 : 0,
          transform: s1.inView ? "none" : "translateY(20px)",
          transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "64px 96px",
            borderTop: "1px solid var(--border)",
            paddingTop: 80,
          }}
          className="two-col"
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>OUR MISSION</div>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(20px, 2.5vw, 30px)",
                lineHeight: 1.5,
                letterSpacing: "-0.015em",
                color: "#F8FAFC",
                margin: "0 0 28px",
              }}
            >
              To create an environment at Bennett University where students build real
              technology, compete at national level, and emerge as complete engineers and
              product thinkers.
            </p>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 16,
                lineHeight: 1.8,
                color: "var(--muted)",
                margin: 0,
              }}
            >
              We are not a study group. We are not a placement cell. We are a product studio
              staffed by students — and we ship.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        ref={s2.ref}
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
          opacity: s2.inView ? 1 : 0,
          transform: s2.inView ? "none" : "translateY(20px)",
          transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 56 }}>HOW WE OPERATE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {VALUES.map((v, i) => (
            <ValueRow key={v.n} item={v} last={i === VALUES.length - 1} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        ref={s3.ref}
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
          opacity: s3.inView ? 1 : 0,
          transition: "opacity 0.8s",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "64px 56px",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 40 }}>BY THE NUMBERS</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 32,
            }}
            className="stats-grid"
          >
            {[
              { n: "2022", label: "Founded" },
              { n: "200+", label: "Members ever" },
              { n: "12+",  label: "Awards won" },
              { n: "5",    label: "Live products" },
            ].map((s) => (
              <div key={s.label} style={{ borderLeft: "2px solid var(--border)", paddingLeft: 20 }}>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: 36,
                    letterSpacing: "-0.025em",
                    color: "#F8FAFC",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section
        ref={s4.ref}
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
          opacity: s4.inView ? 1 : 0,
          transition: "opacity 0.8s",
        }}
      >
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 80,
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 40 }}>ACADEMIC AFFILIATION</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
            className="two-col-sm"
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-0.015em",
                  color: "#F8FAFC",
                  margin: "0 0 12px",
                }}
              >
                Bennett University
              </h3>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--muted)",
                  margin: "0 0 24px",
                }}
              >
                Mobilon is a registered student body under the School of Computer Science
                Engineering, Bennett University, Greater Noida. We operate under the
                mentorship of the Dean of Student Affairs and our faculty advisors.
              </p>
              <button className="arrow-link" onClick={() => navigate("team")}>
                Meet the team <span className="arrow">→</span>
              </button>
            </div>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "32px 36px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--indigo)",
                  marginBottom: 16,
                }}
              >
                Location
              </div>
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#F8FAFC",
                  marginBottom: 8,
                }}
              >
                Bennett University
              </div>
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                Plot No 8-11, TechZone II<br />
                Greater Noida, UP 201310<br />
                India
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr !important; }
          .two-col-sm { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ValueRow({ item, last }: { item: typeof VALUES[0]; last: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 1fr",
        gap: 32,
        padding: "32px 0",
        borderBottom: last ? "none" : "1px solid var(--border)",
        transition: "background 0.2s",
      }}
      className="value-row"
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
          color: "var(--indigo)",
          paddingTop: 3,
        }}
      >
        {item.n}
      </span>
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-0.01em",
          color: hovered ? "#F8FAFC" : "rgba(248,250,252,0.85)",
          transition: "color 0.2s",
        }}
      >
        {item.title}
      </span>
      <p
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--muted)",
          margin: 0,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}
