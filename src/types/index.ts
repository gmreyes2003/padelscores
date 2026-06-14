/**
 * Tipos de dominio de la aplicación.
 * Modelan partidos, parejas, ranking y torneos de pádel.
 * Estos contratos están pensados para mapear 1:1 con la futura API real.
 */

/** Estado posible de un partido. */
export type MatchStatus = 'upcoming' | 'live' | 'finished'

/** Un jugador individual. */
export interface Player {
  id: string
  name: string
  country: string // código ISO de 2 letras, ej. "ES", "AR"
}

/** Una pareja de pádel (dos jugadores). */
export interface Team {
  id: string
  players: [Player, Player]
}

/**
 * Resultado de un partido expresado por sets.
 * Cada entrada es el par de games [parejaA, parejaB] de ese set.
 * Ej: [[6, 4], [3, 6], [6, 2]]
 */
export type SetScore = [number, number]

/** Un partido entre dos parejas. */
export interface Match {
  id: string
  /** Fecha-hora de inicio en formato ISO 8601. */
  startTime: string
  tournamentName: string
  round: string // ej. "Cuartos", "Semifinal", "Final"
  court?: string // pista, opcional
  teamA: Team
  teamB: Team
  status: MatchStatus
  /** Sets jugados hasta el momento. Vacío si el partido aún no empezó. */
  sets: SetScore[]
  /** Id de la pareja ganadora. Solo presente si status === 'finished'. */
  winnerTeamId?: string
}

/** Una posición en el ranking mundial. */
export interface RankingEntry {
  position: number
  player: Player
  points: number
  /** Variación de posición respecto a la semana anterior (+ sube, - baja). */
  movement: number
}

/** Estado de un torneo. */
export type TournamentStatus = 'upcoming' | 'ongoing' | 'finished'

/** Un torneo del circuito. */
export interface Tournament {
  id: string
  name: string
  location: string
  /** Fecha de inicio (ISO). */
  startDate: string
  /** Fecha de fin (ISO). */
  endDate: string
  category: string // ej. "P1000", "Major", "Open"
  status: TournamentStatus
}

/** Conjunto completo de datos que consume la aplicación. */
export interface PadelData {
  matches: Match[]
  ranking: RankingEntry[]
  tournaments: Tournament[]
}
