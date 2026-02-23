import { useEffect, useRef } from "react"
import "./SpaceshipCursor.css"

export default function SpaceshipCursor({ accentColor }) {
  const cursorRef = useRef()
  const canvasRef = useRef()
  const particlesRef = useRef([])
  const particleId = useRef(0)
  const animationRef = useRef()
  const accentColorRef = useRef(accentColor)

  // keep accentColor up to date without restarting the loop
  useEffect(() => {
    accentColorRef.current = accentColor
  }, [accentColor])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // make canvas full screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      // move spaceship
      if (cursorRef.current) {
        cursorRef.current.style.left = `${x}px`
        cursorRef.current.style.top = `${y}px`
      }

      // spawn fewer particles per move
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          id: particleId.current++,
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.7 + 0.2,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 + 0.3,
          life: 1,
          decay: Math.random() * 0.025 + 0.015,
        })
      }
    }

    // animation loop — draws on canvas instead of DOM
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => p.life > 0)

      for (const p of particlesRef.current) {
        // update
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy *= 0.97
        p.size *= 0.97
        p.life -= p.decay
        p.opacity = p.life * 0.8

        // draw glowing circle on canvas
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = accentColorRef.current
        ctx.globalAlpha = p.opacity
        ctx.shadowBlur = p.size * 3
        ctx.shadowColor = accentColorRef.current
        ctx.fill()
        ctx.closePath()
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      {/* Single canvas for all particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Spaceship cursor */}
      <div ref={cursorRef} className="spaceship-cursor">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "rotate(135deg)" }}
        >
          <path
            d="M16 2 L20 24 L16 20 L12 24 Z"
            fill={accentColor}
            opacity="0.9"
          />
          <path
            d="M16 10 L26 22 L20 18 Z"
            fill={accentColor}
            opacity="0.6"
          />
          <path
            d="M16 10 L6 22 L12 18 Z"
            fill={accentColor}
            opacity="0.6"
          />
          <circle cx="16" cy="10" r="2.5" fill="#ffffff" opacity="0.9" />
          <circle cx="16" cy="21" r="1.5" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>
    </>
  )
}