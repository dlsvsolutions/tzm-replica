import React, { useEffect, useState } from 'react';
import { RecommendationProvider } from './context/RecommendationContext';
import { OdooProvider } from './context/OdooContext';
import { useOdooService } from './hooks/useOdooService';
import { Navbar } from './components/layout/Navbar';
import { CategoryBar } from './components/layout/CategoryBar';
import { HeroBanner } from './components/layout/HeroBanner';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { ProductCard } from './components/ui/ProductCard';
import { ProductSkeleton } from './components/ui/ProductSkeleton';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/ui/ProductDetailModal';
import { SlotHomeFeed } from './components/recommendations/SlotHomeFeed';
import { RecommendationDebugger } from './components/telemetry/RecommendationDebugger';
import { Product } from './types/product';
import { useDemoStore } from './store/demoStore';
import { useServerConfigStore } from './store/serverConfigStore';
import { Server, Database } from 'lucide-react';

export const AppContent: React.FC = () => {
  const odooService = useOdooService();
  const { activeCategory, searchQuery, setSearchQuery } = useDemoStore();
  const { odooHealth, recommendationHealth, checkAllServers, odooSessionId } = useServerConfigStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Check health on mount or when session changes
  useEffect(() => {
    checkAllServers();
  }, [checkAllServers, odooSessionId]);

  // Fetch live products from Odoo Service (DIP Abstraction)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    odooService.getProducts({
      category: activeCategory || undefined,
      search: searchQuery || undefined,
    })
      .then((items) => {
        if (isMounted) {
          setProducts(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error al cargar productos desde Odoo:', err);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [odooService, activeCategory, searchQuery, odooSessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#212529] font-rubik">
      <Navbar />

      {/* Distributed Architecture Server Status Bar */}
      <div className="bg-gray-900 text-gray-300 text-[11px] py-1.5 px-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
            <Server className="w-3 h-3" />
            <span>Frontend: Online (Vite/React)</span>
          </span>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-mono">
            <Database className="w-3 h-3 text-purple-400" />
            <span>
              Odoo ERP:{' '}
              {odooHealth.status === 'online' ? (
                <strong className="text-emerald-400">
                  Conectado {products.length > 0 ? `(${products.length} productos)` : ''}
                </strong>
              ) : odooHealth.status === 'checking' ? (
                <span className="text-amber-400">Verificando...</span>
              ) : (
                <span className="text-red-400">Desconectado / Requiere Sesión</span>
              )}
            </span>
          </span>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-mono">
            <span>
              Motor IA:{' '}
              {recommendationHealth.status === 'online' ? (
                <strong className="text-emerald-400">Conectado</strong>
              ) : (
                <span className="text-gray-400">Desconectado</span>
              )}
            </span>
          </span>
        </div>
        <span className="text-gray-500 hidden md:inline text-[10px]">
          Arquitectura 3 Servidores Desacoplados (DIP)
        </span>
      </div>

      <div id="category-bar-anchor">
        <CategoryBar />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero Promotional Banner */}
        <HeroBanner />

        {/* Slot 1: Personalized Recommendations Feed (se mantiene en blanco si el motor no responde) */}
        <SlotHomeFeed />

        {/* Catalog Section: Si la conexión a Odoo falla o no hay productos, se queda en blanco */}
        {loading ? (
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <ProductSkeleton count={8} />
            </div>
          </div>
        ) : products.length === 0 ? (
          /* Sección en blanco estricta requerida por el usuario hasta que Odoo cargue datos reales */
          <div className="py-8" data-testid="empty-catalog-blank" />
        ) : (
          <section className="mt-10 mb-6" data-testid="live-odoo-catalog">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200/80 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    {activeCategory ? `Categoría: ${activeCategory}` : 'Todos los Productos (Odoo Catalog)'}
                  </h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    {products.length} productos reales
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Alimentado en tiempo real desde Odoo ERP • Precios en USD ($) y Bolívares (Bs.)
                </p>
              </div>

              {searchQuery && (
                <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-full border border-emerald-200">
                  <span>Búsqueda: <strong>"{searchQuery}"</strong></span>
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="text-emerald-800 hover:text-emerald-950 font-bold ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <ProductDetailModal />
      <RecommendationDebugger />
      <MobileTabBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <OdooProvider>
      <RecommendationProvider>
        <AppContent />
      </RecommendationProvider>
    </OdooProvider>
  );
};

export default App;
