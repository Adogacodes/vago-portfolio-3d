import { Canvas } from "@react-three/fiber"
import HUD from "./components/HUD"
import NavigationDot from "./components/NavigationDot"
import HomeScene from "./components/scenes/HomeScene"
import SummaryScene from "./components/scenes/SummaryScene"
import SkillsScene from "./components/scenes/SkillsScene"
import ProjectsScene from "./components/scenes/ProjectsScene"
import useScrollSection from "./hooks/useScrollSection"

export default function App() {
  const currentSection = useScrollSection()

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {currentSection === 0 && <HomeScene />}
        {currentSection === 1 && <SummaryScene />}
        {currentSection === 2 && <SkillsScene />}
        {currentSection === 3 && <ProjectsScene />}
      </Canvas>

      {/* HUD - always visible */}
      <HUD />

      {/* Navigation dots - always visible */}
      <NavigationDot currentSection={currentSection} />

    </div>
  )
}