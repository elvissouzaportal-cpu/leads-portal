
import React, { useState, useEffect } from 'react';
import { AppState, UserRole, Profile, LeadBase, Lead } from './types.ts';
import { getDb, saveDb } from './services/mockDb.ts';
import Login from './components/Login.tsx';
import Layout from './components/Layout.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminOperations from './components/AdminOperations.tsx';
import SellerQueue from './components/SellerQueue.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => getDb());
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'operations' | 'queue'>('dashboard');

  useEffect(() => {
    saveDb(state);
  }, [state]);

  const handleLogin = (email: string) => {
    const profile = state.profiles.find(p => p.email === email);
    if (profile) {
      setState(prev => ({ ...prev, user: profile }));
      setCurrentTab(profile.role === UserRole.ADMIN ? 'dashboard' : 'queue');
    } else {
      const newSeller: Profile = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        role: UserRole.SELLER,
        active: true
      };
      setState(prev => ({
        ...prev,
        user: newSeller,
        profiles: [...prev.profiles, newSeller]
      }));
      setCurrentTab('queue');
    }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null }));
  };

  const handleCreateBase = (base: LeadBase) => {
    setState(prev => ({ ...prev, bases: [base, ...prev.bases] }));
  };

  const handleImportLeads = (newLeads: Lead[]) => {
    setState(prev => ({ ...prev, leads: [...newLeads, ...prev.leads] }));
  };

  const handleUpdateLeadStatus = (leadId: string) => {
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => 
        l.id === leadId ? { ...l, status: 'SENT', sentAt: Date.now() } : l
      )
    }));
  };

  const toggleSellerActive = (sellerId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => 
        p.id === sellerId ? { ...p, active: !p.active } : p
      )
    }));
  };

  if (!state.user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={state.user} 
      currentTab={currentTab} 
      onTabChange={(tab: any) => setCurrentTab(tab)} 
      onLogout={handleLogout}
    >
      {state.user.role === UserRole.ADMIN ? (
        <>
          {currentTab === 'dashboard' && (
            <AdminDashboard state={state} />
          )}
          {currentTab === 'operations' && (
            <AdminOperations 
              state={state} 
              onCreateBase={handleCreateBase}
              onImportLeads={handleImportLeads}
              onToggleSeller={toggleSellerActive}
            />
          )}
        </>
      ) : (
        <SellerQueue 
          leads={state.leads.filter(l => l.sellerId === state.user?.id)}
          bases={state.bases}
          onUpdateStatus={handleUpdateLeadStatus}
        />
      )}
    </Layout>
  );
};

export default App;
