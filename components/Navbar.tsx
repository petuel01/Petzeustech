
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0f172a] border-b-2 border-white/5 px-6 md:px-12 py-5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand - Direct User Request: PETZEUSTECH */}
        <div className="flex flex-col cursor-pointer group" onClick={() => handleNavClick(onHome)}>
          <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none text-white group-hover:text-blue-500 transition-colors">
            PETZEUSTECH
          </span>
          <span className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase leading-none mt-1.5">
            UNLIMITED NETWORKS
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={onDashboard}
            className="text-slate-300 hover:text-white transition-all text-[11px] font-black tracking-widest uppercase"
          >
            {user?.role === UserRole.ADMIN ? 'COMMAND CENTER' : 'TERMINAL'}
          </button>
          
          <div className="h-8 w-[1px] bg-white/10"></div>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AUTHORIZED NODE</span>
                <span className="text-[11px] font-black text-white uppercase tracking-tight">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="bg-red-600/10 text-red-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
              >
                EJECT
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all active:scale-95"
            >
              SIGN IN
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={toggleMenu}
          className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-xl border border-white/10"
          aria-label="Toggle Navigation"
        >
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#0f172a] p-10 flex flex-col gap-10 border-l border-white/10 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col mb-4">
            <span className="text-3xl font-black text-white uppercase tracking-tighter">PETZEUSTECH</span>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2">UNLIMITED NETWORKS</span>
          </div>

          <div className="flex flex-col gap-6">
            <button onClick={() => handleNavClick(onHome)} className="text-left text-2xl font-black text-white uppercase tracking-tighter hover:text-blue-500">HOME</button>
            <button onClick={() => handleNavClick(onDashboard)} className="text-left text-2xl font-black text-blue-400 uppercase tracking-tighter">TERMINAL</button>
            <button onClick={() => { handleNavClick(() => {
              onHome();
              setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
            })}} className="text-left text-2xl font-black text-white uppercase tracking-tighter opacity-60">PLANS</button>
          </div>

          <div className="mt-auto">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">AUTHORIZED NODE</p>
                   <p className="text-lg font-black text-white uppercase truncate">{user.name}</p>
                </div>
                <button onClick={() => handleNavClick(onLogout)} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl">DISCONNECT</button>
              </div>
            ) : (
              <button onClick={() => handleNavClick(onLogin)} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl">SIGN IN</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
