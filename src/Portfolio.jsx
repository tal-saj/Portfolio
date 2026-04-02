import { useState, useEffect, useRef, useMemo } from "react";

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
  projects: [
    { id: 1, title: "Hostel Hub", desc: "Hostel Hub is a platform that helps people easily find, compare, and choose the perfect hostel based on their needs and preferences.", tags: ["MongoDB", "ExpressJS", "React", "Node.js"], url: "https://hostelhub-frontend-tau.vercel.app/", repo: "https://github.com/tal-saj/hostelhub-frontend" },
    { id: 2, title: "Chat UP", desc: "Chat Up is a platform that lets people connect, communicate, and build conversations effortlessly in real time.", tags: ["Next.js", "MongoDB", "Vercel"], url: "https://chat-up-frontend-three.vercel.app/", repo: "https://github.com/tal-saj/ChatUp" },
    { id: 3, title: "Quick Mealz", desc: "Quick Mealz is a portfolio website created for a client to showcase a platform that makes discovering and enjoying delicious meals fast, simple, and convenient.", tags: ["Next.js", "React", "Tailwind"], url: "https://quickmealz.vercel.app/", repo: "https://github.com/tal-saj/Quickmealz" },
    { id: 4, title: "Kouba UK", desc: "Kouba UK is a portfolio website created for a client to showcase their brand, services, and offerings in a clear and engaging way.", tags: ["Python", "Rich", "GitHub API"], url: "#", repo: "https://github.com/tal-saj/kouba.uk" },  ],
  experience: [
    { role: "Freelancer and Vibe Coder", company: "Remote", period: "2024 – Present", desc: "Developed and contributed in 10+ Projects across platforms" },
    { role: "Backend Developer and Marketing Analyst", company: "Raqqmayya", period: "Feb 2024 – June 2024", desc: "Developed Backend logic and did research to find best marketing techniques for our clients" },
  ],
};

const NAV_ITEMS = ["Home", "About", "Projects", "Experience", "Contact"];

function GridBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "gridScroll 20s linear infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,200,0.07) 0%, transparent 70%)" }}
      />
    </div>
  );
}

function GlitchText({ text }) {
  return (
    <span className="relative inline-block">
      {text}
      <span aria-hidden className="absolute inset-0 text-cyan-400 opacity-0" style={{ animation: "glitch1 4s infinite", clipPath: "polygon(0 20%,100% 20%,100% 40%,0 40%)" }}>{text}</span>
      <span aria-hidden className="absolute inset-0 text-fuchsia-500 opacity-0" style={{ animation: "glitch2 4s infinite 0.3s", clipPath: "polygon(0 60%,100% 60%,100% 80%,0 80%)" }}>{text}</span>
    </span>
  );
}

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
  return <span>{display}<span className="animate-pulse text-cyan-400">|</span></span>;
}

function SkillBadge({ label }) {
  return (
    <span className="px-3 py-1 text-xs border border-cyan-500/30 text-cyan-300 rounded-sm" style={{ fontFamily: "'Space Mono',monospace", background: "rgba(0,255,200,0.05)" }}>
      {label}
    </span>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div className="mb-12">
      <p className="text-xs tracking-[0.3em] text-cyan-400 mb-3 uppercase" style={{ fontFamily: "'Space Mono',monospace" }}>{label}</p>
      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{title}</h2>
      <div className="mt-4 h-px w-16 bg-cyan-400" />
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border rounded-lg p-6 transition-all duration-300"
      style={{
        background: hovered ? "rgba(0,255,200,0.04)" : "rgba(255,255,255,0.02)",
        borderColor: hovered ? "rgba(0,255,200,0.4)" : "rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 0 30px rgba(0,255,200,0.08)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-cyan-400/60" style={{ fontFamily: "'Space Mono',monospace" }}>{String(index + 1).padStart(2, "0")}</span>
        <div className="flex gap-3">
          <a href={project.repo} className="text-xs text-white/40 hover:text-cyan-400 transition-colors" style={{ fontFamily: "'Space Mono',monospace" }}>repo ↗</a>
          <a href={project.url} className="text-xs text-white/40 hover:text-cyan-400 transition-colors" style={{ fontFamily: "'Space Mono',monospace" }}>live ↗</a>
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
      <p className="text-sm text-white/50 leading-relaxed mb-5">{project.desc}</p>
      <div className="flex flex-wrap gap-2">{project.tags.map((t) => <SkillBadge key={t} label={t} />)}</div>
    </div>
  );
}

function TimelineItem({ item, last }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full border-2 border-cyan-400 mt-1 shrink-0" style={{ background: "rgba(0,255,200,0.3)" }} />
        {!last && <div className="flex-1 w-px bg-white/10 mt-2" />}
      </div>
      <div className="pb-10">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h3 className="text-white font-bold text-lg">{item.role}</h3>
          <span className="text-cyan-400 text-sm" style={{ fontFamily: "'Space Mono',monospace" }}>@ {item.company}</span>
        </div>
        <p className="text-xs text-white/40 mb-3" style={{ fontFamily: "'Space Mono',monospace" }}>{item.period}</p>
        <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

function DotNav({ active, onDotClick }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {NAV_ITEMS.map((n) => (
        <button
          key={n}
          onClick={() => onDotClick(n)}
          title={n}
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            background: active === n ? "#00ffc8" : "rgba(255,255,255,0.25)",
            transform: active === n ? "scale(1.6)" : "scale(1)",
            boxShadow: active === n ? "0 0 8px rgba(0,255,200,0.7)" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

 const sectionRefs = useMemo(() => ({
  Home: useRef(null),
  About: useRef(null),
  Projects: useRef(null),
  Experience: useRef(null),
  Contact: useRef(null),
}), []);

   useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      setScrolled(container.scrollTop > 20);
      const offsets = NAV_ITEMS.map((n) => ({
        name: n,
        top: sectionRefs[n].current?.getBoundingClientRect().top ?? 9999,
      }));
      const active = offsets.filter((o) => o.top <= 80).at(-1);
      if (active) setActiveNav(active.name);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [sectionRefs]);

  const scrollTo = (section) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const visibleProjects = showAll ? DATA.projects : DATA.projects.slice(0, 3);

  return (
    <div style={{ background: "#050a0e", fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Space+Mono&display=swap');
        @keyframes gridScroll { 0%{transform:translateY(0);} 100%{transform:translateY(60px);} }
        @keyframes glitch1 { 0%,90%,100%{opacity:0;transform:translateX(0);} 92%{opacity:0.6;transform:translateX(-4px);} 94%{opacity:0;} 96%{opacity:0.4;transform:translateX(4px);} 98%{opacity:0;} }
        @keyframes glitch2 { 0%,90%,100%{opacity:0;transform:translateX(0);} 91%{opacity:0.5;transform:translateX(3px);} 93%{opacity:0;} 95%{opacity:0.3;transform:translateX(-3px);} 97%{opacity:0;} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse-line { 0%,100%{opacity:0.3;} 50%{opacity:1;} }
        .fu1{animation:fadeUp 0.7s 0.00s ease both;}
        .fu2{animation:fadeUp 0.7s 0.15s ease both;}
        .fu3{animation:fadeUp 0.7s 0.30s ease both;}
        .fu4{animation:fadeUp 0.7s 0.45s ease both;}
        .fu5{animation:fadeUp 0.7s 0.60s ease both;}
        .snap-wrap {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .snap-wrap::-webkit-scrollbar { width: 3px; }
        .snap-wrap::-webkit-scrollbar-track { background: #050a0e; }
        .snap-wrap::-webkit-scrollbar-thumb { background: rgba(0,255,200,0.25); border-radius: 2px; }
        .snap-sec {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
        }
      `}</style>

      <GridBg />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)" }} />

      <DotNav active={activeNav} onDotClick={scrollTo} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? "rgba(5,10,14,0.92)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("Home")} className="font-black text-xl tracking-tight text-white" style={{ fontFamily: "'Space Mono',monospace" }}>
            <span style={{ color: "#00ffc8" }}>&lt;</span>{DATA.name.split(" ")[0]}<span style={{ color: "#00ffc8" }}>/&gt;</span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((n) => (
              <button key={n} onClick={() => scrollTo(n)} className="px-4 py-2 text-sm rounded transition-all duration-200" style={{ fontFamily: "'Space Mono',monospace", color: activeNav === n ? "#00ffc8" : "rgba(255,255,255,0.5)", background: activeNav === n ? "rgba(0,255,200,0.08)" : "transparent" }}>
                {n}
              </button>
            ))}
            <a href={`mailto:${DATA.email}`} className="ml-4 px-5 py-2 text-sm border rounded transition-all duration-200" style={{ fontFamily: "'Space Mono',monospace", borderColor: "#00ffc8", color: "#00ffc8" }}
              onMouseOver={(e) => { e.target.style.background="#00ffc8"; e.target.style.color="#000"; }}
              onMouseOut={(e) => { e.target.style.background="transparent"; e.target.style.color="#00ffc8"; }}>
              Hire Me
            </a>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen((o) => !o)}>
            <div className="space-y-1.5">
              {[0,1,2].map((i) => (
                <div key={i} className="h-px w-6 bg-white" style={{ transition: "transform 0.2s", transform: menuOpen ? (i===0?"rotate(45deg) translateY(4px)":i===2?"rotate(-45deg) translateY(-4px)":"scaleX(0)") : "none" }} />
              ))}
            </div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-6" style={{ background: "rgba(5,10,14,0.97)" }}>
            {NAV_ITEMS.map((n) => (
              <button key={n} onClick={() => scrollTo(n)} className="block w-full text-left py-3 text-sm border-b" style={{ fontFamily: "'Space Mono',monospace", borderColor: "rgba(255,255,255,0.05)", color: activeNav===n?"#00ffc8":"rgba(255,255,255,0.6)" }}>{n}</button>
            ))}
          </div>
        )}
      </nav>

      {/* SNAP CONTAINER */}
      <div ref={containerRef} className="snap-wrap">

        {/* ── HERO ── */}
        <section ref={sectionRefs.Home} className="snap-sec px-6">
          <div className="max-w-6xl mx-auto w-full pt-16">
            <p className="fu1 text-xs tracking-[0.4em] mb-6" style={{ opacity:0, fontFamily:"'Space Mono',monospace", color:"#00ffc8" }}>AVAILABLE FOR WORK</p>
            <h1 className="fu2 text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 text-white" style={{ opacity: 0 }}>
              <GlitchText text={DATA.name} />
            </h1>
            <div className="fu3 text-2xl md:text-3xl font-light mb-8" style={{ opacity:0, color:"rgba(255,255,255,0.6)", fontFamily:"'Space Mono',monospace" }}>
              <TypeWriter strings={["Full-Stack Developer","UI/UX Enthusiast","Open Source Contributor","Problem Solver"]} />
            </div>
            <p className="fu4 max-w-xl text-lg leading-relaxed mb-12" style={{ opacity:0, color:"rgba(255,255,255,0.5)" }}>{DATA.tagline}</p>
            <div className="fu5 flex flex-wrap gap-4" style={{ opacity: 0 }}>
              <button onClick={() => scrollTo("Projects")} className="px-8 py-3 text-sm font-bold text-black rounded transition-all duration-200 hover:scale-105" style={{ fontFamily:"'Space Mono',monospace", background:"#00ffc8" }}>
                View Projects →
              </button>
              <button onClick={() => scrollTo("Contact")} className="px-8 py-3 text-sm rounded text-white/70 hover:text-white transition-all duration-200" style={{ fontFamily:"'Space Mono',monospace", border:"1px solid rgba(255,255,255,0.2)" }}>
                Get In Touch
              </button>
            </div>
            <div className="fu5 flex gap-5 mt-10" style={{ opacity: 0 }}>
              {[{label:"GitHub",url:DATA.github},{label:"LinkedIn",url:DATA.linkedin}].map((s)=>(
                <a key={s.label} href={s.url} className="text-xs transition-colors" style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.3)" }}
                  onMouseOver={(e)=>e.target.style.color="#00ffc8"} onMouseOut={(e)=>e.target.style.color="rgba(255,255,255,0.3)"}>{s.label} ↗</a>
              ))}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs" style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.2)" }}>scroll</span>
            <div className="w-px h-10" style={{ background:"linear-gradient(to bottom,rgba(0,255,200,0.5),transparent)", animation:"pulse-line 2s ease infinite" }} />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section ref={sectionRefs.About} className="snap-sec px-6">
          <div className="max-w-6xl mx-auto w-full py-20">
            <SectionHeader label="01 / About" title="Who I Am" />
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="leading-relaxed text-lg mb-6" style={{ color:"rgba(255,255,255,0.6)" }}>{DATA.about}</p>
                <a href="https://drive.google.com/file/d/1Fatc3DeoXv_7yGKWCgLvJIgjVm2hHSTm/view?usp=sharing" className="text-sm pb-1 transition-colors" style={{ fontFamily:"'Space Mono',monospace", color:"#00ffc8", borderBottom:"1px solid rgba(0,255,200,0.4)" }}>Download Résumé ↗</a>
              </div>
              <div className="space-y-8">
                {DATA.skills.map((group) => (
                  <div key={group.cat}>
                    <p className="text-xs mb-3 tracking-widest uppercase" style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.3)" }}>{group.cat}</p>
                    <div className="flex flex-wrap gap-2">{group.items.map((s)=><SkillBadge key={s} label={s} />)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section ref={sectionRefs.Projects} className="snap-sec px-6">
          <div className="max-w-6xl mx-auto w-full py-20">
            <SectionHeader label="02 / Projects" title="Things I've Built" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProjects.map((p,i)=><ProjectCard key={p.id} project={p} index={i} />)}
            </div>
            {!showAll && DATA.projects.length > 3 && (
              <div className="mt-10 text-center">
                <button onClick={()=>setShowAll(true)} className="text-sm px-8 py-3 rounded transition-all duration-200" style={{ fontFamily:"'Space Mono',monospace", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.5)" }}
                  onMouseOver={(e)=>{e.target.style.borderColor="rgba(0,255,200,0.5)";e.target.style.color="#00ffc8";}}
                  onMouseOut={(e)=>{e.target.style.borderColor="rgba(255,255,255,0.2)";e.target.style.color="rgba(255,255,255,0.5)";}}>
                  Show All Projects ({DATA.projects.length})
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section ref={sectionRefs.Experience} className="snap-sec px-6">
          <div className="max-w-3xl mx-auto w-full py-20">
            <SectionHeader label="03 / Experience" title="Where I've Worked" />
            {DATA.experience.map((item,i)=>(
              <TimelineItem key={i} item={item} last={i===DATA.experience.length-1} />
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section ref={sectionRefs.Contact} className="snap-sec px-6">
          <div className="max-w-3xl mx-auto w-full py-20 text-center">
            <SectionHeader label="04 / Contact" title="Let's Work Together" />
            <p className="text-lg leading-relaxed mb-12 max-w-xl mx-auto" style={{ color:"rgba(255,255,255,0.5)" }}>
              I'm currently open to new opportunities. Whether you have a project in mind or just want to say hello, my inbox is always open.
            </p>
            <a href={`mailto:${DATA.email}`} className="inline-block px-12 py-4 font-bold text-black rounded transition-all duration-200 hover:scale-105" style={{ fontFamily:"'Space Mono',monospace", background:"#00ffc8", boxShadow:"0 0 40px rgba(0,255,200,0.25)" }}>
              Say Hello →
            </a>
            <div className="flex justify-center gap-8 mt-14">
              {[{label:"GitHub",url:DATA.github},{label:"LinkedIn",url:DATA.linkedin},{label:"Twitter",url:DATA.twitter},{label:"Email",url:`mailto:${DATA.email}`}].map((s)=>(
                <a key={s.label} href={s.url} className="text-xs transition-colors" style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.3)" }}
                  onMouseOver={(e)=>e.target.style.color="#00ffc8"} onMouseOut={(e)=>e.target.style.color="rgba(255,255,255,0.3)"}>{s.label}</a>
              ))}
            </div>
            <p className="text-xs mt-16" style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.12)" }}>
              © {new Date().getFullYear()} {DATA.name}. Built with React + Tailwind CSS.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}