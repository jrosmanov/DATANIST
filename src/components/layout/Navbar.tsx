import { Bell, Search } from "lucide-react";
import { User } from "../../types";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-100 bg-white/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search platform..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#e31c3d] transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-[#e31c3d] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e31c3d] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 group-hover:text-[#e31c3d] transition-colors">{user.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User" />
          </div>
        </div>
      </div>
    </header>
  );
}
