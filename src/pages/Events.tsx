import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Plus, 
  Bell, 
  Brain, 
  Sparkles, 
  Filter, 
  Search, 
  Clock, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Target,
  Zap
} from "lucide-react";
import { Event, AILearningInsight, CMSContent } from "../types";
import { cn } from "../lib/utils";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [aiInsights, setAiInsights] = useState<AILearningInsight | null>(null);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "calendar" | "ai" | "notifications">("upcoming");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then(res => res.json()),
      fetch("/api/ai/insights").then(res => res.json()),
      fetch("/api/cms/content").then(res => res.json())
    ]).then(([eventsData, aiData, cmsData]) => {
      setEvents(eventsData);
      setAiInsights(aiData);
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
    { id: "upcoming", label: "Upcoming Events", icon: Calendar, show: cms.showUpcomingEvents },
    { id: "calendar", label: "Calendar", icon: Calendar, show: cms.showEventsCalendar },
    { id: "ai", label: "AI Learning", icon: Brain, show: cms.showAILearningInsights },
    { id: "notifications", label: "Notifications", icon: Bell, show: cms.showNotificationsCenter },
  ].filter(t => t.show);

  const filteredEvents = filter === "All" ? events : events.filter(e => e.type === filter.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Events & Learning</h1>
          <p className="text-slate-500 mt-1">Stay updated with Holberton Azerbaijan and IDDA ecosystem.</p>
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
          {activeTab === "upcoming" ? (
            <div className="space-y-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {["All", "Workshop", "Interview", "Exam", "Social"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                      filter === f 
                        ? "bg-[#e31c3d] text-white border-[#e31c3d]" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card group overflow-hidden flex flex-col md:flex-row"
                  >
                    <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/${event.id}/400/400`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-black text-[#e31c3d] uppercase tracking-widest">{event.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-[#e31c3d] transition-colors">{event.title}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users className="w-4 h-4 text-slate-400" />
                            {event.participants}+ Registered
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + event.id}`} alt="User" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black text-[#e31c3d] hover:text-red-700 transition-colors uppercase tracking-widest">
                          Register Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="card p-10 bg-slate-900 text-white border-none relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-black tracking-tight mb-4">Host your own workshop?</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Holberton students are encouraged to share their knowledge. Whether it's a deep dive into C pointers or a React workshop, we provide the space and platform.
                  </p>
                  <button 
                    onClick={() => alert("Workshop proposal form opening...")}
                    className="px-8 py-3 bg-[#e31c3d] text-white rounded-xl font-black hover:bg-red-700 transition-all shadow-xl"
                  >
                    Submit Proposal
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <Calendar className="w-full h-full -rotate-12 translate-x-1/4 translate-y-1/4" />
                </div>
              </div>
            </div>
          ) : activeTab === "calendar" ? (
            <div className="card p-8 min-h-[600px] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-[#e31c3d]" />
              </div>
              <div className="max-w-md">
                <h2 className="text-2xl font-black text-slate-900">Interactive Calendar</h2>
                <p className="text-slate-500 mt-2">
                  The full interactive calendar view is coming soon. You'll be able to sync events with your personal Google or Outlook calendar.
                </p>
              </div>
              <div className="grid grid-cols-7 gap-2 w-full max-w-2xl">
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "ai" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="card p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <Brain className="w-5 h-5 text-red-500" />
                      </div>
                      <h3 className="font-black text-slate-900">AI Learning Insights</h3>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" /> Personalized
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Weak Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights?.weakAreas.map((area, i) => (
                          <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights?.strengths.map((area, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Study Path</h4>
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {aiInsights?.studyPath.map((step, i) => (
                        <div key={i} className="flex items-center gap-4 shrink-0">
                          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm">
                            {step}
                          </div>
                          {i < aiInsights.studyPath.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-black text-slate-900 px-2">Personalized Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiInsights?.recommendations.map((rec, i) => (
                      <div key={i} className="card p-6 space-y-4 group">
                        <div className="p-3 bg-red-50 rounded-xl w-fit group-hover:bg-red-500 group-hover:text-white transition-all">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-slate-900">{rec.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{rec.description}</p>
                        <button className="flex items-center gap-2 text-xs font-black text-[#e31c3d] uppercase tracking-widest">
                          Start Learning <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="card p-8 bg-slate-900 text-white border-none space-y-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-red-500" />
                    <h3 className="font-black">Learning Goals</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: "C Mastery", progress: 65 },
                      { label: "Python OOP", progress: 85 },
                      { label: "React Fundamentals", progress: 40 }
                    ].map((goal, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{goal.label}</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                    Update Goals
                  </button>
                </div>

                <div className="card p-6 space-y-4">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Quick Tip</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    "Students who complete at least 3 peer reviews per week are 40% more likely to pass the final exam."
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { title: "Exam Deadline", date: "2 hours ago", type: "warning", content: "The Python Midterm Exam starts in 48 hours. Make sure you've completed all requirements." },
                { title: "New Workshop", date: "1 day ago", type: "info", content: "A new workshop on 'Docker for Developers' has been added to the calendar." },
                { title: "AI Insight Ready", date: "2 days ago", type: "success", content: "Your weekly AI learning analysis is ready. Check your recommendations." }
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
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
