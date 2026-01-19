
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
    if (isAdminLogin && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isAdminLogin]);

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    // Simulated Google OAuth delay
    setTimeout(() => {
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        status: 'active'
      };
      onSuccess(mockUser);
    }, 800);
  };

  const performAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    // Simulated backend check
    setTimeout(() => {
      if (email === 'admin@petzeustech.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin_001',
          name: 'Super Admin',
          email: 'admin@petzeustech.com',
          role: UserRole.ADMIN,
          status: 'active'
        };
        onSuccess(adminUser);
      } else {
        alert('Invalid admin credentials. Use admin@petzeustech.com / admin123');
        setIsSubmitting(false);
      }
    }, 600);
  };

  const useDemoAdmin = () => {
    setEmail('admin@petzeustech.com');
    setPassword('admin123');
    // Immediate login after filling
    setTimeout(() => {
      const adminUser: User = {
        id: 'admin_001',
        name: 'Super Admin',
        email: 'admin@petzeustech.com',
        role: UserRole.ADMIN,
        status: 'active'
      };
      onSuccess(adminUser);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl overflow-hidden">
        {isSubmitting && (
          <div className="absolute inset-0 bg-slate-950/50 z-10 flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isAdminLogin ? 'Admin Portal' : 'Join PetZeusTech'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {!isAdminLogin ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
              Continue with Google
            </button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">OR</span></div>
            </div>

            <button 
              onClick={() => setIsAdminLogin(true)}
              className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
            >
              Staff / Admin Access
            </button>
            
            <p className="text-center text-slate-500 text-xs mt-4 leading-relaxed">
              By continuing, you agree to our Terms of Service and recognize that PetZeusTech Networks is a subscription-based utility.
            </p>
          </div>
        ) : (
          <form onSubmit={performAdminLogin} className="flex flex-col gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-2">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Testing Credentials</p>
              <p className="text-sm text-slate-300">Email: <span className="text-white font-mono">admin@petzeustech.com</span></p>
              <p className="text-sm text-slate-300">Pass: <span className="text-white font-mono">admin123</span></p>
              <button 
                type="button"
                onClick={useDemoAdmin}
                className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all"
              >
                Quick Demo Login
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-400">Admin Email</label>
              <input 
                ref={emailRef}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" 
                placeholder="admin@petzeustech.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-400">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" 
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-lg font-bold mt-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              Login as Admin
            </button>
            
            <button 
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors text-center mt-2"
            >
              ← Back to User Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
