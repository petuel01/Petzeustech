
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

  useEffect(() => {
    const savedUser = localStorage.getItem('petzeustech_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const handleSwitchView = (e: any) => {
      if (e.detail) setView(e.detail);
    };

    window.addEventListener('switchView', handleSwitchView);
    return () => window.removeEventListener('switchView', handleSwitchView);
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

  const navigateToDashboard = () => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setView('dashboard');
    }
  };

  const renderContent = () => {
    if (view === 'home') {
      return (
        <LandingPage 
          user={currentUser}
          onGetStarted={() => {
            if (!currentUser) {
              setShowAuthModal(true);
            } else {
              setView('dashboard');
            }
          }} 
        />
      );
    }

    if (!currentUser) {
      setView('home');
      return null;
    }

    if (currentUser.role === UserRole.ADMIN) {
      return <AdminDashboard user={currentUser} />;
    }

    return <UserDashboard user={currentUser} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Navbar 
        user={currentUser} 
        onLogin={() => setShowAuthModal(true)} 
        onLogout={handleLogout} 
        onDashboard={navigateToDashboard}
        onHome={() => setView('home')}
      />
      
      <main className="flex-grow pt-24">
        {renderContent()}
      </main>

      <footer className="bg-[#0f172a] py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xl font-black text-white uppercase tracking-tighter">PETZEUSTECH</span>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">High-Speed Protocol Delivery Systems</p>
          </div>
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">© 2024 PETZEUSTECH NETWORKS</p>
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
