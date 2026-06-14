import type { Match } from '../types'
import { MatchRow } from './MatchRow'

interface MatchListProps {
  matches: Match[]
  showTournament?: boolean
  /** Mensaje cuando no hay partidos para mostrar. */
  emptyLabel?: string
}

/** Lista vertical de partidos. Renderiza un mensaje si está vacía. */
export function MatchList({
  matches,
  showTournament = false,
  emptyLabel = 'No hay partidos para mostrar.',
}: MatchListProps) {
  if (matches.length === 0) {
    return <p className="px-3 py-6 text-center text-sm text-gray-500">{emptyLabel}</p>
  }

  return (
    <div className="flex flex-col">
      {matches.map((m) => (
        <MatchRow key={m.id} match={m} showTournament={showTournament} />
      ))}
    </div>
  )
}
