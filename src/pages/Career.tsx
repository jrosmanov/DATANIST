import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Search, 
  Filter, 
  Brain, 
  Sparkles, 
  Bell, 
  ChevronRight, 
  Download,
  Trash2,
  MessageSquare,
  Building2,
  MapPin,
  Globe,
  Linkedin,
  Send
} from "lucide-react";
import { CareerOpportunity, StudentFile, CMSContent } from "../types";
import { cn } from "../lib/utils";
import { generateMotivationLetter, getCareerRecommendations } from "../services/ai";

export default function Career() {
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([]);
  const [files, setFiles] = useState<StudentFile[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"files" | "opportunities" | "ai" | "notifications">("files");
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [details, setDetails] = useState({
    name: "Jalal Osmanov",
    role: "Full-Stack Developer",
    skills: "C, Python, React, DevOps, SQL",
    goals: "Building scalable AI-driven platforms"
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/career/opportunities").then(res => res.json()),
      fetch("/api/career/files").then(res => res.json()),
      fetch("/api/cms/content").then(res => res.json())
    ]).then(([oppsData, filesData, cmsData]) => {
      setOpportunities(oppsData);
      setFiles(filesData);
      setCms(cmsData);
      setLoading(false);
    });
  }, []);

  const handleGenerateLetter = async () => {
    setAiLoading(true);
    const letter = await generateMotivationLetter(details);
    setAiResult(letter || "Failed to generate letter.");
    setAiLoading(false);
  };

  const handleGetRecommendations = async () => {
    setAiLoading(true);
    const recs = await getCareerRecommendations(details.skills);
    setAiResult(recs || "Failed to get recommendations.");
    setAiLoading(false);
  };

  if (loading || !cms) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "files", label: "My Files", icon: FileText, show: cms.showCVUpload || cms.showMotivationLetter },
    { id: "opportunities", label: "Opportunities", icon: Briefcase, show: cms.showCareerOpportunities },
    { id: "ai", label: "AI Career Coach", icon: Brain, show: cms.showCareerAI },
    { id: "notifications", label: "Updates", icon: Bell, show: true },
  ].filter(t => t.show);

  const handleFileUpload = (type: "cv" | "motivation_letter") => {
    const fileName = type === "cv" ? "My_New_CV.pdf" : "My_Motivation_Letter.pdf";
    fetch("/api/career/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, fileName, studentId: 1 })
    })
    .then(res => res.json())
    .then(newFile => {
      setFiles(prev => [...prev, newFile]);
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Career & Files</h1>
          <p className="text-slate-500 mt-1">Manage your professional documents and explore career paths.</p>
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
          {activeTab === "files" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-1 space-y-6">
                {cms.showCVUpload && (
                  <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-900">Curriculum Vitae</h3>
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-xs text-slate-500">Upload your latest CV in PDF format. Max 5MB.</p>
                    <button 
                      onClick={() => handleFileUpload("cv")}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#e31c3d] hover:bg-red-50 transition-all group"
                    >
                      <Upload className="w-6 h-6 text-slate-300 group-hover:text-[#e31c3d]" />
                      <span className="text-xs font-bold text-slate-400 group-hover:text-[#e31c3d]">Click to upload CV</span>
                    </button>
                  </div>
                )}
                {cms.showMotivationLetter && (
                  <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-900">Motivation Letter</h3>
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-xs text-slate-500">Upload your motivation letter for specific applications.</p>
                    <button 
                      onClick={() => handleFileUpload("motivation_letter")}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#e31c3d] hover:bg-red-50 transition-all group"
                    >
                      <Upload className="w-6 h-6 text-slate-300 group-hover:text-[#e31c3d]" />
                      <span className="text-xs font-bold text-slate-400 group-hover:text-[#e31c3d]">Click to upload Letter</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Files List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-black text-slate-900 px-2">Recent Uploads</h3>
                {files.length > 0 ? (
                  files.map((file) => (
                    <div key={file.id} className="card p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-xl",
                          file.type === "cv" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                        )}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{file.fileName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {file.uploadDate}
                            </span>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                              file.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                              file.status === "rejected" ? "bg-red-50 text-red-600" :
                              "bg-amber-50 text-amber-600"
                            )}>
                              {file.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-slate-500">No files uploaded yet.</p>
                  </div>
                )}

                {/* Feedback Section */}
                {files.some(f => f.feedback) && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-black text-slate-900 px-2">Mentor Feedback</h3>
                    {files.filter(f => f.feedback).map(file => (
                      <div key={`fb-${file.id}`} className="p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-600">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">Feedback on {file.fileName}</span>
                        </div>
                        <p className="text-sm text-amber-800 leading-relaxed italic">
                          "{file.feedback}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "opportunities" ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search roles, companies, or keywords..." 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="card p-6 flex flex-col group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-red-50 transition-colors">
                        <Building2 className="w-6 h-6 text-slate-400 group-hover:text-red-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                        {opp.type}
                      </span>
                    </div>
                    <div className="space-y-1 mb-6">
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">{opp.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-bold text-slate-700">{opp.company}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {opp.location}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                      {opp.description}
                    </p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Posted {opp.postedDate}
                      </span>
                      <a 
                        href={opp.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700"
                      >
                        Apply Now <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "ai" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="card p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="font-black text-slate-900">AI Career Coach</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Target Role</label>
                      <input 
                        type="text" 
                        value={details.role}
                        onChange={(e) => setDetails({...details, role: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Skills</label>
                      <input 
                        type="text" 
                        value={details.skills}
                        onChange={(e) => setDetails({...details, skills: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Goals</label>
                      <textarea 
                        value={details.goals}
                        onChange={(e) => setDetails({...details, goals: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all h-24 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={handleGetRecommendations}
                      disabled={aiLoading}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                    >
                      {aiLoading ? "Analyzing..." : "Analyze Profile"}
                    </button>
                    <button 
                      onClick={handleGenerateLetter}
                      disabled={aiLoading}
                      className="w-full py-3 bg-red-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      {aiLoading ? "Generating..." : "Generate Motivation Letter"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="card p-8 min-h-[400px] flex flex-col">
                  {aiResult ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900">AI Analysis Result</h3>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all"><Download className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all"><Send className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">
                          {aiResult}
                        </pre>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="max-w-xs">
                        <h3 className="font-black text-slate-900">Ready to boost your career?</h3>
                        <p className="text-sm text-slate-500 mt-2">
                          Fill in your details and let our AI help you with recommendations or motivation letters.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { title: "CV Approved", date: "1 day ago", type: "success", content: "Your CV has been approved by Mentor Sarah. You can now use it for applications." },
                { title: "New Opportunity: Stripe", date: "3 days ago", type: "info", content: "Stripe just posted a new Backend Developer role that matches your profile." },
                { title: "Feedback Received", date: "1 week ago", type: "warning", content: "You have new feedback on your Motivation Letter for Google." }
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

      {/* LinkedIn Integration Placeholder */}
      <div className="card p-8 bg-slate-900 text-white border-none overflow-hidden relative">
        <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
          <Linkedin className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-black tracking-tight">LinkedIn Profile Sync</h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Connect your LinkedIn profile to automatically sync your experience and get better job recommendations.
            </p>
            <button className="px-6 py-3 bg-[#0077b5] hover:bg-[#006396] text-white rounded-xl font-black text-sm flex items-center gap-2 transition-all">
              <Linkedin className="w-4 h-4" /> Connect LinkedIn
            </button>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                <Globe className="w-8 h-8 text-slate-500" />
              </div>
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                <Briefcase className="w-8 h-8 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
