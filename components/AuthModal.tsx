
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
  onGuestAccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, onGuestAccess }) => {
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
    setStatusMsg('Synchronizing Google Node...');
    
    // Test Mode Bypass
    setTimeout(() => {
        onSuccess({
            id: 'mock_' + Math.random().toString(36).substr(2, 9),
            name: 'AUTHORIZED TESTER',
            email: 'user@zeustest.com',
            role: UserRole.USER,
            status: 'active'
        });
    }, 1200);
  };

  const performAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Checking clearance...');
    
    setTimeout(() => {
      if ((email === 'admin@petzeustech.com' && password === 'admin123') || (email === 'admin' && password === 'admin')) {
        onSuccess({
          id: 'admin_001',
          name: 'Master Architect',
          email: 'admin@petzeustech.com',
          role: UserRole.ADMIN,
          status: 'active'
        });
      } else {
        alert('Credentials rejected by cluster security.');
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-3xl overflow-hidden border border-white/10">
        {isSubmitting && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center backdrop-blur-xl">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">{statusMsg}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-black uppercase tracking-tighter text-white">IDENTITY AUTH</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {!isAdminLogin ? (
          <div className="flex flex-col gap-6">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-4 w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
              Sign in with Google
            </button>
            
            <button 
                onClick={() => { onGuestAccess(); onClose(); }}
                className="w-full py-5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 hover:text-white transition-all shadow-lg"
            >
                Bypass Login (Prototype Mode)
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold"><span className="px-5 bg-slate-900 text-slate-600 uppercase tracking-widest">OR</span></div>
            </div>

            <button 
              onClick={() => setIsAdminLogin(true)}
              className="w-full py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              ADMIN TERMINAL
            </button>
          </div>
        ) : (
          <form onSubmit={performAdminLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ARCHITECT EMAIL</label>
              <input 
                ref={emailRef}
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-2xl p-4.5 outline-none focus:border-blue-500 transition-colors text-white font-bold text-sm" 
                placeholder="admin@petzeustech.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">SECURITY KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-2xl p-4.5 outline-none focus:border-blue-500 transition-colors text-white font-bold text-sm" 
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary text-white py-5 rounded-2xl font-black text-xs uppercase mt-2 shadow-2xl active:scale-95">
              AUTHORIZE ACCESS
            </button>
            
            <button 
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors text-center mt-4"
            >
              ← RETURN TO CLUSTER
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
