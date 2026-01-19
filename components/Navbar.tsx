
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

  const scrollToSection = (id: string) => {
    onHome();
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const navLinks = [
    { label: 'Home', onClick: onHome },
    { label: 'Pricing', onClick: () => scrollToSection('pricing') },
    { label: 'Mentorship', onClick: () => scrollToSection('mentorship') },
    { label: 'Community', onClick: () => scrollToSection('community') },
  ];

  const avatarUrl = user 
    ? `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}&backgroundColor=0f172a&mouth=smile01,smile02&eyes=bulging,dizzy,frame1,frame2&texture=grunge,dots&colors=blue`
    : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHome}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            P
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap leading-none">
              PETZEUSTECH
            </span>
            <span className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase leading-none">
              UNLIMITED NETWORKS
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={link.onClick}
              className="text-slate-400 hover:text-white transition-colors text-[11px] font-black uppercase tracking-[0.2em]"
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button 
              onClick={onDashboard}
              className="text-blue-400 hover:text-blue-300 transition-colors text-[11px] font-black uppercase tracking-[0.2em] border-l border-white/10 pl-8"
            >
              {user.role === UserRole.ADMIN ? 'Command Center' : 'Terminal'}
            </button>
          )}
        </div>

        {/* Desktop User / Auth Action */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <img 
                src={avatarUrl} 
                className="w-10 h-10 rounded-xl bg-slate-800 border border-blue-500/30 shadow-lg" 
                alt="Elite Bot" 
              />
              <button 
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Eject
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all active:scale-95"
            >
              Authorize Node
            </button>
          )}
        </div>

        {/* Hamburger Toggle (Mobile) */}
        <button 
          className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10 relative z-[101]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu Sidebar/Overlay */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-slate-900 border-l border-white/10 p-10 flex flex-col gap-10 transition-transform duration-500 shadow-3xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex items-center gap-3 mt-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl">P</div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter uppercase">ZEUS PANEL</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Unlimited Networks</span>
              </div>
           </div>
           
           <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <button 
                  key={link.label}
                  onClick={() => { link.onClick(); setIsMenuOpen(false); }}
                  className="text-left text-2xl font-black uppercase tracking-tight text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {user && (
                <button 
                  onClick={() => { onDashboard(); setIsMenuOpen(false); }}
                  className="text-left text-2xl font-black uppercase tracking-tight text-blue-400"
                >
                  Dashboard
                </button>
              )}
           </div>

           <div className="mt-auto flex flex-col gap-6">
             {user ? (
               <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4 p-5 glass rounded-3xl border-white/10">
                    <img 
                      src={avatarUrl} 
                      className="w-14 h-14 rounded-2xl bg-slate-800" 
                      alt="User" 
                    />
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-sm font-black uppercase tracking-widest text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono uppercase">{user.role}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => { onLogout(); setIsMenuOpen(false); }}
                   className="w-full bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-red-500/20"
                 >
                   Eject Connection
                 </button>
               </div>
             ) : (
               <button 
                 onClick={() => { onLogin(); setIsMenuOpen(false); }}
                 className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
               >
                 Authorize Node
               </button>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
