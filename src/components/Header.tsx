import { useNavigation } from '../context/NavigationContext'

interface HeaderProps {
  /** Cantidad de partidos en vivo, para el indicador del encabezado. */
  liveCount: number
}

/** Barra superior con el logo (vuelve al inicio) y el contador de partidos en vivo. */
export function Header({ liveCount }: HeaderProps) {
  const { goHome } = useNavigation()

  return (
    <header className="sticky top-0 z-30 border-b border-ink-600 bg-ink-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={goHome} className="flex items-center gap-2" aria-label="Ir al inicio">
          {/* Logo simple en SVG, sin dependencias. */}
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <circle cx="16" cy="13" r="7" fill="none" stroke="#3ad17a" strokeWidth="2" />
            <circle cx="16" cy="13" r="2.2" fill="#3ad17a" />
            <rect x="14.5" y="19" width="3" height="9" rx="1.5" fill="#3ad17a" />
          </svg>
          <h1 className="text-lg font-extrabold tracking-tight text-gray-50">
            La <span className="text-accent">Bandeja</span>
          </h1>
        </button>

        {liveCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-xs font-semibold text-live">
            <span className="live-dot" />
            {liveCount} en vivo
          </span>
        )}
      </div>
    </header>
  )
}
