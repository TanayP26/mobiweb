import { useState, useEffect } from "react";
import type { NavigateFn, GalleryItem } from "../data";
import { GALLERY } from "../data";

interface GalleryProps {
  navigate: NavigateFn;
}

type GalleryCategory = GalleryItem["category"] | "All";
const CATS: GalleryCategory[] = ["All", "Mobile Next", "Workshops", "Hackathons", "Recruitment", "Club Life"];

export default function Gallery({ navigate: _navigate }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = GALLERY.filter(
    (g) => activeCategory === "All" || g.category === activeCategory
  );

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => (l !== null ? Math.min(l + 1, filtered.length - 1) : null));
      if (e.key === "ArrowLeft")  setLightbox((l) => (l !== null ? Math.max(l - 1, 0) : null));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="mobile-safe-page" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "128px 32px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow fade-up d1" style={{ marginBottom: 20 }}>GALLERY</div>
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
          Gallery
        </h1>
      </div>

      {/* Filter */}
      <div
        className="fade-up d3"
        style={{
          padding: "0 32px 48px",
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {CATS.map((c) => (
          <button
            key={c}
            className={`filter-tab${activeCategory === c ? " active" : ""}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <GalleryGrid items={filtered} onOpen={(idx) => setLightbox(idx)} />
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          items={filtered}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((l) => (l !== null ? Math.max(l - 1, 0) : null))}
          onNext={() => setLightbox((l) => (l !== null ? Math.min(l + 1, filtered.length - 1) : null))}
        />
      )}
    </div>
  );
}

function GalleryGrid({ items, onOpen }: { items: GalleryItem[]; onOpen: (idx: number) => void }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "220px",
        gap: 6,
      }}
      className="gallery-grid"
    >
      {items.map((item, i) => (
        <GalleryCell key={item.id} item={item} index={i} onOpen={onOpen} />
      ))}

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: minmax(280px, auto) !important;
          }
          .gallery-grid > div {
            grid-column: auto !important;
            grid-row: auto !important;
            min-height: 260px;
          }
        }
      `}</style>
    </div>
  );
}

function resolveGalleryImage(src: string) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/") || src.startsWith("data:") || src.startsWith(".") || src.startsWith("../")) {
    return src;
  }

  return `https://images.unsplash.com/${src}?w=800&h=600&fit=crop&auto=format`;
}

function GalleryCell({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: (i: number) => void }) {
  const [hovered, setHovered] = useState(false);
  const rowSpan = item.span === "tall" ? 2 : 1;
  const colSpan = item.span === "wide" ? 2 : 1;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(index)}
      style={{
        gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined,
        gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        cursor: "pointer",
        background: "#0A0B16",
      }}
    >
      <img
        src={resolveGalleryImage(item.photo)}
        alt={item.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          filter: hovered ? "brightness(0.7)" : "brightness(0.85)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.3s",
        }}
      />
      {/* Hover overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(5,5,10,0.8) 0%, transparent 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          display: "flex",
          alignItems: "flex-end",
          padding: "20px 20px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#F8FAFC",
              marginBottom: 4,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--muted)",
              textTransform: "uppercase",
            }}
          >
            {item.date} · {item.category}
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(5,5,10,0.96)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          background: "none",
          border: "1px solid var(--border)",
          borderRadius: 3,
          padding: "8px 16px",
          cursor: "pointer",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        ESC
      </button>

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        {index + 1} / {items.length}
      </div>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960,
          maxHeight: "78vh",
          width: "100%",
          position: "relative",
        }}
      >
        <img
          src={resolveGalleryImage(item.photo)}
          alt={item.title}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "72vh",
            objectFit: "contain",
            borderRadius: 3,
            display: "block",
          }}
        />
      </div>

      {/* Caption */}
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 16, color: "#F8FAFC" }}>
          {item.title}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", marginTop: 6, textTransform: "uppercase" }}>
          {item.date} · {item.category}
        </div>
      </div>

      {/* Nav arrows */}
      <div
        style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <NavArrow disabled={index === 0} direction="left" />
      </div>
      <div
        style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)" }}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <NavArrow disabled={index === items.length - 1} direction="right" />
      </div>
    </div>
  );
}

function NavArrow({ disabled, direction }: { disabled: boolean; direction: "left" | "right" }) {
  return (
    <button
      style={{
        background: "none",
        border: "1px solid var(--border)",
        borderRadius: 3,
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.25 : 1,
        color: "var(--muted)",
        fontSize: 18,
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
          (e.currentTarget as HTMLButtonElement).style.color = "#F8FAFC";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
      }}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}
