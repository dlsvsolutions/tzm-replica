import { PersonaProfile } from '../types/persona';

export const PERSONAS: Record<string, PersonaProfile> = {
  persona_groceries: {
    id: 'persona_groceries',
    name: 'Carmen Silva (Despensa Familiar)',
    role: 'Comprador de Despensa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    description: 'Madre de familia en Valencia. Compra quincenal de víveres esenciales, harinas y lácteos para 4 personas.',
    preferredCategories: ['Víveres', 'Harinas', 'Lácteos', 'Carnicería'],
    intent: 'Reabastecimiento de canasta básica y productos de alta frecuencia'
  },
  persona_snacks: {
    id: 'persona_snacks',
    name: 'Andrés Mendoza (Comprador Impulsivo)',
    role: 'Comprador Impulsivo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    description: 'Joven profesional en Naguanagua. Pedidos de fin de semana con antojos, botanas, refrescos y cervezas.',
    preferredCategories: ['Snacks', 'Bebidas'],
    intent: 'Consumo inmediato, reuniones sociales y confitería'
  },
  persona_coldstart: {
    id: 'persona_coldstart',
    name: 'Usuario Nuevo (Sin Historial)',
    role: 'Cold Start / Explorador',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    description: 'Primera visita a TuZonaMarket. Sin historial de clics ni compras previas registradas.',
    preferredCategories: ['Víveres', 'Snacks', 'Bebidas'],
    intent: 'Estrategia de arranque en frío basada en popularidad y tendencias locales'
  }
};
