import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Analytics from './Analytics'
import codepatchLogo from '../assets/codepatch logo.png'
import './styles.css'

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/png'
favicon.href = codepatchLogo
document.head.appendChild(favicon)
document.title = 'CodePatch - Build, Explore, Repeat.'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <App />
  </StrictMode>,
)
