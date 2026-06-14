import type { Match, Team } from '../types'
import { setsWon, teamShortName } from '../utils/matchUtils'
import { countryFlag } from '../utils/flag'
import { StatusBadge } from './StatusBadge'
import { useNavigation } from '../context/NavigationContext'

interface MatchDetailProps {
  match: Match
}

/** Fecha y hora larga: "sábado 14 de junio, 16:00". */
function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}

/** Vista de detalle de un partido: marcador set a set y datos del encuentro. */
export function MatchDetail({ match }: MatchDetailProps) {
  const { openPlayer } = useNavigation()
  const [wonA, wonB] = setsWon(match)
  const isFinished = match.status === 'finished'
  const aLeads = isFinished ? match.winnerTeamId === match.teamA.id : wonA > wonB
  const bLeads = isFinished ? match.winnerTeamId === match.teamB.id : wonB > wonA

  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800">
      {/* Cabecera con torneo, ronda y estado */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-600 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-100">
            {match.tournamentName}
          </p>
          <p className="text-xs text-gray-500">
            {match.round}
            {match.court ? ` · Pista ${match.court}` : ''} · {formatDateTime(match.startTime)}
          </p>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Marcador grande */}
      <div className="px-4 py-5">
        <TeamScore
          team={match.teamA}
          sets={match.sets}
          side="a"
          leads={aLeads}
          onPlayer={openPlayer}
        />
        <div className="my-2 border-t border-ink-700/60" />
        <TeamScore
          team={match.teamB}
          sets={match.sets}
          side="b"
          leads={bLeads}
          onPlayer={openPlayer}
        />
      </div>

      {/* Pie con resultado textual */}
      <div className="border-t border-ink-600 px-4 py-3 text-sm text-gray-400">
        {match.status === 'upcoming' && 'El partido aún no comenzó.'}
        {match.status === 'live' && 'Partido en juego.'}
        {match.status === 'finished' && match.winnerTeamId && (
          <span>
            Ganador:{' '}
            <span className="font-semibold text-gray-100">
              {teamShortName(
                match.winnerTeamId === match.teamA.id ? match.teamA : match.teamB,
              )}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

/** Fila de una pareja con sus jugadores y los games de cada set. */
function TeamScore({
  team,
  sets,
  side,
  leads,
  onPlayer,
}: {
  team: Team
  sets: Match['sets']
  side: 'a' | 'b'
  leads: boolean
  onPlayer: (id: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Jugadores */}
      <div className="flex min-w-0 flex-col gap-1">
        {team.players.map((p) => (
          <button
            key={p.id}
            onClick={() => onPlayer(p.id)}
            className={`flex items-center gap-2 text-left text-base hover:text-accent ${
              leads ? 'font-semibold text-gray-50' : 'text-gray-300'
            }`}
          >
            <span className="text-sm">{countryFlag(p.country)}</span>
            <span className="truncate hover:underline">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Games por set */}
      <div className="flex flex-shrink-0 gap-1.5">
        {sets.length === 0 ? (
          <span className="text-sm text-gray-600">—</span>
        ) : (
          sets.map(([ga, gb], i) => {
            const games = side === 'a' ? ga : gb
            const won = side === 'a' ? ga > gb : gb > ga
            return (
              <span
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded text-lg tabular-nums ${
                  won ? 'bg-ink-600 font-bold text-gray-50' : 'text-gray-500'
                }`}
              >
                {games}
              </span>
            )
          })
        )}
      </div>
    </div>
  )
}
