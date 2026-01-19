
import React, { useState, useEffect } from 'react';
import { User, SubscriptionStatus } from '../types';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [subscription, setSubscription] = useState<any>(() => {
    const saved = localStorage.getItem(`sub_${user.email}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.expiryTimestamp && Date.now() > data.expiryTimestamp) {
        return { tier: 'EXPIRED', status: 'INACTIVE', expiry: 'Expired' };
      }
      return data;
    }
    // Default mock for trial if nothing saved
    return { tier: 'NO ACTIVE ACCESS', status: 'INACTIVE', expiry: 'N/A' };
  });

  const [timeLeft, setTimeLeft] = useState<string>('00d 00h 00m 00s');
  const [isImporting, setIsImporting] = useState(false);
  const [systemStatus, setSystemStatus] = useState('READY');

  useEffect(() => {
    if (subscription.expiryTimestamp && subscription.status === 'ACTIVE') {
      const interval = setInterval(() => {
        const diff = subscription.expiryTimestamp - Date.now();
        if (diff <= 0) {
          setTimeLeft('EXPIRED');
          setSubscription((prev: any) => ({ ...prev, status: 'INACTIVE', tier: 'EXPIRED' }));
          clearInterval(interval);
        } else {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${d.toString().padStart(2, '0')}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription.expiryTimestamp, subscription.status]);

  const handleSecureImport = async () => {
    setIsImporting(true);
    setSystemStatus('ENCRYPTING PAYLOAD...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const fileName = `PetZeus_${subscription.network || 'NODE'}_${Date.now()}.sip`;
      const dummyContent = "PETZEUS_SECURE_V4_PROTOCOL_DATA_" + btoa(Math.random().toString());
      const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
      const file = new File([blob], fileName, { type: 'application/octet-stream' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'SocksIP Configuration',
          text: 'Importing PetZeus High-Speed Configuration.',
        });
        setSystemStatus('IMPORT SUCCESSFUL');
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("DIRECT IMPORT HINT: Standard download triggered. Please open your Downloads and 'Open With' SocksIP.");
        setSystemStatus('DOWNLOADED');
      }
    } catch (error) {
      console.error('Import process interrupted', error);
      setSystemStatus('READY');
    } finally {
      setTimeout(() => {
        setIsImporting(false);
        setSystemStatus('READY');
      }, 2000);
    }
  };

  const handleUpgrade = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'pricing';
      // If we are already on dashboard, we might need to notify App to switch view
      window.dispatchEvent(new CustomEvent('switchView', { detail: 'home' }));
      setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 animate-fade-in">
      {/* Header Info Bar */}
      <div className="bg-[#0f172a] p-10 md:p-14 rounded-[4rem] border-2 border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 shadow-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="relative">
             <div className="w-24 h-24 rounded-[2.5rem] bg-blue-600 flex items-center justify-center font-black text-4xl text-white shadow-2xl border-4 border-slate-900 overflow-hidden">
                {user.profilePic ? <img src={user.profilePic} alt="User" /> : user.name[0]}
             </div>
             <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center ${subscription.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                <div className={`w-2 h-2 bg-white rounded-full ${subscription.status === 'ACTIVE' ? 'animate-ping' : ''}`}></div>
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{user.name}</h1>
               <span className="bg-white/5 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500 tracking-widest uppercase border border-white/5">NODE 01</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">SECURE ID: {user.email}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-5 relative z-10">
           <div className="bg-blue-600/10 px-12 py-6 rounded-[2rem] border-2 border-blue-500/20 text-center shadow-inner relative group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CURRENT NETWORK TIER</p>
              <p className="text-3xl font-black text-blue-400 uppercase tracking-tighter transition-all group-hover:tracking-widest">{subscription.tier}</p>
           </div>
           
           {subscription.expiryTimestamp && subscription.status === 'ACTIVE' && (
             <div className="flex flex-col items-center md:items-end gap-2">
                <div className="bg-emerald-500/5 px-10 py-5 rounded-3xl border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] text-center min-w-[240px] group transition-all hover:bg-emerald-500/10">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-2 group-hover:scale-110 transition-transform">ACCESS TIME REMAINING</p>
                   <p className="text-2xl font-black text-white font-mono tracking-widest text-glow leading-none">
                      {timeLeft}
                   </p>
                </div>
                <div className="flex items-center gap-2 mr-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ENCRYPTION SYNC: NOMINAL</span>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Connection Terminal */}
          <div className="bg-[#0f172a] p-12 rounded-[4rem] border-2 border-white/5 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            </div>

            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex flex-col">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Connection Terminal</h3>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">SocksIP Payload Generator</p>
              </div>
            </div>
            
            {subscription.status !== 'ACTIVE' ? (
              <div className="bg-orange-600/5 border-2 border-orange-500/20 p-16 rounded-[4rem] text-center shadow-inner relative z-10 flex flex-col items-center">
                <p className="text-orange-500 font-black uppercase text-2xl mb-6 tracking-tighter">Node Access Expired</p>
                <p className="text-slate-400 text-sm mb-12 font-bold uppercase tracking-widest leading-relaxed max-w-sm">Activation is required to release the network configuration payload.</p>
                <button 
                  onClick={handleUpgrade} 
                  className="bg-orange-600 text-white px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-500 active:scale-95 transition-all"
                >
                  Activate New Node
                </button>
              </div>
            ) : (
              <div className="p-12 md:p-16 border-4 border-dashed border-white/5 rounded-[5rem] bg-slate-950/40 text-center group transition-all hover:border-blue-500/30 relative z-10">
                <div className="w-32 h-32 bg-blue-600/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-blue-500 border-2 border-blue-500/10 group-hover:rotate-12 transition-transform duration-1000 shadow-2xl">
                  {isImporting ? (
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  )}
                </div>
                <h4 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Protocol Sync Active</h4>
                <p className="text-slate-500 text-[11px] mb-16 font-black uppercase tracking-[0.4em]">{systemStatus}</p>
                
                <div className="grid gap-6 max-w-md mx-auto">
                  <button 
                    onClick={handleSecureImport}
                    disabled={isImporting}
                    className="w-full py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-[16px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-500 active:scale-95 transition-all border-b-8 border-black/20"
                  >
                    {isImporting ? 'SYNCHRONIZING...' : 'DIRECT IMPORT (NO SAVE)'}
                  </button>
                  <button 
                    onClick={handleUpgrade}
                    className="w-full py-5 text-blue-400 font-black text-[11px] uppercase tracking-widest hover:text-white transition-all"
                  >
                    Upgrade / Renew Node
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-slate-900/30 p-10 rounded-[4rem] border border-white/5 shadow-inner">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Real-Time Activation Log</h4>
             </div>
             <div className="flex flex-col gap-6 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] opacity-50 uppercase">Timestamp</span>
                      <span className="text-emerald-500 uppercase">{subscription.expiryTimestamp ? new Date(subscription.expiryTimestamp - (subscription.days || 1) * 86400000).toLocaleString() : 'PENDING'}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[9px] opacity-50 uppercase block">Event</span>
                      <span className="font-bold">NODE_INITIALIZED</span>
                   </div>
                </div>
                <div className="flex justify-between items-center text-slate-400 pb-2">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] opacity-50 uppercase">Status</span>
                      <span className={`font-black tracking-widest ${subscription.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>{subscription.status}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-10">
          <div className="bg-[#0f172a] p-10 md:p-12 rounded-[4rem] border-2 border-white/5 shadow-3xl group overflow-hidden relative">
             <h3 className="text-2xl font-black text-white uppercase mb-10 tracking-tighter text-center">Mentorship Hub</h3>
             <div className="bg-emerald-600/5 border-2 border-emerald-500/20 p-10 rounded-[3.5rem] text-center transition-all hover:bg-emerald-600/10 relative z-10">
                <p className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.5em] mb-4">FASTER LEARNING</p>
                <h5 className="text-white font-black text-xl mb-4 leading-tight uppercase tracking-tighter">Private Clusters</h5>
                <p className="text-slate-400 text-[11px] font-bold uppercase leading-relaxed mb-10 tracking-[0.15em] opacity-80">Stop buying files. Build your own. Join the Elite Mentorship program today.</p>
                <button 
                  onClick={() => {
                    const el = document.getElementById('mentorship');
                    if(el) el.scrollIntoView({behavior:'smooth'});
                    else {
                      window.location.hash = 'mentorship';
                      window.dispatchEvent(new CustomEvent('switchView', { detail: 'home' }));
                    }
                  }}
                  className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all border-b-4 border-black/20 active:scale-95"
                >
                  Join Mastery Tier
                </button>
             </div>
          </div>
          
          <div className="bg-slate-950/50 p-8 rounded-[3rem] border border-white/5">
             <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 text-center">System Clusters</h4>
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">MTN POOL</span>
                   <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">ONLINE</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ORANGE POOL</span>
                   <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">ONLINE</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
