
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
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'payments'>('files');
  
  const [plans] = useState<SubscriptionPlan[]>([
    { id: 'standard', name: 'Standard', days: 7, price: 1000 },
    { id: 'pro', name: 'Pro Elite', days: 15, price: 1500 },
    { id: 'elite', name: 'Elite Access', days: 30, price: 3000 },
  ]);

  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>(() => {
    const saved = localStorage.getItem('mock_pending_payments');
    return saved ? JSON.parse(saved) : [
      { id: 'pay_1', userEmail: 'john@example.com', planName: 'Elite Access', amount: 3000, transId: 'TXN84729384', date: '2024-12-24' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mock_pending_payments', JSON.stringify(pendingPayments));
  }, [pendingPayments]);

  const approvePayment = (id: string) => {
    if (confirm("APPROVE SYNC: Have you verified this transaction in your MoMo app?")) {
      setPendingPayments(pendingPayments.filter(p => p.id !== id));
      alert("USER ACTIVATED: Node clearance granted.");
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState<ConfigFile[]>(() => {
    const saved = localStorage.getItem('mock_files');
    return saved ? JSON.parse(saved) : [];
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newFile: ConfigFile = {
      id: 'f' + Date.now(),
      fileName: file.name,
      planId: 'elite',
      cycleStart: new Date().toISOString().split('T')[0],
      cycleEnd: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setUploadedFiles([newFile, ...uploadedFiles]);
    alert("NODE BROADCAST STARTED");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
      <header className="border-b border-white/5 pb-10">
        <h1 className="text-4xl font-black uppercase tracking-tight">COMMAND CENTER</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">Matrix Management Terminal</p>
      </header>

      <div className="flex bg-slate-900/40 p-2 rounded-[2rem] border border-white/5 w-fit">
        {(['users', 'files', 'payments'] as const).map((tab) => (
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
            <h3 className="text-3xl font-black uppercase text-white">Verification Queue</h3>
            <div className="grid gap-4">
              {pendingPayments.length === 0 && <p className="text-slate-600 font-black uppercase tracking-widest text-center py-20">No pending verification requests.</p>}
              {pendingPayments.map(p => (
                <div key={p.id} className="bg-slate-950/40 border border-white/5 rounded-3xl p-8 flex justify-between items-center group">
                  <div>
                    <p className="font-black text-white text-xl uppercase tracking-tighter">{p.userEmail}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Plan: {p.planName}</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ID: {p.transId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="text-2xl font-black text-white">{p.amount} FRS</p>
                    <button 
                      onClick={() => approvePayment(p.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
           <div className="grid lg:grid-cols-2 gap-20">
              <div className="flex flex-col gap-10">
                 <h3 className="text-3xl font-black uppercase text-white">Broadcast Control</h3>
                 <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-20 text-center bg-slate-950/50 group hover:border-blue-500/50 transition-all relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                    <p className="font-black uppercase tracking-widest text-slate-400">Deploy .sip Node</p>
                 </div>
              </div>
              <div className="flex flex-col gap-6">
                 <h4 className="text-2xl font-black uppercase text-white">Active Nodes</h4>
                 {uploadedFiles.map(f => (
                   <div key={f.id} className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center">
                     <p className="font-black text-white uppercase">{f.fileName}</p>
                     <span className="text-[10px] font-black text-emerald-500 animate-pulse">Online</span>
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
