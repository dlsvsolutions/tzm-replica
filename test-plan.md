# Plan de Pruebas E2E: TuZonaMarket Replica & Recommendation Engine

**Objetivo:** Validar rigurosamente los flujos de usuario, la reactividad del estado desacoplado, los 3 slots de recomendación, la adición de combos y la estabilidad visual.

---

## 1. Matriz de Casos de Prueba

| ID Caso | Flujo Asociado | Descripción del Escenario | Tipo de Prueba | Criterio de Éxito |
|---|---|---|---|---|
| **REC-01** | F01 (Home Feed) | Renderizado inicial de Slot 1 ("Recomendados para ti") con persona predeterminada (`persona_groceries`) | Automatizada Playwright | Muestra productos de despensa (Harina PAN, Arroz, Café) con badges de afinidad |
| **REC-02** | Telemetría / DIP | Cambio en vivo de perfil a `persona_snacks` en `<RecommendationDebugger />` | Automatizada Playwright | Slot 1 se re-renderiza mostrando botanas y bebidas frías (Doritos, Pirulin, Susy) sin recargar página |
| **REC-03** | Telemetría / DIP | Cambio en vivo de perfil a `persona_coldstart` (Usuario Nuevo) | Automatizada Playwright | Slot 1 muestra productos en tendencia con algoritmo `cold_start` y scores de popularidad |
| **REC-04** | F02 (PDP Modal) | Apertura de modal de producto y renderizado de Slot 2 ("Frecuentemente comprados juntos") | Automatizada Playwright | Al abrir Harina PAN, se visualiza el combo con Queso Llanero y Mantequilla |
| **REC-05** | F02 (Combo FBT) | Adición atómica del combo completo al carrito de compras | Automatizada Playwright | Se inyectan los 3 ítems del combo al carrito en una sola operación sin re-renders destructivos; se abre el Drawer del carrito |
| **REC-06** | F03 (Cart Drawer) | Inspección de Slot 3 ("Completa tu pedido") dentro del Drawer del Carrito | Automatizada Playwright | Slot 3 muestra complementos de alta afinidad; al hacer clic en "Sumar", el ítem entra al carrito y se recalculan subtotales en USD y Bs. |
| **REC-07** | UI / CLS | Simulación de latencia (Skeleton States) | Automatizada Playwright | Al aplicar retardo en el slider de latencia, se exhiben `ProductSkeleton` con dimensiones idénticas a las tarjetas |
| **REC-08** | Carrito Vacío | Estado de carrito vacío y vaciado de carrito | Automatizada Playwright | Muestra `.carrito-vacio` con botón de explorar catálogo |
| **REC-09** | Dual Currency | Alternancia de moneda y conversión en tiempo real | Automatizada Playwright | Precios duales en USD y Bs. calculados fielmente según la tasa de cambio vigente |
| **REC-10** | Accesibilidad / WCAG | Cumplimiento de contraste de color y etiquetas ARIA | Automatizada Playwright / Contrast | 100% WCAG AA superado en botones de acción y precios |
