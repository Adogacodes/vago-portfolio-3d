import { useRef, useMemo, useState, useEffect, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import * as THREE from "three"
import { projects } from "../../constants/data"
import "./ProjectsScene.css"


// placeholder project image
function createProjectPlaceholder(index) {
  const canvas = document.createElement("canvas")
  canvas.width = 480
  canvas.height = 200
  const ctx = canvas.getContext("2d")

  const colors = [
    ["#ff44aa", "#aa44ff"],
    ["#aa44ff", "#4444ff"],
    ["#ff44aa", "#ff8844"],
  ]

  const [c1, c2] = colors[index % colors.length]
  const gradient = ctx.createLinearGradient(0, 0, 480, 200)
  gradient.addColorStop(0, c1 + "88")
  gradient.addColorStop(1, c2 + "88")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 480, 200)

  // grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.1)"
  ctx.lineWidth = 1
  for (let x = 0; x < 480; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 200)
    ctx.stroke()
  }
  for (let y = 0; y < 200; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(480, y)
    ctx.stroke()
  }

  // project number
  ctx.fillStyle = "rgba(255,255,255,0.15)"
  ctx.font = "bold 80px Segoe UI"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(`0${index + 1}`, 240, 100)

  return canvas.toDataURL()
}

// light streak flying past
function LightStreak({ color }) {
  const ref = useRef()
  const data = useRef({
    x: (Math.random() - 0.5) * 20,
    y: -1 + Math.random() * 4,
    z: -2 + Math.random() * 4,
    speed: 0.15 + Math.random() * 0.25,
    length: 1 + Math.random() * 2,
  })

  useFrame(() => {
    if (!ref.current) return
    ref.current.position.x += data.current.speed
    if (ref.current.position.x > 14) {
      ref.current.position.x = -14
      ref.current.position.y = -1 + Math.random() * 4
    }
  })

  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-data.current.length, 0, 0)
  ]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line
      ref={ref}
      position={[data.current.x, data.current.y, data.current.z]}
      geometry={geometry}
    >
      <lineBasicMaterial color={color} transparent opacity={0.6} />
    </line>
  )
}

// neon grid floor
function NeonGrid() {
  const gridLines = useMemo(() => {
    const lines = []
    const count = 20
    const size = 16
    const spacing = size / count

    // horizontal lines
    for (let i = 0; i <= count; i++) {
      const z = -size / 2 + i * spacing
      const points = [
        new THREE.Vector3(-size / 2, -2.5, z),
        new THREE.Vector3(size / 2, -2.5, z)
      ]
      lines.push({ points, axis: "h", index: i })
    }

    // vertical lines
    for (let i = 0; i <= count; i++) {
      const x = -size / 2 + i * spacing
      const points = [
        new THREE.Vector3(x, -2.5, -size / 2),
        new THREE.Vector3(x, -2.5, size / 2)
      ]
      lines.push({ points, axis: "v", index: i })
    }

    return lines
  }, [])

  return (
    <>
      {gridLines.map((line, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line.points)
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#ff44aa"
              transparent
              opacity={line.axis === "h" ? 0.15 : 0.1}
            />
          </line>
        )
      })}
    </>
  )
}

function createCircleTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.3, "rgba(255,255,255,0.8)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(32, 32, 32, 0, Math.PI * 2)
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

function NeonParticles() {
  const ref = useRef()
  const spaceRef = useRef()
  const circleTexture = useMemo(() => createCircleTexture(), [])

  const neonParticles = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      const t = Math.random()
      colors[i * 3] = 1
      colors[i * 3 + 1] = t * 0.27
      colors[i * 3 + 2] = t * 0.67 + 0.33
    }

    return { positions, colors }
  }, [])

  // space particles rotating in background
  const spaceParticles = useMemo(() => {
    const count = 600
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 10
      const spread = (Math.random() - 0.5) * 4

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = spread
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // pink to purple tones matching cyberpunk
      colors[i * 3] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 1] = Math.random() * 0.2
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.5
    }

    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    // rising neon particles
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.005
        if (positions[i + 1] > 5) positions[i + 1] = -5
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }

    // slowly rotating space particles
    if (spaceRef.current) {
      const t = clock.getElapsedTime()
      spaceRef.current.rotation.y = t * 0.05
      spaceRef.current.rotation.x = Math.sin(t * 0.03) * 0.1
    }
  })

  return (
    <>
      {/* Rising neon city particles — round circles */}
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[neonParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[neonParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          alphaMap={circleTexture}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {/* Space particles rotating in background — round circles */}
      <points ref={spaceRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[spaceParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[spaceParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.2}
          sizeAttenuation
          alphaMap={circleTexture}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>
    </>
  )
}

// HTML overlay for project cards
export function ProjectsOverlay() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const placeholders = useMemo(() =>
    projects.map((_, i) => createProjectPlaceholder(i)), []
  )

  const goTo = useCallback((index) => {
    if (index < 0 || index >= projects.length) return
    setActiveIndex(index)
    setAnimKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1)
      if (e.key === "ArrowRight") goTo(activeIndex + 1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [activeIndex, goTo])

  const project = projects[activeIndex]

  return (
    <div className="projects-overlay">
      <div className="projects-title">Projects</div>

      <div className="projects-card-wrapper">

        {/* Left arrow */}
        <button
          className="nav-arrow"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
        >
          ←
        </button>

        {/* Project card */}
        <div key={animKey} className="project-card">
          <div className="project-image-container">
            <img
              className="project-img"
              src={placeholders[activeIndex]}
              alt={project.title}
            />
          </div>

          <div className="project-content">
            <div className="project-title">{project.title}</div>
            <div className="project-description">{project.description}</div>
            <div className="project-links">
                <a href={project.github} target="_blank" rel="noreferrer" className="project-link github">
                    GitHub
                </a>
                <a href={project.live} target="_blank" rel="noreferrer" className="project-link live">
                    Live Demo
                </a>
                </div>
            <div className="project-counter">
              {activeIndex + 1} / {projects.length}
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <button
          className="nav-arrow"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === projects.length - 1}
        >
          →
        </button>

      </div>

      {/* Dots */}
      <div className="project-dots">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`project-dot ${i === activeIndex ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

    </div>
  )
}

// 3D background scene
export default function ProjectsScene() {
  const streakColors = ["#ff44aa", "#aa44ff", "#ff88cc", "#cc44ff"]

  return (
    <>
        <Stars
  radius={100}
  depth={50}
  count={3000}
  factor={4}
  saturation={0.5}
  fade
  speed={0.3}
/>


      {/* Neon grid floor */}
      <NeonGrid />

      {/* Rising particles */}
      <NeonParticles />

      {/* Light streaks */}
      {Array.from({ length: 12 }, (_, i) => (
        <LightStreak
          key={i}
          color={streakColors[i % streakColors.length]}
        />
      ))}

      {/* Ambient fog lights */}
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#ff44aa" />
      <pointLight position={[-5, 0, -3]} intensity={0.8} color="#aa44ff" />
      <pointLight position={[5, 0, -3]} intensity={0.8} color="#ff44aa" />
      <ambientLight intensity={0.2} />
    </>
  )
}