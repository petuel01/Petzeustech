
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
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminLogin && emailRef.current) emailRef.current.focus();
  }, [isAdminLogin]);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      // Production: Google OAuth handshake
      const res = await fetch('./backend/auth_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'authorized@petzeustech.com', name: 'Network User' })
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.user);
      }
    } catch (e) {
      alert("Handshake failed. Security node unreachable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const performAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (email === 'admin@petzeustech.com' && password === 'admin123') {
        onSuccess({
          id: 'admin_1',
          name: 'Master Architect',
          email: 'admin@petzeustech.com',
          role: UserRole.ADMIN,
          status: 'active'
        });
      } else {
        alert("Credentials rejected by security cluster.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-10 border border-white/10 shadow-3xl overflow-hidden">
        {isSubmitting && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Synchronizing Identity</p>
          </div>
        )}

        <h2 className="text-xl font-black text-white uppercase mb-8 text-center tracking-tighter">Authorized Identity</h2>

        {!isAdminLogin ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <button 
              onClick={() => setIsAdminLogin(true)}
              className="w-full py-3 bg-white/5 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10"
            >
              Administrator Terminal
            </button>
          </div>
        ) : (
          <form onSubmit={performAdminLogin} className="flex flex-col gap-4">
            <input 
              ref={emailRef}
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-slate-950 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-blue-500"
              placeholder="Admin Email"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-slate-950 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-blue-500"
              placeholder="Security Key"
              required
            />
            <button type="submit" className="bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest mt-2 shadow-xl">Authorize</button>
            <button type="button" onClick={() => setIsAdminLogin(false)} className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">Back to Handshake</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
