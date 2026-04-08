import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  BookOpen, 
  Brain, 
  ChevronRight, 
  ExternalLink,
  Search,
  Filter,
  Bell,
  Info,
  Sparkles,
  Award
} from "lucide-react";
import { Exam as ExamType, Requirement, CMSContent } from "../types";
import { cn } from "../lib/utils";

export default function Exam() {
  const [exams, setExams] = useState<ExamType[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"online" | "written" | "requirements" | "ai">("online");
  const [activeExam, setActiveExam] = useState<ExamType | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [examActionMessage, setExamActionMessage] = useState<string>("");
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/exams").then(res => res.json()),
      fetch("/api/requirements").then(res => res.json()),
      fetch("/api/cms/content").then(res => res.json())
    ]).then(([examsData, reqsData, cmsData]) => {
      setExams(examsData);
      setRequirements(reqsData);
      setCms(cmsData);
      setLoading(false);
    });
  }, []);

  if (loading || !cms) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "online", label: "Online Exams", icon: Play, show: cms.showOnlineExams },
    { id: "written", label: "Written Exams", icon: FileText, show: cms.showWrittenExams },
    { id: "requirements", label: "Requirements", icon: BookOpen, show: cms.showRequirements },
    { id: "notifications", label: "Notifications", icon: Bell, show: true },
    { id: "ai", label: "AI Analysis", icon: Brain, show: cms.showAIAnalysis },
  ].filter(t => t.show);

  const filteredExams = exams.filter(e => e.type === activeTab);
  const pendingExamCount = exams.filter(exam => exam.status === "pending").length;

  const refreshExams = () => {
    fetch("/api/exams")
      .then(res => res.json())
      .then(examsData => setExams(examsData));
  };

  const handleStartExam = (exam: ExamType) => {
    if (!exam.questions || exam.questions.length === 0) {
      setExamActionMessage("This exam is not publish-ready yet because no questions were provided. Please contact your mentor.");
      return;
    }
    setExamActionMessage("");
    setSelectedAnswers({});
    setActiveExam(exam);
  };

  const handleSubmitExam = async () => {
    if (!activeExam) return;

    setIsSubmittingExam(true);
    setExamActionMessage("");
    const response = await fetch(`/api/exams/${activeExam.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: selectedAnswers })
    });

    const payload = await response.json().catch(() => ({}));
    setIsSubmittingExam(false);

    if (!response.ok) {
      setExamActionMessage(payload.error || "Failed to submit exam.");
      return;
    }

    if (payload.result?.score !== undefined) {
      setExamActionMessage(`Exam submitted. You scored ${payload.result.score}% (${payload.result.correctAnswers}/${payload.result.totalQuestions}).`);
    } else {
      setExamActionMessage(payload.result?.message || "Exam submitted successfully.");
    }

    setActiveExam(null);
    setSelectedAnswers({});
    refreshExams();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Exams & Requirements</h1>
          <p className="text-slate-500 mt-1">Prepare for your assessments and track your certification progress.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
            <Bell className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">Pending Exams: {pendingExamCount}</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white shadow-sm text-[#e31c3d]" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeExam && (
        <div className="card p-6 space-y-6 border border-[#e31c3d]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">{activeExam.title}</h3>
              <p className="text-sm text-slate-500">Answer all questions and submit your exam.</p>
            </div>
            <button
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold"
              onClick={() => setActiveExam(null)}
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            {(activeExam.questions || []).map((question, questionIndex) => (
              <div key={question.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-3">
                  {questionIndex + 1}. {question.prompt}
                </h4>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        checked={selectedAnswers[question.id] === option.id}
                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [question.id]: option.id }))}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary w-full"
            onClick={handleSubmitExam}
            disabled={isSubmittingExam}
          >
            {isSubmittingExam ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      )}

      {examActionMessage && (
        <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm font-bold text-blue-700">
          {examActionMessage}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "online" || activeTab === "written" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <div key={exam.id} className="card p-6 flex flex-col group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-red-50 rounded-xl">
                        <FileText className="w-6 h-6 text-[#e31c3d]" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                          exam.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {exam.status}
                        </span>
                        {exam.score !== undefined && (
                          <span className="text-sm font-black text-slate-900">Score: {exam.score}%</span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-[#e31c3d] transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                      {exam.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        {exam.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {exam.duration}m
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5" />
                          Due {new Date(exam.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (exam.status !== "pending") return;
                          handleStartExam(exam);
                        }}
                        disabled={exam.status !== "pending"}
                        className={cn(
                          "w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all",
                          exam.status === "pending" 
                            ? "bg-slate-900 text-white hover:bg-black" 
                            : "bg-slate-100 text-slate-500 cursor-not-allowed"
                        )}
                      >
                        {exam.status === "pending" ? (
                          <>
                            <Play className="w-4 h-4" />
                            {activeTab === "online" ? "Start Exam" : "Open Submission"}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full card p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No exams found</h3>
                  <p className="text-slate-500">There are no {activeTab} exams assigned to you at this time.</p>
                </div>
              )}
            </div>
          ) : activeTab === "requirements" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {requirements.map((req) => (
                  <div key={req.id} className="card p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900">{req.title}</h3>
                        <p className="text-slate-500 text-sm">{req.description}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Study Resources</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {req.resources.map((res, i) => (
                          <a 
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all group"
                          >
                            <span className="text-sm font-bold text-slate-700">{res.title}</span>
                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#e31c3d]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "notifications" ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { title: "Upcoming: C Programming Midterm", date: "2 days ago", type: "deadline", content: "Don't forget to review pointers and memory allocation before Wednesday." },
                { title: "New Study Guide: Python OOP", date: "4 days ago", type: "new", content: "A new study guide for the Python Final Project has been uploaded." },
                { title: "Exam Result: Shell Basics", date: "1 week ago", type: "result", content: "You scored 92% on the Shell Basics online test. Great job!" }
              ].map((notif, i) => (
                <div key={i} className="card p-6 flex gap-6 items-start">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0",
                    notif.type === "deadline" ? "bg-red-50 text-red-500" :
                    notif.type === "new" ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
                  )}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.date}</span>
                    </div>
                    <p className="text-sm text-slate-500">{notif.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Brain className="w-64 h-64 text-[#e31c3d]" />
              </div>
              
              <div className="relative z-10 max-w-2xl space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#e31c3d] rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> AI-Powered Insights
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                    Personalized Learning Analysis
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Our AI analyzes your practice tests and coding projects to identify specific weak areas. 
                    Get a custom study plan tailored to your performance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900">Focus Areas</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Memory Management in C
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Pointer Arithmetic
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900">Strengths</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Data Structures Logic
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Algorithm Efficiency
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={() => setExamActionMessage("AI study plan generation has started. Check back in a moment.")}
                >
                  <Brain className="w-4 h-4" /> Generate Study Plan
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Certification Progress */}
      <div className="card p-8 bg-slate-900 text-white border-none overflow-hidden relative">
        <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
          <Award className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-black tracking-tight">Holberton Certification Path</h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Complete all foundations exams and requirements to earn your Full-Stack Software Engineer certification.
              You're currently on track for the C21 graduation.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["C Programming", "Python", "DevOps", "System Design"].map((skill, i) => (
                <span key={i} className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                  i < 2 ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-slate-800 border-slate-700 text-slate-500"
                )}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 * (1 - 0.75)}
                  className="text-[#e31c3d]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">75%</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
