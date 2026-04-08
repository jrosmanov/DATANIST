import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Trophy, 
  Calendar, 
  LogOut,
  Settings,
  BookOpen,
  ShieldCheck,
  Users,
  Bell,
  Link2
} from "lucide-react";
import { cn } from "../../lib/utils";
import { User } from "../../types";

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const getMenuItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: Calendar, label: "Scheduling", path: "/scheduling" },
      { icon: Bell, label: "Events", path: "/events" },
    ];

    if (user.role === "admin" || user.role === "staff") {
      return [
        ...baseItems,
        { icon: ShieldCheck, label: "Admin Panel", path: "/admin" },
        { icon: Users, label: "User Management", path: "/admin" },
        { icon: Link2, label: "CRM & Integrations", path: "/crm" },
      ];
    }

    if (user.role === "student") {
      return [
        ...baseItems,
        { icon: MessageSquare, label: "AI Interview", path: "/interview" },
        { icon: FileText, label: "Exams", path: "/exam" },
        { icon: BookOpen, label: "Foundations", path: "/foundations" },
        { icon: Briefcase, label: "Career & Files", path: "/career" },
        { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
      ];
    }

    if (user.role === "mentor") {
      return [
        ...baseItems,
        { icon: Users, label: "Students", path: "/students" },
        { icon: FileText, label: "Exams", path: "/exam" },
        { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
        { icon: Briefcase, label: "Career & Files", path: "/career" },
        { icon: FileText, label: "Project Reviews", path: "/reviews" },
        { icon: Link2, label: "CRM & Integrations", path: "/crm" },
      ];
    }

    if (user.role === "ssa") {
      return [
        ...baseItems,
        { icon: Briefcase, label: "Campus Health", path: "/health" },
        { icon: FileText, label: "Exams", path: "/exam" },
        { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
        { icon: Briefcase, label: "Career & Files", path: "/career" },
        { icon: Users, label: "Placements", path: "/placements" },
        { icon: Link2, label: "CRM & Integrations", path: "/crm" },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <img 
          src="https://pbs.twimg.com/profile_images/1118189674066034688/A99X9_pA_400x400.png" 
          alt="Holberton" 
          className="w-8 h-8 rounded"
        />
        <span className="font-black text-xl tracking-tighter text-[#e31c3d]">HOLBERTON</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              isActive 
                ? "bg-red-50 text-[#e31c3d]" 
                : "text-slate-400 hover:text-[#e31c3d] hover:bg-slate-50"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <button 
          onClick={() => alert("Settings panel coming soon!")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:text-[#e31c3d] hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
