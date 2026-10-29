import { IOdooService, OdooProductDTO } from '../types/odoo';
import { Product, Branch } from '../types/product';
import { safeFetchJson } from '../utils/safeFetch';

export class OdooService implements IOdooService {
  private apiUrl: string;
  private db: string;
  private loginUser: string;
  private apiKey: string;
  private sessionId: string;
  private uid: number | null = null;
  private useProxyInDev: boolean = true;

  constructor(
    apiUrl: string = import.meta.env.VITE_ODOO_TARGET || 'https://odoo.tuzonamarket.com',
    db: string = import.meta.env.VITE_ODOO_DB || 'odoo',
    apiKey: string = import.meta.env.VITE_ODOO_API_KEY || '',
    sessionId: string = import.meta.env.VITE_ODOO_SESSION_ID || '',
    loginUser: string = (import.meta.env as Record<string, string | undefined>).VITE_ODOO_USER || ''
  ) {
    const cleanUrl = apiUrl === '/api/odoo'
      ? (import.meta.env.VITE_ODOO_TARGET || 'https://odoo.tuzonamarket.com')
      : apiUrl;
    this.apiUrl = cleanUrl.replace(/\/$/, '');
    this.db = (typeof localStorage !== 'undefined' ? localStorage.getItem('odoo_db') : null) || db || 'odoo';
    this.loginUser = (typeof localStorage !== 'undefined' ? localStorage.getItem('odoo_login') : null) || loginUser || '';
    this.apiKey = (typeof localStorage !== 'undefined' ? localStorage.getItem('odoo_api_key') : null) || apiKey || '';
    this.sessionId = sessionId || (typeof localStorage !== 'undefined' ? localStorage.getItem('odoo_session_id') || '' : '');
    const savedUid = typeof localStorage !== 'undefined' ? localStorage.getItem('odoo_uid') : null;
    this.uid = savedUid ? Number(savedUid) : null;
  }

  public setConfig(apiUrl: string, db: string = 'odoo', apiKey?: string, sessionId?: string, loginUser?: string) {
    if (apiUrl && apiUrl !== '/api/odoo') {
      this.apiUrl = apiUrl.replace(/\/$/, '');
    }
    if (db) {
      this.db = db.trim();
      if (typeof localStorage !== 'undefined') localStorage.setItem('odoo_db', this.db);
    }
    if (apiKey !== undefined && apiKey !== '') {
      this.apiKey = apiKey.trim();
      if (typeof localStorage !== 'undefined') localStorage.setItem('odoo_api_key', this.apiKey);
    }
    if (loginUser !== undefined && loginUser !== '') {
      this.loginUser = loginUser.trim();
      if (typeof localStorage !== 'undefined') localStorage.setItem('odoo_login', this.loginUser);
    }
    if (sessionId !== undefined && sessionId !== '') {
      this.setSessionId(sessionId);
    }
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId.trim();
    if (typeof localStorage !== 'undefined') {
      if (this.sessionId) {
        localStorage.setItem('odoo_session_id', this.sessionId);
      } else {
        localStorage.removeItem('odoo_session_id');
      }
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getEffectiveUrl(): string {
    if (import.meta.env.DEV && this.useProxyInDev && this.apiUrl.startsWith('http')) {
      return '/api/odoo';
    }
    return this.apiUrl;
  }

  public setUseProxy(enable: boolean) {
    this.useProxyInDev = enable;
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  public getDb(): string {
    return this.db;
  }

  public getLoginUser(): string {
    return this.loginUser;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  private mapOdooToProduct(dto: OdooProductDTO): Product {
    const targetUrl = this.getEffectiveUrl();

    let categoryName = 'General';
    if (Array.isArray(dto.categ_id) && dto.categ_id.length > 1) {
      categoryName = String(dto.categ_id[1]);
    } else if (Array.isArray(dto.public_categ_ids) && dto.public_categ_ids.length > 0) {
      const first = dto.public_categ_ids[0];
      if (Array.isArray(first) && first.length > 1) {
        categoryName = String(first[1]);
      } else if (typeof first === 'object' && first && 'name' in first) {
        categoryName = String((first as { name: string }).name);
      }
    }

    let imageUrl = dto.image_url || '';
    if (!imageUrl) {
      if (dto.image_256 && typeof dto.image_256 === 'string') {
        imageUrl = `data:image/png;base64,${dto.image_256}`;
      } else if (dto.image_128 && typeof dto.image_128 === 'string') {
        imageUrl = `data:image/png;base64,${dto.image_128}`;
      } else if (dto.image_1920 && typeof dto.image_1920 === 'string') {
        imageUrl = `data:image/png;base64,${dto.image_1920}`;
      } else if (dto.id) {
        imageUrl = `${targetUrl}/web/image?model=product.template&id=${dto.id}&field=image_256`;
      }
    }

    let unit = dto.uom_name || '1 un';
    if (Array.isArray(dto.uom_id) && dto.uom_id.length > 1) {
      unit = String(dto.uom_id[1]);
    }

    return {
      id: String(dto.id),
      sku: dto.default_code ? String(dto.default_code) : `ODOO-${dto.id}`,
      name: dto.name || dto.display_name || `Producto #${dto.id}`,
      category: categoryName,
      price: typeof dto.list_price === 'number' ? dto.list_price : 0,
      currency: 'USD',
      image_url: imageUrl,
      stock: typeof dto.qty_available === 'number' ? dto.qty_available : 10,
      unit,
      description: typeof dto.description_sale === 'string' ? dto.description_sale : undefined,
    };
  }

  public async authenticate(
    login: string,
    passwordOrApiKey: string
  ): Promise<{ success: boolean; message: string; sessionId?: string; uid?: number }> {
    try {
      const res = await safeFetchJson<{
        ok: boolean;
        sessionId?: string;
        uid?: number;
        db?: string;
        name?: string;
        username?: string;
        error?: string;
      }>('/api/odoo-proxy/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: this.apiUrl,
          db: this.db || 'odoo',
          login: login.trim(),
          password: passwordOrApiKey.trim(),
        }),
      });

      if (res.ok && res.data?.ok && res.data.uid) {
        this.uid = res.data.uid;
        this.loginUser = login.trim();
        this.apiKey = passwordOrApiKey.trim();
        if (res.data.db) {
          this.db = res.data.db;
        }
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('odoo_uid', String(this.uid));
          localStorage.setItem('odoo_login', this.loginUser);
          localStorage.setItem('odoo_api_key', this.apiKey);
          localStorage.setItem('odoo_db', this.db);
        }
        if (res.data.sessionId) {
          this.setSessionId(res.data.sessionId);
        } else {
          // Generamos un identificador de sesión RPC para disparar la reactividad en Zustand/App.tsx
          this.setSessionId(`rpc-uid-${res.data.uid}-${Date.now()}`);
        }
        return {
          success: true,
          message: `Conectado a Odoo (DB: ${this.db}, UID: ${res.data.uid})`,
          sessionId: this.sessionId,
          uid: res.data.uid,
        };
      }

      const errMsg = res.data?.error || res.error || 'Credenciales inválidas en Odoo';
      return { success: false, message: errMsg };
    } catch (e) {
      return { success: false, message: e instanceof Error ? e.message : 'Error al conectar con Odoo' };
    }
  }

  public async checkHealth(): Promise<{ online: boolean; message: string; latencyMs?: number }> {
    const start = performance.now();
    try {
      const result = await safeFetchJson<{
        result?: { records?: OdooProductDTO[]; length?: number; db?: string; uid?: number };
        error?: { code?: number; message?: string; data?: { name?: string; message?: string } };
      }>('/api/odoo-proxy/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: this.apiUrl,
          db: this.db,
          uid: this.uid,
          login: this.loginUser,
          apiKey: this.apiKey,
          sessionId: this.sessionId.startsWith('rpc-uid-') ? '' : this.sessionId,
          limit: 1,
        }),
      });
      const latencyMs = Math.round(performance.now() - start);

      if (result.ok && result.data?.result?.records) {
        if (result.data.result.db) this.db = result.data.result.db;
        if (result.data.result.uid) this.uid = result.data.result.uid;
        return {
          online: true,
          message: `Conectado a Odoo (DB: ${this.db}) — Catálogo activo`,
          latencyMs,
        };
      }

      const detailErr =
        result.data?.error?.data?.message ||
        result.data?.error?.message ||
        result.error ||
        'Requiere iniciar sesión con Usuario + Contraseña/API Key';

      return {
        online: false,
        message: detailErr,
        latencyMs,
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        online: false,
        message: err instanceof Error ? err.message : 'Error verificando Odoo',
        latencyMs,
      };
    }
  }

  public async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    if (!this.sessionId && !this.apiKey) {
      return [];
    }

    try {
      const result = await safeFetchJson<{
        result?: { records?: OdooProductDTO[]; length?: number };
        error?: { message?: string; data?: { message?: string } };
      }>('/api/odoo-proxy/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: this.apiUrl,
          db: this.db,
          uid: this.uid,
          login: this.loginUser,
          apiKey: this.apiKey,
          sessionId: this.sessionId.startsWith('rpc-uid-') ? '' : this.sessionId,
          category: params?.category,
          search: params?.search,
          limit: params?.limit || 40,
          offset: params?.offset || 0,
        }),
      });

      if (result.ok && result.data?.result?.records) {
        return result.data.result.records.map((dto) => this.mapOdooToProduct(dto));
      }

      if (result.data?.error) {
        console.error('Error RPC Odoo getProducts:', result.data.error);
      }
    } catch (err) {
      console.error('Excepción en getProducts:', err);
    }

    return [];
  }

  public async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts({ limit: 50 });
    return products.find((p) => p.id === id) || null;
  }

  public async getCategories(): Promise<{ id: string; name: string; icon?: string }[]> {
    return [];
  }

  public async getBranches(): Promise<Branch[]> {
    return [];
  }
}

export const defaultOdooService = new OdooService();
