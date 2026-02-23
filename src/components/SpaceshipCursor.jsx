import { useEffect, useRef } from "react"
import "./SpaceshipCursor.css"

export default function SpaceshipCursor({ accentColor }) {
  const cursorRef = useRef()
  const canvasRef = useRef()
  const particlesRef = useRef([])
  const animationRef = useRef()
  const accentColorRef = useRef(accentColor)
  const lastSpawnTime = useRef(0)
  const frameCount = useRef(0)
  const isVisible = useRef(false)

  useEffect(() => {
    accentColorRef.current = accentColor
  }, [accentColor])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { alpha: true })

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const show = () => {
      if (isVisible.current) return
      isVisible.current = true
      if (cursorRef.current) cursorRef.current.style.opacity = "1"
      if (canvasRef.current) canvasRef.current.style.opacity = "1"
    }

    const hide = () => {
      isVisible.current = false
      if (cursorRef.current) cursorRef.current.style.opacity = "0"
      if (canvasRef.current) canvasRef.current.style.opacity = "0"
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      show()

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }

      const now = Date.now()
      if (now - lastSpawnTime.current < 60) return
      lastSpawnTime.current = now

      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        size: 2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        life: 1,
      })

      if (particlesRef.current.length > 12) {
        particlesRef.current.shift()
      }
    }

    const handleMouseLeave = (e) => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        hide()
      }
    }

    const animate = () => {
      frameCount.current++

      if (frameCount.current % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i]

          p.x += p.vx
          p.y += p.vy
          p.life -= 0.05
          p.size *= 0.95

          if (p.life <= 0) {
            particlesRef.current.splice(i, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = accentColorRef.current
          ctx.globalAlpha = p.life * 0.6
          ctx.fill()
          ctx.closePath()
        }

        ctx.globalAlpha = 1
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <div
        ref={cursorRef}
        className="spaceship-cursor"
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "rotate(45deg)" }}
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