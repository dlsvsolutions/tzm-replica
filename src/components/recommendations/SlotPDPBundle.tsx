import React, { useEffect, useState } from 'react';
import { Product } from '../../types/product';
import { RecommendedProduct } from '../../types/recommendations';
import { useRecommendationService } from '../../hooks/useRecommendationService';
import { useCartStore } from '../../store/cartStore';
import { useDemoStore } from '../../store/demoStore';
import { Plus, Check, ShoppingBag, Sparkles, Tag } from 'lucide-react';

interface SlotPDPBundleProps {
  currentProduct: Product;
}

export const SlotPDPBundle: React.FC<SlotPDPBundleProps> = ({ currentProduct }) => {
  const recommendationService = useRecommendationService();
  const { addBundle } = useCartStore();
  const { exchangeRate, activeCurrency, explainabilityMode } = useDemoStore();

  const [partners, setPartners] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bundleAdded, setBundleAdded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setBundleAdded(false);

    recommendationService.getFrequentlyBoughtTogether(currentProduct.id)
      .then((items) => {
        if (isMounted) {
          setPartners(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching FBT bundle:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [recommendationService, currentProduct.id]);

  if (loading) {
    return (
      <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-gray-50/70 animate-pulse">
        <div className="w-48 h-4 bg-gray-200 rounded mb-4" />
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (partners.length === 0) return null;

  // Bundle calculations
  const allBundleProducts: Product[] = [
    currentProduct,
    ...partners.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
      currency: p.currency,
      image_url: p.image_url,
      stock: p.stock,
      unit: '1 un',
    })),
  ];

  const originalTotalUsd = allBundleProducts.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscountRate = 0.10; // 10% de descuento en el combo
  const discountedTotalUsd = Number((originalTotalUsd * (1 - bundleDiscountRate)).toFixed(2));
  const savingsUsd = Number((originalTotalUsd - discountedTotalUsd).toFixed(2));

  const discountedTotalBs = (discountedTotalUsd * exchangeRate).toFixed(2);
  const savingsBs = (savingsUsd * exchangeRate).toFixed(2);

  const handleAddBundle = () => {
    addBundle(allBundleProducts);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2500);
  };

  return (
    <div 
      className="mt-6 p-5 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 via-white to-pink-50/30 shadow-sm"
      data-testid="recommendation-slot-2"
    >
      {/* Slot Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Frecuentemente comprados juntos
            </h3>
            <span className="text-[11px] font-semibold text-purple-700">
              Slot 2 (Algoritmo de Co-ocurrencia & Bundle Savings)
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Tag className="w-3 h-3" />
          Ahorra 10% Combo
        </span>
      </div>

      {explainabilityMode && partners[0]?.metadata && (
        <div className="mb-4 bg-purple-100/60 border border-purple-200/80 rounded-lg p-2 text-xs text-purple-900 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold font-mono text-[11px]">
              {partners[0].metadata.algorithm} (score: {partners[0].metadata.confidence_score})
            </span>
            <p className="text-[11px] text-purple-800 mt-0.5">{partners[0].metadata.reason}</p>
          </div>
        </div>
      )}

      {/* Visual Product Nodes with '+' Connectors */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 my-3">
        {/* Current Product Node */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-white border border-gray-200 shadow-xs w-24 text-center">
          <img 
            src={currentProduct.image_url} 
            alt={currentProduct.name} 
            className="w-14 h-14 object-contain rounded mb-1" 
          />
          <span className="text-[10px] font-semibold text-gray-800 line-clamp-1">
            {currentProduct.name}
          </span>
          <span className="text-[11px] font-bold text-gray-900 mt-0.5">
            ${currentProduct.price.toFixed(2)}
          </span>
        </div>

        {/* Partners */}
        {partners.map((partner) => (
          <React.Fragment key={partner.id}>
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-white border border-gray-200 shadow-xs w-24 text-center">
              <img 
                src={partner.image_url} 
                alt={partner.name} 
                className="w-14 h-14 object-contain rounded mb-1" 
              />
              <span className="text-[10px] font-semibold text-gray-800 line-clamp-1">
                {partner.name}
              </span>
              <span className="text-[11px] font-bold text-gray-900 mt-0.5">
                ${partner.price.toFixed(2)}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Total and Action CTA */}
      <div className="mt-4 pt-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-700 font-medium">Precio del combo:</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-900">
              {activeCurrency === 'USD' ? `Ref. $${discountedTotalUsd.toFixed(2)}` : `Bs. ${discountedTotalBs}`}
            </span>
            <span className="text-xs text-gray-600 line-through">
              ${originalTotalUsd.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            Ahorras ${savingsUsd.toFixed(2)} (Bs. {savingsBs})
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddBundle}
          disabled={bundleAdded}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-sm ${
            bundleAdded 
              ? 'bg-emerald-600 text-white' 
              : 'bg-purple-700 hover:bg-purple-800 active:scale-95 text-white'
          }`}
          aria-label="Agregar combo al carrito"
        >
          {bundleAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>¡Combo agregado!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar combo al carrito ({allBundleProducts.length} productos)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
