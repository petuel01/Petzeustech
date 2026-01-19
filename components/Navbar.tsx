
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onDashboard: () => void;
  onHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onLogout, onDashboard, onHome }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHome}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            PETZEUS<span className="text-blue-500">TECH</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onHome}
            className="hidden md:block text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Home
          </button>
          {user ? (
            <>
              <button 
                onClick={onDashboard}
                className="text-slate-300 hover:text-white transition-colors px-4 py-2"
              >
                {user.role === UserRole.ADMIN ? 'Admin Panel' : 'Dashboard'}
              </button>
              <button 
                onClick={onLogout}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
