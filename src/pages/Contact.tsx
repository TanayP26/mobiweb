import { useCallback, useRef, useState } from "react";
import type { NavigateFn } from "../data";
import { submitContact, validateContact } from "../lib/contact";

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

function inquiryLabel(activeType: string) {
  return CONTACT_TYPES.find((type) => type.id === activeType)?.label ?? "General inquiry";
}

function subjectForMail(activeType: string, name: string) {
  return `${inquiryLabel(activeType)} inquiry from ${name}`;
}

function messageForMail(activeType: string, formState: { name: string; email: string; org: string; message: string }) {
  return [
    `Name: ${formState.name}`,
    `Email: ${formState.email}`,
    `Organisation: ${formState.org || "Not provided"}`,
    `Inquiry type: ${inquiryLabel(activeType)}`,
    "",
    formState.message,
  ].join("\n");
}

export default function Contact({ navigate }: ContactProps) {
  const [activeType, setActiveType] = useState(CONTACT_TYPES[0].id);
  const [formState, setFormState] = useState({ name: "", email: "", org: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const contactRef = useRef<HTMLDivElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  const handleContactMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const area = contactRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    area.style.setProperty("--contact-x", `${e.clientX - rect.left}px`);
    area.style.setProperty("--contact-y", `${e.clientY - rect.top}px`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || submitted) return;
    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim().toLowerCase(),
      organisation: formState.org.trim(),
      inquiryType: inquiryLabel(activeType),
      message: formState.message.trim(),
      website: websiteRef.current?.value ?? "",
    };
    const validationError = validateContact(payload);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    inFlight.current = true;
    setSending(true);
    setSubmitError("");

    try {
      await submitContact(payload);
      setSubmitted(true);
    } catch {
      setSubmitError("We couldn't confirm your message was received. Please try again or email us directly.");
    } finally {
      inFlight.current = false;
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
        ref={contactRef}
        onMouseMove={handleContactMove}
        className="contact-stage"
        style={{ padding: "0 32px 96px", maxWidth: 1280, margin: "0 auto", position: "relative" }}
      >
        <div className="contact-grid-lines" aria-hidden="true">
          <span className="contact-node node-one" />
          <span className="contact-node node-two" />
          <span className="contact-node node-three" />
          <span className="contact-node node-four" />
          <span className="contact-node node-five" />
        </div>
        <div className="contact-grid-layout">
          {/* Left: information */}
          <div className="fade-up d3 contact-left">
            <ContactBlock label="DIRECT">
              <a className="contact-email" href="mailto:mobilon.bu@bennett.edu.in">
                mobilon.bu@bennett.edu.in <span>↗</span>
              </a>
            </ContactBlock>

            <ContactBlock label="VISIT">
              <address className="contact-address">
                <a href="https://www.google.com/maps/search/?api=1&query=Bennett%20University%2C%20Plot%208-11%2C%20TechZone%20II%2C%20Greater%20Noida" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                <strong>Bennett University</strong>
                Plot No 8–11, TechZone II<br />
                Greater Noida, UP
                </a>
              </address>
            </ContactBlock>

            <ContactBlock label="FOLLOW">
              <div className="social-links">
                <a href="https://www.linkedin.com/company/mobilon-bu/" target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a>
                <a href="https://www.instagram.com/mobilon_bu/" target="_blank" rel="noopener noreferrer">Instagram <span>↗</span></a>
                <a href="https://github.com/Mobilon-Mobile-Technologies" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a>
              </div>
            </ContactBlock>
          </div>

          {/* Right: form */}
          <div className="fade-up d4 contact-form-column">
            {!submitted ? (
              <>
                {/* Inquiry type */}
                <div className="inquiry-index">
                  <div className="eyebrow" style={{ marginBottom: 24 }}>START A CONVERSATION</div>
                  {CONTACT_TYPES.map((t, index) => (
                    <button
                      key={t.id}
                      className={`inquiry-row${activeType === t.id ? " active" : ""}`}
                      onClick={() => setActiveType(t.id)}
                      type="button"
                      aria-pressed={activeType === t.id}
                      disabled={sending}
                    >
                      <span className="inquiry-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="inquiry-label">{t.label}</span>
                      <span className="inquiry-arrow">→</span>
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="contact-form" aria-busy={sending}>
                  <div hidden aria-hidden="true">
                    <label htmlFor="contact-website">Leave this field empty</label>
                    <input ref={websiteRef} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="form-row">
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
                    <div className="submit-error" role="alert">
                      <p>{submitError}</p>
                      <a
                        href={`mailto:mobilon.bu@bennett.edu.in?subject=${encodeURIComponent(subjectForMail(activeType, formState.name))}&body=${encodeURIComponent(messageForMail(activeType, formState))}`}
                      >
                        Email Mobilon directly ↗
                      </a>
                    </div>
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
                className="success-state"
                role="status"
                tabIndex={-1}
                ref={(node) => node?.focus({ preventScroll: true })}
              >
                <div className="eyebrow" style={{ marginBottom: 20 }}>MESSAGE RECEIVED</div>
                <h2>
                  Thanks, {formState.name || "there"}.
                </h2>
                <p>
                  Your message has reached Mobilon.<br />
                  We&apos;ll get back to you as soon as we can.
                </p>
                <button type="button" className="arrow-link" onClick={() => navigate("home")}>
                  Back to Home <span className="arrow">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="recruitment-strip">
        <div>
          <div className="eyebrow">LOOKING TO JOIN MOBILON?</div>
          <p>Recruitment opens during the academic year. Follow Mobilon for announcements.</p>
        </div>
        <a href="https://www.instagram.com/mobilon_bu/" target="_blank" rel="noopener noreferrer">Instagram <span>↗</span></a>
      </div>

      <style>{`
        .contact-stage { --contact-x: 70%; --contact-y: 35%; }
        .contact-stage::after {
          content: "";
          position: absolute;
          inset: 0 0 24px;
          pointer-events: none;
          background: radial-gradient(420px circle at var(--contact-x) var(--contact-y), rgba(124,58,237,0.08), transparent 72%);
          opacity: 0.75;
        }
        .contact-grid-layout { position: relative; z-index: 1; display: grid; grid-template-columns: 2fr 3fr; gap: 80px; }
        .contact-left { padding-top: 4px; }
        .contact-block { margin-bottom: 52px; }
        .contact-email, .social-links a, .recruitment-strip a { color: rgba(248,250,252,0.82); text-decoration: none; transition: color 0.2s; }
        .contact-email { font: 600 17px 'Manrope', sans-serif; display: inline-flex; gap: 12px; align-items: center; }
        .contact-email span, .social-links span, .recruitment-strip span { color: var(--violet-soft); }
        .contact-email:hover, .social-links a:hover, .recruitment-strip a:hover { color: #F8FAFC; }
        .contact-address { font: 14px/1.8 'Manrope', sans-serif; color: var(--muted); font-style: normal; }
        .contact-address strong { display: block; color: #F8FAFC; font-size: 16px; margin-bottom: 4px; }
        .social-links { display: flex; flex-wrap: wrap; gap: 22px; font: 13px 'Manrope', sans-serif; }
        .social-links a { display: inline-flex; gap: 6px; }
        .inquiry-index { margin-bottom: 52px; }
        .inquiry-row { width: 100%; display: grid; grid-template-columns: 40px 1fr 24px; gap: 14px; align-items: center; padding: 13px 0; border: 0; border-bottom: 1px solid rgba(148,163,184,0.2); background: transparent; color: var(--muted); cursor: pointer; text-align: left; transition: color 0.25s, border-color 0.25s, text-shadow 0.25s; }
        .inquiry-row:hover, .inquiry-row.active { color: #F8FAFC; border-bottom-color: rgba(139,92,246,0.8); text-shadow: 0 0 18px rgba(124,58,237,0.4); }
        .inquiry-number { font: 11px 'DM Mono', monospace; color: var(--indigo); }
        .inquiry-label { font: 600 14px 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: 0.04em; }
        .inquiry-arrow { text-align: right; color: var(--violet-soft); opacity: 0; transform: translateX(-8px); transition: opacity 0.25s, transform 0.25s; }
        .inquiry-row:hover .inquiry-arrow, .inquiry-row.active .inquiry-arrow { opacity: 1; transform: translateX(0); }
        .contact-form { display: flex; flex-direction: column; gap: 24px; }
        .contact-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .submit-error { font: 13px/1.6 'Manrope', sans-serif; color: #FCA5A5; }
        .submit-error p { margin: 0 0 8px; }
        .submit-error a { color: var(--violet-soft); text-decoration: none; }
        .submit-error a:hover { color: #F8FAFC; }
        .success-state { padding: 34px 0; }
        .success-state h2 { font: 800 32px 'Manrope', sans-serif; letter-spacing: -0.02em; color: #F8FAFC; margin: 0 0 16px; }
        .success-state p { font: 15px/1.7 'Manrope', sans-serif; color: var(--muted); margin: 0 0 28px; }
        .recruitment-strip { max-width: 1216px; margin: 0 auto; padding: 28px 32px 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: end; gap: 24px; }
        .recruitment-strip p { font: 14px 'Manrope', sans-serif; color: var(--muted); margin: 10px 0 0; }
        .recruitment-strip a { font: 11px 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
        .contact-grid-lines { position: absolute; inset: 20px 3% 40px 42%; opacity: 0.07; pointer-events: none; background: linear-gradient(24deg, transparent 49.7%, var(--violet-soft) 50%, transparent 50.3%), linear-gradient(0deg, transparent 49.8%, var(--violet-soft) 50%, transparent 50.2%); }
        .contact-node { position: absolute; width: 7px; height: 7px; border: 1px solid var(--violet-soft); border-radius: 50%; background: var(--bg); box-shadow: 0 0 10px var(--violet-soft); }
        .node-one { top: 18%; left: 18%; } .node-two { top: 18%; left: 62%; } .node-three { top: 50%; left: 42%; } .node-four { top: 72%; left: 78%; } .node-five { top: 72%; left: 22%; }
        @media (max-width: 900px) { .contact-grid-layout { grid-template-columns: 1fr; gap: 64px; } .contact-grid-lines { inset: 50% 0 40px; } }
        @media (max-width: 560px) { .contact-form .form-row { grid-template-columns: 1fr; gap: 24px; } .recruitment-strip { align-items: flex-start; flex-direction: column; } .social-links { gap: 14px; } }
      `}</style>
    </div>
  );
}

function ContactBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="contact-block">
      <div className="eyebrow" style={{ marginBottom: 18 }}>{label}</div>
      {children}
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
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(148,163,184,0.32)",
    borderRadius: 0,
    padding: "10px 0 13px",
    fontFamily: "'Manrope', sans-serif",
    fontSize: 14,
    color: "#F8FAFC",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
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
          marginBottom: 2,
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
          minLength={10}
          maxLength={5000}
          required
          style={{ ...baseStyle, resize: "vertical", minHeight: 96 }}
          onFocus={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderBottomColor = "var(--violet-soft)")}
          onBlur={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderBottomColor = "rgba(148,163,184,0.32)")}
        />
      ) : (
        <input
          id={id}
          type={type}
          minLength={id === "name" ? 2 : undefined}
          maxLength={id === "name" ? 100 : id === "email" ? 254 : 150}
          autoComplete={id === "name" ? "name" : id === "email" ? "email" : "organization"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={type !== "text" || id !== "org"}
          style={baseStyle}
          onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderBottomColor = "var(--violet-soft)")}
          onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderBottomColor = "rgba(148,163,184,0.32)")}
        />
      )}
    </div>
  );
}
