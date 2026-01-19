
import React from 'react';

interface LandingPageProps {
  onGetStarted: (planId?: string) => void;
}

const PlanCard = ({ plan, index, onGetStarted }: { plan: any, index: number, onGetStarted: (planId: string) => void }) => (
  <div 
    className={`bg-slate-900/80 border rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:scale-[1.03] animate-fade-in-up stagger-${(index % 3) + 1} ${plan.network === 'ORANGE' ? 'border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)]' : (plan.network === 'MASTERY' ? 'border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]')}`}
  >
    <div className="mb-6">
      <div className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 ${plan.network === 'ORANGE' ? 'bg-orange-600 text-white' : (plan.network === 'MASTERY' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')}`}>
        {plan.network} {plan.network === 'MASTERY' ? 'MENTORSHIP' : 'ACCESS'}
      </div>
      <h3 className="text-xl font-black uppercase text-white mb-1 tracking-tighter">{plan.name}</h3>
      <p className={`text-[11px] font-black uppercase tracking-tighter ${plan.network === 'ORANGE' ? 'text-orange-400' : (plan.network === 'MASTERY' ? 'text-emerald-400' : 'text-blue-400')}`}>
        {plan.speed}
      </p>
    </div>
    <div className="flex items-baseline gap-1.5 mb-8">
      <span className="text-4xl font-black text-white leading-none">{plan.price.toLocaleString()}</span>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">FRS / {plan.days}D</span>
    </div>
    <ul className="flex flex-col gap-4 mb-10 flex-grow">
      {plan.features.map((feature: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-300 uppercase tracking-tighter">
          <div className={`w-2 h-2 rounded-full ${plan.network === 'ORANGE' ? 'bg-orange-500' : (plan.network === 'MASTERY' ? 'bg-emerald-500' : 'bg-blue-500')}`}></div>
          {feature}
        </li>
      ))}
    </ul>
    <button 
      onClick={() => onGetStarted(plan.id)}
      className={`w-full py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${plan.id === 'trial' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white' : 'btn-primary text-white'}`}
    >
      {plan.id === 'trial' ? 'START 24H TRIAL' : 'BUY NOW'}
    </button>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const orangePlans = [
    { id: 'trial', name: '24H Trial', days: 1, price: 0, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['24-Hour Trial Access', 'High Speed Config', 'One-time Identity Sync'] },
    { id: 'basic', name: 'Basic Tier', days: 3, price: 500, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['3-Day Access Sync', 'Standard Bandwidth', 'Verified Config'] },
    { id: 'standard', name: 'Standard Tier', days: 7, price: 1000, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['7-Day Access Sync', 'Premium Speeds', 'Private Tunnel Access'] },
    { id: 'pro', name: 'Pro Elite', days: 15, price: 1500, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['15-Day Access Sync', 'Gaming Optimization', 'Priority Routing'] },
    { id: 'elite', name: 'Elite Plan', days: 30, price: 2500, network: 'ORANGE', speed: 'UNLIMITED DATA', features: ['30-Day Access Sync', 'Max Bandwidth', 'Dedicated Config Cluster'] },
  ];

  const mtnPlans = [
    { id: 'mtn_lite', name: 'MTN Lite', days: 15, price: 500, network: 'MTN', speed: '200MB DAILY BOOST', features: ['15-Day Access Sync', '200MB Data Every Day', 'Secure MTN Sync'] },
    { id: 'mtn_monthly', name: 'MTN Monthly', days: 30, price: 1000, network: 'MTN', speed: '200MB DAILY BOOST', features: ['30-Day Access Sync', '200MB Data Every Day', 'High Priority Cluster'] },
  ];

  const masteryPlan = [
    { id: 'mastery', name: 'MASTERY TIER', days: 90, price: 15000, network: 'MASTERY', speed: 'FILE ARCHITECTURE TRAINING', features: ['Learn To Create Files', 'Exclusive Tools Access', '90-Day Direct Support', 'Pro Technical Mentorship'] },
  ];

  return (
    <div className="flex flex-col gap-10 md:gap-24 pb-12">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center px-6 pt-16 md:pt-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] rounded-full translate-x-1/2 -z-10"></div>
        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col text-center lg:text-left items-center lg:items-start animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter mb-8 text-white uppercase">
              PETZEUSTECH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-glow">UNLIMITED NETWORKS.</span>
            </h1>
            <p className="text-sm md:text-xl text-slate-400 max-w-xl mb-12 font-medium leading-relaxed uppercase tracking-tight">
              High-speed SocksIP payloads. <span className="text-orange-500 font-black">Unlimited Orange</span> browsing and MTN <span className="text-blue-500 font-black">200MB Daily</span> refresh.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <button onClick={() => onGetStarted()} className="btn-primary px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl">Start 24H Access</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/5 px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">Browse Plans</button>
            </div>
          </div>
          <div className="hidden lg:block animate-fade-in relative">
             <div className="bg-slate-900 p-6 rounded-[4rem] border border-white/10 shadow-3xl relative z-10">
               <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" className="rounded-[3.5rem] opacity-60 grayscale-[40%] hover:grayscale-0 transition-all duration-700" alt="PetZeus Infrastructure" />
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Clusters */}
      <section id="pricing" className="px-6 max-w-7xl mx-auto w-full scroll-mt-32">
        {/* ORANGE SECTION */}
        <div className="mb-24">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-2 text-center">
              <span className="text-orange-500">ORANGE</span> CLUSTER
            </h2>
            <p className="text-orange-500/60 text-[11px] font-black uppercase tracking-[0.4em] text-center">UNLIMITED DATA ACCESS</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {orangePlans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} onGetStarted={onGetStarted} />
            ))}
          </div>
        </div>

        {/* MTN SECTION */}
        <div className="mb-24">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-2 text-center">
              <span className="text-blue-500">MTN</span> CLUSTER
            </h2>
            <p className="text-blue-500/60 text-[11px] font-black uppercase tracking-[0.4em] text-center">200MB DAILY DATA BOOST</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mtnPlans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} onGetStarted={onGetStarted} />
            ))}
          </div>
        </div>

        {/* MASTERY SECTION */}
        <div className="mb-24" id="mentorship">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-2 text-center">
               <span className="text-emerald-500">MASTERY</span> CLUSTER
            </h2>
            <p className="text-emerald-500/60 text-[11px] font-black uppercase tracking-[0.4em] text-center">FILE CREATION MENTORSHIP</p>
          </div>
          <div className="max-w-md mx-auto">
            {masteryPlan.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} onGetStarted={onGetStarted} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
