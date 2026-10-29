import { create } from 'zustand';
import { PersonaId } from '../types/persona';
import { Product } from '../types/product';

interface DemoStore {
  activePersona: PersonaId;
  setPersona: (id: PersonaId) => void;
  explainabilityMode: boolean;
  toggleExplainability: () => void;
  simulatedLatencyMs: number;
  setSimulatedLatency: (ms: number) => void;
  activeCurrency: 'USD' | 'VES';
  toggleCurrency: () => void;
  exchangeRate: number; // 1 USD = X Bs.
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductForPDP: Product | null;
  openPDP: (product: Product) => void;
  closePDP: () => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
  activePersona: 'persona_groceries',
  setPersona: (id) => set({ activePersona: id }),
  explainabilityMode: true,
  toggleExplainability: () => set((s) => ({ explainabilityMode: !s.explainabilityMode })),
  simulatedLatencyMs: 350, // Default 350ms to demonstrate smooth skeleton without slowing users
  setSimulatedLatency: (ms) => set({ simulatedLatencyMs: ms }),
  activeCurrency: 'USD',
  toggleCurrency: () => set((s) => ({ activeCurrency: s.activeCurrency === 'USD' ? 'VES' : 'USD' })),
  exchangeRate: 46.50, // Tasa BCV de referencia
  selectedBranchId: 'b-val-norte',
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  activeCategory: null,
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedProductForPDP: null,
  openPDP: (product) => set({ selectedProductForPDP: product }),
  closePDP: () => set({ selectedProductForPDP: null }),
}));
