import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useDemoStore } from '../../store/demoStore';
import { Home, Grid, Search, User, ShoppingBag } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const { openCart, getTotalItems } = useCartStore();
  const { setActiveCategory } = useDemoStore();
  const totalCartCount = getTotalItems();

  const handleScrollToSearch = () => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth' });
      searchInput.focus();
    }
  };

  return (
    <nav 
      id="menu-mini"
      className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-200 shadow-lg z-40 px-3 flex items-center justify-around font-rubik"
      aria-label="Navegación móvil"
      data-testid="mobile-tabbar"
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => {
          setActiveCategory(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center justify-center text-gray-600 hover:text-[#1F9741] py-1 px-2"
        aria-label="Inicio"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Inicio</span>
      </button>

      {/* 2. Categories */}
      <button
        type="button"
        onClick={() => {
          const categoryBar = document.querySelector('#category-bar-anchor');
          if (categoryBar) categoryBar.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex flex-col items-center justify-center text-gray-600 hover:text-[#1F9741] py-1 px-2"
        aria-label="Categorías"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Categorías</span>
      </button>

      {/* 3. Search */}
      <button
        type="button"
        onClick={handleScrollToSearch}
        className="flex flex-col items-center justify-center text-gray-600 hover:text-[#1F9741] py-1 px-2"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Buscar</span>
      </button>

      {/* 4. Account */}
      <button
        type="button"
        onClick={() => alert('Panel de Mi Cuenta TuZonaMarket')}
        className="flex flex-col items-center justify-center text-gray-600 hover:text-[#1F9741] py-1 px-2"
        aria-label="Mi Cuenta"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Cuenta</span>
      </button>

      {/* 5. Cart */}
      <button
        type="button"
        onClick={openCart}
        className="relative flex flex-col items-center justify-center text-[#1F9741] py-1 px-2"
        aria-label="Abrir carrito"
        data-testid="mobile-cart-button"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          {totalCartCount > 0 && (
            <span 
              className="absolute -top-1.5 -right-2 bg-[#E00000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
              data-testid="mobile-cart-badge"
            >
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-1">Carrito</span>
      </button>
    </nav>
  );
};
