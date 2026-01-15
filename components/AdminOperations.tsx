
import React, { useState, useRef } from 'react';
import { AppState, LeadBase, Lead, UserRole } from '../types.ts';
import * as XLSX from 'xlsx';

interface AdminOperationsProps {
  state: AppState;
  onCreateBase: (base: LeadBase) => void;
  onImportLeads: (leads: Lead[]) => void;
  onToggleSeller: (id: string) => void;
}

const AdminOperations: React.FC<AdminOperationsProps> = ({ state, onCreateBase, onImportLeads, onToggleSeller }) => {
  const [baseName, setBaseName] = useState('');
  const [baseCopy, setBaseCopy] = useState('');
  const [baseImage, setBaseImage] = useState<string | undefined>(undefined);
  const [csvContent, setCsvContent] = useState('');
  const [selectedBaseId, setSelectedBaseId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBase = () => {
    if (!baseName || !baseCopy) return;
    const newBase: LeadBase = {
      id: `base-${Date.now()}`,
      name: baseName,
      copy: baseCopy,
      image: baseImage,
      createdAt: Date.now()
    };
    onCreateBase(newBase);
    setBaseName('');
    setBaseCopy('');
    setBaseImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const exportBase = (format: 'xlsx' | 'xls' | 'csv' | 'ods') => {
    if (!selectedBaseId) {
      alert("Selecione uma base para exportar.");
      return;
    }

    const base = state.bases.find(b => b.id === selectedBaseId);
    const leadsToExport = state.leads.filter(l => l.baseId === selectedBaseId);

    if (leadsToExport.length === 0) {
      alert("Esta base não possui leads para exportar.");
      return;
    }

    const data = leadsToExport.map(l => ({
      Nome: l.name,
      Telefone: l.phone,
      Status: l.status,
      Vendedor: state.profiles.find(p => p.id === l.sellerId)?.name || 'N/A',
      Data_Importacao: new Date(l.createdAt).toLocaleString(),
      Data_Envio: l.sentAt ? new Date(l.sentAt).toLocaleString() : 'Pendente'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    const fileName = `Export_${base?.name || 'Leads'}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      XLSX.writeFile(wb, `${fileName}.csv`, { bookType: 'csv' });
    } else if (format === 'xlsx') {
      XLSX.writeFile(wb, `${fileName}.xlsx`, { bookType: 'xlsx' });
    } else if (format === 'xls') {
      XLSX.writeFile(wb, `${fileName}.xls`, { bookType: 'biff8' });
    } else if (format === 'ods') {
      XLSX.writeFile(wb, `${fileName}.ods`, { bookType: 'ods' });
    }
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
                placeholder="Ex: Lançamento Jan/2024"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
              />
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-2">Imagem do Produto/Copy</label>
                <div className="relative group">
                   <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="base-image-upload"
                  />
                  <label 
                    htmlFor="base-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all cursor-pointer overflow-hidden"
                  >
                    {baseImage ? (
                      <img src={baseImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500">
                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium uppercase">Selecionar Imagem</span>
                      </div>
                    )}
                  </label>
                  {baseImage && (
                    <button 
                      onClick={() => setBaseImage(undefined)}
                      className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 px-1">Copy do WhatsApp (Use [NOME])</label>
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

        {/* Import & Export Section */}
        <section className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <span className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-sm font-bold">02</span>
            Gestão & Exportação
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

            {/* Export Buttons */}
            {selectedBaseId && (
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Baixar Relatório da Base</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => exportBase('xlsx')} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-white/5">.XLSX</button>
                  <button onClick={() => exportBase('xls')} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-white/5">.XLS</button>
                  <button onClick={() => exportBase('csv')} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-white/5">.CSV</button>
                  <button onClick={() => exportBase('ods')} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-white/5">.ODS</button>
                </div>
              </div>
            )}

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
