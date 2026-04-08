import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, LogIn, ShieldCheck, Users, Briefcase, BookOpen } from "lucide-react";
import { UserRole } from "../types";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: "student", label: "Student", icon: BookOpen },
    { id: "mentor", label: "Mentor", icon: Users },
    { id: "ssa", label: "SSA", icon: Briefcase },
    { id: "staff", label: "Staff", icon: ShieldCheck },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="https://pbs.twimg.com/profile_images/1118189674066034688/A99X9_pA_400x400.png" 
              alt="Holberton" 
              className="w-16 h-16 rounded-xl shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your Holberton account</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      role === r.id 
                        ? "bg-red-50 border-[#e31c3d] text-[#e31c3d]" 
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <r.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d] transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#e31c3d] transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"} <LogIn className="w-5 h-5" />
            </button>

            <div className="text-center">
              <button type="button" className="text-xs font-bold text-slate-400 hover:text-[#e31c3d] transition-colors">
                Forgot your password?
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <button className="font-bold text-[#e31c3d] hover:underline">Contact Campus Staff</button>
        </p>
      </motion.div>
    </div>
  );
}
