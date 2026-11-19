export const profile = {
  name: "Tanmay Meshram",
  roles: ["Full Stack Developer", "MERN Stack Engineer", "Web Developer", "Freelancer"],
  email: "tanmaymeshram883@gmail.com",
  phone: "+91 7972711814",
  photo: "https://i.postimg.cc/SK5q11yM/my.jpg",
  bio: "I build fast, polished web applications end to end — from database design and APIs to responsive interfaces. Proactive, detail-oriented, and equally comfortable working solo or inside a team.",
  socials: {
    github: "https://github.com/TMTanmay1/",
    linkedin: "https://www.linkedin.com/in/tanmay-meshram-614727233/",
    instagram: "https://www.instagram.com/tmtanmay3466/",
    whatsapp: "https://wa.me/917972711814?text=Hi%20Tanmay!",
  },
};

// opens the visitor's mail app with a ready-to-send message to Tanmay
export const contactMailto = `mailto:${profile.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent("Hi Tanmay,\n\nI came across your portfolio and would like to talk about ")}`;

export const stats = [
  { value: "4", label: "Roles" },
  { value: "5+", label: "Projects on GitHub" },
  { value: "200+", label: "Applications / week handled" },
  { value: "B.Tech", label: "IT, IIIT Vadodara" },
];

// size = relative bubble radius (px at full width), color = brand tint
export const skillGroups = ["Frontend", "Backend", "Cloud & AI", "Tools"];
export const skills = [
  // Frontend
  { name: "JavaScript", group: "Frontend", icon: "SiJavascript", color: "#f7df1e", size: 70 },
  { name: "TypeScript", group: "Frontend", icon: "SiTypescript", color: "#3b82f6", size: 64 },
  { name: "React", group: "Frontend", icon: "SiReact", color: "#61dafb", size: 66 },
  { name: "Next.js", group: "Frontend", icon: "SiNextdotjs", color: "#f4f4f5", size: 60 },
  { name: "Tailwind CSS", group: "Frontend", icon: "SiTailwindcss", color: "#38bdf8", size: 58 },
  { name: "HTML", group: "Frontend", icon: "SiHtml5", color: "#e34f26", size: 52 },
  { name: "CSS", group: "Frontend", icon: "SiCss3", color: "#2965f1", size: 50 },
  // Backend & data
  { name: "Node.js", group: "Backend", icon: "SiNodedotjs", color: "#6cc24a", size: 64 },
  { name: "Express", group: "Backend", icon: "SiExpress", color: "#e5e7eb", size: 54 },
  { name: "Python", group: "Backend", icon: "SiPython", color: "#facc15", size: 62 },
  { name: "FastAPI", group: "Backend", icon: "SiFastapi", color: "#05998b", size: 58 },
  { name: "Java", group: "Backend", icon: "FaJava", color: "#f89820", size: 58 },
  { name: "REST APIs", group: "Backend", icon: "FiShare2", color: "#a78bfa", size: 52 },
  { name: "MongoDB", group: "Backend", icon: "SiMongodb", color: "#47a248", size: 60 },
  { name: "PostgreSQL", group: "Backend", icon: "SiPostgresql", color: "#6b9bd2", size: 58 },
  { name: "MySQL", group: "Backend", icon: "SiMysql", color: "#4479a1", size: 52 },
  // Cloud & AI
  { name: "AWS", group: "Cloud & AI", icon: "FaAws", color: "#ff9900", size: 62 },
  { name: "Docker", group: "Cloud & AI", icon: "SiDocker", color: "#2496ed", size: 56 },
  { name: "RAG", group: "Cloud & AI", icon: "FiSearch", color: "#34d399", size: 54 },
  { name: "Qdrant", group: "Cloud & AI", icon: "FiLayers", color: "#dc244c", size: 56 },
  { name: "LangChain", group: "Cloud & AI", icon: "FiLink", color: "#22c55e", size: 56 },
  { name: "AI Agents", group: "Cloud & AI", icon: "FaRobot", color: "#c084fc", size: 58 },
  { name: "OpenAI API", group: "Cloud & AI", icon: "SiOpenai", color: "#e5e7eb", size: 56 },
  { name: "Claude Code", group: "Cloud & AI", icon: "FiTerminal", color: "#d97757", size: 56 },
  // Tools
  { name: "Git", group: "Tools", icon: "SiGit", color: "#f05032", size: 54 },
  { name: "GitHub", group: "Tools", icon: "SiGithub", color: "#e5e7eb", size: 52 },
  { name: "VS Code", group: "Tools", icon: "SiVisualstudiocode", color: "#2f9bff", size: 52 },
  { name: "Vite", group: "Tools", icon: "SiVite", color: "#a78bfa", size: 50 },
];

export const projects = [
  {
    id: 1,
    title: "Weather Forecasting AI",
    desc: "A weather forecasting application powered by machine learning predictions.",
    tags: ["AI", "Forecasting"],
    img: "https://i.postimg.cc/VkRWdHWx/57214s81.jpg",
    git: "https://github.com/TMTanmay1/weather-foreasting-AI",
  },
  {
    id: 2,
    title: "Bulk SMS",
    desc: "A tool for composing and sending SMS messages to many recipients at once.",
    tags: ["Messaging", "Automation"],
    img: "https://i.postimg.cc/Bv75CLyN/4167022.jpg",
    git: "https://github.com/TMTanmay1/Bulk_sms",
  },
  {
    id: 3,
    title: "Gourmet",
    desc: "A restaurant and food experience web app with a clean, browsable interface.",
    tags: ["Web App", "UI"],
    img: "https://i.postimg.cc/wBjcJcW7/5890625.jpg",
    git: "https://github.com/TMTanmay1/Gourmet",
  },
  {
    id: 4,
    title: "Car Rental",
    desc: "A car rental platform for browsing vehicles and managing bookings.",
    tags: ["Full Stack", "Bookings"],
    img: "https://i.postimg.cc/wBjcJcW7/5890625.jpg",
    git: "https://github.com/TMTanmay1/Car-Rental",
  },
  {
    id: 5,
    title: "AR Chat",
    desc: "A chat application experimenting with augmented reality features.",
    tags: ["AR", "Realtime"],
    img: "https://i.postimg.cc/wBjcJcW7/5890625.jpg",
    git: "https://github.com/TMTanmay1/ARchat",
  },
];

export const experience = [
  {
    role: "Software Engineer",
    org: "ITMTB Technologies · Remote",
    period: "Nov 2024 – Sep 2026",
    year: "2024",
    until: "Sep 2026",
    badge: "Latest",
    tags: ["Qdrant", "BM25 + Cohere Rerank", "RAG", "AWS Textract", "AWS CloudFront", "AI Agents", "Claude Code"],
    points: [
      "Built ITMTB RAG MS, a pharmaceutical RAG system using Qdrant Vector DB, hybrid search with BM25 + Cohere Rerank, and hash-based deduplication for efficient retrieval across SOP and FDA compliance documents.",
      "Building AI-powered agents for automated website performance analysis, identifying SEO issues, user engagement trends, and optimization opportunities across large-scale websites.",
      "Architected a SaaS-based financial intelligence and risk analysis platform leveraging 100+ market research and financial reports to automate risk assessments for 100+ companies, integrating financial analysis, adverse media screening, compliance checks, and AI-generated reporting workflows.",
      "Built a 3-layer fallback extraction pipeline using AWS Textract, improving reliability for complex financial document processing.",
      "Reduced application latency by 60%+ and significantly lowered origin server load by implementing AWS CloudFront caching, CDN optimization, and edge-delivery strategies for globally distributed traffic.",
      "Managed and optimized a large-scale data platform containing 30,000+ financial and market research reports, supporting high-volume search and ingestion users from multiple countries.",
      "Leveraged Claude Code as an AI-assisted development tool for code generation, debugging, refactoring, and exploring implementation approaches, while independently reviewing, testing, and integrating the resulting code into production workflows.",
    ],
  },
  {
    role: "Full Stack Developer",
    org: "Swalook Global Pvt. Ltd",
    period: "Feb 2024 – Aug 2024",
    year: "2024",
    until: "Aug 2024",
    badge: "7 months",
    points: [
      "Engineered a CRM platform during internship, expanding it to 5+ sub-branches.",
      "Optimized appointment bookings by 30% and generated 100+ bills weekly.",
      "Integrated business analytics and a loyalty program that lifted client retention by 15%.",
    ],
  },
  {
    role: "Web Developer",
    org: "IIIT Vadodara",
    period: "Oct 2023 – Nov 2023",
    year: "2023",
    until: "Nov 2023",
    badge: "2 months",
    points: ["Led development of the institute's 5th convocation website, delivered on time with a seamless user experience."],
  },
  {
    role: "Full Stack Developer",
    org: "Bombay Cat Films",
    period: "Jul 2023 – Sep 2023",
    year: "2023",
    until: "Sep 2023",
    badge: "3 months",
    points: ["Designed and deployed a recruitment platform processing 200+ applications weekly, cutting time-to-hire by 20%."],
  },
];

export const education = [
  { title: "B.Tech, Information Technology", org: "Indian Institute of Information Technology Vadodara", period: "2021 – 2025", year: "2021", until: "2025", badge: "4 years" },
  { title: "Higher Secondary Education (XII)", org: "Prerna College of Commerce, Science & Art", period: "2019 – 2021", year: "2019", until: "2021", badge: "2 years" },
];

export const chapters = [
  {
    title: "Curious by default",
    text: "Show me something I don't understand and I can't leave it alone. I take it apart, figure out why it works, and then I want to build my own.",
  },
  {
    title: "Builds. Ships. Fixes.",
    text: "Ideas are cheap, so I build them. Real products for real people, and when something breaks, I'm the one who fixes it.",
  },
  {
    title: "Measured by impact",
    text: "Faster pages, smoother workflows, happier users. I care about results you can actually measure, and I get a little better every week.",
  },
];
