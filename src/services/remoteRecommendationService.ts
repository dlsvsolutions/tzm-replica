import { IRecommendationService, RecommendedProduct } from '../types/recommendations';
import { safeFetchJson } from '../utils/safeFetch';

export class RemoteRecommendationService implements IRecommendationService {
  private apiUrl: string;

  constructor(
    apiUrl: string = import.meta.env.VITE_RECOMMENDATION_API_URL || ''
  ) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  public setConfig(apiUrl: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  public async checkHealth(): Promise<{ online: boolean; message: string; latencyMs?: number }> {
    if (!this.apiUrl) {
      return { online: false, message: 'URL del motor de recomendaciones no configurada' };
    }

    const start = performance.now();
    const result = await safeFetchJson<{ status?: string }>(`${this.apiUrl}/health`);
    const latencyMs = Math.round(performance.now() - start);

    if (result.ok) {
      return { online: true, message: 'Conectado al motor de recomendaciones externo', latencyMs };
    }

    return { 
      online: false, 
      message: result.error || `Servidor de recomendaciones respondió con código ${result.status}`, 
      latencyMs 
    };
  }

  public async getPersonalizedHomeFeed(userId: string, limit: number = 6): Promise<RecommendedProduct[]> {
    if (!this.apiUrl) {
      return []; // Dejar en blanco si no hay servidor configurado
    }

    const endpoint = `${this.apiUrl}/feed?user_id=${encodeURIComponent(userId)}&limit=${limit}`;
    const result = await safeFetchJson<RecommendedProduct[] | { recommendations: RecommendedProduct[] }>(endpoint);

    if (result.ok && result.data) {
      return Array.isArray(result.data) ? result.data : result.data.recommendations || [];
    }

    // En caso de error o desconexión, retornar vacío para dejar la sección en blanco
    console.warn('Motor de recomendaciones no disponible o sin respuesta:', result.error);
    return [];
  }

  public async getFrequentlyBoughtTogether(productId: string): Promise<RecommendedProduct[]> {
    if (!this.apiUrl) {
      return []; // Dejar en blanco si no hay servidor configurado
    }

    const endpoint = `${this.apiUrl}/frequently-bought-together?product_id=${encodeURIComponent(productId)}`;
    const result = await safeFetchJson<RecommendedProduct[] | { recommendations: RecommendedProduct[] }>(endpoint);

    if (result.ok && result.data) {
      return Array.isArray(result.data) ? result.data : result.data.recommendations || [];
    }

    console.warn('Consulta FBT externa sin respuesta:', result.error);
    return [];
  }

  public async getSimilarAlternatives(productId: string, limit: number = 4): Promise<RecommendedProduct[]> {
    if (!this.apiUrl) {
      return [];
    }

    const endpoint = `${this.apiUrl}/alternatives?product_id=${encodeURIComponent(productId)}&limit=${limit}`;
    const result = await safeFetchJson<RecommendedProduct[] | { recommendations: RecommendedProduct[] }>(endpoint);

    if (result.ok && result.data) {
      return Array.isArray(result.data) ? result.data : result.data.recommendations || [];
    }

    return [];
  }

  public async getCartComplements(cartProductIds: string[]): Promise<RecommendedProduct[]> {
    if (!this.apiUrl || cartProductIds.length === 0) {
      return []; // Dejar en blanco
    }

    const endpoint = `${this.apiUrl}/cart-complements`;
    const result = await safeFetchJson<RecommendedProduct[] | { recommendations: RecommendedProduct[] }>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: cartProductIds }),
    });

    if (result.ok && result.data) {
      return Array.isArray(result.data) ? result.data : result.data.recommendations || [];
    }

    return [];
  }
}

export const defaultRemoteRecommendationService = new RemoteRecommendationService();
