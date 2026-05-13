import project1 from "../assets/project1.png"
import project2 from "../assets/project2.png"
import project3 from "../assets/project3.png"
import project4 from "../assets/project4.png"

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
    title: "Manchong Integrated Farms",
    description: "A cool full stack web application.", // TODO: Real description
    github: "https://github.com/vago/project-one", // TODO: Real link
    live: "https://manchongfarm.com", // TODO: Real link if deployed
    image: project1 // TODO: Add real screenshot to public folder
  },
  {
    id: 2,
    title: "SyncZone",
    description: "A full-stack remote team dashboard. See who's working, view everyone's timezone on a live grid, and find the best meeting window automatically. Built with React, Node.js, and MongoDB.", // TODO: Real description
    github: "https://github.com/vago/project-two", // TODO: Real link
    live: "https://project-two.com", // TODO: Real link
    image: project2 // TODO: Add real screenshot to public folder
  },
  {
    id: 3,
    title: "Shinku",
    description: "A feature-complete turn-based strategy game built in React 18, featuring a snake draft system with a 3-strategy CPU AI, dice-based combat mechanics, and a context-driven audio engine — all without a game framework.", // TODO: Real description
    github: "https://github.com/vago/project-three", // TODO: Real link
    live: "https://project-three.com", // TODO: Real link
    image: project3 // TODO: Add real screenshot to public folder
  },
  {
    id: 3,
    title: "Reworded",
    description: "An AI-powered app that rewrites any topic in 8 unique voices, from a 5-year-old to Gordon Ramsay. Built with React and powered by the Groq API.", // TODO: Real description
    github: "https://github.com/vago/project-three", // TODO: Real link
    live: "https://project-three.com", // TODO: Real link
    image: project4 // TODO: Add real screenshot to public folder
  },
]