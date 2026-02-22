import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Stars } from "@react-three/drei"
import { personalInfo } from "../../constants/data"
import * as THREE from "three"

// circular texture so particles look like round stars
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

export default function HomeScene() {
  const groupRef = useRef()
  const ringRef = useRef()
  const particlesRef = useRef()
  const ring2Ref = useRef()

  const circleTexture = useMemo(() => createCircleTexture(), [])

  // galaxy particles — reduced count, pushed further out
  const particles = useMemo(() => {
    const count = 400
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 8  // pushed further from center
      const spread = (Math.random() - 0.5) * 5

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = spread
      positions[i * 3 + 2] = Math.sin(angle) * radius

      colors[i * 3] = Math.random() * 0.3
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
    }

    return { positions, colors }
  }, [])

  // floating orbs — reduced and pushed back
  const orbs = useMemo(() => {
    const count = 40
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = -2 + (Math.random() - 0.5) * 3  // pushed behind
    }

    return positions
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.06
      particlesRef.current.rotation.x = Math.sin(t * 0.04) * 0.15
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.3
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04)
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.25
      ring2Ref.current.rotation.y = t * 0.2
      ring2Ref.current.scale.setScalar(1 + Math.sin(t * 1.5 + 1) * 0.04)
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.08
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

      {/* Galaxy particles — round stars */}
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
          opacity={0.5}
          sizeAttenuation
          alphaMap={circleTexture}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {/* Ambient orbs — round */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[orbs, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ffff"
          transparent
          opacity={0.25}
          sizeAttenuation
          alphaMap={circleTexture}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {/* Inner ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.4, 0.006, 16, 120]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.003, 16, 120]} />
        <meshStandardMaterial
          color="#9966ff"
          emissive="#9966ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Name and title */}
      <group ref={groupRef}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.75}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          outlineWidth={0.02}
          outlineColor="#00ffff"
        >
          {personalInfo.name}
        </Text>

        <Text
          position={[0, -0.2, 0]}
          fontSize={0.22}
          color="#ffffffaa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {personalInfo.title}
        </Text>
      </group>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#00ffff" />
      <pointLight position={[3, 2, -2]} intensity={0.8} color="#9966ff" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#0044ff" />
    </>
  )
}