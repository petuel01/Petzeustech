
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const plans = [
    { name: 'Trial Pass', days: 2, price: 0, features: ['2-Day Full Access', 'Standard Speed', 'One-time Use'], isTrial: true },
    { name: 'Basic Tier', days: 3, price: 500, features: ['Full Duration Access', 'High Speed', 'Standard Support'] },
    { name: 'Standard', days: 7, price: 1000, features: ['Premium Bandwidth', 'Ultra Low Latency', 'Priority Support'] },
    { name: 'Pro Elite', days: 15, price: 1500, features: ['Max Speed Access', 'Dedicated Support', 'Multi-file Support'] },
  ];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
            alt="Global Network" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">New: 2-Day Trial Access</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter">
              BEYOND<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500">
                LIMITS.
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              Experience zero-latency connectivity with PetZeusTech Networks. Premium SocksIP configurations with automated 4-day lifecycle refreshes.
            </p>

            <div className="flex flex-wrap gap-5 mt-4">
              <button 
                onClick={onGetStarted}
                className="btn-glow group relative px-10 py-5 bg-blue-600 rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">START 2-DAY TRIAL</span>
              </button>
              
              <button 
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all backdrop-blur-md"
              >
                VIEW ALL PLANS
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                 alt="Tech Shield" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
               <div className="absolute bottom-10 left-10 right-10 p-8 glass rounded-3xl">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Global Node Status</span>
                    <span className="text-emerald-400 text-xs font-black">OPTIMAL</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[92%] animate-pulse"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6 tracking-tight">Flexible Subscriptions</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose your access window. All premium plans include automated config refreshes.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`group relative glass rounded-[2.5rem] p-10 flex flex-col hover:-translate-y-4 transition-all duration-500 hover:border-blue-500/30 ${plan.isTrial ? 'border-emerald-500/20 bg-emerald-500/5' : ''}`}>
              {plan.isTrial && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  Free Trial
                </div>
              )}
              
              <h3 className={`text-2xl font-black ${plan.isTrial ? 'text-emerald-400' : 'text-blue-500'} mb-6`}>{plan.name}</h3>
              
              <div className="mb-8">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className="text-slate-500 font-bold ml-1 uppercase text-sm tracking-widest">FRS</span>
                <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-tighter">Valid for {plan.days} Days</p>
              </div>

              <ul className="flex flex-col gap-5 mb-12 flex-grow">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                    <svg className={`w-5 h-5 shrink-0 ${plan.isTrial ? 'text-emerald-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={onGetStarted}
                className={`w-full py-4 rounded-2xl font-black transition-all ${
                  plan.isTrial 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-transparent'
                }`}
              >
                {plan.price === 0 ? 'ACTIVATE' : 'PURCHASE'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
