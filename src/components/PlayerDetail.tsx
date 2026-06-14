import type { Match, Player, RankingEntry } from '../types'
import { countryFlag } from '../utils/flag'
import { getMatchesByPlayer } from '../utils/matchUtils'
import { MatchList } from './MatchList'

interface PlayerDetailProps {
  player: Player
  ranking?: RankingEntry
  matches: Match[]
}

/** Vista de detalle de un jugador: datos, posición en el ranking e historial. */
export function PlayerDetail({ player, ranking, matches }: PlayerDetailProps) {
  const playerMatches = getMatchesByPlayer(matches, player.id)

  // Estadística simple de victorias/derrotas con los partidos finalizados.
  const finished = playerMatches.filter((m) => m.status === 'finished')
  const wins = finished.filter((m) => {
    const team =
      m.teamA.players.some((p) => p.id === player.id) ? m.teamA.id : m.teamB.id
    return m.winnerTeamId === team
  }).length
  const losses = finished.length - wins

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera del jugador */}
      <div className="rounded-lg border border-ink-600 bg-ink-800 p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{countryFlag(player.country)}</span>
          <div>
            <h2 className="text-xl font-extrabold text-gray-50">{player.name}</h2>
            <p className="text-sm text-gray-500">
              {ranking ? `Nº ${ranking.position} del ranking mundial` : 'Fuera del top 20'}
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Puntos" value={ranking ? ranking.points.toLocaleString('es-ES') : '—'} />
          <Stat label="Victorias" value={String(wins)} />
          <Stat label="Derrotas" value={String(losses)} />
        </div>
      </div>

      {/* Historial de partidos */}
      <section className="overflow-hidden rounded-lg border border-ink-600 bg-ink-800">
        <header className="border-b border-ink-600 px-3 py-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-100">
            Partidos ({playerMatches.length})
          </h3>
        </header>
        <MatchList
          matches={playerMatches}
          showTournament
          emptyLabel="Sin partidos registrados."
        />
      </section>
    </div>
  )
}

/** Caja de una métrica individual. */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-ink-600 bg-ink-900 py-2">
      <p className="text-lg font-bold tabular-nums text-gray-50">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  )
}
