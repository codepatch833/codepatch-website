import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Code2, ExternalLink, GitBranch, Globe2, Menu, Moon, Play, Sun, Video, X } from 'lucide-react'
import codepatchLogo from '../assets/codepatch logo.png'
import pathToFactLogo from '../assets/PathToFact Logo.png'

type Page = 'home' | 'projects' | 'about' | 'path'
type Category = 'All' | 'Games' | 'Software' | 'Experiments' | 'Tools'
type Language = 'English' | 'Italiano'

const projects = [
  { title: 'Layer 0: Find the Impostor', category: 'Games', year: '2025', description: 'An investigation game in UN cyberspace. Complete tasks, observe and vote across three rounds.', tags: ['Unity', 'Strategy'], tone: 'blue', icon: '01', link: 'https://codepatch.itch.io/layer-0' },
  { title: 'Formula X - F1 Manager', category: 'Games', year: '2025', description: 'An F1 management game that takes the series into the future.', tags: ['Unity', 'Simulation'], tone: 'violet', icon: '02', link: 'https://codepatch.itch.io/formula-x' },
  { title: 'WarEve - Domains\' Return', category: 'Games', year: '2025', description: 'A game about going back through history, built around war and simulation.', tags: ['Unity', 'Simulation'], tone: 'coral', icon: '03', link: 'https://codepatch.itch.io/wareve-domains-return' },
  { title: 'Lumber Jack', category: 'Games', year: '2024', description: 'Become a fast lumber jack in this focused arcade simulation.', tags: ['Unity', 'Arcade'], tone: 'lime', icon: '04', link: 'https://codepatch.itch.io/lumber-jack' },
  { title: 'F1 Manager S2', category: 'Games', year: '2023', description: 'The second chapter of the F1 Manager series.', tags: ['Scratch', 'Racing'], tone: 'blue', icon: '05', link: 'https://codepatch.itch.io/f1-manager-s2' },
  { title: 'F1 Manager Classic', category: 'Games', year: '2022', description: 'The first chapter of the F1 Manager series.', tags: ['Scratch', 'Racing'], tone: 'violet', icon: '06', link: 'https://codepatch.itch.io/f1-manager-classic' },
]

const copy = {
  English: { home: 'Home', projects: 'Projects', about: 'About', path: 'Path to Fact', eyebrow: 'CODEPATCH / DIGITAL CREATOR', title: 'Building games,\nsoftware & ideas.', intro: 'I’m CodePatch, a programmer creating games, software and digital experiences.', selected: 'Selected projects', viewAll: 'View all projects', aboutTitle: 'A digital identity for\ncurious builders.', pathIntro: 'A YouTube channel by two friends exploring interesting topics, facts, ideas and stories.', explore: 'Explore Path to Fact' },
  Italiano: { home: 'Home', projects: 'Progetti', about: 'Chi sono', path: 'Path to Fact', eyebrow: 'CODEPATCH / DIGITAL CREATOR', title: 'Creo giochi,\nsoftware e idee.', intro: 'Sono CodePatch, un programmatore che crea giochi, software ed esperienze digitali.', selected: 'Progetti selezionati', viewAll: 'Vedi tutti i progetti', aboutTitle: 'Un’identità digitale per\nchi costruisce con curiosità.', pathIntro: 'Un canale YouTube creato da due amici per esplorare fatti, idee e storie interessanti.', explore: 'Esplora Path to Fact' },
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [category, setCategory] = useState<Category>('All')
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('codepatch-language')
    if (savedLanguage === 'English' || savedLanguage === 'Italiano') return savedLanguage
    return navigator.language.toLowerCase().startsWith('it') ? 'Italiano' : 'English'
  })
  const [dark, setDark] = useState(() => localStorage.getItem('codepatch-theme') !== 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = copy[language]

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('codepatch-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => { localStorage.setItem('codepatch-language', language) }, [language])
  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }, [page])

  const navigate = (next: Page) => setPage(next)

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}><nav className="navbar">
      <button className="brand" onClick={() => navigate('home')} aria-label="CodePatch home"><span className="brand-logo-frame"><img src={codepatchLogo} alt="CodePatch" /></span><span className="brand-name">CodePatch</span></button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavItem active={page === 'home'} label={t.home} onClick={() => navigate('home')} />
        <NavItem active={page === 'projects'} label={t.projects} onClick={() => navigate('projects')} />
        <NavItem active={page === 'about'} label={t.about} onClick={() => navigate('about')} />
        <NavItem active={page === 'path'} label={t.path} onClick={() => navigate('path')} />
      </div>
      <div className="nav-actions"><label className="language"><Globe2 size={14} /><span>{language}</span><select value={language} onChange={e => setLanguage(e.target.value as Language)} aria-label="Language"><option>English</option><option>Italiano</option></select><ChevronDown size={13} /></label><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</button><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
    </nav></header>
    <main className="page-transition" key={page}>{page === 'home' && <Home t={t} navigate={navigate} />}{page === 'projects' && <Projects category={category} setCategory={setCategory} navigate={navigate} />}{page === 'about' && <About t={t} />}{page === 'path' && <Path t={t} />}</main>
    <Footer navigate={navigate} t={t} />
  </div>
}

function NavItem({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{label}</button> }
function Button({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) { return <button onClick={onClick} className={`button ${secondary ? 'secondary' : ''}`}>{children}<ArrowUpRight size={16} /></button> }
function SectionLabel({ children }: { children: React.ReactNode }) { return <div className="section-label"><span />{children}</div> }

function Home({ t, navigate }: { t: typeof copy.English; navigate: (p: Page) => void }) { return <>
  <section className="hero content-grid"><div className="hero-copy reveal"><SectionLabel>{t.eyebrow}</SectionLabel><h1>{t.title.split('\n').map((line, i) => <span key={line} className={i === 1 ? 'gradient-text' : ''}>{line}</span>)}</h1><p className="hero-intro">{t.intro}</p><div className="hero-buttons"><Button onClick={() => navigate('projects')}>{t.viewAll}</Button><Button secondary onClick={() => navigate('about')}>{t.about}</Button></div><div className="hero-meta"><span><i className="status-dot" />Available for selected work</span><span>Based in Italy · Working worldwide</span></div></div><HeroVisual /></section>
  <section className="section content-grid projects-preview"><div className="section-heading"><div><SectionLabel>01 / WORK</SectionLabel><h2>{t.selected}</h2></div><button className="text-link" onClick={() => navigate('projects')}>{t.viewAll} <ArrowUpRight size={16} /></button></div><div className="project-grid">{projects.slice(0, 3).map(project => <ProjectCard key={project.title + project.icon} project={project} />)}</div></section>
  <section className="statement"><div className="content-grid statement-inner"><SectionLabel>02 / APPROACH</SectionLabel><h2>Make it useful.<br /><em>Make it memorable.</em></h2><p>CodePatch is a small creative practice focused on thoughtful digital experiences, from the first sketch to the final detail.</p></div></section>
  <section className="path-teaser content-grid"><div><SectionLabel>03 / SIDE PROJECT</SectionLabel><h2>Curiosity takes<br /><span>you somewhere.</span></h2><p>{t.pathIntro}</p><Button secondary onClick={() => navigate('path')}>{t.explore}</Button></div><div className="path-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><img className="orbit-logo" src={pathToFactLogo} alt="Path to Fact" /><span className="orbit-note note-one">facts</span><span className="orbit-note note-two">stories</span></div></section>
</> }

function HeroVisual() { return <div className="hero-visual" aria-label="Abstract CodePatch visual"><div className="visual-grid" /><div className="visual-glow" /><div className="code-window"><div className="window-bar"><span /><span /><span /><small>codepatch.ts</small></div><div className="code-lines"><p><b>const</b> future <i>=</i> <strong>{'{'}</strong></p><p className="indent">build: <mark>"with intent"</mark>,</p><p className="indent">ship: <mark>true</mark>,</p><p><strong>{'}'}</strong></p></div></div><div className="float-chip chip-one"><Code2 size={15} /> creative systems</div><div className="float-chip chip-two">01<span>/04</span></div><div className="visual-caption">IDEAS → <b>REALITY</b></div></div> }

function ProjectCard({ project }: { project: typeof projects[number] }) { return <a className={`project-card ${project.tone}`} href={project.link} target="_blank" rel="noreferrer"><div className="project-art"><span className="art-index">{project.icon} / {project.category.toUpperCase()}</span><div className="art-shape" /><span className="art-year">{project.year}</span><ArrowUpRight className="art-arrow" size={20} /></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></a> }

function Projects({ category, setCategory }: { category: Category; setCategory: (c: Category) => void; navigate: (p: Page) => void }) { const categories: Category[] = ['All', 'Games', 'Software', 'Experiments', 'Tools']; const shown = category === 'All' ? projects : projects.filter(p => p.category === category); return <section className="page-section content-grid"><div className="page-intro"><SectionLabel>01 / SELECTED WORK</SectionLabel><h1>Projects that<br /><span className="gradient-text">move ideas forward.</span></h1><p>A collection of games built across Scratch and Unity, from investigation and simulation to racing and arcade experiments.</p></div><div className="filters">{categories.map(item => <button className={category === item ? 'selected' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><div className="project-grid projects-page-grid">{shown.map(project => <ProjectCard key={project.icon} project={project} />)}</div></section> }

function About({ t }: { t: typeof copy.English }) { return <section className="page-section content-grid about-page"><div className="page-intro"><SectionLabel>02 / THE PERSON BEHIND THE WORK</SectionLabel><h1>{t.aboutTitle.split('\n').map(line => <span key={line}>{line}</span>)}</h1><p>{t.intro} I’m Italian, a student and a tennis player who started creating with Scratch before moving into Unity and game development. I build games for fun, keep learning development languages and value honest feedback.</p></div><div className="about-layout"><div className="about-note"><span className="quote-mark">“</span><p>From Scratch experiments to Unity games, every project is a way to keep learning.</p><span className="note-signature">— CodePatch, creator and game developer</span><div className="profile-links"><a href="https://codepatch.itch.io/" target="_blank" rel="noreferrer">itch.io <ExternalLink size={13} /></a><a href="https://scratch.mit.edu/users/codepatch/" target="_blank" rel="noreferrer">Scratch <ExternalLink size={13} /></a><a href="https://www.youtube.com/channel/UCLNG7PfbdAo5WHB16BPYN1A" target="_blank" rel="noreferrer">YouTube <ExternalLink size={13} /></a></div></div><div className="toolbox"><SectionLabel>TOOLBOX / EDITABLE</SectionLabel><div className="tool-list">{['Scratch', 'Unity', 'C#', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'].map((tool, i) => <div key={tool}><span>0{i + 1}</span>{tool}<ArrowUpRight size={14} /></div>)}</div><div className="contact-list"><small>CONTACT</small><a href="mailto:codepatch833@gmail.com">codepatch833@gmail.com</a><a href="mailto:pathtofact.info@gmail.com">pathtofact.info@gmail.com</a></div></div></div></section> }

function Path({ t }: { t: typeof copy.English }) { return <section className="path-page"><div className="path-hero content-grid"><div className="path-copy"><img className="path-logo" src={pathToFactLogo} alt="Path to Fact" /><SectionLabel>PATH TO FACT / YOUTUBE PROJECT</SectionLabel><h1>Curiosity takes<br /><em>you somewhere.</em></h1><p>{t.pathIntro}</p><a className="button path-button" href="https://youtube.com" target="_blank" rel="noreferrer">Visit YouTube <Video size={16} /></a></div><div className="film-frame"><div className="film-lines" /><div className="film-center"><span>PTF</span><small>EPISODE / 001</small></div></div></div><div className="content-grid video-section"><div className="section-heading"><div><SectionLabel>FEATURED / VIDEOS</SectionLabel><h2>Stories worth<br /><em>following.</em></h2></div></div><div className="video-grid">{['Video title goes here', 'Video title goes here', 'Video title goes here'].map((video, i) => <a className="video-card" href="https://youtube.com" target="_blank" rel="noreferrer" key={i}><div className={`video-thumb video-${i + 1}`}><span>PTF / 0{i + 1}</span><button aria-label="Play video"><Play size={18} fill="currentColor" /></button></div><div><h3>{video}</h3><p>Short video description goes here · 00:00</p></div></a>)}</div></div></section> }

function Footer({ navigate, t }: { navigate: (p: Page) => void; t: typeof copy.English }) { return <footer><div className="content-grid footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-logo-frame"><img src={codepatchLogo} alt="CodePatch" /></span><span className="brand-name">CodePatch</span></button><p>Building things worth clicking.</p></div><div className="footer-links"><div><small>EXPLORE</small><button onClick={() => navigate('home')}>{t.home}</button><button onClick={() => navigate('projects')}>{t.projects}</button><button onClick={() => navigate('about')}>{t.about}</button><button onClick={() => navigate('path')}>{t.path}</button></div><div><small>CONNECT</small><a href="https://codepatch.itch.io/" target="_blank" rel="noreferrer">itch.io <ExternalLink size={13} /></a><a href="https://www.youtube.com/channel/UCLNG7PfbdAo5WHB16BPYN1A" target="_blank" rel="noreferrer">YouTube <ExternalLink size={13} /></a><a href="mailto:codepatch833@gmail.com">Email <ExternalLink size={13} /></a></div></div></div><div className="content-grid footer-bottom"><span>© 2026 CodePatch</span><span>Made with intent <GitBranch size={14} /></span></div></footer> }

export default App
