import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Settings, 
  Database, 
  Globe, 
  Lock, 
  Layout, 
  Users, 
  Bell, 
  FileText, 
  Activity,
  Terminal,
  Server
} from "lucide-react";
import { CMSContent } from "../../types";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "system" | "logs" | "security">("overview");
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/content").then(res => res.json()).then(data => {
      setCms(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !cms) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{cms.staffDashboardTitle}</h1>
          <p className="text-slate-500 mt-1">{cms.staffDashboardSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
            <Server className="w-4 h-4" /> System Status
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4" /> Security Audit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
        {[
          { id: "overview", label: "Overview", icon: Layout },
          { id: "system", label: "System Config", icon: Settings },
          { id: "logs", label: "Activity Logs", icon: Terminal },
          { id: "security", label: "Security", icon: Lock },
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
                  { label: "Active Users", value: "1,240", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "API Requests", value: "45.2k", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Database Load", value: "12%", icon: Database, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Uptime", value: "99.9%", icon: Globe, color: "text-purple-500", bg: "bg-purple-50" },
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Recent System Logs</h2>
                  <div className="space-y-3 font-mono text-xs">
                    {[
                      { time: "10:24:01", event: "User login: jalal@holberton.com", type: "INFO" },
                      { time: "10:22:45", event: "CMS content updated by admin", type: "SUCCESS" },
                      { time: "10:15:12", event: "Database backup completed", type: "INFO" },
                      { time: "10:02:33", event: "Failed login attempt: unknown@user.com", type: "WARNING" },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-400">{log.time}</span>
                        <span className={`font-bold ${
                          log.type === "WARNING" ? "text-amber-500" : log.type === "SUCCESS" ? "text-emerald-500" : "text-blue-500"
                        }`}>{log.type}</span>
                        <span className="text-slate-600">{log.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Platform Health</h2>
                  <div className="space-y-6">
                    {[
                      { label: "Frontend Latency", value: "45ms", status: "Healthy" },
                      { label: "Backend Response", value: "120ms", status: "Healthy" },
                      { label: "Database Latency", value: "8ms", status: "Healthy" },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                          <p className="font-bold text-slate-900">{m.value}</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase rounded-lg">
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto">
                <Settings className="w-10 h-10 text-slate-600" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">System Configuration</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Manage global platform settings, API keys, and third-party integrations.
                </p>
              </div>
              <button className="btn-primary">Open Config Editor</button>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto">
                <Terminal className="w-10 h-10 text-slate-600" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Full Activity Logs</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Search and filter through millions of system events for debugging and auditing purposes.
                </p>
              </div>
              <button className="btn-primary">Download CSV Report</button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-[#e31c3d]" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Security & Permissions</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Audit user permissions, manage firewall rules, and review security incidents.
                </p>
              </div>
              <button className="btn-primary bg-slate-900 hover:bg-black">Run Security Scan</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
