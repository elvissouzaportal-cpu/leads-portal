
import React, { useMemo } from 'react';
import { AppState, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  state: AppState;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state }) => {
  const stats = useMemo(() => {
    const totalLeads = state.leads.length;
    const sentLeads = state.leads.filter(l => l.status === 'SENT').length;
    const pendingLeads = totalLeads - sentLeads;
    const conversionRate = totalLeads > 0 ? ((sentLeads / totalLeads) * 100).toFixed(1) : 0;

    return { totalLeads, sentLeads, pendingLeads, conversionRate };
  }, [state.leads]);

  const performanceData = useMemo(() => {
    return state.profiles
      .filter(p => p.role === UserRole.SELLER)
      .map(seller => ({
        name: seller.name,
        disparos: state.leads.filter(l => l.sellerId === seller.id && l.status === 'SENT').length,
        pendentes: state.leads.filter(l => l.sellerId === seller.id && l.status === 'PENDING').length,
      }));
  }, [state.leads, state.profiles]);

  const baseData = useMemo(() => {
    return state.bases.map(base => ({
      name: base.name,
      value: state.leads.filter(l => l.baseId === base.id).length,
    }));
  }, [state.leads, state.bases]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel Executivo</h1>
          <p className="text-slate-400">Visão geral do sistema e performance dos vendedores.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium uppercase tracking-wider">Sistema Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total de Leads" value={stats.totalLeads} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        <StatCard label="Disparos Feitos" value={stats.sentLeads} color="text-emerald-400" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard label="Aguardando" value={stats.pendingLeads} color="text-amber-400" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard label="Conversão" value={`${stats.conversionRate}%`} icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-8">Performance por Vendedor</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '12px' }}
                />
                <Bar dataKey="disparos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="pendentes" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-8 w-full">Volume por Base</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={baseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {baseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4 w-full">
            {baseData.map((base, i) => (
              <div key={base.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-sm text-slate-400">{base.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{base.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white", icon }: { label: string, value: string | number, color?: string, icon: string }) => (
  <div className="glass p-6 rounded-[2rem] border border-white/5 hover:border-indigo-500/20 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-600/10 transition-colors">
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium tracking-wide mb-1">{label}</p>
    <h4 className={`text-3xl font-bold tracking-tight ${color}`}>{value}</h4>
  </div>
);

export default AdminDashboard;
