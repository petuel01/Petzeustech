
import React, { useState, useEffect } from 'react';
import { User, SubscriptionStatus, TutorialStep } from '../types';

interface UserDashboardProps {
  user: User;
}

type PaymentState = 'IDLE' | 'SELECT_METHOD' | 'MOMO_MANUAL' | 'PROCESSING' | 'SUCCESS';

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [paymentState, setPaymentState] = useState<PaymentState>('IDLE');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [transId, setTransId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(!!user.hasDownloaded);

  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem(`sub_${user.email}`);
    return saved ? JSON.parse(saved) : {
      tier: user.isTrialUsed ? 'Standard' : 'None',
      status: user.isTrialUsed ? SubscriptionStatus.ACTIVE : SubscriptionStatus.NONE,
      expiry: user.isTrialUsed ? '2024-12-28' : 'N/A',
    };
  });

  useEffect(() => {
    localStorage.setItem(`sub_${user.email}`, JSON.stringify(subscription));
  }, [subscription, user.email]);

  const availablePlans = [
    { id: 'standard', name: 'Standard', price: 1000, rank: 1, features: 'Priv. BUGs' },
    { id: 'pro', name: 'Pro Elite', price: 1500, rank: 2, features: 'Low Latency' },
    { id: 'elite', name: 'Elite Access', price: 3000, rank: 3, features: 'Mil-Grade' },
  ];

  const handleInitiatePayment = (plan: any) => {
    setSelectedPlan(plan);
    setPaymentState('SELECT_METHOD');
  };

  const handleProcessPayment = async () => {
    if (transId.length < 5) {
      alert("CRITICAL: PLEASE ENTER THE VALID TRANSACTION ID FROM YOUR MOMO RECEIPT");
      return;
    }
    setPaymentState('PROCESSING');
    
    try {
      const response = await fetch('./backend/payment_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          amount: selectedPlan.price,
          transaction_id: transId
        })
      });
      setIsVerifying(true);
    } catch (err) {
      setTimeout(() => setIsVerifying(true), 2000);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = './backend/download.php';
    link.setAttribute('download', 'zeus_unlimited_v4.sip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!hasDownloaded) {
      setHasDownloaded(true);
      user.hasDownloaded = true;
      setTimeout(() => setShowTutorial(true), 1000);
    }
  };

  const tutorialSteps: TutorialStep[] = [
    { id: '1', order: 0, title: 'Step 1: Install SocksIP', description: 'Install "SocksIP Tunnel" from the Play Store.', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=800' },
    { id: '2', order: 1, title: 'Step 2: Import Config', description: 'Open the .sip file with SocksIP.', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800' },
    { id: '3', order: 2, title: 'Step 3: Connect', description: 'Tap START and wait for connection.', mediaType: 'video', mediaUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpqcThqbmF6ZzN0eGdzNnF5emRqcXQyeHFqcXQyeHFqcXQyeHFqcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjPKYTVNiq67S/giphy.gif' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 glass p-12 rounded-[4rem] relative overflow-hidden border-blue-500/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]"></div>
        <div className="flex items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-all"></div>
            <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}&colors=blue`} className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-900 shadow-2xl bg-slate-950 p-2 relative z-10" alt="Avatar" />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black tracking-tight uppercase">NODE: {user.name}</h1>
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest border uppercase ${subscription.status === SubscriptionStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {subscription.status === SubscriptionStatus.ACTIVE ? 'Synchronized' : 'Offline'}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Rank: {subscription.tier}</p>
          <p className="text-2xl font-black text-white font-mono">{subscription.expiry}</p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Config Download Block */}
          <div className="glass p-12 rounded-[4rem] flex flex-col gap-10 border-blue-500/10 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black tracking-tight uppercase">Config Node Payload</h3>
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/20">v4.0 Unlimited</div>
            </div>
            <div className="p-12 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center text-center bg-slate-900/40 hover:bg-slate-900/60 transition-all">
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 text-blue-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </div>
              <h4 className="text-2xl font-black mb-10 uppercase tracking-tighter">zeus_unlimited_v4.sip</h4>
              <button 
                disabled={subscription.status !== SubscriptionStatus.ACTIVE}
                onClick={handleDownload}
                className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all ${subscription.status === SubscriptionStatus.ACTIVE ? 'btn-primary shadow-blue-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
              >
                {subscription.status === SubscriptionStatus.ACTIVE ? 'Download Node' : 'Access Denied'}
              </button>
            </div>
          </div>
        </div>

        {/* Tier Selector Sidebar */}
        <div className="flex flex-col gap-10">
          <div className="glass p-10 rounded-[3.5rem] flex flex-col gap-8 border-blue-500/10">
            <h3 className="text-2xl font-black tracking-tight uppercase text-white">Acquire Rank</h3>
            <div className="flex flex-col gap-4">
               {availablePlans.map(plan => (
                 <button 
                  key={plan.id} 
                  onClick={() => handleInitiatePayment(plan)}
                  className="p-6 bg-slate-950/60 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all flex justify-between items-center group text-left"
                 >
                    <div>
                      <p className="font-black text-white uppercase tracking-tight text-lg">{plan.name}</p>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{plan.price} FRS</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL SYSTEM */}
      {(paymentState === 'SELECT_METHOD' || paymentState === 'MOMO_MANUAL' || paymentState === 'PROCESSING') && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setPaymentState('IDLE')}></div>
          
          <div className="relative glass w-full max-w-md rounded-[4rem] p-10 shadow-3xl border-white/10 overflow-hidden">
            {/* Step 1: Select Method */}
            {paymentState === 'SELECT_METHOD' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white">Select Gateway</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">Transaction Security: High</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setPaymentState('MOMO_MANUAL')}
                    className="flex items-center justify-between p-6 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/20 rounded-3xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center font-black text-black">M</div>
                      <div className="text-left">
                        <p className="font-black text-white uppercase text-sm">MTN Mobile Money</p>
                        <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Instant Verification</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                  
                  <button className="flex items-center justify-between p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl grayscale opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-white text-xl">O</div>
                      <div className="text-left">
                        <p className="font-black text-white uppercase text-sm">Orange Money</p>
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Coming Soon</p>
                      </div>
                    </div>
                  </button>
                </div>
                
                <button onClick={() => setPaymentState('IDLE')} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Cancel Authorization</button>
              </div>
            )}

            {/* Step 2: Manual MoMo Instructions */}
            {paymentState === 'MOMO_MANUAL' && (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase text-white">MoMo Gateway</h3>
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Secure Manual</span>
                </div>
                
                <div className="bg-slate-950/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Official Merchant Account</p>
                    <p className="text-2xl font-black text-white tracking-tight uppercase">Petuel Baifem</p>
                  </div>
                  <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-2">MoMo Protocol Number</p>
                    <p className="text-3xl font-black text-white font-mono">677 25 10 88</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount Required</p>
                    <p className="text-xl font-black text-white">{selectedPlan.price} FRS</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">MOMONEY Transaction ID</label>
                  <input 
                    type="text" 
                    value={transId}
                    onChange={(e) => setTransId(e.target.value)}
                    placeholder="Enter TXN ID from SMS"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500 text-white font-bold placeholder:text-slate-800"
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <button onClick={handleProcessPayment} className="btn-primary w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">Initiate Node Sync</button>
                  <button onClick={() => setPaymentState('SELECT_METHOD')} className="text-[10px] font-black text-slate-600 uppercase tracking-widest">← Switch Gateway</button>
                </div>
              </div>
            )}

            {/* Step 3: Processing */}
            {paymentState === 'PROCESSING' && (
              <div className="flex flex-col items-center text-center py-10 gap-10">
                 <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 <div>
                   <h4 className="text-2xl font-black uppercase text-white mb-2 tracking-tight">Handshake in Progress</h4>
                   <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">Payload ID {transId} has been transmitted to Petuel Baifem's Command Center for manual verification. Activation occurs shortly after verification.</p>
                 </div>
                 <button onClick={() => setPaymentState('IDLE')} className="btn-primary px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest">Close Terminal</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tutorial gating */}
      {showTutorial && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={() => setShowTutorial(false)}></div>
          <div className="relative glass w-full max-w-2xl rounded-[4rem] p-12 shadow-3xl">
            <div className="flex flex-col items-center text-center gap-10">
              <div className="w-full aspect-video rounded-[3rem] overflow-hidden bg-slate-950 border border-white/5">
                <img src={tutorialSteps[tutorialStep].mediaUrl} className="w-full h-full object-cover opacity-80" alt="Step" />
              </div>
              <div>
                <h3 className="text-4xl font-black mb-4 uppercase text-white tracking-tight">{tutorialSteps[tutorialStep].title}</h3>
                <p className="text-slate-400 max-w-md mx-auto">{tutorialSteps[tutorialStep].description}</p>
              </div>
              <button 
                onClick={() => tutorialStep === tutorialSteps.length - 1 ? setShowTutorial(false) : setTutorialStep(s => s + 1)}
                className="btn-primary w-full py-5 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest"
              >
                {tutorialStep === tutorialSteps.length - 1 ? "Start Connecting" : "Next Protocol"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
