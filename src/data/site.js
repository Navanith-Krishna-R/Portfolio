/**
 * Single source of truth for every piece of content on the site.
 *
 * Everything here is taken from the resume PDF (public/Navanith_Krishna_R_Resume.pdf)
 * or verified against the public GitHub API for Navanith-Krishna-R.
 * Nothing is invented — if a field has no verified value it is omitted.
 */

export const RESUME_PATH = `${process.env.PUBLIC_URL}/Navanith_Krishna_R_Resume.pdf`;

export const profile = {
  name: "Navanith Krishna R",
  monogram: "NK",
  role: "Computer Science Engineer",
  roles: ["Computer Science Engineer", "Full-Stack Developer", "AI/ML Enthusiast"],
  intro:
    "I build full-stack web applications and AI-driven solutions using modern technologies such as React, Next.js, Node.js and Python.",
  summary:
    "Full-stack developer with hands-on experience building scalable web applications with React, Next.js, Node.js and MongoDB. I enjoy designing REST APIs, integrating AI-powered features and turning rough ideas into clean, maintainable software.",
  location: "Bengaluru, India",
};

export const links = {
  github: "https://github.com/Navanith-Krishna-R",
  linkedin: "https://www.linkedin.com/in/navanith-krishna-r/",
  email: "navanithkrishna2003@gmail.com",
};

export const githubUsername = "Navanith-Krishna-R";

export const highlights = [
  {
    label: "Education",
    value: "B.E. Computer Science & Engineering",
    detail: "BMS College of Engineering, Bengaluru · 2022–2026",
  },
  {
    label: "Technical focus",
    value: "Full-stack web development",
    detail: "React, Next.js, Node.js, MongoDB and REST API design",
  },
  {
    label: "Interests",
    value: "Applied AI & machine learning",
    detail: "LLM integration, deep learning and data-driven systems",
  },
  {
    label: "Career direction",
    value: "Software engineering roles",
    detail: "Open to full-time positions and internships",
  },
];

export const experience = [
  {
    role: "Research Intern",
    company: "BMS College of Engineering",
    location: "Bengaluru, India",
    period: "Jan 2026 – May 2026",
    points: [
      "Developed and analysed a VANET-based RSU handoff prediction system using SUMO and OMNeT++.",
      "Integrated traffic and network simulators through TraCI and implemented vehicle-to-infrastructure communication models.",
      "Performed data preprocessing, debugging and performance analysis to improve intelligent handoff decision-making.",
    ],
    stack: ["OMNeT++", "SUMO", "Veins", "TraCI", "Python"],
  },
  {
    role: "Software Development Intern",
    company: "TensorKode",
    location: "USA",
    period: "Sep 2025 – Dec 2025",
    points: [
      "Built an AI-powered multi-agent system (Planner, Coder, Debugger, Reviewer) on the OpenAI GPT-4 API to automate ERP code generation, testing and optimisation from natural-language input.",
      "Integrated REST APIs and Python automation to streamline ERP workflows, reducing development time by nearly 80%.",
      "Improved code quality, debuggability and maintainability across the generated ERP modules.",
    ],
    stack: ["Python", "OpenAI GPT-4 API", "Docker", "REST APIs", "ERP Integration"],
  },
];

/**
 * Repository URLs verified against https://api.github.com/users/Navanith-Krishna-R/repos.
 * `demo` is deliberately absent everywhere: the two homepage URLs published on GitHub
 * (full-stack-calmpanion.vercel.app and ai-resume-analyzer-six-ruddy.vercel.app) both
 * return HTTP 404, so there is no live deployment to link to. Add a `demo` field here
 * once a deployment is actually reachable.
 */
export const projects = [
  {
    id: "easycheesy",
    title: "EasyCheesy",
    subtitle: "Full-Stack Food Ordering Platform",
    description:
      "Restaurant ordering platform with secure authentication, role-based access control and an admin dashboard for menu and order management.",
    stack: ["Next.js", "React", "Node.js", "MongoDB", "Tailwind CSS"],
    repo: "https://github.com/Navanith-Krishna-R/EasyCheesy--Food-Ordering-Platform",
    image: "easycheesy.jpg",
  },
  {
    id: "calmpanion",
    title: "Calmpanion",
    subtitle: "Mental Health Awareness Platform",
    description:
      "Full-stack mental health platform offering appointment scheduling, blogging and donation management behind secure authentication.",
    stack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB"],
    repo: "https://github.com/Navanith-Krishna-R/Full-Stack-CALMPANION",
    image: "calmpanion.jpg",
  },
  {
    id: "insightfulcv",
    title: "InsightfulCV",
    subtitle: "AI Resume Analyzer",
    description:
      "ATS resume analyzer that scores CVs, matches them to job descriptions and generates AI feedback through the Mistral AI API.",
    stack: ["Next.js", "TypeScript", "Supabase", "Mistral AI", "Tailwind CSS"],
    repo: "https://github.com/Navanith-Krishna-R/Ai_Resume_Analyzer",
    image: "insightfulcv.jpg",
  },
  {
    id: "deepfake",
    title: "Hybrid Deepfake Detection",
    subtitle: "Deep Learning Research Project",
    description:
      "Detection pipeline combining RGB and frequency-domain features through an EfficientNet-B4 and Transformer encoder architecture, reaching over 95% accuracy.",
    stack: ["Python", "PyTorch", "EfficientNet-B4", "Transformers", "Streamlit"],
    repo: "https://github.com/Navanith-Krishna-R/Hybrid-Deepfake-Detection-System",
    image: "deepfake-detection.jpg",
  },
  {
    id: "language",
    title: "Language Detection & Translation",
    subtitle: "Multilingual Web Application",
    description:
      "Flask web application that identifies the language of an input text and translates it into multiple target languages in real time.",
    stack: ["Python", "Flask", "langdetect", "googletrans"],
    repo: "https://github.com/Navanith-Krishna-R/Language_Translation_and_Identification",
    image: "language-translation.jpg",
  },
];

export const skills = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL", "HTML", "CSS"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "REST APIs", "Prisma"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "GitHub", "Docker", "VS Code", "Jupyter Notebook"],
  },
  {
    category: "Concepts",
    items: [
      "Data Structures & Algorithms",
      "OOP",
      "DBMS",
      "Computer Networks",
      "Machine Learning",
      "LLM Integration",
    ],
  },
];

export const education = [
  {
    degree: "B.E. in Computer Science and Engineering",
    institution: "BMS College of Engineering",
    location: "Bengaluru, India",
    period: "2022 – 2026",
  },
  {
    degree: "Pre-University (11th & 12th)",
    institution: "Mahesh PU College (Integrated with Allen)",
    location: "India",
    period: "2021 – 2022",
    note: "KCET Rank: 1257",
  },
];
