import { useState } from "react";
import type { NavigateFn } from "../data";

interface ContactProps {
  navigate: NavigateFn;
}

const CONTACT_TYPES = [
  { id: "collab",       label: "Collaborations",         desc: "Partner with us on events, research, or community initiatives." },
  { id: "sponsor",      label: "Sponsorships",           desc: "Support Mobilon and connect with the next generation of builders." },
  { id: "workshop",     label: "Workshops",              desc: "Bring a technical workshop or session to our community." },
  { id: "partnership",  label: "Technical Partnerships", desc: "Explore technology and product collaborations." },
  { id: "opportunity",  label: "Student Opportunities",  desc: "Internships, jobs, research roles for Mobilon members." },
];

export default function Contact({ navigate: _navigate }: ContactProps) {
  const [activeType, setActiveType] = useState(CONTACT_TYPES[0].id);
  const [formState, setFormState] = useState({ name: "", email: "", org: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry = CONTACT_TYPES.find((type) => type.id === activeType)?.label ?? "General inquiry";
    const subject = `${inquiry} inquiry from ${formState.name}`;
    setSending(true);
    setSubmitError("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/mobilon.bu@bennett.edu.in", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _cc: "s25cseu1244@bennett.edu.in",
          _replyto: formState.email,
          name: formState.name,
          email: formState.email,
          organisation: formState.org || "Not provided",
          inquiryType: inquiry,
          message: formState.message,
        }),
      });

      const result = await response.json() as { success?: boolean | string; message?: string };
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error(result.message || "Message delivery failed");
      }
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Message delivery failed";
      setSubmitError(`${message} Please try again or email us directly.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mobile-safe-page" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "128px 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow fade-up d1" style={{ marginBottom: 20 }}>GET IN TOUCH</div>
        <h1
          className="fade-up d2"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(44px, 7.5vw, 88px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            textTransform: "uppercase",
            color: "#F8FAFC",
            margin: 0,
          }}
        >
          Let&apos;s Build
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(248,250,252,0.3)" }}>
            Something.
          </span>
        </h1>
      </div>

      {/* Main content */}
      <div
        style={{
          padding: "0 32px 120px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: "80px 96px",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left: info */}
          <div className="fade-up d3">
            {/* Contact info */}
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 32 }}>CONTACT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <ContactItem label="Email" value="mobilon.bu@bennett.edu.in" href="mailto:mobilon.bu@bennett.edu.in" />
                <ContactItem label="LinkedIn" value="/company/mobilon-bu" href="https://www.linkedin.com/company/mobilon-bu/" />
                <ContactItem label="Instagram" value="@mobilon_bu" href="https://www.instagram.com/mobilon_bu/" />
                <ContactItem label="GitHub" value="github.com/Mobilon-Mobile-Technologies" href="https://github.com/Mobilon-Mobile-Technologies" />
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 24 }}>LOCATION</div>
              <address style={{ fontStyle: "normal" }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 15, color: "#F8FAFC", marginBottom: 8 }}>
                  Bennett University
                </div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
                  Plot No 8-11, TechZone II<br />
                  Greater Noida, UP 201310<br />
                  India
                </div>
              </address>
            </div>

            {/* Join note */}
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 3,
                padding: "24px 28px",
                background: "var(--surface)",
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 12 }}>JOINING MOBILON</div>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
                Mobilon recruits new members at the start of each academic year through an open application process.
                Follow us on Instagram or LinkedIn to know when applications open.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="fade-up d4">
            {!submitted ? (
              <>
                {/* Inquiry type */}
                <div style={{ marginBottom: 40 }}>
                  <div className="eyebrow" style={{ marginBottom: 20 }}>I AM REACHING OUT ABOUT</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {CONTACT_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveType(t.id)}
                        style={{
                          background: activeType === t.id ? "rgba(124,58,237,0.1)" : "transparent",
                          border: `1px solid ${activeType === t.id ? "var(--violet)" : "var(--border)"}`,
                          borderRadius: 3,
                          padding: "14px 20px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            fontWeight: 600,
                            fontSize: 14,
                            color: activeType === t.id ? "#F8FAFC" : "var(--muted)",
                            marginBottom: activeType === t.id ? 4 : 0,
                          }}
                        >
                          {t.label}
                        </div>
                        {activeType === t.id && (
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "rgba(148,163,184,0.8)", lineHeight: 1.5 }}>
                            {t.desc}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
                    <FormField
                      label="Name"
                      id="name"
                      value={formState.name}
                      onChange={(v) => setFormState((s) => ({ ...s, name: v }))}
                      placeholder="Your name"
                    />
                    <FormField
                      label="Email"
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(v) => setFormState((s) => ({ ...s, email: v }))}
                      placeholder="you@example.com"
                    />
                  </div>
                  <FormField
                    label="Organisation (optional)"
                    id="org"
                    value={formState.org}
                    onChange={(v) => setFormState((s) => ({ ...s, org: v }))}
                    placeholder="Company, university, or institution"
                  />
                  <FormField
                    label="Message"
                    id="message"
                    textarea
                    value={formState.message}
                    onChange={(v) => setFormState((s) => ({ ...s, message: v }))}
                    placeholder="Tell us what you have in mind..."
                  />
                  {submitError && (
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#FCA5A5", margin: 0 }}>
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "56px 48px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    color: "var(--indigo)",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  MESSAGE SENT
                </div>
                <h2
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: 28,
                    letterSpacing: "-0.02em",
                    color: "#F8FAFC",
                    margin: "0 0 16px",
                  }}
                >
                  Thanks, {formState.name || "there"}.
                </h2>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
                  We&apos;ll get back to you at {formState.email || "your email"} within 2–3 business days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ContactItem({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--indigo)", marginBottom: 4 }}>
        {label}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 14,
          color: "rgba(248,250,252,0.75)",
          textDecoration: "none",
          transition: "color 0.18s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F8FAFC")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,250,252,0.75)")}
      >
        {value}
      </a>
    </div>
  );
}

function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 3,
    padding: "12px 16px",
    fontFamily: "'Manrope', sans-serif",
    fontSize: 14,
    color: "#F8FAFC",
    outline: "none",
    transition: "border-color 0.2s",
    display: "block",
  };

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          required
          style={{ ...baseStyle, resize: "vertical", minHeight: 120 }}
          onFocus={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--border-hover)")}
          onBlur={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--border)")}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={type !== "text" || id !== "org"}
          style={baseStyle}
          onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--border-hover)")}
          onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)")}
        />
      )}
    </div>
  );
}
