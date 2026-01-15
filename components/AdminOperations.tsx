
import React, { useState } from 'react';
import { AppState, LeadBase, Lead, UserRole } from '../types';
import { generateCopySuggestion } from '../services/gemini';

interface AdminOperationsProps {
  state: AppState;
  onCreateBase: (base: LeadBase) => void;
  onImportLeads: (leads: Lead[]) => void;
  onToggleSeller: (id: string) => void;
}

const AdminOperations: React.FC<AdminOperationsProps> = ({ state, onCreateBase, onImportLeads, onToggleSeller }) => {
  const [baseName, setBaseName] = useState('');
  const [baseCopy, setBaseCopy] = useState('');
  const [csvContent, setCsvContent] = useState('');
  const [selectedBaseId, setSelectedBaseId] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  const handleCreateBase = () => {
    if (!baseName || !baseCopy) return;
    const newBase: LeadBase = {
      id: `base-${Date.now()}`,
      name: baseName,
      copy: baseCopy,
      createdAt: Date.now()
    };
    onCreateBase(newBase);
    setBaseName('');
    setBaseCopy('');
  };

  const handleSuggestCopy = async () => {
    if (!baseName) {
      alert("Digite o nome da base para o IA sugerir!");
      return;
    }
    setIsGeneratingCopy(true);
    const suggestion = await generateCopySuggestion(baseName);
    setBaseCopy(suggestion);
    setIsGeneratingCopy(false);
  };

  const handleImportCsv = () => {
    if (!selectedBaseId || !csvContent) {
      alert("Selecione uma base e cole o conteúdo CSV.");
      return;
    }

    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 1) return;

    const activeSellers = state.profiles.filter(p => p.role === UserRole.SELLER && p.active);
    if (activeSellers.length === 0) {
      alert("Nenhum vendedor ativo encontrado para distribuição.");
      return;
    }

    const newLeads: Lead[] = lines.map((line, index) => {
      const parts = line.split(',');
      const sellerIndex = index % activeSellers.length;
      return {
        id: `lead-${Date.now()}-${index}`,
        baseId: selectedBaseId,
        sellerId: activeSellers[sellerIndex].id,
        name: parts[0]?.trim() || 'Lead Sem Nome',
        phone: parts[1]?.trim().replace(/\D/g, '') || '',
        status: 'PENDING',
        createdAt: Date.now()
      };
    });

    onImportLeads(newLeads);
    setCsvContent('');
    alert(`${newLeads.length} leads importados e distribuídos via Round-Robin.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Centro de Operações</h1>
        <p className="text-slate-400">Gerencie bases, vendedores e fluxo de leads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Create Base Section */}
        <section className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-bold">01</span>
            Nova Base de Leads
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Campanha</label>
              <input 
                type="text" 
                className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all placeholder:text-slate-700"
                placeholder="Ex: Mentorias High Ticket Jan/2024"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-400">Copy do WhatsApp (Use [NOME])</label>
                <button 
                  onClick={handleSuggestCopy}
                  disabled={isGeneratingCopy}
                  className="text-xs flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {isGeneratingCopy ? 'Gerando...' : 'Sugerir com IA'}
                </button>
              </div>
              <textarea 
                className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all resize-none placeholder:text-slate-700"
                placeholder="Olá [NOME], vi seu interesse..."
                value={baseCopy}
                onChange={(e) => setBaseCopy(e.target.value)}
              />
            </div>
            <button 
              onClick={handleCreateBase}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Criar Base Operacional
            </button>
          </div>
        </section>

        {/* Import Leads Section */}
        <section className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <span className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-sm font-bold">02</span>
            Importação & Distribuição
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Selecione a Base</label>
              <select 
                className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                value={selectedBaseId}
                onChange={(e) => setSelectedBaseId(e.target.value)}
              >
                <option value="">Escolha uma base...</option>
                {state.bases.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Colar Leads (CSV: Nome, Telefone)</label>
              <textarea 
                className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all resize-none placeholder:text-slate-700 text-xs font-mono"
                placeholder="João Silva, 5511999999999&#10;Maria Oliveira, 5511888888888"
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
              />
            </div>
            <button 
              onClick={handleImportCsv}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20"
            >
              Distribuir Leads (Round-Robin)
            </button>
          </div>
        </section>

        {/* Sellers Management */}
        <section className="glass p-8 rounded-[2.5rem] border border-white/5 lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6">Controle de Vendedores Ativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.profiles.filter(p => p.role === UserRole.SELLER).map(seller => (
              <div key={seller.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{seller.name}</p>
                  <p className="text-xs text-slate-500">{seller.email}</p>
                </div>
                <button 
                  onClick={() => onToggleSeller(seller.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${seller.active ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${seller.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminOperations;
