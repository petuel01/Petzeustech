
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
  const [activeTab, setActiveTab] = useState<'files' | 'payments' | 'users'>('payments');
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fileForm, setFileForm] = useState({
    planId: 'basic',
    fileName: null as File | null
  });

  const fetchData = async () => {
    try {
      // Sync Payments
      const pRes = await fetch('./backend/get_payments.php');
      const pData = await pRes.json();
      if (Array.isArray(pData)) setPendingPayments(pData);

      // Sync Network Map (All Users)
      const uRes = await fetch('./backend/get_users_api.php');
      const uData = await uRes.json();
      if (Array.isArray(uData)) setAllUsers(uData);
    } catch (e) {
      console.error("Critical Node Sync Error: Terminal offline.");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileForm.fileName) {
      alert("Select .sip payload first.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('plan_id', fileForm.planId);
    formData.append('config_file', fileForm.fileName);
    try {
      const res = await fetch('./backend/upload_api.php', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        alert("Broadcast Success: Tier " + fileForm.planId + " updated.");
        setFileForm({ planId: 'basic', fileName: null });
      }
    } catch (err) { alert("Terminal Error: Resource busy."); }
    finally { setIsLoading(false); }
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
      if (data.success) { fetchData(); }
    } catch (e) { alert("Action Failed."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10 animate-fade-in">
      <header className="border-b-4 border-white/5 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white">Command Center</h1>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3">PETZEUSTECH ARCHITECT v15.0</p>
        </div>
        <div className="bg-blue-600 px-12 py-5 rounded-[2rem] shadow-3xl border-b-4 border-black/20">
           <span className="text-[15px] font-black text-white uppercase tracking-widest">MASTER CONTROL: ACTIVE</span>
        </div>
      </header>

      {/* Control Tabs */}
      <div className="flex bg-[#0f172a] p-2 rounded-[2.5rem] border-2 border-white/10 w-fit gap-2 shadow-xl">
        {(['payments', 'files', 'users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-200'}`}
          >
            {tab === 'users' ? 'Network Map' : tab}
          </button>
        ))}
      </div>

      <div className="bg-[#0f172a]/60 border-4 border-white/5 rounded-[5rem] p-8 md:p-16 min-h-[600px] shadow-3xl backdrop-blur-xl">
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Pending Requests</h3>
            {pendingPayments.length === 0 ? (
              <div className="text-center py-40 text-slate-700 font-black uppercase tracking-[1em] opacity-30 animate-pulse">Request Pool Clear</div>
            ) : (
              pendingPayments.map(p => (
                <div key={p.id} className="bg-slate-950/60 border-2 border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10 hover:border-blue-500/50 transition-all group">
                  <div className="text-center md:text-left">
                    <p className="font-black text-white text-3xl uppercase tracking-tighter">{p.userEmail}</p>
                    <p className={`font-black uppercase text-[10px] tracking-widest mt-2 ${p.planName.includes('Master') ? 'text-purple-500' : 'text-blue-500'}`}>
                      {p.planName} • ID: {p.transId}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-4xl font-black text-white">{p.amount.toLocaleString()}</span>
                    <button onClick={() => handleAction(p.id, 'APPROVE')} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl border-b-4 border-black/20 active:translate-y-1 transition-all">VERIFY</button>
                    <button onClick={() => handleAction(p.id, 'REJECT')} className="bg-red-600/10 text-red-500 px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">REJECT</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Network Map (All Registered Nodes)</h3>
              <span className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Nodes: {allUsers.length}
              </span>
            </div>
            <div className="grid gap-4">
              {allUsers.map(u => (
                <div key={u.id} className="bg-slate-950/40 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-950/60 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center font-black text-blue-500 border border-blue-500/20">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-black uppercase tracking-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role}
                    </span>
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-red-600/10 text-red-500'}`}>
                      {u.status}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="flex flex-col gap-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Broadcast Protocol Node</h3>
            <form onSubmit={handleFileUpload} className="bg-slate-950/60 p-12 rounded-[4rem] border-4 border-white/5 flex flex-col gap-10 shadow-inner">
               <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Target Tier</label>
                  <select 
                    value={fileForm.planId} 
                    onChange={e => setFileForm({...fileForm, planId: e.target.value})}
                    className="bg-[#0f172a] border-4 border-white/10 rounded-[2rem] p-6 text-sm font-black uppercase tracking-widest focus:border-blue-500 outline-none text-white shadow-2xl appearance-none"
                  >
                    <option value="trial">Trial Node</option>
                    <option value="basic">Basic Node</option>
                    <option value="standard">Standard Node</option>
                    <option value="pro">Pro Elite Node</option>
                    <option value="mtn_lite">MTN Lite</option>
                    <option value="mtn_monthly">MTN Monthly</option>
                    <option value="master">Mastery Elite (File Creation)</option>
                  </select>
               </div>
               
               <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Payload File (.sip)</label>
                  <input 
                    type="file" accept=".sip"
                    onChange={(e) => setFileForm({...fileForm, fileName: e.target.files?.[0] || null})}
                    className="bg-white/5 p-12 rounded-[2rem] border-4 border-dashed border-white/10 text-white font-black text-center cursor-pointer hover:border-blue-500/50 transition-all"
                  />
               </div>

               <button type="submit" disabled={isLoading} className="bg-blue-600 text-white py-8 rounded-[2rem] font-black text-lg uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all disabled:opacity-50 border-b-4 border-black/20">
                {isLoading ? 'ENCRYPTING...' : 'UPDATE & BROADCAST'}
               </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
