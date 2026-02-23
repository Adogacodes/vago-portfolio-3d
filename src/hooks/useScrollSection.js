import { useState, useEffect, useRef, useCallback } from "react"

const TOTAL_SECTIONS = 4

export default function useScrollSection() {
  const [currentSection, setCurrentSection] = useState(0)
  const [previousSection, setPreviousSection] = useState(0)
  const isThrottled = useRef(false)
  const currentSectionRef = useRef(0)

  // keep ref in sync with state
  useEffect(() => {
    currentSectionRef.current = currentSection
  }, [currentSection])

  const navigate = useCallback((next) => {
    if (isThrottled.current) return
    const current = currentSectionRef.current
    if (next === current) return
    if (next < 0 || next >= TOTAL_SECTIONS) return

    isThrottled.current = true
    setPreviousSection(current)
    setCurrentSection(next)

    setTimeout(() => {
      isThrottled.current = false
    }, 1500)
  }, [])

  const goToNext = useCallback(() => {
    navigate(currentSectionRef.current + 1)
  }, [navigate])

  const goToPrev = useCallback(() => {
    navigate(currentSectionRef.current - 1)
  }, [navigate])

  const goToSection = useCallback((index) => {
    navigate(index)
  }, [navigate])

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
  }, [goToNext, goToPrev])

  return { currentSection, previousSection, goToSection }
}