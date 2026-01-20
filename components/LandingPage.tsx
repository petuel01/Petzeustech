
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LandingPageProps {
  user: User | null;
  onGetStarted: () => void;
}

const PaymentModal = ({ plan, onClose, onComplete }: { plan: any, onClose: () => void, onComplete: () => void }) => {
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (txId.length < 5) {
      alert("Invalid ID. Input first 5 digits for manual verification.");
      return;
    }
    setLoading(true);
    
    try {
      const res = await fetch('./backend/payment_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transaction_id: txId,
          plan_id: plan.id,
          amount: plan.price
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Transaction ID logged. Admin verification required before terminal access.");
        onComplete();
      }
    } catch (e) {
      alert("Verification node failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#0f172a] w-full max-w-md rounded-[3rem] p-10 border-2 border-white/10 shadow-3xl">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 text-center">Payment Terminal</h3>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
             Transfer <span className="text-white text-lg">{plan.price.toLocaleString()} FRS</span> to:<br/>
             <span className="text-blue-500 font-black text-xl tracking-widest">6XX XXX XXX</span><br/>
             <span className="text-[10px] text-slate-600 uppercase font-black">PetZeusTech Merchant Node</span>
           </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Transaction ID (First 5 Digits)</label>
          <input 
            required
            maxLength={5}
            value={txId}
            onChange={e => setTxId(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="XXXXX"
            className="bg-slate-950 border-2 border-white/5 rounded-2xl p-6 text-white font-black text-center text-2xl tracking-[0.5em] outline-none focus:border-blue-500"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {loading ? 'SYNCHRONIZING...' : 'VERIFY PAYMENT'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PlanCard: React.FC<{ plan: any, onBuy: (plan: any) => void, suggested?: boolean }> = ({ plan, onBuy, suggested }) => {
  const isMaster = plan.id === 'master';
  
  return (
    <div className={`bg-[#0f172a] border-2 rounded-[3rem] p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] shadow-2xl relative overflow-hidden ${suggested ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-white/5'} ${isMaster ? 'border-purple-500/30 bg-purple-500/5' : ''}`}>
      {suggested && (
        <div className="absolute top-5 right-[-30px] bg-blue-600 text-white px-8 py-1 text-[8px] font-black uppercase tracking-widest rotate-45 z-20 shadow-xl">
          Recommended
        </div>
      )}
      <div className="mb-6">
        <span className={`inline-block px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 ${isMaster ? 'bg-purple-600 text-white' : plan.network === 'ORANGE' ? 'bg-orange-600 text-white' : 'bg-amber-400 text-blue-900'}`}>
          {plan.network || 'SYSTEM'} {isMaster ? 'MASTER' : 'TIER'}
        </span>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
        {isMaster && <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mt-2">Professional Mentorship & Tools</p>}
      </div>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black text-white">{plan.price.toLocaleString()}</span>
        <span className="text-[10px] font-black text-slate-500 uppercase">FRS / {isMaster ? 'LIFE' : plan.days + ' DAYS'}</span>
      </div>
      <button 
        onClick={() => onBuy(plan)}
        className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 ${plan.id === 'trial' ? 'bg-emerald-600 text-white' : isMaster ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-blue-600 text-white'}`}
      >
        {plan.id === 'trial' ? 'ACTIVATE TRIAL' : isMaster ? 'LEARN FILE CREATION' : 'BUY ACCESS'}
      </button>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ user, onGetStarted }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`sub_${user.email}`);
      if (saved) setUserSubscription(JSON.parse(saved));
    }
  }, [user]);

  const plans = {
    orange: [
      { id: 'trial', name: '24H Trial', days: 1, price: 0, network: 'ORANGE' },
      { id: 'basic', name: 'Basic Tier', days: 3, price: 500, network: 'ORANGE' },
      { id: 'standard', name: 'Standard Tier', days: 7, price: 1000, network: 'ORANGE' },
      { id: 'pro', name: 'Pro Elite', days: 15, price: 1500, network: 'ORANGE' },
      { id: 'orange_monthly', name: 'Monthly Unlimited', days: 30, price: 2500, network: 'ORANGE' },
    ],
    mtn: [
      { id: 'mtn_lite', name: 'MTN Lite', days: 15, price: 500, network: 'MTN' },
      { id: 'mtn_monthly', name: 'MTN Monthly', days: 30, price: 1000, network: 'MTN' },
    ],
    mastery: [
      { id: 'master', name: 'File Creation Mastery', days: 9999, price: 15000, network: 'ALL' }
    ]
  };

  const isTrialActive = userSubscription?.id === 'trial';

  const handleAction = (plan: any) => {
    if (!user) {
      onGetStarted();
      return;
    }
    if (plan.price === 0) {
      const expiry = Date.now() + (plan.days * 24 * 60 * 60 * 1000);
      localStorage.setItem(`sub_${user.email}`, JSON.stringify({ ...plan, status: 'ACTIVE', expiryTimestamp: expiry }));
      onGetStarted();
    } else {
      setSelectedPlan(plan);
    }
  };

  return (
    <div className="flex flex-col pb-24">
      <section className="px-6 max-w-7xl mx-auto w-full mb-24 pt-16 text-center animate-fade-in">
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-8">
          PETZEUSTECH<br/><span className="text-blue-500">UNLIMITED</span> NETWORKS
        </h1>
        <p className="text-slate-400 text-lg md:text-xl uppercase font-bold tracking-tight mb-12 max-w-2xl mx-auto leading-relaxed">
          ENGINEERED FOR SUPREMACY. WE DELIVER <span className="text-white">HIGH-VELOCITY</span> TUNNELING CONFIGURATIONS OPTIMIZED FOR UNLIMITED INTERNET PERFORMANCE. OUR SYSTEM DELIVERS PREMIUM .SIP PAYLOADS BUILT FOR MAXIMUM THROUGHPUT AND ZERO-LATENCY BROWSING.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition-all border-b-4 border-black/20"
          >
            EXPLORE PLANS
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SYSTEM ONLINE</span>
          </div>
        </div>
      </section>

      <div id="pricing" className="px-6 max-w-7xl mx-auto w-full scroll-mt-32">
        <div className="mb-24">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-10 text-center">ORANGE UNLIMITED TIERS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {plans.orange.map((p) => (
              <PlanCard 
                key={p.id} 
                plan={p} 
                suggested={isTrialActive && p.id === 'basic'}
                onBuy={handleAction} 
              />
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-10 text-center">MTN UNLIMITED TIERS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.mtn.map((p) => (
              <PlanCard 
                key={p.id} 
                plan={p} 
                onBuy={handleAction} 
              />
            ))}
          </div>
        </div>

        <div id="mastery">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-10 text-center">ARCHITECT MASTERY (GLOBAL)</h2>
          <div className="max-w-md mx-auto">
            {plans.mastery.map((p) => (
              <PlanCard 
                key={p.id} 
                plan={p} 
                onBuy={handleAction} 
              />
            ))}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          onComplete={() => { setSelectedPlan(null); onGetStarted(); }} 
        />
      )}
    </div>
  );
};

export default LandingPage;
