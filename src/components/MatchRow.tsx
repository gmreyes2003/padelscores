import type { Match, Team } from '../types'
import { StatusBadge } from './StatusBadge'
import { setsWon, teamShortName } from '../utils/matchUtils'
import { countryFlag } from '../utils/flag'

interface MatchRowProps {
  match: Match
  /** Muestra el nombre del torneo/ronda bajo la hora. */
  showTournament?: boolean
}

/** Formatea la hora de inicio como HH:mm. */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Formatea el día como "Sáb 14/06". */
function formatDay(iso: string): string {
  const d = new Date(iso)
  const day = d.toLocaleDateString('es-ES', { weekday: 'short' })
  const date = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
  return `${day} ${date}`
}

/**
 * Fila de un partido. Reutilizada en "Partidos de Hoy", "Resultados
 * Recientes" y "Próximos Partidos". El diseño es denso, estilo Promiedos.
 */
export function MatchRow({ match, showTournament = false }: MatchRowProps) {
  const [wonA, wonB] = setsWon(match)
  const isFinished = match.status === 'finished'

  // Resalta a la pareja ganadora (o a la que va ganando en vivo).
  const aLeads = isFinished ? match.winnerTeamId === match.teamA.id : wonA > wonB
  const bLeads = isFinished ? match.winnerTeamId === match.teamB.id : wonB > wonA

  return (
    <div className="flex items-stretch gap-3 border-b border-ink-700/60 px-3 py-2 last:border-b-0 hover:bg-ink-700/40">
      {/* Columna izquierda: hora + estado */}
      <div className="flex w-16 flex-shrink-0 flex-col justify-center gap-1 text-center">
        <span className="text-sm font-semibold tabular-nums text-gray-200">
          {formatTime(match.startTime)}
        </span>
        <StatusBadge status={match.status} />
      </div>

      {/* Columna central: parejas */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <TeamLine team={match.teamA} leads={aLeads} dimmed={isFinished && !aLeads} />
        <TeamLine team={match.teamB} leads={bLeads} dimmed={isFinished && !bLeads} />
        {showTournament && (
          <span className="mt-0.5 truncate text-[11px] text-gray-500">
            {formatDay(match.startTime)} · {match.tournamentName} · {match.round}
          </span>
        )}
      </div>

      {/* Columna derecha: marcador por sets */}
      <div className="flex flex-shrink-0 items-center">
        {match.sets.length > 0 ? (
          <div className="flex flex-col gap-1">
            <ScoreLine sets={match.sets} side="a" leads={aLeads} />
            <ScoreLine sets={match.sets} side="b" leads={bLeads} />
          </div>
        ) : (
          <span className="text-xs text-gray-600">vs</span>
        )}
      </div>
    </div>
  )
}

/** Una línea de pareja con sus banderas. */
function TeamLine({
  team,
  leads,
  dimmed,
}: {
  team: Team
  leads: boolean
  dimmed: boolean
}) {
  return (
    <div
      className={`flex items-center gap-1.5 truncate text-sm ${
        leads ? 'font-semibold text-gray-50' : 'text-gray-300'
      } ${dimmed ? 'opacity-60' : ''}`}
    >
      <span className="flex-shrink-0 text-xs">
        {team.players.map((p) => countryFlag(p.country)).join('')}
      </span>
      <span className="truncate">{teamShortName(team)}</span>
    </div>
  )
}

/** Marcador por sets de una de las parejas. */
function ScoreLine({
  sets,
  side,
  leads,
}: {
  sets: Match['sets']
  side: 'a' | 'b'
  leads: boolean
}) {
  return (
    <div className="flex gap-1">
      {sets.map(([ga, gb], i) => {
        const games = side === 'a' ? ga : gb
        const won = side === 'a' ? ga > gb : gb > ga
        return (
          <span
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded text-xs tabular-nums ${
              won ? 'bg-ink-600 font-bold text-gray-50' : 'text-gray-500'
            } ${leads ? '' : ''}`}
          >
            {games}
          </span>
        )
      })}
    </div>
  )
}
