# Recon Map: TuZonaMarket (Web & Mobile PWA)

**Target:** `https://tuzonamarket.com`  
**Plataforma:** Web Responsiva (Desktop: 1440px / Mobile: 375px PWA)  
**Propósito de la Réplica:** Banco de pruebas interactivo de alta fidelidad para Demostración del Motor de Recomendaciones Desacoplado (`IRecommendationService`).  
**Fecha:** 2026-10-27  

## 1. Fuentes de Inspección

| # | Fuente | URL / Recurso | Hallazgo Clave |
|---|---|---|---|
| 1 | Portal Web Producción | `https://tuzonamarket.com` | PWA Angular 17+ (esbuild), tema `#1F9741`, tipografía Rubik, dualidad cambiaria USD / Bs. |
| 2 | Chunks del Sitio | `chunk-RIHE5M7I.js`, `chunk-AEG75AEI.js`, `chunk-ZD6FEGJ7.js`, `chunk-UWD3MZMU.js` | Servicios: `zonaService`, `categoriaService`, `monedaService`, `atenticacionService`. Rutas: `/website`, `:zona`, `producto/:slug`, `buscar`. |
| 3 | Estilos Computados | `styles-B2JOU2U6.css` | Clases canónicas: `#pie-pagina` (#1F9741), `.descu-porc` (#E00000), `.item-prod .item-bord`, `#panel-cart-conte`, `nav#menu-mini`. |
| 4 | Mobile App Listing | App Store (`id1462432228`), Google Play (`tzm.com.app`) | Cobertura en Carabobo (Valencia, Naguanagua, San Diego) y Lara (Barquisimeto). Envíos express y programados. |

## 2. Core Loop

Comprar productos de supermercado de consumo masivo con entrega a domicilio en Venezuela, visualizando precios duales (USD / Bs.), agregando artículos o combos recomendados de alta afinidad con un clic y gestionando el carrito desde un drawer lateral optimizado.

## 3. Inventario de Pantallas y Vistas (Screen Inventory)

| ID | Pantalla / Vista | Ruta / Trigger | Propósito | Componentes Clave | Estados Observados |
|---|---|---|---|---|---|
| **S01** | **Home Principal** | `/` o `/:zona` | Punto de entrada, catálogo destacado, promociones y recomendaciones personalizadas | `NavbarNormal`, `BranchSelector`, `CategoryBar`, `PromoBanner`, `RecommendationSlot1` (Carrusel "Recomendados para ti"), `ProductGrid`, `Footer` | Loading (Skeletons), Loaded, Empty, Persona activa |
| **S02** | **Buscador & Auto-complete** | `/buscar` o input en Navbar | Búsqueda por texto con debounce y sugerencias predictivas | `SearchBar`, `SearchDropdownAutoComplete`, `FilterChips`, `ProductCard` | Vacío, Buscando (Spinner/Skeleton), Con resultados, Sin coincidencias |
| **S03** | **Detalle de Producto (PDP / Modal)** | `/producto/:slug` o click en card | Inspección del producto, galería, selección de cantidades y combo inteligente | `ProductDetailModal`, `ImageGallery`, `DualPriceBadge`, `QuantityStepper`, `RecommendationSlot2` ("Frecuentemente comprados juntos"), `AddBundleButton` | Default, Combo seleccionado, Stock agotado |
| **S04** | **Drawer del Carrito (Cart Slide-over)** | Click en icono carrito (`#panel-cart-conte`) | Resumen de compra, edición de ítems, cálculo dinámico y complementos | `CartDrawer`, `CartItemList`, `QuantitySelector`, `RecommendationSlot3` ("Completa tu pedido"), `SubtotalSummary`, `CheckoutButton` | Carrito vacío (`.carrito-vacio`), Carrito con ítems, Modificación de cantidad, Carrito vaciado |
| **S05** | **Barra Inferior Móvil (Mobile TabBar)** | Viewport < 768px (`nav#menu-mini`) | Navegación táctil ergonómica con acceso rápido a inicio, categorías, búsqueda, pedidos y carrito | `MobileTabBar`, `TabItem`, `BadgeCounter` | Activo por ruta, Badge de conteo reactivo |
| **S06** | **Panel de Telemetría & Debugger** | Widget flotante inferior izquierdo | Herramienta de demo para alternar perfiles en vivo, inspeccionar metadatos algorítmicos y simular latencia | `RecommendationDebugger`, `PersonaSelector`, `ExplainabilityToggle`, `LatencySlider`, `MetricsPanel` | Colapsado, Expandido, Modo explicabilidad ON/OFF |

## 4. Flujos de Usuario (User Flows)

- **F01 Compra Guiada por Recomendación Personalizada (Home):** S01 (Home) -> Slot 1 -> Añadir al carrito -> S04 (Drawer Carrito) -> Finalizar pedido.
- **F02 Exploración y Combo Frecuente (PDP Modal):** S01 (Home) -> Click Producto -> S03 (Modal PDP) -> Slot 2 (Combo Frecuente) -> Agregar combo al carrito.
- **F03 Cross-Selling en Drawer de Carrito:** S04 (Drawer Carrito) -> Slot 3 ("Completa tu pedido") -> Click + -> Subtotal recalculado.

## 5. Puntos Estratégicos de Inyección de Recomendaciones
- **Slot 1 (Home Feed):** Carrusel horizontal "Recomendados para ti" con algoritmo configurable (`vector_similarity`, `collaborative_filtering`, `cold_start`).
- **Slot 2 (PDP / Modal):** Sección "Frecuentemente comprados juntos" con algoritmo `co_occurrence` y bundle discount.
- **Slot 3 (Cart Slide-Over):** Carrusel vertical "Completa tu pedido" con algoritmo `vector_similarity` / `co_occurrence`.
