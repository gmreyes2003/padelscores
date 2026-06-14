import { useState } from 'react'
import { toDateKey } from '../utils/matchUtils'

interface DateNavigatorProps {
  /** Día seleccionado que filtra toda la página. */
  selectedDate: Date
  /** Día "real" de hoy, para resaltarlo y etiquetar "Hoy". */
  today: Date
  /** Días con partidos (claves YYYY-MM-DD) para marcarlos en el calendario. */
  datesWithMatches: Set<string>
  onChange: (date: Date) => void
}

const WEEKDAYS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

/** Suma `days` días a una fecha y devuelve una nueva. */
function addDays(d: Date, days: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + days)
  return copy
}

/**
 * Barra de navegación de fecha al estilo Promiedos: flechas ‹ › para el día
 * anterior/siguiente y un calendario desplegable para saltar a cualquier día.
 * La fecha elegida filtra todas las secciones de la página.
 */
export function DateNavigator({
  selectedDate,
  today,
  datesWithMatches,
  onChange,
}: DateNavigatorProps) {
  const [open, setOpen] = useState(false)
  // Mes mostrado en el calendario (primer día del mes).
  const [cursor, setCursor] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  const isToday = toDateKey(selectedDate) === toDateKey(today)
  const label = isToday
    ? 'Partidos de Hoy'
    : selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })

  function pick(date: Date) {
    onChange(date)
    setOpen(false)
  }

  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-2 py-1.5">
        <button
          aria-label="Día anterior"
          onClick={() => onChange(addDays(selectedDate, -1))}
          className="rounded px-3 py-1 text-lg text-gray-400 hover:bg-ink-700 hover:text-gray-100"
        >
          ‹
        </button>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 rounded px-3 py-1 text-sm font-bold uppercase tracking-wide text-accent hover:bg-ink-700"
        >
          <span className="capitalize">{label}</span>
          <span className="text-xs">▼</span>
        </button>

        <button
          aria-label="Día siguiente"
          onClick={() => onChange(addDays(selectedDate, 1))}
          className="rounded px-3 py-1 text-lg text-gray-400 hover:bg-ink-700 hover:text-gray-100"
        >
          ›
        </button>
      </div>

      {open && (
        <>
          {/* Capa para cerrar al hacer click fuera. */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <CalendarPopover
            cursor={cursor}
            setCursor={setCursor}
            selectedDate={selectedDate}
            today={today}
            datesWithMatches={datesWithMatches}
            onPick={pick}
          />
        </>
      )}
    </div>
  )
}

interface CalendarPopoverProps {
  cursor: Date
  setCursor: (d: Date) => void
  selectedDate: Date
  today: Date
  datesWithMatches: Set<string>
  onPick: (d: Date) => void
}

/** Cuadrícula mensual del calendario, con semana iniciando en lunes. */
function CalendarPopover({
  cursor,
  setCursor,
  selectedDate,
  today,
  datesWithMatches,
  onPick,
}: CalendarPopoverProps) {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  // Día de la semana del 1° (0=Dom..6=Sáb) → offset con lunes como inicio.
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Celdas: huecos iniciales + días del mes.
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  return (
    <div className="absolute left-1/2 top-full z-20 mt-1 w-72 -translate-x-1/2 rounded-lg border border-ink-600 bg-ink-800 p-3 shadow-xl">
      {/* Encabezado: navegación de mes */}
      <div className="mb-2 flex items-center justify-between">
        <button
          aria-label="Mes anterior"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded px-2 py-1 text-gray-400 hover:bg-ink-700 hover:text-gray-100"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-100">
          {MONTHS[month]} {year}
        </span>
        <button
          aria-label="Mes siguiente"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="rounded px-2 py-1 text-gray-400 hover:bg-ink-700 hover:text-gray-100"
        >
          ›
        </button>
      </div>

      {/* Cabecera de días de la semana */}
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-500">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} />
          const key = toDateKey(date)
          const isSelected = key === toDateKey(selectedDate)
          const isToday = key === toDateKey(today)
          const hasMatches = datesWithMatches.has(key)
          return (
            <button
              key={key}
              onClick={() => onPick(date)}
              className={`relative flex h-8 items-center justify-center rounded text-sm tabular-nums transition-colors ${
                isSelected
                  ? 'bg-accent font-bold text-ink-900'
                  : isToday
                    ? 'font-bold text-accent hover:bg-ink-700'
                    : 'text-gray-300 hover:bg-ink-700'
              }`}
            >
              {date.getDate()}
              {hasMatches && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
