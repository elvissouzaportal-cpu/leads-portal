
export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER'
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface LeadBase {
  id: string;
  name: string;
  copy: string;
  image?: string; // Base64 ou URL da imagem
  createdAt: number;
}

export interface Lead {
  id: string;
  baseId: string;
  sellerId: string;
  name: string;
  phone: string;
  status: 'PENDING' | 'SENT';
  sentAt?: number;
  createdAt: number;
}

export interface AppState {
  user: Profile | null;
  profiles: Profile[];
  bases: LeadBase[];
  leads: Lead[];
}
