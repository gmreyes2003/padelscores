import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  /** Texto pequeño a la derecha del título (ej. contador). */
  hint?: string
  children: ReactNode
  className?: string
}

/**
 * Contenedor reutilizable para cada bloque de contenido.
 * Aporta el encabezado compacto y el marco de tarjeta oscura.
 */
export function Section({ title, hint, children, className = '' }: SectionProps) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-lg border border-ink-600 bg-ink-800 ${className}`}
    >
      <header className="flex items-center justify-between border-b border-ink-600 px-3 py-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-100">
          {title}
        </h2>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  )
}
