import type { Tournament, TournamentStatus } from '../types'

interface TournamentListProps {
  tournaments: Tournament[]
}

/** Texto y color para cada estado de torneo. */
const STATUS_META: Record<TournamentStatus, { label: string; className: string }> = {
  ongoing: { label: 'En curso', className: 'bg-live/15 text-live' },
  upcoming: { label: 'Próximo', className: 'bg-accent/15 text-accent' },
  finished: { label: 'Finalizado', className: 'bg-ink-600 text-gray-400' },
}

/** Rango de fechas legible: "9 – 15 jun". */
function formatRange(startISO: string, endISO: string): string {
  const start = new Date(startISO)
  const end = new Date(endISO)
  const month = end.toLocaleDateString('es-ES', { month: 'short' })
  return `${start.getDate()} – ${end.getDate()} ${month}`
}

/** Lista de torneos con su categoría, fechas y estado. */
export function TournamentList({ tournaments }: TournamentListProps) {
  return (
    <div className="flex flex-col">
      {tournaments.map((t) => {
        const meta = STATUS_META[t.status]
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 border-b border-ink-700/60 px-3 py-2 last:border-b-0 hover:bg-ink-700/40"
          >
            {/* Categoría como "etiqueta" lateral */}
            <span className="flex-shrink-0 rounded bg-ink-700 px-1.5 py-0.5 text-[11px] font-bold text-gray-300">
              {t.category}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-100">{t.name}</p>
              <p className="truncate text-[11px] text-gray-500">
                {t.location} · {formatRange(t.startDate, t.endDate)}
              </p>
            </div>

            <span
              className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${meta.className}`}
            >
              {meta.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
