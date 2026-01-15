
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && pass) onLogin(email, pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] premium-shadow border border-white/10 z-10 transition-all hover:border-indigo-500/30">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">DisparLeads <span className="text-indigo-400">v2.0</span></h1>
          <p className="text-slate-400 mt-2 text-center text-sm">Acesse o portal para gerenciar seus disparos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 px-1">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all placeholder:text-slate-600"
              placeholder="vendedor@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 px-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            Entrar no Portal
          </button>
        </form>

        <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Acesso para Testes</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="text-slate-400"><b className="text-white">Admin:</b> admin@disparleads.com<br/><b>Pass:</b> admin</div>
            <div className="text-slate-400"><b className="text-white">Seller:</b> vendedor@disparleads.com<br/><b>Pass:</b> 123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
