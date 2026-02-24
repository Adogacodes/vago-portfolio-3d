import "./HUD.css"
import { personalInfo } from "../constants/data"

export default function HUD({ accentColor }) {
  return (
    <div className="hud-container">

      {/* Top left - Your name */}
      <div className="hud-top-left">
        <span className="hud-name" style={{ color: accentColor }}>
          {personalInfo.name}
        </span>
        <span className="hud-title">{personalInfo.title}</span>
      </div>

      {/* Top right - Links */}
      <div className="hud-top-right">
        <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hud-link" style={{ color: accentColor }}>
          Bobble
        </a>
        <a href={personalInfo.resume} target="_blank" rel="noreferrer" className="hud-link" style={{ color: accentColor }}>
          Resume
        </a>
        <a href={`mailto:${personalInfo.email}`} className="hud-link" style={{ color: accentColor }}>
          Contact
        </a>
      </div>

     {/* Bottom center - navigation hint */}
<div className="hud-bottom-center">
  <span className="hud-hint">
    {typeof window !== "undefined" && window.innerWidth < 1024
      ? "↑ swipe up to navigate ↓"
      : "↓ scroll or press ↓ to navigate"}
  </span>
</div>
    </div>
  )
}