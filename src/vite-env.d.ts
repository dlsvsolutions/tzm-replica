/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ODOO_TARGET?: string;
  readonly VITE_ODOO_API_URL?: string;
  readonly VITE_ODOO_DB?: string;
  readonly VITE_ODOO_API_KEY?: string;
  readonly VITE_RECOMMENDATION_TARGET?: string;
  readonly VITE_RECOMMENDATION_API_URL?: string;
  readonly VITE_EXCHANGE_RATE_VES?: string;
  readonly VITE_DEFAULT_BRANCH_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
