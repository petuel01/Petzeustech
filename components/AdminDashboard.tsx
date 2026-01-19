
import React, { useState, useEffect } from 'react';
import { User, TutorialStep } from '../types';

interface AdminDashboardProps { user: User; }

interface PendingPayment {
  id: string;
  userEmail: string;
  planName: string;
  amount: number;
  transId: string;
  date: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'payments' | 'tutorials'>('payments');
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [tutorials, setTutorials] = useState<TutorialStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fileForm, setFileForm] = useState({
    planId: 'trial',
    validityDays: 1,
    fileName: ''
  });

  const [tutorialForm, setTutorialForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    order: 1
  });

  useEffect(() => {
    fetchPayments();
    fetchTutorials();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('./backend/get_payments.php');
      const data = await res.json();
      setPendingPayments(data || []);
    } catch (err) {
      setPendingPayments([
        { id: '1', userEmail: 'user@zeus.com', planName: 'Mastery Mentorship', amount: 15000, transId: 'TXN-M-99', date: new Date().toISOString() }
      ]);
    }
  };

  const fetchTutorials = async () => {
    try {
      const res = await fetch('./backend/tutorials_api.php');
      const data = await res.json();
      setTutorials(data || []);
    } catch (err) { setTutorials([]); }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    alert(`System Update: Broadcasted new payload for ${fileForm.planId}.\nValidity: ${fileForm.validityDays} Days Tracking.`);
    setIsLoading(false);
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setIsLoading(true);
    alert(`Transaction ${action === 'APPROVE' ? 'Synchronized' : 'Terminated'}.`);
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10 animate-fade-in">
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Command Terminal</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">NETWORK MANAGEMENT v9.0</p>
        </div>
        <div className="bg-blue-600/10 px-6 py-2 rounded-xl border border-blue-500/20">
           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Master Auth: ADMIN</span>
        </div>
      </header>

      <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/10 w-fit">
        {(['payments', 'files', 'tutorials'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 min-h-[500px] shadow-2xl">
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Verification Queue</h3>
            <div className="grid gap-6">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-20 text-slate-600 font-black uppercase tracking-widest">Queue Clear - All Terminals Verified</div>
              ) : (
                pendingPayments.map(p => (
                  <div key={p.id} className="bg-slate-950/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:border-blue-500/30 transition-all">
                    <div>
                      <p className="font-black text-white text-xl uppercase tracking-tighter">{p.userEmail}</p>
                      <div className="flex gap-2 mt-2">
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">{p.planName}</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">TRANS: {p.transId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black mr-6 text-white">{p.amount.toLocaleString()} FRS</span>
                      <button onClick={() => handleAction(p.id, 'APPROVE')} className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Approve</button>
                      <button onClick={() => handleAction(p.id, 'REJECT')} className="bg-red-600/10 text-red-500 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="flex flex-col gap-10">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Broadcast Payload Cluster</h3>
            <form onSubmit={handleFileUpload} className="bg-slate-950/40 p-10 rounded-[3rem] border border-white/5 flex flex-col gap-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Network Plan</label>
                     <select 
                       value={fileForm.planId} 
                       onChange={e => setFileForm({...fileForm, planId: e.target.value})}
                       className="bg-slate-900 border border-white/10 rounded-2xl p-4.5 text-sm font-bold uppercase tracking-widest focus:border-blue-500 outline-none"
                     >
                       <optgroup label="Orange Unlimited">
                         <option value="trial">24H Trial</option>
                         <option value="basic">Basic (3D)</option>
                         <option value="standard">Standard (7D)</option>
                         <option value="pro">Pro (15D)</option>
                         <option value="elite">Elite (30D)</option>
                         <option value="mastery">Mastery (90D)</option>
                       </optgroup>
                       <optgroup label="MTN 200MB Daily">
                         <option value="mtn_lite">MTN Lite (15D)</option>
                         <option value="mtn_monthly">MTN Monthly (30D)</option>
                       </optgroup>
                     </select>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Set Validity Duration (Days)</label>
                     <input 
                       type="number" 
                       value={fileForm.validityDays} 
                       onChange={e => setFileForm({...fileForm, validityDays: parseInt(e.target.value)})}
                       className="bg-slate-900 border border-white/10 rounded-2xl p-4.5 text-sm font-bold focus:border-blue-500 outline-none"
                     />
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payload Sync File (.sip)</label>
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full bg-slate-900 border-2 border-dashed border-white/10 rounded-[2rem] py-14 text-center group-hover:border-blue-500/50 transition-all">
                       <p className="text-xs font-black uppercase text-slate-400 group-hover:text-blue-400">DROP PAYLOAD CONFIGURATION NODE</p>
                    </div>
                  </div>
               </div>
               <button type="submit" disabled={isLoading} className="btn-primary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl">BROADCAST UPDATE</button>
            </form>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="text-center py-20 opacity-30">
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Mentorship Matrix Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
