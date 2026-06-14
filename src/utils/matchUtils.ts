import type { Match, Player, Team } from '../types'

/** Devuelve true si la fecha ISO cae en el mismo día calendario que `ref`. */
export function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso)
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  )
}

/** Inicio del día (00:00) de la fecha dada. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Clave de día local "YYYY-MM-DD", útil para comparar fechas sin hora. */
export function toDateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Conjunto de días (claves YYYY-MM-DD) que tienen al menos un partido. */
export function getDatesWithMatches(matches: Match[]): Set<string> {
  return new Set(matches.map((m) => toDateKey(new Date(m.startTime))))
}

/** Busca un jugador por id recorriendo todos los partidos. */
export function findPlayer(matches: Match[], playerId: string): Player | undefined {
  for (const m of matches) {
    for (const p of [...m.teamA.players, ...m.teamB.players]) {
      if (p.id === playerId) return p
    }
  }
  return undefined
}

/** Todos los partidos en los que participa un jugador, más recientes primero. */
export function getMatchesByPlayer(matches: Match[], playerId: string): Match[] {
  return matches
    .filter((m) =>
      [...m.teamA.players, ...m.teamB.players].some((p) => p.id === playerId),
    )
    .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
}

/** Partidos del día indicado, ordenados por hora ascendente. */
export function getTodayMatches(matches: Match[], ref: Date): Match[] {
  return matches
    .filter((m) => isSameDay(m.startTime, ref))
    .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
}

/**
 * Últimos N partidos finalizados ANTES del día de referencia, del más
 * reciente al más antiguo. Los finalizados del propio día de referencia se
 * muestran en la sección principal, no aquí.
 */
export function getRecentResults(matches: Match[], ref: Date, limit = 20): Match[] {
  const dayStart = +startOfDay(ref)
  return matches
    .filter((m) => m.status === 'finished' && +new Date(m.startTime) < dayStart)
    .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
    .slice(0, limit)
}

/**
 * Próximos partidos (status 'upcoming') DESPUÉS del día de referencia,
 * ordenados por hora ascendente. Excluye los del propio día, ya cubiertos
 * por la sección principal.
 */
export function getUpcomingMatches(matches: Match[], ref: Date, limit = 12): Match[] {
  const nextDayStart = +startOfDay(ref) + 24 * 60 * 60 * 1000
  return matches
    .filter((m) => m.status === 'upcoming' && +new Date(m.startTime) >= nextDayStart)
    .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
    .slice(0, limit)
}

/** Nombre corto de la pareja: "Apellido / Apellido". */
export function teamShortName(team: Team): string {
  return team.players.map((p) => lastName(p.name)).join(' / ')
}

/** Extrae el último token del nombre como "apellido". */
function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts[parts.length - 1]
}

/** Cuenta los sets ganados por cada pareja a partir del marcador. */
export function setsWon(match: Match): [number, number] {
  let a = 0
  let b = 0
  for (const [ga, gb] of match.sets) {
    if (ga > gb) a++
    else if (gb > ga) b++
  }
  return [a, b]
}
