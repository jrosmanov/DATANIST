import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  FileText, 
  Settings, 
  Trash2, 
  Plus, 
  Save, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  Calendar as CalendarIcon, 
  Calendar,
  Bell, 
  Activity,
  Info,
  Briefcase,
  Trophy,
  Award,
  Brain,
  Link2,
  RefreshCw
} from "lucide-react";
import { User, CMSContent } from "../types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "cms" | "student-cms" | "staff-cms" | "scheduling-cms" | "exams-cms" | "career-cms" | "leaderboard-cms" | "events-cms" | "crm-cms">("users");

  useEffect(() => {
    fetch("/api/admin/users").then(res => res.json()).then(setUsers);
    fetch("/api/cms/content").then(res => res.json()).then(setCms);
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleUpdateCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;
    await fetch("/api/cms/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cms)
    });
    alert("CMS updated successfully!");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage users, content, and platform settings.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "users" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab("cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Site CMS
          </button>
          <button 
            onClick={() => setActiveTab("student-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "student-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Student CMS
          </button>
          <button 
            onClick={() => setActiveTab("staff-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "staff-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Staff CMS
          </button>
          <button 
            onClick={() => setActiveTab("scheduling-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "scheduling-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Scheduling CMS
          </button>
          <button 
            onClick={() => setActiveTab("exams-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "exams-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Exams CMS
          </button>
          <button 
            onClick={() => setActiveTab("career-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "career-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Career CMS
          </button>
          <button 
            onClick={() => setActiveTab("leaderboard-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "leaderboard-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Leaderboard CMS
          </button>
          <button 
            onClick={() => setActiveTab("events-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "events-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            Events & AI CMS
          </button>
          <button 
            onClick={() => setActiveTab("crm-cms")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "crm-cms" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
          >
            CRM & Integrations CMS
          </button>
        </div>
      </div>

      {activeTab === "users" && (
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-[#e31c3d]" />
              Platform Users
            </h2>
            <button className="btn-primary py-2 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold">{user.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase text-slate-600">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Type className="w-5 h-5 text-[#e31c3d]" />
                  Hero Section Content
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Hero Title</label>
                    <input 
                      type="text" 
                      value={cms?.heroTitle}
                      onChange={e => setCms(prev => prev ? {...prev, heroTitle: e.target.value} : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Hero Subtitle</label>
                    <textarea 
                      value={cms?.heroSubtitle}
                      onChange={e => setCms(prev => prev ? {...prev, heroSubtitle: e.target.value} : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d] h-24 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#e31c3d]" />
                  Section Visibility
                </h3>
                <div className="flex gap-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showHero}
                      onChange={e => setCms(prev => prev ? {...prev, showHero: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Hero Section</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showFeatures}
                      onChange={e => setCms(prev => prev ? {...prev, showFeatures: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Features Section</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save All Changes
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#e31c3d]" />
                Platform Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Primary Brand Color</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={cms?.primaryColor}
                      onChange={e => setCms(prev => prev ? {...prev, primaryColor: e.target.value} : null)}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={cms?.primaryColor}
                      readOnly
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Support Email</label>
                  <input 
                    type="email" 
                    value={cms?.contactEmail}
                    onChange={e => setCms(prev => prev ? {...prev, contactEmail: e.target.value} : null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "student-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#e31c3d]" />
                  Student Dashboard Header
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Dashboard Title</label>
                    <input 
                      type="text" 
                      value={cms?.studentDashboardTitle}
                      onChange={e => setCms(prev => prev ? {...prev, studentDashboardTitle: e.target.value} : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Dashboard Subtitle</label>
                    <input 
                      type="text" 
                      value={cms?.studentDashboardSubtitle}
                      onChange={e => setCms(prev => prev ? {...prev, studentDashboardSubtitle: e.target.value} : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#e31c3d]" />
                  Tab Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showFoundations}
                      onChange={e => setCms(prev => prev ? {...prev, showFoundations: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Foundations Tab</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showOnlineLearning}
                      onChange={e => setCms(prev => prev ? {...prev, showOnlineLearning: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Online Learning Tab</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showEvents}
                      onChange={e => setCms(prev => prev ? {...prev, showEvents: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Events Tab</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showNotifications}
                      onChange={e => setCms(prev => prev ? {...prev, showNotifications: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Notifications Tab</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Student Dashboard Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "staff-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#e31c3d]" />
                  Staff/Mentor Dashboard Header
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Dashboard Title</label>
                    <input 
                      type="text" 
                      value={cms?.staffDashboardTitle}
                      onChange={e => setCms(prev => prev ? {...prev, staffDashboardTitle: e.target.value} : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Dashboard Subtitle</label>
                    <input 
                      type="text" 
                      value={cms?.staffDashboardSubtitle}
                      onChange={e => setCms(prev => prev ? {...prev, staffDashboardSubtitle: e.target.value} : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#e31c3d]" />
                  Feature Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showStudentManagement}
                      onChange={e => setCms(prev => prev ? {...prev, showStudentManagement: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Student Management</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showInterviewScheduling}
                      onChange={e => setCms(prev => prev ? {...prev, showInterviewScheduling: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Interview Scheduling</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showExamAssessment}
                      onChange={e => setCms(prev => prev ? {...prev, showExamAssessment: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Exam Assessment</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCVReview}
                      onChange={e => setCms(prev => prev ? {...prev, showCVReview: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show CV Review</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Staff Dashboard Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "scheduling-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#e31c3d]" />
                  Global Scheduling Settings
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Weekly Attendance Goal (Hours)</label>
                    <input 
                      type="number" 
                      defaultValue={15}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Max Slots Per Student/Week</label>
                    <input 
                      type="number" 
                      defaultValue={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#e31c3d]" />
                  Automated Notifications
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Send email reminder 24h before session</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Notify mentor when a slot is booked</span>
                  </label>
                </div>
              </div>

              <button className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Scheduling Settings
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#e31c3d]" />
              Scheduling Stats
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Slots This Month</p>
                <p className="text-xl font-black text-slate-900">142</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Booking Rate</p>
                <p className="text-xl font-black text-slate-900">78%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "exams-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#e31c3d]" />
                  Exams Module Feature Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showOnlineExams}
                      onChange={e => setCms(prev => prev ? {...prev, showOnlineExams: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Online Exams</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showWrittenExams}
                      onChange={e => setCms(prev => prev ? {...prev, showWrittenExams: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Written Exams</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showRequirements}
                      onChange={e => setCms(prev => prev ? {...prev, showRequirements: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Requirements Tab</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showAIAnalysis}
                      onChange={e => setCms(prev => prev ? {...prev, showAIAnalysis: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show AI Analysis Tab</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-slate-900">Exam Management</h4>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  You can manage individual exams and requirements directly through the database or by adding dedicated management tools here in the future.
                </p>
                <div className="flex gap-3">
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Manage Online Exams
                  </button>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Manage Study Guides
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Exams Module Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "career-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#e31c3d]" />
                  Career Module Feature Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCVUpload}
                      onChange={e => setCms(prev => prev ? {...prev, showCVUpload: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show CV Upload</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showMotivationLetter}
                      onChange={e => setCms(prev => prev ? {...prev, showMotivationLetter: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Motivation Letter Upload</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCareerOpportunities}
                      onChange={e => setCms(prev => prev ? {...prev, showCareerOpportunities: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Career Opportunities</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCareerAI}
                      onChange={e => setCms(prev => prev ? {...prev, showCareerAI: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show AI Career Coach</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-slate-900">Career Content Management</h4>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Manage career listings, student file reviews, and LinkedIn integration settings.
                </p>
                <div className="flex gap-3">
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Manage Job Listings
                  </button>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Review Student Files
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Career Module Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "leaderboard-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#e31c3d]" />
                  Leaderboard & Certifications Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showLeaderboardRankings}
                      onChange={e => setCms(prev => prev ? {...prev, showLeaderboardRankings: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Rankings</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showStudentProgress}
                      onChange={e => setCms(prev => prev ? {...prev, showStudentProgress: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Student Progress</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCertifications}
                      onChange={e => setCms(prev => prev ? {...prev, showCertifications: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Certifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showBadges}
                      onChange={e => setCms(prev => prev ? {...prev, showBadges: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Skill Badges</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-slate-900">Gamification Management</h4>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Manage student points, award badges, and issue certifications.
                </p>
                <div className="flex gap-3">
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Manage Points
                  </button>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Issue Badges
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Leaderboard Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "events-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#e31c3d]" />
                  Events & AI Learning Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showUpcomingEvents}
                      onChange={e => setCms(prev => prev ? {...prev, showUpcomingEvents: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Upcoming Events</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showEventsCalendar}
                      onChange={e => setCms(prev => prev ? {...prev, showEventsCalendar: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Events Calendar</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showNotificationsCenter}
                      onChange={e => setCms(prev => prev ? {...prev, showNotificationsCenter: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Notifications Center</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showAILearningInsights}
                      onChange={e => setCms(prev => prev ? {...prev, showAILearningInsights: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show AI Learning Insights</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-slate-900">AI Learning Management</h4>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Configure AI recommendation parameters and manage learning study paths.
                </p>
                <div className="flex gap-3">
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Manage AI Insights
                  </button>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Edit Study Paths
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Events & AI Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "crm-cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateCMS} className="card p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-[#e31c3d]" />
                  CRM & Integrations Visibility
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCRMInsights}
                      onChange={e => setCms(prev => prev ? {...prev, showCRMInsights: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show CRM Insights</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showIntegrations}
                      onChange={e => setCms(prev => prev ? {...prev, showIntegrations: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Integrations</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showAttendanceTracking}
                      onChange={e => setCms(prev => prev ? {...prev, showAttendanceTracking: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Attendance Tracking</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cms?.showCommunicationLogs}
                      onChange={e => setCms(prev => prev ? {...prev, showCommunicationLogs: e.target.checked} : null)}
                      className="w-5 h-5 rounded border-slate-300 text-[#e31c3d] focus:ring-[#e31c3d]"
                    />
                    <span className="text-sm font-bold">Show Communication Logs</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-slate-900">External API Integrations</h4>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Configure webhooks and API keys for external services like Discord, Google Forms, and Excel imports.
                </p>
                <div className="flex gap-3">
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    Configure Discord
                  </button>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                    API Settings
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save CRM & Integration Settings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
