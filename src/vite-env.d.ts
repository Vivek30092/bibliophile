/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_SITE_NAME?: string;
  readonly VITE_LOCATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

