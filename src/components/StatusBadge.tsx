import type { MatchStatus } from '../types'

interface StatusBadgeProps {
  status: MatchStatus
}

/** Etiqueta compacta que indica el estado de un partido. */
export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-live/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-live">
        <span className="live-dot" />
        En juego
      </span>
    )
  }

  if (status === 'finished') {
    return (
      <span className="rounded bg-ink-600 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        Final
      </span>
    )
  }

  return (
    <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
      Próximo
    </span>
  )
}
