
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
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('petzeustech_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsGuest(false);
    localStorage.setItem('petzeustech_user', JSON.stringify(user));
    setShowAuthModal(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem('petzeustech_user');
    setView('home');
  };

  const enterPrototype = () => {
    setIsGuest(true);
    setView('dashboard');
  };

  const renderContent = () => {
    if (view === 'home') {
      return <LandingPage onGetStarted={(planId) => planId ? setShowAuthModal(true) : enterPrototype()} />;
    }

    // Dashboard View
    if (currentUser?.role === UserRole.ADMIN) {
      return <AdminDashboard user={currentUser} />;
    }

    // Use actual user or guest fallback for testing
    const activeUser: User = currentUser || {
      id: 'guest_test',
      name: 'PROTOTYPE GUEST',
      email: 'guest@petzeustech.com',
      role: UserRole.USER,
      status: 'active'
    };

    return <UserDashboard user={activeUser} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={currentUser} 
        onLogin={() => setShowAuthModal(true)} 
        onLogout={handleLogout} 
        onDashboard={() => (currentUser || isGuest) ? setView('dashboard') : enterPrototype()}
        onHome={() => setView('home')}
      />
      
      <main className="flex-grow pt-16 md:pt-20">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-slate-900 py-16 md:py-24 px-6 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <div className="flex flex-col cursor-pointer" onClick={() => { setView('home'); window.scrollTo(0, 0); }}>
              <span className="text-2xl font-black tracking-tighter uppercase leading-none">PETZEUSTECH</span>
              <span className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase leading-none mt-1">UNLIMITED NETWORKS</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed uppercase tracking-tighter">Premium SocksIP payloads for high-speed browsing. Unlimited access nodes.</p>
          </div>
          <div className="flex flex-col md:items-end gap-8 items-center">
            <div className="flex gap-10 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">© 2024 PETZEUSTECH UNLIMITED NETWORKS.</p>
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
