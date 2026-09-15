import { useState, useRef, useEffect } from "react";
import type { NavigateFn, Project } from "../data";
import { PROJECTS } from "../data";

interface ProjectsProps {
  navigate: NavigateFn;
  params: Record<string, string>;
  detail?: boolean;
}

const CATEGORIES = ["All", "Mobile", "AI", "Web", "Design", "Backend", "Research"] as const;

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

export default function Projects({ navigate, params, detail }: ProjectsProps) {
  if (detail && params.id) {
    const project = PROJECTS.find((p) => p.id === params.id);
    if (project) return <ProjectDetail project={project} navigate={navigate} />;
  }

  return <ProjectsListing navigate={navigate} />;
}

function ProjectsListing({ navigate }: { navigate: NavigateFn }) {
  const [category, setCategory] = useState<string>("All");
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured && (category === "All" || p.category === category));
  const s1 = useInView(0.05);

  return (
    <div className="mobile-safe-page" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "128px 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow fade-up d1" style={{ marginBottom: 20 }}>OUR WORK</div>
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
            margin: "0 0 20px",
          }}
        >
          Projects
        </h1>
        <p
          className="fade-up d3"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(14px, 1.5vw, 18px)",
            color: "var(--muted)",
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          Ideas&nbsp;&nbsp;→&nbsp;&nbsp;Products&nbsp;&nbsp;→&nbsp;&nbsp;Impact
        </p>
      </div>

      {/* Featured projects */}
      <section style={{ padding: "0 32px 96px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 40 }}>FEATURED</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }}>
          {featured.map((p, i) => (
            <FeaturedProjectRow key={p.id} project={p} navigate={navigate} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* All projects */}
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div className="eyebrow">ALL PROJECTS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-tab${category === c ? " active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="proj-grid"
        >
          {rest.map((p) => (
            <ProjectCard key={p.id} project={p} navigate={navigate} />
          ))}
        </div>

        {rest.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)", fontFamily: "'Manrope', sans-serif", fontSize: 15 }}>
            No projects in this category yet.
          </div>
        )}

        <style>{`
          @media (max-width: 900px) {
            .proj-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 600px) {
            .proj-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </div>
  );
}

function FeaturedProjectRow({
  project,
  navigate,
  reverse,
}: {
  project: Project;
  navigate: NavigateFn;
  reverse: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: reverse ? "1fr 1fr" : "1fr 1fr",
        background: hovered ? "var(--surface-2)" : "var(--bg)",
        transition: "background 0.25s",
      }}
      className="feat-row"
    >
      {/* Image */}
      <div
        className="img-zoom"
        style={{
          order: reverse ? 1 : 0,
          height: "clamp(280px, 30vw, 400px)",
          overflow: "hidden",
          background: "#0A0B16",
        }}
      >
        <img
          src={`https://images.unsplash.com/${project.image}?w=800&h=500&fit=crop&auto=format`}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          order: reverse ? 0 : 1,
          padding: "48px 52px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <span className="tag tag-violet">{project.category}</span>
            <span className="tag">{project.year}</span>
          </div>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.025em",
              color: "#F8FAFC",
              margin: "0 0 14px",
            }}
          >
            {project.name}
          </h2>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              fontSize: 15,
              color: "var(--muted)",
              margin: "0 0 24px",
              lineHeight: 1.7,
            }}
          >
            {project.tagline}
          </p>
          {project.impact && (
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                color: "rgba(99,102,241,0.9)",
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              {project.impact}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.techStack.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <button
            className="arrow-link"
            onClick={() => navigate("project-detail", { id: project.id })}
          >
            View Case Study <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .feat-row { grid-template-columns: 1fr !important; }
          .feat-row > * { order: unset !important; }
        }
      `}</style>
    </div>
  );
}

function ProjectCard({ project, navigate }: { project: Project; navigate: NavigateFn }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("project-detail", { id: project.id })}
      style={{
        border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`,
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.25s",
      }}
    >
      <div
        className="img-zoom"
        style={{ height: 200, background: "#0A0B16", overflow: "hidden" }}
      >
        <img
          src={`https://images.unsplash.com/${project.image}?w=600&h=300&fit=crop&auto=format`}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <span className="tag tag-violet">{project.category}</span>
          <span className="tag">{project.year}</span>
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
          {project.name}
        </h3>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            color: "var(--muted)",
            margin: "0 0 20px",
            lineHeight: 1.6,
          }}
        >
          {project.tagline}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.techStack.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Project Detail ── */
function ProjectDetail({ project, navigate }: { project: Project; navigate: NavigateFn }) {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div
        style={{
          padding: "128px 32px 80px",
          maxWidth: 1280,
          margin: "0 auto",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <span className="tag tag-violet">{project.category}</span>
          <span className="tag">{project.year}</span>
          {project.awards?.map((a) => (
            <span key={a} className="tag tag-violet">{a}</span>
          ))}
        </div>
        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(44px, 7vw, 80px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "#F8FAFC",
            margin: "0 0 24px",
          }}
        >
          {project.name}
        </h1>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "clamp(16px, 2vw, 22px)",
            fontWeight: 500,
            color: "var(--muted)",
            maxWidth: 640,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {project.tagline}
        </p>
      </div>

      {/* Hero image */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
        <div
          style={{
            height: "clamp(300px, 40vw, 520px)",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          <img
            src={`https://images.unsplash.com/${project.image}?w=1600&h=700&fit=crop&auto=format`}
            alt={project.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 32px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "64px 80px" }}
          className="detail-grid"
        >
          <div>
            {project.description && (
              <ProjSection title="OVERVIEW">
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, lineHeight: 1.8, color: "var(--muted)", margin: 0 }}>
                  {project.description}
                </p>
              </ProjSection>
            )}
            {project.problem && (
              <ProjSection title="THE PROBLEM">
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, lineHeight: 1.8, color: "var(--muted)", margin: 0 }}>
                  {project.problem}
                </p>
              </ProjSection>
            )}
            {project.solution && (
              <ProjSection title="THE SOLUTION">
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, lineHeight: 1.8, color: "var(--muted)", margin: 0 }}>
                  {project.solution}
                </p>
              </ProjSection>
            )}
            {project.impact && (
              <ProjSection title="IMPACT">
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, lineHeight: 1.8, color: "rgba(99,102,241,0.9)", margin: 0 }}>
                  {project.impact}
                </p>
              </ProjSection>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 96 }}>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "32px",
                marginBottom: 16,
              }}
            >
              <SidebarRow label="TECHNOLOGY">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {project.techStack.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </SidebarRow>
              <SidebarRow label="CONTRIBUTORS">
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                  {project.contributors.map((c) => (
                    <span key={c} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "rgba(248,250,252,0.7)" }}>{c}</span>
                  ))}
                </div>
              </SidebarRow>
              <SidebarRow label="YEAR" last>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "rgba(248,250,252,0.75)" }}>{project.year}</span>
              </SidebarRow>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {project.github && (
                <a
                  href={project.github}
                  className="btn-ghost"
                  style={{ justifyContent: "center" }}
                >
                  GitHub →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  className="btn-primary"
                  style={{ justifyContent: "center" }}
                >
                  Live Demo →
                </a>
              )}
            </div>

            <button className="arrow-link" style={{ marginTop: 24 }} onClick={() => navigate("projects")}>
              All projects <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ProjSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: "1px solid var(--border)" }}>
      <div className="eyebrow" style={{ marginBottom: 24 }}>{title}</div>
      {children}
    </div>
  );
}

function SidebarRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 20, marginBottom: last ? 0 : 20, borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div className="eyebrow" style={{ color: "var(--muted)", fontSize: 10 }}>{label}</div>
      {children}
    </div>
  );
}
