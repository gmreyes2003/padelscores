import { useCallback, useEffect, useRef, useState } from 'react'
import type { PadelData } from '../types'
import { fetchAllData } from '../services/padelApi'

interface UsePadelDataOptions {
  /**
   * Intervalo de refresco automático en milisegundos. Si es 0 o no se
   * indica, el polling queda deshabilitado. Útil para mantener los
   * resultados en vivo actualizados sin recargar la página.
   */
  pollIntervalMs?: number
}

interface UsePadelDataState {
  data: PadelData | null
  loading: boolean
  error: string | null
  /** Fecha de la última actualización exitosa (null si aún no hubo). */
  lastUpdated: Date | null
  /** Vuelve a pedir los datos (útil para un botón de refresco o polling). */
  reload: () => void
}

/**
 * Hook que carga todos los datos de la app y expone estado de carga/error.
 * Centraliza el acceso a la capa de servicio para que los componentes
 * sólo se ocupen de renderizar. Opcionalmente refresca en intervalos.
 */
export function usePadelData({ pollIntervalMs = 0 }: UsePadelDataOptions = {}): UsePadelDataState {
  const [data, setData] = useState<PadelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Distingue la primera carga (muestra esqueleto) de los refrescos en
  // segundo plano (silenciosos, sin parpadeo de la UI).
  const initialLoadDone = useRef(false)

  const load = useCallback(async () => {
    if (!initialLoadDone.current) setLoading(true)
    setError(null)
    try {
      const result = await fetchAllData()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos')
    } finally {
      setLoading(false)
      initialLoadDone.current = true
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Polling automático: se reprograma si cambia el intervalo y se limpia
  // al desmontar para no dejar timers colgados.
  useEffect(() => {
    if (!pollIntervalMs) return
    const id = setInterval(load, pollIntervalMs)
    return () => clearInterval(id)
  }, [pollIntervalMs, load])

  return { data, loading, error, lastUpdated, reload: load }
}
