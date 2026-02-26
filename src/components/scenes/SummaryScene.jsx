import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Stars } from "@react-three/drei"
import { summary } from "../../constants/data"
import * as THREE from "three"
import { gsap } from "gsap"
import useDeviceDetect from "../../hooks/useDeviceDetect"

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
  const ringRef = useRef()
  const ring2Ref = useRef()
  const titleRef = useRef()
  const textRef = useRef()
  const particlesRef = useRef()
  const { isMobile, isTablet } = useDeviceDetect()

  const circleTexture = useMemo(() => createCircleTexture(), [])

  // responsive values
  const titleFontSize = isMobile ? 0.20 : isTablet ? 0.32 : 0.4
  const textFontSize = isMobile ? 0.14 : isTablet ? 0.15 : 0.2
  const textMaxWidth = isMobile ? 3 : isTablet ? 5.5 : 7
  const titleY = isMobile ? 0.7 : isTablet ? 0.8 : 0.7
  const textY = isMobile ? -0.1 : isTablet ? -0.25 : -0.35
  const lineHeight = isMobile ? 1.5 : isTablet ? 1.6 : 1.7
  const helixRadius = isMobile ? 1.5 : isTablet ? 2 : 2.5

  const helix = useMemo(() => {
    const count = isMobile ? 300 : 600
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8
      const strand = i % 2 === 0 ? 0 : Math.PI

      positions[i * 3] = Math.cos(t + strand) * helixRadius
      positions[i * 3 + 1] = (i / count) * 6 - 3
      positions[i * 3 + 2] = Math.sin(t + strand) * helixRadius

      colors[i * 3] = 0.9 + Math.random() * 0.1
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.4
      colors[i * 3 + 2] = 0
    }

    return { positions, colors }
  }, [isMobile, helixRadius])

  const particles = useMemo(() => {
    const count = isMobile ? 400 : 400
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
  }, [isMobile])

  useEffect(() => {
    if (!groupRef.current || !helixRef.current || !particlesRef.current) return

    gsap.set(groupRef.current.position, { y: -8 })
    gsap.set(helixRef.current.position, { y: -8 })
    gsap.set(particlesRef.current.position, { y: -8 })

    gsap.to(particlesRef.current.position, {
      y: 0,
      duration: 1.4,
      ease: "elastic.out(1, 0.6)",
      delay: 0.1
    })

    gsap.to(helixRef.current.position, {
      y: 0,
      duration: 1.4,
      ease: "elastic.out(1, 0.6)",
      delay: 0.2
    })

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
        count={isMobile ? 2000 : 4000}
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

      {/* Rings — hidden on mobile to reduce clutter */}
      {!isMobile && (
        <>
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
        </>
      )}

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[isMobile ? 0.1 : 0.15, 32, 32]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Text group */}
      <group ref={groupRef}>
        <Text
          ref={titleRef}
          position={[0, titleY, 0]}
          fontSize={titleFontSize}
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
          position={[0, textY, 0]}
          fontSize={textFontSize}
          color="#ffffffcc"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          lineHeight={lineHeight}
          maxWidth={textMaxWidth}
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