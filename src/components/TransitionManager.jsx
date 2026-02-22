import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const TRANSITION_COLORS = {
  "0-1": "#000000", // Home -> Summary : black warp
  "1-2": "#000000", // Summary -> Skills : black fade
  "2-3": "#000000", // Skills -> Projects : black zoom feel
  "1-0": "#000000", // backwards
  "2-1": "#000000",
  "3-2": "#000000",
}

export default function TransitionManager({ currentSection, previousSection, onTransitionComplete }) {
  const isAnimating = useRef(false)

  useEffect(() => {
    if (currentSection === previousSection) return
    if (isAnimating.current) return

    isAnimating.current = true

    const overlay = document.getElementById("transition-overlay")
    const key = `${previousSection}-${currentSection}`
    const color = TRANSITION_COLORS[key] || "#000000"

    // set overlay color
    gsap.set(overlay, { backgroundColor: color })

    gsap.timeline()
      .to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.in",
      })
      .call(() => {
        // swap scene while completely hidden
        onTransitionComplete()
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.05,
        onComplete: () => {
          isAnimating.current = false
        }
      })

  }, [currentSection])

  return null
}