
import React from 'react';

interface LandingPageProps {
  onGetStarted: (planId?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const plans = [
    { id: 'trial', name: 'Free Trial', days: 2, price: 0, isTrial: true, features: ['Standard Nodes', 'Public BUG Hosts', '24h Support'] },
    { id: 'standard', name: 'Standard', days: 7, price: 1000, features: ['Premium Nodes', 'Private BUG Hosts', '4-Day Refresh', 'Priority Support'] },
    { id: 'pro', name: 'Pro Elite', days: 15, price: 1500, features: ['VIP Gaming Nodes', 'Low Latency', 'Unlimited BUG Access', '1-on-1 Help'] },
    { id: 'elite', name: 'Elite Access', days: 30, price: 3000, features: ['Military Grade Encryption', 'Dedicated IP Slots', 'Mastery Group Invite', 'White-Glove Service'] },
  ];

  const whatsappGroupLink = "https://chat.whatsapp.com/CWaB0k8DbkoCkvYPKJxBM8";
  const whatsappChannelLink = "https://whatsapp.com/channel/0029Vb3XY0g2f3EStiQAkX3s";
  const telegramChannelLink = "https://t.me/petzeus";

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" className="w-full h-full object-cover" alt="Cyber Background" />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col">
            <div className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-blue-500/20 w-fit">
              Unlimited Access Portal
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-6 text-glow">
              PETZEUSTECH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">UNLIMITED.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed mb-10 font-medium">
              The world's standard for tunneling technology. Secure, blazing-fast SocksIP configurations built by PETZEUSTECH UNLIMITED NETWORKS for elite performance.
            </p>
            <div className="flex flex-wrap gap-6">
              <button onClick={() => onGetStarted()} className="btn-primary px-12 py-6 rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-600/20">Get Started</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="glass px-12 py-6 rounded-3xl font-black text-lg hover:bg-white/5 transition-all uppercase tracking-widest border border-white/10">Explore Matrix</button>
            </div>
          </div>
          <div className="hidden lg:block animate-float">
             <div className="glass p-5 rounded-[4rem] border-white/10 relative">
               <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[4rem]"></div>
               <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200" className="rounded-[3.5rem] shadow-2xl relative z-10" alt="App Preview" />
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6 tracking-tight uppercase">System Access Tiers</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">Choose your level of penetration. All plans include automated 4-day node rotation managed by the PETZEUSTECH UNLIMITED NETWORKS core.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className={`glass rounded-[3.5rem] p-10 flex flex-col hover:border-blue-500/40 transition-all group ${plan.id === 'pro' ? 'border-blue-500/40 bg-blue-600/5 ring-1 ring-blue-500/20' : 'border-white/5'}`}>
              {plan.isTrial && (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-8 bg-emerald-400/10 w-fit px-4 py-1.5 rounded-full border border-emerald-400/20">Entry Node</span>
              )}
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter text-white">{plan.name}</h3>
              <div className="flex items-end gap-2 mb-10">
                <span className="text-4xl font-black text-white">{plan.price.toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-500 mb-1 uppercase">FRS / {plan.days}D</span>
              </div>
              <ul className="flex flex-col gap-5 mb-12 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-400">
                    <div className="w-5 h-5 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onGetStarted(plan.id)}
                className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${plan.id === 'pro' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                {plan.price === 0 ? 'Initialize Trial' : 'Sync Node Tier'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Hub */}
      <section id="community" className="px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="glass rounded-[4.5rem] p-12 md:p-24 bg-blue-600/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-none">STAY SYNCED,<br /><span className="text-blue-500 uppercase">Stay Unlimited.</span></h2>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">Join 5,000+ elite members in our community channels for instant server updates, live troubleshooting, and exclusive beta configs from the PETZEUSTECH UNLIMITED NETWORKS team.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
               <a href={telegramChannelLink} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 bg-[#229ED9] p-8 rounded-3xl hover:scale-105 transition-all shadow-xl shadow-sky-500/20 group">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.168.575-.494.761-.716.78-.485.043-.853-.263-1.322-.572-.734-.483-1.15-.783-1.861-1.251-.823-.541-.29-.838.18-1.327.123-.127 2.254-2.067 2.296-2.24.005-.021.01-.1-.035-.138-.046-.039-.114-.025-.163-.014-.07.016-1.185.753-3.336 2.203-.316.216-.601.323-.856.317-.281-.006-.822-.153-1.225-.283-.493-.16-.886-.244-.852-.516.018-.142.213-.288.585-.439 2.288-1.002 3.812-1.662 4.572-1.979 2.17-.91 2.622-1.068 2.916-1.073.064-.001.21.016.304.093.078.064.1.152.112.214.013.065.015.21.01.266z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Elite Channel</p>
                    <p className="font-black text-white uppercase text-lg">Telegram Feed</p>
                  </div>
               </a>

               <a href={whatsappChannelLink} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 bg-[#25D366]/90 p-8 rounded-3xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 group">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Global Broadcast</p>
                    <p className="font-black text-white uppercase text-lg">WhatsApp Channel</p>
                  </div>
               </a>

               <a href={whatsappGroupLink} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 bg-[#25D366] p-8 rounded-3xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 group border border-white/10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Interactive Node</p>
                    <p className="font-black text-white uppercase text-lg">WhatsApp Group</p>
                  </div>
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Education Section */}
      <section id="mentorship" className="px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6 tracking-tight uppercase">Unlock Core Knowledge</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">Learn the dark art of configuration crafting from PETZEUSTECH UNLIMITED NETWORKS experts.</p>
        </div>
        <div className="glass rounded-[4.5rem] p-12 md:p-20 relative overflow-hidden group border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
               <div className="inline-block px-5 py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-8 border border-yellow-500/20">Elite Mentorship</div>
               <h3 className="text-5xl font-black mb-8 tracking-tighter leading-none">SocksIP Configuration<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Mastery Course</span></h3>
               <ul className="space-y-6 mb-12">
                  <li className="flex items-center gap-4 text-slate-300 font-bold"><div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg></div> Server Payload Engineering</li>
                  <li className="flex items-center gap-4 text-slate-300 font-bold"><div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg> BUG Host Discovery Techniques</li>
                  <li className="flex items-center gap-4 text-slate-300 font-bold"><div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg> Private Mentorship Group</li>
               </ul>
               <div className="flex items-end gap-3 mb-12">
                  <span className="text-7xl font-black text-white tracking-tighter leading-none">15,000</span>
                  <span className="text-2xl font-black text-slate-500 uppercase mb-2">FRS</span>
               </div>
               <button onClick={() => onGetStarted('mentorship')} className="w-full sm:w-auto px-16 py-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl text-white font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-orange-500/30 uppercase tracking-widest">Enroll in Mastery</button>
            </div>
            <div className="rounded-[3.5rem] overflow-hidden border border-white/10 shadow-3xl relative">
               <div className="absolute inset-0 bg-yellow-600/10 mix-blend-overlay"></div>
               <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200" alt="Mentorship" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
