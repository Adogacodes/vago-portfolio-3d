export const personalInfo = {
  name: "Isaac Adoga",  // TODO: Replace with your full name
  title: "Full Stack Developer", // TODO: Replace with your title
  email: "vagotech0@gmail.com", // TODO: Replace with your real email
  github: "https://github.com/Adogacodes", // TODO: Replace with your GitHub URL
  resume: "/resume.pdf", // TODO: Add your real resume PDF to the public folder
}

export const summary = `
  I am a passionate Full Stack Developer with a love for building
  clean, efficient, and user-friendly applications. I enjoy solving
  complex problems and turning ideas into reality through code.
` // TODO: Replace with your real professional summary

export const skillCategories = [
  {
    name: "Frontend",
    color: "#00ff88",
    skills: [
      { name: "HTML", icon: "devicon-html5-plain" },
      { name: "CSS", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "React", icon: "devicon-react-original" },
      { name: "TypeScript", icon: "devicon-typescript-plain" }
    ]
  },
  {
    name: "Backend",
    color: "#ff88cc",
    skills: [
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "Express", icon: "devicon-express-original" }
    ]
  },
  {
    name: "Database",
    color: "#ffaa00",
    skills: [
      { name: "MongoDB", icon: "devicon-mongodb-plain" }
    ]
  },
  {
    name: "Tools",
    color: "#00ff88",
    skills: [
      { name: "Git", icon: "devicon-git-plain" },
      { name: "Github", icon: "devicon-github-plain" },
      
    ]
  }
]

export const skills = skillCategories.flatMap(c => c.skills.map(s => s.name))


export const projects = [
  {
    id: 1,
    title: "Project One",
    description: "A cool full stack web application.", // TODO: Real description
    github: "https://github.com/vago/project-one", // TODO: Real link
    live: "https://project-one.com", // TODO: Real link if deployed
    image: "/project1.png" // TODO: Add real screenshot to public folder
  },
  {
    id: 2,
    title: "Project Two",
    description: "Another awesome project.", // TODO: Real description
    github: "https://github.com/vago/project-two", // TODO: Real link
    live: "https://project-two.com", // TODO: Real link
    image: "/project2.png" // TODO: Add real screenshot to public folder
  },
  {
    id: 3,
    title: "Project Three",
    description: "Yet another great project.", // TODO: Real description
    github: "https://github.com/vago/project-three", // TODO: Real link
    live: "https://project-three.com", // TODO: Real link
    image: "/project3.png" // TODO: Add real screenshot to public folder
  },
]