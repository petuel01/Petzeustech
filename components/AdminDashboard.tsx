
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

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
  const [isLoading, setIsLoading] = useState(false);

  const [fileForm, setFileForm] = useState({
    planId: 'basic',
    fileName: null as File | null
  });

  const fetchPayments = async () => {
    try {
      const res = await fetch('./backend/get_payments.php');
      const data = await res.json();
      if (Array.isArray(data)) setPendingPayments(data);
    } catch (e) {
      console.error("API error: Could not fetch pending payments.");
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileForm.fileName) {
      alert("Please select a .sip file first.");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('plan_id', fileForm.planId);
    formData.append('config_file', fileForm.fileName);

    try {
      const res = await fetch('./backend/upload_api.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert("Broadcast Success: " + data.message);
        setFileForm({ planId: 'basic', fileName: null });
      } else {
        alert("Broadcast Error: " + data.error);
      }
    } catch (err) {
      alert("Terminal Critical Error: Failed to communicate with host.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setIsLoading(true);
    try {
      const res = await fetch('./backend/approve_payment_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: id, action })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchPayments();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("System Desync: Action could not be committed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10 animate-fade-in">
      <header className="border-b-4 border-white/5 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="group">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white group-hover:text-blue-500 transition-colors">Command Center</h1>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3">ARCHITECT COMMAND CENTER v14.2</p>
        </div>
        <div className="bg-blue-600 px-12 py-5 rounded-[2rem] shadow-3xl border-b-4 border-black/20">
           <span className="text-[15px] font-black text-white uppercase tracking-widest">MASTER CONTROL: ACTIVE</span>
        </div>
      </header>

      <div className="flex bg-[#0f172a] p-3 rounded-[2.5rem] border-2 border-white/10 w-fit gap-4 shadow-xl">
        {(['payments', 'files', 'tutorials'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-14 py-5 rounded-2xl font-black uppercase text-[13px] tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#0f172a]/60 border-4 border-white/5 rounded-[5rem] p-12 md:p-20 min-h-[600px] shadow-3xl backdrop-blur-xl">
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-16">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Pending Verification</h3>
            <div className="grid gap-10">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-40 text-slate-600 font-black uppercase tracking-[1em] opacity-30 animate-pulse">0 Requests In Pool</div>
              ) : (
                pendingPayments.map(p => (
                  <div key={p.id} className="bg-slate-950/60 border-2 border-white/10 rounded-[4rem] p-16 flex flex-col md:flex-row justify-between items-center gap-16 hover:border-blue-500/50 transition-all group">
                    <div>
                      <p className="font-black text-white text-4xl uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{p.userEmail}</p>
                      <div className="flex gap-6 mt-8">
                         <span className="text-[14px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-8 py-3 rounded-2xl border-2 border-blue-500/20">{p.planName}</span>
                         <span className="text-[14px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-8 py-3 rounded-2xl border-2 border-white/10">TX: {p.transId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <span className="text-6xl font-black text-white mr-16">{p.amount.toLocaleString()} <span className="text-lg text-slate-600">FRS</span></span>
                      <button onClick={() => handleAction(p.id, 'APPROVE')} className="bg-emerald-600 text-white px-16 py-7 rounded-[2rem] text-[16px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-500 transition-all border-b-4 border-black/20">VERIFY</button>
                      <button onClick={() => handleAction(p.id, 'REJECT')} className="bg-red-600/10 text-red-500 px-12 py-7 rounded-[2rem] text-[16px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border-2 border-red-500/20">REJECT</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="flex flex-col gap-16">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Broadcast Protocol</h3>
            <form onSubmit={handleFileUpload} className="bg-slate-950/60 p-20 rounded-[5rem] border-4 border-white/5 flex flex-col gap-16 shadow-inner">
               <div className="flex flex-col gap-6">
                  <label className="text-[15px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Target Node Tier</label>
                  <select 
                    value={fileForm.planId} 
                    onChange={e => setFileForm({...fileForm, planId: e.target.value})}
                    className="bg-[#0f172a] border-4 border-white/10 rounded-[2.5rem] p-8 text-[16px] font-black uppercase tracking-[0.2em] focus:border-blue-500 outline-none text-white shadow-2xl"
                  >
                    <option value="basic">Basic (3 Days)</option>
                    <option value="standard">Standard (7 Days)</option>
                    <option value="pro">Pro Elite (15 Days)</option>
                    <option value="elite">Monthly (30 Days)</option>
                    <option value="mtn_lite">MTN Lite</option>
                    <option value="mtn_monthly">MTN Monthly</option>
                  </select>
               </div>
               
               <div className="flex flex-col gap-6">
                  <label className="text-[15px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Protocol File (.sip)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".sip"
                      onChange={(e) => setFileForm({...fileForm, fileName: e.target.files?.[0] || null})}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-full bg-[#0f172a] border-8 border-dashed border-white/10 rounded-[5rem] py-28 text-center group-hover:border-blue-500/50 transition-all duration-700 shadow-inner">
                       <div className="w-24 h-24 bg-blue-600/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border-2 border-blue-500/20">
                          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                       </div>
                       <p className="text-[16px] font-black uppercase text-slate-400 group-hover:text-blue-400 tracking-[0.5em]">
                         {fileForm.fileName ? fileForm.fileName.name : 'UPLOAD PROTOCOL PAYLOAD'}
                       </p>
                    </div>
                  </div>
               </div>
               <button type="submit" disabled={isLoading} className="bg-blue-600 text-white py-10 rounded-[3rem] font-black text-[20px] uppercase tracking-[0.6em] shadow-[0_30px_80px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all disabled:opacity-50 border-b-8 border-black/20">
                {isLoading ? 'BROADCASTING...' : 'COMMIT UPDATE'}
               </button>
            </form>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="flex flex-col items-center justify-center py-48 gap-10">
             <p className="text-[20px] font-black uppercase tracking-[1em] animate-pulse text-white">Mentorship Link Active</p>
             <button className="bg-white/5 border border-white/10 px-12 py-6 rounded-3xl font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Configure Mentorship Modules</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
