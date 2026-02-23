import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import HUD from "./components/HUD"
import NavigationDot from "./components/NavigationDot"
import HomeScene from "./components/scenes/HomeScene"
import SummaryScene from "./components/scenes/SummaryScene"
import SkillsScene, { SkillsOverlay } from "./components/scenes/SkillsScene"
import ProjectsScene from "./components/scenes/ProjectsScene"
import TransitionManager from "./components/TransitionManager"
import useScrollSection from "./hooks/useScrollSection"
import SpaceshipCursor from "./components/SpaceshipCursor"

const SECTION_COLORS = [
  "#00ffff",
  "#ffaa00",
  "#00ff88",
  "#ff44aa",
]

export default function App() {
  const { currentSection, previousSection } = useScrollSection()
  const [visibleSection, setVisibleSection] = useState(0)

  const accentColor = SECTION_COLORS[visibleSection]

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {/* Fade overlay */}
      <div
        id="transition-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* Spaceship cursor */}
      <SpaceshipCursor accentColor={accentColor} />

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <TransitionManager
          currentSection={currentSection}
          previousSection={previousSection}
          onTransitionComplete={() => setVisibleSection(currentSection)}
        />

        {visibleSection === 0 && <HomeScene />}
        {visibleSection === 1 && <SummaryScene />}
        {visibleSection === 2 && <SkillsScene />}
        {visibleSection === 3 && <ProjectsScene />}
      </Canvas>

      {/* Skills HTML overlay — outside Canvas! */}
      {visibleSection === 2 && <SkillsOverlay />}

      {/* HUD */}
      <HUD accentColor={accentColor} />

      {/* Navigation dots */}
      <NavigationDot
        currentSection={visibleSection}
        accentColor={accentColor}
      />

    </div>
  )
}