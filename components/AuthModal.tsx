
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminLogin && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isAdminLogin]);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setStatusMsg('Signing in...');
    
    const mockGoogleUser = {
      id: 'goog_' + Math.random().toString(36).substr(2, 9),
      name: 'User ' + Math.floor(Math.random() * 1000),
      email: 'user' + Math.floor(Math.random() * 1000) + '@gmail.com'
    };

    try {
      const response = await fetch('./backend/auth_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleUser)
      });

      if (!response.ok) throw new Error('Backend not found');
      const result = await response.json();
      onSuccess(result.user);
    } catch (err) {
      console.log("Using local simulation...");
      setTimeout(() => {
        onSuccess({
          ...mockGoogleUser,
          role: UserRole.USER,
          status: 'active'
        });
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const performAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Verifying credentials...');
    
    setTimeout(() => {
      if ((email === 'admin@petzeustech.com' && password === 'admin123') || (email === 'admin' && password === 'admin')) {
        const adminUser: User = {
          id: 'admin_001',
          name: 'Administrator',
          email: 'admin@petzeustech.com',
          role: UserRole.ADMIN,
          status: 'active'
        };
        onSuccess(adminUser);
      } else {
        alert('Incorrect login details.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass w-full max-w-md rounded-[2rem] p-6 md:p-10 shadow-3xl overflow-hidden border-white/10">
        {isSubmitting && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center backdrop-blur-md">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">{statusMsg}</p>
          </div>
        )}
        
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {!isAdminLogin ? (
          <div className="flex flex-col gap-5">
            <button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold"><span className="px-3 bg-slate-900 text-slate-500 uppercase tracking-widest">or</span></div>
            </div>

            <button 
              onClick={() => setIsAdminLogin(true)}
              className="w-full py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-bold text-xs hover:bg-white/10 transition-all"
            >
              Admin Login
            </button>
            
            <p className="text-center text-slate-500 text-[10px] font-medium mt-2 leading-relaxed uppercase tracking-wider">
              By logging in, you agree to our terms of service.
            </p>
          </div>
        ) : (
          <form onSubmit={performAdminLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <input 
                ref={emailRef}
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl p-3.5 outline-none focus:border-blue-500 transition-colors text-white font-medium text-sm" 
                placeholder="admin@petzeustech.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl p-3.5 outline-none focus:border-blue-500 transition-colors text-white font-medium text-sm" 
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-white py-4 rounded-xl font-bold text-sm uppercase mt-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              Login as Admin
            </button>
            
            <button 
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-slate-300 transition-colors text-center mt-2"
            >
              ← Back to Google Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
