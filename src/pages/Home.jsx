// /src/pages/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { THEME, Card, Button, Tag } from "../components/ui";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <AnimatedBackdrop />
      <Header />
      <main style={{ width: "100%", padding: "0 16px 32px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1150, margin: "0 auto", display: "grid", gap: 24 }}>
          <Hero />
          <RoleQuickStarts />
          <FeatureTiles />
          <HowItWorks />
          <FAQ />
          <BottomCTA />
        </div>
      </main>
    </div>
  );
}

/* --------------------------- Header --------------------------- */
function Header() {
  return (
    <header
      style={{
        maxWidth: 1150,
        margin: "0 auto",
        padding: "18px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          aria-label="Qboxai"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: THEME.primary,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
          }}
        >
          Q
        </div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Qboxai</div>
    
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a href="#features" style={{ color: THEME.subtext, textDecoration: "none", fontSize: 14 }}>Features</a>
        <a href="#how" style={{ color: THEME.subtext, textDecoration: "none", fontSize: 14 }}>How it works</a>
        <a href="#faq" style={{ color: THEME.subtext, textDecoration: "none", fontSize: 14 }}>FAQ</a>
      </nav>

      <div style={{ display: "flex", gap: 8 }}>
        <Link to="/signin"><Button variant="soft">Sign in</Button></Link>
        <Link to="/signup"><Button>Sign up</Button></Link>
      </div>
    </header>
  );
}

/* --------------------------- Hero --------------------------- */
function Hero() {
  return (
    <Card
      style={{
        padding: 40,
        background: "linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
      right={<span />}
      title={
        <span style={{ fontSize: 36, fontWeight: 900 }}>
          Make your school, <span style={{ color: THEME.primary }}>AI Tech School</span>
        </span>
      }
    
    >
      <GlowRings />
      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        <SubTagline />
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/signup"><Button className="pulse-btn">Get started — Sign up</Button></Link>
          <Link to="/signin"><Button variant="soft">I already have an account</Button></Link>
          <a href="#how" style={{ textDecoration: "none" }}><Button variant="soft">See how it works</Button></a>
        </div>
        <style>{`
          .pulse-btn { position: relative; }
          .pulse-btn::after {
            content: ""; position: absolute; inset: -2px; border-radius: 14px; border: 2px solid rgba(43,108,255,.25);
            animation: pulse 2.4s ease-out infinite; pointer-events: none;
          }
          @keyframes pulse { 0%{opacity:0; transform:scale(.95)} 40%{opacity:1} 100%{opacity:0; transform:scale(1.15)} }
        `}</style>
      </div>
    </Card>
  );
}

function SubTagline() {
  return (
    <div
      aria-label="AI tagline"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: THEME.primarySoft,
        border: `1px solid ${THEME.primary}`,
        borderRadius: 999,
        padding: "10px 14px",
        fontSize: 16,
        fontWeight: 700,
        color: THEME.primary,
        boxShadow: "0 6px 16px rgba(56,130,255,0.15)",
        animation: "bounceIn 900ms ease",
      }}
    >
      <span role="img" aria-hidden>✨</span>
      <span>Personal AI Tutor for every student — auto-generated practice and clear mastery tracking.</span>
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* --------------------- Quick starts by role --------------------- */
function RoleQuickStarts() {
  const items = useMemo(
    () => [
      { emoji: "🏫", label: "School Admin", hint: "Assign teachers • track mastery • trigger remedials", to: "/school" },
      { emoji: "🧑‍🏫", label: "Teacher", hint: "Edit syllabus • generate practice • notify class", to: "/teacher" },
      { emoji: "🧑‍🎓", label: "Student", hint: "Self-practice • flashcards • interview prep", to: "/student" },
      { emoji: "👨‍👩‍👧", label: "Parent", hint: "See progress • get reminders • support learning", to: "/parent" },
    ],
    []
  );

  return (
    <Card title="Quick starts" subtitle="Pick your role to dive in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {items.map((it) => <RoleTile key={it.label} {...it} />)}
      </div>
    </Card>
  );
}
function RoleTile({ emoji, label, hint, to }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#fff",
          border: `1px solid ${THEME.border}`,
          borderRadius: 16,
          padding: 14,
          display: "grid",
          gap: 6,
          transition: "transform .15s ease, box-shadow .15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <div style={{ fontSize: 22 }}>{emoji}</div>
        <div style={{ fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 12, color: THEME.subtext }}>{hint}</div>
      </div>
    </Link>
  );
}

/* --------------------------- Features --------------------------- */
function FeatureTiles() {
  const items = [
    { title: "Syllabus-first workflow", text: "Terms → chapters → topics. Generate content per topic, chapter, or full subject." },
    { title: "Multi-format practice", text: "MCQs for speed, flashcards for recall, interview questions for depth — one click." },
    { title: "Smart assignments", text: "Send to class or selected students. Attach generated items and due dates, instantly." },
    { title: "Mastery tracking", text: "Live class dashboards + individual tracks. Spot weak topics quickly." },
  ];
  return (
    <Card id="features" title="Why schools choose Qboxai" subtitle="Fast to set up • Loved by teachers • Clear for students">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {items.map((x, i) => <AnimatedFeatureCard key={i} title={x.title} text={x.text} />)}
      </div>
    </Card>
  );
}
function AnimatedFeatureCard({ title, text }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = 0; el.style.transform = "translateY(20px)";
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transition = "all 0.6s ease-out";
        el.style.opacity = 1;
        el.style.transform = "translateY(0) scale(1.05)";
        setTimeout(() => (el.style.transform = "translateY(0) scale(1)"), 600);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        background: "#fff",
        border: `1px solid ${THEME.border}`,
        borderRadius: 20,
        padding: 20,
        minHeight: 150,
        display: "grid",
        gap: 8,
        fontSize: 16,
        fontWeight: 600,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, color: THEME.primary }}>{title}</div>
      <div style={{ color: THEME.subtext, fontSize: 14 }}>{text}</div>
    </div>
  );
}

/* ------------------------ How it Works ------------------------ */
function HowItWorks() {
  return (
    <Card id="how" title="How Qboxai Works" subtitle="Simple steps to get everyone moving" style={{ padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <Step num="1" title="Create your account">Admins create the school. Others join by email or invite link.</Step>
        <Step num="2" title="Set up classes & syllabus">Add classes & subjects; organize terms, chapters, topics.</Step>
        <Step num="3" title="Generate & assign">Generate MCQs/flashcards/interview items and assign instantly.</Step>
        <Step num="4" title="Track & improve">Watch mastery rise. Trigger remedials for weak topics.</Step>
      </div>
    </Card>
  );
}

/* ------------------------------ FAQ ------------------------------ */
function FAQ() {
  const items = [
    { q: "Does Qboxai support mixed difficulty sets?", a: "Yes. Choose Easy/Medium/Hard or Mixed when generating content." },
    { q: "Can I notify parents as well as students?", a: "Absolutely. Notify students, parents, or both — with attachments." },
    { q: "How do knowledge tracks work?", a: "We aggregate topic mastery from assigned and self-practice sources." },
  ];
  return (
    <Card id="faq" title="Frequently asked questions" subtitle="Quick answers">
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((it, i) => <Accordion key={i} q={it.q} a={it.a} />)}
      </div>
    </Card>
  );
}
function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 12 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between",
          gap: 10, background: "transparent", border: "none", padding: 0, fontWeight: 700, cursor: "pointer",
        }}
      >
        <span>{q}</span>
        <span style={{ color: THEME.subtext }}>{open ? "–" : "+"}</span>
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .2s ease",
          color: THEME.subtext, marginTop: open ? 8 : 0, fontSize: 14,
        }}
      >
        {a}
      </div>
    </div>
  );
}

/* ---------------------------- Bottom CTA ---------------------------- */
function BottomCTA() {
  return (
    <Card
      title="Ready to make your school an AI Tech School?"
      subtitle="It takes ~2 minutes to get started — invite your team anytime."
      right={<Tag tone="info">Privacy-minded</Tag>}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Link to="/signup"><Button>Create a free account</Button></Link>
        <Link to="/signin"><Button variant="soft">Sign in</Button></Link>
      </div>
    </Card>
  );
}

/* ===================== Small building blocks ===================== */
function Step({ num, title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${THEME.border}`,
        borderRadius: 14,
        padding: 14,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          aria-label={`Step ${num}`}
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: THEME.primary,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {num}
        </div>
        <div style={{ fontWeight: 700 }}>{title}</div>
      </div>
      <div style={{ color: THEME.subtext, fontSize: 14 }}>{children}</div>
    </div>
  );
}

/* ----------------------- Animated background ----------------------- */
function AnimatedBackdrop() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(56,130,255,0.15) 0%, rgba(56,130,255,0) 60%)",
          zIndex: 0,
        }}
      />
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <style>{`
        .blob { position: absolute; width: 420px; height: 420px; filter: blur(60px);
                border-radius: 50%; opacity: .35; z-index: 0; pointer-events: none; }
        .blob-a { left: -120px; top: 120px;
                  background: radial-gradient(circle at 30% 30%, #8ab6ff, transparent 60%);
                  animation: drift1 18s ease-in-out infinite; }
        .blob-b { right: -160px; top: 220px;
                  background: radial-gradient(circle at 50% 50%, #b9e0ff, transparent 60%);
                  animation: drift2 22s ease-in-out infinite; }
        @keyframes drift1 { 0% { transform: translate(0,0) scale(1); }
                            50% { transform: translate(50px, -20px) scale(1.05); }
                            100% { transform: translate(0,0) scale(1); } }
        @keyframes drift2 { 0% { transform: translate(0,0) scale(1); }
                            50% { transform: translate(-60px, 40px) scale(1.07); }
                            100% { transform: translate(0,0) scale(1); } }
      `}</style>
    </>
  );
}

/* ----------------------- Glow rings helper ----------------------- */
function GlowRings() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: -40, right: -60, width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(90,164,255,.25), rgba(90,164,255,0))", filter: "blur(10px)",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -40, width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(43,108,255,.20), rgba(43,108,255,0))", filter: "blur(10px)",
      }} />
    </div>
  );
}
