
import React, { useState } from 'react';
import { Profile, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: Profile;
  currentTab: 'dashboard' | 'operations' | 'queue';
  onTabChange: (tab: 'dashboard' | 'operations' | 'queue') => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentTab, onTabChange, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200">
      {/* Sidebar Desktop */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out glass border-r border-white/5`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">DisparLeads</span>
          </div>

          <nav className="flex-1 space-y-3">
            {user.role === UserRole.ADMIN ? (
              <>
                <SidebarItem 
                  active={currentTab === 'dashboard'} 
                  onClick={() => { onTabChange('dashboard'); setMobileMenuOpen(false); }}
                  label="Dashboard" 
                  icon={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                />
                <SidebarItem 
                  active={currentTab === 'operations'} 
                  onClick={() => { onTabChange('operations'); setMobileMenuOpen(false); }}
                  label="Operações" 
                  icon={<path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />}
                />
              </>
            ) : (
              <SidebarItem 
                active={currentTab === 'queue'} 
                onClick={() => { onTabChange('queue'); setMobileMenuOpen(false); }}
                label="Fila de Envios" 
                icon={<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
              />
            )}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 glass flex items-center px-6 justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white">DisparLeads</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </header>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icon}
    </svg>
    <span className="font-medium">{label}</span>
  </button>
);

export default Layout;
