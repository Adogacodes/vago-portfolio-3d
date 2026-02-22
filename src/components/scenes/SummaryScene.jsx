import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Stars } from "@react-three/drei"
import { summary } from "../../constants/data"
import * as THREE from "three"

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

export default function SummaryScene() {
  const ringRef = useRef()
  const ring2Ref = useRef()
  const particlesRef = useRef()

  const circleTexture = useMemo(() => createCircleTexture(), [])

  const particles = useMemo(() => {
    const count = 800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 4 + Math.random() * 8
      const spread = (Math.random() - 0.5) * 3

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = spread
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // warm gold to orange colors for this scene
      colors[i * 3] = 0.9 + Math.random() * 0.1
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.3
      colors[i * 3 + 2] = Math.random() * 0.2
    }

    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.06
      particlesRef.current.rotation.x = Math.sin(t * 0.04) * 0.15
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
      ringRef.current.rotation.x = Math.sin(t * 0.2) * 0.3
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.03)
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.2
      ring2Ref.current.rotation.y = t * 0.15
      ring2Ref.current.scale.setScalar(1 + Math.sin(t * 1.2 + 1) * 0.03)
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

      {/* Particles */}
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

      {/* Rings */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.4, 0.006, 16, 120]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={1.5}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.003, 16, 120]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff6600"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Section title */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.35}
        color="#ffaa00"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        outlineWidth={0.01}
        outlineColor="#ffaa00"
      >
        ABOUT ME
      </Text>

      {/* Summary text */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.14}
        color="#ffffffcc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.03}
        lineHeight={1.8}
        maxWidth={5}
        textAlign="center"
      >
        {summary}
      </Text>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#ffaa00" />
      <pointLight position={[3, 2, -2]} intensity={0.8} color="#ff6600" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#ff4400" />
    </>
  )
}