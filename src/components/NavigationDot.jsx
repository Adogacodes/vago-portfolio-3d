import "./NavigationDot.css"

const SECTIONS = ["Home", "Summary", "Skills", "Projects"]

export default function NavigationDot({ currentSection }) {
  return (
    <div className="nav-dots-container">
      {SECTIONS.map((section, index) => (
        <div
          key={section}
          className={`nav-dot ${currentSection === index ? "active" : ""}`}
          title={section}
        />
      ))}
    </div>
  )
}