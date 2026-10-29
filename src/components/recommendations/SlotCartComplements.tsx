import React, { useEffect, useState } from 'react';
import { useRecommendationService } from '../../hooks/useRecommendationService';
import { useCartStore } from '../../store/cartStore';
import { useDemoStore } from '../../store/demoStore';
import { RecommendedProduct } from '../../types/recommendations';
import { Plus, Sparkles } from 'lucide-react';

export const SlotCartComplements: React.FC = () => {
  const recommendationService = useRecommendationService();
  const { items, addItem } = useCartStore();
  const { exchangeRate, activeCurrency, explainabilityMode } = useDemoStore();

  const [complements, setComplements] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const cartProductIds = items.map((i) => i.product.id);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    recommendationService.getCartComplements(cartProductIds)
      .then((recs) => {
        if (isMounted) {
          setComplements(recs);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching cart complements:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [recommendationService, items.length]);

  if (loading) {
    return (
      <div className="p-3 bg-gray-50 rounded-xl my-3 border border-gray-100 animate-pulse">
        <div className="w-32 h-3.5 bg-gray-200 rounded mb-2" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    );
  }

  if (complements.length === 0) return null;

  return (
    <div 
      className="p-3.5 my-3 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white shadow-xs"
      data-testid="recommendation-slot-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <h4 className="text-xs font-bold text-gray-900">
            Completa tu pedido
          </h4>
        </div>
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
          Slot 3 (Cross-sell)
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {complements.map((rec) => {
          const priceBs = (rec.price * exchangeRate).toFixed(2);
          return (
            <div key={rec.id} className="py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src={rec.image_url} 
                  alt={rec.name} 
                  className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-gray-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate" title={rec.name}>
                    {rec.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">
                      {activeCurrency === 'USD' ? `$${rec.price.toFixed(2)}` : `Bs. ${priceBs}`}
                    </span>
                    {explainabilityMode && (
                      <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-1 rounded border border-blue-200">
                        score: {rec.metadata.confidence_score}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => addItem({
                  id: rec.id,
                  sku: rec.sku,
                  name: rec.name,
                  category: rec.category,
                  price: rec.price,
                  currency: rec.currency,
                  image_url: rec.image_url,
                  stock: rec.stock,
                  unit: '1 un'
                }, 1)}
                className="flex-shrink-0 inline-flex items-center gap-1 bg-[#1F9741] hover:bg-[#17852C] active:scale-95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full transition-all shadow-xs"
                aria-label={`Añadir complemento ${rec.name}`}
              >
                <Plus className="w-3 h-3 stroke-[3]" />
                <span>Sumar</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
