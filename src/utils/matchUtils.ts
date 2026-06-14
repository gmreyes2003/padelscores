import type { Match, Team } from '../types'

/** Devuelve true si la fecha ISO cae en el mismo día calendario que `ref`. */
export function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso)
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  )
}

/** Partidos del día indicado, ordenados por hora ascendente. */
export function getTodayMatches(matches: Match[], ref: Date): Match[] {
  return matches
    .filter((m) => isSameDay(m.startTime, ref))
    .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
}

/**
 * Últimos N partidos finalizados, del más reciente al más antiguo.
 */
export function getRecentResults(matches: Match[], limit = 20): Match[] {
  return matches
    .filter((m) => m.status === 'finished')
    .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
    .slice(0, limit)
}

/**
 * Próximos partidos (status 'upcoming') a partir de `ref`, ordenados por
 * hora ascendente. Excluye los de hoy ya cubiertos por "Partidos de Hoy".
 */
export function getUpcomingMatches(matches: Match[], ref: Date, limit = 12): Match[] {
  return matches
    .filter((m) => m.status === 'upcoming' && !isSameDay(m.startTime, ref))
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
