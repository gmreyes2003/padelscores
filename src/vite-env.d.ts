/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del proyecto de Supabase. */
  readonly VITE_SUPABASE_URL?: string
  /** Clave pública anónima de Supabase (solo lectura vía RLS). */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
