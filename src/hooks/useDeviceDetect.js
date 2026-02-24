import { useState, useEffect } from "react"

export default function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth
      setIsMobile(width < 576)
      setIsTablet(width >= 576 && width < 1024)
      // only hide cursor on actual small screens
      setIsTouch(width < 1024)
    }

    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return { isMobile, isTablet, isTouch }
}