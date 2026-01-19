
import React, { useState, useEffect } from 'react';
import { User, SubscriptionStatus, TutorialStep } from '../types';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem(`sub_${user.email}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.expiryTimestamp && Date.now() > data.expiryTimestamp) {
        return { tier: 'DISCONNECTED', status: SubscriptionStatus.NONE, expiry: 'Expired' };
      }
      return data;
    }
    return { tier: 'DISCONNECTED', status: SubscriptionStatus.NONE, expiry: 'N/A' };
  });

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isTrialUsed, setIsTrialUsed] = useState(!!user.isTrialUsed);
  const [tutorials, setTutorials] = useState<TutorialStep[]>([]);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await fetch('./backend/tutorials_api.php');
        const data = await res.json();
        setTutorials(data || []);
      } catch (err) { console.error("Matrix error."); }
    };
    fetchTutorials();
  }, []);

  useEffect(() => {
    if (subscription.expiryTimestamp) {
      const interval = setInterval(() => {
        const diff = subscription.expiryTimestamp - Date.now();
        if (diff <= 0) {
          setTimeLeft('EXPIRED');
          setSubscription({ tier: 'DISCONNECTED', status: SubscriptionStatus.NONE, expiry: 'Expired' });
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription.expiryTimestamp]);

  const handleClaimTrial = () => {
    if (isTrialUsed) {
      alert("Terminal blocked: One 24H trial allowed per identity.");
      return;
    }
    
    const expiryTimestamp = Date.now() + (24 * 60 * 60 * 1000);
    const subData = {
      tier: '24H ORANGE TRIAL',
      status: SubscriptionStatus.ACTIVE,
      expiryTimestamp: expiryTimestamp,
      network: 'ORANGE'
    };
    
    setSubscription(subData);
    setIsTrialUsed(true);
    user.isTrialUsed = true;
    localStorage.setItem(`sub_${user.email}`, JSON.stringify(subData));
    localStorage.setItem('petzeustech_user', JSON.stringify(user));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-12 animate-fade-in">
      {/* Account Terminal Header */}
      <div className="bg-slate-900 p-8 md:p-14 rounded-[4rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-orange-500 to-transparent"></div>
        <div className="flex items-center gap-10">
          <div className="w-24 h-24 rounded-[2.5rem] bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-2xl">
             <span className="text-4xl font-black text-blue-500">{user.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">{user.name}</h1>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Identity: {user.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="bg-blue-600/10 px-12 py-5 rounded-3xl border border-blue-500/20 text-center shadow-lg">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">NETWORK SYNC</p>
            <p className="text-2xl font-black text-blue-400 uppercase tracking-tighter">{subscription.tier}</p>
          </div>
          {subscription.expiryTimestamp && (
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">REMAINING: {timeLeft}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Main Sync Terminal */}
          <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-12">
               <h3 className="text-2xl font-black uppercase text-white tracking-tighter">TERMINAL HUB</h3>
               <div className="flex gap-3">
                 <span className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">ORANGE UNLIMITED</span>
                 <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">MTN 200MB</span>
               </div>
             </div>
             
             {subscription.status === SubscriptionStatus.NONE && !isTrialUsed && (
               <div className="bg-emerald-600/5 border border-emerald-500/20 p-12 rounded-[3rem] text-center mb-12 animate-fade-in-up">
                  <h4 className="text-2xl font-black text-emerald-500 uppercase mb-4 tracking-tighter">PROTOTYPE MODE ACTIVE</h4>
                  <p className="text-slate-400 text-xs mb-10 uppercase font-bold tracking-[0.2em]">ACTIVATE ONE-TIME 24H ACCESS SYNC FOR TESTING.</p>
                  <button onClick={handleClaimTrial} className="bg-emerald-600 text-white px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">INITIALIZE SYNC</button>
               </div>
             )}

             <div className="p-14 border-2 border-dashed border-white/10 rounded-[4rem] bg-slate-950/60 text-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-28 h-28 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-blue-500 border border-blue-500/10 group-hover:scale-110 transition-all duration-700">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
                <h4 className="text-2xl font-black mb-12 uppercase tracking-tighter text-white">PAYLOAD SYNC CENTER</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  <div className="p-7 bg-slate-900/80 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">ORANGE PAYLOAD</p>
                    <p className="text-sm font-black text-white uppercase tracking-tighter">UNLIMITED ACCESS SYNC</p>
                  </div>
                  <div className="p-7 bg-slate-900/80 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">MTN PAYLOAD</p>
                    <p className="text-sm font-black text-white uppercase tracking-tighter">200MB DAILY REFRESH</p>
                  </div>
                </div>

                <button 
                  disabled={subscription.status !== SubscriptionStatus.ACTIVE}
                  onClick={() => alert("Synchronizing payload from cluster...")}
                  className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl ${subscription.status === SubscriptionStatus.ACTIVE ? 'btn-primary text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
                >
                  {subscription.status === SubscriptionStatus.ACTIVE ? 'DOWNLOAD ACTIVE PAYLOAD' : 'PAYLOAD LOCKED'}
                </button>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
           <div className="bg-slate-900/80 p-10 rounded-[4rem] border border-white/5 shadow-2xl">
              <h3 className="text-2xl font-black uppercase mb-10 text-white tracking-tighter text-center">MENTORSHIP HUB</h3>
              <div className="bg-emerald-600/10 border border-emerald-500/30 p-8 rounded-[2rem] mb-8 group hover:bg-emerald-600/20 transition-all">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">SYSTEM ARCHITECTURE</p>
                 <h5 className="text-white font-black uppercase text-base mb-4">Learn To Create Files</h5>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 uppercase tracking-tight">Master the SocksIP protocol. Join the Mastery Tier to unlock direct technical training from the PETZEUSTECH team.</p>
                 <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg group-hover:scale-105 transition-all">UPGRADE TO MASTERY</button>
              </div>
              <div className="flex flex-col gap-6 opacity-30 text-center py-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em]">Tutorial Matrix Idle...</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
