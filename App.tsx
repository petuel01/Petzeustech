
import React, { useState, useEffect } from 'react';
import { User, UserRole, SubscriptionStatus } from './types';
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

      <footer className="bg-slate-900 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">P</div>
            <span className="text-xl font-bold tracking-tight">PETZEUSTECH<span className="text-blue-500">NETWORKS</span></span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 PetZeusTech Networks. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-blue-400">Terms</a>
            <a href="#" className="hover:text-blue-400">Privacy</a>
            <a href="#" className="hover:text-blue-400">Support</a>
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
