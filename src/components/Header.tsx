interface HeaderProps {
  /** Cantidad de partidos en vivo, para el indicador del encabezado. */
  liveCount: number
  /** Fecha de referencia mostrada a la derecha. */
  date: Date
}

/** Barra superior fija con el logo y la fecha actual. */
export function Header({ liveCount, date }: HeaderProps) {
  const prettyDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="sticky top-0 z-10 border-b border-ink-600 bg-ink-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Logo simple en SVG, sin dependencias. */}
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <circle cx="16" cy="13" r="7" fill="none" stroke="#3ad17a" strokeWidth="2" />
            <circle cx="16" cy="13" r="2.2" fill="#3ad17a" />
            <rect x="14.5" y="19" width="3" height="9" rx="1.5" fill="#3ad17a" />
          </svg>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-gray-50">
              Padel<span className="text-accent">Scores</span>
            </h1>
            <p className="text-[11px] text-gray-500">Resultados de pádel en vivo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-xs font-semibold text-live">
              <span className="live-dot" />
              {liveCount} en vivo
            </span>
          )}
          <span className="hidden text-xs capitalize text-gray-500 sm:inline">
            {prettyDate}
          </span>
        </div>
      </div>
    </header>
  )
}
