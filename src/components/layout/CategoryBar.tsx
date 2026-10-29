import React from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Category } from '../../types/product';

const CATEGORIES: { name: Category | 'Todos'; icon: string }[] = [
  { name: 'Todos', icon: '/assets/brand/icon-category.svg' },
  { name: 'Víveres', icon: '/assets/brand/viveres.svg' },
  { name: 'Harinas', icon: '/assets/brand/viveres.svg' },
  { name: 'Lácteos', icon: '/assets/brand/lacteos.svg' },
  { name: 'Carnicería', icon: '/assets/brand/carniceria.svg' },
  { name: 'Snacks', icon: '/assets/brand/snacks.svg' },
  { name: 'Bebidas', icon: '/assets/brand/bebidas.svg' },
  { name: 'Limpieza', icon: '/assets/brand/limpieza.svg' },
];

export const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory } = useDemoStore();

  return (
    <div className="bg-white border-b border-gray-200/70 py-2.5 overflow-x-auto scrollbar-none font-rubik">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = (cat.name === 'Todos' && activeCategory === null) || activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveCategory(cat.name === 'Todos' ? null : cat.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#1F9741] text-white shadow-xs'
                  : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
              }`}
              data-testid={`category-chip-${cat.name.toLowerCase()}`}
            >
              <img 
                src={cat.icon} 
                alt="" 
                className={`w-3.5 h-3.5 object-contain ${isSelected ? 'brightness-0 invert' : ''}`} 
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
