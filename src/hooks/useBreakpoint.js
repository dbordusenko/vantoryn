import { useState, useEffect } from 'react'

/**
 * Returns current viewport width and convenience booleans.
 * isMobile  — < 640px
 * isTablet  — < 1024px
 * isDesktop — >= 1024px
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    let raf
    const handler = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setWidth(window.innerWidth))
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
      cancelAnimationFrame(raf)
    }
  }, [])

  return {
    width,
    isMobile:  width < 640,
    isTablet:  width < 1024,
    isDesktop: width >= 1024,
  }
}
