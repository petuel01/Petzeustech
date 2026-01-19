
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
    setStatusMsg('Synchronizing Identity...');
    
    const mockGoogleUser = {
      id: 'goog_' + Math.random().toString(36).substr(2, 9),
      name: 'User ' + Math.floor(Math.random() * 1000),
      email: 'user' + Math.floor(Math.random() * 1000) + '@gmail.com'
    };

    try {
      // Try real backend first
      const response = await fetch('./backend/auth_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleUser)
      });

      if (!response.ok) throw new Error('Backend not found');
      const result = await response.json();
      onSuccess(result.user);
    } catch (err) {
      // FALLBACK: Simulation Mode for Preview
      console.log("Switching to Simulation Mode (No PHP Backend Detected)");
      setTimeout(() => {
        onSuccess({
          ...mockGoogleUser,
          role: UserRole.USER,
          status: 'active'
        });
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const performAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Verifying Clearance...');
    
    setTimeout(() => {
      if ((email === 'admin@petzeustech.com' && password === 'admin123') || (email === 'admin' && password === 'admin')) {
        const adminUser: User = {
          id: 'admin_001',
          name: 'Super Admin',
          email: 'admin@petzeustech.com',
          role: UserRole.ADMIN,
          status: 'active'
        };
        onSuccess(adminUser);
      } else {
        alert('Invalid admin credentials.');
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass w-full max-w-md rounded-[3rem] p-10 shadow-3xl overflow-hidden border-white/10">
        {isSubmitting && (
          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">{statusMsg}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              {isAdminLogin ? 'Admin' : 'Join'} Portal
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Node Authorization Required</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {!isAdminLogin ? (
          <div className="flex flex-col gap-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-4 w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
              Continue with Google
            </button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] font-black"><span className="px-4 bg-slate-900 text-slate-600 uppercase tracking-widest">Protocol Split</span></div>
            </div>

            <button 
              onClick={() => setIsAdminLogin(true)}
              className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Staff Access Terminal
            </button>
            
            <p className="text-center text-slate-600 text-[10px] font-bold mt-4 leading-relaxed uppercase tracking-wider">
              Access to PetZeusTech Networks implies agreement with the Matrix Protocol.
            </p>
          </div>
        ) : (
          <form onSubmit={performAdminLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Admin Identifier</label>
              <input 
                ref={emailRef}
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 transition-colors text-white font-bold" 
                placeholder="admin@petzeustech.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 transition-colors text-white font-bold" 
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest mt-4 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              Authorize Admin Clearance
            </button>
            
            <button 
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors text-center mt-4"
            >
              ← Back to Identity Sync
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
