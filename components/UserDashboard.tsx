
import React, { useState, useEffect } from 'react';
import { User, SubscriptionStatus, TutorialStep } from '../types';

interface UserDashboardProps {
  user: User;
}

type PaymentState = 'IDLE' | 'BILLING' | 'PROCESSING' | 'SUCCESS';

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
    setPaymentState('BILLING');
  };

  const handleProcessPayment = async () => {
    if (transId.length < 5) {
      alert("PLEASE ENTER A VALID TRANSACTION ID FROM YOUR MOMO MESSAGE");
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
      // Simulation mode if backend fails
      setTimeout(() => setIsVerifying(true), 1500);
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
    { id: '1', order: 0, title: 'Step 1: Install SocksIP', description: 'Search for "SocksIP Tunnel" in the Play Store. Install and launch it.', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=800' },
    { id: '2', order: 1, title: 'Step 2: Import Config', description: 'Locate the .sip file in your downloads. Tap it and select "Open with SocksIP".', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800' },
    { id: '3', order: 2, title: 'Step 3: Connect', description: 'Inside the app, tap "START". Wait for "Connected Success".', mediaType: 'video', mediaUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpqcThqbmF6ZzN0eGdzNnF5emRqcXQyeHFqcXQyeHFqcXQyeHFqcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjPKYTVNiq67S/giphy.gif' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 border border-blue-500/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black animate-pulse shadow-lg shadow-blue-500/20 text-white">!</div>
          <div>
            <p className="font-bold text-slate-200 uppercase tracking-tight">PETZEUSTECH UNLIMITED BULLETIN</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Node payloads updated. Tap "Download" below for latest speed.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <a href="#" className="bg-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">Channel</a>
          <a href="#" className="bg-[#25D366] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">Group</a>
        </div>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-center gap-8 glass p-10 rounded-[4rem] relative overflow-hidden border-blue-500/10">
        <div className="flex items-center gap-10">
          <div className="relative group">
            <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}&colors=blue`} className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-900 shadow-2xl bg-slate-950 p-2" alt="Avatar" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">NODE: {user.name}</h1>
            <span className={`px-3 py-1 ${subscription.status === SubscriptionStatus.ACTIVE ? 'text-emerald-400' : 'text-red-400'} text-[10px] font-black rounded-lg tracking-[0.2em]`}>
              {subscription.status === SubscriptionStatus.ACTIVE ? 'SYNCHRONIZED' : 'OFFLINE'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank: {subscription.tier}</p>
          <p className="text-xl font-black text-white font-mono mt-1">{subscription.expiry}</p>
        </div>
      </header>

      {/* Manual Payment Modal */}
      {paymentState === 'BILLING' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setPaymentState('IDLE')}></div>
          <div className="relative glass w-full max-w-md rounded-[3rem] p-10 shadow-3xl border-white/10">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6">Manual Node Sync</h3>
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Payment Protocol</p>
              <div className="space-y-2">
                <p className="text-white font-bold">1. Pay <span className="text-blue-400">{selectedPlan.price} FRS</span> to:</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-white/5 text-center">
                  <p className="text-xl font-black text-white">677 25 10 88</p>
                  <p className="text-[10px] text-slate-500 uppercase">Account: Petuel Baifem</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">MOMONEY Transaction ID</label>
              <input 
                type="text" 
                value={transId}
                onChange={(e) => setTransId(e.target.value)}
                placeholder="Ex: 2938475839"
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500 text-white font-bold"
              />
            </div>
            <button onClick={handleProcessPayment} className="btn-primary w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest mt-8">Submit for Verification</button>
          </div>
        </div>
      )}

      {paymentState === 'PROCESSING' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"></div>
          <div className="relative glass w-full max-w-md rounded-[3rem] p-12 text-center flex flex-col items-center gap-8">
             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <div>
               <h4 className="text-xl font-black uppercase text-white mb-2">Syncing with Command</h4>
               <p className="text-slate-400 text-sm">Transaction ID {transId} sent to Admin for manual clearance. This usually takes 5-30 minutes.</p>
             </div>
             <button onClick={() => setPaymentState('IDLE')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white">Return to Terminal</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="glass p-12 rounded-[4rem] flex flex-col gap-10 relative overflow-hidden group border-blue-500/10">
            <h3 className="text-3xl font-black tracking-tight uppercase">Encrypted Config Node</h3>
            <div className="p-12 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center text-center bg-slate-900/40">
              <h4 className="text-3xl font-black mb-3 uppercase tracking-tighter">zeus_unlimited_v4.sip</h4>
              <button 
                disabled={subscription.status !== SubscriptionStatus.ACTIVE}
                onClick={handleDownload}
                className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all ${subscription.status === SubscriptionStatus.ACTIVE ? 'btn-primary' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                Download Node
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="glass p-10 rounded-[3.5rem] flex flex-col gap-8 border-blue-500/20 bg-blue-500/5">
            <h3 className="text-2xl font-black tracking-tight uppercase text-white">Tier Selection</h3>
            <div className="flex flex-col gap-4">
               {availablePlans.map(plan => (
                 <div key={plan.id} className="p-6 bg-slate-950/60 rounded-[2.5rem] border border-white/5 flex justify-between items-center group">
                    <p className="font-black text-white uppercase tracking-tight">{plan.name}</p>
                    <button onClick={() => handleInitiatePayment(plan)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">Acquire</button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {showTutorial && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setShowTutorial(false)}></div>
          <div className="relative glass w-full max-w-2xl rounded-[4rem] p-12 shadow-3xl">
            <div className="flex flex-col items-center text-center gap-10">
              <img src={tutorialSteps[tutorialStep].mediaUrl} className="w-full aspect-video rounded-[2.5rem] object-cover" alt="Tutorial" />
              <div>
                <h3 className="text-4xl font-black mb-4 uppercase text-white">{tutorialSteps[tutorialStep].title}</h3>
                <p className="text-slate-400">{tutorialSteps[tutorialStep].description}</p>
              </div>
              <button 
                onClick={() => tutorialStep === tutorialSteps.length - 1 ? setShowTutorial(false) : setTutorialStep(s => s + 1)}
                className="btn-primary w-full py-5 text-white rounded-2xl font-black text-sm uppercase"
              >
                {tutorialStep === tutorialSteps.length - 1 ? "Start Connecting" : "Next Step"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
