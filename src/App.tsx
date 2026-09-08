import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Code2, ExternalLink, GitBranch, Globe2, Menu, Moon, Play, Sun, Video, X } from 'lucide-react'

type Page = 'home' | 'projects' | 'about' | 'path'
type Category = 'All' | 'Games' | 'Software' | 'Experiments' | 'Tools'

const projects = [
  { title: 'Project Name', category: 'Games', year: '2026', description: 'A place for your game, product or experiment to take center stage.', tags: ['Unity', 'C#'], tone: 'coral', icon: '01' },
  { title: 'Project Name', category: 'Software', year: '2025', description: 'Short project description goes here. Make it yours when the direction is clear.', tags: ['React', 'TypeScript'], tone: 'blue', icon: '02' },
  { title: 'Project Name', category: 'Experiments', year: '2025', description: 'A small idea explored until it became something worth sharing.', tags: ['WebGL', 'Motion'], tone: 'lime', icon: '03' },
  { title: 'Project Name', category: 'Tools', year: '2024', description: 'Useful tools, unusual interfaces and tiny systems for curious minds.', tags: ['Node.js', 'Git'], tone: 'violet', icon: '04' },
]

const copy = {
  English: { home: 'Home', projects: 'Projects', about: 'About', path: 'Path to Fact', eyebrow: 'CODEPATCH / DIGITAL CREATOR', title: 'Building games,\nsoftware & ideas.', intro: 'I’m CodePatch, a programmer creating games, software and digital experiences.', selected: 'Selected projects', viewAll: 'View all projects', aboutTitle: 'A digital identity for\ncurious builders.', pathIntro: 'A YouTube channel by two friends exploring interesting topics, facts, ideas and stories.', explore: 'Explore Path to Fact' },
  Italiano: { home: 'Home', projects: 'Progetti', about: 'Chi sono', path: 'Path to Fact', eyebrow: 'CODEPATCH / DIGITAL CREATOR', title: 'Creo giochi,\nsoftware e idee.', intro: 'Sono CodePatch, un programmatore che crea giochi, software ed esperienze digitali.', selected: 'Progetti selezionati', viewAll: 'Vedi tutti i progetti', aboutTitle: 'Un’identità digitale per\nchi costruisce con curiosità.', pathIntro: 'Un canale YouTube creato da due amici per esplorare fatti, idee e storie interessanti.', explore: 'Esplora Path to Fact' },
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [category, setCategory] = useState<Category>('All')
  const [language, setLanguage] = useState<'English' | 'Italiano'>('English')
  const [dark, setDark] = useState(() => localStorage.getItem('codepatch-theme') !== 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const t = copy[language]

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('codepatch-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }, [page])

  const navigate = (next: Page) => setPage(next)

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="nav-wrap"><nav className="navbar">
      <button className="brand" onClick={() => navigate('home')} aria-label="CodePatch home"><span className="brand-mark">C<span>·</span>P</span><span className="brand-name">CodePatch</span></button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavItem active={page === 'home'} label={t.home} onClick={() => navigate('home')} />
        <NavItem active={page === 'projects'} label={t.projects} onClick={() => navigate('projects')} />
        <NavItem active={page === 'about'} label={t.about} onClick={() => navigate('about')} />
        <NavItem active={page === 'path'} label={t.path} onClick={() => navigate('path')} />
      </div>
      <div className="nav-actions"><div className="language"><Globe2 size={14} /><select value={language} onChange={e => setLanguage(e.target.value as 'English' | 'Italiano')} aria-label="Language"><option>English</option><option>Italiano</option></select><ChevronDown size={13} /></div><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</button><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
    </nav></header>
    <main>{page === 'home' && <Home t={t} navigate={navigate} />}{page === 'projects' && <Projects category={category} setCategory={setCategory} navigate={navigate} />}{page === 'about' && <About t={t} />}{page === 'path' && <Path t={t} />}</main>
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
  <section className="path-teaser content-grid"><div><SectionLabel>03 / SIDE PROJECT</SectionLabel><h2>Curiosity takes<br /><span>you somewhere.</span></h2><p>{t.pathIntro}</p><Button secondary onClick={() => navigate('path')}>{t.explore}</Button></div><div className="path-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core">P<span>·</span>F</div><span className="orbit-note note-one">facts</span><span className="orbit-note note-two">stories</span></div></section>
</> }

function HeroVisual() { return <div className="hero-visual" aria-label="Abstract CodePatch visual"><div className="visual-grid" /><div className="visual-glow" /><div className="code-window"><div className="window-bar"><span /><span /><span /><small>codepatch.ts</small></div><div className="code-lines"><p><b>const</b> future <i>=</i> <strong>{'{'}</strong></p><p className="indent">build: <mark>"with intent"</mark>,</p><p className="indent">ship: <mark>true</mark>,</p><p><strong>{'}'}</strong></p></div></div><div className="float-chip chip-one"><Code2 size={15} /> creative systems</div><div className="float-chip chip-two">01<span>/04</span></div><div className="visual-caption">IDEAS → <b>REALITY</b></div></div> }

function ProjectCard({ project }: { project: typeof projects[number] }) { return <article className={`project-card ${project.tone}`}><div className="project-art"><span className="art-index">{project.icon} / {project.category.toUpperCase()}</span><div className="art-shape" /><span className="art-year">{project.year}</span><ArrowUpRight className="art-arrow" size={20} /></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article> }

function Projects({ category, setCategory }: { category: Category; setCategory: (c: Category) => void; navigate: (p: Page) => void }) { const categories: Category[] = ['All', 'Games', 'Software', 'Experiments', 'Tools']; const shown = category === 'All' ? projects : projects.filter(p => p.category === category); return <section className="page-section content-grid"><div className="page-intro"><SectionLabel>01 / SELECTED WORK</SectionLabel><h1>Projects that<br /><span className="gradient-text">move ideas forward.</span></h1><p>A growing collection of games, tools and experiments. Placeholder projects are ready for your real work.</p></div><div className="filters">{categories.map(item => <button className={category === item ? 'selected' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><div className="project-grid projects-page-grid">{shown.map(project => <ProjectCard key={project.icon} project={project} />)}</div></section> }

function About({ t }: { t: typeof copy.English }) { return <section className="page-section content-grid about-page"><div className="page-intro"><SectionLabel>02 / THE PERSON BEHIND THE WORK</SectionLabel><h1>{t.aboutTitle.split('\n').map(line => <span key={line}>{line}</span>)}</h1><p>{t.intro} CodePatch is a digital identity built around curiosity, clarity and a love for making things.</p></div><div className="about-layout"><div className="about-note"><span className="quote-mark">“</span><p>Good software feels invisible. Great software leaves a trace.</p><span className="note-signature">— CodePatch, somewhere between idea and launch</span></div><div className="toolbox"><SectionLabel>TOOLBOX / EDITABLE</SectionLabel><div className="tool-list">{['JavaScript', 'TypeScript', 'React', 'Node.js', 'C#', 'Unity', 'Git', 'More to come'].map((tool, i) => <div key={tool}><span>0{i + 1}</span>{tool}<ArrowUpRight size={14} /></div>)}</div></div></div></section> }

function Path({ t }: { t: typeof copy.English }) { return <section className="path-page"><div className="path-hero content-grid"><div className="path-copy"><div className="path-logo">P<span>·</span>F</div><SectionLabel>PATH TO FACT / YOUTUBE PROJECT</SectionLabel><h1>Curiosity takes<br /><em>you somewhere.</em></h1><p>{t.pathIntro}</p><a className="button path-button" href="https://youtube.com" target="_blank" rel="noreferrer">Visit YouTube <Video size={16} /></a></div><div className="film-frame"><div className="film-lines" /><div className="film-center"><span>PTF</span><small>EPISODE / 001</small></div></div></div><div className="content-grid video-section"><div className="section-heading"><div><SectionLabel>FEATURED / VIDEOS</SectionLabel><h2>Stories worth<br /><em>following.</em></h2></div></div><div className="video-grid">{['Video title goes here', 'Video title goes here', 'Video title goes here'].map((video, i) => <a className="video-card" href="https://youtube.com" target="_blank" rel="noreferrer" key={i}><div className={`video-thumb video-${i + 1}`}><span>PTF / 0{i + 1}</span><button aria-label="Play video"><Play size={18} fill="currentColor" /></button></div><div><h3>{video}</h3><p>Short video description goes here · 00:00</p></div></a>)}</div></div></section> }

function Footer({ navigate, t }: { navigate: (p: Page) => void; t: typeof copy.English }) { return <footer><div className="content-grid footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark">C<span>·</span>P</span><span className="brand-name">CodePatch</span></button><p>Building things worth clicking.</p></div><div className="footer-links"><div><small>EXPLORE</small><button onClick={() => navigate('home')}>{t.home}</button><button onClick={() => navigate('projects')}>{t.projects}</button><button onClick={() => navigate('about')}>{t.about}</button><button onClick={() => navigate('path')}>{t.path}</button></div><div><small>CONNECT</small><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube <ExternalLink size={13} /></a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={13} /></a></div></div></div><div className="content-grid footer-bottom"><span>© 2026 CodePatch</span><span>Made with intent <GitBranch size={14} /></span></div></footer> }

export default App
