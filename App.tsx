
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [view, setView] = useState<'home' | 'dashboard'>('home');

  // Persistence simulation
  useEffect(() => {
    const savedUser = localStorage.getItem('petzeustech_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('petzeustech_user', JSON.stringify(user));
    setShowAuthModal(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('petzeustech_user');
    setView('home');
  };

  const renderContent = () => {
    if (view === 'home') {
      return <LandingPage onGetStarted={() => currentUser ? setView('dashboard') : setShowAuthModal(true)} />;
    }

    if (currentUser?.role === UserRole.ADMIN) {
      return <AdminDashboard user={currentUser} />;
    }

    return <UserDashboard user={currentUser!} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={currentUser} 
        onLogin={() => setShowAuthModal(true)} 
        onLogout={handleLogout} 
        onDashboard={() => setView('dashboard')}
        onHome={() => setView('home')}
      />
      
      <main className="flex-grow pt-16">
        {renderContent()}
      </main>

      <footer className="bg-slate-900 py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20">P</div>
              <div className="flex flex-col -gap-1">
                <span className="text-2xl font-black tracking-tighter uppercase leading-none">PETZEUSTECH</span>
                <span className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase leading-none">UNLIMITED NETWORKS</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">Beyond network limits. The global standard for high-performance tunneling configurations and network architecture mastery.</p>
          </div>
          <div className="flex flex-col md:items-end gap-6">
            <div className="flex gap-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Matrix</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Shield</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Support Portal</a>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">© 2024 PETZEUSTECH UNLIMITED NETWORKS. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;
