import React from 'react';
import { Sparkles, Clock, ShieldCheck, CreditCard } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17852C] via-[#1F9741] to-[#78BD2E] text-white p-6 sm:p-10 my-6 shadow-md font-rubik">
      {/* Decorative background shapes */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-32 top-0 w-44 h-44 rounded-full bg-lime-300/20 blur-xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-lime-200 mb-3 border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-lime-300" />
          <span>¡Nuevo Motor de Recomendaciones con IA Vectorial!</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Tu mercado completo a la puerta de tu casa
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-green-50 max-w-xl leading-relaxed">
          Víveres de consumo masivo, carnes frescas seleccionadas el mismo día y tus marcas venezolanas favoritas con entrega express en Valencia, Naguanagua, San Diego y Barquisimeto.
        </p>

        {/* Feature Pills */}
        <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
            <Clock className="w-3.5 h-3.5 text-lime-300" />
            <span>Envíos en 45 min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
            <CreditCard className="w-3.5 h-3.5 text-lime-300" />
            <span>Pago Móvil, Zelle, Tarjetas</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-300" />
            <span>Precios Oficiales BCV</span>
          </div>
        </div>
      </div>
    </div>
  );
};
