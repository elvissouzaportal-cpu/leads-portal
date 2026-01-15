
import { AppState, UserRole } from '../types.ts';

const STORAGE_KEY = 'disparleads_v2_data';

// Estendemos o Profile localmente para incluir password para o mock
export interface ProfileWithPass {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  password?: string;
}

const INITIAL_DATA: any = {
  user: null,
  profiles: [
    { id: '1', name: 'Admin Master', email: 'admin@disparleads.com', password: 'admin', role: UserRole.ADMIN, active: true },
    { id: '2', name: 'Vendedor Teste', email: 'vendedor@disparleads.com', password: '123', role: UserRole.SELLER, active: true },
    { id: '3', name: 'Maria Seller', email: 'maria@disparleads.com', password: '123', role: UserRole.SELLER, active: true },
  ],
  bases: [
    { id: 'base-1', name: 'Lançamento Mentorias', copy: 'Olá [NOME], vi seu interesse no curso!', createdAt: Date.now() }
  ],
  leads: [
    { id: 'l1', baseId: 'base-1', sellerId: '2', name: 'Lucas Silva', phone: '5511999999999', status: 'PENDING', createdAt: Date.now() },
    { id: 'l2', baseId: 'base-1', sellerId: '3', name: 'Fernanda Lima', phone: '5511888888888', status: 'PENDING', createdAt: Date.now() },
  ]
};

export const getDb = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DATA;
  } catch (e) {
    console.warn("LocalStorage indisponível, usando dados iniciais.", e);
    return INITIAL_DATA;
  }
};

export const saveDb = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Erro ao salvar no LocalStorage", e);
  }
};

export const resetDb = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  } catch (e) {
    window.location.reload();
  }
};
