import { useState, useEffect } from "react"

function getValues() {
  if (typeof window === "undefined") return { isMobile: false, isTablet: false }
  const width = window.innerWidth
  return {
    isMobile: width < 576,
    isTablet: width >= 576 && width < 1024,
  }
}

export default function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(() => getValues().isMobile)
  const [isTablet, setIsTablet] = useState(() => getValues().isTablet)

  useEffect(() => {
    const check = () => {
      const { isMobile, isTablet } = getValues()
      setIsMobile(isMobile)
      setIsTablet(isTablet)
    }

    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const isTouch = isMobile || isTablet

  return { isMobile, isTablet, isTouch }
}