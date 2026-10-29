import { Product, Branch } from './product';

export interface OdooServerConfig {
  apiUrl: string;
  db?: string;
  apiKey?: string;
  sessionId?: string;
  login?: string;
  password?: string;
}

export interface OdooProductDTO {
  id: number | string;
  default_code?: string | false; // SKU in Odoo
  name?: string;
  display_name?: string;
  list_price?: number; // Price in default currency (USD)
  price_bs?: number;
  qty_available?: number; // Current on-hand stock
  categ_id?: [number, string] | false; // [id, name]
  public_categ_ids?: [number, string][] | { id: number; name: string }[] | number[] | false;
  image_128?: string | false; // Odoo base64
  image_256?: string | false;
  image_1920?: string | false;
  image_url?: string;
  uom_id?: [number, string] | false;
  uom_name?: string;
  description_sale?: string | false;
}

export interface IOdooService {
  getProducts(params?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getCategories(): Promise<{ id: string; name: string; icon?: string }[]>;
  getBranches(): Promise<Branch[]>;
  checkHealth(): Promise<{ online: boolean; message: string; latencyMs?: number }>;
  authenticate?(login: string, password: string): Promise<{ success: boolean; message: string; sessionId?: string; uid?: number }>;
  setSessionId?(sessionId: string): void;
  getSessionId?(): string;
}
