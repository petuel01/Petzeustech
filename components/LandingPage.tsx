
import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: (planId?: string) => void;
}

const PaymentModal = ({ plan, onClose, onComplete }: { plan: any, onClose: () => void, onComplete: () => void }) => {
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txId.length < 5) {
      alert("Please enter at least the first 5 digits for verification.");
      return;
    }
    setLoading(true);
    // Simulate verification delay
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#0f172a] w-full max-w-md rounded-[3rem] p-10 border-2 border-white/10 shadow-3xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 animate-pulse"></div>
        
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Secure Payment</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Transaction Node Sync</p>
        </div>

        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center leading-relaxed">
             Transfer <span className="text-white font-black">{plan.price.toLocaleString()} FRS</span> to:<br/>
             <span className="text-blue-500 font-black text-xl">6XX XXX XXX</span><br/>
             <span className="text-[10px] text-slate-600">Merchant: PETZEUSTECH NETWORKS</span>
           </p>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl mb-10">
           <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] text-center">
              CRITICAL: TIMER STARTS UPON NODE ACTIVATION.
           </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              INPUT FIRST 5 DIGITS OF TRANSACTION ID
            </label>
            <input 
              required
              maxLength={5}
              value={txId}
              onChange={e => setTxId(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Ex: 89342"
              className="bg-slate-950 border-2 border-white/5 rounded-2xl p-6 text-white font-black text-center text-2xl tracking-[0.5em] outline-none focus:border-blue-500 focus:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-95 transition-all border-b-4 border-black/20"
          >
            {loading ? 'VERIFYING NODE...' : 'ACTIVATE CONNECTION'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PlanCard: React.FC<{ plan: any, onBuy: (plan: any) => void }> = ({ plan, onBuy }) => {
  const getButtonStyle = () => {
    if (plan.id === 'trial') return 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)]';
    if (plan.network === 'ORANGE') return 'bg-[#f97316] text-white hover:bg-[#ea580c] shadow-[0_15px_45px_rgba(249,115,22,0.4)]';
    if (plan.network === 'MTN') return 'bg-[#fbbf24] text-[#1e3a8a] hover:bg-[#f59e0b] shadow-[0_15px_45px_rgba(251,191,36,0.4)]';
    if (plan.network === 'MASTERY') return 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_15px_45px_rgba(16,185,129,0.4)]';
    return 'bg-blue-600 text-white';
  };

  return (
    <div className="bg-[#0f172a] border-2 border-white/5 rounded-[3.5rem] p-10 flex flex-col transition-all duration-500 hover:scale-[1.03] hover:border-blue-500/20 shadow-2xl relative overflow-hidden group">
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
      
      <div className="mb-8 relative z-10">
        <span className={`inline-block px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest mb-6 ${plan.network === 'ORANGE' ? 'bg-orange-600 text-white' : (plan.network === 'MTN' ? 'bg-amber-400 text-blue-900' : 'bg-emerald-600 text-white')}`}>
          {plan.network} {plan.network === 'MASTERY' ? 'MENTOR' : 'CONNECTION'}
        </span>
        <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tighter leading-none">{plan.name}</h3>
        <p className="text-slate-500 text-[12px] font-bold uppercase tracking-widest">{plan.speed}</p>
      </div>
      
      <div className="flex items-baseline gap-2 mb-10 relative z-10">
        <span className="text-5xl font-black text-white tracking-tighter">{plan.price.toLocaleString()}</span>
        <span className="text-xs font-black text-slate-500 uppercase">FRS / {plan.days} DAYS</span>
      </div>

      <ul className="flex flex-col gap-4 mb-12 flex-grow relative z-10">
        {plan.features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-[12px] font-bold text-slate-300 uppercase tracking-tight">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${plan.network === 'ORANGE' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            {f}
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onBuy(plan)}
        className={`w-full py-7 rounded-3xl font-black text-[13px] uppercase tracking-[0.3em] transition-all active:scale-95 border-b-4 border-black/20 relative z-10 ${getButtonStyle()}`}
      >
        {plan.id === 'trial' ? 'ACTIVATE FREE ACCESS' : 'BUY NOW / UPGRADE'}
      </button>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const orangePlans = [
    { id: 'trial', name: '24H Trial', days: 1, price: 0, network: 'ORANGE', speed: 'FREE UNLIMITED DATA', features: ['24-Hour Active Time', 'High-Speed File Provided', 'One-Time Identity Sync'] },
    { id: 'basic', name: 'Basic Tier', days: 3, price: 500, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['3 Days Active Time', 'Stable Connection File', 'Instant Access'] },
    { id: 'standard', name: 'Standard Tier', days: 7, price: 1000, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['7 Days Active Time', 'Premium Connection File', 'Priority Support'] },
    { id: 'pro', name: 'Pro Elite', days: 15, price: 1500, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['15 Days Active Time', 'Elite Connection File', 'Low Latency Tunnels'] },
    { id: 'elite', name: 'Monthly Elite', days: 30, price: 2500, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['30 Days Active Time', 'Full Cluster Access', 'Max Speed Guarantee'] },
  ];

  const mtnPlans = [
    { id: 'mtn_lite', name: 'MTN Lite', days: 15, price: 500, network: 'MTN', speed: '200MB DAILY REFRESH', features: ['15 Days Active Time', '200MB Reset Every 24H', 'Secure Connection File'] },
    { id: 'mtn_monthly', name: 'MTN Monthly', days: 30, price: 1000, network: 'MTN', speed: '200MB DAILY REFRESH', features: ['30 Days Active Time', '200MB Reset Every 24H', 'High Reliability File'] },
  ];

  const masteryPlan = [
    { id: 'mastery', name: 'Mastery Level', days: 30, price: 15000, network: 'MASTERY', speed: 'LEARN FILE CREATION', features: ['1-on-1 Mentorship', 'Learn Setup Architecture', 'Build Custom Files', 'Lifetime Private Tools'] },
  ];

  const handlePurchaseComplete = (planOverride?: any) => {
    const activePlan = planOverride || selectedPlan;
    if (!activePlan) return;

    // Countdown starts EXACTLY when verification is complete
    const expiry = Date.now() + (activePlan.days * 24 * 60 * 60 * 1000);
    const subData = {
      tier: activePlan.name,
      status: 'ACTIVE',
      expiryTimestamp: expiry,
      network: activePlan.network,
      days: activePlan.days
    };
    localStorage.setItem('sub_test@petzeustech.com', JSON.stringify(subData));
    setSelectedPlan(null);
    onGetStarted(); // Navigate to Dashboard
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Hero Section */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-32 pt-12 text-center lg:text-left grid lg:grid-cols-2 gap-20 items-center">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase leading-[0.8] tracking-tighter mb-10">
            BETTER<br/>
            <span className="text-blue-500">NETWORK</span><br/>
            ACCESS.
          </h1>
          <p className="text-slate-400 text-xl md:text-3xl uppercase font-bold tracking-tight mb-14 max-w-xl">
            Premium connection files for <span className="text-orange-500">Orange</span> & <span className="text-[#fbbf24]">MTN</span>. <span className="text-white">Reliable. Secure. Fast.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary px-16 py-7 rounded-3xl font-black text-[15px] uppercase tracking-widest shadow-2xl">Browse All Plans</button>
            <button onClick={() => onGetStarted()} className="bg-white/5 border border-white/10 px-12 py-7 rounded-3xl font-black text-[15px] uppercase tracking-widest hover:bg-white/10 transition-all">Go To Dashboard</button>
          </div>
        </div>
        <div className="hidden lg:block relative">
           <div className="absolute -inset-10 bg-blue-600/10 blur-[100px] rounded-full"></div>
           <div className="bg-[#0f172a] p-10 rounded-[5rem] border border-white/10 shadow-3xl relative">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000" className="rounded-[4rem] opacity-70 grayscale hover:grayscale-0 transition-all duration-1000" alt="PetZeus" />
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing" className="px-6 max-w-7xl mx-auto w-full scroll-mt-32">
        <div className="mb-32">
           <div className="flex flex-col items-center mb-20">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter text-center">Orange Access</h2>
              <div className="w-24 h-2 bg-orange-500 rounded-full mt-6 shadow-[0_0_20px_rgba(249,115,22,0.5)]"></div>
           </div>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {orangePlans.map((p) => (
                <PlanCard 
                  key={p.id} 
                  plan={p} 
                  onBuy={(plan) => plan.price === 0 ? handlePurchaseComplete(plan) : setSelectedPlan(plan)} 
                />
              ))}
           </div>
        </div>

        <div className="mb-32">
           <div className="flex flex-col items-center mb-20">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter text-center">MTN Access</h2>
              <div className="w-24 h-2 bg-amber-400 rounded-full mt-6 shadow-[0_0_20px_rgba(251,191,36,0.5)]"></div>
           </div>
           <div className="grid sm:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {mtnPlans.map((p) => <PlanCard key={p.id} plan={p} onBuy={setSelectedPlan} />)}
           </div>
        </div>

        <div id="mentorship" className="mb-32">
           <div className="flex flex-col items-center mb-20">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter text-center">Mentorship</h2>
              <div className="w-24 h-2 bg-emerald-500 rounded-full mt-6 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
           </div>
           <div className="max-w-xl mx-auto">
              {masteryPlan.map((p) => <PlanCard key={p.id} plan={p} onBuy={setSelectedPlan} />)}
           </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          onComplete={handlePurchaseComplete} 
        />
      )}
    </div>
  );
};

export default LandingPage;
