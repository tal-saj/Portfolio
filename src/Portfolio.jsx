import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const DATA = {
  name: "Tallal Sajid",
  title: "Full-Stack Developer",
  tagline: "I build digital experiences that live at the intersection of performance and design.",
  email: "talalkhan4860@gmail.com",
  github: "https://github.com/tal-saj",
  linkedin: "https://www.linkedin.com/in/tallal-sajid",
  about: `I'm a developer obsessed with clean architecture, pixel-perfect UI, and shipping things that actually work. With 4+ years crafting web applications, I bridge the gap between complex backend systems and intuitive frontends. When I'm not coding, I'm exploring generative art and open-source tooling.`,
  skills: [
    { cat: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { cat: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL"] },
    { cat: "DevOps", items: ["Docker", "AWS", "CI/CD", "Vercel", "Linux"] },
    { cat: "Tools", items: ["Git", "Figma", "VS Code", "Postman"] },
  ],
  skillLevels: [
    { label: "React / Next.js", pct: 92 },
    { label: "Node.js / APIs", pct: 88 },
    { label: "TypeScript", pct: 80 },
    { label: "Databases", pct: 78 },
    { label: "DevOps / Cloud", pct: 65 },
  ],
  projects: [
    { id: 1, title: "Hostel Hub", desc: "A platform that helps people easily find, compare, and choose the perfect hostel based on their needs.", tags: ["MongoDB", "ExpressJS", "React", "Node.js"], url: "https://hostelhub-frontend-tau.vercel.app/", repo: "https://github.com/tal-saj/hostelhub-frontend" },
    { id: 2, title: "Chat UP", desc: "Real-time messaging platform that lets people connect and build conversations effortlessly.", tags: ["Next.js", "MongoDB", "Vercel"], url: "https://chat-up-frontend-three.vercel.app/", repo: "https://github.com/tal-saj/ChatUp" },
    { id: 3, title: "Quick Mealz", desc: "Portfolio site for a client showcasing a platform that makes discovering delicious meals fast and convenient.", tags: ["Next.js", "React", "Tailwind"], url: "https://quickmealz.vercel.app/", repo: "https://github.com/tal-saj/Quickmealz" },
    { id: 4, title: "Kouba UK", desc: "Portfolio website for a client to showcase their brand, services, and offerings in a clear and engaging way.", tags: ["HTML", "CSS", "JS"], url: "#", repo: "https://github.com/tal-saj/kouba.uk" },
  ],
  experience: [
    { role: "Junior Web Developer", company: "ScriptExp Private Limited", period: "Aug 2025 – Present", desc: "Worked on 5+ web applications, collaborated with a team of 10+ developers, and fixed 18+ bugs while writing clean and efficient code." },
    { role: "Freelancer & Vibe Coder", company: "Remote", period: "jun 2024 – Aug 2025", desc: "Developed and contributed in 10+ projects across platforms." },
    { role: "Backend Developer & Marketing Analyst", company: "Raqqmayya", period: "Feb 2024 – Jun 2024", desc: "Developed backend logic and researched best marketing techniques for clients." },
  ],
  stats: [
    { label: "Projects Shipped", value: "10+" },
    { label: "Years Coding", value: "4+" },
    { label: "Technologies", value: "20+" },
    { label: "Happy Clients", value: "8+" },
  ],
};

const NAV_ITEMS = ["Home", "About", "Projects", "Experience", "Contact"];
const CYAN = "#00ffc8";

// ── Mouse spotlight + particle canvas ────────────────────────────────────────
function MouseCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles
    for (let i = 0; i < 80; i++) {
      particles.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const onMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spotlight glow following cursor
      const grd = ctx.createRadialGradient(mouse.current.x, mouse.current.y, 0, mouse.current.x, mouse.current.y, 280);
      grd.addColorStop(0, "rgba(0,255,200,0.06)");
      grd.addColorStop(1, "rgba(0,255,200,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      const pts = particles.current;
      pts.forEach((p) => {
        // Drift toward mouse slightly
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += (dx / dist) * 0.012;
          p.vy += (dy / dist) * 0.012;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,200,${p.alpha})`;
        ctx.fill();
      });

      // Connection lines between nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,255,200,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

// ── Custom cursor ─────────────────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full" style={{ background: CYAN }} />
      <div ref={ringRef} className="fixed top-0 left-0 z-[9999] pointer-events-none w-9 h-9 rounded-full" style={{ border: `1px solid rgba(0,255,200,0.5)` }} />
    </>
  );
}

// ── Grid background ───────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", animation: "gridScroll 20s linear infinite" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,200,0.06) 0%, transparent 70%)" }} />
    </div>
  );
}

// ── Glitch text ───────────────────────────────────────────────────────────────
function GlitchText({ text }) {
  return (
    <span className="relative inline-block">
      {text}
      <span aria-hidden className="absolute inset-0 text-cyan-400 opacity-0" style={{ animation: "glitch1 4s infinite", clipPath: "polygon(0 20%,100% 20%,100% 40%,0 40%)" }}>{text}</span>
      <span aria-hidden className="absolute inset-0 text-fuchsia-500 opacity-0" style={{ animation: "glitch2 4s infinite 0.3s", clipPath: "polygon(0 60%,100% 60%,100% 80%,0 80%)" }}>{text}</span>
    </span>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function TypeWriter({ strings, speed = 70 }) {
  const [display, setDisplay] = useState("");
  const [si, setSi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const cur = strings[si];
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(cur.slice(0, ci + 1));
        if (ci + 1 === cur.length) setTimeout(() => setDeleting(true), 1800);
        else setCi((c) => c + 1);
      } else {
        setDisplay(cur.slice(0, ci - 1));
        if (ci - 1 === 0) { setDeleting(false); setSi((s) => (s + 1) % strings.length); }
        else setCi((c) => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [ci, deleting, si, strings, speed]);
  return <span>{display}<span className="animate-pulse" style={{ color: CYAN }}>|</span></span>;
}

// ── Skill badge ───────────────────────────────────────────────────────────────
function SkillBadge({ label }) {
  return (
    <span className="px-3 py-1 text-xs border rounded-sm" style={{ fontFamily: "'Space Mono',monospace", borderColor: "rgba(0,255,200,0.3)", color: "#67e8f9", background: "rgba(0,255,200,0.05)" }}>
      {label}
    </span>
  );
}

// ── Animated skill bar ────────────────────────────────────────────────────────
function SkillBar({ label, pct, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setWidth(pct), delay); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.6)" }}>{label}</span>
        <span className="text-xs" style={{ fontFamily: "'Space Mono',monospace", color: CYAN }}>{pct}%</span>
      </div>
      <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-px transition-all duration-1000 ease-out" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${CYAN}, #a855f7)` }} />
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div className="border rounded-lg p-5 text-center transition-all duration-300 group"
      style={{ borderColor: "rgba(0,255,200,0.12)", background: "rgba(0,255,200,0.03)" }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,200,0.4)"; e.currentTarget.style.background = "rgba(0,255,200,0.06)"; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,200,0.12)"; e.currentTarget.style.background = "rgba(0,255,200,0.03)"; }}>
      <p className="text-3xl font-black mb-1" style={{ color: CYAN }}>{value}</p>
      <p className="text-xs" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)" }}>{label}</p>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <div className="mb-12">
      <p className="text-xs tracking-[0.3em] mb-3 uppercase" style={{ fontFamily: "'Space Mono',monospace", color: CYAN }}>{label}</p>
      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{title}</h2>
      <div className="mt-4 h-px w-16" style={{ background: CYAN }} />
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border rounded-lg p-6 transition-all duration-300 overflow-hidden"
      style={{
        background: hovered ? "rgba(0,255,200,0.04)" : "rgba(255,255,255,0.02)",
        borderColor: hovered ? "rgba(0,255,200,0.4)" : "rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 0 40px rgba(0,255,200,0.1)" : "none",
      }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none" style={{ background: hovered ? "linear-gradient(225deg, rgba(0,255,200,0.15), transparent)" : "transparent", transition: "all 0.3s" }} />
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(0,255,200,0.6)" }}>{String(index + 1).padStart(2, "0")}</span>
        <div className="flex gap-3">
          <a href={project.repo} target="_blank" rel="noreferrer" className="text-xs transition-colors" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)" }}
            onMouseOver={(e) => e.target.style.color = CYAN} onMouseOut={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}>repo ↗</a>
          <a href={project.url} target="_blank" rel="noreferrer" className="text-xs transition-colors" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)" }}
            onMouseOver={(e) => e.target.style.color = CYAN} onMouseOut={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}>live ↗</a>
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>{project.desc}</p>
      <div className="flex flex-wrap gap-2">{project.tags.map((t) => <SkillBadge key={t} label={t} />)}</div>
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────────────
function TimelineItem({ item, last }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full border-2 mt-1 shrink-0" style={{ borderColor: CYAN, background: "rgba(0,255,200,0.3)" }} />
        {!last && <div className="flex-1 w-px mt-2" style={{ background: "rgba(255,255,255,0.08)" }} />}
      </div>
      <div className="pb-10">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h3 className="text-white font-bold text-lg">{item.role}</h3>
          <span className="text-sm" style={{ fontFamily: "'Space Mono',monospace", color: CYAN }}>@ {item.company}</span>
        </div>
        <p className="text-xs mb-3" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)" }}>{item.period}</p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{item.desc}</p>
      </div>
    </div>
  );
}

// ── Dot nav ───────────────────────────────────────────────────────────────────
function DotNav({ active, onDotClick }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-center">
      {NAV_ITEMS.map((n) => (
        <button key={n} onClick={() => onDotClick(n)} title={n} className="w-2 h-2 rounded-full transition-all duration-300"
          style={{ background: active === n ? CYAN : "rgba(255,255,255,0.25)", transform: active === n ? "scale(1.6)" : "scale(1)", boxShadow: active === n ? `0 0 8px rgba(0,255,200,0.7)` : "none" }} />
      ))}
    </div>
  );
}

// ── Floating tech orbs (hero decoration) ──────────────────────────────────────
function TechOrbs() {
  const orbs = ["⚛", "🔷", "🟩", "⬡", "◈", "⬢"];
  return (
    <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden hidden lg:block">
      {orbs.map((o, i) => (
        <div key={i} className="absolute text-2xl opacity-10"
          style={{
            right: `${10 + (i % 3) * 15}%`,
            top: `${15 + Math.floor(i / 3) * 35}%`,
            animation: `float${i % 3} ${4 + i}s ease-in-out infinite`,
            color: CYAN,
          }}>
          {o}
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const experienceRef = useRef(null);
  const contactRef = useRef(null);

  const sectionRefs = useMemo(() => ({
    Home: homeRef, About: aboutRef, Projects: projectsRef, Experience: experienceRef, Contact: contactRef,
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      setScrolled(container.scrollTop > 20);
      const offsets = NAV_ITEMS.map((n) => ({ name: n, top: sectionRefs[n].current?.getBoundingClientRect().top ?? 9999 }));
      const active = offsets.filter((o) => o.top <= 80).at(-1);
      if (active) setActiveNav(active.name);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [sectionRefs]);

  const scrollTo = useCallback((section) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, [sectionRefs]);

  const visibleProjects = showAll ? DATA.projects : DATA.projects.slice(0, 3);

  return (
    <div style={{ background: "#050a0e", fontFamily: "'Space Grotesk',sans-serif", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Space+Mono&display=swap');
        *, *::before, *::after { cursor: none !important; }
        @keyframes gridScroll { 0%{transform:translateY(0);} 100%{transform:translateY(60px);} }
        @keyframes glitch1 { 0%,90%,100%{opacity:0;transform:translateX(0);} 92%{opacity:0.6;transform:translateX(-4px);} 94%{opacity:0;} 96%{opacity:0.4;transform:translateX(4px);} 98%{opacity:0;} }
        @keyframes glitch2 { 0%,90%,100%{opacity:0;transform:translateX(0);} 91%{opacity:0.5;transform:translateX(3px);} 93%{opacity:0;} 95%{opacity:0.3;transform:translateX(-3px);} 97%{opacity:0;} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse-line { 0%,100%{opacity:0.3;} 50%{opacity:1;} }
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-18px) rotate(5deg);} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-12px) rotate(-4deg);} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-22px) rotate(8deg);} }
        @keyframes scanPulse { 0%{opacity:0.02;} 50%{opacity:0.05;} 100%{opacity:0.02;} }
        .fu1{animation:fadeUp 0.7s 0.00s ease both;}
        .fu2{animation:fadeUp 0.7s 0.15s ease both;}
        .fu3{animation:fadeUp 0.7s 0.30s ease both;}
        .fu4{animation:fadeUp 0.7s 0.45s ease both;}
        .fu5{animation:fadeUp 0.7s 0.60s ease both;}
        .snap-wrap { height:100vh; overflow-y:scroll; scroll-snap-type:y mandatory; scroll-behavior:smooth; }
        .snap-wrap::-webkit-scrollbar { width:3px; }
        .snap-wrap::-webkit-scrollbar-track { background:#050a0e; }
        .snap-wrap::-webkit-scrollbar-thumb { background:rgba(0,255,200,0.25); border-radius:2px; }
        .snap-sec { scroll-snap-align:start; scroll-snap-stop:always; min-height:100vh; position:relative; display:flex; align-items:center; }
        .glow-text { text-shadow: 0 0 30px rgba(0,255,200,0.4); }
      `}</style>

      {/* Layers */}
      <GridBg />
      <MouseCanvas />
      <Cursor />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)", animation: "scanPulse 8s ease infinite" }} />

      <DotNav active={activeNav} onDotClick={scrollTo} />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? "rgba(5,10,14,0.92)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("Home")} className="font-black text-xl tracking-tight text-white" style={{ fontFamily: "'Space Mono',monospace" }}>
            <span style={{ color: CYAN }}>&lt;</span>Tallal<span style={{ color: CYAN }}>/&gt;</span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((n) => (
              <button key={n} onClick={() => scrollTo(n)} className="px-4 py-2 text-sm rounded transition-all duration-200"
                style={{ fontFamily: "'Space Mono',monospace", color: activeNav === n ? CYAN : "rgba(255,255,255,0.5)", background: activeNav === n ? "rgba(0,255,200,0.08)" : "transparent" }}>
                {n}
              </button>
            ))}
            <a href={`mailto:${DATA.email}`} className="ml-4 px-5 py-2 text-sm border rounded transition-all duration-200"
              style={{ fontFamily: "'Space Mono',monospace", borderColor: CYAN, color: CYAN }}
              onMouseOver={(e) => { e.target.style.background = CYAN; e.target.style.color = "#000"; }}
              onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = CYAN; }}>
              Hire Me
            </a>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen((o) => !o)}>
            <div className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-px w-6 bg-white" style={{ transition: "transform 0.2s", transform: menuOpen ? (i === 0 ? "rotate(45deg) translateY(4px)" : i === 2 ? "rotate(-45deg) translateY(-4px)" : "scaleX(0)") : "none" }} />
              ))}
            </div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-6" style={{ background: "rgba(5,10,14,0.97)" }}>
            {NAV_ITEMS.map((n) => (
              <button key={n} onClick={() => scrollTo(n)} className="block w-full text-left py-3 text-sm border-b"
                style={{ fontFamily: "'Space Mono',monospace", borderColor: "rgba(255,255,255,0.05)", color: activeNav === n ? CYAN : "rgba(255,255,255,0.6)" }}>{n}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── SNAP CONTAINER ── */}
      <div ref={containerRef} className="snap-wrap">

        {/* HERO */}
        <section ref={homeRef} className="snap-sec px-6">
          <TechOrbs />
          <div className="max-w-6xl mx-auto w-full pt-16 relative z-10">
            <p className="fu1 text-xs tracking-[0.4em] mb-6" style={{ opacity: 0, fontFamily: "'Space Mono',monospace", color: CYAN }}>
              ◈ AVAILABLE FOR WORK
            </p>
            <h1 className="fu2 text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 text-white glow-text" style={{ opacity: 0 }}>
              <GlitchText text={DATA.name} />
            </h1>
            <div className="fu3 text-xl md:text-3xl font-light mb-8" style={{ opacity: 0, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono',monospace" }}>
              <TypeWriter strings={["Full-Stack Developer", "UI/UX Enthusiast", "Open Source Contributor", "Problem Solver"]} />
            </div>
            <p className="fu4 max-w-xl text-lg leading-relaxed mb-10" style={{ opacity: 0, color: "rgba(255,255,255,0.5)" }}>{DATA.tagline}</p>

            {/* Stats row */}
            <div className="fu4 grid grid-cols-4 gap-3 max-w-lg mb-10" style={{ opacity: 0 }}>
              {DATA.stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            <div className="fu5 flex flex-wrap gap-4" style={{ opacity: 0 }}>
              <button onClick={() => scrollTo("Projects")} className="px-8 py-3 text-sm font-bold text-black rounded transition-all duration-200 hover:scale-105"
                style={{ fontFamily: "'Space Mono',monospace", background: CYAN }}>
                View Projects →
              </button>
              <button onClick={() => scrollTo("Contact")} className="px-8 py-3 text-sm rounded transition-all duration-200"
                style={{ fontFamily: "'Space Mono',monospace", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                onMouseOver={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; e.target.style.color = "#fff"; }}
                onMouseOut={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}>
                Get In Touch
              </button>
            </div>
            <div className="fu5 flex gap-5 mt-8" style={{ opacity: 0 }}>
              {[{ label: "GitHub", url: DATA.github }, { label: "LinkedIn", url: DATA.linkedin }].map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="text-xs transition-colors"
                  style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.3)" }}
                  onMouseOver={(e) => e.target.style.color = CYAN} onMouseOut={(e) => e.target.style.color = "rgba(255,255,255,0.3)"}>{s.label} ↗</a>
              ))}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="text-xs" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.2)" }}>scroll</span>
            <div className="w-px h-10" style={{ background: `linear-gradient(to bottom,rgba(0,255,200,0.5),transparent)`, animation: "pulse-line 2s ease infinite" }} />
          </div>
        </section>

        {/* ABOUT */}
        <section ref={aboutRef} className="snap-sec px-6">
          <div className="max-w-6xl mx-auto w-full py-16">
            <SectionHeader label="01 / About" title="Who I Am" />
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="leading-relaxed text-lg mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>{DATA.about}</p>
                <a href="https://drive.google.com/file/d/1dv-yU2A7xhgnFWp5iGo-BTHwZeozgSB2/view?usp=sharings"
                  target="_blank" rel="noreferrer" className="text-sm pb-1 transition-colors"
                  style={{ fontFamily: "'Space Mono',monospace", color: CYAN, borderBottom: "1px solid rgba(0,255,200,0.4)" }}>
                  Download Résumé ↗
                </a>
                {/* Skill level bars */}
                <div className="mt-10">
                  <p className="text-xs mb-5 tracking-widest uppercase" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.3)" }}>Proficiency</p>
                  {DATA.skillLevels.map((s, i) => <SkillBar key={s.label} label={s.label} pct={s.pct} delay={i * 120} />)}
                </div>
              </div>
              <div className="space-y-8">
                {DATA.skills.map((group) => (
                  <div key={group.cat}>
                    <p className="text-xs mb-3 tracking-widest uppercase" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.3)" }}>{group.cat}</p>
                    <div className="flex flex-wrap gap-2">{group.items.map((s) => <SkillBadge key={s} label={s} />)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section ref={projectsRef} className="snap-sec px-6">
          <div className="max-w-6xl mx-auto w-full py-16">
            <SectionHeader label="02 / Projects" title="Things I've Built" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProjects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
            {!showAll && DATA.projects.length > 3 && (
              <div className="mt-10 text-center">
                <button onClick={() => setShowAll(true)} className="text-sm px-8 py-3 rounded transition-all duration-200"
                  style={{ fontFamily: "'Space Mono',monospace", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }}
                  onMouseOver={(e) => { e.target.style.borderColor = "rgba(0,255,200,0.5)"; e.target.style.color = CYAN; }}
                  onMouseOut={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}>
                  Show All Projects ({DATA.projects.length})
                </button>
              </div>
            )}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section ref={experienceRef} className="snap-sec px-6">
          <div className="max-w-3xl mx-auto w-full py-16">
            <SectionHeader label="03 / Experience" title="Where I've Worked" />
            {DATA.experience.map((item, i) => (
              <TimelineItem key={i} item={item} last={i === DATA.experience.length - 1} />
            ))}
            {/* Terminal-style code block decoration */}
            <div className="mt-8 border rounded-lg p-5" style={{ borderColor: "rgba(0,255,200,0.12)", background: "rgba(0,0,0,0.3)" }}>
              <div className="flex gap-2 mb-4">
                {["#ff5f57","#ffbd2e","#28c840"].map((c) => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8" }}>
                <span style={{ color: "#a855f7" }}>const</span> <span style={{ color: CYAN }}>developer</span> = {"{"}<br />
                &nbsp;&nbsp;<span style={{ color: "#fbbf24" }}>passion</span>: <span style={{ color: "#86efac" }}>"building things that matter"</span>,<br />
                &nbsp;&nbsp;<span style={{ color: "#fbbf24" }}>status</span>: <span style={{ color: "#86efac" }}>"open to opportunities"</span>,<br />
                &nbsp;&nbsp;<span style={{ color: "#fbbf24" }}>coffee</span>: <span style={{ color: "#f87171" }}>Infinity</span><br />
                {"}"}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section ref={contactRef} className="snap-sec px-6">
          <div className="max-w-3xl mx-auto w-full py-16 text-center">
            <SectionHeader label="04 / Contact" title="Let's Work Together" />
            <p className="text-lg leading-relaxed mb-12 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              I'm currently open to new opportunities. Whether you have a project in mind or just want to say hello, my inbox is always open.
            </p>
            <a href={`mailto:${DATA.email}`} className="inline-block px-12 py-4 font-bold text-black rounded transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "'Space Mono',monospace", background: CYAN, boxShadow: "0 0 40px rgba(0,255,200,0.3)" }}>
              Say Hello →
            </a>

            {/* Contact cards */}
            <div className="grid grid-cols-3 gap-4 mt-14 max-w-md mx-auto">
              {[
                { label: "GitHub", url: DATA.github, icon: "⌥" },
                { label: "LinkedIn", url: DATA.linkedin, icon: "◈" },
                { label: "Email", url: `mailto:${DATA.email}`, icon: "✉" },
              ].map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                  className="border rounded-lg py-4 px-2 flex flex-col items-center gap-2 transition-all duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,200,0.4)"; e.currentTarget.style.color = CYAN; e.currentTarget.style.background = "rgba(0,255,200,0.04)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ fontSize: "18px" }}>{s.icon}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px" }}>{s.label}</span>
                </a>
              ))}
            </div>

            <p className="text-xs mt-14" style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.12)" }}>
              © {new Date().getFullYear()} {DATA.name}. Built with React + Tailwind CSS.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}