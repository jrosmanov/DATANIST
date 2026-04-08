import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://pbs.twimg.com/profile_images/1118189674066034688/A99X9_pA_400x400.png" 
                alt="Holberton" 
                className="w-8 h-8 rounded"
              />
              <span className="font-black text-xl tracking-tighter text-[#e31c3d]">HOLBERTON</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Empowering the next generation of software engineers through project-based learning and peer-to-peer collaboration.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-[#e31c3d] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-[#e31c3d] transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-[#e31c3d] transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-[#e31c3d] transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Dashboard</Link></li>
              <li><Link to="/exam" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Exams</Link></li>
              <li><Link to="/scheduling" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Scheduling</Link></li>
              <li><Link to="/foundations" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Curriculum</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Terms of Service</Link></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#e31c3d] transition-colors font-bold">Campus Guide</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <Mail className="w-4 h-4 text-[#e31c3d]" />
                contact@holbertonschool.com
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <Phone className="w-4 h-4 text-[#e31c3d]" />
                +1 (415) 555-0123
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-500 font-bold">
                <MapPin className="w-4 h-4 text-[#e31c3d] shrink-0" />
                972 Mission St,<br />San Francisco, CA 94103
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-bold">
            © {new Date().getFullYear()} Holberton School. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Privacy</Link>
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Terms</Link>
            <Link to="/cookies" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
