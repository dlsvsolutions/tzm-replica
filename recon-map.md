# Recon Map: TuZonaMarket (Web & Mobile PWA)

**Target:** `https://tuzonamarket.com`  
**Plataforma:** Web Responsiva (Desktop: 1440px / Mobile: 375px PWA)  
**Propósito de la Réplica:** Banco de pruebas interactivo de alta fidelidad para Demostración del Motor de Recomendaciones Desacoplado (`IRecommendationService`).  
**Fecha:** 2026-10-27  

---

## 1. Fuentes de Inspección

| # | Fuente | URL / Recurso | Hallazgo Clave |
|---|---|---|---|
| 1 | Portal Web Producción | `https://tuzonamarket.com` | PWA Angular 17+ (esbuild), tema `#1F9741`, tipografía Rubik, dualidad cambiaria USD / Bs. |
| 2 | Chunks del Sitio | `chunk-RIHE5M7I.js`, `chunk-AEG75AEI.js`, `chunk-ZD6FEGJ7.js`, `chunk-UWD3MZMU.js` | Servicios: `zonaService`, `categoriaService`, `monedaService`, `atenticacionService`. Rutas: `/website`, `:zona`, `producto/:slug`, `buscar`. |
| 3 | Estilos Computados | `styles-B2JOU2U6.css` | Clases canónicas: `#pie-pagina` (#1F9741), `.descu-porc` (#E00000), `.item-prod .item-bord`, `#panel-cart-conte`, `nav#menu-mini`. |
| 4 | Mobile App Listing | App Store (`id1462432228`), Google Play (`tzm.com.app`) | Cobertura en Carabobo (Valencia, Naguanagua, San Diego) y Lara (Barquisimeto). Envíos express y programados. |

---

## 2. Core Loop

Comprar productos de supermercado de consumo masivo con entrega a domicilio en Venezuela, visualizando precios duales (USD / Bs.), agregando artículos o combos recomendados de alta afinidad con un clic y gestionando el carrito desde un drawer lateral optimizado.

---

## 3. Inventario de Pantallas y Vistas (Screen Inventory)

| ID | Pantalla / Vista | Ruta / Trigger | Propósito | Componentes Clave | Estados Observados |
|---|---|---|---|---|---|
| **S01** | **Home Principal** | `/` o `/:zona` | Punto de entrada, catálogo destacado, promociones y recomendaciones personalizadas | `NavbarNormal`, `BranchSelector`, `CategoryBar`, `PromoBanner`, `RecommendationSlot1` (Carrusel "Recomendados para ti"), `ProductGrid`, `Footer` | Loading (Skeletons), Loaded, Empty, Persona activa |
| **S02** | **Buscador & Auto-complete** | `/buscar` o input en Navbar | Búsqueda por texto con debounce y sugerencias predictivas | `SearchBar`, `SearchDropdownAutoComplete`, `FilterChips`, `ProductCard` | Vacío, Buscando (Spinner/Skeleton), Con resultados, Sin coincidencias |
| **S03** | **Detalle de Producto (PDP / Modal)** | `/producto/:slug` o click en card | Inspección del producto, galería, selección de cantidades y combo inteligente | `ProductDetailModal`, `ImageGallery`, `DualPriceBadge`, `QuantityStepper`, `RecommendationSlot2` ("Frecuentemente comprados juntos"), `AddBundleButton` | Default, Combo seleccionado, Stock agotado |
| **S04** | **Drawer del Carrito (Cart Slide-over)** | Click en icono carrito (`#panel-cart-conte`) | Resumen de compra, edición de ítems, cálculo dinámico y complementos | `CartDrawer`, `CartItemList`, `QuantitySelector`, `RecommendationSlot3` ("Completa tu pedido"), `SubtotalSummary`, `CheckoutButton` | Carrito vacío (`.carrito-vacio`), Carrito con ítems, Modificación de cantidad, Carrito vaciado |
| **S05** | **Barra Inferior Móvil (Mobile TabBar)** | Viewport < 768px (`nav#menu-mini`) | Navegación táctil ergonómica con acceso rápido a inicio, categorías, búsqueda, pedidos y carrito | `MobileTabBar`, `TabItem`, `BadgeCounter` | Activo por ruta, Badge de conteo reactivo |
| **S06** | **Panel de Telemetría & Debugger** | Widget flotante inferior izquierdo | Herramienta de demo para alternar perfiles en vivo, inspeccionar metadatos algorítmicos y simular latencia | `RecommendationDebugger`, `PersonaSelector`, `ExplainabilityToggle`, `LatencySlider`, `MetricsPanel` | Colapsado, Expandido, Modo explicabilidad ON/OFF |

---

## 4. Flujos de Usuario (User Flows)

### F01: Compra Guiada por Recomendación Personalizada (Home)
- **Ruta:** `S01 (Home)` ➔ Inspección de Slot 1 ("Recomendados para ti") ➔ Clic en "Añadir" en `ProductCard` ➔ Actualización atómica de badge de carrito ➔ Apertura de `S04 (Cart Slide-over)` ➔ Clic en "Finalizar pedido".
- **Clicks en Happy Path:** 3 clics.
- **Edge cases:** Usuario sin historial (dispara `cold_start`), cambio en vivo de persona en telemetría (re-renderiza el carrusel con animación suave sin perder estado del carrito).

### F02: Exploración de Producto y Adición de Combo Frecuente (PDP Modal)
- **Ruta:** `S01 (Home)` ➔ Clic en tarjeta de producto (ej. "Harina PAN Blanca 1kg") ➔ Apertura modal `S03 (PDP)` ➔ Renderizado de Slot 2 ("Frecuentemente comprados juntos" con Queso Blanco y Mantequilla) ➔ Clic en "Agregar combo al carrito (-10% combo)" ➔ Inyección atómica de los 3 productos en el carrito.
- **Clicks en Happy Path:** 2 clics.
- **Edge cases:** Uno de los productos del combo sin stock disponible (deshabilita el botón de combo y muestra aviso amigable).

### F03: Optimización del Ticket Promedio en Carrito (Cross-Selling Cart Slide-over)
- **Ruta:** Apertura de `S04 (Cart Slide-over)` con productos básicos ➔ Inspección de Slot 3 ("Completa tu pedido") con complementos de baja fricción ➔ Clic rápido en `+` del producto recomendado ➔ Recálculo instantáneo del subtotal en USD y Bs. ➔ Transición suave sin scroll jump.
- **Clicks en Happy Path:** 2 clics.
- **Edge cases:** Carrito vacío (el slot de complementos muestra productos de impulso de bajo ticket).

---

## 5. Breakpoints Clave de Diseño y Responsive

- **Desktop (1440px / min 1024px):**
  - Barra superior completa (`nav#menu-normal`): Logo + Selector de Sucursal + Buscador central expansivo (max-w-2xl) + Selector de Moneda ($ / Bs.) + Mi Cuenta + Botón de Carrito con badge.
  - Category bar horizontal fija bajo navbar con scroll táctil/flechas.
  - Grid de productos: 4 a 5 columnas.
  - Cart Slide-over: Drawer de 420px de ancho anclado a la derecha con overlay oscuro.
- **Mobile (375px - 768px):**
  - Topbar compacta con logo, selector de sucursal rápido y botón de búsqueda modal.
  - TabBar fija en la base de la pantalla (`nav#menu-mini`): 5 ítems táctiles (Inicio, Categorías, Buscar, Cuenta, Carrito con badge).
  - Grid de productos: 2 columnas con tipografía y botones adaptados al toque digital.
  - Cart Slide-over: 100% de ancho de pantalla (drawer completo).

---

## 6. Puntos Estratégicos de Inyección de Recomendaciones

1. **Slot 1 (Home Feed):**
   - **Ubicación:** Inmediatamente debajo del Hero Banner principal y la barra de categorías.
   - **Algoritmo Predeterminado:** `vector_similarity` / `collaborative_filtering` (o `cold_start` para perfiles nuevos).
   - **Formato Visual:** Carrusel horizontal responsivo con encabezado `.carrusel-titulo` ("Recomendados para ti"), badges de confianza y razón explicable ("Porque compraste víveres frecuentemente").
2. **Slot 2 (PDP / Modal de Producto):**
   - **Ubicación:** Dentro del modal de detalle de producto, debajo de la descripción técnica.
   - **Algoritmo Predeterminado:** `co_occurrence` (Reglas de asociación FBT - Frequently Bought Together).
   - **Formato Visual:** Bloque interactivo de combo con conectores `+`, precio total con descuento bundle y CTA "Agregar combo completo".
3. **Slot 3 (Cart Slide-Over Drawer):**
   - **Ubicación:** En la sección media-inferior del drawer del carrito, antes del bloque `#cart-final` de totales.
   - **Algoritmo Predeterminado:** `vector_similarity` / `co_occurrence` basado en el vector agregado de los ítems en el carrito.
   - **Formato Visual:** Lista vertical compacta o mini-carrusel "Completa tu pedido" con botón de adición inmediata en un toque.

---

## 7. Modelo de Datos Inferido y Entidades

- **Product:** `id`, `sku`, `name`, `category`, `price_usd`, `price_bs`, `original_price_usd`, `image_url`, `stock`, `unit`, `discount_percent`, `tags`.
- **Branch / Sucursal:** `id`, `name`, `slug`, `city`, `state`, `is_active`.
- **CartItem:** `productId`, `quantity`, `unitPriceUsd`, `unitPriceBs`, `subtotalUsd`, `subtotalBs`.
- **Recommendation:** `productId`, `sku`, `name`, `category`, `price`, `currency`, `image_url`, `stock`, `metadata: { algorithm, confidence_score, reason, source_vector_distance }`.
- **Persona:** `id`, `name`, `role`, `description`, `preferred_categories`, `avg_ticket_usd`.
