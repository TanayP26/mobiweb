import { useState } from "react";
import type { NavigateFn } from "../data";

interface ArchiveProps {
  navigate: NavigateFn;
}

const YEARS = ["2025–26"];

const YEAR_DATA: Record<string, {
  leadership: { role: string; name: string }[];
}> = {
  "2025–26": {
    leadership: [
      { role: "President", name: "Vasu Bhatia" },
      { role: "Vice President", name: "Ashmit Sharma" },
      { role: "General Secretary", name: "Moksha Sharma" },
      { role: "Chief Strategist", name: "Aadya" },
      { role: "Tech Head", name: "Parth Singh" },
      { role: "Tech Co-Head", name: "Adil" },
      { role: "Management Head", name: "Alankrit Jain" },
      { role: "Management Co-Head", name: "Sneha Jivnani" },
      { role: "Design Head", name: "Gauranvi Mehra" },
      { role: "UI/UX Head", name: "Abhimanyu Narang" },
      { role: "Multimedia Head", name: "Vishesh Gautam" },
      { role: "Multimedia Co-Head", name: "Prikshit Sharma" },
      { role: "PR and Outreach Head", name: "Akshat Goyal" },
      { role: "PR and Outreach Co-Head", name: "Riya Kabra" },
    ],
  },
};

export default function Archive({ navigate: _navigate }: ArchiveProps) {
  const [activeYear, setActiveYear] = useState(YEARS[0]);
  const data = YEAR_DATA[activeYear];

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "128px 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow fade-up d1" style={{ marginBottom: 20 }}>INSTITUTIONAL MEMORY</div>
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
            margin: "0 0 16px",
          }}
        >
          Archive
        </h1>
        <p
          className="fade-up d3"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 16,
            color: "var(--muted)",
            margin: 0,
          }}
        >
          A record of every year&apos;s torchbearers, leaders, and builders.
        </p>
      </div>

      {/* Year selector */}
      <div
        className="fade-up d4"
        style={{ padding: "0 32px 64px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${YEARS.length}, 1fr)`,
            border: "1px solid var(--border)",
            borderRadius: 3,
            overflow: "hidden",
          }}
          className="year-selector"
        >
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setActiveYear(y)}
              style={{
                background: activeYear === y ? "rgba(124,58,237,0.12)" : "transparent",
                border: "none",
                borderRight: "1px solid var(--border)",
                padding: "20px 16px",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.08em",
                color: activeYear === y ? "#F8FAFC" : "var(--muted)",
                borderBottom: activeYear === y ? "2px solid var(--violet)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        key={activeYear}
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px 80px",
            maxWidth: 820,
            margin: "0 auto",
          }}
          className="archive-grid"
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.leadership.map((l, i) => (
              <div
                key={l.role}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < data.leadership.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--indigo)", textTransform: "uppercase" }}>
                  {l.role}
                </span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>
                  {l.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .archive-grid { grid-template-columns: 1fr !important; }
          .year-selector { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

