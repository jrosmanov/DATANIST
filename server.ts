import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExamQuestionOption {
  id: string;
  text: string;
}

interface ExamQuestion {
  id: string;
  prompt: string;
  options: ExamQuestionOption[];
  correctOptionId: string;
}

interface ExamRecord {
  id: string;
  title: string;
  description: string;
  type: "online" | "written";
  category: "multiple-choice" | "coding" | "short-answer" | "essay";
  duration?: number;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: number;
  requirements: string[];
  instructions?: string;
  questions: ExamQuestion[];
}

interface IncomingExamQuestion {
  prompt: unknown;
  options: unknown;
  correctOptionId?: unknown;
  correctOptionIndex?: unknown;
}

type PublicExamQuestion = Omit<ExamQuestion, "correctOptionId">;
type PublicExamRecord = Omit<ExamRecord, "questions"> & { questions: PublicExamQuestion[] };


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  let users = [
    { id: "1", name: "Jalal Osmanov", email: "jalal@holberton.com", role: "student", createdAt: new Date().toISOString() },
    { id: "2", name: "Admin User", email: "admin@holberton.com", role: "admin", createdAt: new Date().toISOString() },
    { id: "3", name: "Mentor Sarah", email: "sarah@holberton.com", role: "mentor", createdAt: new Date().toISOString() },
    { id: "4", name: "SSA Mike", email: "mike@holberton.com", role: "ssa", createdAt: new Date().toISOString() },
  ];

  let cmsContent = {
    heroTitle: "Empowering the Next Generation of Software Engineers",
    heroSubtitle: "Holberton School's comprehensive platform for students, mentors, and staff.",
    primaryColor: "#e31c3d",
    showHero: true,
    showFeatures: true,
    contactEmail: "support@holbertonschool.com",
    // Student Dashboard CMS
    studentDashboardTitle: "Student Mission Control",
    studentDashboardSubtitle: "Track your curriculum progress and upcoming tasks.",
    showFoundations: true,
    showOnlineLearning: true,
    showEvents: true,
    showNotifications: true,
    // Staff/Mentor Dashboard CMS
    staffDashboardTitle: "Staff Command Center",
    staffDashboardSubtitle: "Monitor student progress and coordinate campus activities.",
    showStudentManagement: true,
    showInterviewScheduling: true,
    showExamAssessment: true,
    showCVReview: true,
    // Exams Module CMS
    showOnlineExams: true,
    showWrittenExams: true,
    showRequirements: true,
    showAIAnalysis: true,
    // Career Module CMS
    showCVUpload: true,
    showMotivationLetter: true,
    showCareerOpportunities: true,
    showCareerAI: true,
    // Leaderboard Module CMS
    showLeaderboardRankings: true,
    showStudentProgress: true,
    showCertifications: true,
    showBadges: true,
    // Events & AI Module CMS
    showEventsCalendar: true,
    showUpcomingEvents: true,
    showNotificationsCenter: true,
    showAILearningInsights: true,
    // CRM & Integrations Module CMS
    showCRMInsights: true,
    showIntegrations: true,
    showAttendanceTracking: true,
    showCommunicationLogs: true
  };

  let crmInsights = [
    { 
      id: "crm1", 
      studentId: "s1", 
      engagementScore: 92, 
      lastActive: "2026-04-08", 
      riskLevel: "low",
      communicationHistory: [
        { date: "2026-04-05", channel: "discord", summary: "Asked about C pointers in #technical-help" },
        { date: "2026-04-01", channel: "meeting", summary: "Monthly check-in with SSA" }
      ]
    }
  ];

  let integrations = [
    { id: "i1", name: "Campus Attendance (Excel)", status: "connected", lastSync: "2026-04-08 09:00", type: "attendance" },
    { id: "i2", name: "Google Forms (Surveys)", status: "connected", lastSync: "2026-04-07 15:30", type: "survey" },
    { id: "i3", name: "Discord (Mentorship)", status: "connected", lastSync: "2026-04-08 11:00", type: "communication" },
    { id: "i4", name: "External Exam Platform", status: "disconnected", type: "calendar" }
  ];

  // CRM & Integrations Endpoints
  app.get("/api/crm/insights", (req, res) => res.json(crmInsights));
  app.get("/api/integrations", (req, res) => res.json(integrations));
  app.post("/api/integrations/:id/sync", (req, res) => {
    const integration = integrations.find(i => i.id === req.params.id);
    if (integration) {
      integration.lastSync = new Date().toISOString().replace('T', ' ').substring(0, 16);
      integration.status = "connected";
      res.json(integration);
    } else {
      res.status(404).json({ error: "Integration not found" });
    }
  });

  let events = [
    { id: "e1", title: "C Programming Workshop", description: "Deep dive into pointers and memory management.", date: "2026-04-10", time: "14:00", location: "Room 101 / Zoom", type: "workshop", participants: 45 },
    { id: "e2", title: "Mock Interview Session", description: "Practice behavioral and technical interviews with mentors.", date: "2026-04-12", time: "10:00", location: "Career Center", type: "interview", participants: 12 },
    { id: "e3", title: "Python Midterm Exam", description: "Covers OOP, decorators, and generators.", date: "2026-04-15", time: "09:00", location: "Main Hall", type: "exam", participants: 120 },
    { id: "e4", title: "Networking Mixer", description: "Connect with alumni and industry partners.", date: "2026-04-20", time: "18:00", location: "Rooftop Lounge", type: "social", participants: 80 }
  ];

  let aiInsights = {
    id: "ai1",
    studentId: "s1",
    weakAreas: ["Memory Allocation", "Recursion", "Binary Trees"],
    strengths: ["Python Scripting", "React Components", "SQL Queries"],
    recommendations: [
      { title: "Valgrind Mastery", description: "Watch this tutorial on finding memory leaks.", resourceLink: "#" },
      { title: "Recursive Thinking", description: "Practice these 10 recursion problems.", resourceLink: "#" }
    ],
    studyPath: ["C - Pointers", "C - Structures", "C - Binary Trees", "C - Sorting Algorithms"]
  };

  // Events & AI Endpoints
  app.get("/api/events", (req, res) => res.json(events));
  app.get("/api/ai/insights", (req, res) => res.json(aiInsights));
  app.post("/api/events", express.json(), (req, res) => {
    const newEvent = { id: `e${events.length + 1}`, ...req.body };
    events.push(newEvent);
    res.status(201).json(newEvent);
  });

  let leaderboard = [
    { id: "s1", name: "Jalal Osmanov", points: 2450, rank: 1, cohort: "C21", trend: "stable" },
    { id: "s2", name: "Sarah Connor", points: 2380, rank: 2, cohort: "C21", trend: "up" },
    { id: "s3", name: "John Doe", points: 2100, rank: 3, cohort: "C20", trend: "down" },
    { id: "s4", name: "Elena Gilbert", points: 1950, rank: 4, cohort: "C21", trend: "up" },
    { id: "s5", name: "Stefan Salvatore", points: 1800, rank: 5, cohort: "C21", trend: "stable" }
  ];

  let badges = [
    { id: "b1", name: "C Master", icon: "Code", description: "Completed all C projects with 100%", earnedDate: "2026-01-15", isLocked: false },
    { id: "b2", name: "Shell Wizard", icon: "Terminal", description: "Advanced shell scripting mastery", earnedDate: "2026-02-10", isLocked: false },
    { id: "b3", name: "Pythonista", icon: "Snake", description: "Expert in Python OOP", isLocked: true },
    { id: "b4", name: "DevOps Hero", icon: "Cloud", description: "Mastered CI/CD pipelines", isLocked: true }
  ];

  let certifications = [
    { id: "c1", name: "Foundations of Software Engineering", status: "earned", progress: 100, issueDate: "2026-03-01" },
    { id: "c2", name: "Full-Stack Web Development", status: "pending", progress: 65 },
    { id: "c3", name: "Machine Learning Specialization", status: "locked", progress: 0 }
  ];

  // Leaderboard Endpoints
  app.get("/api/leaderboard", (req, res) => res.json(leaderboard));
  app.get("/api/badges", (req, res) => res.json(badges));
  app.get("/api/certifications", (req, res) => res.json(certifications));

  let opportunities = [
    { id: 1, title: "Junior Software Engineer", company: "Google", location: "Mountain View, CA", type: "Full-time", description: "Work on the next generation of search.", postedDate: "2026-04-01", url: "https://google.com/careers" },
    { id: 2, title: "Backend Developer", company: "Stripe", location: "Remote", type: "Full-time", description: "Help build the economic infrastructure of the internet.", postedDate: "2026-04-03", url: "https://stripe.com/jobs" },
    { id: 3, title: "Frontend Intern", company: "Vercel", location: "San Francisco, CA", type: "Internship", description: "Join the team building the frontend cloud.", postedDate: "2026-04-05", url: "https://vercel.com/careers" }
  ];

  let studentFiles = [
    { id: 1, studentId: 1, type: "cv", fileName: "John_Doe_CV.pdf", status: "reviewed", uploadDate: "2026-03-15", feedback: "Great structure, but add more detail to your projects section." },
    { id: 2, studentId: 1, type: "motivation_letter", fileName: "John_Doe_ML_Google.pdf", status: "pending", uploadDate: "2026-04-01" }
  ];

  // Career Endpoints
  app.get("/api/career/opportunities", (req, res) => res.json(opportunities));
  app.get("/api/career/files", (req, res) => res.json(studentFiles));
  app.post("/api/career/files", express.json(), (req, res) => {
    const newFile = { id: studentFiles.length + 1, ...req.body, uploadDate: new Date().toISOString().split('T')[0], status: "pending" };
    studentFiles.push(newFile);
    res.status(201).json(newFile);
  });

  let students = [
    { id: "s1", name: "Jalal Osmanov", email: "jalal@holberton.com", progress: 85, attendance: 98, status: "Active", cohort: "C21" },
    { id: "s2", name: "Alice Smith", email: "alice@holberton.com", progress: 45, attendance: 70, status: "At Risk", cohort: "C21" },
    { id: "s3", name: "Bob Johnson", email: "bob@holberton.com", progress: 92, attendance: 100, status: "Active", cohort: "C22" },
    { id: "s4", name: "Charlie Brown", email: "charlie@holberton.com", progress: 78, attendance: 85, status: "Active", cohort: "C21" },
  ];

  let notifications = [
    { id: "1", title: "New Project Released", message: "Binary Trees in C is now available in your curriculum.", type: "info", createdAt: new Date().toISOString(), read: false },
    { id: "2", title: "Campus Event", message: "IDDA Tech Meetup starts in 2 hours.", type: "success", createdAt: new Date().toISOString(), read: false },
    { id: "3", title: "Exam Reminder", message: "C Programming Exam is scheduled for tomorrow.", type: "warning", createdAt: new Date().toISOString(), read: false },
  ];

  let interviewSlots = [
    { id: "slot1", mentorId: "3", mentorName: "Mentor Sarah", startTime: "2026-04-10T10:00:00Z", endTime: "2026-04-10T11:00:00Z", status: "available", type: "Technical" },
    { id: "slot2", mentorId: "3", mentorName: "Mentor Sarah", startTime: "2026-04-10T14:00:00Z", endTime: "2026-04-10T15:00:00Z", status: "available", type: "Technical" },
    { id: "slot3", mentorId: "4", mentorName: "SSA Mike", startTime: "2026-04-11T09:00:00Z", endTime: "2026-04-11T10:00:00Z", status: "available", type: "SSA Check-in" },
    { id: "slot4", mentorId: "3", mentorName: "Mentor Sarah", startTime: "2026-04-12T11:00:00Z", endTime: "2026-04-12T12:00:00Z", status: "booked", studentId: "1", studentName: "Jalal Osmanov", type: "Behavioral" },
  ];

  let requirements = [
    { 
      id: "req1", 
      title: "C Programming Fundamentals", 
      description: "Master pointers, memory allocation, and data structures in C.",
      resources: [
        { title: "Pointers in C", url: "https://example.com/pointers" },
        { title: "Dynamic Memory", url: "https://example.com/malloc" }
      ]
    },
    { 
      id: "req2", 
      title: "Python Basics", 
      description: "Understand loops, functions, and object-oriented programming in Python.",
      resources: [
        { title: "Python OOP", url: "https://example.com/python-oop" }
      ]
    }
  ];

  let exams: ExamRecord[] = [
    { 
      id: "ex1", 
      title: "C Programming Midterm", 
      description: "Comprehensive test on C fundamentals.",
      type: "online",
      category: "coding",
      duration: 120,
      dueDate: "2026-04-15T23:59:59Z",
      status: "pending",
      requirements: ["req1"],
      instructions: "Complete all 5 coding challenges. You have 2 hours.",
      questions: [
        {
          id: "ex1-q1",
          prompt: "Which function allocates memory dynamically in C?",
          options: [
            { id: "ex1-q1-a1", text: "printf" },
            { id: "ex1-q1-a2", text: "malloc" },
            { id: "ex1-q1-a3", text: "fopen" },
            { id: "ex1-q1-a4", text: "strlen" }
          ],
          correctOptionId: "ex1-q1-a2"
        }
      ]
    },
    { 
      id: "ex2", 
      title: "Python Final Project", 
      description: "Build a CLI application using Python.",
      type: "written",
      category: "essay",
      dueDate: "2026-04-20T23:59:59Z",
      status: "pending",
      requirements: ["req2"],
      instructions: "Submit your GitHub repository link and a 500-word motivation letter.",
      questions: [
        {
          id: "ex2-q1",
          prompt: "What is the main purpose of a Python class?",
          options: [
            { id: "ex2-q1-a1", text: "To define a reusable object blueprint" },
            { id: "ex2-q1-a2", text: "To import libraries" },
            { id: "ex2-q1-a3", text: "To install dependencies" },
            { id: "ex2-q1-a4", text: "To open files" }
          ],
          correctOptionId: "ex2-q1-a1"
        }
      ]
    }
  ];

  const stripExamAnswers = (exam: ExamRecord): PublicExamRecord => ({
    ...exam,
    questions: exam.questions.map(question => {
      const { correctOptionId, ...strippedQuestion } = question;
      return strippedQuestion;
    })
  });

  const normalizeExamPayload = (payload: any): Omit<ExamRecord, "id" | "status"> | null => {
    if (!payload || typeof payload !== "object") return null;

    if (typeof payload.title !== "string" || payload.title.trim().length === 0) return null;
    if (typeof payload.description !== "string" || payload.description.trim().length === 0) return null;
    if (payload.type !== "online" && payload.type !== "written") return null;
    if (!["multiple-choice", "coding", "short-answer", "essay"].includes(payload.category)) return null;
    if (typeof payload.dueDate !== "string" || Number.isNaN(new Date(payload.dueDate).getTime())) return null;
    if (!Array.isArray(payload.requirements) || payload.requirements.length === 0) return null;
    if (!Array.isArray(payload.questions) || payload.questions.length === 0) return null;

    const requirements = payload.requirements
      .filter((requirement: unknown): requirement is string => typeof requirement === "string")
      .map(requirement => requirement.trim())
      .filter(requirement => requirement.length > 0);
    if (requirements.length === 0) return null;

    const normalizedQuestions: ExamQuestion[] = [];

    for (const rawQuestion of payload.questions as IncomingExamQuestion[]) {
      if (!rawQuestion || typeof rawQuestion !== "object") return null;
      if (typeof rawQuestion.prompt !== "string" || rawQuestion.prompt.trim().length === 0) return null;
      if (!Array.isArray(rawQuestion.options) || rawQuestion.options.length < 2) return null;

      const optionItems = rawQuestion.options
        .map((option: unknown) => {
          if (typeof option === "string") {
            return { id: undefined, text: option.trim() };
          }
          if (option && typeof option === "object" && typeof (option as { text?: unknown }).text === "string") {
            const optionRecord = option as { id?: unknown; text: string };
            return {
              id: typeof optionRecord.id === "string" ? optionRecord.id : undefined,
              text: optionRecord.text.trim()
            };
          }
          return null;
        })
        .filter((option): option is { id: string | undefined; text: string } => !!option && option.text.length > 0);

      if (optionItems.length < 2) return null;

      let correctOptionIndex = -1;
      if (typeof rawQuestion.correctOptionIndex === "number" && Number.isInteger(rawQuestion.correctOptionIndex)) {
        correctOptionIndex = rawQuestion.correctOptionIndex;
      } else if (typeof rawQuestion.correctOptionId === "string") {
        correctOptionIndex = optionItems.findIndex(option => option.id === rawQuestion.correctOptionId);
      }

      if (correctOptionIndex < 0 || correctOptionIndex >= optionItems.length) return null;

      const questionId = `q-${randomUUID()}`;
      const options = optionItems.map((option, index) => ({
        id: `o-${questionId}-${index}`,
        text: option.text
      }));

      normalizedQuestions.push({
        id: questionId,
        prompt: rawQuestion.prompt.trim(),
        options,
        correctOptionId: options[correctOptionIndex].id
      });
    }

    const parsedDuration = typeof payload.duration === "number" ? payload.duration : Number(payload.duration);
    const normalizedDuration = Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : undefined;
    const instructions =
      typeof payload.instructions === "string" && payload.instructions.trim().length > 0
        ? payload.instructions.trim()
        : undefined;

    return {
      title: payload.title.trim(),
      description: payload.description.trim(),
      type: payload.type,
      category: payload.category,
      duration: normalizedDuration,
      dueDate: new Date(payload.dueDate).toISOString(),
      requirements,
      instructions,
      questions: normalizedQuestions
    };
  };


  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, role } = req.body;
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials or role" });
    }
  });

  // Scheduling API
  app.get("/api/scheduling/slots", (req, res) => {
    res.json(interviewSlots);
  });

  app.post("/api/scheduling/slots", (req, res) => {
    const newSlot = { 
      ...req.body, 
      id: Math.random().toString(36).substr(2, 9),
      status: "available"
    };
    interviewSlots.push(newSlot);
    res.json(newSlot);
  });

  app.post("/api/scheduling/book", (req, res) => {
    const { slotId, studentId, studentName } = req.body;
    const slot = interviewSlots.find(s => s.id === slotId);
    if (slot && slot.status === "available") {
      slot.status = "booked";
      slot.studentId = studentId;
      slot.studentName = studentName;
      res.json({ success: true, slot });
    } else {
      res.status(400).json({ success: false, message: "Slot not available" });
    }
  });

  app.delete("/api/scheduling/slots/:id", (req, res) => {
    interviewSlots = interviewSlots.filter(s => s.id !== req.params.id);
    res.json({ success: true });
  });

  // Exams API
  app.get("/api/exams", (req, res) => {
    res.json(exams.map(stripExamAnswers));
  });

  app.post("/api/mentor/exams", (req, res) => {
    const normalizedExam = normalizeExamPayload(req.body);
    if (!normalizedExam) {
      res.status(400).json({ error: "Invalid exam payload. Include exam details and at least one question with valid options and answer." });
      return;
    }

    const newExam: ExamRecord = { ...normalizedExam, id: randomUUID(), status: "pending" };
    exams.push(newExam);
    res.json(newExam);
  });

  app.get("/api/mentor/exams", (req, res) => {
    res.json(exams);
  });


  app.get("/api/requirements", (req, res) => {
    res.json(requirements);
  });

  app.post("/api/requirements", (req, res) => {
    const newReq = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    requirements.push(newReq);
    res.json(newReq);
  });

  // Notifications API
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  app.post("/api/notifications/:id/read", (req, res) => {
    const notification = notifications.find(n => n.id === req.params.id);
    if (notification) {
      notification.read = true;
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });

  // User Management API
  app.get("/api/admin/users", (req, res) => {
    res.json(users);
  });

  app.get("/api/students", (req, res) => {
    res.json(students);
  });

  app.post("/api/admin/users", (req, res) => {
    const newUser = { ...req.body, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    users.push(newUser);
    res.json(newUser);
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    users = users.filter(u => u.id !== req.params.id);
    res.json({ success: true });
  });

  // CMS API
  app.get("/api/cms/content", (req, res) => {
    res.json(cmsContent);
  });

  app.post("/api/cms/content", (req, res) => {
    cmsContent = { ...cmsContent, ...req.body };
    res.json(cmsContent);
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Holberton Platform API is running" });
  });

  

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Holberton Platform running at http://localhost:${PORT}`);
  });
}

startServer();
