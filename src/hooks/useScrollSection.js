import { useState, useEffect } from "react"

const TOTAL_SECTIONS = 4 // Home, Summary, Skills, Projects

export default function useScrollSection() {
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setCurrentSection(prev => Math.min(prev + 1, TOTAL_SECTIONS - 1))
      }
      if (e.key === "ArrowUp") {
        setCurrentSection(prev => Math.max(prev - 1, 0))
      }
    }

    const handleScroll = (e) => {
      if (e.deltaY > 0) {
        // scrolling down
        setCurrentSection(prev => Math.min(prev + 1, TOTAL_SECTIONS - 1))
      } else {
        // scrolling up
        setCurrentSection(prev => Math.max(prev - 1, 0))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("wheel", handleScroll)

    // cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", handleScroll)
    }
  }, [])

  return currentSection
}