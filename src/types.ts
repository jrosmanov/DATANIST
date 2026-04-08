export type UserRole = "student" | "mentor" | "ssa" | "staff" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  showHero: boolean;
  showFeatures: boolean;
  contactEmail: string;
  // Student Dashboard CMS
  studentDashboardTitle: string;
  studentDashboardSubtitle: string;
  showFoundations: boolean;
  showOnlineLearning: boolean;
  showEvents: boolean;
  showNotifications: boolean;
  // Staff/Mentor Dashboard CMS
  staffDashboardTitle: string;
  staffDashboardSubtitle: string;
  showStudentManagement: boolean;
  showInterviewScheduling: boolean;
  showExamAssessment: boolean;
  showCVReview: boolean;
  // Exams Module CMS
  showOnlineExams: boolean;
  showWrittenExams: boolean;
  showRequirements: boolean;
  showAIAnalysis: boolean;
  // Career Module CMS
  showCVUpload: boolean;
  showMotivationLetter: boolean;
  showCareerOpportunities: boolean;
  showCareerAI: boolean;
  // Leaderboard Module CMS
  showLeaderboardRankings: boolean;
  showStudentProgress: boolean;
  showCertifications: boolean;
  showBadges: boolean;
  // Events & AI Module CMS
  showEventsCalendar: boolean;
  showUpcomingEvents: boolean;
  showNotificationsCenter: boolean;
  showAILearningInsights: boolean;
  // CRM & Integrations Module CMS
  showCRMInsights: boolean;
  showIntegrations: boolean;
  showAttendanceTracking: boolean;
  showCommunicationLogs: boolean;
}

export interface CRMInsight {
  id: string;
  studentId: string;
  engagementScore: number;
  lastActive: string;
  riskLevel: "low" | "medium" | "high";
  communicationHistory: {
    date: string;
    channel: "discord" | "email" | "meeting";
    summary: string;
  }[];
}

export interface Integration {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  type: "attendance" | "survey" | "communication" | "calendar";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "interview" | "exam" | "social";
  participants: number;
}

export interface AILearningInsight {
  id: string;
  studentId: string;
  weakAreas: string[];
  strengths: string[];
  recommendations: {
    title: string;
    description: string;
    resourceLink: string;
  }[];
  studyPath: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  cohort: string;
  trend: "up" | "down" | "stable";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate?: string;
  isLocked: boolean;
}

export interface Certification {
  id: string;
  name: string;
  status: "earned" | "pending" | "locked";
  progress: number;
  issueDate?: string;
}

export interface CareerOpportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: string;
  url: string;
}

export interface StudentFile {
  id: number;
  studentId: number;
  type: "cv" | "motivation_letter";
  fileName: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  uploadDate: string;
  feedback?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  createdAt: string;
  read: boolean;
}

export interface InterviewSlot {
  id: string;
  mentorId: string;
  mentorName: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked";
  studentId?: string;
  studentName?: string;
  type: "Technical" | "Behavioral" | "Career" | "SSA Check-in";
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: "online" | "written";
  category: "multiple-choice" | "coding" | "short-answer" | "essay";
  duration?: number; // in minutes
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: number;
  requirements: string[]; // IDs of requirements
  instructions?: string;
  questions?: ExamQuestion[];
}

export interface ExamQuestionOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: ExamQuestionOption[];
  correctOptionId?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  resources: { title: string; url: string }[];
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
}
