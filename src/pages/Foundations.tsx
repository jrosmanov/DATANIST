import { motion } from "motion/react";
import { BookOpen, Code, Terminal, Database, Globe, Layers, CheckCircle2, Lock } from "lucide-react";

export default function Foundations() {
  const modules = [
    { title: "Unix & Shell", icon: Terminal, status: "Completed", progress: 100 },
    { title: "C Programming", icon: Code, status: "In Progress", progress: 65 },
    { title: "Data Structures", icon: Layers, status: "Locked", progress: 0 },
    { title: "Python Basics", icon: Globe, status: "Locked", progress: 0 },
    { title: "SQL & Databases", icon: Database, status: "Locked", progress: 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Foundations Curriculum</h1>
        <p className="text-slate-400 mt-1">Master the fundamentals of software engineering through peer learning.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {modules.map((module, i) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border transition-all ${
              module.status === "Locked" 
                ? "bg-slate-900/20 border-slate-800/50 grayscale" 
                : "bg-slate-900/50 border-slate-800 hover:border-red-500/50"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                module.status === "Completed" ? "bg-emerald-500/10" : module.status === "In Progress" ? "bg-red-500/10" : "bg-slate-800"
              }`}>
                <module.icon className={`w-8 h-8 ${
                  module.status === "Completed" ? "text-emerald-500" : module.status === "In Progress" ? "text-red-500" : "text-slate-500"
                }`} />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  {module.status === "Completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {module.status === "Locked" && <Lock className="w-4 h-4 text-slate-500" />}
                </div>
                <p className="text-sm text-slate-500">
                  {module.status === "Completed" ? "All projects submitted and peer-reviewed." : 
                   module.status === "In Progress" ? "Currently working on advanced algorithms." : 
                   "Unlock this module by completing prerequisites."}
                </p>
              </div>

              <div className="w-full md:w-64 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                    className={`h-full ${module.status === "Completed" ? "bg-emerald-500" : "bg-red-500"}`}
                  ></motion.div>
                </div>
              </div>

              <button 
                disabled={module.status === "Locked"}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                  module.status === "Locked" 
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed" 
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                {module.status === "Completed" ? "Review" : module.status === "In Progress" ? "Continue" : "Locked"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
