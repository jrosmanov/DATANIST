import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar as CalendarIcon,
  ArrowRight,
  Briefcase,
  Trophy,
  Award,
  Brain,
  Bell,
  Zap,
  Sparkles,
  ChevronRight,
  Users,
  Star,
  FileText,
  Target
} from "lucide-react";
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { cn } from "../lib/utils";
import { CMSContent } from "../types";

const performanceData = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 78 },
  { name: "Wed", score: 72 },
  { name: "Thu", score: 85 },
  { name: "Fri", score: 92 },
  { name: "Sat", score: 88 },
  { name: "Sun", score: 95 },
];

export default function Dashboard() {
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/content")
      .then(res => res.json())
      .then(data => {
        setCms(data);
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

  const stats = [
    { label: "Attendance", value: "98%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Avg. Score", value: "88.5", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Hours Logged", value: "142h", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Leaderboard", value: "#1", icon: Trophy, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome back, Jalal!</h1>
          <p className="text-slate-500 mt-1">Here's your holistic overview of your Holberton journey.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </button>
          <button className="btn-primary flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+12%</span>
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Progress Chart */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-900">Learning Performance</h2>
                <p className="text-sm text-slate-500">Weekly points accumulation trend</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e31c3d" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#e31c3d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#e31c3d", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#e31c3d" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Career & Files Summary */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-500" />
                  Career & Files
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-600">CV Status</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Approved</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-600">New Opportunities</span>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">12 New</span>
                </div>
              </div>
            </div>

            {/* Exams & Requirements Summary */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Exams & Requirements
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-600">Next Exam</span>
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full">In 2 Days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-600">Requirements</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Met</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content Area */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div className="card p-6">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-red-500" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {[
                { title: "C Programming Workshop", time: "Tomorrow, 14:00", type: "Workshop" },
                { title: "Mock Interview Session", time: "Fri, 10:00", type: "Interview" },
                { title: "Networking Mixer", time: "Sat, 18:00", type: "Social" },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-red-50 transition-all">
                    <CalendarIcon className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">{event.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{event.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-xs font-black text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors border-t border-slate-50">
              View Calendar
            </button>
          </div>

          {/* AI Insights Quick View */}
          <div className="card p-6 bg-slate-900 text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-red-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Learning Insight</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                "Focus on **Binary Trees** this week. Your recent quiz scores indicate a 15% gap in this area compared to your cohort average."
              </p>
              <button className="text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1">
                View Analysis <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Leaderboard & Badges */}
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Achievements
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Star, color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Target, color: "text-red-500", bg: "bg-red-50" },
                { icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((badge, i) => (
                <div key={i} className={cn("p-3 rounded-xl", badge.bg, badge.color)}>
                  <badge.icon className="w-6 h-6" />
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs">
                    1
                  </div>
                  <span className="text-sm font-bold text-slate-900">Current Rank</span>
                </div>
                <span className="text-sm font-black text-slate-900">2,450 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
