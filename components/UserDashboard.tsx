
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [subscription, setSubscription] = useState<any>(() => {
    const saved = localStorage.getItem(`sub_${user.email}`);
    if (saved) return JSON.parse(saved);
    return { tier: 'PENDING ACTIVATION', status: 'INACTIVE' };
  });

  const [timeLeft, setTimeLeft] = useState<string>('00d 00h 00m 00s');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (subscription.expiryTimestamp && subscription.status === 'ACTIVE' && subscription.id !== 'master') {
      const interval = setInterval(() => {
        const diff = subscription.expiryTimestamp - Date.now();
        if (diff <= 0) {
          setTimeLeft('EXPIRED');
          setSubscription((prev: any) => ({ ...prev, status: 'EXPIRED' }));
          clearInterval(interval);
        } else {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${d}d ${h}h ${m}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (subscription.id === 'master' && subscription.status === 'ACTIVE') {
      setTimeLeft('PERMANENT ARCHITECT ACCESS');
    }
  }, [subscription]);

  const handleDownload = () => {
    setIsImporting(true);
    // Force a slight delay for "encryption" effect
    setTimeout(() => {
      window.location.href = `./backend/download.php`;
      setIsImporting(false);
    }, 1500);
  };

  const isMaster = subscription.id === 'master';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      {/* Header Profile - Elite Styling */}
      <div className="bg-[#0f172a] p-10 rounded-[3rem] border-2 border-white/5 flex flex-col md:flex-row justify-between items-center shadow-3xl">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center font-black text-3xl text-white shadow-xl shadow-blue-500/20">
            {user.name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{user.name}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
        
        <div className="text-center md:text-right mt-8 md:mt-0">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">CONNECTION LIFETIME</p>
          <p className={`text-2xl font-black font-mono tracking-widest ${isMaster ? 'text-purple-400' : 'text-blue-400'}`}>
            {subscription.status === 'ACTIVE' ? timeLeft : 'AWAITING AUTHORIZATION'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Protocol Retrieval Node */}
        <div className="bg-[#0f172a] p-12 rounded-[3rem] border-2 border-white/5 shadow-3xl flex flex-col justify-center text-center">
          <h3 className="text-xl font-black text-white uppercase mb-8 tracking-widest">Protocol Retrieval</h3>
          {subscription.status === 'ACTIVE' ? (
            <div className="flex flex-col gap-6">
              <button 
                onClick={handleDownload}
                disabled={isImporting}
                className={`px-10 py-7 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50 ${isMaster ? 'bg-purple-600 text-white hover:shadow-purple-500/20' : 'bg-emerald-600 text-white hover:shadow-emerald-500/20'}`}
              >
                {isImporting ? 'ENCRYPTING PAYLOAD...' : isMaster ? 'DOWNLOAD MASTER .SIP' : 'DOWNLOAD .SIP PAYLOAD'}
              </button>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isMaster ? 'ARCHITECT LICENSE: UNRESTRICTED' : 'AUTHORIZED FOR SINGLE NODE ONLY'}
              </p>
            </div>
          ) : (
            <div className="p-10 border-4 border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-6">
              <div className="w-12 h-12 bg-orange-600/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-6V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <p className="text-orange-500 font-black uppercase text-xs tracking-widest">PENDING VERIFICATION</p>
              <p className="text-[9px] text-slate-600 uppercase font-black text-center max-w-xs">
                Your payment ID has been sent to the Admin. Secure resources will unlock upon confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Configuration Details - Host requirement fulfilled here */}
        <div className="bg-[#0f172a] p-12 rounded-[3rem] border-2 border-white/5 shadow-3xl">
          <h3 className="text-xl font-black text-white uppercase mb-8 tracking-widest">Protocol Specifications</h3>
          {subscription.status === 'ACTIVE' ? (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                 <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Configuration Host</p>
                 <p className="text-base font-black text-blue-400 font-mono">petzeustech.duckdns.org</p>
              </div>
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                 <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Node Encryption</p>
                 <p className="text-base font-black text-blue-400 font-mono">AES-256 GCM Tunnel</p>
              </div>
              {isMaster && (
                <div className="bg-purple-600/10 p-6 rounded-2xl border border-purple-500/20">
                   <p className="text-[10px] font-black text-purple-400 uppercase mb-2 tracking-widest">Architect Privilege</p>
                   <p className="text-[11px] text-white font-bold leading-relaxed uppercase">
                     FULL FILE CREATION MENTORSHIP ACTIVE. USE <span className="text-purple-400">petzeustech.duckdns.org</span> FOR ALL CUSTOM SNI/HOST SETTINGS.
                   </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-10 py-12">
               <svg className="w-16 h-16 text-white mb-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
               <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">LOCKED CONTENT</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
