import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Users, Briefcase, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cms/content")
      .then(res => res.json())
      .then(data => setContent(data));
  }, []);

  if (!content) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img 
            src="https://pbs.twimg.com/profile_images/1118189674066034688/A99X9_pA_400x400.png" 
            alt="Holberton" 
            className="w-10 h-10 rounded"
          />
          <span className="font-black text-2xl tracking-tighter text-[#e31c3d]">HOLBERTON</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="font-bold text-slate-600 hover:text-[#e31c3d] transition-colors">Login</Link>
          <Link to="/login" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      {content.showHero && (
        <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/login" className="btn-primary text-lg px-10 py-4 flex items-center gap-2">
                Access Platform <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-10 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
                Learn More
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {/* Features Section */}
      {content.showFeatures && (
        <section className="bg-slate-50 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900">One Platform, Many Roles</h2>
              <p className="text-slate-500 mt-2">Tailored experiences for every member of the Holberton community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Students", icon: BookOpen, desc: "Access curriculum, projects, and AI-powered learning tools." },
                { title: "Mentors", icon: Users, desc: "Guide students, review projects, and manage peer learning." },
                { title: "SSA", icon: Briefcase, desc: "Track student success and manage campus operations." },
                { title: "Staff", icon: ShieldCheck, desc: "Full administrative control and platform management." },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-8 text-center"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-[#e31c3d]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://pbs.twimg.com/profile_images/1118189674066034688/A99X9_pA_400x400.png" 
                alt="Holberton" 
                className="w-8 h-8 rounded"
              />
              <span className="font-black text-xl tracking-tighter text-[#e31c3d]">HOLBERTON</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Holberton School is a project-based, peer-learning software engineering school.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Link to="/login" className="hover:text-[#e31c3d]">Student Login</Link></li>
              <li><Link to="/login" className="hover:text-[#e31c3d]">Staff Portal</Link></li>
              <li><Link to="/login" className="hover:text-[#e31c3d]">Mentor Access</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Link to="/privacy" className="hover:text-[#e31c3d]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#e31c3d]">Terms of Service</Link></li>
              <li><a href={`mailto:${content.contactEmail}`} className="hover:text-[#e31c3d]">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
          © 2026 Holberton School. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
