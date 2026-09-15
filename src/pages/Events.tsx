import { useState, useRef, useEffect } from "react";
import type { NavigateFn } from "../data";
import { EVENTS } from "../data";
import type { ClubEvent } from "../data";

interface EventsProps {
  navigate: NavigateFn;
  params: Record<string, string>;
  detail?: boolean;
}

function resolveImageSource(src: string, width?: number, height?: number) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/") || src.startsWith("data:")) {
    return src;
  }

  const w = width ?? 600;
  const h = height ?? 300;
  return `https://images.unsplash.com/${src}?w=${w}&h=${h}&fit=crop&auto=format`;
}

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

export default function Events({ navigate, params, detail }: EventsProps) {
  if (detail && params.id) {
    const event = EVENTS.find((e) => e.id === params.id);
    if (event) return <EventDetail event={event} navigate={navigate} />;
  }

  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  const past = EVENTS.filter((e) => e.status === "past");

  return (
    <div className="mobile-safe-page" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "128px 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow fade-up d1" style={{ marginBottom: 20 }}>ALL EVENTS</div>
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
            margin: 0,
          }}
        >
          Events
        </h1>
      </div>

      {/* Upcoming */}
      <UpcomingEvents events={upcoming} navigate={navigate} />

      {/* Past */}
      <PastEvents events={past} navigate={navigate} />
    </div>
  );
}

function UpcomingEvents({ events, navigate }: { events: ClubEvent[]; navigate: NavigateFn }) {
  const { ref, inView } = useInView(0.05);

  return (
    <section
      ref={ref}
      style={{
        padding: "0 32px 100px",
        maxWidth: 1280,
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 40,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="eyebrow">UPCOMING</div>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.08em",
          }}
        >
          {events.length} events
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }} className="upcoming-list">
        {events.map((event) => (
          <EventRow key={event.id} event={event} navigate={navigate} large />
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .upcoming-list { gap: 0 !important; }
        }
      `}</style>
    </section>
  );
}

function PastEvents({ events, navigate }: { events: ClubEvent[]; navigate: NavigateFn }) {
  const { ref, inView } = useInView(0.05);

  return (
    <section
      ref={ref}
      style={{
        padding: "0 32px 120px",
        maxWidth: 1280,
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 40,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="eyebrow">PAST EVENTS</div>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.08em",
          }}
        >
          {events.length} events
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 1,
          background: "var(--border)",
          alignItems: "stretch",
        }}
        className="past-grid"
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} navigate={navigate} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .past-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important; }
        }
        @media (max-width: 600px) {
          .past-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function EventRow({ event, navigate, large }: { event: ClubEvent; navigate: NavigateFn; large?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("event-detail", { id: event.id })}
      style={{
        background: hovered ? "var(--surface-solid)" : "var(--bg)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 32,
        padding: large ? "36px 40px" : "28px 36px",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
        borderLeft: hovered ? "2px solid var(--violet-soft)" : "2px solid transparent",
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
      }}
      className="event-row"
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span className="tag tag-violet">{event.category}</span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.08em",
            }}
          >
            {event.dateShort}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: large ? 22 : 17,
            letterSpacing: "-0.015em",
            color: "#F8FAFC",
            margin: "0 0 8px",
          }}
        >
          {event.title}
        </h3>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            color: "var(--muted)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {event.venue}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            color: "var(--violet-soft)",
            transition: "transform 0.2s",
            transform: hovered ? "translateX(4px)" : "none",
          }}
        >
          →
        </span>
      </div>
    </div>
  );
}

function EventCard({ event, navigate }: { event: ClubEvent; navigate: NavigateFn }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("event-detail", { id: event.id })}
      style={{
        background: "var(--surface-solid)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
      }}
      className="event-card"
    >
      <div
        className="img-zoom"
        style={{
          height: 200,
          overflow: "hidden",
          background: "#0A0B16",
        }}
      >
        <img
          src={resolveImageSource(event.image, 600, 300)}
          alt={event.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered ? "brightness(1.06)" : "none",
            transition: "filter 0.3s",
          }}
        />
      </div>
      <div style={{ padding: "28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span className="tag">{event.category}</span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: "0.08em",
            }}
          >
            {event.dateShort}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "-0.01em",
            color: "#F8FAFC",
            margin: "0 0 8px",
          }}
        >
          {event.title}
        </h3>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 12,
            color: "var(--muted)",
            margin: "0 0 4px",
          }}
        >
          {event.venue}
        </p>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            color: "rgba(148,163,184,0.7)",
            lineHeight: 1.6,
            margin: "8px 0 0",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.description}
        </p>
        <button
          className="arrow-link"
          style={{ marginTop: 20 }}
          onClick={(e) => { e.stopPropagation(); navigate("event-detail", { id: event.id }); }}
        >
          View Event <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ── Event Detail ── */
function EventDetail({ event, navigate }: { event: ClubEvent; navigate: NavigateFn }) {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: "clamp(300px, 45vw, 560px)", overflow: "hidden" }}>
        <img
          src={resolveImageSource(event.image, 1600, 700)}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(5,5,10,0.3) 0%, rgba(5,5,10,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 32px 48px",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <span className="tag tag-violet" style={{ marginBottom: 16, display: "inline-block" }}>
              {event.category}
            </span>
            <h1
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 5vw, 60px)",
                letterSpacing: "-0.025em",
                color: "#F8FAFC",
                margin: "0 0 16px",
              }}
            >
              {event.title}
            </h1>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <MetaItem label="Date" value={event.date} />
              <MetaItem label="Venue" value={event.venue} />
              <MetaItem
                label="Status"
                value={event.status === "upcoming" ? "Registration Open" : "Concluded"}
                accent={event.status === "upcoming"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "72px 32px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "64px 80px",
            alignItems: "start",
          }}
          className="detail-grid"
        >
          {/* Left */}
          <div>
            <Section title="ABOUT">
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, lineHeight: 1.8, color: "var(--muted)", margin: 0 }}>
                {event.fullDescription ?? event.description}
              </p>
            </Section>

            {event.highlights && (
              <Section title="EVENT HIGHLIGHTS">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {event.highlights.map((h) => (
                    <div key={h} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--indigo)", marginTop: 9, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "rgba(248,250,252,0.75)" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="ORGANISING TEAM">
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "var(--muted)" }}>
                Organised by the Mobilon Events Team, Bennett University. For queries, reach out via{" "}
                <a href="mailto:mobilon.bu@bennett.edu.in" style={{ color: "var(--violet-soft)" }}>
                  mobilon.bu@bennett.edu.in
                </a>
              </p>
            </Section>
          </div>

          {/* Right sidebar */}
          <div style={{ position: "sticky", top: 96 }}>
            {event.status === "upcoming" && (
              <div
                style={{
                  background: "var(--surface-solid)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "32px",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--indigo)",
                    marginBottom: 20,
                  }}
                >
                  Register
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "var(--muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
                  Registration closes 72 hours before the event. Spots are limited.
                </p>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Register Now →
                </button>
              </div>
            )}

            <div
              style={{
                background: "var(--surface-solid)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "28px 32px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <DetailItem label="Date" value={event.date} />
                <DetailItem label="Venue" value={event.venue} />
                <DetailItem label="Category" value={event.category} />
                <DetailItem
                  label="Status"
                  value={event.status === "upcoming" ? "Upcoming" : "Concluded"}
                />
              </div>
            </div>

            <button
              className="arrow-link"
              style={{ marginTop: 28 }}
              onClick={() => navigate("events")}
            >
              All events <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .event-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 24px 20px !important;
          }
          .event-row > div:last-child {
            display: none !important;
          }
          .event-card {
            min-width: 0;
          }
          .event-card > div:first-child {
            height: 180px !important;
          }
          .event-card > div:last-child {
            padding: 20px 18px !important;
          }
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: "1px solid var(--border)" }}>
      <div className="eyebrow" style={{ marginBottom: 24 }}>{title}</div>
      {children}
    </div>
  );
}

function MetaItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(148,163,184,0.6)", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600, color: accent ? "var(--violet-soft)" : "#F8FAFC" }}>{value}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--violet-soft)", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "rgba(248,250,252,0.8)" }}>{value}</div>
    </div>
  );
}
