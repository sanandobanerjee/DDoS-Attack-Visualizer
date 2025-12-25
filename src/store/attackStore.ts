'use client';

import { create } from 'zustand';
import { DDoSAttack, AttackStats } from '@/types/attacks';

interface AttackState {
  attacks: DDoSAttack[];
  stats: AttackStats | null;
  isConnected: boolean; 
  error: string | null;
  
  // Actions
  addAttack: (attack: DDoSAttack) => void;
  removeAttack: (id: string) => void;
  updateStats: (stats: AttackStats) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  clearAttacks: () => void;
  getRecentAttacks: (count: number) => DDoSAttack[];
}

export const useAttackStore = create<AttackState>((set, get) => ({
  attacks: [],
  stats: null,
  isConnected: false,
  error: null,

  addAttack: (attack: DDoSAttack) => {
    set((state) => {
      // Keep only last 1000 attacks in memory for performance
      const newAttacks = [attack, ...state.attacks].slice(0, 1000);
      return { attacks: newAttacks };
    });
  },

  removeAttack: (id: string) => {
    set((state) => ({
      attacks: state.attacks.filter((a) => a.id !== id),
    }));
  },

  updateStats: (stats: AttackStats) => {
    set({ stats });
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearAttacks: () => {
    set({ attacks: [], stats: null });
  },

  getRecentAttacks: (count: number) => {
    return get().attacks.slice(0, count);
  },
}));
