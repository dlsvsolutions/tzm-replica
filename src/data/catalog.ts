import { Product, Branch } from '../types/product';

// Cero productos de prueba: el catálogo se carga 100% dinámicamente desde Odoo ERP (product.template).
export const VENEZUELAN_CATALOG: Product[] = [];

// Sucursales físicas de TuZonaMarket en Venezuela
export const BRANCHES: Branch[] = [
  {
    id: 'b-val-norte',
    name: 'Sucursal Valencia Norte',
    city: 'Valencia',
    state: 'Carabobo',
    deliveryTime: '30-45 min',
  },
  {
    id: 'b-barq-este',
    name: 'Sucursal Barquisimeto Este',
    city: 'Barquisimeto',
    state: 'Lara',
    deliveryTime: '40-60 min',
  },
  {
    id: 'b-val-sandiego',
    name: 'Sucursal San Diego',
    city: 'San Diego',
    state: 'Carabobo',
    deliveryTime: '35-50 min',
  },
];
