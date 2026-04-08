import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Star, 
  Target, 
  Zap, 
  ChevronRight, 
  Search, 
  Filter, 
  Bell, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Calendar,
  Users,
  ArrowUpRight,
  Code,
  Terminal,
  Cloud
} from "lucide-react";
import { LeaderboardEntry, Badge, Certification, CMSContent } from "../types";
import { cn } from "../lib/utils";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rankings" | "progress" | "certifications" | "recommendations">("rankings");

  useEffect(() => {
    Promise.all([
      fetch("/api/leaderboard").then(res => res.json()),
      fetch("/api/badges").then(res => res.json()),
      fetch("/api/certifications").then(res => res.json()),
      fetch("/api/cms/content").then(res => res.json())
    ]).then(([lbData, badgesData, certsData, cmsData]) => {
      setLeaderboard(lbData);
      setBadges(badgesData);
      setCertifications(certsData);
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
    { id: "rankings", label: "Rankings", icon: Trophy, show: cms.showLeaderboardRankings },
    { id: "progress", label: "My Progress", icon: Target, show: cms.showStudentProgress },
    { id: "certifications", label: "Certifications", icon: Award, show: cms.showCertifications || cms.showBadges },
    { id: "recommendations", label: "Recommendations", icon: Brain, show: true },
  ].filter(t => t.show);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return Code;
      case "Terminal": return Terminal;
      case "Cloud": return Cloud;
      default: return Star;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Leaderboard & Recognition</h1>
          <p className="text-slate-500 mt-1">Track your performance, earn badges, and achieve certifications.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "rankings" ? (
            <div className="space-y-6">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {leaderboard.slice(0, 3).map((entry, i) => (
                  <div 
                    key={entry.id} 
                    className={cn(
                      "card p-8 flex flex-col items-center text-center relative overflow-hidden",
                      i === 0 ? "border-amber-200 bg-amber-50/30 scale-105 z-10" : 
                      i === 1 ? "border-slate-200 bg-slate-50/30" : "border-orange-200 bg-orange-50/30"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl",
                      i === 0 ? "bg-amber-100 text-amber-600" : 
                      i === 1 ? "bg-slate-100 text-slate-600" : "bg-orange-100 text-orange-600"
                    )}>
                      {i === 0 ? <Trophy className="w-8 h-8" /> : <Medal className="w-8 h-8" />}
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{entry.name}</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">{entry.cohort}</p>
                    <div className="mt-4 text-3xl font-black text-slate-900">{entry.points} pts</div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400">
                      Rank #{entry.rank}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rankings Table */}
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-black text-slate-900">Full Rankings</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search students..." 
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 outline-none w-48"
                      />
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                      <Filter className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {leaderboard.map((entry) => (
                    <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-6">
                        <div className="w-8 text-center font-black text-slate-400 group-hover:text-slate-900 transition-colors">
                          {entry.rank}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">
                            {entry.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{entry.name}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entry.cohort}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900">{entry.points}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points</div>
                        </div>
                        <div className="w-8 flex justify-center">
                          {entry.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> :
                           entry.trend === "down" ? <TrendingDown className="w-4 h-4 text-red-500" /> :
                           <Minus className="w-4 h-4 text-slate-300" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "progress" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Weekly Goals */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">Weekly Performance</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Zap className="w-3 h-3" /> On Track
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      { label: "Project Completion", current: 4, target: 5, color: "bg-red-500" },
                      { label: "Quiz Accuracy", current: 92, target: 100, color: "bg-blue-500", unit: "%" },
                      { label: "Code Reviews Given", current: 8, target: 10, color: "bg-emerald-500" },
                      { label: "Attendance", current: 100, target: 100, color: "bg-amber-500", unit: "%" }
                    ].map((goal, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-slate-700">{goal.label}</span>
                          <span className="text-sm font-black text-slate-900">
                            {goal.current}{goal.unit} <span className="text-slate-400 font-bold text-xs">/ {goal.target}{goal.unit}</span>
                          </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={cn("h-full rounded-full", goal.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6 flex items-center gap-6">
                    <div className="p-4 bg-red-50 rounded-2xl">
                      <Zap className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">12 Days</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Streak</div>
                    </div>
                  </div>
                  <div className="card p-6 flex items-center gap-6">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">Top 5%</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Ranking</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="font-black text-slate-900 px-2">Recent Achievements</h3>
                <div className="space-y-4">
                  {[
                    { title: "Perfect Attendance", date: "Today", icon: CheckCircle2, color: "text-emerald-500" },
                    { title: "Quiz Master", date: "Yesterday", icon: Zap, color: "text-amber-500" },
                    { title: "Peer Reviewer", date: "3 days ago", icon: Users, color: "text-blue-500" }
                  ].map((item, i) => (
                    <div key={i} className="card p-4 flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg bg-slate-50", item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "certifications" ? (
            <div className="space-y-12">
              {/* Certifications */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 px-2">Professional Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="card p-8 flex flex-col group relative overflow-hidden">
                      {cert.status === "earned" && (
                        <div className="absolute top-0 right-0 p-4">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                      )}
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all",
                        cert.status === "earned" ? "bg-red-50 text-red-500 group-hover:scale-110" : 
                        cert.status === "pending" ? "bg-blue-50 text-blue-500" : "bg-slate-100 text-slate-300"
                      )}>
                        <Award className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">{cert.name}</h4>
                      <div className="space-y-4 mt-auto">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Progress</span>
                          <span className={cert.status === "earned" ? "text-emerald-600" : "text-slate-900"}>{cert.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", 
                              cert.status === "earned" ? "bg-emerald-500" : "bg-red-500"
                            )}
                            style={{ width: `${cert.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {cert.status === "earned" ? `Issued ${cert.issueDate}` : cert.status === "pending" ? "In Progress" : "Locked"}
                          </span>
                          {cert.status === "earned" && (
                            <button className="text-xs font-black text-red-600 hover:text-red-700 flex items-center gap-1">
                              View Certificate <ArrowUpRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 px-2">Skill Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {badges.map((badge) => {
                    const Icon = getBadgeIcon(badge.icon);
                    return (
                      <div key={badge.id} className={cn(
                        "card p-6 flex flex-col items-center text-center group transition-all",
                        badge.isLocked ? "opacity-50 grayscale" : "hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5"
                      )}>
                        <div className={cn(
                          "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                          badge.isLocked ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-500"
                        )}>
                          {badge.isLocked ? <Lock className="w-8 h-8" /> : <Icon className="w-10 h-10" />}
                        </div>
                        <h4 className="font-black text-slate-900">{badge.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{badge.description}</p>
                        {!badge.isLocked && (
                          <div className="mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            Earned {badge.earnedDate}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Brain className="w-64 h-64 text-red-500" />
              </div>
              <div className="relative z-10 max-w-2xl space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> AI Growth Path
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Personalized Growth Recommendations</h2>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Based on your current leaderboard standing and certification progress, here are your next steps to maximize your learning.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { 
                      title: "Focus on Peer Reviews", 
                      desc: "You're 2 reviews away from the 'Community Hero' badge. This will boost your points by +200.",
                      icon: Users,
                      color: "bg-blue-50 text-blue-600"
                    },
                    { 
                      title: "Complete Python OOP", 
                      desc: "Finishing this module will unlock the 'Pythonista' badge and put you in the Top 3 globally.",
                      icon: Zap,
                      color: "bg-amber-50 text-amber-600"
                    },
                    { 
                      title: "Schedule Career Session", 
                      desc: "Your progress indicates you're ready for the 'Full-Stack' certification review.",
                      icon: Calendar,
                      color: "bg-red-50 text-red-600"
                    }
                  ].map((rec, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl flex items-start gap-6 hover:shadow-md transition-all">
                      <div className={cn("p-3 rounded-xl shrink-0", rec.color)}>
                        <rec.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900">{rec.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{rec.desc}</p>
                      </div>
                      <button className="ml-auto p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate Detailed Growth Plan
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Notifications Panel Placeholder */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="font-black text-slate-900 px-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-500" /> Leaderboard Updates
        </h3>
        {[
          { title: "Rank Up!", date: "2 hours ago", type: "success", content: "You moved up to #1 in the C21 cohort. Keep it up!" },
          { title: "New Badge Earned", date: "1 day ago", type: "info", content: "Congratulations! You've earned the 'Shell Wizard' badge." },
          { title: "Points Deducted", date: "3 days ago", type: "warning", content: "Late submission for 'Printf' project resulted in -50 points." }
        ].map((notif, i) => (
          <div key={i} className="card p-6 flex gap-6 items-start">
            <div className={cn(
              "p-3 rounded-xl shrink-0",
              notif.type === "success" ? "bg-emerald-50 text-emerald-500" :
              notif.type === "warning" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
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
    </div>
  );
}
