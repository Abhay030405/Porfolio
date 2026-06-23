import { useState, useRef, useEffect } from "react";
import { ArrowUp, User, Code, Briefcase, Trophy, FileText, FolderKanban, Mail } from "lucide-react";
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
    content: `I’ll tell you exactly who I am. No fluff — just the real picture.
---
## 👨‍💻 Hello World — I’m Abhay Agarwal
[IMAGE:/206020807.jpg,/image.png]
I’m a **second-year Electrical Engineering undergrad at MNNIT Allahabad** who builds production AI systems — not after graduation, right now.

While most people my age are still figuring out what to build, I’ve already shipped:
- A **10-tool HR AI Copilot** processing real hiring pipelines at EmployLab.ai
- A **voice AI companion (Zia)** with episodic memory, relationship stage tracking, and language calibration — serving 500+ candidates
- A **multi-agent autonomous debugging system** that pushed automated fix rates from 38% to 65%
- A **hybrid RAG academic assistant** hitting 89% top-3 accuracy across 300+ exam questions
- A **landslide detection pipeline** achieving 87% mIoU on 8,500+ satellite images

I don’t demo things. I ship them, measure them, and push the metrics until they prove the system actually works.

> Codeforces Specialist (peak rating 1444). 500+ problems solved. 2 internships before year 2. That’s the baseline I hold myself to.
---
## 🎓 Education — Electrical Engineer by degree. AI Engineer by execution.
** 1️⃣ Motilal Nehru National Institute of Technology Allahabad**
*B.Tech, Electrical Engineering | 2024 – 2028 | CPI: 7.65*
[IMAGE:/gis.png,/mnnit.jpg]
My degree is in core engineering — signals, circuits, mathematics, systems theory. I use every bit of it. The mathematical rigor from EE shapes how I think about AI: why a retrieval pipeline degrades under distribution shift, why a multi-agent system deadlocks under contention, why attention mechanisms break down at long context. I don’t treat ML as a plug-and-play toolkit. I understand the architecture underneath it.

** 2️⃣ Mahatma Hansraj Modern School, Jhansi — Uttar Pradesh**
*Higher Secondary (CBSE) | 2021 – 2023 | 82.33%*
[IMAGE:/mhms2.jpg,/mhms.jpg]
Where I built the fundamentals — physics, mathematics, logical reasoning — and realized the most interesting problems always sit at the boundary between disciplines.

** 3️⃣ Rani Laxmibai Public School, Jhansi — Uttar Pradesh**
*Secondary (CBSE) | 2021 | 93.2%*
[IMAGE:/rlps.jpeg,/rlps2.jpg]
Early foundation. Strong academics. The beginning of a genuine curiosity about how systems actually work under the hood.
---
## ⚡ What I Actually Build
**🤖 Production LLM & Agentic Systems**
Not API wrappers. Full-stack AI pipelines — retrieval, reasoning, memory, evaluation, deployment — designed to hold up under real load and edge cases.
- **Multi-agent orchestration** — LangGraph workflows, tool-calling agents, reflection loops, sandboxed execution, self-correction architectures
- **Advanced RAG** — hybrid retrieval (vector + BM25 + graph), reranking pipelines, Self-RAG with adaptive retrieval, RAGAS evaluation
- **LLM system design** — context window management, KV-cache optimization, prompt engineering at production scale, latency budgeting
- **Memory & personalization** — pgvector episodic stores, semantic retrieval with door-rule enforcement, behavioral signal extraction

> I don’t build things that look impressive in demos. I build things that hold up under production constraints, real users, and failure modes nobody anticipated.
---
**🌍 Computer Vision & Remote Sensing**
Deep learning applied to real-world perception — satellite imagery, disaster monitoring, geospatial analysis. Not toy datasets.
- Semantic segmentation (U-Net, Mask R-CNN) on multi-spectral satellite data
- Transfer learning with COCO-pretrained ResNet-101 + SAM for geospatial fine-tuning
- Explainable AI (Grad-CAM, SHAP) so domain experts can actually validate model decisions
- Multi-spectral band analysis, histogram equalization, edge detection on remote sensing imagery
---
**🌐 Full-Stack Engineering**
I build the interfaces and backends my AI systems need — not because I have to, but because I refuse to hand off architecture decisions to someone else.
- **Frontend:** React, TypeScript, Tailwind CSS — clean, fast, functional
- **Backend:** FastAPI, Node.js, GoLang — structured APIs, not spaghetti
- **Databases:** PostgreSQL, MongoDB, Redis, ChromaDB, Qdrant, pgvector — right tool for the problem
---
## 🔥 What Makes Me Different
Most people at my stage are building tutorials and cloning projects.
I’m building systems that solve non-trivial problems — deployed, measured, and continuously improved.

The combination that’s genuinely rare:
- **Deep enough in AI/ML** to design architectures from scratch, not just call APIs
- **Strong enough in engineering** to ship full production backends and frontends
- **Sharp enough in algorithms** to solve hard problems under time pressure (Codeforces Specialist)
- **Research-trained** to think rigorously about *why* something fails, not just *when* it fails

I’m 20 years old. I’m a second-year undergrad.
And I’m already building at production scale — for real clients, on real systems, with real metrics.

> That’s not a flex. That’s just the standard I decided to hold myself to.
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
I don’t chase job titles or pad my resume with buzzwords.
Every role I’ve taken has one thing in common — I shipped something real.
Production systems. Research pipelines. AI agents running at scale.
Not demos. Not POCs. Things that actually worked under pressure.
> If it didn’t solve a hard problem or make something meaningfully better — it didn’t make the cut.
---
**🤖 Software Development Intern**
April 2026 - June 2026 | EmployLab.ai | Remote
[IMAGE:/employlabs.png,/employlabs1.png]
- Engineered a production HR AI Copilot orchestrating 10 natural-language-driven tools (candidate moves, rejections, comparisons, interview scheduling, transcript analysis, pipeline overview) with a single Claude API call per conversation — all subsequent turns fully deterministic — eliminating per-turn LLM cost while reducing recruiter pipeline operations from multi-step dashboard clicks to free-form English commands.
- Architected stateless multi-turn HR conversation flows using conversation history as the sole state store (zero sessions, zero Redis, zero DB polling), designing 3-turn reason-capture flows backed by a live tag-bank that auto-generated audit-ready structured notes on every candidate action — reducing HR documentation overhead to zero additional manual effort per action.
- Built Zia's complete Ring 2 Candidate Context Layer — an 8-component personalization pipeline spanning episodic memory store, semantic retriever, relationship stage tracker, language calibrator, objectives tracker, compaction engine, mixing board, and context assembler — delivering a dynamically assembled ~2,500 token candidate context per LLM call in under 300ms, enabling Zia to treat 500+ candidates uniquely across sessions.
- Implemented a PostgreSQL + pgvector episodic memory system with a 5-stage multi-filter retrieval pipeline (cosine similarity → recency boost → importance filter → door rule enforcement → diversity filter) achieving semantic memory retrieval in under 150ms — the conservative door rule enforcer eliminated intrusive memory surfaces entirely, achieving zero violations across 20+ eval scenarios and ≥ 4.0/5.0 personalization quality scores.
- Engineered a 4-level Hinglish/formality language calibration system and conversation compaction engine that kept 30+ turn voice conversations within 11,000 total tokens at 90% KV-cache hit rate — sustaining end-to-end voice response latency under 2 seconds and powering a 5-stage relationship arc (Stranger → Life Companion) with ≥ 80% blind rater accuracy for stage-distinct behavior.
- Tech Stack: Python, FastAPI, Claude API (Anthropic), PostgreSQL, pgvector, Redis, SQLAlchemy, Pydantic
---
**💻 Software Development Intern**
February 2026 - March 2026 | Digiworldlink Pvt. Ltd. | Remote
[IMAGE:/digiworld.png,/digiworld2.png]
- Architected and deployed a production-grade LLM workflow automation system processing 10,000+ freelancer bids daily, reducing client evaluation time by 73% and accelerating project matching by 2.4x across 500+ active listings.
- Engineered a hybrid semantic retrieval pipeline combining dense embeddings and keyword search, achieving 1.8s P95 latency at scale while maintaining 91% ranking relevance for profile-to-project matching.
- Improved bid evaluation accuracy from 64% to 91% through prompt engineering and RAG-based context injection, increasing client satisfaction and reducing manual review overhead by 8 hours/day.
- Optimized retrieval quality with 82% context precision and 86% context recall, ensuring zero qualified bids missed while filtering 94% of irrelevant matches through multi-stage reranking.
- Tech Stack: Python, LangChain, LangGraph, Gemini API, FastAPI, vector embeddings, RAG architecture
---
**⚙️ Competitive Programming — Algorithms & DSA**
*2+ years of consistent practice*
[IMAGE:/codeforces.png,/leetcode.png]

Competitive programming is where I built my core problem-solving muscle.:

- Active on platforms like Codeforces and LeetCode
- Solved **500+ algorithmic problems**
- Strong command over data structures, algorithms, and complexity analysis
- Ranked as Specialist on Codeforces with a peak rating of 1444
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
## 4️⃣ Competitive Programming — Codeforces Rating 1444 (Specialist)
*500+ problems solved across competitive programming platforms*
[IMAGE:/codeforces.png,/leetcode.png]
***Problem: ***
• Software engineering and ML roles require strong algorithmic thinking, optimization skills, and the ability to solve unfamiliar problems under strict time constraints.
***Solution: ***
• Through consistent contest participation and practice, I solved hundreds of problems involving data structures, graphs, dynamic programming, and greedy strategies, reaching a peak Codeforces rating of 1444 (Specialist). This strengthened my speed, logical reasoning, and ability to design efficient solutions under pressure.
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
### 1️⃣ AI-Driven Multi-Agent Platform for Campaign Planning & Optimization
November 2025 -- February 2026
> Built an end-to-end autonomous marketing platform orchestrating 5 specialized agents (strategist, content creator, scheduler, analyst, optimizer) using LangGraph cyclic workflows for campaign lifecycle management.
[IMAGE:/commandnest.png,/commandnest2.jpg]
- Architected dynamic tool-calling that enabled autonomous discovery and execution of 12+ marketing APIs.
- Automated campaign creation, A/B test setup, performance tracking, and budget reallocation with zero manual intervention.
- Developed a human-in-the-loop approval system with real-time analytics for CTR, conversion, and ROAS.
- Reduced approval latency from 6 hours to 12 minutes while preserving strategic oversight.
- Integrated closed-loop optimization where analyst agents trigger automatic strategy adjustments, improving average campaign ROI by 34% in simulations.
\`\`\`python
# Link
Project - Link
# Tech Stack
technologies = {
  "Languages": ["Python"],
  "LLM": ["OpenAI GPT-4 + function calling"],
  "Agent Framework": ["LangChain", "LangGraph"],
  "Backend": ["FastAPI"],
  "Database": ["MongoDB"],
  "Vector Store": ["Pinecone"]
}
\`\`\`
---
### 2️⃣ RoadSage: Intelligent Campus Road Perception for Navigation, Safety, and Infrastructure Assessment
May 2026 -- Present (Ongoing)
> Built a production-grade, end-to-end autonomous driving decision engine for MNNIT campus roads — ingesting raw, unlabeled road images and outputting FORWARD/LEFT/RIGHT/STOP commands with per-decision confidence scores, lane geometry, GradCAM explainability maps, and real-time obstacle awareness — all without a single manually labeled training image.
[IMAGE:/geosheild.png,/geosheild2.jpg]
- Engineered a self-supervised pseudo-labeling pipeline using a 3-model committee disagreement filter (query-by-committee) to generate training labels on 500+ unlabeled MNNIT campus road images — eliminating single-model overconfidence failures on out-of-distribution data and achieving 85% pseudo-label coverage after 2 self-training iterations, without a single manually labeled image.
- Built a full lane detection stack using UltraFast Lane Detection v2 (UFLDv2-ResNet18/50) with Bird's Eye View IPM transform and 2nd-degree polynomial fitting — computing metric lateral offset and road curvature from a single forward-facing image, achieving lane detection F1 > 0.85 and row-anchor accuracy > 94% on a manually annotated held-out test set.
- Designed a hybrid decision engine combining geometric rule-based lane analysis (offset/curvature thresholds) with a MobileNetV3-Small ML fallback trained exclusively on 200 human-labeled hard frames (heavy shadow, missing markings, junctions) — achieving 88% overall command accuracy and >99% STOP precision; hard-frame-only training closed a critical training-deployment distribution mismatch that soft pseudo-labels could not fix.
- Applied post-hoc temperature scaling to calibrate model confidence scores, reducing Expected Calibration Error from 0.14 to 0.03, and deployed a Kalman filter temporal buffer over lane offset, curvature, and obstacle depth state — cutting spurious command flips from 8–15 per 100 frames down to 1–3 while maintaining real-time STOP response within 200ms of hazard appearance.
- Replaced invalid MiDaS metric distance thresholds with per-frame depth percentile thresholds and scale recovery from known reference objects (standard vehicle/pedestrian dimensions) — fixing a fundamental monocular depth estimation error and achieving STOP precision > 99% with false STOP rate < 5% on campus obstacle test scenarios.
- Integrated YOLOv8n obstacle detection + MiDaS depth fusion, GradCAM explainability overlays on UFLDv2 backbone activations, and a 7-component React dashboard with WebSocket streaming at 15 FPS — plus full ONNX export for all four models enabling sub-100ms P95 end-to-end inference on CPU hardware with no GPU dependency.
\`\`\`python
# Tech Stack
technologies = {
  "Languages": ["Python", "TypeScript"],
  "CV / Perception": ["UFLDv2 (ResNet18/50)", "YOLOv8n", "NanoDet-Plus-M", "MiDaS", "OpenCV"],
  "ML": ["PyTorch", "albumentations", "MobileNetV3", "EfficientNet-Lite0"],
  "Decision & Safety": ["Kalman Filter", "MC Dropout", "Temperature Scaling", "GradCAM"],
  "Backend": ["FastAPI", "WebSocket", "Uvicorn"],
  "Frontend": ["React", "TailwindCSS", "Recharts"],
  "Infra": ["Docker", "ONNX Runtime", "Prometheus", "Grafana", "MLflow"]
}
\`\`\`
---
### 3️⃣ Command Nest -> AI Command Hub for Intelligence Operations
October 2025 -- November 2025
> SentinelOps Nexus is an enterprise-grade intelligence operations management platform built to orchestrate complex, high-stakes workflows with precision and security. It unifies mission planning, AI-powered document intelligence, and knowledge management into a single operational command layer.
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
### 4️⃣ GeoSheild -> Proof that deep learning, when aimed right, can see disasters before humans do.
September 2025 -- October 2025
> Built an AI system that hunts landslides from the sky using UAV and Remote Sensing imagery and deep learning.
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
### 5️⃣ Nueral Watch - Drift AI Assistant
> Neural Watch is an AI-powered data drift monitoring system designed to ensure the reliability and performance of machine learning models in production. It combines statistical methods and machine learning techniques to detect shifts in data distributions that can impact model accuracy.
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
### 6️⃣ FairLensAI - Bias Detection
> FairLens AI is an end-to-end system designed to explain machine learning model predictions and detect bias across user demographics.
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
### 7️⃣ Conway Game of Life Simulator
> Conway's Game of Life is a cellular automaton devised by the British mathematician John Horton Conway. This project implements the simulation in Python using object-oriented programming principles and provides both visual and console-based representations of the evolving grid.
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

const stripNavFooter = (content: string) => {
  const idx = content.indexOf('\n---\n## What to learn more about me ?');
  return idx !== -1 ? content.slice(0, idx) : content;
};

const ChatArea = ({ activeSection, onSectionChange, onAddToHistory }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "assistant", content: welcomeMessage },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Typewriter for welcome screen
  const twItems = ["About Me", "Experience", "Skills", "Projects", "Achievements", "Research", "Contact Me"];
  const [twText, setTwText]         = useState("");
  const [twIndex, setTwIndex]       = useState(0);
  const [twDeleting, setTwDeleting] = useState(false);

  useEffect(() => {
    const current = twItems[twIndex];
    if (!twDeleting && twText === current) {
      const t = setTimeout(() => setTwDeleting(true), 1400);
      return () => clearTimeout(t);
    }
    const delay = twDeleting ? 45 : 95;
    const t = setTimeout(() => {
      if (twDeleting) {
        setTwText(prev => prev.slice(0, -1));
        if (twText.length <= 1) { setTwDeleting(false); setTwIndex(p => (p + 1) % twItems.length); }
      } else {
        setTwText(current.slice(0, twText.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [twText, twDeleting, twIndex]);

  // Scroll to the start of the latest message
  const scrollToMessage = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          content: stripNavFooter(sectionData[activeSection].content),
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
          responseContent = stripNavFooter(sectionData[key].content);
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
    <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-x-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between pl-12 md:pl-4 pr-4 py-3 border-b border-border flex-shrink-0">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-foreground font-medium">ChatGPT</span>
          <span className="text-muted-foreground text-sm">5.2 ▼</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            <p><b>Abhay Agarwal</b></p>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">

        {/* Mobile welcome — tech enthusiast edition */}
        {messages.length === 1 && (
          <div className="md:hidden flex flex-col items-center justify-center min-h-full px-5 py-8 gap-7 relative overflow-hidden">

            {/* Subtle dot-grid background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* ── AVATAR ── */}
            <div className="relative flex items-center justify-center animate-float z-10">
              {/* Avatar photo */}
              <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10">
                <img
                  src="/206020807.jpg"
                  alt="Abhay Agarwal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ── TEXT BLOCK ── */}
            <div className="flex flex-col items-center gap-3 text-center z-10">

              {/* Status badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-semibold text-white/60 tracking-[0.15em] uppercase">Open to Opportunities</span>
              </div>

              {/* Name */}
              <h1 className="text-[2rem] font-black tracking-tight leading-none text-white">
                ABHAY AGARWAL
              </h1>

              {/* Monospace role line */}
              <p className="font-mono text-[11px] text-white/40 tracking-widest">
                {"< AI Engineer · Competitive Coder />"}
              </p>

              {/* Typewriter terminal prompt */}
              <div className="flex items-center gap-1.5 font-mono text-[13px] text-white/40 mt-1">
                <span className="text-white/70">▶</span>
                <span className="text-white/40">explore:</span>
                <span className="text-white/80">{twText}</span>
                <span className="text-white/70 animate-blink-cursor">█</span>
              </div>
            </div>


            {/* ── SUGGESTION CHIPS ── */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs z-10">
              {[
                { label: "About Me",     icon: User,         section: "about"        },
                { label: "Skills",       icon: Code,         section: "skills"       },
                { label: "Experience",   icon: Briefcase,    section: "experience"   },
                { label: "Projects",     icon: FolderKanban, section: "projects"     },
                { label: "Achievements", icon: Trophy,       section: "achievements" },
                { label: "Research",     icon: FileText,     section: "research"     },
                { label: "Contact",      icon: Mail,         section: "contact"      },
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => onSectionChange(item.section)}
                  className="group flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200 text-sm text-left col-span-1 last:col-span-2 last:justify-center"
                >
                  <item.icon className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
                  <span className="font-medium text-white/50 group-hover:text-white/90 transition-colors">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop layout + mobile conversation view */}
        <div className={`max-w-3xl mx-auto px-3 md:px-4 py-4 md:py-8 ${messages.length === 1 ? "hidden md:block" : "block"}`}>
          {messages.length === 1 && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-4">
                What can I help with?
              </h1>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div key={message.id} ref={isLast ? latestMessageRef : undefined} className={message.id === "welcome" ? "hidden md:block" : ""}>
                  <ChatMessage
                    message={message}
                    isLatest={isLast}
                    onSectionChange={isLast && message.type === "assistant" && messages.length > 1 ? onSectionChange : undefined}
                  />
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start">
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
      <div className="px-3 md:px-4 pb-4 md:pb-6 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="chat-input-container">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-1.5 rounded-full bg-muted hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border-2 border-muted-foreground/40"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </form>
          <p className="hidden md:block text-xs text-center text-muted-foreground mt-3">
            Type a command to explore my portfolio. Try "about", "skills", or "projects"!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;