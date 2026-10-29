import React from 'react';
import { Phone, Mail, MapPin, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="pie-pagina" className="bg-[#1F9741] text-white pt-12 pb-24 md:pb-12 mt-16 font-rubik border-t border-[#17852C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/20">
          {/* Brand Info */}
          <div className="space-y-3">
            <img 
              src="/assets/brand/logo-white.svg" 
              alt="TuZonaMarket" 
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-white/90 leading-relaxed">
              El supermercado online líder en Venezuela. Llevamos tus compras con frescura, puntualidad y la mayor variedad de productos nacionales e importados.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
              Categorías Principales
            </h3>
            <ul className="space-y-2 text-xs text-white/90">
              <li><a href="#" className="hover:text-lime-200 transition-colors">Víveres y Despensa</a></li>
              <li><a href="#" className="hover:text-lime-200 transition-colors">Harinas y Granos</a></li>
              <li><a href="#" className="hover:text-lime-200 transition-colors">Lácteos y Quesos Criollos</a></li>
              <li><a href="#" className="hover:text-lime-200 transition-colors">Carnicería y Pollo Fresco</a></li>
              <li><a href="#" className="hover:text-lime-200 transition-colors">Snacks, Bebidas y Licores</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
              Atención al Cliente
            </h3>
            <ul className="space-y-2 text-xs text-white/90">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-lime-300" />
                <span>+58 (241) 800-TZM1</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-lime-300" />
                <span>soporte@tuzonamarket.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-lime-300" />
                <span>Valencia • Naguanagua • San Diego • Barquisimeto</span>
              </li>
            </ul>
          </div>

          {/* Mobile Apps */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
              Descarga Tu App
            </h3>
            <p className="text-xs text-white/90 mb-3">
              Disponible para compras rápidas desde cualquier lugar:
            </p>
            <div className="flex flex-col gap-2">
              <a 
                href="https://apps.apple.com/us/app/tu-zona-market/id1462432228?l=es" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/20 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-lime-300" />
                <span>App Store (iOS)</span>
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=tzm.com.app" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/20 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-lime-300" />
                <span>Google Play (Android)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/80 gap-3">
          <p>© 2026 TuZonaMarket C.A. Todos los derechos reservados.</p>
          <p className="font-mono text-[11px] text-lime-200">
            Réplica de Alta Fidelidad para Demostración del Motor de Recomendaciones (DIP)
          </p>
        </div>
      </div>
    </footer>
  );
};
