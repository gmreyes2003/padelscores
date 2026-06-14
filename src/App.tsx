import { useMemo } from 'react'
import { Header } from './components/Header'
import { Section } from './components/Section'
import { MatchList } from './components/MatchList'
import { RankingTable } from './components/RankingTable'
import { TournamentList } from './components/TournamentList'
import { usePadelData } from './hooks/usePadelData'
import {
  getRecentResults,
  getTodayMatches,
  getUpcomingMatches,
} from './utils/matchUtils'

/**
 * Fecha de referencia para "hoy".
 *
 * Se fija al día de los datos mock para que la demo siempre muestre
 * contenido. Al conectar una API real, reemplazar por `new Date()`.
 */
const REFERENCE_DATE = new Date('2026-06-14T12:00:00')

/** Cada cuánto se refrescan los datos automáticamente (30 s). */
const POLL_INTERVAL_MS = 30_000

export default function App() {
  const { data, loading, error, lastUpdated, reload } = usePadelData({
    pollIntervalMs: POLL_INTERVAL_MS,
  })

  // Derivamos las distintas vistas de partidos una sola vez por render.
  const { todayMatches, recentResults, upcomingMatches, liveCount } = useMemo(() => {
    if (!data) {
      return {
        todayMatches: [],
        recentResults: [],
        upcomingMatches: [],
        liveCount: 0,
      }
    }
    const today = getTodayMatches(data.matches, REFERENCE_DATE)
    return {
      todayMatches: today,
      recentResults: getRecentResults(data.matches, 20),
      upcomingMatches: getUpcomingMatches(data.matches, REFERENCE_DATE, 12),
      liveCount: data.matches.filter((m) => m.status === 'live').length,
    }
  }, [data])

  return (
    <div className="min-h-screen">
      <Header liveCount={liveCount} date={REFERENCE_DATE} />

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4">
        {/* Estado de error */}
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-live/40 bg-live/10 px-4 py-3 text-sm text-live">
            <span>{error}</span>
            <button
              onClick={reload}
              className="rounded bg-live/20 px-2 py-1 font-semibold hover:bg-live/30"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado de carga */}
        {loading && !data && <LoadingState />}

        {/* Barra de estado: última actualización + refresco manual */}
        {data && (
          <div className="mb-3 flex items-center justify-end gap-2 text-xs text-gray-500">
            {lastUpdated && (
              <span>
                Actualizado{' '}
                {lastUpdated.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            )}
            <button
              onClick={reload}
              className="rounded border border-ink-600 px-2 py-1 font-semibold text-gray-300 hover:bg-ink-700"
            >
              Actualizar
            </button>
          </div>
        )}

        {/* Contenido */}
        {data && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Columna 1: Hoy + Próximos */}
            <div className="flex flex-col gap-4">
              <Section title="Partidos de Hoy" hint={`${todayMatches.length} partidos`}>
                <MatchList
                  matches={todayMatches}
                  emptyLabel="No hay partidos programados para hoy."
                />
              </Section>

              <Section
                title="Próximos Partidos"
                hint={`${upcomingMatches.length} en agenda`}
              >
                <MatchList
                  matches={upcomingMatches}
                  showTournament
                  emptyLabel="Sin próximos partidos por ahora."
                />
              </Section>
            </div>

            {/* Columna 2: Resultados recientes */}
            <div className="flex flex-col gap-4">
              <Section
                title="Resultados Recientes"
                hint={`Últimos ${recentResults.length}`}
                className="lg:max-h-[calc(100vh-7rem)]"
              >
                <MatchList
                  matches={recentResults}
                  showTournament
                  emptyLabel="Todavía no hay resultados."
                />
              </Section>
            </div>

            {/* Columna 3: Ranking + Torneos */}
            <div className="flex flex-col gap-4">
              <Section title="Ranking Mundial" hint="Top 20">
                <RankingTable entries={data.ranking} />
              </Section>

              <Section title="Torneos" hint={`${data.tournaments.length} eventos`}>
                <TournamentList tournaments={data.tournaments} />
              </Section>
            </div>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-600">
        PadelScores · Datos de demostración (mock). Inspirado en Promiedos.
      </footer>
    </div>
  )
}

/** Esqueleto simple mientras cargan los datos. */
function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-lg border border-ink-600 bg-ink-800"
        />
      ))}
    </div>
  )
}
