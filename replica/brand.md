# Auditoría de Marca y Microcopy: TuZonaMarket Replica

**Aplicación Objetivo:** TuZonaMarket (`https://tuzonamarket.com`)  
**Especialidad:** Retail Supermercado Online / Delivery Venezuela  

---

## 1. Identidad Visual de Marca

- **Color Primario (Verde TZM):** `#1F9741` — Representa frescura, confiabilidad y el color distintivo de TuZonaMarket en su PWA y aplicación móvil.
- **Color Secundario / Acento (Verde Lima):** `#78BD2E` — Utilizado para hojitas del isotipo, hovers de títulos de carruseles y acentos promocionales.
- **Color de Acción / Ofertas (Rojo Descuento):** `#E00000` — Empleado en badges de porcentaje de descuento (`.descu-porc`) y precios tachados de oferta.
- **Color Corporativo / Links (Azul Prime):** `#0A50A0` — Empleado en estados de hover de enlaces y membrecía Prime.
- **Neutro de Superficie:** `#FAFAFA` — Fondo de la aplicación. Blanco `#FFFFFF` en tarjetas.
- **Tipografía:** Familia `Rubik` (`RubikRegular`, `RubikSemiBold`, `RubikBold`), con fallback a sistema `sans-serif`.

---

## 2. Auditoría de Microcopy Venezolano

| Elemento UI | Microcopy Canónico | Contexto de Uso |
|---|---|---|
| **Precios Principales** | `Ref. $X.XX` | Precio de referencia en dólares estadounidenses |
| **Precios Secundarios** | `Bs. X,XX` | Precio calculado a tasa de cambio vigente |
| **Badges de Descuento** | `-12%`, `-20%`, `Oferta` | Etiqueta superior izquierda en tarjeta de producto |
| **Badge de Carrito en Tarjeta** | `+1`, `+2` (`.cant-comp`) | Conteo de unidades añadidas actualmente |
| **Botón de Adición Individual** | `Añadir` / `+` / `-` | CTA de compra en tarjeta y detalle |
| **Botón de Combo Frecuente** | `Agregar combo al carrito` | Slot 2 (PDP), inyecta los 3 ítems con descuento |
| **Drawer de Carrito** | `Tu Carrito`, `Completa tu pedido` | Encabezado del drawer y Slot 3 de complementos |
| **Botón de Checkout** | `Finalizar pedido` / `Procesar pedido` | CTA primario en `#cart-final` |
| **Estado Vacío Carrito** | `Tu carrito está vacío` | `#cart-conte div.carrito-vacio` |
| **Selector de Sucursal** | `Valencia Norte`, `Naguanagua`, `San Diego`, `Barquisimeto` | Dropdown de cobertura operativa |
| **Buscador** | `Buscar en TuZonaMarket...` | Placeholder del buscador central |

---

## 3. Configuración de Activos Vectoriales

Los activos vectoriales han sido generados en `public/assets/brand/`:
- `logo.svg`: Logotipo horizontal completo con isotipo y wordmark.
- `logo-white.svg`: Versión blanca para footer y fondos de alto contraste.
- `isotype.svg`: Isotipo cuadrado (Pin + Carrito) con bordes redondeados.
- `icon-cart.svg`, `icon-user.svg`, `icon-search.svg`, `icon-category.svg`.
- Iconos de categorías: `viveres.svg`, `lacteos.svg`, `carniceria.svg`, `bebidas.svg`, `snacks.svg`, `limpieza.svg`.
