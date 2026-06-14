import { createContext, useContext } from 'react'

/**
 * Vista activa de la aplicación.
 * - 'home': pantalla principal con todas las secciones.
 * - 'match'/'player': vista de detalle de la entidad indicada por `id`.
 */
export type View =
  | { kind: 'home' }
  | { kind: 'match'; id: string }
  | { kind: 'player'; id: string }

interface NavigationApi {
  /** Abre el detalle de un partido. */
  openMatch: (id: string) => void
  /** Abre el detalle de un jugador. */
  openPlayer: (id: string) => void
  /** Vuelve a la pantalla principal. */
  goHome: () => void
}

/**
 * Contexto de navegación. Evita pasar callbacks por toda la jerarquía:
 * cualquier fila puede abrir un detalle con `useNavigation()`.
 */
export const NavigationContext = createContext<NavigationApi | null>(null)

export function useNavigation(): NavigationApi {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation debe usarse dentro de <NavigationContext.Provider>')
  }
  return ctx
}
