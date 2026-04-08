/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Exam from "./pages/Exam";
import Career from "./pages/Career";
import Leaderboard from "./pages/Leaderboard";
import Events from "./pages/Events";
import CRM from "./pages/CRM";
import Foundations from "./pages/Foundations";
import AdminDashboard from "./pages/AdminDashboard";
import Scheduling from "./pages/Scheduling";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import MentorDashboard from "./pages/dashboards/MentorDashboard";
import SSADashboard from "./pages/dashboards/SSADashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("holberton_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthReady(true);
  }, []);

  const handleLogin = (userData: User) => {
    localStorage.setItem("holberton_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("holberton_user");
    setUser(null);
  };

  if (!isAuthReady) return null;

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case "student": return <StudentDashboard />;
      case "mentor": return <MentorDashboard />;
      case "ssa": return <SSADashboard />;
      case "staff": return <StaffDashboard />;
      case "admin": return <AdminDashboard />;
      default: return <StudentDashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
                <Sidebar user={user} onLogout={handleLogout} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar user={user} />
                  <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                      <Route path="/" element={renderDashboard()} />
                      <Route path="/admin" element={user.role === "admin" || user.role === "staff" ? <AdminDashboard /> : <Navigate to="/" />} />
                      
                      {/* Student Specific Routes */}
                      <Route path="/interview" element={<Interview />} />
                      <Route path="/exam" element={<Exam />} />
                      <Route path="/foundations" element={<Foundations />} />
                      <Route path="/career" element={<Career />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/crm" element={<CRM />} />
                      <Route path="/scheduling" element={<Scheduling />} />
                      
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <Footer />
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/home" />
            )
          }
        />
      </Routes>
    </Router>
  );
}


