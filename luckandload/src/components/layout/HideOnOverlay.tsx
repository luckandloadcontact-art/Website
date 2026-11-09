'use client'
import { usePathname } from 'next/navigation'

// Hides site chrome (navbar, footer) on /overlay pages, which are loaded into OBS as browser sources.
export function HideOnOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/overlay')) return null
  return <>{children}</>
}
