import "./NavigationDot.css"

const SECTIONS = ["Home", "Summary", "Skills", "Projects"]

export default function NavigationDot({ currentSection, accentColor, goToSection }) {
  return (
    <div className="nav-dots-container">
      {SECTIONS.map((section, index) => (
        <div
          key={section}
          className="nav-dot-wrapper"
          title={section}
          onClick={() => goToSection(index)}
        >
          <div
            className={`nav-dot ${currentSection === index ? "active" : ""}`}
            style={currentSection === index ? {
              backgroundColor: accentColor,
              borderColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`
            } : {}}
          />
        </div>
      ))}
    </div>
  )
}