import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Stars } from "@react-three/drei"
import { summary } from "../../constants/data"
import * as THREE from "three"
import { gsap } from "gsap"

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
  const groupRef = useRef()
  const helixRef = useRef()
  const hasAnimated = useRef(false)
  const ringRef = useRef()
  const ring2Ref = useRef()
  const titleRef = useRef()
  const textRef = useRef()
  const particlesRef = useRef()

  const circleTexture = useMemo(() => createCircleTexture(), [])

//   const backgroundParticles = useMemo(() => {
//   const count = 400
//   const positions = new Float32Array(count * 3)
//   const colors = new Float32Array(count * 3)

//   for (let i = 0; i < count; i++) {
//     const angle = Math.random() * Math.PI * 2
//     const radius = 4 + Math.random() * 8
//     const spread = (Math.random() - 0.5) * 8

//     positions[i * 3] = Math.cos(angle) * radius
//     positions[i * 3 + 1] = spread
//     positions[i * 3 + 2] = Math.sin(angle) * radius

//     // gold tones to match summary scene
//     colors[i * 3] = 0.9 + Math.random() * 0.1
//     colors[i * 3 + 1] = 0.6 + Math.random() * 0.3
//     colors[i * 3 + 2] = Math.random() * 0.2
//   }

//   return { positions, colors }
// }, [])

  // helix particles
  const helix = useMemo(() => {
    const count = 600
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8
      const radius = 2.5

      // two strands of the helix
      const strand = i % 2 === 0 ? 0 : Math.PI

      positions[i * 3] = Math.cos(t + strand) * radius
      positions[i * 3 + 1] = (i / count) * 6 - 3
      positions[i * 3 + 2] = Math.sin(t + strand) * radius

      // gold to orange gradient
      colors[i * 3] = 0.9 + Math.random() * 0.1
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.4
      colors[i * 3 + 2] = 0
    }

    return { positions, colors }
  }, [])

  // background particles
  const particles = useMemo(() => {
    const count = 400
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 4 + Math.random() * 8
      const spread = (Math.random() - 0.5) * 8

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = spread
      positions[i * 3 + 2] = Math.sin(angle) * radius

      colors[i * 3] = 0.9 + Math.random() * 0.1
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.3
      colors[i * 3 + 2] = Math.random() * 0.2
    }

    return { positions, colors }
  }, [])

  // intro animation
  useEffect(() => {
  if (!groupRef.current || !helixRef.current || !particlesRef.current) return

  // all three start below
  gsap.set(groupRef.current.position, { y: -8 })
  gsap.set(helixRef.current.position, { y: -8 })
  gsap.set(particlesRef.current.position, { y: -8 })

  // particles spring up first
  gsap.to(particlesRef.current.position, {
    y: 0,
    duration: 1.4,
    ease: "elastic.out(1, 0.6)",
    delay: 0.1
  })

  // helix springs up second
  gsap.to(helixRef.current.position, {
    y: 0,
    duration: 1.4,
    ease: "elastic.out(1, 0.6)",
    delay: 0.2
  })

  // text springs up last
  gsap.to(groupRef.current.position, {
    y: 0,
    duration: 1.4,
    ease: "elastic.out(1, 0.6)",
    delay: 0.3
  })
}, [])


useFrame(({ clock }) => {
  const t = clock.getElapsedTime()

  if (helixRef.current) {
    helixRef.current.rotation.y = t * 0.2
  }

  if (ringRef.current) {
    ringRef.current.rotation.z = t * 0.3
    ringRef.current.rotation.x = Math.sin(t * 0.2) * 0.3
    const pulse = 1 + Math.sin(t * 1.2) * 0.03
    ringRef.current.scale.x = pulse
    ringRef.current.scale.z = pulse
  }

  if (ring2Ref.current) {
    ring2Ref.current.rotation.z = -t * 0.2
    ring2Ref.current.rotation.y = t * 0.15
    const pulse2 = 1 + Math.sin(t * 1.2 + 1) * 0.03
    ring2Ref.current.scale.x = pulse2
    ring2Ref.current.scale.z = pulse2
  }

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

      

      {/* Background particles */}
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

      {/* Helix */}
      <points ref={helixRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[helix.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[helix.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
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

      {/* Text group flies in */}
      <group ref={groupRef}>
        <Text
          ref={titleRef}
          position={[0, 0.7, 0]}
          fontSize={0.4}
          color="#ffaa00"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
          outlineWidth={0.015}
          outlineColor="#ff6600"
        >
          ABOUT ME
        </Text>

        <Text
          ref={textRef}
          position={[0, -0.35, 0]}
          fontSize={0.2}
          color="#ffffffcc"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          lineHeight={1.7}
          maxWidth={7}
          textAlign="center"
          outlineWidth={0.005}
          outlineColor="#ffaa0066"
        >
          {summary}
        </Text>
      </group>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#ffaa00" />
      <pointLight position={[3, 2, -2]} intensity={0.8} color="#ff6600" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#ff4400" />
    </>
  )
}