
import React from 'react';
import { Lead, LeadBase } from '../types';

interface SellerQueueProps {
  leads: Lead[];
  bases: LeadBase[];
  onUpdateStatus: (id: string) => void;
}

const SellerQueue: React.FC<SellerQueueProps> = ({ leads, bases, onUpdateStatus }) => {
  const pendingLeads = leads.filter(l => l.status === 'PENDING').sort((a, b) => b.createdAt - a.createdAt);
  const sentLeads = leads.filter(l => l.status === 'SENT').sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0));

  const handleDispatch = (lead: Lead) => {
    const base = bases.find(b => b.id === lead.baseId);
    if (!base) return;

    const formattedMessage = base.copy.replace(/\[NOME\]/gi, lead.name);
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${lead.phone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    onUpdateStatus(lead.id);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Minha Fila de Atendimento</h1>
        <p className="text-slate-400">Total de {pendingLeads.length} leads aguardando seu contato.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Pending Queue */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Pendentes Próximos</h3>
          </div>

          <div className="space-y-4">
            {pendingLeads.length > 0 ? pendingLeads.map(lead => (
              <div key={lead.id} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between group">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg text-white truncate">{lead.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full">NOVO</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-slate-400 text-sm font-medium">{lead.phone}</p>
                    <p className="text-slate-600 text-xs font-medium uppercase tracking-wider">
                      Base: {bases.find(b => b.id === lead.baseId)?.name || 'Desconhecida'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDispatch(lead)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all transform group-hover:scale-[1.05] shadow-lg shadow-indigo-600/20"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.6-16.5-14.7-27.6-32.8-30.8-38.4-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.9-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  Disparar
                </button>
              </div>
            )) : (
              <div className="glass p-12 rounded-[2rem] border border-dashed border-white/10 text-center">
                <p className="text-slate-500 font-medium">Tudo limpo por aqui! Ninguém na fila.</p>
              </div>
            )}
          </div>
        </section>

        {/* History / Sent Leads */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Histórico de Hoje</h3>
          </div>

          <div className="space-y-3">
            {sentLeads.length > 0 ? sentLeads.map(lead => (
              <div key={lead.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between opacity-60">
                <div>
                  <h5 className="text-slate-200 font-semibold">{lead.name}</h5>
                  <p className="text-xs text-slate-500">{new Date(lead.sentAt || 0).toLocaleTimeString()}</p>
                </div>
                <div className="text-emerald-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center opacity-30">
                <p className="text-sm">Nenhum envio realizado ainda.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerQueue;
