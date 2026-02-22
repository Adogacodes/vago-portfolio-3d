import { useState, useEffect, useRef } from "react"

const TOTAL_SECTIONS = 4

export default function useScrollSection() {
  const [currentSection, setCurrentSection] = useState(0)
  const [previousSection, setPreviousSection] = useState(0)
  const isThrottled = useRef(false)

  const goToNext = () => {
    if (isThrottled.current) return
    isThrottled.current = true

    setCurrentSection(prev => {
      const next = Math.min(prev + 1, TOTAL_SECTIONS - 1)
      if (next !== prev) setPreviousSection(prev)
      return next
    })

    // lock input for 1.5 seconds to let transition finish
    setTimeout(() => {
      isThrottled.current = false
    }, 1500)
  }

  const goToPrev = () => {
    if (isThrottled.current) return
    isThrottled.current = true

    setCurrentSection(prev => {
      const next = Math.max(prev - 1, 0)
      if (next !== prev) setPreviousSection(prev)
      return next
    })

    setTimeout(() => {
      isThrottled.current = false
    }, 1500)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") goToNext()
      if (e.key === "ArrowUp") goToPrev()
    }

    const handleScroll = (e) => {
      if (e.deltaY > 0) goToNext()
      else goToPrev()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("wheel", handleScroll)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", handleScroll)
    }
  }, [])

  return { currentSection, previousSection }
}