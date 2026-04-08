import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Bell, 
  Globe, 
  Layers,
  FileText,
  Upload,
  Search
} from "lucide-react";
import { CMSContent, Notification } from "../../types";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "foundations" | "online" | "events" | "notifications">("overview");
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/cms/content").then(res => res.json()),
      fetch("/api/notifications").then(res => res.json())
    ]).then(([cmsData, notifData]) => {
      setCms(cmsData);
      setNotifications(notifData);
      setIsLoading(false);
    });
  }, []);

  const stats = [
    { label: "Attendance", value: "98%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Score", value: "88.5", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Hours Logged", value: "142h", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pending Tasks", value: "3", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  if (isLoading || !cms) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "foundations", label: "Foundations", icon: BookOpen, show: cms.showFoundations },
    { id: "online", label: "Online Learning", icon: Globe, show: cms.showOnlineLearning },
    { id: "events", label: "Upcoming Events", icon: CalendarIcon, show: cms.showEvents },
    { id: "notifications", label: "Notifications", icon: Bell, show: cms.showNotifications },
  ].filter(t => t.show !== false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{cms.studentDashboardTitle}</h1>
          <p className="text-slate-500 mt-1">{cms.studentDashboardSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Files
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" /> View Exams
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
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bg} p-2 rounded-lg`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">+12%</span>
                    </div>
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Progress */}
                <div className="lg:col-span-2 card p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900">Weekly Progress</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Goal: 40h</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>Current: 32h</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { day: "Mon", hours: 8, color: "bg-[#e31c3d]" },
                      { day: "Tue", hours: 6, color: "bg-[#e31c3d]" },
                      { day: "Wed", hours: 9, color: "bg-[#e31c3d]" },
                      { day: "Thu", hours: 5, color: "bg-[#e31c3d]" },
                      { day: "Fri", hours: 4, color: "bg-slate-200" },
                      { day: "Sat", hours: 0, color: "bg-slate-100" },
                      { day: "Sun", hours: 0, color: "bg-slate-100" },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="w-8 text-xs font-bold text-slate-400">{d.day}</span>
                        <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(d.hours / 10) * 100}%` }}
                            className={`h-full ${d.color}`}
                          />
                        </div>
                        <span className="w-8 text-xs font-bold text-slate-600 text-right">{d.hours}h</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Notifications */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900">Recent Updates</h2>
                    <button onClick={() => setActiveTab("notifications")} className="text-xs font-bold text-[#e31c3d] hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-red-100 transition-all cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === "warning" ? "bg-amber-500" : n.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                          }`} />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#e31c3d] transition-colors">{n.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "foundations" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                <BookOpen className="w-10 h-10 text-[#e31c3d]" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Foundations Curriculum</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  The Foundations module is currently being tailored for your cohort. Check back soon for your first set of projects in C and Unix.
                </p>
              </div>
              <button className="btn-primary">Notify Me When Ready</button>
            </div>
          )}

          {activeTab === "online" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                <Globe className="w-10 h-10 text-blue-500" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Innovative Learning</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Access our global network of online resources, peer-learning forums, and AI-driven code review tools.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
                {["Peer Forums", "AI Code Review", "Global Workshops"].map(item => (
                  <div key={item} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-400">
                    {item} (Coming Soon)
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Campus Calendar</h2>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search events..." className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "C Programming Exam", date: "April 15", time: "10:00 AM", type: "Exam", location: "Room 302" },
                  { title: "IDDA Tech Meetup", date: "April 20", time: "14:00 PM", type: "Meetup", location: "Main Hall" },
                  { title: "Peer Learning Day", date: "April 22", time: "09:00 AM", type: "Workshop", location: "Online" },
                ].map((event, i) => (
                  <div key={i} className="card p-6 hover:border-red-200 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-red-50 text-[#e31c3d] text-[10px] font-black uppercase rounded-full">{event.type}</span>
                      <CalendarIcon className="w-4 h-4 text-slate-300 group-hover:text-[#e31c3d] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-slate-500">
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {event.date} at {event.time}</p>
                      <p className="flex items-center gap-2"><Globe className="w-4 h-4" /> {event.location}</p>
                    </div>
                    <button className="w-full mt-6 py-2 bg-slate-50 hover:bg-red-50 hover:text-[#e31c3d] rounded-xl text-xs font-bold transition-all">
                      Add to Calendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-slate-900">All Notifications</h2>
                <button className="text-sm font-bold text-slate-400 hover:text-[#e31c3d]">Mark all as read</button>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="card p-6 flex items-start gap-6 hover:bg-slate-50 transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      n.type === "warning" ? "bg-amber-50" : n.type === "success" ? "bg-emerald-50" : "bg-blue-50"
                    }`}>
                      <Bell className={`w-6 h-6 ${
                        n.type === "warning" ? "text-amber-500" : n.type === "success" ? "text-emerald-500" : "text-blue-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900">{n.title}</h4>
                        <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#e31c3d] mt-2" />}
                  </div>
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
              Empowering the next generation of software engineers through project-based learning.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Quick Links</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-bold">
              <li><button className="hover:text-[#e31c3d]">Curriculum</button></li>
              <li><button className="hover:text-[#e31c3d]">Campus Map</button></li>
              <li><button className="hover:text-[#e31c3d]">Support</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Connect</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-bold">
              <li><button className="hover:text-[#e31c3d]">LinkedIn</button></li>
              <li><button className="hover:text-[#e31c3d]">Twitter</button></li>
              <li><button className="hover:text-[#e31c3d]">Instagram</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <span>© 2026 Holberton School. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <button className="hover:text-slate-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-slate-600 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
