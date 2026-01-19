
import React, { useState } from 'react';
import { User, ConfigFile, SubscriptionPlan } from '../types';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'payments' | 'plans'>('users');
  
  const [plans] = useState<SubscriptionPlan[]>([
    { id: 'trial', name: 'Free Trial', days: 2, price: 0, isTrial: true },
    { id: 'basic', name: 'Basic Tier', days: 3, price: 500 },
    { id: 'standard', name: 'Standard', days: 7, price: 1000 },
    { id: 'pro', name: 'Pro Elite', days: 15, price: 1500 },
    { id: 'elite', name: 'Elite Access', days: 30, price: 3000 },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<ConfigFile[]>([
    { id: 'f1', fileName: 'trial_v1.sip', planId: 'trial', cycleStart: '2024-12-24', cycleEnd: '2024-12-28', uploadDate: '2024-12-24' },
    { id: 'f2', fileName: 'elite_v1.sip', planId: 'elite', cycleStart: '2024-12-24', cycleEnd: '2024-12-28', uploadDate: '2024-12-24' },
  ]);

  const [uploadTargetPlanId, setUploadTargetPlanId] = useState<string>('trial');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const plan = plans.find(p => p.id === uploadTargetPlanId);
      const confirmUpload = window.confirm(`Confirm: You are deploying "${file.name}" for the ${plan?.name} tier?`);
      
      if (confirmUpload) {
        const newFile: ConfigFile = {
          id: 'f' + Date.now(),
          fileName: file.name,
          planId: uploadTargetPlanId,
          cycleStart: new Date().toISOString().split('T')[0],
          cycleEnd: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setUploadedFiles([newFile, ...uploadedFiles]);
        alert(`Transmission Success: ${file.name} is now active for ${plan?.name} subscribers.`);
      }
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black mb-3 tracking-tight uppercase">Admin Node Command</h1>
          <p className="text-slate-400 font-bold">Infrastructure Oversight: <span className="text-blue-500">PetZeusTech Core</span></p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mainframe Status: Online</span>
           </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-900/40 p-2 rounded-[2rem] border border-white/5 w-fit">
        {(['users', 'files', 'payments', 'plans'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass rounded-[3rem] overflow-hidden shadow-2xl min-h-[500px]">
        {activeTab === 'files' && (
          <div className="p-12 grid lg:grid-cols-2 gap-20">
            {/* Upload Section */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">Deploy Tier Node</h3>
                <p className="text-slate-500 text-sm">Select a subscription plan to associate with the new .sip configuration.</p>
              </div>

              <div className="bg-slate-950/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] ml-2">1. Target Access Tier</label>
                  <div className="grid grid-cols-2 gap-3">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setUploadTargetPlanId(plan.id)}
                        className={`p-4 rounded-2xl text-xs font-bold transition-all border text-left flex flex-col gap-1 ${
                          uploadTargetPlanId === plan.id 
                            ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                        }`}
                      >
                        <span className="uppercase tracking-widest">{plan.name}</span>
                        <span className="text-[9px] opacity-60">{plan.days}D Window</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] ml-2">2. Node File Selection</label>
                  <div className="group relative border-2 border-dashed border-white/10 rounded-[2rem] p-12 hover:border-blue-500/50 transition-all cursor-pointer bg-slate-950/50 text-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept=".sip" 
                      onChange={handleFileUpload} 
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      </div>
                      <p className="text-xl font-black uppercase tracking-tighter">Transmit .sip</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Selected Tier: <span className="text-blue-400">{plans.find(p => p.id === uploadTargetPlanId)?.name}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-black uppercase tracking-tight">Deployment History</h4>
                <p className="text-slate-500 text-sm">Review recently uploaded configurations per tier.</p>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                {uploadedFiles.length === 0 ? (
                  <div className="p-12 text-center border border-white/5 rounded-3xl bg-white/5">
                    <p className="text-slate-500 text-sm italic">No files deployed in current session.</p>
                  </div>
                ) : (
                  uploadedFiles.map((file) => {
                    const plan = plans.find(p => p.id === file.planId);
                    return (
                      <div key={file.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 flex justify-between items-center group hover:bg-white/10 hover:border-blue-500/20 transition-all shadow-xl">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan?.isTrial ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-600/10 text-blue-500'}`}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          </div>
                          <div>
                            <p className="font-black text-slate-100 uppercase tracking-tighter text-lg">{file.fileName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                                plan?.isTrial ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-600/10 text-blue-400 border-blue-500/20'
                              }`}>
                                {plan?.name || 'UNKNOWN TIER'}
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Uploaded: {file.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Active Node</span>
                          </div>
                          <p className="text-[9px] text-slate-600 font-mono uppercase">Cycle End: {file.cycleEnd}</p>
                          <button className="text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 transition-colors">Wipe File</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
           <div className="p-10">
              <div className="bg-slate-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      <tr>
                        <th className="p-8">Subscriber Node</th>
                        <th className="p-8">System Identifier</th>
                        <th className="p-8">Tier Access</th>
                        <th className="p-8">Global Status</th>
                        <th className="p-8 text-right">Administrative</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="p-8 font-black uppercase tracking-tighter text-slate-200">PetZeus_Node_{i * 47}</td>
                            <td className="p-8 text-xs font-mono text-slate-400">auth_sync_{i}@zeus-net.io</td>
                            <td className="p-8">
                                <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20">
                                  {['PRO_ELITE', 'STANDARD', 'BASIC', 'TRIAL_PASS'][i % 4]}
                                </span>
                            </td>
                            <td className="p-8">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Synchronized</span>
                                </div>
                            </td>
                            <td className="p-8 text-right">
                              <div className="flex justify-end gap-3">
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-white">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-slate-500 hover:text-red-500">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                </button>
                              </div>
                            </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
