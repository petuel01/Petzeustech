
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
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Detect environment
    const isProd = window.location.hostname !== 'localhost' && !window.location.hostname.includes('webcontainer');
    setIsProduction(isProd);

    const savedUser = localStorage.getItem('petzeustech_user');
    const guestMode = localStorage.getItem('petzeustech_guest') === 'true';
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else if (guestMode) {
      setIsGuest(true);
    }

    const handleSwitchView = (e: any) => {
      if (e.detail) setView(e.detail);
    };

    window.addEventListener('switchView', handleSwitchView);
    return () => window.removeEventListener('switchView', handleSwitchView);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsGuest(false);
    localStorage.setItem('petzeustech_user', JSON.stringify(user));
    localStorage.removeItem('petzeustech_guest');
    setShowAuthModal(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem('petzeustech_user');
    localStorage.removeItem('petzeustech_guest');
    setView('home');
  };

  const enterPrototype = () => {
    setIsGuest(true);
    localStorage.setItem('petzeustech_guest', 'true');
    setView('dashboard');
  };

  const renderContent = () => {
    if (view === 'home') {
      return <LandingPage onGetStarted={(planId) => planId ? setShowAuthModal(true) : enterPrototype()} />;
    }

    if (currentUser?.role === UserRole.ADMIN) {
      return <AdminDashboard user={currentUser} />;
    }

    const activeUser: User = currentUser || {
      id: 'tester_guest',
      name: 'GUEST TESTER',
      email: 'test@petzeustech.com',
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
      
      {isProduction && (
        <div className="fixed bottom-4 left-4 z-[200]">
           <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">LIVE NODE ACTIVE</span>
        </div>
      )}

      {!isProduction && (
        <div className="fixed bottom-4 left-4 z-[200]">
           <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">PROTOTYPE SIMULATION</span>
        </div>
      )}
      
      <main className="flex-grow pt-24">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-[#0f172a] py-16 px-6 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <span className="text-2xl font-black text-white uppercase tracking-tighter">PETZEUSTECH</span>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Premium High-Speed Network Solutions</p>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">© 2024 PETZEUSTECH NETWORKS</p>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleLogin} 
          onGuestAccess={enterPrototype}
        />
      )}
    </div>
  );
};

export default App;
