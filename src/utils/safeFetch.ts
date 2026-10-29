/**
 * Safe fetch helper that validates Content-Type and HTTP status
 * to prevent 'Unexpected token <, <!doctype... is not valid JSON' errors.
 */
export async function safeFetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; status: number; error?: string }> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    // If HTTP error (404, 500, etc.)
    if (!response.ok) {
      if (contentType.includes('text/html')) {
        return {
          ok: false,
          status: response.status,
          error: `El servidor respondió con código HTTP ${response.status} (Página HTML no encontrada o sin acceso)`,
        };
      }
      const errText = await response.text();
      return {
        ok: false,
        status: response.status,
        error: `HTTP ${response.status}: ${errText.slice(0, 150)}`,
      };
    }

    // If response is HTML instead of JSON (common when hitting an SPA root or 404 handler)
    if (!contentType.includes('application/json')) {
      const textSample = await response.text();
      if (textSample.trim().startsWith('<')) {
        return {
          ok: false,
          status: response.status,
          error: `El servidor retornó un documento HTML (<!doctype...) en lugar de JSON. Verifica la ruta del endpoint en el servidor.`,
        };
      }
      return {
        ok: false,
        status: response.status,
        error: `Respuesta con tipo de contenido no compatible: ${contentType}`,
      };
    }

    const data: T = await response.json();
    return { ok: true, data, status: response.status };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Specifically detect CORS / Network failures
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
      return {
        ok: false,
        status: 0,
        error: `Bloqueado por política CORS o servidor inaccesible. En desarrollo, utiliza el proxy de Vite (/api/odoo) para evitar restricciones del navegador.`,
      };
    }
    return {
      ok: false,
      status: 0,
      error: errorMsg,
    };
  }
}
