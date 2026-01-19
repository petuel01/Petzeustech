
import React, { useState, useRef } from 'react';
import { User, SubscriptionStatus } from '../types';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [activeSub, setActiveSub] = useState({
    status: user.isTrialUsed ? SubscriptionStatus.EXPIRED : SubscriptionStatus.NONE,
    expiryDate: user.isTrialUsed ? '2024-12-25' : 'N/A',
    planName: user.isTrialUsed ? 'Trial Pack' : 'No Active Access',
    duration: 2,
  });
  
  const [profilePic, setProfilePic] = useState(user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transId, setTransId] = useState('');
  const [amount, setAmount] = useState('500');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        alert("System profile picture synchronized.");
      };
      reader.readAsDataURL(file);
    }
  };

  const startTrial = () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 2);
    setActiveSub({
      status: SubscriptionStatus.ACTIVE,
      expiryDate: expiry.toISOString().split('T')[0],
      planName: 'Free Trial Pack',
      duration: 2,
    });
    alert("Free Trial activated. Your 48-hour window has started.");
  };

  const handleDownload = () => {
    if (activeSub.status === SubscriptionStatus.EXPIRED) {
        alert("Access Lock: Your trial has expired. Please upgrade to a premium plan.");
        setShowPaymentModal(true);
        return;
    }
    alert(`Establishing secure tunnel... Fetching ${activeSub.planName} .sip file.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      
      {/* Refined Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 glass p-10 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <img 
              src={profilePic} 
              className="relative w-32 h-32 rounded-full object-cover border-4 border-slate-900 shadow-2xl transition-all group-hover:scale-105" 
              alt="Profile" 
            />
            <div className="absolute inset-0 bg-slate-950/70 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
              <span className="text-[10px] font-black text-white mt-1 uppercase tracking-widest">Update</span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePicChange} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Portal: {user.name}</h1>
            <p className="text-slate-400 font-bold">Node Address: <span className="text-blue-400 font-mono">{user.email}</span></p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border ${
            activeSub.status === SubscriptionStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            activeSub.status === SubscriptionStatus.EXPIRED ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
            'bg-slate-800 text-slate-500 border-white/5'
          }`}>
            {activeSub.status}
          </span>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-50">Global Firewall Sync: Active</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          <div className="glass rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-black mb-12 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              Subscription Overview
            </h3>

            {activeSub.status === SubscriptionStatus.NONE && (
                <div className="mb-12 p-10 bg-blue-600/10 border-2 border-dashed border-blue-500/30 rounded-[2.5rem] text-center group transition-all hover:bg-blue-600/20">
                    <h4 className="text-3xl font-black text-blue-400 mb-3">Claim Your 2-Day Pass</h4>
                    <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">Unlock unrestricted .sip configuration files for the next 48 hours. No credit card required.</p>
                    <button 
                        onClick={startTrial} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                    >
                        ACTIVATE TRIAL ACCESS
                    </button>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-10 mb-12">
              <div className="bg-slate-950/60 p-8 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">Active Plan</p>
                <p className="text-4xl font-black text-slate-100">{activeSub.planName}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-xs text-blue-400 font-black uppercase tracking-widest">Valid Tier</span>
                </div>
              </div>
              <div className="bg-slate-950/60 p-8 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">Expires On</p>
                <p className="text-4xl font-black text-slate-100">{activeSub.expiryDate}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-4 uppercase tracking-tighter">Automatic lockdown at expiration</p>
              </div>
            </div>

            <div className={`group relative p-10 rounded-[2.5rem] border transition-all duration-500 ${
              activeSub.status === SubscriptionStatus.ACTIVE 
                ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex gap-8 items-center">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 ${
                    activeSub.status === SubscriptionStatus.ACTIVE ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-slate-800'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-black text-2xl mb-2">Node Configuration</h4>
                    <p className="text-sm text-slate-500 max-w-xs leading-tight">Latest encrypted .sip file for your tier. Optimized for current 4-day cycle.</p>
                  </div>
                </div>
                
                {activeSub.status === SubscriptionStatus.EXPIRED ? (
                  <button 
                    onClick={() => { setShowPaymentModal(true); setAmount('500'); }}
                    className="px-12 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-red-500/30 transition-all hover:-translate-y-1 active:scale-95 animate-pulse-soft"
                  >
                    TRIAL EXPIRED — UPGRADE
                  </button>
                ) : (
                  <button 
                    onClick={handleDownload}
                    disabled={activeSub.status !== SubscriptionStatus.ACTIVE}
                    className={`px-12 py-5 rounded-2xl font-black text-lg transition-all ${
                      activeSub.status === SubscriptionStatus.ACTIVE 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/30 hover:-translate-y-1 active:scale-95' 
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    DOWNLOAD CONFIG
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="glass rounded-[3rem] p-10 shadow-2xl h-full">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              Go Premium
            </h3>
            
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => { setShowPaymentModal(true); setAmount('1500'); }}
                className="group relative w-full py-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.03]"
              >
                PRO ACCESS (15D) — 1,500 FRS
              </button>
              
              <button 
                onClick={() => { setShowPaymentModal(true); setAmount('3000'); }}
                className="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-3xl font-black transition-all hover:scale-[1.03]"
              >
                ELITE ACCESS (30D) — 3,000 FRS
              </button>
              
              <div className="mt-12 pt-12 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 text-center">Certified Payment Nodes</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-950/50 rounded-3xl border border-white/5 flex flex-col items-center gap-3">
                     <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm shadow-xl shadow-yellow-500/10">MTN</div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MoMo</span>
                  </div>
                  <div className="p-5 bg-slate-950/50 rounded-3xl border border-white/5 flex flex-col items-center gap-3">
                     <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xl shadow-orange-500/10">OM</div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orange</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative glass w-full max-w-xl rounded-[3.5rem] p-12 shadow-3xl">
            <h2 className="text-4xl font-black mb-3 tracking-tight text-center">Secure Payment</h2>
            <p className="text-slate-400 mb-12 text-center font-medium">Verify your transaction to unlock premium access.</p>
            
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 mb-10 text-center">
              <p className="text-xs text-blue-400 font-black uppercase mb-3 tracking-widest">Official Receiver</p>
              <p className="text-4xl font-mono text-white font-black tracking-tighter">+237 6XX XXX XXX</p>
              <p className="text-[10px] text-slate-500 mt-4 font-black uppercase tracking-widest">PetZeusTech Networks Verification Node</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Receipt transmitted. System awaiting node verification.'); setShowPaymentModal(false); }} className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-widest">Select Tier</label>
                <select 
                  className="bg-slate-950 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500 text-slate-100 font-black appearance-none cursor-pointer"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                >
                  <option value="500">3 Days Access (500 FRS)</option>
                  <option value="1000">7 Days Access (1000 FRS)</option>
                  <option value="1500">15 Days Access (1500 FRS)</option>
                  <option value="3000">30 Days Access (3000 FRS)</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-widest">Transaction ID (TxID)</label>
                <input 
                  type="text" 
                  value={transId}
                  onChange={(e) => setTransId(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500 text-slate-100 font-mono placeholder:text-slate-800 font-bold" 
                  placeholder="ID from SMS confirmation"
                  required
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-3xl font-black text-xl mt-6 shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest">
                VERIFY TRANSACTION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
