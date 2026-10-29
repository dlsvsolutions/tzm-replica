export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  currency: string;
  image_url: string;
  stock: number;
  unit: string;
  discount_percent?: number;
  tags?: string[];
  description?: string;
  brand?: string;
}

export type Category = 
  | 'Víveres'
  | 'Harinas'
  | 'Lácteos'
  | 'Carnicería'
  | 'Snacks'
  | 'Bebidas'
  | 'Limpieza';

export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  deliveryTime: string;
}
