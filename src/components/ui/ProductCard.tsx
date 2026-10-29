import React from 'react';
import { Product } from '../../types/product';
import { RecommendationMetadata } from '../../types/recommendations';
import { useCartStore } from '../../store/cartStore';
import { useDemoStore } from '../../store/demoStore';
import { Plus, Minus, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  metadata?: RecommendationMetadata;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, metadata }) => {
  const { addItem, updateQuantity, getItemCount } = useCartStore();
  const { exchangeRate, activeCurrency, explainabilityMode, openPDP } = useDemoStore();

  const count = getItemCount(product.id);

  // Compute dual prices
  const priceUsd = product.price;
  const priceBs = (product.price * exchangeRate).toFixed(2);
  const originalPriceUsd = product.original_price;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering PDP when clicking on the stepper buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    openPDP(product);
  };

  const getAlgorithmBadge = (meta: RecommendationMetadata) => {
    const scorePct = Math.round(meta.confidence_score * 100);
    switch (meta.algorithm) {
      case 'vector_similarity':
        return { label: `pgvector: ${meta.confidence_score}`, color: 'bg-emerald-600 text-white' };
      case 'collaborative_filtering':
        return { label: `CollabFilter: ${scorePct}%`, color: 'bg-blue-600 text-white' };
      case 'co_occurrence':
        return { label: `Co-occurrence: ${scorePct}%`, color: 'bg-purple-600 text-white' };
      case 'cold_start':
        return { label: `ColdStart: Trending`, color: 'bg-amber-600 text-white' };
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-lg border border-gray-200/80 hover:border-gray-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between p-3.5 cursor-pointer h-[380px]"
      data-testid={`product-card-${product.id}`}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10 pointer-events-none">
        {/* Discount Badge */}
        {product.discount_percent ? (
          <span className="bg-[#E00000] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            -{product.discount_percent}%
          </span>
        ) : <div />}

        {/* In-cart count badge */}
        {count > 0 && (
          <span className="bg-[#1F9741] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-fade-in">
            {count} en carrito
          </span>
        )}
      </div>

      {/* Explainability Telemetry Overlay Badge (Demo Mode) */}
      {metadata && explainabilityMode && (
        <div className="absolute top-9 left-2.5 z-20 max-w-[90%] pointer-events-auto">
          <div 
            title={metadata.reason}
            className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded shadow-md border border-white/20 ${getAlgorithmBadge(metadata).color}`}
          >
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            <span>{getAlgorithmBadge(metadata).label}</span>
          </div>
          <p className="text-[10px] text-gray-600 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded mt-1 shadow-sm border border-gray-200 truncate">
            {metadata.reason}
          </p>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative w-full h-40 mt-4 flex items-center justify-center overflow-hidden rounded-md bg-gray-50/50">
        <img 
          src={product.image_url} 
          alt={product.name}
          loading="lazy"
          className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Information */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-0.5 flex items-center justify-between">
            <span>{product.category}</span>
            <span className="text-gray-600 font-normal">{product.unit}</span>
          </div>
          <h3 
            title={product.name}
            className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#0A50A0] transition-colors"
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing and Action Area */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          {/* Dual Currency Price Block */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-900 leading-none">
                {activeCurrency === 'USD' ? `Ref. $${priceUsd.toFixed(2)}` : `Bs. ${priceBs}`}
              </span>
              {originalPriceUsd && (
                <span className="text-[11px] text-gray-600 line-through">
                  ${originalPriceUsd.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-gray-600 mt-0.5">
              {activeCurrency === 'USD' ? `Bs. ${priceBs}` : `Ref. $${priceUsd.toFixed(2)}`}
            </span>
          </div>

          {/* Stepper or Add Button */}
          <div>
            {count === 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(product, 1);
                }}
                className="inline-flex items-center gap-1 bg-[#1F9741] hover:bg-[#17852C] active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-sm"
                aria-label={`Añadir ${product.name} al carrito`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Añadir</span>
              </button>
            ) : (
              <div 
                className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, count - 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-200 active:scale-90 transition-colors shadow-xs"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-gray-800">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, count + 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1F9741] text-white hover:bg-[#17852C] active:scale-90 transition-colors shadow-xs"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
