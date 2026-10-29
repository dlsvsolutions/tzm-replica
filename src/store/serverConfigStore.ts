import { create } from 'zustand';
import { defaultOdooService } from '../services/odooService';
import { defaultRemoteRecommendationService } from '../services/remoteRecommendationService';

export interface ServerHealth {
  status: 'online' | 'offline' | 'checking' | 'not_configured';
  message: string;
  latencyMs?: number;
}

interface ServerConfigStore {
  // Odoo Server Configuration
  odooUrl: string;
  odooDb: string;
  odooApiKey: string;
  odooSessionId: string;
  odooHealth: ServerHealth;
  setOdooConfig: (url: string, db?: string, apiKey?: string, sessionId?: string) => void;
  setOdooSessionId: (sessionId: string) => void;
  authenticateOdoo: (login: string, pass: string) => Promise<{ success: boolean; message: string }>;
  checkOdooHealth: () => Promise<void>;

  // Recommendation Engine Server Configuration
  recommendationUrl: string;
  recommendationHealth: ServerHealth;
  setRecommendationUrl: (url: string) => void;
  checkRecommendationHealth: () => Promise<void>;

  // Test both servers
  checkAllServers: () => Promise<void>;
}

export const useServerConfigStore = create<ServerConfigStore>((set, get) => ({
  odooUrl: import.meta.env.VITE_ODOO_API_URL || 'https://odoo.tuzonamarket.com',
  odooDb: import.meta.env.VITE_ODOO_DB || 'odoo',
  odooApiKey: import.meta.env.VITE_ODOO_API_KEY || '',
  odooSessionId: import.meta.env.VITE_ODOO_SESSION_ID || (typeof localStorage !== 'undefined' ? localStorage.getItem('odoo_session_id') || '' : ''),
  odooHealth: {
    status: 'checking',
    message: 'Comprobando conexión con Odoo...'
  },

  recommendationUrl: import.meta.env.VITE_RECOMMENDATION_API_URL || '',
  recommendationHealth: {
    status: import.meta.env.VITE_RECOMMENDATION_API_URL ? 'checking' : 'not_configured',
    message: import.meta.env.VITE_RECOMMENDATION_API_URL ? 'Comprobando conexión...' : 'Motor de recomendaciones no configurado'
  },

  setOdooConfig: (url, db = 'odoo', apiKey = '', sessionId = '') => {
    defaultOdooService.setConfig(url, db, apiKey, sessionId);
    set({ odooUrl: url, odooDb: db, odooApiKey: apiKey, odooSessionId: sessionId });
    get().checkOdooHealth();
  },

  setOdooSessionId: (sessionId: string) => {
    defaultOdooService.setSessionId(sessionId);
    set({ odooSessionId: sessionId });
    get().checkOdooHealth();
  },

  authenticateOdoo: async (login: string, pass: string) => {
    set((s) => ({ odooHealth: { ...s.odooHealth, status: 'checking', message: 'Iniciando sesión en Odoo...' } }));
    const authRes = await defaultOdooService.authenticate(login, pass);
    if (authRes.success && authRes.sessionId) {
      set({ odooSessionId: authRes.sessionId });
    }
    await get().checkOdooHealth();
    return { success: authRes.success, message: authRes.message };
  },

  checkOdooHealth: async () => {
    set((s) => ({ odooHealth: { ...s.odooHealth, status: 'checking', message: 'Probando conexión con Odoo...' } }));
    const result = await defaultOdooService.checkHealth();
    set({
      odooHealth: {
        status: result.online ? 'online' : (get().odooUrl ? 'offline' : 'not_configured'),
        message: result.message,
        latencyMs: result.latencyMs,
      }
    });
  },

  setRecommendationUrl: (url) => {
    defaultRemoteRecommendationService.setConfig(url);
    set({ recommendationUrl: url });
    get().checkRecommendationHealth();
  },

  checkRecommendationHealth: async () => {
    if (!get().recommendationUrl) {
      set({
        recommendationHealth: {
          status: 'not_configured',
          message: 'Motor de recomendaciones no configurado'
        }
      });
      return;
    }
    set((s) => ({ recommendationHealth: { ...s.recommendationHealth, status: 'checking', message: 'Probando conexión con motor de recomendaciones...' } }));
    const result = await defaultRemoteRecommendationService.checkHealth();
    set({
      recommendationHealth: {
        status: result.online ? 'online' : (get().recommendationUrl ? 'offline' : 'not_configured'),
        message: result.message,
        latencyMs: result.latencyMs,
      }
    });
  },

  checkAllServers: async () => {
    await Promise.all([get().checkOdooHealth(), get().checkRecommendationHealth()]);
  }
}));
