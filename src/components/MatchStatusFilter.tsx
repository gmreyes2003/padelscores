import type { MatchStatus } from '../types'

/** Valor del filtro: 'all' o uno de los estados de partido. */
export type MatchFilter = 'all' | MatchStatus

interface MatchStatusFilterProps {
  value: MatchFilter
  onChange: (value: MatchFilter) => void
  /** Cantidad de partidos por estado, para mostrar el contador en cada chip. */
  counts: Record<MatchFilter, number>
}

const OPTIONS: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'live', label: 'En vivo' },
  { value: 'upcoming', label: 'Próximos' },
  { value: 'finished', label: 'Finalizados' },
]

/** Chips para filtrar una lista de partidos por estado. */
export function MatchStatusFilter({ value, onChange, counts }: MatchStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-ink-700/60 p-2">
      {OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active
                ? 'bg-accent text-ink-900'
                : 'bg-ink-700 text-gray-300 hover:bg-ink-600'
            }`}
          >
            {opt.label} ({counts[opt.value]})
          </button>
        )
      })}
    </div>
  )
}
