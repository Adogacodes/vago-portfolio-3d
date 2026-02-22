import "./NavigationDot.css"

const SECTIONS = ["Home", "Summary", "Skills", "Projects"]

export default function NavigationDot({ currentSection, accentColor }) {
  return (
    <div className="nav-dots-container">
      {SECTIONS.map((section, index) => (
        <div
          key={section}
          className={`nav-dot ${currentSection === index ? "active" : ""}`}
          title={section}
          style={currentSection === index ? {
            backgroundColor: accentColor,
            borderColor: accentColor,
          } : {}}
        />
      ))}
    </div>
  )
}