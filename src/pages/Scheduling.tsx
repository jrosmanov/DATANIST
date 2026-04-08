import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Video,
  MapPin
} from "lucide-react";
import { InterviewSlot, User as UserType } from "../types";

export default function Scheduling() {
  const [user, setUser] = useState<UserType | null>(null);
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    type: "Technical" as InterviewSlot["type"]
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("holberton_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    fetch("/api/scheduling/slots")
      .then(res => res.json())
      .then(data => {
        setSlots(data);
        setIsLoading(false);
      });
  }, []);

  const handleBookSlot = async (slotId: string) => {
    if (!user) return;
    const res = await fetch("/api/scheduling/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId,
        studentId: user.id,
        studentName: user.name
      })
    });
    if (res.ok) {
      const updatedSlot = await res.json();
      setSlots(slots.map(s => s.id === slotId ? { ...s, status: "booked", studentId: user.id, studentName: user.name } : s));
      alert("Slot booked successfully!");
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await fetch("/api/scheduling/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newSlot,
        mentorId: user.id,
        mentorName: user.name
      })
    });
    if (res.ok) {
      const addedSlot = await res.json();
      setSlots([...slots, addedSlot]);
      setShowAddModal(false);
      setNewSlot({ startTime: "", endTime: "", type: "Technical" });
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    const res = await fetch(`/api/scheduling/slots/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  if (isLoading || !user) return null;

  const isStaff = user.role === "mentor" || user.role === "ssa" || user.role === "admin";
  const mySlots = isStaff 
    ? slots.filter(s => s.mentorId === user.id)
    : slots.filter(s => s.studentId === user.id);
  const availableSlots = slots.filter(s => s.status === "available");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Interviews & Scheduling</h1>
          <p className="text-slate-500 mt-1">
            {isStaff ? "Manage your availability and upcoming sessions." : "Book a session with your mentor or SSA."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isStaff && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Create Time Slot
            </button>
          )}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "list" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
            >
              List
            </button>
            <button 
              onClick={() => setView("calendar")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "calendar" ? "bg-white shadow-sm text-[#e31c3d]" : "text-slate-500"}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {view === "list" ? (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#e31c3d]" />
                {isStaff ? "My Scheduled Sessions" : "My Booked Sessions"}
              </h2>
              <div className="space-y-4">
                {mySlots.length > 0 ? (
                  mySlots.map(slot => (
                    <div key={slot.id} className="card p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                          <CalendarIcon className="w-6 h-6 text-[#e31c3d]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{slot.type} Interview</h3>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase">Booked</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(slot.startTime).toLocaleString()}</span>
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {isStaff ? slot.studentName : slot.mentorName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-500">
                          <Video className="w-4 h-4" />
                        </button>
                        {isStaff && (
                          <button 
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card p-12 text-center text-slate-400 font-bold">
                    No sessions scheduled yet.
                  </div>
                )}
              </div>

              {!isStaff && (
                <div className="space-y-6 pt-8">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#e31c3d]" />
                    Available Slots
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSlots.map(slot => (
                      <div key={slot.id} className="card p-6 hover:border-red-200 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-red-50 text-[#e31c3d] text-[10px] font-black uppercase rounded-full">{slot.type}</span>
                          <span className="text-xs font-bold text-slate-400">{slot.mentorName}</span>
                        </div>
                        <div className="space-y-2 mb-6">
                          <p className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                            {new Date(slot.startTime).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleBookSlot(slot.id)}
                          className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Book Session
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                <CalendarIcon className="w-10 h-10 text-[#e31c3d]" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900">Calendar View</h2>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  Interactive calendar integration is coming soon. You'll be able to drag and drop slots and sync with Google/Outlook.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all">
                  Sync Google Calendar
                </button>
                <button className="btn-primary">View Full Schedule</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Attendance Progress (Student Only) */}
          {!isStaff && (
            <div className="card p-6">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Campus Attendance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Weekly Goal: 15h</span>
                  <span className="text-slate-900">12.5h / 15h</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "83%" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  You're on track! Complete 2.5 more hours by Friday to meet your weekly requirement.
                </p>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="card p-6 bg-slate-900 text-white border-none">
            <h3 className="font-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#e31c3d]" />
              Interview Tips
            </h3>
            <ul className="space-y-4">
              {[
                "Test your camera and mic 10 mins before.",
                "Have your code editor ready for technicals.",
                "Review the project requirements beforehand.",
                "Prepare 2-3 questions for your mentor."
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-xs font-medium text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e31c3d] mt-1 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-md p-8"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">Create Time Slot</h2>
              <form onSubmit={handleAddSlot} className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Interview Type</label>
                  <select 
                    value={newSlot.type}
                    onChange={e => setNewSlot({...newSlot, type: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#e31c3d]"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Career">Career</option>
                    <option value="SSA Check-in">SSA Check-in</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Start Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newSlot.startTime}
                    onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#e31c3d]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">End Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newSlot.endTime}
                    onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#e31c3d]"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary py-3"
                  >
                    Create Slot
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
