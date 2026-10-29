import React, { useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useDemoStore } from '../../store/demoStore';
import { SlotCartComplements } from '../recommendations/SlotCartComplements';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getSubtotalUsd, 
    getSubtotalBs 
  } = useCartStore();

  const { exchangeRate, activeCurrency } = useDemoStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const totalCount = getTotalItems();
  const subtotalUsd = getSubtotalUsd();
  const subtotalBs = getSubtotalBs(exchangeRate);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden font-rubik"
      aria-labelledby="cart-title"
      role="dialog"
      aria-modal="true"
      data-testid="cart-drawer"
    >
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside 
          id="panel-cart-conte"
          aria-label="Carrito de compras"
          className="w-screen max-w-md bg-white shadow-drawer flex flex-col justify-between transform transition-transform duration-300 ease-in-out"
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1F9741]/10 flex items-center justify-center text-[#1F9741]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 id="cart-title" className="text-base font-bold text-gray-900">
                  Tu Carrito de Compras
                </h2>
                <span className="text-xs text-gray-700">
                  {totalCount} {totalCount === 1 ? 'producto' : 'productos'} añadidos
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div id="cart-conte" className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              /* Empty Cart State */
              <div className="carrito-vacio text-center py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-700 mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-gray-700 max-w-xs mb-5">
                  Agrega productos frescos, víveres o aprovecha las recomendaciones personalizadas para comenzar.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="bg-[#1F9741] hover:bg-[#17852C] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-xs"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              /* Items List */
              <>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Artículos en la orden
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] text-gray-600 hover:text-[#c40000] font-semibold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Vaciar carrito
                  </button>
                </div>

                <ul className="divide-y divide-gray-100 -mx-1" data-testid="cart-items-list">
                  {items.map(({ product, quantity }) => {
                    const itemTotalUsd = (product.price * quantity).toFixed(2);
                    const itemTotalBs = (product.price * quantity * exchangeRate).toFixed(2);

                    return (
                      <li key={product.id} className="py-3 flex items-center justify-between gap-3">
                        {/* Image */}
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-14 h-14 object-contain rounded-lg border border-gray-100 p-1 flex-shrink-0 bg-white"
                        />

                        {/* Title & Unit Price */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate" title={product.name}>
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-gray-600 block">
                            ${product.price.toFixed(2)} c/u
                          </span>
                          <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                            {activeCurrency === 'USD' ? `Ref. $${itemTotalUsd}` : `Bs. ${itemTotalBs}`}
                          </span>
                        </div>

                        {/* Stepper and Delete */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-200 active:scale-90 transition-colors shadow-2xs"
                              aria-label="Restar 1 unidad"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-gray-800">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1F9741] text-white hover:bg-[#17852C] active:scale-90 transition-colors shadow-2xs"
                              aria-label="Sumar 1 unidad"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="text-[#c40000] hover:text-red-800 p-1 transition-colors"
                            aria-label={`Eliminar ${product.name} del carrito`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Injected Slot 3: Complementary recommendations */}
                <SlotCartComplements />
              </>
            )}
          </div>

          {/* Drawer Footer (#cart-final) */}
          {items.length > 0 && (
            <div id="cart-final" className="p-4 sm:p-5 border-t border-gray-200 bg-white shadow-lg z-10">
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between items-center text-xs text-gray-700">
                  <span>Subtotal estimado:</span>
                  <span className="font-semibold text-gray-900">${subtotalUsd.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-700">
                  <span>Tasa oficial de cambio:</span>
                  <span className="font-mono text-gray-700">{exchangeRate.toFixed(2)} Bs/$</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">Total a pagar:</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#1F9741] block leading-none">
                      Ref. ${subtotalUsd.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      Bs. {subtotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery and Security Note */}
              <div className="flex items-center justify-between text-[11px] text-gray-600 mb-3 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200/60">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Entrega programada hoy
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Pago seguro
                </span>
              </div>

              {/* Final CTA */}
              <button
                type="button"
                onClick={() => alert(`¡Pedido simulado con éxito por $${subtotalUsd.toFixed(2)} USD!`)}
                className="w-full bg-[#1F9741] hover:bg-[#17852C] active:scale-98 text-white font-bold text-sm py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                data-testid="checkout-button"
              >
                <span>Finalizar pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
