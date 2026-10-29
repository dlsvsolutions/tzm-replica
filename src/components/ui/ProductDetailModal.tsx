import React, { useEffect } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { useCartStore } from '../../store/cartStore';
import { SlotPDPBundle } from '../recommendations/SlotPDPBundle';
import { X, Plus, Minus, ShoppingBag, Truck, Check } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForPDP, closePDP, exchangeRate, activeCurrency } = useDemoStore();
  const { addItem } = useCartStore();
  const [added, setAdded] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePDP();
    };
    if (selectedProductForPDP) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProductForPDP, closePDP]);

  if (!selectedProductForPDP) return null;

  const product = selectedProductForPDP;
  const priceBs = (product.price * exchangeRate).toFixed(2);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto font-rubik"
      aria-labelledby="pdp-modal-title"
      role="dialog"
      aria-modal="true"
      data-testid="pdp-modal"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closePDP}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border border-gray-100 my-8">
          {/* Close button */}
          <button
            type="button"
            onClick={closePDP}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Main Product Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Product Image */}
              <div className="relative bg-gray-50 rounded-2xl p-6 flex items-center justify-center border border-gray-100">
                {product.discount_percent && (
                  <span className="absolute top-3 left-3 bg-[#E00000] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                    -{product.discount_percent}% OFF
                  </span>
                )}
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="max-h-56 max-w-full object-contain"
                />
              </div>

              {/* Details & Actions */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>{product.brand || 'TuZonaMarket'}</span>
                  </div>
                  <h2 id="pdp-modal-title" className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {product.name}
                  </h2>
                  <p className="text-xs text-gray-700 mt-2 line-clamp-3 leading-relaxed">
                    {product.description || 'Producto fresco de alta calidad seleccionado bajo rigurosos estándares de despacho.'}
                  </p>
                </div>

                {/* Price block */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-gray-900">
                      {activeCurrency === 'USD' ? `Ref. $${product.price.toFixed(2)}` : `Bs. ${priceBs}`}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-gray-600 line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 block mt-0.5">
                    {activeCurrency === 'USD' ? `Bs. ${priceBs}` : `Ref. $${product.price.toFixed(2)}`} (Tasa oficial)
                  </span>

                  {/* Stock & Delivery Badges */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-700">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      Entrega en 45 min
                    </span>
                    <span>•</span>
                    <span>Stock: {product.stock} disp.</span>
                  </div>

                  {/* Quantity Stepper and Add to Cart */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-200 active:scale-95 transition-colors shadow-2xs"
                        aria-label="Restar 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1F9741] text-white hover:bg-[#17852C] active:scale-95 transition-colors shadow-2xs"
                        aria-label="Sumar 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 py-2.5 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                        added
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1F9741] hover:bg-[#17852C] active:scale-98 text-white'
                      }`}
                      data-testid="pdp-add-button"
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>¡Agregado al carrito!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Añadir {quantity} al carrito</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Injected Slot 2: Frequently Bought Together Bundle */}
            <SlotPDPBundle currentProduct={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
