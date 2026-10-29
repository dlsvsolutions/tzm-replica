import { test, expect } from '@playwright/test';

test.describe('Arquitectura Desacoplada y Estado en Blanco (TuZonaMarket Replica)', () => {
  test('ARQ-01: Sin conexión a Odoo ni al Motor IA, la sección de productos y recomendaciones queda 100% en blanco', async ({ page }) => {
    await page.goto('/');

    // Navbar y Header siempre presentes
    await expect(page.locator('header#menu-normal, nav#menu-normal')).toBeVisible();

    // Sin servidor de recomendaciones: Slot 1 no se renderiza (permanece en blanco)
    const slot1 = page.locator('[data-testid="recommendation-slot-1"]');
    await expect(slot1).not.toBeVisible();

    // Sin servidor Odoo autenticado: sección de catálogo queda en blanco (sin productos de prueba)
    const emptyBlank = page.locator('[data-testid="empty-catalog-blank"]');
    await expect(emptyBlank).toBeVisible();

    // Verificar que no hay tarjetas de producto hardcodeadas
    const cards = page.locator('[data-testid^="product-card-"]');
    expect(await cards.count()).toBe(0);
  });

  test('ARQ-02: Panel de Diagnóstico de Servidores permite configurar Odoo y Motor IA', async ({ page }) => {
    await page.goto('/');

    // Abrir panel flotante
    const debuggerToggle = page.locator('[data-testid="recommendation-debugger"] button').first();
    await debuggerToggle.click();

    const debuggerPanel = page.locator('[data-testid="recommendation-debugger"]');
    await expect(debuggerPanel).toBeVisible();
    await expect(debuggerPanel).toContainText('Panel de Servidores Desacoplados');
    await expect(debuggerPanel).toContainText('Servidor Odoo ERP (product.template)');
    await expect(debuggerPanel).toContainText('Motor de Recomendaciones Remoto');
  });

  test('ARQ-03: Al recibir productos desde Odoo (product.template), la cuadrícula se renderiza reactivamente', async ({ page }) => {
    // Simular que el usuario tiene una sesión activa en localStorage
    await page.addInitScript(() => {
      localStorage.setItem('odoo_session_id', 'valid_test_session_id');
    });

    // Interceptar la llamada al proxy Node de Odoo
    await page.route('**/api/odoo-proxy/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          result: {
            length: 2,
            records: [
              {
                id: 101,
                name: 'Harina PAN Real Odoo 1kg',
                default_code: 'ODOO-HP-101',
                list_price: 1.35,
                qty_available: 50,
                categ_id: [1, 'Víveres'],
                image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
              },
              {
                id: 102,
                name: 'Arroz Primor Real Odoo 1kg',
                default_code: 'ODOO-AP-102',
                list_price: 1.50,
                qty_available: 30,
                categ_id: [1, 'Víveres'],
                image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
              },
            ],
          },
        }),
      });
    });

    await page.goto('/');

    // Catálogo en vivo visible
    const catalog = page.locator('[data-testid="live-odoo-catalog"]');
    await expect(catalog).toBeVisible();
    await expect(catalog).toContainText('Harina PAN Real Odoo 1kg');
    await expect(catalog).toContainText('Arroz Primor Real Odoo 1kg');

    const cards = page.locator('[data-testid^="product-card-"]');
    expect(await cards.count()).toBe(2);
  });
});
