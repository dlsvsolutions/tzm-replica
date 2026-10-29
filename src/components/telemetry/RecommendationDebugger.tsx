import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { useServerConfigStore } from '../../store/serverConfigStore';
import { defaultOdooService } from '../../services/odooService';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  EyeOff,
  Server,
  Database,
  RefreshCw,
  Radio,
  Sliders,
  ShieldCheck,
  KeyRound,
  LogIn
} from 'lucide-react';

export const RecommendationDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'servers' | 'tuning'>('servers');
  const [useProxy, setUseProxy] = useState<boolean>(true);

  // Auth form states
  const [loginUser, setLoginUser] = useState<string>('');
  const [loginPass, setLoginPass] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const {
    explainabilityMode,
    toggleExplainability,
  } = useDemoStore();

  const {
    odooUrl,
    odooDb,
    odooSessionId,
    odooHealth,
    setOdooConfig,
    setOdooSessionId,
    authenticateOdoo,
    checkOdooHealth,
    recommendationUrl,
    recommendationHealth,
    setRecommendationUrl,
    checkRecommendationHealth,
  } = useServerConfigStore();

  const [inputOdooUrl, setInputOdooUrl] = useState(odooUrl || 'https://odoo.tuzonamarket.com');
  const [inputOdooDb, setInputOdooDb] = useState(odooDb || 'odoo');
  const [inputSessionId, setInputSessionId] = useState(odooSessionId || '');
  const [inputRecUrl, setInputRecUrl] = useState(recommendationUrl || '');

  const handleToggleProxy = () => {
    const next = !useProxy;
    setUseProxy(next);
    defaultOdooService.setUseProxy(next);
    checkOdooHealth();
  };

  const handleSaveOdoo = (e: React.FormEvent) => {
    e.preventDefault();
    setOdooConfig(inputOdooUrl, inputOdooDb, defaultOdooService.getApiKey(), inputSessionId);
  };

  const handleSaveSessionId = (e: React.FormEvent) => {
    e.preventDefault();
    setOdooSessionId(inputSessionId);
  };

  const handleLoginOdoo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) return;
    setAuthLoading(true);
    setAuthStatus('Iniciando sesión en Odoo vía JSON-RPC...');
    try {
      // Asegurar que la URL y BD ingresadas en los inputs se apliquen antes del login
      defaultOdooService.setConfig(inputOdooUrl, inputOdooDb, loginPass, '', loginUser);
      const res = await authenticateOdoo(loginUser, loginPass);
      setAuthStatus(res.message);
      if (res.success) {
        setInputSessionId(defaultOdooService.getSessionId());
        setInputOdooDb(defaultOdooService.getDb());
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveRec = (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendationUrl(inputRecUrl);
  };

  const getStatusBadge = (status: 'online' | 'offline' | 'checking' | 'not_configured') => {
    switch (status) {
      case 'online':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Conectado
          </span>
        );
      case 'offline':
        return (
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Desconectado
          </span>
        );
      case 'checking':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            Verificando
          </span>
        );
      case 'not_configured':
        return (
          <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
            No configurado
          </span>
        );
    }
  };

  return (
    <aside
      className="fixed bottom-4 left-4 z-50 font-rubik text-gray-800"
      aria-label="Panel de Servidores Desacoplados"
      data-testid="recommendation-debugger"
    >
      {/* Collapsed Pill Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gray-900/95 hover:bg-black text-white px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-gray-700/60 transition-all hover:scale-105 active:scale-95 group"
          aria-label="Abrir panel de arquitectura de servidores"
        >
          <div className="relative flex items-center justify-center">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-tight">Servidores & Odoo</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
            {odooHealth.status === 'online' ? 'Odoo OK' : 'Configurar'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      ) : (
        /* Expanded Drawer Card */
        <div className="w-[380px] sm:w-[460px] bg-white/98 backdrop-blur-xl border border-gray-200/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Panel de Servidores Desacoplados
                </h3>
                <p className="text-xs font-extrabold text-white">
                  Frontend • Odoo ERP • Motor IA
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors"
              aria-label="Cerrar panel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/80 px-2 pt-2 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('servers')}
              className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'servers'
                  ? 'border-[#1F9741] text-[#1F9741]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Conexión Servidores</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tuning')}
              className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'tuning'
                  ? 'border-[#1F9741] text-[#1F9741]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Opciones & A11y</span>
            </button>
          </div>

          <div className="p-4 max-h-[75vh] overflow-y-auto space-y-4">
            {/* TAB 1: CONEXIÓN A SERVIDORES DISTRIBUIDOS */}
            {activeTab === 'servers' && (
              <div className="space-y-4">
                {/* Anti-CORS Proxy Notification */}
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-950 block">Proxy Vite Anti-CORS</span>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        El proxy local Node.js reenvía peticiones a Odoo eliminando el bloqueo CORS del navegador.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleProxy}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors flex-shrink-0 ${
                      useProxy
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {useProxy ? 'Proxy ACTIVO' : 'Directo (CORS)'}
                  </button>
                </div>

                {/* 1. Odoo Server Configuration */}
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-700" />
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Servidor Odoo ERP (product.template)</span>
                        <span className="text-[10px] text-gray-500">
                          {useProxy ? 'Enrutado por /api/odoo' : 'Directo a servidor remoto'}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(odooHealth.status)}
                  </div>

                  <form onSubmit={handleSaveOdoo} className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600 block mb-0.5">
                        URL Servidor Odoo:
                      </label>
                      <input
                        type="url"
                        value={inputOdooUrl}
                        onChange={(e) => setInputOdooUrl(e.target.value)}
                        placeholder="https://odoo.tuzonamarket.com"
                        className="w-full text-xs p-2 bg-white rounded-lg border border-gray-200 focus:border-purple-600 outline-hidden font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-semibold text-gray-600 block mb-0.5">
                          Base de Datos (DB):
                        </label>
                        <input
                          type="text"
                          value={inputOdooDb}
                          onChange={(e) => setInputOdooDb(e.target.value)}
                          placeholder="odoo"
                          className="w-full text-xs p-1.5 bg-white rounded-lg border border-gray-200 focus:border-purple-600 outline-hidden font-mono"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Autenticación en Odoo: Opción A - Session ID */}
                  <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Opción A: Pegar Session ID de Odoo</span>
                    </div>
                    <p className="text-[10px] text-gray-600">
                      En tu pestaña de Odoo abierta, abre DevTools (F12) → Application → Cookies → copia el valor de <code>session_id</code>:
                    </p>
                    <form onSubmit={handleSaveSessionId} className="flex gap-1.5">
                      <input
                        type="text"
                        value={inputSessionId}
                        onChange={(e) => setInputSessionId(e.target.value)}
                        placeholder="ej: c156215f9f5f955a35e725..."
                        className="flex-1 text-xs p-1.5 bg-gray-50 rounded-lg border border-gray-200 font-mono text-[11px]"
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Vincular
                      </button>
                    </form>
                  </div>

                  {/* Autenticación en Odoo: Opción B - Login/Contraseña */}
                  <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Opción B: Login con Usuario y Contraseña</span>
                    </div>
                    <form onSubmit={handleLoginOdoo} className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={loginUser}
                          onChange={(e) => setLoginUser(e.target.value)}
                          placeholder="Usuario / Email"
                          className="text-xs p-1.5 bg-gray-50 rounded-lg border border-gray-200 font-mono text-[11px]"
                        />
                        <input
                          type="password"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="Contraseña / API Key"
                          className="text-xs p-1.5 bg-gray-50 rounded-lg border border-gray-200 font-mono text-[11px]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        {authLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <LogIn className="w-3 h-3" />}
                        <span>Iniciar Sesión en Odoo</span>
                      </button>
                    </form>
                    {authStatus && (
                      <p className="text-[10px] font-mono text-purple-900 bg-purple-50 p-1.5 rounded">
                        {authStatus}
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-600 pt-1 border-t border-purple-100 flex items-center justify-between">
                    <span className="truncate pr-2">{odooHealth.message}</span>
                    <button
                      type="button"
                      onClick={() => checkOdooHealth()}
                      className="text-purple-700 font-bold hover:underline flex-shrink-0"
                    >
                      Probar Conexión
                    </button>
                  </div>
                </div>

                {/* 2. External Recommendation Engine Configuration */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-700" />
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Motor de Recomendaciones Remoto</span>
                        <span className="text-[10px] text-gray-500">Microservicio FastAPI / pgvector</span>
                      </div>
                    </div>
                    {getStatusBadge(recommendationHealth.status)}
                  </div>

                  <p className="text-[11px] text-gray-600">
                    Si no está conectado o configurado, las secciones de recomendación permanecen completamente en blanco.
                  </p>

                  <form onSubmit={handleSaveRec} className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600 block mb-0.5">
                        URL API del Motor:
                      </label>
                      <input
                        type="text"
                        value={inputRecUrl}
                        onChange={(e) => setInputRecUrl(e.target.value)}
                        placeholder="ej: http://localhost:8000 o /api/recs"
                        className="w-full text-xs p-2 bg-white rounded-lg border border-gray-200 focus:border-blue-600 outline-hidden font-mono"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Actualizar</span>
                      </button>
                    </div>
                  </form>

                  <div className="text-[11px] text-gray-600 pt-1 border-t border-blue-100 flex items-center justify-between">
                    <span className="truncate pr-2">{recommendationHealth.message}</span>
                    <button
                      type="button"
                      onClick={() => checkRecommendationHealth()}
                      className="text-blue-700 font-bold hover:underline flex-shrink-0"
                    >
                      Probar Ping
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AJUSTES & EXPLICABILIDAD */}
            {activeTab === 'tuning' && (
              <div className="space-y-4">
                {/* Explainability Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/70">
                  <div className="flex items-center gap-2.5">
                    {explainabilityMode ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">
                        Modo Explicabilidad
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Badges de algoritmo y score de afinidad en recomendaciones
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleExplainability}
                    role="switch"
                    aria-checked={explainabilityMode}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      explainabilityMode ? 'bg-[#1F9741]' : 'bg-gray-300'
                    }`}
                    data-testid="explainability-toggle"
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        explainabilityMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
