import React, { useEffect, useState, useRef } from 'react';
import { useRecommendationService } from '../../hooks/useRecommendationService';
import { useDemoStore } from '../../store/demoStore';
import { RecommendedProduct } from '../../types/recommendations';
import { ProductCard } from '../ui/ProductCard';
import { ProductSkeleton } from '../ui/ProductSkeleton';
import { Sparkles, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { PERSONAS } from '../../data/personas';

export const SlotHomeFeed: React.FC = () => {
  const recommendationService = useRecommendationService();
  const { activePersona } = useDemoStore();
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentPersona = PERSONAS[activePersona] || PERSONAS.persona_groceries;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    recommendationService.getPersonalizedHomeFeed(activePersona, 6)
      .then((items) => {
        if (isMounted) {
          setRecommendations(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching home feed recommendations:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [recommendationService, activePersona]);

  // Si no hay recomendaciones o falló la conexión al motor, dejar la sección completamente en blanco
  if (!loading && recommendations.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="my-8 bg-gradient-to-r from-emerald-50/60 via-white to-green-50/40 p-5 rounded-2xl border border-emerald-100 shadow-sm"
      data-testid="recommendation-slot-1"
    >
      {/* Slot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-emerald-100/70 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1F9741] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                Recomendados para ti
              </h2>
              <span className="bg-[#1F9741]/10 text-[#1F9741] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#1F9741]/20">
                Slot 1 (DIP)
              </span>
            </div>
            <p className="text-xs text-gray-700 flex items-center gap-1.5 mt-0.5">
              <UserCheck className="w-3.5 h-3.5 text-gray-700 inline" />
              <span>Personalizado para: <strong>{currentPersona.name}</strong> ({currentPersona.role})</span>
            </p>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shadow-xs"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shadow-xs"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Carousel Grid */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          <ProductSkeleton count={4} />
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="min-w-[260px] sm:min-w-[280px] max-w-[280px] snap-start flex-shrink-0">
              <ProductCard 
                product={{
                  id: rec.id,
                  sku: rec.sku,
                  name: rec.name,
                  category: rec.category,
                  price: rec.price,
                  currency: rec.currency,
                  image_url: rec.image_url,
                  stock: rec.stock,
                  unit: '1 un'
                }}
                metadata={rec.metadata}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
