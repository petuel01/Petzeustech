
import React, { useState, useEffect } from 'react';
import { User, ConfigFile, SubscriptionPlan } from '../types';

interface AdminDashboardProps {
  user: User;
}

interface PendingPayment {
  id: string;
  userEmail: string;
  planName: string;
  amount: number;
  transId: string;
  date: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'payments'>('payments');
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<ConfigFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchFiles();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('./backend/get_payments.php'); // You would create this simple GET wrapper
      const data = await res.json();
      setPendingPayments(data || []);
    } catch (err) {
      // Simulation for preview if backend not yet hit
      setPendingPayments([]);
    }
  };

  const fetchFiles = async () => {
    // Similar fetch for files
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action} this transaction?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('./backend/approve_payment_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: id, action })
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchPayments();
      }
    } catch (err) {
      alert("Terminal Sync Error. Check Backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, planId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('config_file', file);
    formData.append('plan_id', planId);

    try {
      const res = await fetch('./backend/upload_api.php', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        alert("NODE BROADCASTED SUCCESSFULLY");
        fetchFiles();
      }
    } catch (err) {
      alert("Upload Interrupted.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      <header className="border-b border-white/5 pb-10">
        <h1 className="text-4xl font-black uppercase tracking-tight">COMMAND CENTER</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">Matrix Management Terminal</p>
      </header>

      <div className="flex bg-slate-900/40 p-2 rounded-[2rem] border border-white/5 w-fit">
        {(['payments', 'files'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass rounded-[3rem] min-h-[500px] overflow-hidden p-10">
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-8">
            <h3 className="text-3xl font-black uppercase text-white">Manual Verification Queue</h3>
            <div className="grid gap-4">
              {pendingPayments.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-600 font-black uppercase tracking-widest mb-4">No active verification requests.</p>
                  <button onClick={fetchPayments} className="text-blue-500 font-black text-[10px] uppercase">Refresh Data</button>
                </div>
              )}
              {pendingPayments.map(p => (
                <div key={p.id} className="bg-slate-950/40 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-grow">
                    <p className="font-black text-white text-xl uppercase tracking-tighter">{p.userEmail}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Plan: {p.planName}</span>
                      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">TXN: {p.transId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-black text-white mr-4">{p.amount} FRS</p>
                    <button onClick={() => handleAction(p.id, 'APPROVE')} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Verify</button>
                    <button onClick={() => handleAction(p.id, 'REJECT')} className="bg-red-600/10 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
           <div className="grid lg:grid-cols-3 gap-8">
              {['standard', 'pro', 'elite'].map(tier => (
                <div key={tier} className="glass p-8 rounded-[2.5rem] flex flex-col gap-6 border-white/5 bg-slate-950/20">
                   <h4 className="text-xl font-black uppercase text-white">{tier} Payload</h4>
                   <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center relative hover:border-blue-500/50 transition-all">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, tier)} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Node</p>
                   </div>
                   <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Current Active</p>
                      <p className="text-xs font-bold text-white truncate">Searching Node...</p>
                   </div>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
