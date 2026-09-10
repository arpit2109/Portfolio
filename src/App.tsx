import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import './index.css';

const projects = [
  {
    number: '01',
    title: 'Shashan ERP & Financial Management System',
    type: 'Enterprise / FinTech',
    description: 'Scalable multi-module ERP architecture with inventory, fulfillment, organizational management, multi-owner wallets, escrow holds and strict double-entry accounting.',
    stack: ['Django 5.2', 'DRF', 'Celery', 'PostgreSQL', 'Concurrency'],
    accent: 'violet',
  },
  {
    number: '02',
    title: 'LuxeLounge',
    type: 'Predictive Analytics',
    description: 'Hospitality analytics platform combining secure REST APIs, custom data pipelines and machine-learning forecasting for hotel occupancy.',
    stack: ['Python', 'Django', 'Scikit-learn', 'Pandas'],
    accent: 'cyan',
  },
  {
    number: '03',
    title: 'Job-Aggregator',
    type: 'Automation / Data',
    description: 'Scalable aggregation pipeline that extracts, normalizes and serves job data from major portals using browser automation and a React interface.',
    stack: ['Python', 'Selenium', 'Django', 'React'],
    accent: 'lime',
  },
  {
    number: '04',
    title: 'AI Solver',
    type: 'AI Automation',
    description: 'Screen-aware automation workflow that captures visual context, routes problems through AI models and delivers solutions through mobile notifications.',
    stack: ['Python', 'AI APIs', 'Automation', 'Notifications'],
    accent: 'amber',
  },
  {
    number: '05',
    title: 'Global Pulse Gold Predictor',
    type: 'Machine Learning',
    description: 'Predictive engine combining financial datasets with real-time market signals to model forward-looking gold trends.',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    accent: 'pink',
  },
  {
    number: '06',
    title: 'Algorithmic Visualization System',
    type: 'Interactive Education',
    description: 'Interactive visual explanations of Dynamic Programming and Greedy algorithms that turn abstract problem-solving mechanics into understandable experiences.',
    stack: ['JavaScript', 'React', 'Algorithms', 'Visualization'],
    accent: 'blue',
  },
];

const skillGroups = [
  ['Backend', 'Python', 'Django', 'DRF', 'Node.js', 'Express', 'ASP.NET'],
  ['Frontend', 'React', 'Next.js', 'AngularJS', 'JavaScript', 'HTML', 'CSS', 'Tailwind'],
  ['Data / ML', 'NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Machine Learning'],
  ['Languages', 'Java', 'Python', 'PHP', 'C#', 'JavaScript'],
  ['Databases', 'MySQL', 'MongoDB'],
  ['Engineering', 'API Design', 'Concurrency', 'Automation', 'Data Pipelines', 'RBAC'],
];

function SceneCore() {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    target.set(pointer.x * 0.32, pointer.y * 0.2, 0);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, target.y, 2.5, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target.x, 2.5, delta);
    group.current.rotation.z += delta * 0.08;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.025;
    group.current.scale.setScalar(Math.min(viewport.width / 6, 1.05) * pulse);
  });

  return (
    <group ref={group} position={[0.65, -0.1, 0]}>
      <Float speed={1.25} rotationIntensity={0.28} floatIntensity={0.55}>
        <mesh>
          <icosahedronGeometry args={[1.28, 2]} />
          <meshStandardMaterial color="#11121a" emissive="#5b21b6" emissiveIntensity={0.7} metalness={0.9} roughness={0.22} wireframe />
        </mesh>
        <mesh scale={0.74}>
          <icosahedronGeometry args={[1.28, 2]} />
          <meshStandardMaterial color="#08090c" emissive="#22d3ee" emissiveIntensity={0.35} metalness={0.95} roughness={0.14} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.32}>
          <torusGeometry args={[1.25, 0.012, 12, 160]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.72} />
        </mesh>
        <mesh rotation={[0.8, 0.5, 0.8]} scale={1.48}>
          <torusGeometry args={[1.25, 0.008, 12, 160]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.48} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={38} />
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 3, 4]} intensity={18} color="#8b5cf6" distance={8} />
      <pointLight position={[-4, -2, 2]} intensity={10} color="#22d3ee" distance={7} />
      <SceneCore />
      <Sparkles count={90} scale={[7, 5, 4]} size={1.1} speed={0.25} opacity={0.55} color="#ffffff" />
    </Canvas>
  );
}

function MagneticButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const [style, setStyle] = useState<CSSProperties>({});
  const move = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setStyle({ transform: `translate(${x * 0.12}px, ${y * 0.12}px)` });
  };
  return (
    <a className={`magnetic ${primary ? 'magnetic--primary' : ''}`} href={href} style={style} onMouseMove={move} onMouseLeave={() => setStyle({})}>
      {children}
    </a>
  );
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function App() {
  const [activeProject, setActiveProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -110]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />
      <div className="noise" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="Arpit Patel home"><span>AP</span><b>ARPIT<span>.</span></b></a>
        <nav className={menuOpen ? 'nav-links nav-links--open' : 'nav-links'}>
          {['about', 'work', 'skills', 'contact'].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
        </nav>
        <a className="nav-cta" href="mailto:patelarpit4242@gmail.com">Let’s talk ↗</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? '×' : '☰'}</button>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <motion.div className="hero-copy" style={{ y: heroY }}>
            <div className="eyebrow"><i /> PYTHON · DJANGO · REACT · AI</div>
            <h1>Building systems<br /><em>that feel</em> inevitable.</h1>
            <p className="hero-lead">I’m <strong>Arpit Patel</strong> — a backend-focused full-stack developer turning complex requirements into scalable products, APIs and data-driven experiences.</p>
            <div className="hero-actions">
              <MagneticButton href="#work" primary>Explore my work <span>↓</span></MagneticButton>
              <MagneticButton href="/assets/Arpit-Patel-Resume.pdf">View résumé ↗</MagneticButton>
            </div>
            <div className="hero-meta"><span>AHMEDABAD, INDIA</span><span>AVAILABLE FOR OPPORTUNITIES</span><span>2026 → 2027</span></div>
          </motion.div>

          <div className="hero-visual">
            <div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" />
            <div className="scene"><Scene /></div>
            <motion.div className="profile-wrap" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.1 }}>
              <img src="/assets/arpit-profile.webp" alt="Arpit Patel" className="profile" />
              <div className="profile-tag"><span className="status-dot" /> Building & shipping</div>
            </motion.div>
          </div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><b>↓</b></a>
        </section>

        <section id="about" className="section section-pad about-section">
          <Reveal className="section-kicker">01 / ABOUT</Reveal>
          <div className="about-grid">
            <Reveal><h2>Backend logic.<br /><span>Human interface.</span></h2></Reveal>
            <Reveal className="about-copy"><p className="large-copy">I enjoy working where architecture meets real-world constraints — transactional systems, data pipelines, automation and interfaces that make technical complexity disappear.</p><p>Currently a Python Developer Intern at Tesseract Technolabs, I’m working on Shashan, a multi-module ERP and financial management platform. My work spans Django, DRF, Celery, database concurrency, identity middleware, serializer architecture and API integrations.</p><div className="about-stats"><div><strong>06</strong><span>Featured builds</span></div><div><strong>01</strong><span>Live industry project</span></div><div><strong>2027</strong><span>Expected graduation</span></div></div></Reveal>
          </div>
        </section>

        <section id="work" className="section section-pad work-section">
          <Reveal className="section-kicker">02 / SELECTED WORK</Reveal>
          <div className="work-heading"><Reveal><h2>Problems I’ve<br /><span>enjoyed solving.</span></h2></Reveal><Reveal><p>Not just screens — systems, automation, prediction and infrastructure behind them.</p></Reveal></div>
          <div className="project-showcase">
            <div className="project-index">{projects.map((project, i) => <button key={project.number} className={i === activeProject ? 'active' : ''} onClick={() => setActiveProject(i)}><span>{project.number}</span>{project.title}</button>)}</div>
            <motion.article className={`project-feature accent-${projects[activeProject].accent}`} key={activeProject} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
              <div className="project-top"><span>{projects[activeProject].type}</span><span>{projects[activeProject].number} / 06</span></div>
              <div><h3>{projects[activeProject].title}</h3><p>{projects[activeProject].description}</p></div>
              <div className="stack-row">{projects[activeProject].stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="project-art"><div className="art-grid" /><div className="art-core"><span>{projects[activeProject].number}</span></div><div className="art-line line-1" /><div className="art-line line-2" /><div className="art-line line-3" /></div>
            </motion.article>
          </div>
        </section>

        <section id="skills" className="section section-pad skills-section">
          <Reveal className="section-kicker">03 / CAPABILITIES</Reveal>
          <div className="skills-layout"><Reveal><h2>Tools are<br /><span>only the surface.</span></h2><p>My strongest skill is connecting the layers: product requirement → architecture → implementation → data → reliable delivery.</p></Reveal><div className="skill-matrix">{skillGroups.map(([title, ...items]) => <Reveal key={title}><div className="skill-group"><h3>{title}</h3><div>{items.map((item) => <span key={item}>{item}</span>)}</div></div></Reveal>)}</div></div>
        </section>

        <section className="section-pad experience-section">
          <Reveal className="section-kicker">04 / EXPERIENCE</Reveal>
          <div className="experience-card"><div className="experience-number">01</div><div><span className="muted">JUNE 2026 — PRESENT</span><h2>Tesseract Technolabs</h2><h3>Python Developer · Shashan ERP</h3><p>Architecting scalable ERP and financial workflows using Django 5.2, Django REST Framework and Celery. Engineered multi-owner wallets, automated escrow holds, double-entry ledgers, concurrency protections and role-aware identity middleware.</p><div className="experience-tags"><span>Architecture</span><span>FinTech</span><span>Concurrency</span><span>API Engineering</span></div></div></div>
        </section>

        <section className="section-pad education-section">
          <div className="edu-line"><span>EDUCATION</span><strong>LJ University · Ahmedabad</strong><em>Semester 6 · Expected 2027</em></div>
          <div className="edu-line"><span>CERTIFICATIONS</span><strong>IBM · University of Pennsylvania · LearnQuest</strong><em>ML EDA · Web Fundamentals · Data Structures · Java</em></div>
          <div className="edu-line"><span>ACHIEVEMENTS</span><strong>SIH · Hackathons · Maths Olympiad</strong><em>Represented college in Smart India Hackathon · Top 50 hackathon finish · Silver medal</em></div>
        </section>

        <section id="contact" className="section-pad contact-section">
          <Reveal className="section-kicker">05 / CONTACT</Reveal>
          <div className="contact-content"><Reveal><p className="contact-overline">HAVE A SYSTEM WORTH BUILDING?</p><h2>Let’s make it<br /><span>remarkable.</span></h2></Reveal><Reveal className="contact-side"><p>Open to software engineering opportunities, ambitious product work and collaborations around backend systems, automation and AI.</p><a href="mailto:patelarpit4242@gmail.com">patelarpit4242@gmail.com ↗</a><a href="https://github.com/arpit2109" target="_blank" rel="noreferrer">github.com/arpit2109 ↗</a><div className="contact-note">Ahmedabad, Gujarat · India</div></Reveal></div>
        </section>
      </main>

      <footer><div>ARPIT PATEL <span>© 2026</span></div><div>DESIGNED + ENGINEERED WITH REACT / THREE.JS</div><a href="#top">BACK TO TOP ↑</a></footer>
    </div>
  );
}

export default App;
