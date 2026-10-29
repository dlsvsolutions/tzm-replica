import React, { useState, useEffect } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { useCartStore } from '../../store/cartStore';
import { BRANCHES } from '../../data/catalog';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  User, 
  ChevronDown, 
  Sparkles, 
  X,
  DollarSign
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    selectedBranchId, 
    setSelectedBranchId, 
    searchQuery, 
    setSearchQuery, 
    activeCurrency, 
    toggleCurrency 
  } = useDemoStore();

  const { openCart, getTotalItems } = useCartStore();
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState(searchQuery);

  const selectedBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];
  const totalCartCount = getTotalItems();

  // Debounce search query update (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(debouncedInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedInput, setSearchQuery]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs font-rubik">
      {/* Top Banner Notice (Venezuela Local Market Context) */}
      <div className="bg-[#17852C] text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-lime-300" />
        <span>Envíos express en menos de 60 minutos en Carabobo y Lara • Tasa oficial BCV</span>
      </div>

      <nav id="menu-normal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Isotype */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="#" className="flex items-center gap-2 group" aria-label="TuZonaMarket Inicio">
            <img 
              src="/assets/brand/logo.svg" 
              alt="TuZonaMarket Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </a>

          {/* Branch / Zone Selector */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              aria-expanded={isBranchDropdownOpen}
              aria-label="Seleccionar sucursal de entrega"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1F9741]" />
              <div className="text-left">
                <span className="block text-[10px] text-gray-700 leading-none">Sucursal:</span>
                <span className="font-bold text-gray-800 leading-tight block truncate max-w-[130px]">
                  {selectedBranch.city}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isBranchDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in"
                onMouseLeave={() => setIsBranchDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-gray-100 text-[11px] font-bold text-gray-600 uppercase">
                  Selecciona tu zona de despacho
                </div>
                {BRANCHES.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      branch.id === selectedBranchId 
                        ? 'bg-emerald-50 text-[#1F9741] font-bold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="block font-semibold">{branch.name}</span>
                      <span className="text-[10px] text-gray-700">{branch.deliveryTime}</span>
                    </div>
                    {branch.id === selectedBranchId && (
                      <span className="w-2 h-2 rounded-full bg-[#1F9741]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar with Debounce */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <input
              type="text"
              value={debouncedInput}
              onChange={(e) => setDebouncedInput(e.target.value)}
              placeholder="Buscar en TuZonaMarket (harina, café, queso, snacks...)"
              className="w-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-full border border-gray-200 focus:border-[#1F9741] focus:ring-2 focus:ring-[#1F9741]/20 outline-hidden transition-all text-gray-800 placeholder-gray-400"
              data-testid="global-search-input"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {debouncedInput && (
              <button
                type="button"
                onClick={() => setDebouncedInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Currency Switcher Toggle */}
          <button
            type="button"
            onClick={toggleCurrency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
            title={`Moneda activa: ${activeCurrency}. Clic para cambiar`}
            aria-label="Alternar moneda de visualización"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#1F9741]" />
            <span>{activeCurrency}</span>
          </button>

          {/* User Account Button (Mock) */}
          <button
            type="button"
            onClick={() => alert('Panel de Mi Cuenta de TuZonaMarket')}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 font-semibold px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Mi Cuenta"
          >
            <User className="w-4 h-4 text-gray-600" />
            <span className="hidden lg:inline">Mi Cuenta</span>
          </button>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-2 bg-[#1F9741] hover:bg-[#17852C] active:scale-95 text-white px-3.5 sm:px-4 py-2 rounded-full transition-all shadow-sm"
            data-testid="navbar-cart-button"
            aria-label={`Ver carrito con ${totalCartCount} productos`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            <span className="hidden sm:inline text-xs font-bold">Carrito</span>
            {totalCartCount > 0 && (
              <span 
                className="bg-[#E00000] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                data-testid="cart-badge-count"
              >
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
