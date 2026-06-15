import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase.
 *
 * Las credenciales se leen de variables de entorno (archivo `.env`):
 *   VITE_SUPABASE_URL       — URL del proyecto
 *   VITE_SUPABASE_ANON_KEY  — clave pública anónima (solo lectura vía RLS)
 *
 * Si no están definidas, `supabase` es `null` y la capa de datos usa los
 * JSON mock como respaldo. Así la app funciona en local sin configurar nada.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null
