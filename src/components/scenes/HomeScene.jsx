import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Stars } from "@react-three/drei"
import { personalInfo } from "../../constants/data"
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

export default function HomeScene() {
  const groupRef = useRef()
  const ringRef = useRef()
  const particlesRef = useRef()
  const ring2Ref = useRef()
  const coreRef = useRef()
  const sceneRef = useRef()
  const { isMobile, isTablet } = useDeviceDetect()

  const circleTexture = useMemo(() => createCircleTexture(), [])

  // responsive values
 const nameFontSize = isMobile ? 0.38 : isTablet ? 0.68 : 0.75
const titleFontSize = isMobile ? 0.19 : isTablet ? 0.21 : 0.22
const ringScale = isMobile ? 0.85 : isTablet ? 0.92 : 1

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

      colors[i * 3] = Math.random() * 0.3
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
    }

    return { positions, colors }
  }, [isMobile])

  const orbs = useMemo(() => {
    const count = isMobile ? 20 : 40
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = -2 + (Math.random() - 0.5) * 3
    }
    return positions
  }, [isMobile])

  // intro animation
  useEffect(() => {
    if (!sceneRef.current) return

    sceneRef.current.scale.set(0, 0, 0)
    groupRef.current.scale.set(0, 0, 0)

    gsap.to(sceneRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)",
      delay: 0.1
    })

    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      delay: 0.4
    })
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
      ringRef.current.scale.setScalar(ringScale + Math.sin(t * 1.5) * 0.04)
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.25
      ring2Ref.current.rotation.y = t * 0.2
      ring2Ref.current.scale.setScalar(ringScale + Math.sin(t * 1.5 + 1) * 0.04)
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
        count={isMobile ? 2000 : 4000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      <group ref={sceneRef}>
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
            opacity={0.12}
            sizeAttenuation
            alphaMap={circleTexture}
            alphaTest={0.01}
            depthWrite={false}
          />
        </points>

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

        <mesh ref={coreRef}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      <group ref={groupRef}>
        <Text
          position={[0, isMobile ? 0.3 : 0.5, 0]}
          fontSize={nameFontSize}
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
          position={[0, isMobile ? -0.1 : -0.2, 0]}
          fontSize={titleFontSize}
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