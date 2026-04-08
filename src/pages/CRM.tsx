import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Activity, 
  MessageSquare, 
  Link2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  MessageCircle, 
  Globe, 
  ChevronRight,
  BarChart3,
  Mail,
  Calendar,
  Clock,
  ShieldCheck
} from "lucide-react";
import { CRMInsight, Integration, CMSContent } from "../types";
import { cn } from "../lib/utils";

export default function CRM() {
  const [insights, setInsights] = useState<CRMInsight[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"insights" | "integrations" | "communication">("insights");

  useEffect(() => {
    Promise.all([
      fetch("/api/crm/insights").then(res => res.json()),
      fetch("/api/integrations").then(res => res.json()),
      fetch("/api/cms/content").then(res => res.json())
    ]).then(([insightsData, integrationsData, cmsData]) => {
      setInsights(insightsData);
      setIntegrations(integrationsData);
      setCms(cmsData);
      setLoading(false);
    });
  }, []);

  const handleSync = (id: string) => {
    fetch(`/api/integrations/${id}/sync`, { method: "POST" })
      .then(res => res.json())
      .then(updated => {
        setIntegrations(prev => prev.map(i => i.id === id ? updated : i));
      });
  };

  if (loading || !cms) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">CRM & Integrations</h1>
          <p className="text-slate-500 mt-1">Centralized student engagement and external tool management.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: "insights", label: "Student Insights", icon: BarChart3 },
            { id: "integrations", label: "Integrations", icon: Link2 },
            { id: "communication", label: "Communication", icon: MessageSquare },
          ].map((tab) => (
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
          {activeTab === "insights" ? (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Avg Engagement", value: "88%", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "At Risk Students", value: "12", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Active Discord", value: "145", icon: MessageCircle, color: "text-indigo-500", bg: "bg-indigo-50" },
                  { label: "Attendance Rate", value: "94%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                  <div key={i} className="card p-6 flex items-center gap-6">
                    <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Student Insights Table */}
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-black text-slate-900">Student Engagement Tracking</h3>
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
                  {insights.map((insight) => (
                    <div key={insight.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">
                          {insight.studentId}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Student {insight.studentId}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Last Active: {insight.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="text-center">
                          <div className="text-sm font-black text-slate-900">{insight.engagementScore}%</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engagement</div>
                        </div>
                        <div className="w-24">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full block text-center",
                            insight.riskLevel === "low" ? "bg-emerald-50 text-emerald-600" :
                            insight.riskLevel === "medium" ? "bg-amber-50 text-amber-600" :
                            "bg-red-50 text-red-600"
                          )}>
                            {insight.riskLevel} Risk
                          </span>
                        </div>
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "integrations" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {integrations.map((integration) => (
                <div key={integration.id} className="card p-8 flex flex-col group">
                  <div className="flex items-start justify-between mb-8">
                    <div className={cn(
                      "p-4 rounded-2xl transition-all",
                      integration.status === "connected" ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"
                    )}>
                      {integration.type === "attendance" ? <FileSpreadsheet className="w-8 h-8" /> :
                       integration.type === "survey" ? <Globe className="w-8 h-8" /> :
                       integration.type === "communication" ? <MessageCircle className="w-8 h-8" /> :
                       <Calendar className="w-8 h-8" />}
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      integration.status === "connected" ? "bg-emerald-50 text-emerald-600" : 
                      integration.status === "disconnected" ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-600"
                    )}>
                      {integration.status === "connected" ? <CheckCircle2 className="w-3 h-3" /> : 
                       integration.status === "disconnected" ? <XCircle className="w-3 h-3" /> : 
                       <AlertTriangle className="w-3 h-3" />}
                      {integration.status}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{integration.name}</h3>
                  <p className="text-sm text-slate-500 mb-8">
                    {integration.type === "attendance" ? "Sync campus attendance from Excel files." :
                     integration.type === "survey" ? "Import student feedback from Google Forms." :
                     integration.type === "communication" ? "Track mentorship activity on Discord." :
                     "Sync events with external platforms."}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {integration.lastSync ? `Last Sync: ${integration.lastSync}` : "Never Synced"}
                    </span>
                    <button 
                      onClick={() => handleSync(integration.id)}
                      className="p-2 hover:bg-slate-50 rounded-lg text-[#e31c3d] transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">Communication Logs</h3>
                  <button className="btn-primary flex items-center gap-2 text-xs">
                    <Plus className="w-4 h-4" /> New Entry
                  </button>
                </div>
                <div className="space-y-6">
                  {insights[0]?.communicationHistory.map((log, i) => (
                    <div key={i} className="flex gap-6 items-start p-6 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className={cn(
                        "p-3 rounded-xl shrink-0",
                        log.channel === "discord" ? "bg-indigo-50 text-indigo-500" :
                        log.channel === "meeting" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                      )}>
                        {log.channel === "discord" ? <MessageCircle className="w-5 h-5" /> :
                         log.channel === "meeting" ? <Users className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-900">{log.channel}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.date}</span>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-slate-600">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{log.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discord Placeholder */}
              <div className="card p-8 bg-[#5865F2] text-white border-none overflow-hidden relative">
                <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
                  <MessageCircle className="w-64 h-64" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8" />
                    <h2 className="text-2xl font-black tracking-tight">Discord Mentorship Sync</h2>
                  </div>
                  <p className="text-indigo-100 text-sm max-w-xl">
                    Our Discord integration automatically tracks student participation in technical channels and mentorship sessions to provide a complete engagement profile.
                  </p>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white text-[#5865F2] rounded-xl font-black text-sm flex items-center gap-2 transition-all">
                      View Discord Stats
                    </button>
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-sm transition-all">
                      Configure Webhooks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
