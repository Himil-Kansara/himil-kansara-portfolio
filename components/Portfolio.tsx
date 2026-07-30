"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight, Braces, Check, ChevronDown, Clipboard, Code2, Command, Copy, Database,
  ExternalLink, Github, Globe2, Layers3, Linkedin, Mail, MapPin, Menu, Moon, Server,
  Sparkles, Sun, X, Zap,
} from "lucide-react";
import { portfolioConfig, stats } from "@/data/profile";
import { experiences } from "@/data/experience";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const nav = ["About", "Experience", "Skills", "Projects", "Testimonials", "Contact"];
const roles = ["Angular Developer", "React Developer", ".NET Developer", "Full-Stack Engineer", "UI-Focused Software Engineer"];
const process = [
  ["Understand","Analyse business requirements and user expectations."],["Plan","Define components, APIs, data flow and technical approach."],
  ["Design","Build responsive and accessible UI structures."],["Build","Develop clean frontend and backend modules."],
  ["Test","Add unit, integration and end-to-end validation."],["Deploy","Use automated CI/CD pipelines."],["Improve","Monitor performance and continuously optimise."],
];
const highlights = ["Frontend architecture","Reusable component design","Responsive user interfaces","API integration","Performance optimisation","Clean code","Scalable backend development","Cloud deployment","Debugging & troubleshooting","Cross-functional collaboration"];
const codeSamples: Record<string,string> = {
  Angular: `@Component({\n  selector: 'app-dashboard',\n  standalone: true,\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: \`<app-metric-card [data]="metrics()" />\`\n})\nexport class DashboardComponent {\n  metrics = input.required<Metric[]>();\n}`,
  React: `export function useProjects(category: Category) {\n  const [projects, setProjects] = useState<Project[]>([]);\n  useEffect(() => {\n    getProjects(category).then(setProjects);\n  }, [category]);\n  return projects;\n}`,
  ".NET": `builder.Services.AddScoped<IProjectService, ProjectService>();\n\napp.UseExceptionHandler(handler => handler.Run(async context => {\n  context.Response.StatusCode = 500;\n  await context.Response.WriteAsJsonAsync(\n    ProblemDetailsFactory.Create(context));\n}));`,
  TypeScript: `interface ApiResult<T> {\n  data: T;\n  status: 'success' | 'error';\n  metadata?: Record<string, unknown>;\n}\n\nconst isSuccess = <T>(result: ApiResult<T>) =>\n  result.status === 'success';`,
};
const schema = z.object({
  name: z.string().min(2,"Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(3,"Add a short subject."),
  message: z.string().min(10,"Please add a little more detail."),
  website: z.string().optional(),
});
type ContactValues = z.infer<typeof schema>;

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .55 }}>{children}</motion.div>;
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{intro}</p></div>;
}

function ProjectModal({ project, close }: { project: Project; close: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [close]);
  return <motion.div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <motion.article role="dialog" aria-modal="true" aria-labelledby="project-title" className="modal" initial={{scale:.96,y:20}} animate={{scale:1,y:0}}>
      <button ref={ref} className="icon-button modal-close" onClick={close} aria-label="Close project details"><X /></button>
      <div className="browser-preview"><div className="browser-bar"><i/><i/><i/><span>{project.slug}.portfolio</span></div><div className="preview-grid"><Layers3/><span>Editable case study</span></div></div>
      <p className="eyebrow">{project.category} · {project.placeholder ? "Sample content" : "Case study"}</p><h2 id="project-title">{project.title}</h2><p className="lead">{project.description}</p>
      <div className="detail-grid">
        <div><h3>Problem</h3><p>{project.problem}</p></div><div><h3>My contribution</h3><p>{project.contribution}</p></div>
        <div><h3>Architecture</h3><p>{project.architecture}</p></div><div><h3>Challenges solved</h3><p>{project.challenges.join(" ")}</p></div>
      </div>
      <h3>Key features</h3><ul className="feature-list">{project.features.map(f=><li key={f}><Check/> {f}</li>)}</ul>
      <div className="tags">{project.technologies.map(t=><span key={t}>{t}</span>)}</div>
    </motion.article>
  </motion.div>;
}

export function Portfolio() {
  const [theme,setTheme] = useState<"dark"|"light">("dark");
  const [mobile,setMobile] = useState(false);
  const [active,setActive] = useState("Home");
  const [role,setRole] = useState(0);
  const [skillFilter,setSkillFilter] = useState("All");
  const [projectFilter,setProjectFilter] = useState("All");
  const [expanded,setExpanded] = useState(0);
  const [project,setProject] = useState<Project|null>(null);
  const [codeTab,setCodeTab] = useState("Angular");
  const [copied,setCopied] = useState("");
  const [palette,setPalette] = useState(false);
  const [processStep,setProcessStep] = useState(0);
  const [status,setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress,{ stiffness:120,damping:30 });
  const { register,handleSubmit,reset,formState:{errors} } = useForm<ContactValues>({resolver:zodResolver(schema)});

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const timer = setInterval(()=>setRole(v=>(v+1)%roles.length),2600);
    const sections = ["home",...nav.map(n=>n.toLowerCase())];
    const observer = new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&setActive(e.target.id === "home" ? "Home" : e.target.id[0].toUpperCase()+e.target.id.slice(1))),{rootMargin:"-35% 0px -55%"});
    sections.forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
    const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setPalette(v=>!v)} if(e.key==="Escape")setPalette(false)};
    window.addEventListener("keydown",key); return()=>{clearInterval(timer);observer.disconnect();window.removeEventListener("keydown",key)};
  },[theme]);

  const skillCategories = ["All",...new Set(skills.map(s=>s.category))];
  const projectCategories = ["All","Angular","React",".NET","Full Stack","SaaS","UI/UX"];
  const filteredSkills = useMemo(()=>skillFilter==="All"?skills:skills.filter(s=>s.category===skillFilter),[skillFilter]);
  const filteredProjects = useMemo(()=>projectFilter==="All"?projects:projects.filter(p=>p.category===projectFilter),[projectFilter]);
  const go=(id:string)=>{document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});setMobile(false);setPalette(false)};
  const copy=async(text:string,label:string)=>{await navigator.clipboard.writeText(text);setCopied(label);setTimeout(()=>setCopied(""),1600)};
  const submit=async(values:ContactValues)=>{
    setStatus("sending");
    try { const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)}); if(!r.ok)throw new Error(); setStatus("success");reset(); }
    catch { setStatus("error"); }
  };

  return <div className="site-shell">
    <motion.div className="scroll-progress" style={{scaleX:progress}} />
    <div className="cursor-glow" aria-hidden="true" />
    <header className="nav-wrap">
      <nav className="nav container" aria-label="Main navigation">
        <button className="brand" onClick={()=>go("home")} aria-label="Go home"><span>HK</span><i/></button>
        <div className="desktop-nav">{["Home",...nav].map(item=><button key={item} onClick={()=>go(item)} className={active===item?"active":""}>{item}</button>)}</div>
        <div className="nav-actions">
          <a className="button button-small desktop-resume" href={portfolioConfig.resumeUrl} target="_blank" rel="noreferrer">Résumé <ArrowRight/></a>
          <button className="icon-button" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} aria-label="Toggle theme">{theme==="dark"?<Sun/>:<Moon/>}</button>
          <button className="icon-button mobile-menu" onClick={()=>setMobile(v=>!v)} aria-label="Toggle menu">{mobile?<X/>:<Menu/>}</button>
        </div>
      </nav>
      <AnimatePresence>{mobile&&<motion.div className="mobile-panel" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{["Home",...nav].map(item=><button key={item} onClick={()=>go(item)}>{item}</button>)}</motion.div>}</AnimatePresence>
    </header>

    <main>
      <section id="home" className="hero container">
        <div className="hero-copy">
          <div className="availability"><i/> {portfolioConfig.availability}</div>
          <p className="hello">Hello, I’m Himil Kansara</p>
          <h1>Senior Full-Stack<br/><span>Developer.</span></h1>
          <div className="role-line"><span>Currently shaping experiences as</span><AnimatePresence mode="wait"><motion.strong key={role} initial={{y:10,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-10,opacity:0}}>{roles[role]}</motion.strong></AnimatePresence></div>
          <p className="hero-lead">I build scalable applications with polished interfaces, strong frontend architecture, reliable APIs, and modern cloud technologies.</p>
          <div className="hero-actions"><button className="button" onClick={()=>go("projects")}>View my work <ArrowRight/></button><a className="button ghost" href={portfolioConfig.resumeUrl} target="_blank" rel="noreferrer">Download résumé</a></div>
          <div className="hero-meta"><span><MapPin/> {portfolioConfig.location}</span><a href={portfolioConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a><a href={portfolioConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a></div>
        </div>
        <motion.div className="architecture" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:.25}}>
          <div className="window-bar"><span><i/><i/><i/></span><em>architecture.live</em><span className="live"><i/> online</span></div>
          <div className="arch-body">
            <div className="arch-top"><p>APPLICATION SYSTEM</p><span>v8.0</span></div>
            <div className="arch-flow">
              <div className="arch-node main-node"><Code2/><b>Client</b><small>Angular · React</small></div><div className="connector"/>
              <div className="arch-node"><Globe2/><b>API Gateway</b><small>REST · Auth</small></div><div className="connector"/>
              <div className="arch-node"><Server/><b>Services</b><small>.NET · Node</small></div>
            </div>
            <div className="arch-bottom"><div><Database/><span><b>Data layer</b><small>SQL · Azure</small></span></div><div><Zap/><span><b>Performance</b><small>98 ms avg.</small></span></div></div>
            <div className="terminal"><span>$ deploy --production</span><b>✓ Build healthy. Systems scalable.</b></div>
          </div>
        </motion.div>
      </section>

      <section id="about" className="section container">
        <Reveal><SectionTitle eyebrow="01 / About" title="Complex problems, made intuitive." intro="I pair product thinking with deep engineering craft to create digital products that feel fast, clear, and effortless." /></Reveal>
        <div className="about-grid">
          <Reveal className="about-copy"><p>I am a Senior Full-Stack Developer who enjoys transforming complex requirements into intuitive, responsive and scalable digital products. My core strength lies in building modern frontend applications using Angular, React, JavaScript and TypeScript, while also developing reliable backend services using .NET Core, C#, Node.js and SQL.</p><p>I work across the complete software development lifecycle—from requirements and architecture through deployment, optimisation and production support—with a focus on maintainable solutions, reusable components, clean APIs and polished user experiences.</p>
            <div className="stats">{stats.map(s=><div key={s.label} className={s.placeholder?"placeholder-stat":""}><b>{s.value}{s.suffix}</b><span>{s.label}</span></div>)}</div>
          </Reveal>
          <Reveal className="profile-card"><div className="profile-head"><span>HK</span><div><b>{portfolioConfig.name}</b><small>{portfolioConfig.title}</small></div></div>{[["Role",portfolioConfig.currentDesignation],["Company",portfolioConfig.currentCompany],["Location",portfolioConfig.location],["Experience",`${portfolioConfig.yearsOfExperience} years`],["Current focus","Full-stack development & frontend architecture"],["Availability",portfolioConfig.availability]].map(([k,v])=><div className="profile-row" key={k}><span>{k}</span><b>{v}</b></div>)}</Reveal>
        </div>
      </section>

      <section id="experience" className="section container"><Reveal><SectionTitle eyebrow="02 / Experience" title="Experience built in production." intro="Verified details are shown where provided; clearly marked fields are ready for your real career history." /></Reveal>
        <div className="timeline">{experiences.map((e,i)=><Reveal key={i} className="timeline-item"><div className="timeline-dot">{String(i+1).padStart(2,"0")}</div><article className="experience-card"><button className="experience-summary" onClick={()=>setExpanded(expanded===i?-1:i)} aria-expanded={expanded===i}><div><p>{e.duration}</p><h3>{e.role}</h3><span>{e.company} · {e.location}</span></div><ChevronDown className={expanded===i?"rotate":""}/></button><AnimatePresence initial={false}>{expanded===i&&<motion.div className="experience-detail" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}><p>{e.summary}</p><ul>{e.achievements.map(a=><li key={a}><Check/>{a}</li>)}</ul><div className="tags">{e.technologies.map(t=><span key={t}>{t}</span>)}</div></motion.div>}</AnimatePresence></article></Reveal>)}</div>
      </section>

      <section id="skills" className="section container"><Reveal><SectionTitle eyebrow="03 / Capabilities" title="A modern, end-to-end toolkit." intro="No arbitrary percentages—just an honest view of depth, grouped by how I use each technology." /></Reveal>
        <div className="filters" role="group" aria-label="Filter skills">{skillCategories.map(c=><button key={c} className={skillFilter===c?"selected":""} onClick={()=>setSkillFilter(c)}>{c}</button>)}</div>
        <motion.div layout className="skills-grid">{filteredSkills.map(s=><motion.article layout key={`${s.category}-${s.name}`} className="skill-card" title={s.description}><span className={cn("level",s.level.split(" ")[0].toLowerCase())}>{s.level}</span><h3>{s.name}</h3><p>{s.description}</p></motion.article>)}</motion.div>
      </section>

      <section id="projects" className="section container"><Reveal><SectionTitle eyebrow="04 / Selected work" title="Products, not just projects." intro="A flexible case-study system ready for your verified work. Every card below is explicitly marked as editable sample content." /></Reveal>
        <div className="filters" role="group" aria-label="Filter projects">{projectCategories.map(c=><button key={c} className={projectFilter===c?"selected":""} onClick={()=>setProjectFilter(c)}>{c}</button>)}</div>
        <div className="projects-grid">{filteredProjects.map((p,i)=><Reveal key={p.slug} className={cn("project-card",i===0&&projectFilter==="All"&&"project-featured")}><button onClick={()=>setProject(p)}><div className="project-visual"><div className="browser-bar"><i/><i/><i/><span>{p.slug}.sample</span></div><div className="project-mock"><div className="mock-sidebar"/><div className="mock-content"><span/><b/><div><i/><i/><i/></div></div></div></div><div className="project-content"><div><span className="sample-badge">Editable sample</span><p>{p.category}</p></div><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.technologies.map(t=><span key={t}>{t}</span>)}</div><span className="project-link">Explore case study <ArrowRight/></span></div></button></Reveal>)}</div>
      </section>

      <section className="section container"><Reveal><SectionTitle eyebrow="05 / Process" title="How I move from idea to impact." intro="A pragmatic delivery loop that keeps product needs, code quality and measurable outcomes aligned." /></Reveal>
        <div className="process"><div className="process-steps">{process.map(([name],i)=><button key={name} className={processStep===i?"active":""} onClick={()=>setProcessStep(i)} onMouseEnter={()=>setProcessStep(i)}><span>{String(i+1).padStart(2,"0")}</span>{name}</button>)}</div><motion.div key={processStep} className="process-detail" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><Sparkles/><span>Stage {processStep+1}</span><h3>{process[processStep][0]}</h3><p>{process[processStep][1]}</p></motion.div></div>
      </section>

      <section className="section container"><Reveal><SectionTitle eyebrow="06 / Engineering craft" title="Clean Code. Thoughtful Architecture. Better Experiences." intro="Small, valid examples of the patterns behind maintainable applications." /></Reveal>
        <div className="code-showcase"><div className="code-tabs">{Object.keys(codeSamples).map(t=><button className={codeTab===t?"active":""} key={t} onClick={()=>setCodeTab(t)}>{t}</button>)}</div><div className="code-window"><button className="copy-code" onClick={()=>copy(codeSamples[codeTab],"code")}>{copied==="code"?<Check/>:<Clipboard/>} {copied==="code"?"Copied":"Copy"}</button><pre><code>{codeSamples[codeTab]}</code></pre></div></div>
      </section>

      <section className="section container"><Reveal><SectionTitle eyebrow="07 / Strengths" title="What I bring to the team." intro="Senior-level engineering grounded in clarity, reliability, and close cross-functional collaboration." /></Reveal><div className="highlights-grid">{highlights.map((h,i)=><Reveal key={h} className="highlight-card"><span>{String(i+1).padStart(2,"0")}</span><Braces/><h3>{h}</h3></Reveal>)}</div></section>

      <section id="testimonials" className="section container"><Reveal><SectionTitle eyebrow="08 / Testimonials" title="Words from people I’ve worked with." intro="Recommendations from colleagues who have experienced my engineering approach, reliability, and collaboration firsthand." /></Reveal><div className="testimonial-scroll">{testimonials.map((t,i)=><article className="testimonial" key={i}><span>“</span><p>{t.testimonial}</p><div><i>{t.name.split(" ").map(part=>part[0]).join("").slice(0,2)}</i><p><b>{t.name}</b><small>{t.designation} · {t.company}</small></p></div></article>)}</div></section>

      <section id="contact" className="section contact-section"><div className="container contact-grid"><Reveal className="contact-copy"><p className="eyebrow">09 / Contact</p><h2>Let’s build something <span>impactful.</span></h2><p>Have an opportunity where thoughtful UI, reliable APIs and scalable architecture matter? Let’s talk.</p><div className="contact-links"><a href={`mailto:${portfolioConfig.email}`}><Mail/><span><small>Email</small>{portfolioConfig.email}</span></a><button onClick={()=>copy(portfolioConfig.email,"email")}><Copy/><span><small>{copied==="email"?"Copied":"Copy email"}</small>{copied==="email"?"Ready to paste":"One click to clipboard"}</span></button><a href={portfolioConfig.linkedin} target="_blank" rel="noreferrer"><Linkedin/><span><small>LinkedIn</small>Connect professionally</span></a><div><MapPin/><span><small>Location</small>{portfolioConfig.location}</span></div></div></Reveal>
        <Reveal><form onSubmit={handleSubmit(submit)} className="contact-form" noValidate><div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" {...register("website")}/></label></div><label>Name<input {...register("name")} aria-invalid={!!errors.name}/><small>{errors.name?.message}</small></label><label>Email<input type="email" {...register("email")} aria-invalid={!!errors.email}/><small>{errors.email?.message}</small></label><label>Subject<input {...register("subject")} aria-invalid={!!errors.subject}/><small>{errors.subject?.message}</small></label><label>Message<textarea rows={5} {...register("message")} aria-invalid={!!errors.message}/><small>{errors.message?.message}</small></label><button className="button" disabled={status==="sending"}>{status==="sending"?"Sending…":"Send message"}<ArrowRight/></button>{status==="success"&&<p className="form-success" role="status">Thanks—your message has been sent.</p>}{status==="error"&&<p className="form-error" role="alert">Delivery isn’t configured yet. Please email <a href={`mailto:${portfolioConfig.email}`}>{portfolioConfig.email}</a>.</p>}</form></Reveal></div></section>
    </main>

    <footer><div className="container footer-inner"><div><button className="brand" onClick={()=>go("home")}><span>HK</span></button><p><b>{portfolioConfig.name}</b><br/>{portfolioConfig.title}</p></div><div className="footer-nav">{nav.map(n=><button key={n} onClick={()=>go(n)}>{n}</button>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} Himil Kansara. Designed and developed by Himil Kansara.</span><button onClick={()=>go("home")}>Back to top ↑</button></div></div></footer>

    <button className="command-trigger" onClick={()=>setPalette(true)} aria-label="Open command palette"><Command/><span>Quick navigate</span><kbd>⌘ K</kbd></button>
    <AnimatePresence>{palette&&<motion.div className="palette-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={(e)=>e.target===e.currentTarget&&setPalette(false)}><motion.div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" initial={{scale:.97,y:-10}} animate={{scale:1,y:0}}><div><Command/> Where would you like to go?<button onClick={()=>setPalette(false)}><X/></button></div>{["About","Experience","Skills","Projects","Contact"].map(n=><button key={n} onClick={()=>go(n)}><span>{n}</span><ArrowRight/></button>)}<a href={portfolioConfig.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><ExternalLink/></a><a href={portfolioConfig.github} target="_blank" rel="noreferrer"><span>GitHub</span><ExternalLink/></a><a href={portfolioConfig.resumeUrl} target="_blank" rel="noreferrer"><span>Download résumé</span><ExternalLink/></a></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{project&&<ProjectModal project={project} close={()=>setProject(null)}/>}</AnimatePresence>
  </div>;
}
