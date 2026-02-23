import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { skillCategories } from "../../constants/data"
import { gsap } from "gsap"
import * as THREE from "three"
import "./SkillsScene.css"

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

function createPlaceholderImage(color, letter) {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, color + "99")
  gradient.addColorStop(1, color + "22")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(32, 32, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(32, 32, 29, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 28px Segoe UI"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(letter, 32, 33)
  return canvas.toDataURL()
}

function ShootingStar() {
  const ref = useRef()
  const data = useRef({
    x: 8 + Math.random() * 4,
    y: 2 + Math.random() * 4,
    z: (Math.random() - 0.5) * 4,
    speed: 0.05 + Math.random() * 0.08,
  })

  useFrame(() => {
    if (!ref.current) return
    ref.current.position.x -= data.current.speed
    ref.current.position.y -= data.current.speed * 0.2
    if (ref.current.position.x < -12) {
      ref.current.position.x = 12
      ref.current.position.y = 2 + Math.random() * 4
    }
  })

  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.8, 0.15, 0)
  ]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line ref={ref} position={[data.current.x, data.current.y, data.current.z]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </line>
  )
}

function NebulaPuff({ position, color, size }) {
  const ref = useRef()
  const floatOffset = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = position[1] +
        Math.sin(t * 0.2 + floatOffset.current) * 0.15
      ref.current.material.opacity =
        0.04 + Math.sin(t * 0.3 + floatOffset.current) * 0.02
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.05}
        depthWrite={false}
      />
    </mesh>
  )
}

// The 3D background scene only
export function SkillsBackground() {
  const particlesRef = useRef()
  const circleTexture = useMemo(() => createCircleTexture(), [])

  const particles = useMemo(() => {
    const count = 800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 4 + Math.random() * 8
      const spread = (Math.random() - 0.5) * 8
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = spread
      positions[i * 3 + 2] = Math.sin(angle) * radius
      colors[i * 3] = 0
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.4 + Math.random() * 0.3
    }
    return { positions, colors }
  }, [])

  useEffect(() => {
  if (!particlesRef.current) return

  // particles expand outward from center
  particlesRef.current.scale.set(0, 0, 0)

  gsap.to(particlesRef.current.scale, {
    x: 1, y: 1, z: 1,
    duration: 1.4,
    ease: "elastic.out(1, 0.6)",
    delay: 0.1
  })
}, [])

  const nebulaPuffs = useMemo(() => (
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 3
      ],
      color: skillCategories[i % skillCategories.length].color,
      size: 1.2 + Math.random() * 2.0
    }))
  ), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.06
      particlesRef.current.rotation.x = Math.sin(t * 0.04) * 0.15
    }
  })

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={4000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.25}
          sizeAttenuation
          alphaMap={circleTexture}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {nebulaPuffs.map((puff, i) => (
        <NebulaPuff key={i} {...puff} />
      ))}

      {Array.from({ length: 4 }, (_, i) => (
        <ShootingStar key={i} />
      ))}

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#00ff88" />
      <pointLight position={[5, 3, -2]} intensity={0.8} color="#00ccff" />
      <pointLight position={[-5, -3, -2]} intensity={0.8} color="#00aa55" />
    </>
  )
}

// The HTML overlay grid
export function SkillsOverlay() {
  const allSkills = useMemo(() =>
    skillCategories.flatMap(cat =>
      cat.skills.map(skill => ({ skill }))
    ), []
  )

  return (
    <div className="skills-overlay">
      <div className="skills-title">Skills</div>
      <div className="skills-grid">
        {allSkills.map(({ skill }, i) => (
          <div
            key={skill}
            className="skill-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <img
              className="skill-img"
              src={createPlaceholderImage("#00ff88", skill[0].toUpperCase())}
              alt={skill}
            />
            <span className="skill-name">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// default export for the canvas scene
export default function SkillsScene() {
  return <SkillsBackground />
}