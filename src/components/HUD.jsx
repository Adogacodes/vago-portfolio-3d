import "./HUD.css"
import { personalInfo } from "../constants/data"

export default function HUD() {
  return (
    <div className="hud-container">

      {/* Top left - Your name */}
      <div className="hud-top-left">
        <span className="hud-name">{personalInfo.name}</span>
        <span className="hud-title">{personalInfo.title}</span>
      </div>

      {/* Top right - Links */}
      <div className="hud-top-right">
        <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hud-link">
          GitHub
        </a>
        <a href={personalInfo.resume} target="_blank" rel="noreferrer" className="hud-link">
          Resume
        </a>
        <a href={`mailto:${personalInfo.email}`} className="hud-link">
          Contact
        </a>
      </div>

      {/* Bottom center - navigation hint */}
      <div className="hud-bottom-center">
        <span className="hud-hint">↓ scroll or press ↓ to navigate</span>
      </div>

    </div>
  )
}