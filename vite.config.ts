import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage } from 'http';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function resolveOdooDatabase(baseUrl: string, preferredDb?: string): Promise<string> {
  try {
    const res = await fetch(new URL('/web/database/list', baseUrl).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: {}, id: Date.now() }),
    });
    const data = (await res.json()) as { result?: string[] };
    if (Array.isArray(data.result) && data.result.length > 0) {
      if (preferredDb && data.result.includes(preferredDb)) {
        return preferredDb;
      }
      return data.result[0];
    }
  } catch {
    // Si list_db está deshabilitado en odoo.conf, usamos preferredDb
  }
  return preferredDb || 'odoo';
}

function odooProxyPlugin(defaultOdooTarget: string): Plugin {
  return {
    name: 'odoo-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 1. Endpoint de Autenticación Dual (JSON-RPC API Key/Password + Web Session)
        if (req.url === '/api/odoo-proxy/auth' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const rawBody = await readBody(req);
            const {
              targetUrl,
              db: requestedDb,
              login,
              password,
            } = JSON.parse(rawBody || '{}') as {
              targetUrl?: string;
              db?: string;
              login?: string;
              password?: string;
            };

            const baseUrl = (targetUrl || defaultOdooTarget).replace(/\/$/, '');
            const cleanLogin = (login || '').trim();
            const cleanSecret = (password || '').trim();

            if (!cleanLogin || !cleanSecret) {
              res.end(JSON.stringify({ ok: false, error: 'Debes ingresar Usuario/Email y Contraseña o API Key.' }));
              return;
            }

            const db = await resolveOdooDatabase(baseUrl, requestedDb?.trim());

            // PASO A: Intentar autenticación estándar vía /jsonrpc (Soporta API Keys y Contraseñas)
            const rpcRes = await fetch(`${baseUrl}/jsonrpc`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; TZM-Client/1.0)',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                  service: 'common',
                  method: 'authenticate',
                  args: [db, cleanLogin, cleanSecret, {}],
                },
                id: Date.now(),
              }),
            });

            const rpcText = await rpcRes.text();
            let rpcData: {
              result?: number | false;
              error?: { message?: string; data?: { message?: string; name?: string } };
            } = {};

            try {
              rpcData = JSON.parse(rpcText);
            } catch {
              res.end(
                JSON.stringify({
                  ok: false,
                  error: `Odoo devolvió una respuesta no-JSON (HTTP ${rpcRes.status}). Verifica la URL (${baseUrl}) o si hay un firewall/Cloudflare activo.`,
                })
              );
              return;
            }

            if (typeof rpcData.result === 'number' && rpcData.result > 0) {
              // Intentar opcionalmente obtener session_id si es contraseña normal
              let sessionId = '';
              try {
                const webAuthRes = await fetch(`${baseUrl}/web/session/authenticate`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: { db, login: cleanLogin, password: cleanSecret },
                    id: Date.now(),
                  }),
                });
                const setCookie = webAuthRes.headers.get('set-cookie') || '';
                const matches = [...setCookie.matchAll(/session_id=([^;,\s]+)/gi)];
                if (matches.length > 0) {
                  sessionId = matches[matches.length - 1][1];
                }
              } catch {
                // Ignorar si /web/session/authenticate rechaza API Key; usaremos execute_kw con uid
              }

              res.end(
                JSON.stringify({
                  ok: true,
                  uid: rpcData.result,
                  db,
                  sessionId,
                  name: cleanLogin,
                  username: cleanLogin,
                })
              );
              return;
            }

            const odooErr =
              rpcData.error?.data?.message ||
              rpcData.error?.message ||
              `Credenciales rechazadas en DB "${db}" (Verifica el nombre de la BD, usuario o API Key).`;

            res.end(JSON.stringify({ ok: false, error: odooErr, resolvedDb: db }));
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            res.end(JSON.stringify({ ok: false, error: `Error de red conectando a Odoo: ${msg}` }));
          }
          return;
        }

        // 2. Endpoint para consultar productos (Soporta execute_kw con UID+APIKey/Pass O Cookie SessionID)
        if (req.url?.startsWith('/api/odoo-proxy/products') && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const rawBody = await readBody(req);
            const {
              targetUrl,
              db: requestedDb,
              uid: providedUid,
              login,
              apiKey,
              sessionId,
              search,
              category,
              limit = 40,
              offset = 0,
            } = JSON.parse(rawBody || '{}') as {
              targetUrl?: string;
              db?: string;
              uid?: number;
              login?: string;
              apiKey?: string;
              sessionId?: string;
              search?: string;
              category?: string;
              limit?: number;
              offset?: number;
            };

            const baseUrl = (targetUrl || defaultOdooTarget).replace(/\/$/, '');
            const db = await resolveOdooDatabase(baseUrl, requestedDb?.trim());

            const domain: unknown[] = [['sale_ok', '=', true]];
            if (search) {
              domain.push(['name', 'ilike', search]);
            }
            if (category && category !== 'Todos') {
              domain.push(['categ_id.name', 'ilike', category]);
            }

            const baseFields = [
              'id',
              'name',
              'display_name',
              'list_price',
              'default_code',
              'image_128',
              'image_256',
              'categ_id',
              'uom_id',
              'description_sale',
            ];
            const extendedFields = [...baseFields, 'qty_available'];

            // MODO 1: Autenticación por JSON-RPC (API Key o Contraseña)
            let activeUid = providedUid;
            if (!activeUid && login && apiKey) {
              const authCheck = await fetch(`${baseUrl}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'call',
                  params: {
                    service: 'common',
                    method: 'authenticate',
                    args: [db, login.trim(), apiKey.trim(), {}],
                  },
                  id: Date.now(),
                }),
              });
              const authJson = (await authCheck.json()) as { result?: number | false };
              if (typeof authJson.result === 'number' && authJson.result > 0) {
                activeUid = authJson.result;
              }
            }

            if (activeUid && apiKey) {
              const executeSearchRead = async (fieldsToFetch: string[]) => {
                const rpcRes = await fetch(`${baseUrl}/jsonrpc`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                      service: 'object',
                      method: 'execute_kw',
                      args: [
                        db,
                        activeUid,
                        apiKey.trim(),
                        'product.template',
                        'search_read',
                        [domain],
                        { fields: fieldsToFetch, limit, offset },
                      ],
                    },
                    id: Date.now(),
                  }),
                });
                return (await rpcRes.json()) as {
                  result?: unknown[];
                  error?: { message?: string; data?: { message?: string; name?: string } };
                };
              };

              let rpcData = await executeSearchRead(extendedFields);
              // Si falla por permisos sobre qty_available, reintentar con campos base
              if (rpcData.error) {
                rpcData = await executeSearchRead(baseFields);
              }

              if (Array.isArray(rpcData.result)) {
                res.end(
                  JSON.stringify({
                    jsonrpc: '2.0',
                    result: { records: rpcData.result, length: rpcData.result.length, db, uid: activeUid },
                  })
                );
                return;
              }

              res.end(JSON.stringify(rpcData));
              return;
            }

            // MODO 2: Autenticación por Cookie session_id (/web/dataset/call_kw)
            if (sessionId) {
              const callKwRes = await fetch(
                `${baseUrl}/web/dataset/call_kw/product.template/web_search_read`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Cookie: `session_id=${sessionId}`,
                  },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                      model: 'product.template',
                      method: 'web_search_read',
                      args: [],
                      kwargs: {
                        domain,
                        fields: baseFields,
                        limit,
                        offset,
                      },
                    },
                    id: Date.now(),
                  }),
                }
              );

              const text = await callKwRes.text();
              res.end(text);
              return;
            }

            res.end(
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  message: 'Faltan credenciales: Configura Usuario + API Key/Contraseña o un Session ID válido.',
                },
              })
            );
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            res.end(JSON.stringify({ jsonrpc: '2.0', error: { message: msg } }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const odooTarget = env.VITE_ODOO_TARGET || 'https://odoo.tuzonamarket.com';
  const recsTarget = env.VITE_RECOMMENDATION_TARGET || 'http://localhost:8000';

  return {
    plugins: [react(), odooProxyPlugin(odooTarget)],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api/odoo': {
          target: odooTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          rewrite: (path) => path.replace(/^\/api\/odoo/, ''),
        },
        '/api/recs': {
          target: recsTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/recs/, ''),
        },
      },
    },
  };
});
