/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API real de pádel (opcional). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
