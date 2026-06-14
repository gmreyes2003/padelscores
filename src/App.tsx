import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { Section } from './components/Section'
import { MatchList } from './components/MatchList'
import { RankingTable } from './components/RankingTable'
import { TournamentList } from './components/TournamentList'
import { DateNavigator } from './components/DateNavigator'
import { MatchStatusFilter, type MatchFilter } from './components/MatchStatusFilter'
import { MatchDetail } from './components/MatchDetail'
import { PlayerDetail } from './components/PlayerDetail'
import { NavigationContext, type View } from './context/NavigationContext'
import { usePadelData } from './hooks/usePadelData'
import {
  findPlayer,
  getDatesWithMatches,
  getRecentResults,
  getTodayMatches,
  getUpcomingMatches,
  toDateKey,
} from './utils/matchUtils'

/**
 * Día "real" de hoy. Se fija al día de los datos mock para que la demo
 * siempre muestre contenido. Al conectar una API real, usar `new Date()`.
 */
const TODAY = new Date('2026-06-14T12:00:00')

/** Cada cuánto se refrescan los datos automáticamente (30 s). */
const POLL_INTERVAL_MS = 30_000

export default function App() {
  const { data, loading, error, lastUpdated, reload } = usePadelData({
    pollIntervalMs: POLL_INTERVAL_MS,
  })

  // Día seleccionado en el calendario: filtra todas las secciones.
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY)
  // Vista activa: pantalla principal o detalle de partido/jugador.
  const [view, setView] = useState<View>({ kind: 'home' })
  // Filtro de estado para los partidos del día.
  const [statusFilter, setStatusFilter] = useState<MatchFilter>('all')

  // API de navegación expuesta por contexto a toda la app.
  const nav = useMemo(
    () => ({
      openMatch: (id: string) => setView({ kind: 'match', id }),
      openPlayer: (id: string) => setView({ kind: 'player', id }),
      goHome: () => setView({ kind: 'home' }),
    }),
    [],
  )

  const liveCount = data?.matches.filter((m) => m.status === 'live').length ?? 0

  return (
    <NavigationContext.Provider value={nav}>
      <div className="min-h-screen">
        <Header liveCount={liveCount} />

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

          {/* Contenido principal */}
          {data && view.kind === 'home' && (
            <HomeView
              data={data}
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d)
                setStatusFilter('all')
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              lastUpdated={lastUpdated}
              onReload={reload}
            />
          )}

          {/* Detalle de partido / jugador */}
          {data && view.kind !== 'home' && (
            <DetailView view={view} data={data} onBack={nav.goHome} />
          )}
        </main>

        <footer className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-600">
          La Bandeja · Pádel en vivo
        </footer>
      </div>
    </NavigationContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* Pantalla principal                                                 */
/* ------------------------------------------------------------------ */

interface HomeViewProps {
  data: NonNullable<ReturnType<typeof usePadelData>['data']>
  selectedDate: Date
  onSelectDate: (d: Date) => void
  statusFilter: MatchFilter
  onStatusFilterChange: (f: MatchFilter) => void
  lastUpdated: Date | null
  onReload: () => void
}

function HomeView({
  data,
  selectedDate,
  onSelectDate,
  statusFilter,
  onStatusFilterChange,
  lastUpdated,
  onReload,
}: HomeViewProps) {
  // Derivamos las vistas de partidos según el día seleccionado.
  const dayMatches = useMemo(
    () => getTodayMatches(data.matches, selectedDate),
    [data.matches, selectedDate],
  )
  const recentResults = useMemo(
    () => getRecentResults(data.matches, selectedDate, 20),
    [data.matches, selectedDate],
  )
  const upcomingMatches = useMemo(
    () => getUpcomingMatches(data.matches, selectedDate, 12),
    [data.matches, selectedDate],
  )
  const datesWithMatches = useMemo(
    () => getDatesWithMatches(data.matches),
    [data.matches],
  )

  // Conteo por estado y aplicación del filtro a los partidos del día.
  const counts: Record<MatchFilter, number> = {
    all: dayMatches.length,
    live: dayMatches.filter((m) => m.status === 'live').length,
    upcoming: dayMatches.filter((m) => m.status === 'upcoming').length,
    finished: dayMatches.filter((m) => m.status === 'finished').length,
  }
  const filteredDayMatches =
    statusFilter === 'all'
      ? dayMatches
      : dayMatches.filter((m) => m.status === statusFilter)

  const isToday = toDateKey(selectedDate) === toDateKey(TODAY)

  return (
    <>
      {/* Navegación por fecha (calendario) */}
      <DateNavigator
        selectedDate={selectedDate}
        today={TODAY}
        datesWithMatches={datesWithMatches}
        onChange={onSelectDate}
      />

      {/* Barra de estado: última actualización + refresco manual */}
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
          onClick={onReload}
          className="rounded border border-ink-600 px-2 py-1 font-semibold text-gray-300 hover:bg-ink-700"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Columna 1: partidos del día + próximos */}
        <div className="flex flex-col gap-4">
          <Section
            title={isToday ? 'Partidos de Hoy' : 'Partidos del Día'}
            hint={`${filteredDayMatches.length} partidos`}
          >
            <MatchStatusFilter
              value={statusFilter}
              onChange={onStatusFilterChange}
              counts={counts}
            />
            <MatchList
              matches={filteredDayMatches}
              emptyLabel="No hay partidos para este día."
            />
          </Section>

          <Section title="Próximos Partidos" hint={`${upcomingMatches.length} en agenda`}>
            <MatchList
              matches={upcomingMatches}
              showTournament
              emptyLabel="Sin próximos partidos."
            />
          </Section>
        </div>

        {/* Columna 2: resultados recientes */}
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

        {/* Columna 3: ranking + torneos */}
        <div className="flex flex-col gap-4">
          <Section title="Ranking Mundial" hint="Top 20">
            <RankingTable entries={data.ranking} />
          </Section>

          <Section title="Torneos" hint={`${data.tournaments.length} eventos`}>
            <TournamentList tournaments={data.tournaments} />
          </Section>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Vistas de detalle                                                  */
/* ------------------------------------------------------------------ */

interface DetailViewProps {
  view: Exclude<View, { kind: 'home' }>
  data: NonNullable<ReturnType<typeof usePadelData>['data']>
  onBack: () => void
}

function DetailView({ view, data, onBack }: DetailViewProps) {
  let content: JSX.Element

  if (view.kind === 'match') {
    const match = data.matches.find((m) => m.id === view.id)
    content = match ? (
      <MatchDetail match={match} />
    ) : (
      <NotFound label="Partido no encontrado." />
    )
  } else {
    const player = findPlayer(data.matches, view.id)
    const ranking = data.ranking.find((r) => r.player.id === view.id)
    content = player ? (
      <PlayerDetail player={player} ranking={ranking} matches={data.matches} />
    ) : (
      <NotFound label="Jugador no encontrado." />
    )
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 rounded border border-ink-600 px-3 py-1.5 text-sm font-semibold text-gray-300 hover:bg-ink-700"
      >
        ‹ Volver
      </button>
      {content}
    </div>
  )
}

function NotFound({ label }: { label: string }) {
  return (
    <p className="rounded-lg border border-ink-600 bg-ink-800 px-4 py-8 text-center text-sm text-gray-500">
      {label}
    </p>
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
