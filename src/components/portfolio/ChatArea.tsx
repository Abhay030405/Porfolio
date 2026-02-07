import { useState, useRef, useEffect } from "react";
import { Plus, ArrowUp, Mic } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  section?: string;
  images?: string[];
}

interface ChatAreaProps {
  activeSection: string | null;
  onSectionChange: (section: string) => void;
  onAddToHistory: (query: string) => void;
}

const sectionData: Record<string, { title: string; content: string; images?: string[] }> = {
  about: {
    title: "About Me",
    content: `I'll tell you about myself clearly and in detail — no hype, no confusion 🙂
---
## 👨‍🎓 About Me -> Hello World, MySelf Abhay Agarwal
[IMAGE:/206020807.jpg,/image.png]
I don’t like buzzwords.
I like building things that actually work.
I’m **Abhay Agarwal** — a developer and researcher who operates at the intersection of Machine Learning, Computer Vision, and Full-Stack Engineering. I design systems end-to-end: from raw data and research ideas to production-ready applications.

I’m currently pursuing my degree while actively shipping projects, experimenting with research ideas, and pushing myself beyond “student-level” work. I don’t wait to be taught — I figure things out, break them, and rebuild them better.
---
## 🎓 My Education -> Electrical Engineer by degree. Machine Learning engineer by practice.
** 1️⃣ Motilal Nehru National Institute of Technology Allahabad, India**
*Bachelor of Technology, Electrical Engineering | 2024– 2028 | CPI: 7.65*
While my formal degree is in core engineering, my primary focus lies in Artificial Intelligence, Machine Learning, and Systems Engineering. I use my academics as a foundation — mathematics, signals, logic, and problem solving — and extend it into software, research, and real-world system building.
[IMAGE:/gis.png,/mnnit.jpg]

** 2️⃣ Mahatma Hansraj Modern School, Jhansi — Uttar Pradesh**
*Higher Secondary Education (CBSE) | 2021 – 2023 | Percentage: 82.33%*
Built core fundamentals in physics, mathematics, and logical reasoning that later shaped my interest in programming and problem solving
[IMAGE:/mhms2.jpg,/mhms.jpg]

** 3️⃣ Rani Laxmibai Public School, Jhansi — Uttar Pradesh**
*Secondary Education (CBSE) | 2021 | Percentage: 93.2%*
Built strong fundamentals in core subjects, fostering a solid foundation for future academic and professional pursuits. Developed early discipline, curiosity toward technology, and strong academic foundations.
[IMAGE:/rlps.jpeg,/rlps2.jpg]
---
## What I Do Best
**🧠 Machine Learning & AI**
I build intelligent systems with a deep understanding of why they work, not just how to use them.

My work spans:
- Deep learning architectures including CNNs and Transformers
- Computer Vision tasks such as object detection and image classification
- Natural Language Processing
- Model optimization, evaluation, and deployment

> I don’t treat models as **black boxes**. I focus on architecture choices, data behavior, failure cases, and performance trade-offs — the things that actually matter in real systems..
---
**🌐 Full-Stack Development**
I engineer scalable applications with a strong focus on system design and long-term maintainability.

I’m experienced in:
- Building full-scale web applications using React and FastAPI
- Creating responsive and user-friendly interfaces
- Implementing robust backend services with GoLang and FastAPI
- Designing **RESTful APIs** and microservices
- Database schema design and performance optimization
- Cloud deployment and DevOps

I don’t just **make it work**.
I design systems that are structured, efficient, and built to scale.
For example:

> Instead of just writing code, I focus on **architecture, performance, and maintainability**.
---
**⚙️ Problem Solving & Engineering Mindset**
This is where I stand out.

I can:
- Break down complex problems into clear, solvable components
- Debug deeply and explain exactly **why** something failed
- Translate abstract ideas into clean, working code
- Optimize existing systems for speed, efficiency, and clarity

> I approach problems like an **engineer — logically, systematically, and with attention to edge cases**.
---
## What Drives Me
- 🚀 Building systems that solve real, non-trivial problems
- 📚 Constantly leveling up my technical depth
- 🤝 Working with people who think rigorously and build seriously
- 🔬 Exploring cutting-edge ideas and pushing them into execution

> I believe great software is a balance of strong fundamentals, clean design, and ruthless clarity. That’s the standard I hold my work to.
---
## What to learn more about me ?
**Type any of these commands:**
• \`experience\` - View my work experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`projects\` - Browse my projects
• \`contact\` - Get in touch`,
  },
  experience: {
    title: "My Experience",
    content: `Here's a detailed look at my professional journey 📋
---
## My Experience
I don’t measure experience by titles.
I measure it by systems built, problems solved, and depth gained.
---
**💻 Software Development Intern — LLM & API Engineering **
Feb '25 - Present | Remote | Digiworldlink Pvt Ltd.
[IMAGE:/digiworld.png,/digiworld2.png]
My development work includes:

- Developing full-stack web applications with a strong backend-first mindset
- Built RESTful backend services with SQL databases supporting secure and efficient data operations.
- Designing database schemas with performance and growth in mind
- Writing code that prioritizes clarity, structure, and long-term maintainability
- Developed autonomous AI agents using large language models for decision-making and task execution.
- Tools: Python, LLMs, NLP, GoLang, FastAPI, LangChain, LangGraph

\`\`\`typescript
// My approach to development
func main() {
	myPhilosophy := Philosophy{
		Code:          "clean and maintainable",
		Architecture:  "scalable and robust",
		Testing:       "comprehensive coverage",
		Documentation: "clear and thorough",
	}
	fmt.Println(myPhilosophy)
}
> I treat every project like something that may need to scale tomorrow.
\`\`\`
---
**🔬 Research Intern — Machine Learning**
Dec '25 - Feb '26 | GIS Cell, MNNIT | Prof. Ramaji Dwivedi 
[IMAGE:/gis.png,/gis2.jpg]
> I work at the intersection of research rigor and real-world execution.

My responsibilities include:
-  Designed and evaluated CNN-based architectures for landslide detection using transfer learning.
-  Applied digital image processing methods for analysis and interpretation of remote sensing imagery.
- Implemented transfer learning using COCO-pretrained ResNet-101, Segment Anything Model(SAM) backbone architecture.
- Worked with the Explainable AI (XAI) for the interpretation of results from the model
- Tools: Python, PyTorch, Google Colab, Explainable AI(XAI), Segment Anything Model(SAM)

> I focus on bridging the gap between **research and practical implementation**.
---
**⚙️ Competitive Programming — Algorithms & DSA**
*2+ years of consistent practice*
[IMAGE:/codeforces.png,/leetcode.png]

Competitive programming is where I built my core problem-solving muscle.:

- Active on platforms like Codeforces and LeetCode
- Solved **500+ algorithmic problems**
- Strong command over data structures, algorithms, and complexity analysis
- Ranked as Specialist on Codeforces with a peak rating of 1434
- Regular participant in contests that demand speed, precision, and logic

> Research trained me to **think deeply**, Development trained me to **build reliably**, Competitive programming trained me to **solve hard problems under pressure**
---
## What to learn more about me ?
**Type any of these commands:**
• \`about\` - Get a short overview about me and how I work
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`projects\` - Browse my projects
• \`contact\` - Get in touch
`,
  },
  skills: {
    title: "My Skills",
    content: `Here's a comprehensive breakdown of my technical skills 💻
---
> I don’t collect tools, I master them until they bend to the problem.
## Programming Languages
**🐍 Python** — Advanced
\`\`\`python
print("Hello World, Myself Abhay")
print("Python is where I think, prototype, and ship")
\`\`\`
**☕ Java** — Advanced
\`\`\`java
System.out.println("Hello World, Myself Abhay");
System.out.println("Strong grasp of object-oriented design principles.");
System.out.println("This is the Language in which I have mastered Data Structures");
\`\`\`
**⚡ C/C++** — Proficient
\`\`\`cpp
cout << "Hello World, Myself Abhay" << endl;
cout << "Used when performance and control matter." << endl;
cout << "Writing efficient code where abstraction has a cost" << endl;
\`\`\`
---
## Machine Learning & AI
I work extensively with:
\`\`\`python
Deep learning frameworks: TensorFlow & PyTorch
Computer vision: OpenCV, YOLO, R-CNN
NLP and transformers: Scipy, NLTK
Classical ML algorithms: Scikit-learn
Artificial Inteligence: LangChain & LangGraph
MLOps: MLflow, Apache Airflow, FastAPI, Docker
\`\`\`
---
## Web Development
\`\`\`code
Frontend: React.js, Next.js, HTML5, CSS, Tailwind CSS
Backend: FastApi, Lareval, Node.js, Express, REST APIs & GraphQL
NLP and transformers: Scipy, NLTK
\`\`\`
---
## Tools & Technologies
\`\`\`code
Version Control: Git & GitHub
Containerization: Docker
Cloud: AWS, Google Cloud
Databases: PostgreSQL, MongoDB, Redis
Artificial Inteligence: LangChain & LangGraph
MLOps: MLflow, Apache Airflow, FastAPI, Docker
\`\`\`
---
## Soft Skills
\`\`\`code
Problem Solving     - Break complex problems into clear components and engineer precise working solutions.
Team Collaboration  - Communicate clearly, share ownership, and push teams toward focused execution goals.
Technical Writing   - Explain complex technical concepts in simple language developers and stakeholders understand.
Research & Analysis - Investigate unknown domains, validate assumptions, and extract meaningful insights from data.
\`\`\`
---
## What to learn more about me ?
**Type any of these commands:**
• \`about\` - Get a short overview about me and how I work
• \`experience\` - View my work experience
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`projects\` - Browse my projects
• \`contact\` - Get in touch`,
  },
  achievements: {
    title: "My Achievements",
    content: `I don’t chase certificates — I chase difficulty.
The following milestones reflect consistency, curiosity, and execution over time.
---
## 1️⃣ Cloud-Weaver — AI-Assisted Cloud Infrastructure Designer
*1st Runner-Up — HACKATRON, Infotsav Technical Fest, IIITM Gwalior (October 2025)*
[IMAGE:/Hacatron.png,/Hacatron1.png]
***Problem we have solved: ***
• Learning AWS architecture is hard because students can study services but cannot visualize deployment behavior, failure handling, or cost impact before building real systems.
***Solution we have proposed:***
• We built a platform that converts Terraform infrastructure into a visual canvas, simulates failures (EC2, load balancer routing), estimates AWS cost, and enables one-click deployment. It helps users understand distributed system architecture through experimentation rather than memorization.
---
## 2️⃣ Pothole Detection using Computer Vision
*Winner — Logical Rhythms (Codesangam 2025), CC Club MNNIT, November 2025*
[IMAGE:/logicalRythm.png,/logicalryhtm2.png]
***Problem we have solved: ***
• Manual road inspection is slow, inconsistent, and unsafe. Authorities often detect potholes late, leading to accidents and delayed maintenance.
***Solution we have proposed:***
• We developed a deep-learning based detection system using YOLO. The model analyzed road images/video frames to automatically identify and localize potholes in real time. The system demonstrated how computer vision can assist smart-city monitoring and enable faster, data-driven road maintenance.
---
## 3️⃣ Command Nest — Intelligence Operations Management Platform
*Special Mention — Dev or Die (Power Surge 2025), Avishkar 2025 — Team Bijli Vibhag*
[IMAGE:/command.png,/command2.png]
***Problem we have solved: ***
• Teams handling operations and documents struggle with scattered information, manual tracking, and insecure access control, making coordination, monitoring, and decision-making inefficient.
***Solution we have proposed:***
• We built a secure full-stack platform with role-based access, mission tracking boards, and AI-powered document analysis using RAG. The system supported real-time updates, knowledge search, and analytics dashboards, centralizing operations into a single intelligent management interface.
---
## 4️⃣ Competitive Programming — Codeforces Rating 1390 (Pupil)
*500+ problems solved across competitive programming platforms*
[IMAGE:/codeforces.png,/leetcode.png]
***Problem: ***
• Software engineering and ML roles require strong algorithmic thinking, optimization skills, and the ability to solve unfamiliar problems under strict time constraints.
***Solution: ***
• Through consistent contest participation and practice, I solved hundreds of problems involving data structures, graphs, dynamic programming, and greedy strategies, reaching a peak Codeforces rating of 1390 (Pupil). This strengthened my speed, logical reasoning, and ability to design efficient solutions under pressure.
---
## 5️⃣ Team RoboRajan 3.0 — Combat Robotics Bot
*Winner — Robo-Wars (BotRush Robotics Club 2025), MNNIT*
[IMAGE:/robowars.png,/robowars1.jpeg]
***Problem we have solved: ***
• In 1v1 combat robotics, robots must survive aggressive impacts while maintaining control, stability, and maneuverability under unpredictable conditions.
***Solution we have proposed:***
• Our team designed and built a durable combat robot optimized for traction, balance, and quick directional control. We engineered the mechanical structure and control system to withstand collisions and outmaneuver opponents in real time, ultimately winning the Robo-Wars competition through reliable performance and coordinated team strategy.
---
## 6️⃣ Team FanOut - Gesture-Controlled Media Remote (Arduino System)
*1st Runner-Up — Predefined Hardware (Power Surge 2025), Avishkar 2025*
[IMAGE:/fanOut1.png,/fanOut.png]
***Problem we have solved: ***
• Traditional media control requires physical buttons or devices, which is inconvenient for hands-busy environments and accessibility use cases.
***Solution we have proposed:***
• We built an Arduino-based gesture control system using ultrasonic sensors to detect hand distance and motion. By applying filtering and gesture logic (swipe, hold, near/far), the device controlled play/pause, track navigation, and volume. LED indicators and dual modes ensured reliable real-time interaction during repeated testing.
---
## 7️⃣ Autonomous Doodle Bot — Line Following Robot
*2nd Runner-Up — Doodle Bot (Robomania 2024), Avishkar 2024*
[IMAGE:/doodlebot.png,/doodlebot1.jpeg]
***Problem we have solved: ***
• Autonomous robots must navigate predefined paths accurately while handling turns, intersections, and speed variations without human control.
***Solution we have proposed:***
• We designed a microcontroller-based line-following robot using sensor feedback and control logic to track paths and adjust motor speed in real time. By tuning detection thresholds and movement response, the bot maintained stability on curves and intersections, successfully completing the course and securing second runner-up.
---
## What to learn more about me ?
**Type any of these commands:**
• \`about\` - Get a short overview about me and how I work
• \`experience\` - View my work experience
• \`skills\` - See my technical skills
• \`research\` - Explore my research
• \`projects\` - Browse my projects
• \`contact\` - Get in touch`,
  },
  research: {
    title: "My Research Progress",
    content: `I work on applying Artificial Intelligence to real-world scientific and engineering problems, especially where data is complex and decisions matter.
My research combines computer vision, remote sensing, and reasoning-based AI systems.
---
## Current Research Focus
**🌍 Pixel-Level Landslide Intelligence (Remote Sensing)**
[IMAGE:/geosheild.png,/geosheild2.jpg]
I am developing a deep-learning system to analyze satellite imagery and detect landslide regions at pixel-level precision instead of simple image classification.
The goal is not only to detect whether a landslide exists, but where exactly it exists on terrain.
*Key work includes:*
• Satellite image preprocessing and augmentation
• Semantic segmentation models (U-Net style architectures)
• Terrain feature learning from remote sensing data
• Risk mapping for disaster monitoring
> The system aims to support early warning and environmental monitoring applications.
---
**🧊 Glacier Burst Detection (Remote Sensing)**
[IMAGE:/glasier.jpg,/glasier2.jpg]
Glacier lake outburst floods (GLOFs) are dangerous events that are difficult to monitor manually in mountainous regions.
I am building a model that studies multi-temporal satellite imagery to identify patterns indicating a potential glacier burst.
*Research focus:*
• Change detection across time-series satellite images
• Automated alert-style prediction pipeline
• Terrain feature learning from remote sensing data
• Detecting abnormal expansion or structural changes in glacial lakes
> The objective is to assist large-scale monitoring where human inspection is impractical.
---
**🧠 Multi-Phase Chain-of-Thought Reasoning using LLMs**
[IMAGE:/chainofThoughts.png,/chainofThoughts.jpg]
Alongside computer vision, I am researching reasoning-focused AI systems using Large Language Models.
*I am designing a multi-phase chain-of-thought framework where an LLM:*
• Understands a complex task
• Breaks it into structured steps
• Verifies intermediate reasoning
• Produces a validated final output
*This work explores:*
• LangChain-based orchestration
• tool-augmented reasoning
• structured planning agents
• reliability and reasoning accuracy of LLM systems
> The goal is to move LLMs from simple chat responses to decision-making assistants.
---
**Research Methodology**
My research workflow follows an engineering-style pipeline:
1. Problem Understanding — Study the real-world system first
2. Data Preparation — Cleaning, labeling, and augmentation
3. Model Design — Selecting or designing appropriate architectures
4. Evaluation — Error analysis and failure-case study
5. Iteration — Improve based on observations and metrics
> I focus heavily on why a model fails, not just when it succeeds.
---
## What to learn more about me ?
**Type any of these commands:**
• \`about\` - Get a short overview about me and how I work
• \`experience\` - View my work experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`projects\` - Browse my projects
• \`contact\` - Get in touch`,
  },
  projects: {
    title: "My Projects",
    content: `Here's a showcase of my key projects 🚀
---
## Featured Projects
**1️⃣ Last-Pulse -> AI That Thinks Before Life Stops**
*Developed a comprehensive hospital management system featuring deep learning models for radiology (CNN for X-ray analysis), cardiology (ECG anomaly detection), and pathology (image segmentation)*
January 2026 -- Present(Ongoing)
[IMAGE:/LastPulse.jpg,/lastPulse2.jpg]
- Designed role-based clinical workflows enabling doctors and patients to interact with AI-driven diagnoses.
- Radiology Module: CNN-based model for detecting pneumonia and fractures from X-ray images.
- Cardiology Module: LSTM model for real-time ECG anomaly detection.
- Pathology Module: U-Net architecture for segmenting histopathological images.
- Web Interface: Built with React and FastAPI for seamless user experience.
- Designed role-based clinical workflows enabling doctors and patients to interact with AI-driven diagnoses.
\`\`\`python
# Source Code
GitHub - https://github.com/Abhay030405/Last-Pulse
# Tech Stack
technologies = {
    "ML": ["PyTorch"],
    "CV": ["OpenCV"],
    "Model" : ["U-Net"],
    "Database": ["PostgreSQL"],
    "Deployment": ["FastAPI", "React", "Docker"]
}
\`\`\`
---
**2️⃣ Command Nest -> AI Command Hub for Intelligence Operations**
*SentinelOps Nexus is an enterprise-grade intelligence operations management platform built to orchestrate complex, high-stakes workflows with precision and security. It unifies mission planning, AI-powered document intelligence, and knowledge management into a single operational command layer.*
October 2025 -- November 2025
[IMAGE:/commandnest.png,/commandnest2.jpg]
- Leveraging RAG-based AI, vector search, and real-time WebSocket updates, the platform enables fast, context-aware decision-making.
- Robust role-based access control with multi-factor authentication ensures security across teams, while Kanban-driven mission tracking, facility operations, analytics, and multi-channel notifications keep every operation synchronized.
- Designed for scalability and reliability, SentinelOps Nexus transforms raw information into actionable intelligence at operational speed.
-  AI-powered platform managing missions, documents, security, analytics, and operations. Centralized intelligence system with role-based access and real-time automation.
\`\`\`python
# Source Code
GitHub - https://github.com/Abhay030405/Dev_or_Die
# Tech Stack
technologies = {
    "Programming Language": ["Python"],
    "AI Models": ["Gemini", "Ollama"],
    "AI FrameWork":["LangChain", "LangGraph"],
    "Database": ["MongoDB"],
    "Data": ["NumPy", "Pandas"],
    "Deployment": ["FastAPI", "React"]
}
\`\`\`
---
**3️⃣ GeoSheild -> Proof that deep learning, when aimed right, can see disasters before humans do.**
*Built an AI system that hunts landslides from the sky using UAV and Remote Sensing imagery and deep learning.*
September 2025 -- October 2025
[IMAGE:/geosheild.png,/geosheild2.jpg]
- Engineered a Mask R-CNN–based instance segmentation pipeline to detect and isolate disaster-prone regions with pixel-level precision.
- Trained a multi-class model to simultaneously identify Landslides, Water Bodies, Vegetation, and Buildings in complex aerial scenes.
- Leveraged transfer learning with COCO-pretrained ResNet-50 + FPN to achieve high accuracy on limited geospatial data.
- Optimized training using frozen backbones, custom annotations, and controlled train/val/test splits. Transformed raw aerial images into actionable disaster intelligence within seconds.
- Built a FastAPI backend to serve low-latency predictions for uploaded UAV images.
\`\`\`python
# Source Code
GitHub - https://github.com/Abhay030405/Dev_or_Die
# Tech Stack
technologies = {
    "Programming Language": ["Python"],
    "ML": ["TensorFlow", "PyTorch"],
    "CV": ["OpenCV", "YOLO", "Mask-RCNN"],
    "Model" : ["ResNet-101", "Segement Anything Model(SAM)"],
    "Data": ["NumPy", "Pandas"],
    "Deployment": ["Flask", "Docker"]
}
\`\`\`
---
**4️⃣ Market Mestro - Multi Agent System**
*Market Maestro is a multi-agent AI-driven financial research platform engineered to analyze markets as a coordinated intelligence system rather than a single model. It orchestrates autonomous agents—Market Analyst, Event Monitor, Risk Evaluator, and Portfolio Optimizer—using LangChain and LangGraph to fetch live market data, track financial events, quantify risk, and generate data-backed investment strategies.*
[IMAGE:/stockify.png,/stofiky2.png]
- Multi-Agent AI System Engineered to Decode Markets, Risk, and Opportunity
- Through a unified reasoning layer, the platform connects news sentiment, market movements, and portfolio metrics into actionable insights.
- With real-time visualization, explainable AI summaries, and strategy generation, Market Maestro transforms raw financial signals into structured, decision-ready intelligence.
\`\`\`python
# Source Code
GitHub - https://github.com/Abhay030405/market-maestro
# Tech Stack
technologies = {
    "Languages": ["Python"],
    "Artificial Intelligence": ["Langchain", "LangGarph"] 
    "Visualization Tools": ["Numpy", "Matplotlib"],
    "Deployment": ["FastAPI"]
}
\`\`\`
---
**5️⃣ Nueral Watch - Drift AI Assistant**
*Neural Watch is an AI-powered data drift monitoring system designed to ensure the reliability and performance of machine learning models in production. It combines statistical methods and machine learning techniques to detect shifts in data distributions that can impact model accuracy.*
[IMAGE:/drift.png,/drift2.png]
Key Features:
- Real-Time Data Monitoring: Continuously tracks incoming data streams for changes.
- Statistical Drift Detection: Utilizes methods like KS Test and Chi-Squared Test to identify distribution shifts.
- ML-Based Drift Detection: Implements models such as Autoencoders and Isolation Forests for anomaly detection.
- LLM-Powered Explanations: Provides human-readable insights and recommendations using advanced language models.
- Interactive Dashboard: Visualizes drift trends, metrics, and alerts for easy analysis.
- Alerting System: Notifies stakeholders of significant drifts via email or messaging platforms.
\`\`\`python
# Tech Stack
# Source Code
GitHub - https://github.com/Abhay030405/data-drift-monitoring
technologies = {
    "Languages": ["Python"],
    "Artificial Intelligence": ["Langchain", "LangGarph"]
    "Calculative Tools": ["KS Test", "PSI Test"] 
    "Visualization Tools": ["Numpy", "Matplotlib"],
    "Deployment": ["FastAPI"]
}
\`\`\`
---
**6️⃣ Neuro Foundary - Collaborative Agentic Platform**
*Build a Collaborative Agentic Platform proof-of-concept, an intelligent system that automates the end-to-end development of full-stack applications.*
[IMAGE:/multi.png,/multi2.png]
- The platform should connect with Azure DevOps (ADO), read project user stories, and orchestrate a team of specialized AI agents to generate, test, and integrate code.
- The main goal is to drastically reduce development time, automate manual coding tasks, and standardize application architecture by translating plain-text project requirements directly into deployable, full-stack code.
\`\`\`python
# Tech Stack
technologies = {
    "Languages": ["Python"],
    "Artificial Intelligence": ["Langchain", "LangGarph"]
    "Visualization Tools": ["Numpy", "Matplotlib"],
    "Deployment": ["FastAPI"]
}
\`\`\`
---
**7️⃣ FairLensAI - Bias Detection**
*FairLens AI is an end-to-end system designed to explain machine learning model predictions and detect bias across user demographics.*
[IMAGE:/bias.png,/bias2.png]
It combines:
- SHAP & LIME: Feature-level interpretability for predictions -Bias Detection Metrics: Identifies fairness issues across groups
-LangChain: Generates human-readable explanations summarizing model reasoning
-FastAPI Backend: Handles computation and API endpoints
-Streamlit Dashboard: Interactive frontend for visualization and reporting
-This system is ideal for ML model monitoring, AI observability, and ethical AI deployment.
> It empowers data scientists and stakeholders to understand model behavior, ensure fairness, and build trust in AI systems.
\`\`\`python
# Tech Stack
# Source Code
GitHub - https://github.com/Abhay030405/ai-bias-explainability
technologies = {
    "Languages": ["Python"],
    "Artificial Intelligence": ["Langchain", "LangGarph"]
    "Calculative Tools": ["Shap", "Lime"] 
    "Visualization Tools": ["Numpy", "Matplotlib"],
    "Deployment": ["FastAPI"]
}
\`\`\`
---
**8️⃣ Conway Game of Life Simulator **
*Conway's Game of Life is a cellular automaton devised by the British mathematician John Horton Conway. This project implements the simulation in Python using object-oriented programming principles and provides both visual and console-based representations of the evolving grid.*
[IMAGE:/conway.png,/conway2.png]
This simulation follows the rules of Conway's Game of Life:
1. Any live cell with 2 or 3 live neighbors survives.
2. Any dead cell with exactly 3 live neighbors becomes a live cell.
3. All other live cells die, and all other dead cells stay dead.
4. Implemented in Python using basic OOP concepts, list operations, and visualization using matplotlib.
Features:
1. Create and initialize a custom grid of any size.
2. Populate the grid with live cells at specific coordinates.
3. Step-by-step evolution of the grid.
4. Run multiple steps at once.
5. Console-based and graphical visualization of the grid.
\`\`\`python
# Source Code
GitHub - https://github.com/Abhay030405/Conway-s-Game-of-Life
# Tech Stack
technologies = {
    "Languages": ["Python"],
    "Visualization Tools": ["Numpy", "Matplotlib"],
    "Deployment": ["FastAPI"]
}
\`\`\`
*Visit my GitHub for source code and more projects!*
---
## What to learn more about me ?
**Type any of these commands:**
• \`about\` - Get a short overview about me and how I work
• \`experience\` - View my work experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`contact\` - Get in touch`,
  },
  contact: {
    title: "Contact Me",
    content: `I'd love to connect with you! 🤝
> If you’re building something interesting, researching something hard, or solving problems that actually matter — let’s talk.
---
## Get In Touch
If your idea involves building, breaking, or scaling something non-trivial — my inbox is open.
**📧 Email**
The fastest way to reach me:
\`\`\`
officialabhay030405@gamil.com
\`\`\`
>I check this regularly and respond thoughtfully.
---
## Online Presence
**🔗 Professional Networks**
\`\`\`
LinkedIn   — linkedin.com/in/abhay-agarwal-8563352b1
GitHub     — github.com/Abhay030405
\`\`\`
**💻 Competitive Programming**
\`\`\`
CodeForces — codeforces.com/profile/absolutabhay
LeetCode   — leetcode.com/u/absolutabhay
\`\`\`
**📊 Data Science**
\`\`\`
Kaggle     — kaggle.com/abhayondata
\`\`\`
---
## Let's Connect!

**💬 What I’m Open To: **
- 🤝 Meaningful collaborations
- 🔬 Research discussions and experimentation
- 🚀 Ambitious project ideas and system design talks
- 🌱 Networking, learning, and mentorship conversations

> I usually respond within 24–48 hours. If your message is thoughtful, it’ll get a thoughtful reply.
---
## What to learn more about me ?
**Type any of these commands:**
• \`about\` - Get a short overview about me and how I work
• \`experience\` - View my work experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`projects\` - Browse my projects`,
  },
};

const welcomeMessage = `Welcome to my portfolio! I'm here to help you learn more about me.

**Type any of these commands:**
• \`about\` - Learn about me
• \`experience\` - View my experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`projects\` - Browse my projects
• \`contact\` - Get in touch

Or simply click on any section in the sidebar to explore!`;

const ChatArea = ({ activeSection, onSectionChange, onAddToHistory }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "assistant", content: welcomeMessage },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to show the new message
  const scrollToMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track the last processed section to prevent duplicates
  const lastProcessedSection = useRef<string | null>(null);

  useEffect(() => {
    // Only process if it's a new section (from sidebar click) and not already processed
    if (activeSection && sectionData[activeSection] && lastProcessedSection.current !== activeSection) {
      lastProcessedSection.current = activeSection;
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: activeSection.charAt(0).toUpperCase() + activeSection.slice(1),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Scroll to the new user message
      setTimeout(() => scrollToMessage(), 100);

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: sectionData[activeSection].content,
          section: activeSection,
          images: sectionData[activeSection].images,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        // Scroll to the new assistant message
        setTimeout(() => scrollToMessage(), 100);
      }, 500);
    }
  }, [activeSection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim().toLowerCase();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    onAddToHistory(inputValue);

    // Scroll to the new user message
    setTimeout(() => scrollToMessage(), 100);

    setIsTyping(true);

    setTimeout(() => {
      let responseContent = "";
      let matchedSection = "";

      // Check for section commands
      Object.keys(sectionData).forEach((key) => {
        if (query.includes(key)) {
          responseContent = sectionData[key].content;
          matchedSection = key;
        }
      });

      if (!responseContent) {
        responseContent = `I'm not sure what you're looking for. Try these commands:
        
• \`about\` - Learn about me
• \`experience\` - View my experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`research\` - Explore my research
• \`projects\` - Browse my projects
• \`contact\` - Get in touch`;
      } else {
        // Mark this section as already processed to prevent useEffect from duplicating
        lastProcessedSection.current = matchedSection;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responseContent,
        section: matchedSection,
        images: matchedSection ? sectionData[matchedSection as keyof typeof sectionData]?.images : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      // Scroll to the new assistant message
      setTimeout(() => scrollToMessage(), 100);
    }, 600);
  };

  const handleNewChat = () => {
    setMessages([{ id: "welcome", type: "assistant", content: welcomeMessage }]);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">ChatGPT</span>
          <span className="text-muted-foreground text-sm">5.2 ▼</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            <p><b>Abhay Agarwal</b></p>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 1 && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-4">
                What can I help with?
              </h1>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1}
              />
            ))}

            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  A
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="chat-input-container">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-accent transition-colors text-muted-foreground"
              >
                <Plus className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
              <button
                type="button"
                className="p-1 rounded-full hover:bg-accent transition-colors text-muted-foreground"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-1.5 rounded-full bg-muted hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Type a command to explore my portfolio. Try "about", "skills", or "projects"!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;