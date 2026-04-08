import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar as CalendarIcon, 
  FileText, 
  Briefcase, 
  Bell,
  Layout,
  Plus,
  Mail,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { CMSContent, Notification, Exam as ExamType } from "../../types";

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  attendance: number;
  status: string;
  cohort: string;
}

interface ExamQuestionForm {
  prompt: string;
  options: string[];
  correctOptionIndex: number;
}

interface ExamFormState {
  title: string;
  description: string;
  type: "online" | "written";
  category: "multiple-choice" | "coding" | "short-answer" | "essay";
  dueDate: string;
  duration: string;
  instructions: string;
  requirementId: string;
  question: ExamQuestionForm;
}

const initialExamForm: ExamFormState = {
  title: "",
  description: "",
  type: "online",
  category: "multiple-choice",
  dueDate: "",
  duration: "60",
  instructions: "",
  requirementId: "req1",
  question: {
    prompt: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0
  }
};

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "notifications" | "scheduling" | "exams" | "cv-review">("overview");
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mentorExams, setMentorExams] = useState<ExamType[]>([]);
  const [examForm, setExamForm] = useState<ExamFormState>(initialExamForm);
  const [examMessage, setExamMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const loadMentorExams = () => {
    fetch("/api/mentor/exams")
      .then(res => res.json())
      .then(examsData => setMentorExams(examsData));
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/cms/content").then(res => res.json()),
      fetch("/api/students").then(res => res.json()),
      fetch("/api/notifications").then(res => res.json()),
      fetch("/api/mentor/exams").then(res => res.json())
    ]).then(([cmsData, studentData, notifData, examsData]) => {
      setCms(cmsData);
      setStudents(studentData);
      setNotifications(notifData);
      setMentorExams(examsData);
      setIsLoading(false);
    });
  }, []);

  const handleCreateExam = async (event: React.FormEvent) => {
    event.preventDefault();
    setExamMessage("");

    if (typeof crypto === "undefined" || !crypto.randomUUID) {
      setExamMessage("Your browser does not support secure exam ID generation.");
      return;
    }

    const normalizedOptions = examForm.question.options
      .map((option, index) => ({ text: option.trim(), originalIndex: index }))
      .filter(option => option.text.length > 0);

    if (normalizedOptions.length < 2) {
      setExamMessage("Please provide at least two answer options.");
      return;
    }

    if (!examForm.question.prompt.trim()) {
      setExamMessage("Please provide a question.");
      return;
    }

    const selectedCorrectOption = normalizedOptions.find(
      option => option.originalIndex === examForm.question.correctOptionIndex
    );
    if (!selectedCorrectOption) {
      setExamMessage("Please mark a non-empty option as the correct answer.");
      return;
    }

    const questionUuid = crypto.randomUUID();
    const questionId = `q-${questionUuid}`;
    const options = normalizedOptions.map((option, index) => ({
      id: `o-${questionId}-${index}`,
      text: option.text
    }));
    const parsedDuration = examForm.duration.trim() === "" ? undefined : Number(examForm.duration);
    const correctOptionId = options[normalizedOptions.findIndex(
      option => option.originalIndex === examForm.question.correctOptionIndex
    )].id;

    const payload = {
      title: examForm.title.trim(),
      description: examForm.description.trim(),
      type: examForm.type,
      category: examForm.category,
      dueDate: examForm.dueDate,
      duration: Number.isFinite(parsedDuration) && parsedDuration && parsedDuration > 0 ? parsedDuration : undefined,
      instructions: examForm.instructions.trim(),
      requirements: [examForm.requirementId],
      questions: [
        {
          id: questionId,
          prompt: examForm.question.prompt.trim(),
          options,
          correctOptionId
        }
      ]
    };

    const response = await fetch("/api/mentor/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setExamMessage(error.error || "Failed to create exam.");
      return;
    }

    setExamMessage("Exam created successfully.");
    setExamForm(initialExamForm);
    loadMentorExams();
  };

  if (isLoading || !cms) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "students", label: "Students", icon: Users, show: cms.showStudentManagement },
    { id: "notifications", label: "Announcements", icon: Bell, show: true },
    { id: "scheduling", label: "Scheduling", icon: CalendarIcon, show: cms.showInterviewScheduling },
    { id: "exams", label: "Exams", icon: FileText, show: cms.showExamAssessment },
    { id: "cv-review", label: "CV Review", icon: Briefcase, show: cms.showCVReview },
  ].filter(t => t.show !== false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Mentor Command Center</h1>
          <p className="text-slate-500 mt-1">Guide your students and manage project reviews.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4" /> Start Office Hours
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id 
                ? "border-[#e31c3d] text-[#e31c3d] bg-red-50/50" 
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Active Students", value: students.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Pending Reviews", value: "12", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Avg. Progress", value: "76%", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "At Risk", value: students.filter(s => s.status === "At Risk").length, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                ].map((stat, i) => (
                  <div key={i} className="card p-6">
                    <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-6">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Recent Student Activity</h2>
                  <div className="space-y-4">
                    {students.slice(0, 4).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[#e31c3d]">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">Cohort {student.cohort} • Last active 2h ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress</p>
                            <p className="font-bold text-slate-900">{student.progress}%</p>
                          </div>
                          <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Upcoming Sessions</h2>
                  <div className="space-y-4">
                    {[
                      { title: "Technical Interview", student: "Jalal O.", time: "Today, 4:00 PM" },
                      { title: "PLD Review", student: "Group C21", time: "Tomorrow, 10:00 AM" },
                      { title: "Career Coaching", student: "Alice S.", time: "Friday, 2:00 PM" },
                    ].map((session, i) => (
                      <div key={i} className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                        <h4 className="font-bold text-slate-900 text-sm">{session.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{session.student} • {session.time}</p>
                        <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#e31c3d] hover:underline">
                          Join Meeting
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-[#e31c3d]"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all">
                  <Filter className="w-4 h-4" /> Filter Cohort
                </button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Cohort</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-[10px] text-slate-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{student.cohort}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                            <div className="h-full bg-[#e31c3d]" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-600">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{student.attendance}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          student.status === "At Risk" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-[#e31c3d]">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-[#e31c3d]">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                <Bell className="w-10 h-10 text-[#e31c3d]" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Staff Announcements</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Broadcast important updates to all students or specific cohorts. Your announcements will appear on student dashboards instantly.
                </p>
              </div>
              <button className="btn-primary">Create New Announcement</button>
            </div>
          )}

          {activeTab === "scheduling" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                <CalendarIcon className="w-10 h-10 text-blue-500" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Interview Scheduling</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Sync your calendar to allow students to book technical interviews, career coaching, or project reviews.
                </p>
              </div>
              <button className="btn-primary flex items-center gap-2 mx-auto">
                <CalendarIcon className="w-4 h-4" /> Connect Google Calendar
              </button>
            </div>
          )}

          {activeTab === "exams" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900">Create Exam (Mentor)</h2>
                <p className="text-sm text-slate-500">Add one question with answer options to publish a new exam.</p>
                <form className="space-y-3" onSubmit={handleCreateExam}>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    placeholder="Exam title"
                    value={examForm.title}
                    onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    placeholder="Exam description"
                    value={examForm.description}
                    onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      value={examForm.type}
                      onChange={(e) => setExamForm(prev => ({ ...prev, type: e.target.value as "online" | "written" }))}
                    >
                      <option value="online">Online</option>
                      <option value="written">Written</option>
                    </select>
                    <select
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      value={examForm.category}
                      onChange={(e) => setExamForm(prev => ({ ...prev, category: e.target.value as "multiple-choice" | "coding" | "short-answer" | "essay" }))}
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="coding">Coding</option>
                      <option value="short-answer">Short Answer</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="datetime-local"
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      value={examForm.dueDate}
                      onChange={(e) => setExamForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      required
                    />
                    <input
                      type="number"
                      min={10}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      value={examForm.duration}
                      onChange={(e) => setExamForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Duration (minutes)"
                    />
                  </div>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    placeholder="Question prompt"
                    value={examForm.question.prompt}
                    onChange={(e) => setExamForm(prev => ({ ...prev, question: { ...prev.question, prompt: e.target.value } }))}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {examForm.question.options.map((option, index) => (
                      <input
                        key={index}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => setExamForm(prev => {
                          const nextOptions = [...prev.question.options];
                          nextOptions[index] = e.target.value;
                          return { ...prev, question: { ...prev.question, options: nextOptions } };
                        })}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      value={examForm.question.correctOptionIndex}
                      onChange={(e) => setExamForm(prev => ({ ...prev, question: { ...prev.question, correctOptionIndex: Number(e.target.value) } }))}
                    >
                      {examForm.question.options.map((_, index) => (
                        <option key={index} value={index}>Correct option {index + 1}</option>
                      ))}
                    </select>
                    <input
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      value={examForm.requirementId}
                      onChange={(e) => setExamForm(prev => ({ ...prev, requirementId: e.target.value }))}
                      placeholder="Requirement id (ex: req1)"
                    />
                  </div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    placeholder="Instructions"
                    value={examForm.instructions}
                    onChange={(e) => setExamForm(prev => ({ ...prev, instructions: e.target.value }))}
                  />
                  <button className="btn-primary w-full" type="submit">Create Exam</button>
                  {examMessage && (
                    <p className="text-xs font-bold text-slate-500">{examMessage}</p>
                  )}
                </form>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">Existing Exams</h3>
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {mentorExams.map((exam) => (
                    <div key={exam.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-slate-900">{exam.title}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{exam.type}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{exam.description}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Questions: {exam.questions?.length || 0} • Due: {new Date(exam.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {mentorExams.length === 0 && (
                    <p className="text-sm text-slate-500">No exams yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "cv-review" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto">
                <Briefcase className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">CV & Motivation Review</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Provide feedback on student CVs and motivation letters. Help them prepare for their career in tech.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {["CV Review", "LinkedIn Audit", "Motivation Letter"].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-16 pt-16 border-t border-slate-100 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://pbs.twimg.com/profile_images/1118189674066034688/A99X9_pA_400x400.png" 
                alt="Holberton" 
                className="w-8 h-8 rounded"
              />
              <span className="font-black text-xl tracking-tighter text-[#e31c3d]">HOLBERTON</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Staff and Mentor coordination platform for Holberton School Azerbaijan.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Resources</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-bold">
              <li><button className="hover:text-[#e31c3d]">Mentor Guide</button></li>
              <li><button className="hover:text-[#e31c3d]">Staff Portal</button></li>
              <li><button className="hover:text-[#e31c3d]">Campus Policies</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Support</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-bold">
              <li><button className="hover:text-[#e31c3d]">IT Helpdesk</button></li>
              <li><button className="hover:text-[#e31c3d]">Admin Contact</button></li>
              <li><button className="hover:text-[#e31c3d]">Feedback</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
