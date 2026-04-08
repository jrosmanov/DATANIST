import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Search, 
  Filter, 
  Bell, 
  Calendar, 
  HeartPulse, 
  Target,
  ShieldCheck,
  Layout,
  Plus
} from "lucide-react";
import { CMSContent, Notification } from "../../types";

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  attendance: number;
  status: string;
  cohort: string;
}

export default function SSADashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "health" | "placements">("overview");
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/cms/content").then(res => res.json()),
      fetch("/api/students").then(res => res.json())
    ]).then(([cmsData, studentData]) => {
      setCms(cmsData);
      setStudents(studentData);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !cms) return null;

  const atRiskStudents = students.filter(s => s.status === "At Risk");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">SSA Success Hub</h1>
          <p className="text-slate-500 mt-1">Monitor campus health and ensure student success.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
            <Bell className="w-4 h-4" /> Campus Alert
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Success Plan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
        {[
          { id: "overview", label: "Overview", icon: Layout },
          { id: "students", label: "Student Tracking", icon: Users },
          { id: "health", label: "Campus Health", icon: HeartPulse },
          { id: "placements", label: "Placements", icon: Target },
        ].map((tab) => (
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
                  { label: "Total Students", value: students.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Avg. Attendance", value: "92%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Students At Risk", value: atRiskStudents.length, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                  { label: "Job Placed", value: "15", icon: Target, color: "text-purple-500", bg: "bg-purple-50" },
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
                  <h2 className="text-xl font-black text-slate-900 mb-6">Students Requiring Attention</h2>
                  <div className="space-y-4">
                    {atRiskStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-red-50/30 border border-red-100 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border border-red-200 flex items-center justify-center font-bold text-red-500">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">Attendance: {student.attendance}% • Progress: {student.progress}%</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-white hover:bg-red-500 hover:text-white border border-red-200 text-red-500 rounded-lg text-xs font-bold transition-all">
                          Schedule Meeting
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Campus Health</h2>
                  <div className="space-y-6">
                    {[
                      { label: "Curriculum Engagement", value: 85 },
                      { label: "Peer Learning Participation", value: 72 },
                      { label: "Mock Interview Completion", value: 45 },
                    ].map((metric, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500 uppercase tracking-widest">{metric.label}</span>
                          <span className="text-slate-900">{metric.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#e31c3d]" style={{ width: `${metric.value}%` }} />
                        </div>
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
                  <Filter className="w-4 h-4" /> Filter Status
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
                        <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-[#e31c3d] opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "health" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto">
                <HeartPulse className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Campus Health Metrics</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Analyze overall campus performance, mental health check-ins, and cohort-wide engagement trends.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
                {["Engagement", "Attendance", "Satisfaction"].map(item => (
                  <div key={item} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-400">
                    {item} (Live Data)
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "placements" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto">
                <Target className="w-10 h-10 text-purple-500" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Placement Tracking</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Manage student job applications, interview pipelines, and successful placements with our partner companies.
                </p>
              </div>
              <button className="btn-primary">Manage Partner Network</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
