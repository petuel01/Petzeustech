
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
      const pRes = await fetch('./backend/get_payments.php');
      if (!pRes.ok) throw new Error("Payments node offline");
      const pData = await pRes.json();
      if (Array.isArray(pData)) setPendingPayments(pData);

      const uRes = await fetch('./backend/get_users_api.php');
      if (!uRes.ok) throw new Error("Users node offline");
      const uData = await uRes.json();
      if (Array.isArray(uData)) setAllUsers(uData);
    } catch (e) {
      console.error("Critical Node Sync Error:", e);
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
        alert(`Broadcast Success: Tier ${fileForm.planId.toUpperCase()} updated.`);
        setFileForm({ planId: 'basic', fileName: null });
        const input = document.getElementById('config_input') as HTMLInputElement;
        if (input) input.value = '';
      } else {
        alert(data.error || "Broadcast failed.");
      }
    } catch (e) {
      alert("Network Error: Could not reach broadcast node.");
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Confirm ${action} for transaction ID: ${id}?`)) return;
    try {
      const res = await fetch('./backend/approve_payment_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: id, action })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (e) {
      alert("Terminal Sync Failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">COMMAND CENTER</h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Master Architect: {user.name}</p>
        </div>
        <div className="flex gap-4">
          {[
            { id: 'payments', label: 'TRANSACTIONS' },
            { id: 'files', label: 'PAYLOAD BROADCAST' },
            { id: 'users', label: 'NETWORK MAP' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'payments' && (
        <div className="bg-[#0f172a] rounded-[3rem] border-2 border-white/5 overflow-hidden shadow-3xl">
          <div className="p-10 border-b border-white/5 bg-slate-950/20">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Incoming Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/50">
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Node</th>
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Tier</th>
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">TXID (Verified)</th>
                  <th className="p-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-8">
                      <p className="text-sm font-black text-white">{p.userEmail}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-1">{p.date}</p>
                    </td>
                    <td className="p-8">
                      <span className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                        {p.planName}
                      </span>
                    </td>
                    <td className="p-8 text-white font-black">{p.amount.toLocaleString()} FRS</td>
                    <td className="p-8 text-white font-mono tracking-widest">{p.transId}</td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => processPayment(p.id, 'APPROVE')} 
                          className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => processPayment(p.id, 'REJECT')} 
                          className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">No pending transactions in current cluster cycle.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="max-w-2xl mx-auto w-full bg-[#0f172a] p-12 rounded-[3rem] border-2 border-white/5 shadow-3xl text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">PAYLOAD BROADCAST</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 leading-relaxed">
            ASSOCIATE SECURE .SIP CONFIGURATIONS WITH TARGET SUBSCRIPTION TIERS.
          </p>
          
          <form onSubmit={handleFileUpload} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Target Plan ID</label>
              <select 
                value={fileForm.planId}
                onChange={e => setFileForm({...fileForm, planId: e.target.value})}
                className="w-full bg-slate-950 border-2 border-white/5 rounded-2xl p-6 text-white font-black outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="trial">Orange 24H Trial</option>
                <option value="basic">Orange Basic Tier</option>
                <option value="standard">Orange Standard Tier</option>
                <option value="pro">Orange Pro Elite</option>
                <option value="orange_monthly">Orange Monthly Unlimited</option>
                <option value="mtn_lite">MTN Lite Tier</option>
                <option value="mtn_monthly">MTN Monthly Unlimited</option>
                <option value="master">Architect Master File (Lifetime)</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Protocol File (.sip)</label>
              <input 
                id="config_input"
                type="file"
                accept=".sip"
                onChange={e => setFileForm({...fileForm, fileName: e.target.files?.[0] || null})}
                className="hidden"
              />
              <label 
                htmlFor="config_input"
                className="w-full bg-slate-950/50 border-2 border-dashed border-white/10 rounded-2xl p-12 text-slate-500 font-black uppercase tracking-widest cursor-pointer hover:border-blue-500/50 hover:bg-slate-950 transition-all flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                </div>
                {fileForm.fileName ? (
                   <span className="text-white">{fileForm.fileName.name}</span>
                ) : (
                   <span>Drop .sip payload or Click to Select</span>
                )}
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {isLoading ? 'BROADCASTING TO NODE...' : 'INITIATE TIER BROADCAST'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#0f172a] rounded-[3rem] border-2 border-white/5 overflow-hidden shadow-3xl">
          <div className="p-10 border-b border-white/5 bg-slate-950/20">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Network Map (Active Connections)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/50">
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity Node</th>
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">System Role</th>
                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Heartbeat</th>
                  <th className="p-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Archived</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-8">
                      <p className="text-sm font-black text-white">{u.name}</p>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{u.email}</p>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                         <span className="text-[10px] font-black uppercase text-white">{u.status}</span>
                       </div>
                    </td>
                    <td className="p-8 text-right text-[10px] font-mono text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
