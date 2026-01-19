
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onDashboard: () => void;
  onHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onLogout, onDashboard, onHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', onClick: onHome },
    { label: 'PLANS', onClick: () => { onHome(); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
    { label: 'MENTORSHIP', onClick: () => { onHome(); setTimeout(() => document.getElementById('mentorship')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
    { label: 'COMMUNITY', onClick: () => { onHome(); setTimeout(() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
  ];

  const avatarUrl = user 
    ? `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}&backgroundColor=0f172a&colors=blue`
    : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-nav px-4 md:px-10 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button 
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-blue-600 shadow-xl active:scale-90 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>

          <div className="flex flex-col cursor-pointer group" onClick={onHome}>
            <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none text-white group-hover:text-blue-400 transition-colors">
              PETZEUSTECH
            </span>
            <span className="text-[9px] md:text-[11px] font-black text-blue-500 tracking-[0.4em] uppercase leading-none mt-1.5">
              UNLIMITED NETWORKS
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={link.onClick}
              className="text-slate-400 hover:text-white transition-all text-[11px] font-black tracking-[0.2em] relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
          {user && (
            <button 
              onClick={onDashboard}
              className="text-blue-400 hover:text-blue-300 transition-colors text-[11px] font-black tracking-[0.2em] border-l border-white/10 pl-12"
            >
              {user.role === UserRole.ADMIN ? 'ADMIN CENTER' : 'DASHBOARD'}
            </button>
          )}
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5 pl-8 border-l border-white/10">
              <img src={avatarUrl} className="w-11 h-11 rounded-[1rem] bg-slate-950 border border-blue-500/30" alt="User" />
              <button 
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-7 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="btn-primary text-white px-12 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-slate-900 border-r border-blue-500/10 p-12 flex flex-col gap-12 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="flex flex-col mb-4">
              <span className="text-3xl font-black uppercase tracking-tighter text-white">PETZEUSTECH</span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mt-2">UNLIMITED NETWORKS</span>
           </div>
           <div className="flex flex-col gap-10">
              {navLinks.map((link) => (
                <button 
                  key={link.label}
                  onClick={() => { link.onClick(); setIsMenuOpen(false); }}
                  className="text-left text-3xl font-black uppercase tracking-tighter text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {user && (
                <button onClick={() => { onDashboard(); setIsMenuOpen(false); }} className="text-left text-3xl font-black uppercase tracking-tighter text-blue-400">DASHBOARD</button>
              )}
           </div>
           <div className="mt-auto">
             {user ? (
               <button onClick={onLogout} className="w-full bg-red-600/10 text-red-500 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] border border-red-500/10">LOGOUT</button>
             ) : (
               <button onClick={onLogin} className="w-full btn-primary text-white py-6 rounded-3xl font-black text-[12px] uppercase shadow-2xl tracking-[0.3em]">SIGN IN</button>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
