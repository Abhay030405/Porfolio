// The portfolio as it was when it was hardcoded in the frontend, converted to
// the fixed templates in src/content/schemas.ts. `npm run seed` loads this
// into an empty database; after that, the admin pages are the source of truth.

export const about = {
  eyebrow: "Prayagraj, India · Electrical Engineering, MNNIT · Class of 2028",
  headline: "I build the part of an LLM system that decides what happens next.",
  subheadline: "Orchestration, retrieval, and the failure paths nobody demos.",
  lede: [
    "Backend and AI systems. My work sits between the model and the database: agent graphs that have to terminate, retrieval pipelines that have to be measured rather than vibed, and the boring correctness questions — *retries, state, latency budgets, what happens on the second call.*",
    "I'm an electrical engineering student who writes production Python. I mention that first because it's the obvious question, and because nobody assigned me this.",
  ],
  links: [
    { label: "github.com/Abhay030405 →", url: "https://github.com/Abhay030405" },
    { label: "itsabhay.me →", url: "https://itsabhay.me" },
    { label: "LinkedIn →", url: "https://linkedin.com/in/abhay-agarwal-mnnit" },
    { label: "officialabhay030405@gmail.com →", url: "mailto:officialabhay030405@gmail.com" },
  ],
  depth: {
    title: "Where I actually sit in a system",
    tick: "HONEST DEPTH, NOT A SKILLS CLOUD",
    scale: [
      { label: "SHIPPED ONCE", level: 23 },
      { label: "DEBUGGED IN PROD", level: 61.5 },
      { label: "ON CALL FOR IT", level: 92.3 },
    ],
    rows: [
      { label: "Agent orchestration", level: 100, note: "LangGraph · 8-node cyclic graph, convergence, back edges" },
      { label: "Retrieval + eval", level: 92.3, note: "Hybrid vector + graph, reranking, RAGAS faithfulness" },
      { label: "Backend APIs", level: 80.8, note: "FastAPI, async tools, latency budgets under 2s" },
      { label: "Data stores", level: 65.4, note: "Postgres, Mongo, Neo4j, Qdrant — schema and queries, not ops" },
      { label: "Applied CV / ML", level: 50, note: "One pipeline, end to end. Pseudo-labeling, MC Dropout, GradCAM" },
      { label: "Algorithms", level: 46.2, note: "Codeforces Specialist, 1444 peak. Enough, not exceptional" },
      { label: "Infra at scale", level: 23, note: "Docker. No Kubernetes, no real distributed systems. Yet." },
      { label: "Frontend", level: 21.2, note: "I can make it work. Don't hire me for it." },
    ],
  },
  evidence: {
    title: "Three things I can defend for twenty minutes",
    tick: "WITH THE WORK THEY CAME FROM",
    cards: [
      {
        kicker: "Production, EmployLabs.ai",
        figure: "<2s",
        unit: "end to end",
        body: "An HR copilot holding 30–35 turn conversations, stateless across requests, with context assembled in under 300ms. The interesting problem wasn't the model — it was deciding what to forget.",
        source: "Intern, backend + AI systems · Mar–Jun 2026",
      },
      {
        kicker: "Measured, not asserted",
        figure: "31% → 8%",
        unit: "hallucination",
        body: "Self-RAG critique agents over a hybrid vector-plus-graph retriever. Held-out eval set, 0.91 RAGAS faithfulness, P95 retrieval under 200ms. I can show you the runs where it didn't work.",
        source: "Hybrid RAG academic assistant · Dec 2025–Feb 2026",
      },
      {
        kicker: "The hard kind of graph",
        figure: "8 agents",
        unit: "one back edge",
        body: "A campaign pipeline where the last agent scores variants and rewrites the bottom quartile — then feeds back into strategy. A cycle, not a chain. Making it halt was the work.",
        source: "CampaignX multi-agent platform · Apr–May 2026",
      },
    ],
  },
  approach: {
    title: "How I work",
    tick: "AND WHAT I'M LOOKING FOR",
    points: [
      {
        lead: "I distrust demos.",
        text: "Anything that only works on the happy path isn't finished. Most of my time on a project goes into the second call, the partial failure, the retry that must not double-send.",
      },
      {
        lead: "I'd rather cut than add.",
        text: "The last system I built had Redis, WebSockets, and a vector store in the plan. None of them solved a problem it actually had. They came out.",
      },
      {
        lead: "Looking for:",
        text: "a backend or AI-systems internship where the LLM is a component in something that has to stay up, not the product itself. Teams that write evals. I'll take a smaller scope with a stricter reviewer over the reverse.",
      },
      {
        lead: "Also true:",
        text: "I built a robot that won a 1v1 fight, and one that traced paths. Hardware is where I learned that a system's real behaviour is the one it has at 2am, not the one in the spec.",
      },
    ],
  },
  limits: {
    title: "What I haven't done",
    tick: "SO YOU DON'T HAVE TO FIND OUT LATER",
    points: [
      {
        lead: "I have never operated a system at scale.",
        text: "My latency numbers come from single-node services with tens of users. I know what a p99 is; I have not been woken up by one.",
      },
      {
        lead: "I have not trained a model from scratch.",
        text: "I fine-tune, prompt, evaluate, and orchestrate. The CV project used pre-trained backbones and pseudo-labels, and the honest word for that is *assembly*.",
      },
      {
        lead: "My CPI is 7.38.",
        text: "I've spent my time on things that ship rather than on the exam average. That's a trade, not an accident, and I'll own either side of it.",
      },
      {
        lead: "I'm in my second year.",
        text: "Most of what I know, I know for six months. What I have is the loop, not the archive.",
      },
    ],
  },
};

export const experience = {
  opener: "Here's a detailed look at my professional journey 📋",
  heading: "My Experience",
  intro:
    "I don’t chase job titles or pad my resume with buzzwords.\nEvery role I’ve taken has one thing in common — I shipped something real.\nProduction systems. Research pipelines. AI agents running at scale.\nNot demos. Not POCs. Things that actually worked under pressure.",
  quote: "If it didn’t solve a hard problem or make something meaningfully better — it didn’t make the cut.",
  entries: [
    {
      emoji: "🤖",
      title: "Software Development Intern",
      period: "April 2026 - June 2026",
      organization: "EmployLab.ai",
      location: "Remote",
      tagline: "",
      images: ["/employlabs.png", "/employlabs1.png"],
      summary: "",
      bullets: [
        "Engineered a production HR AI Copilot orchestrating 10 natural-language-driven tools (candidate moves, rejections, comparisons, interview scheduling, transcript analysis, pipeline overview) with a single Claude API call per conversation — all subsequent turns fully deterministic — eliminating per-turn LLM cost while reducing recruiter pipeline operations from multi-step dashboard clicks to free-form English commands.",
        "Architected stateless multi-turn HR conversation flows using conversation history as the sole state store (zero sessions, zero Redis, zero DB polling), designing 3-turn reason-capture flows backed by a live tag-bank that auto-generated audit-ready structured notes on every candidate action — reducing HR documentation overhead to zero additional manual effort per action.",
        "Built Zia's complete Ring 2 Candidate Context Layer — an 8-component personalization pipeline spanning episodic memory store, semantic retriever, relationship stage tracker, language calibrator, objectives tracker, compaction engine, mixing board, and context assembler — delivering a dynamically assembled ~2,500 token candidate context per LLM call in under 300ms, enabling Zia to treat 500+ candidates uniquely across sessions.",
        "Implemented a PostgreSQL + pgvector episodic memory system with a 5-stage multi-filter retrieval pipeline (cosine similarity → recency boost → importance filter → door rule enforcement → diversity filter) achieving semantic memory retrieval in under 150ms — the conservative door rule enforcer eliminated intrusive memory surfaces entirely, achieving zero violations across 20+ eval scenarios and ≥ 4.0/5.0 personalization quality scores.",
        "Engineered a 4-level Hinglish/formality language calibration system and conversation compaction engine that kept 30+ turn voice conversations within 11,000 total tokens at 90% KV-cache hit rate — sustaining end-to-end voice response latency under 2 seconds and powering a 5-stage relationship arc (Stranger → Life Companion) with ≥ 80% blind rater accuracy for stage-distinct behavior.",
      ],
      techStack: "Python, FastAPI, Claude API (Anthropic), PostgreSQL, pgvector, Redis, SQLAlchemy, Pydantic",
      quote: "",
    },
    {
      emoji: "💻",
      title: "Software Development Intern",
      period: "February 2026 - March 2026",
      organization: "Digiworldlink Pvt. Ltd.",
      location: "Remote",
      tagline: "",
      images: ["/digiworld.png", "/digiworld2.png"],
      summary: "",
      bullets: [
        "Architected and deployed a production-grade LLM workflow automation system processing 10,000+ freelancer bids daily, reducing client evaluation time by 73% and accelerating project matching by 2.4x across 500+ active listings.",
        "Engineered a hybrid semantic retrieval pipeline combining dense embeddings and keyword search, achieving 1.8s P95 latency at scale while maintaining 91% ranking relevance for profile-to-project matching.",
        "Improved bid evaluation accuracy from 64% to 91% through prompt engineering and RAG-based context injection, increasing client satisfaction and reducing manual review overhead by 8 hours/day.",
        "Optimized retrieval quality with 82% context precision and 86% context recall, ensuring zero qualified bids missed while filtering 94% of irrelevant matches through multi-stage reranking.",
      ],
      techStack: "Python, LangChain, LangGraph, Gemini API, FastAPI, vector embeddings, RAG architecture",
      quote: "",
    },
    {
      emoji: "⚙️",
      title: "Competitive Programming — Algorithms & DSA",
      period: "",
      organization: "",
      location: "",
      tagline: "2+ years of consistent practice",
      images: ["/codeforces.png", "/leetcode.png"],
      summary: "Competitive programming is where I built my core problem-solving muscle.:",
      bullets: [
        "Active on platforms like Codeforces and LeetCode",
        "Solved **500+ algorithmic problems**",
        "Strong command over data structures, algorithms, and complexity analysis",
        "Ranked as Specialist on Codeforces with a peak rating of 1444",
        "Regular participant in contests that demand speed, precision, and logic",
      ],
      techStack: "",
      quote:
        "Research trained me to **think deeply**, Development trained me to **build reliably**, Competitive programming trained me to **solve hard problems under pressure**",
    },
  ],
};

export const skills = {
  opener: "Here's a comprehensive breakdown of my technical skills 💻",
  quote: "I don’t collect tools, I master them until they bend to the problem.",
  languagesHeading: "Programming Languages",
  languages: [
    {
      emoji: "🐍",
      name: "Python",
      level: "Advanced",
      codeLanguage: "python",
      snippet: 'print("Hello World, Myself Abhay")\nprint("Python is where I think, prototype, and ship")',
    },
    {
      emoji: "☕",
      name: "Java",
      level: "Advanced",
      codeLanguage: "java",
      snippet:
        'System.out.println("Hello World, Myself Abhay");\nSystem.out.println("Strong grasp of object-oriented design principles.");\nSystem.out.println("This is the Language in which I have mastered Data Structures");',
    },
    {
      emoji: "⚡",
      name: "C/C++",
      level: "Proficient",
      codeLanguage: "cpp",
      snippet:
        'cout << "Hello World, Myself Abhay" << endl;\ncout << "Used when performance and control matter." << endl;\ncout << "Writing efficient code where abstraction has a cost" << endl;',
    },
  ],
  groups: [
    {
      heading: "Machine Learning & AI",
      intro: "I work extensively with:",
      codeLanguage: "python",
      lines: [
        "Deep learning frameworks: TensorFlow & PyTorch",
        "Computer vision: OpenCV, YOLO, R-CNN",
        "NLP and transformers: Scipy, NLTK",
        "Classical ML algorithms: Scikit-learn",
        "Artificial Inteligence: LangChain & LangGraph",
        "MLOps: MLflow, Apache Airflow, FastAPI, Docker",
      ],
    },
    {
      heading: "Web Development",
      intro: "",
      codeLanguage: "code",
      lines: [
        "Frontend: React.js, Next.js, HTML5, CSS, Tailwind CSS",
        "Backend: FastApi, Lareval, Node.js, Express, REST APIs & GraphQL",
        "NLP and transformers: Scipy, NLTK",
      ],
    },
    {
      heading: "Tools & Technologies",
      intro: "",
      codeLanguage: "code",
      lines: [
        "Version Control: Git & GitHub",
        "Containerization: Docker",
        "Cloud: AWS, Google Cloud",
        "Databases: PostgreSQL, MongoDB, Redis",
        "Artificial Inteligence: LangChain & LangGraph",
        "MLOps: MLflow, Apache Airflow, FastAPI, Docker",
      ],
    },
    {
      heading: "Soft Skills",
      intro: "",
      codeLanguage: "code",
      lines: [
        "Problem Solving     - Break complex problems into clear components and engineer precise working solutions.",
        "Team Collaboration  - Communicate clearly, share ownership, and push teams toward focused execution goals.",
        "Technical Writing   - Explain complex technical concepts in simple language developers and stakeholders understand.",
        "Research & Analysis - Investigate unknown domains, validate assumptions, and extract meaningful insights from data.",
      ],
    },
  ],
};

export const achievements = {
  opener:
    "I don’t chase certificates — I chase difficulty.\nThe following milestones reflect consistency, curiosity, and execution over time.",
  entries: [
    {
      title: "Cloud-Weaver — AI-Assisted Cloud Infrastructure Designer",
      recognition: "1st Runner-Up — HACKATRON, Infotsav Technical Fest, IIITM Gwalior (October 2025)",
      images: ["/Hacatron.png", "/Hacatron1.png"],
      problem:
        "Learning AWS architecture is hard because students can study services but cannot visualize deployment behavior, failure handling, or cost impact before building real systems.",
      solution:
        "We built a platform that converts Terraform infrastructure into a visual canvas, simulates failures (EC2, load balancer routing), estimates AWS cost, and enables one-click deployment. It helps users understand distributed system architecture through experimentation rather than memorization.",
    },
    {
      title: "Pothole Detection using Computer Vision",
      recognition: "Winner — Logical Rhythms (Codesangam 2025), CC Club MNNIT, November 2025",
      images: ["/logicalRythm.png", "/logicalryhtm2.png"],
      problem:
        "Manual road inspection is slow, inconsistent, and unsafe. Authorities often detect potholes late, leading to accidents and delayed maintenance.",
      solution:
        "We developed a deep-learning based detection system using YOLO. The model analyzed road images/video frames to automatically identify and localize potholes in real time. The system demonstrated how computer vision can assist smart-city monitoring and enable faster, data-driven road maintenance.",
    },
    {
      title: "Command Nest — Intelligence Operations Management Platform",
      recognition: "Special Mention — Dev or Die (Power Surge 2025), Avishkar 2025 — Team Bijli Vibhag",
      images: ["/command.png", "/command2.png"],
      problem:
        "Teams handling operations and documents struggle with scattered information, manual tracking, and insecure access control, making coordination, monitoring, and decision-making inefficient.",
      solution:
        "We built a secure full-stack platform with role-based access, mission tracking boards, and AI-powered document analysis using RAG. The system supported real-time updates, knowledge search, and analytics dashboards, centralizing operations into a single intelligent management interface.",
    },
    {
      title: "Competitive Programming — Codeforces Rating 1444 (Specialist)",
      recognition: "500+ problems solved across competitive programming platforms",
      images: ["/codeforces.png", "/leetcode.png"],
      problem:
        "Software engineering and ML roles require strong algorithmic thinking, optimization skills, and the ability to solve unfamiliar problems under strict time constraints.",
      solution:
        "Through consistent contest participation and practice, I solved hundreds of problems involving data structures, graphs, dynamic programming, and greedy strategies, reaching a peak Codeforces rating of 1444 (Specialist). This strengthened my speed, logical reasoning, and ability to design efficient solutions under pressure.",
    },
    {
      title: "Team RoboRajan 3.0 — Combat Robotics Bot",
      recognition: "Winner — Robo-Wars (BotRush Robotics Club 2025), MNNIT",
      images: ["/robowars.png", "/robowars1.jpeg"],
      problem:
        "In 1v1 combat robotics, robots must survive aggressive impacts while maintaining control, stability, and maneuverability under unpredictable conditions.",
      solution:
        "Our team designed and built a durable combat robot optimized for traction, balance, and quick directional control. We engineered the mechanical structure and control system to withstand collisions and outmaneuver opponents in real time, ultimately winning the Robo-Wars competition through reliable performance and coordinated team strategy.",
    },
    {
      title: "Team FanOut - Gesture-Controlled Media Remote (Arduino System)",
      recognition: "1st Runner-Up — Predefined Hardware (Power Surge 2025), Avishkar 2025",
      images: ["/fanOut1.png", "/fanOut.png"],
      problem:
        "Traditional media control requires physical buttons or devices, which is inconvenient for hands-busy environments and accessibility use cases.",
      solution:
        "We built an Arduino-based gesture control system using ultrasonic sensors to detect hand distance and motion. By applying filtering and gesture logic (swipe, hold, near/far), the device controlled play/pause, track navigation, and volume. LED indicators and dual modes ensured reliable real-time interaction during repeated testing.",
    },
    {
      title: "Autonomous Doodle Bot — Line Following Robot",
      recognition: "2nd Runner-Up — Doodle Bot (Robomania 2024), Avishkar 2024",
      images: ["/doodlebot.png", "/doodlebot1.jpeg"],
      problem:
        "Autonomous robots must navigate predefined paths accurately while handling turns, intersections, and speed variations without human control.",
      solution:
        "We designed a microcontroller-based line-following robot using sensor feedback and control logic to track paths and adjust motor speed in real time. By tuning detection thresholds and movement response, the bot maintained stability on curves and intersections, successfully completing the course and securing second runner-up.",
    },
  ],
};

export const contact = {
  opener: "I'd love to connect with you! 🤝",
  quote:
    "If you’re building something interesting, researching something hard, or solving problems that actually matter — let’s talk.",
  pitch: "If your idea involves building, breaking, or scaling something non-trivial — my inbox is open.",
  email: "officialabhay030405@gmail.com",
  emailNote: "I check this regularly and respond thoughtfully.",
  linkGroups: [
    {
      emoji: "🔗",
      title: "Professional Networks",
      links: [
        { label: "LinkedIn", value: "linkedin.com/in/abhay-agarwal-8563352b1" },
        { label: "GitHub", value: "github.com/Abhay030405" },
      ],
    },
    {
      emoji: "💻",
      title: "Competitive Programming",
      links: [
        { label: "CodeForces", value: "codeforces.com/profile/absolutabhay" },
        { label: "LeetCode", value: "leetcode.com/u/absolutabhay" },
      ],
    },
    {
      emoji: "📊",
      title: "Data Science",
      links: [{ label: "Kaggle", value: "kaggle.com/abhayondata" }],
    },
  ],
  openTo: [
    "🤝 Meaningful collaborations",
    "🔬 Research discussions and experimentation",
    "🚀 Ambitious project ideas and system design talks",
    "🌱 Networking, learning, and mentorship conversations",
  ],
  closingQuote:
    "I usually respond within 24–48 hours. If your message is thoughtful, it’ll get a thoughtful reply.",
};

/* ── Welcome ── */

export const welcome = {
  greeting: "Welcome to Abhay Agarwal's portfolio.",
  intro: [
    "I'm **Abhay Agarwal** — an AI engineer from Prayagraj, India, studying Electrical Engineering at MNNIT (Class of 2028). I build the part of an LLM system that decides what happens next: agent graphs, retrieval pipelines, and the APIs around them.",
    "Most recently I was a Software Development Intern at **EmployLab.ai**, building an HR copilot that answers in under two seconds. Away from work I'm a Codeforces Specialist, and I've placed at hackathons like HACKATRON at IIITM Gwalior.",
    "This site works like a chat: pick a topic below, or ask me anything in the box.",
  ],
  prompt: "What would you like to know?",
  topics: [
    { tool: "about", label: "About me", description: "who I am and what drives me" },
    { tool: "experience", label: "Experience", description: "roles, teams and what I built" },
    { tool: "projects", label: "Projects", description: "things I've designed and shipped" },
    { tool: "skills", label: "Skills", description: "languages, frameworks and tools I use" },
    { tool: "achievements", label: "Achievements", description: "milestones and recognition so far" },
    { tool: "contact", label: "Contact", description: "the best ways to reach me" },
  ],
  resume: { text: "Short on time?", label: "Read my resume" },
  linksLabel: "Elsewhere:",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/abhay-agarwal-8563352b1/" },
    { label: "GitHub", url: "https://github.com/Abhay030405" },
    { label: "Codeforces", url: "https://codeforces.com/profile/absolutabhay" },
    { label: "LeetCode", url: "https://leetcode.com/u/absolutabhay/" },
    { label: "Kaggle", url: "https://www.kaggle.com/abhayondata" },
  ],
};

/* ── Projects ── */

const PROJECT_CHATS = [
  "Solve a Real Problem People Actually Face, Not Another Tutorial Clone",
  "Show It Working Instantly With a Live Link, Video, and Screenshots",
  "Write a Clear README That Explains What, Who, Why, and How",
  "Share Your Thinking: Hard Parts, Failed Attempts, Choices, and Next Steps",
  "Go Deep on One Thing Instead of Building Many Shallow Features",
  "Back Your Work With Real Numbers, Real Users, and Real Feedback",
];
const PROJECT_CHAT_TIMES = ["8 hours ago", "14 hours ago", "2 days ago", "3 days ago", "Sep 6", "Sep 6"];
const chats = PROJECT_CHATS.map((title, i) => ({ title, time: PROJECT_CHAT_TIMES[i] }));

const placeholderArtifacts = (name: string) => [
  {
    title: `${name} — Architecture overview`,
    kind: "Document",
    content: `How ${name} is put together: the main components, how data flows between them, and the design decisions behind them.\n\nThe full write-up is coming soon.`,
  },
  {
    title: `${name} — Build notes`,
    kind: "Document",
    content: `Notes from building ${name}: what worked, what broke, and what I would do differently next time.\n\nThe full write-up is coming soon.`,
  },
];

const sidebarProject = (name: string, shortName = name) => ({
  showInSidebar: true,
  data: { name, description: "", meta: "", chats, artifacts: placeholderArtifacts(shortName) },
});

const earlierProject = (name: string, description: string, meta: string) => ({
  showInSidebar: false,
  data: {
    name,
    description,
    meta,
    chats,
    artifacts: [{ title: "Overview", kind: "Case study", content: `${description}\n\n${meta}` }],
  },
});

export const projects = [
  sidebarProject("DeskAway"),
  sidebarProject("traceLens"),
  sidebarProject("Mr.Talkative - Adv RAG", "Mr.Talkative"),
  sidebarProject("Autonomail"),
  earlierProject(
    "Cloud-Weaver — AI-Assisted Cloud Infrastructure Designer",
    "Turns Terraform into a visual canvas — simulates EC2 and load-balancer failures, estimates AWS cost, and deploys in one click.",
    "1st Runner-Up · HACKATRON, IIITM Gwalior 2025",
  ),
  earlierProject(
    "Command Nest — Intelligence Operations Platform",
    "Full-stack operations platform with role-based access, mission tracking boards, and RAG-powered document analysis.",
    "Special Mention · Dev or Die, Avishkar 2025",
  ),
];
