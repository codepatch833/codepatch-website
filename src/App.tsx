import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Code2, ExternalLink, GitBranch, Globe2, Menu, Moon, Play, Sun, Video, X } from 'lucide-react'
import codepatchLogo from '../assets/codepatch logo.png'
import pathToFactLogo from '../assets/PathToFact Logo.png'

type Page = 'home' | 'projects' | 'about' | 'path'
type Category = 'All' | 'Games' | 'Software' | 'Experiments' | 'Tools'
type Language = 'English' | 'Italiano'
type VideoItem = { id: string; title: string; description: string; publishedAt: string; thumbnail: string }
type ChannelStats = { subscribers: string; views: string; videos: string }
type VideoStats = { views: string; likes: string }
type ItchProject = { id: string; title: string; url: string; coverUrl: string; price: string; publishedAt: string; engine: string; description: string }
type CachedData<T> = { savedAt: number; data: T }
type YoutubeCache = { videos: VideoItem[]; latestVideo: VideoItem | null; channelStats: ChannelStats | null; videoStats: VideoStats[] }

const pathToFactChannel = 'https://www.youtube.com/channel/UCLNG7PfbdAo5WHB16BPYN1A'
const itchApiUrl = 'https://itch.io/api/1'
const cacheLifetime = 24 * 60 * 60 * 1000

function readCache<T>(key: string) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as CachedData<T> | null } catch { return null }
}

function writeCache<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedData<T>))
}

const projects = [
  { title: 'Layer 0: Find the Impostor', category: 'Games', year: '2025', description: 'An investigation game in UN cyberspace. Complete tasks, observe and vote across three rounds.', tags: ['Unity', 'Strategy'], tone: 'blue', icon: '01', link: 'https://codepatch.itch.io/layer-0' },
  { title: 'Formula X - F1 Manager', category: 'Games', year: '2025', description: 'An F1 management game that takes the series into the future.', tags: ['Unity', 'Simulation'], tone: 'violet', icon: '02', link: 'https://codepatch.itch.io/formula-x' },
  { title: 'WarEve - Domains\' Return', category: 'Games', year: '2025', description: 'A game about going back through history, built around war and simulation.', tags: ['Unity', 'Simulation'], tone: 'coral', icon: '03', link: 'https://codepatch.itch.io/wareve-domains-return' },
  { title: 'Lumber Jack', category: 'Games', year: '2024', description: 'Become a fast lumber jack in this focused arcade simulation.', tags: ['Unity', 'Arcade'], tone: 'lime', icon: '04', link: 'https://codepatch.itch.io/lumber-jack' },
  { title: 'F1 Manager S2', category: 'Games', year: '2023', description: 'The second chapter of the F1 Manager series.', tags: ['Scratch', 'Racing'], tone: 'blue', icon: '05', link: 'https://codepatch.itch.io/f1-manager-s2' },
  { title: 'F1 Manager Classic', category: 'Games', year: '2022', description: 'The first chapter of the F1 Manager series.', tags: ['Scratch', 'Racing'], tone: 'violet', icon: '06', link: 'https://codepatch.itch.io/f1-manager-classic' },
]

const itchEngineBySlug: Record<string, string> = { 'layer-0': 'Unity', 'formula-x': 'Unity', 'wareve-domains-return': 'Unity', 'lumber-jack': 'Unity', 'f1-manager-s2': 'Scratch', 'f1-manager-classic': 'Scratch' }

const copy = {
  English: { home: 'Home', projects: 'Projects', about: 'About', path: 'Path to Fact', eyebrow: 'CODEPATCH / DIGITAL CREATOR', title: 'Building games,\nsoftware & ideas.', intro: 'I’m CodePatch, a programmer creating games, software and digital experiences.', selected: 'Selected projects', viewAll: 'View all projects', aboutTitle: 'A digital identity for\ncurious builders.', pathIntro: 'A YouTube channel by two friends exploring interesting topics, facts, ideas and stories.', explore: 'Explore Path to Fact', available: 'Available for selected work', based: 'Based in Italy · Working worldwide', work: 'WORK', approach: 'APPROACH', sideProject: 'SIDE PROJECT', approachText: 'CodePatch is a small creative practice focused on thoughtful digital experiences, from the first sketch to the final detail.', selectedWork: 'SELECTED WORK', projectsIntro: 'A collection of games built across Scratch and Unity, from investigation and simulation to racing and arcade experiments.', person: 'THE PERSON BEHIND THE WORK', toolbox: 'TOOLBOX / EDITABLE', contact: 'CONTACT', pathProject: 'PATH TO FACT / YOUTUBE PROJECT', visitYoutube: 'Visit YouTube', signal: 'CHANNEL SIGNAL / 001', latestVideo: 'Click to watch our latest video', channelSignal: 'CHANNEL / LIVE SIGNAL', subscribers: 'Subscribers', channelViews: 'Channel views', publishedVideos: 'Published videos', topLikes: 'Likes on top videos', featuredVideos: 'FEATURED / VIDEOS', stories: 'Stories worth', following: 'following.', discover: 'Discover Path to Fact on YouTube', discoverText: 'Open the channel to see the latest videos.', archive: 'Explore the Path to Fact archive', archiveText: 'Stories, facts and ideas from the channel.', moreStories: 'More stories are waiting', moreStoriesText: 'The most popular videos load automatically when the API is configured.', channel: 'Path to Fact · YouTube', views: 'views', likes: 'likes', exploreLabel: 'EXPLORE', connect: 'CONNECT', tagline: 'Building things worth clicking.' },
  Italiano: { home: 'Home', projects: 'Progetti', about: 'Chi sono', path: 'Path to Fact', eyebrow: 'CODEPATCH / CREATORE DIGITALE', title: 'Creo giochi,\nsoftware e idee.', intro: 'Sono CodePatch, un programmatore che crea giochi, software ed esperienze digitali.', selected: 'Progetti selezionati', viewAll: 'Vedi tutti i progetti', aboutTitle: 'Un’identità digitale per\nchi costruisce con curiosità.', pathIntro: 'Un canale YouTube creato da due amici per esplorare fatti, idee e storie interessanti.', explore: 'Esplora Path to Fact', available: 'Disponibile per progetti selezionati', based: 'Basato in Italia · Lavoro in tutto il mondo', work: 'LAVORI', approach: 'APPROCCIO', sideProject: 'PROGETTO LATERALE', approachText: 'CodePatch è un piccolo laboratorio creativo dedicato a esperienze digitali curate, dal primo schizzo al dettaglio finale.', selectedWork: 'LAVORI SELEZIONATI', projectsIntro: 'Una raccolta di giochi creati con Scratch e Unity: investigazione, simulazione, corse ed esperimenti arcade.', person: 'LA PERSONA DIETRO I PROGETTI', toolbox: 'STRUMENTI / MODIFICABILI', contact: 'CONTATTI', pathProject: 'PATH TO FACT / PROGETTO YOUTUBE', visitYoutube: 'Visita YouTube', signal: 'SEGNALE CANALE / 001', latestVideo: 'Clicca per vedere il nostro ultimo video', channelSignal: 'CANALE / SEGNALE LIVE', subscribers: 'Iscritti', channelViews: 'Visualizzazioni canale', publishedVideos: 'Video pubblicati', topLikes: 'Like dei video principali', featuredVideos: 'VIDEO IN EVIDENZA', stories: 'Storie da', following: 'seguire.', discover: 'Scopri Path to Fact su YouTube', discoverText: 'Apri il canale per vedere gli ultimi video.', archive: 'Esplora l’archivio Path to Fact', archiveText: 'Storie, fatti e idee dal canale.', moreStories: 'Altre storie stanno arrivando', moreStoriesText: 'I video più popolari vengono caricati automaticamente quando l’API è configurata.', channel: 'Path to Fact · YouTube', views: 'visualizzazioni', likes: 'like', exploreLabel: 'ESPLORA', connect: 'COLLEGAMENTI', tagline: 'Costruire cose su cui vale la pena cliccare.' },
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
    <main className="page-transition" key={page}>{page === 'home' && <Home t={t} navigate={navigate} />}{page === 'projects' && <Projects t={t} category={category} setCategory={setCategory} navigate={navigate} />}{page === 'about' && <About t={t} />}{page === 'path' && <Path t={t} />}</main>
    <Footer navigate={navigate} t={t} />
  </div>
}

function NavItem({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{label}</button> }
function Button({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) { return <button onClick={onClick} className={`button ${secondary ? 'secondary' : ''}`}>{children}<ArrowUpRight size={16} /></button> }
function SectionLabel({ children }: { children: React.ReactNode }) { return <div className="section-label"><span />{children}</div> }

function Home({ t, navigate }: { t: typeof copy.English; navigate: (p: Page) => void }) { return <>
  <section className="hero content-grid"><div className="hero-copy reveal"><SectionLabel>{t.eyebrow}</SectionLabel><h1>{t.title.split('\n').map((line, i) => <span key={line} className={i === 1 ? 'gradient-text' : ''}>{line}</span>)}</h1><p className="hero-intro">{t.intro}</p><div className="hero-buttons"><Button onClick={() => navigate('projects')}>{t.viewAll}</Button><Button secondary onClick={() => navigate('about')}>{t.about}</Button></div><div className="hero-meta"><span><i className="status-dot" />{t.available}</span><span>{t.based}</span></div></div><HeroVisual /></section>
  <section className="section content-grid projects-preview"><div className="section-heading"><div><SectionLabel>01 / {t.work}</SectionLabel><h2>{t.selected}</h2></div><button className="text-link" onClick={() => navigate('projects')}>{t.viewAll} <ArrowUpRight size={16} /></button></div><div className="project-grid">{projects.slice(0, 3).map(project => <ProjectCard key={project.title + project.icon} project={project} language={t.home === 'Home' ? 'English' : 'Italiano'} />)}</div></section>
  <section className="statement"><div className="content-grid statement-inner"><SectionLabel>02 / {t.approach}</SectionLabel><h2>{languageLine(t, 'Make it useful.', 'Rendilo utile.')}<br /><em>{languageLine(t, 'Make it memorable.', 'Rendilo memorabile.')}</em></h2><p>{t.approachText}</p></div></section>
  <section className="path-teaser content-grid"><div><SectionLabel>03 / {t.sideProject}</SectionLabel><h2>{t.home === 'Home' ? <>Curiosity takes<br /><span>you somewhere.</span></> : <>La curiosità ti porta<br /><span>da qualche parte.</span></>}</h2><p>{t.pathIntro}</p><Button secondary onClick={() => navigate('path')}>{t.explore}</Button></div><div className="path-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><img className="orbit-logo" src={pathToFactLogo} alt="Path to Fact" /><span className="orbit-note note-one">{t.home === 'Home' ? 'facts' : 'fatti'}</span><span className="orbit-note note-two">{t.home === 'Home' ? 'stories' : 'storie'}</span></div></section>
</> }

function languageLine(t: typeof copy.English, english: string, italian: string) { return t.home === 'Home' ? english : italian }

function HeroVisual() { return <div className="hero-visual" aria-label="Abstract CodePatch visual"><div className="visual-grid" /><div className="visual-glow" /><div className="code-window"><div className="window-bar"><span /><span /><span /><small>codepatch.ts</small></div><div className="code-lines"><p><b>const</b> future <i>=</i> <strong>{'{'}</strong></p><p className="indent">build: <mark>"with intent"</mark>,</p><p className="indent">ship: <mark>true</mark>,</p><p><strong>{'}'}</strong></p></div></div><div className="float-chip chip-one"><Code2 size={15} /> creative systems</div><div className="float-chip chip-two">01<span>/04</span></div><div className="visual-caption">IDEAS → <b>REALITY</b></div></div> }

function ProjectCard({ project, language = 'English' }: { project: typeof projects[number]; language?: Language }) { const categoryLabel = language === 'Italiano' ? ({ Games: 'GIOCHI', Software: 'SOFTWARE', Experiments: 'ESPERIMENTI', Tools: 'STRUMENTI' }[project.category] ?? project.category).toUpperCase() : project.category.toUpperCase(); return <a className={`project-card ${project.tone}`} href={project.link} target="_blank" rel="noreferrer"><div className="project-art"><span className="art-index">{project.icon} / {categoryLabel}</span><div className="art-shape" /><span className="art-year">{project.year}</span><ArrowUpRight className="art-arrow" size={20} /></div><div className="project-info"><div><h3>{project.title}</h3><p>{projectDescription(project, language)}</p></div><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></a> }

function ItchCard({ project, language }: { project: ItchProject; language: Language }) { return <a className="itch-card" href={project.url} target="_blank" rel="noreferrer"><div className="itch-cover" style={{ backgroundImage: `url(${project.coverUrl})` }}><span>itch.io</span><ArrowUpRight size={20} /></div><div className="itch-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><div className="itch-meta"><span>{project.engine}</span><span>{project.price === '0' ? (language === 'Italiano' ? 'Gratis' : 'Free') : project.price}</span><span>{project.publishedAt}</span></div></div></a> }

function projectDescription(project: typeof projects[number], language: Language) { if (language === 'English') return project.description; const descriptions: Record<string, string> = { 'Layer 0: Find the Impostor': 'Un gioco investigativo nel cyberspazio dell’ONU: completa i compiti, osserva e vota in tre round.', 'Formula X - F1 Manager': 'Un gioco manageriale di Formula 1 che porta la serie nel futuro.', "WarEve - Domains' Return": 'Un gioco che permette di tornare indietro nella storia, tra guerra e simulazione.', 'Lumber Jack': 'Diventa un taglialegna veloce in questa simulazione arcade.', 'F1 Manager S2': 'Il secondo capitolo della serie F1 Manager.', 'F1 Manager Classic': 'Il primo capitolo della serie F1 Manager.' }; return descriptions[project.title] ?? project.description }

function Projects({ t, category, setCategory, navigate: _navigate }: { t: typeof copy.English; category: Category; setCategory: (c: Category) => void; navigate: (p: Page) => void }) {
  const [itchProjects, setItchProjects] = useState<ItchProject[]>([])
  const categories: Category[] = ['All', 'Games', 'Software', 'Experiments', 'Tools']
  const shown = category === 'All' ? projects : projects.filter(p => p.category === category)
  const labels = t.home === 'Home' ? categories : ['Tutti', 'Giochi', 'Software', 'Esperimenti', 'Strumenti']

  useEffect(() => {
    const apiKey = import.meta.env.VITE_ITCH_API_KEY
    if (!apiKey) return
    const cached = readCache<ItchProject[]>('codepatch-itch-projects')
    if (cached) setItchProjects(cached.data)
    if (cached && Date.now() - cached.savedAt < cacheLifetime) return
    fetch(`${itchApiUrl}/${apiKey}/my-games`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('itch.io request failed')))
      .then(data => (data.games ?? []).map((game: { id: number; title: string; url: string; cover_url?: string; price?: number; published_at?: string; short_text?: string }) => {
        const slug = game.url.split('/').pop() ?? ''
        return { id: String(game.id), title: game.title, url: game.url, coverUrl: game.cover_url ?? '', price: game.price ? `$${game.price}` : '0', publishedAt: game.published_at ? new Date(game.published_at).toLocaleDateString() : '', engine: itchEngineBySlug[slug] ?? 'Game engine', description: game.short_text ?? '' }
      }))
      .then(nextProjects => { setItchProjects(nextProjects); writeCache('codepatch-itch-projects', nextProjects) })
      .catch(() => { if (!cached) setItchProjects([]) })
  }, [])

  return <section className="page-section content-grid"><div className="page-intro"><SectionLabel>01 / {t.selectedWork}</SectionLabel><h1>{t.home === 'Home' ? 'Projects that' : 'Progetti che'}<br /><span className="gradient-text">{t.home === 'Home' ? 'move ideas forward.' : 'portano avanti le idee.'}</span></h1><p>{t.projectsIntro}</p></div><div className="filters">{categories.map((item, index) => <button className={category === item ? 'selected' : ''} onClick={() => setCategory(item)} key={item}>{labels[index]}</button>)}</div><div className="project-grid projects-page-grid">{shown.map(project => <ProjectCard key={project.icon} project={project} language={t.home === 'Home' ? 'English' : 'Italiano'} />)}</div><div className="itch-section"><div className="section-heading"><div><SectionLabel>ITCH.IO / {t.home === 'Home' ? 'PUBLISHED GAMES' : 'GIOCHI PUBBLICATI'}</SectionLabel><h2>{t.home === 'Home' ? 'Made to be played.' : 'Creati per essere giocati.'}</h2></div></div><div className="itch-grid">{(itchProjects.length ? itchProjects : projects.map(project => ({ id: project.icon, title: project.title, url: project.link, coverUrl: '', price: '0', publishedAt: project.year, engine: project.tags[0], description: project.description }))).map(project => <ItchCard key={project.id} project={project} language={t.home === 'Home' ? 'English' : 'Italiano'} />)}</div></div></section>
}

function About({ t }: { t: typeof copy.English }) { return <section className="page-section content-grid about-page"><div className="page-intro"><SectionLabel>02 / {t.person}</SectionLabel><h1>{t.aboutTitle.split('\n').map(line => <span key={line}>{line}</span>)}</h1><p>{t.intro} {t.home === 'Home' ? 'I’m Italian, a student and a tennis player who started creating with Scratch before moving into Unity and game development. I build games for fun, keep learning development languages and value honest feedback.' : 'Sono italiano, studente e tennista. Ho iniziato a creare con Scratch prima di passare a Unity e allo sviluppo di giochi. Creo per divertirmi, continuo a studiare linguaggi di programmazione e considero importante il feedback sincero.'}</p></div><div className="about-layout"><div className="about-note"><span className="quote-mark">“</span><p>{t.home === 'Home' ? 'From Scratch experiments to Unity games, every project is a way to keep learning.' : 'Dagli esperimenti con Scratch ai giochi in Unity, ogni progetto è un modo per continuare a imparare.'}</p><span className="note-signature">— CodePatch</span><div className="profile-links"><a href="https://codepatch.itch.io/" target="_blank" rel="noreferrer">itch.io <ExternalLink size={13} /></a><a href="https://scratch.mit.edu/users/codepatch/" target="_blank" rel="noreferrer">Scratch <ExternalLink size={13} /></a><a href="https://www.youtube.com/channel/UCLNG7PfbdAo5WHB16BPYN1A" target="_blank" rel="noreferrer">YouTube <ExternalLink size={13} /></a></div></div><div className="toolbox"><SectionLabel>{t.toolbox}</SectionLabel><div className="tool-list">{['Scratch', 'Unity', 'C#', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'].map((tool, i) => <div key={tool}><span>0{i + 1}</span>{tool}<ArrowUpRight size={14} /></div>)}</div><div className="contact-list"><small>{t.contact}</small><a href="mailto:codepatch833@gmail.com">codepatch833@gmail.com</a><a href="mailto:pathtofact.info@gmail.com">pathtofact.info@gmail.com</a></div></div></div></section> }

function Path({ t }: { t: typeof copy.English }) {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [latestVideo, setLatestVideo] = useState<VideoItem | null>(null)
  const [channelStats, setChannelStats] = useState<ChannelStats | null>(null)
  const [videoStats, setVideoStats] = useState<VideoStats[]>([])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!apiKey) return
    const cached = readCache<YoutubeCache>('codepatch-youtube-data')
    if (cached) {
      setVideos(cached.data.videos)
      setLatestVideo(cached.data.latestVideo)
      setChannelStats(cached.data.channelStats)
      setVideoStats(cached.data.videoStats)
    }
    if (cached && Date.now() - cached.savedAt < cacheLifetime) return
    const request = (url: string) => fetch(url).then(response => response.ok ? response.json() : Promise.reject(new Error('YouTube request failed')))
    let fetchedVideos: VideoItem[] = []
    let fetchedLatestVideo: VideoItem | null = null
    let fetchedChannelStats: ChannelStats | null = null
    Promise.all([
      request(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCLNG7PfbdAo5WHB16BPYN1A&key=${apiKey}`),
      request(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCLNG7PfbdAo5WHB16BPYN1A&maxResults=3&order=viewCount&type=video&key=${apiKey}`),
      request(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCLNG7PfbdAo5WHB16BPYN1A&maxResults=1&order=date&type=video&key=${apiKey}`),
    ])
      .then(([channelData, searchData, latestData]) => {
        const channel = channelData.items?.[0]?.statistics
        fetchedChannelStats = channel ? { subscribers: channel.hiddenSubscriberCount ? 'Hidden' : channel.subscriberCount, views: channel.viewCount, videos: channel.videoCount } : null
        if (fetchedChannelStats) setChannelStats(fetchedChannelStats)
        const nextVideos = (searchData.items ?? []).map((item: { id: { videoId: string }; snippet: { title: string; description: string; publishedAt: string; thumbnails: { high?: { url: string }; medium?: { url: string } } } }) => ({ id: item.id.videoId, title: item.snippet.title, description: item.snippet.description, publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(), thumbnail: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url ?? '' }))
        fetchedVideos = nextVideos
        setVideos(nextVideos)
        const latest = latestData.items?.[0]
        fetchedLatestVideo = latest ? { id: latest.id.videoId, title: latest.snippet.title, description: latest.snippet.description, publishedAt: new Date(latest.snippet.publishedAt).toLocaleDateString(), thumbnail: latest.snippet.thumbnails.high?.url ?? latest.snippet.thumbnails.medium?.url ?? '' } : null
        if (fetchedLatestVideo) setLatestVideo(fetchedLatestVideo)
        return request(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${nextVideos.map((video: VideoItem) => video.id).join(',')}&key=${apiKey}`)
      })
      .then(data => {
        const nextVideoStats = (data.items ?? []).map((item: { statistics: { viewCount?: string; likeCount?: string } }) => ({ views: item.statistics.viewCount ?? '0', likes: item.statistics.likeCount ?? '0' }))
        setVideoStats(nextVideoStats)
        const nextData = { videos: fetchedVideos, latestVideo: fetchedLatestVideo, channelStats: fetchedChannelStats, videoStats: nextVideoStats }
        writeCache('codepatch-youtube-data', nextData)
      })
      .catch(() => { if (!cached) setVideos([]) })
  }, [])

  const fallbackVideos = [{ id: '', title: t.discover, description: t.discoverText, publishedAt: '', thumbnail: '' }, { id: '', title: t.archive, description: t.archiveText, publishedAt: '', thumbnail: '' }, { id: '', title: t.moreStories, description: t.moreStoriesText, publishedAt: '', thumbnail: '' }]
  const visibleVideos = videos.length ? videos : fallbackVideos
  return <section className="path-page"><div className="path-hero content-grid"><div className="path-copy"><img className="path-logo" src={pathToFactLogo} alt="Path to Fact" /><SectionLabel>{t.pathProject}</SectionLabel><h1>{t.home === 'Home' ? <>Curiosity takes<br /><em>you somewhere.</em></> : <>La curiosità ti porta<br /><em>da qualche parte.</em></>}</h1><p>{t.pathIntro}</p><a className="button path-button" href={pathToFactChannel} target="_blank" rel="noreferrer">{t.visitYoutube} <Video size={16} /></a></div><div className="film-frame"><div className="film-lines" /><div className="film-center"><span>PTF</span><a className="latest-video-link" href={latestVideo ? `https://www.youtube.com/watch?v=${latestVideo.id}` : pathToFactChannel} target="_blank" rel="noreferrer">{latestVideo?.thumbnail && <img src={latestVideo.thumbnail} alt="" />}<strong>{t.latestVideo}</strong><small>{latestVideo ? latestVideo.title : t.signal}</small></a></div></div></div><div className="content-grid stats-section"><SectionLabel>{t.channelSignal}</SectionLabel><p className="channel-description">{t.home === 'Home' ? 'Path to Fact is a YouTube channel created by two friends to explore interesting topics, facts, ideas and stories. Follow the signal and see where curiosity leads.' : 'Path to Fact è un canale YouTube creato da due amici per esplorare argomenti, fatti, idee e storie interessanti. Segui il segnale e scopri dove porta la curiosità.'}</p><div className="stats-grid"><Stat value={channelStats ? formatCount(channelStats.subscribers) : '—'} label={t.subscribers} /><Stat value={channelStats ? formatCount(channelStats.views) : '—'} label={t.channelViews} /><Stat value={channelStats ? formatCount(channelStats.videos) : '—'} label={t.publishedVideos} /><Stat value={videoStats.length ? formatCount(videoStats.reduce((total, video) => total + Number(video.likes), 0).toString()) : '—'} label={t.topLikes} /></div></div><div className="content-grid video-section"><div className="section-heading"><div><SectionLabel>{t.featuredVideos}</SectionLabel><h2>{t.stories}<br /><em>{t.following}</em></h2></div></div><div className="video-grid">{visibleVideos.map((video, i) => <a className="video-card" href={video.id ? `https://www.youtube.com/watch?v=${video.id}` : pathToFactChannel} target="_blank" rel="noreferrer" key={video.id || i}><div className={`video-thumb video-${i + 1}`} style={video.thumbnail ? { backgroundImage: `url(${video.thumbnail})` } : undefined}><span>{video.publishedAt || `PTF / 0${i + 1}`}</span><button aria-label={`Play ${video.title}`}><Play size={18} fill="currentColor" /></button></div><div><h3>{video.title}</h3><p>{video.description || t.channel}</p>{videoStats[i] && <small className="video-metrics">{formatCount(videoStats[i].views)} {t.views} · {formatCount(videoStats[i].likes)} {t.likes}</small>}</div></a>)}</div></div></section>
}

function formatCount(value: string) { const number = Number(value); return Number.isFinite(number) ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(number) : value }
function Stat({ value, label }: { value: string; label: string }) { return <div className="stat-card"><strong>{value}</strong><span>{label}</span></div> }

function Footer({ navigate, t }: { navigate: (p: Page) => void; t: typeof copy.English }) { return <footer><div className="content-grid footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-logo-frame"><img src={codepatchLogo} alt="CodePatch" /></span><span className="brand-name">CodePatch</span></button><p>{t.tagline}</p></div><div className="footer-links"><div><small>{t.exploreLabel}</small><button onClick={() => navigate('home')}>{t.home}</button><button onClick={() => navigate('projects')}>{t.projects}</button><button onClick={() => navigate('about')}>{t.about}</button><button onClick={() => navigate('path')}>{t.path}</button></div><div><small>{t.connect}</small><a href="https://codepatch.itch.io/" target="_blank" rel="noreferrer">itch.io <ExternalLink size={13} /></a><a href="https://www.youtube.com/channel/UCLNG7PfbdAo5WHB16BPYN1A" target="_blank" rel="noreferrer">YouTube <ExternalLink size={13} /></a><a href="mailto:codepatch833@gmail.com">Email <ExternalLink size={13} /></a></div></div></div><div className="content-grid footer-bottom"><span>© 2026 CodePatch</span><span>{t.home === 'Home' ? 'Made with intent' : 'Creato con intenzione'} <GitBranch size={14} /></span></div></footer> }

export default App
