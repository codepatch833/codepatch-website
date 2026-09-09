import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default function Analytics() {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId || document.querySelector(`script[data-ga-id="${measurementId}"]`)) return

    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
    window.gtag('js', new Date())
    window.gtag('config', measurementId, { anonymize_ip: true })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.dataset.gaId = measurementId
    document.head.appendChild(script)
  }, [])

  return null
}
