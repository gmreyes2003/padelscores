import type { Match, Player, RankingEntry, Tournament, PadelData, SetScore } from '../types'
import matchesMock from '../data/matches.json'
import rankingMock from '../data/ranking.json'
import tournamentsMock from '../data/tournaments.json'
import { supabase, isSupabaseConfigured } from './supabaseClient'

/**
 * Capa de acceso a datos.
 *
 * Si hay credenciales de Supabase configuradas (ver `supabaseClient.ts`),
 * lee de la base de datos. Si no, usa los JSON mock como respaldo, de modo
 * que la app sigue funcionando en local sin configurar nada.
 *
 * Toda la UI consume estas funciones; nunca conoce el origen de los datos.
 */

/** Simula latencia de red para el modo mock (la UI muestra su carga). */
const withDelay = <T>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

/* ------------------------------------------------------------------ */
/* Tipos de las filas tal como vienen de la base (snake_case)         */
/* ------------------------------------------------------------------ */

interface PlayerRow {
  id: string
  name: string
  country: string
}
interface TeamRow {
  id: string
  player1_id: string
  player2_id: string
}
interface MatchRow {
  id: string
  start_time: string
  tournament_name: string
  round: string
  court: string | null
  status: Match['status']
  sets: SetScore[] | null
  team_a_id: string
  team_b_id: string
  winner_team_id: string | null
}
interface RankingRow {
  position: number
  points: number
  movement: number
  // PostgREST tipa la relación embebida como array aunque sea 1:1.
  players: PlayerRow | PlayerRow[] | null
}
interface TournamentRow {
  id: string
  name: string
  location: string
  start_date: string
  end_date: string
  category: string
  status: Tournament['status']
}

/** Lanza un error legible si la consulta de Supabase falló. */
function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return (res.data ?? []) as T
}

/* ------------------------------------------------------------------ */
/* Lectura desde Supabase                                             */
/* ------------------------------------------------------------------ */

async function fetchMatchesFromDb(): Promise<Match[]> {
  // Traemos jugadores, parejas y partidos por separado y los ensamblamos en
  // JS (evita la sintaxis de "embedding" ambigua por las 3 FKs a `teams`).
  const [players, teams, matches] = await Promise.all([
    supabase!.from('players').select('id, name, country'),
    supabase!.from('teams').select('id, player1_id, player2_id'),
    supabase!
      .from('matches')
      .select(
        'id, start_time, tournament_name, round, court, status, sets, team_a_id, team_b_id, winner_team_id',
      )
      .order('start_time', { ascending: true }),
  ])

  const playerRows = unwrap<PlayerRow[]>(players)
  const teamRows = unwrap<TeamRow[]>(teams)
  const matchRows = unwrap<MatchRow[]>(matches)

  const playerMap = new Map<string, Player>(playerRows.map((p) => [p.id, p]))
  const teamMap = new Map(
    teamRows.map((t) => [
      t.id,
      {
        id: t.id,
        players: [playerMap.get(t.player1_id), playerMap.get(t.player2_id)] as [
          Player,
          Player,
        ],
      },
    ]),
  )

  return matchRows.map((m) => ({
    id: m.id,
    startTime: m.start_time,
    tournamentName: m.tournament_name,
    round: m.round,
    court: m.court ?? undefined,
    teamA: teamMap.get(m.team_a_id)!,
    teamB: teamMap.get(m.team_b_id)!,
    status: m.status,
    sets: m.sets ?? [],
    winnerTeamId: m.winner_team_id ?? undefined,
  }))
}

async function fetchRankingFromDb(): Promise<RankingEntry[]> {
  // Una sola FK a `players`, así que aquí sí usamos embedding.
  const res = await supabase!
    .from('rankings')
    .select('position, points, movement, players ( id, name, country )')
    .order('position', { ascending: true })

  const rows = unwrap<RankingRow[]>(res as { data: RankingRow[] | null; error: { message: string } | null })
  return rows
    .map((r) => {
      // Normaliza la relación embebida (objeto o array) a un solo jugador.
      const player = Array.isArray(r.players) ? r.players[0] : r.players
      return player
        ? {
            position: r.position,
            points: r.points,
            movement: r.movement,
            player: player as Player,
          }
        : null
    })
    .filter((e): e is RankingEntry => e !== null)
}

async function fetchTournamentsFromDb(): Promise<Tournament[]> {
  const res = await supabase!
    .from('tournaments')
    .select('id, name, location, start_date, end_date, category, status')
    .order('start_date', { ascending: false })

  const rows = unwrap<TournamentRow[]>(res)
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location,
    startDate: t.start_date,
    endDate: t.end_date,
    category: t.category,
    status: t.status,
  }))
}

/* ------------------------------------------------------------------ */
/* API pública (Supabase con respaldo a mock)                         */
/* ------------------------------------------------------------------ */

export async function fetchMatches(): Promise<Match[]> {
  if (!isSupabaseConfigured) return withDelay(matchesMock as Match[])
  return fetchMatchesFromDb()
}

export async function fetchRanking(): Promise<RankingEntry[]> {
  if (!isSupabaseConfigured) return withDelay(rankingMock as RankingEntry[])
  return fetchRankingFromDb()
}

export async function fetchTournaments(): Promise<Tournament[]> {
  if (!isSupabaseConfigured) return withDelay(tournamentsMock as Tournament[])
  return fetchTournamentsFromDb()
}

/** Trae todos los datos en paralelo. Usado por el hook principal. */
export async function fetchAllData(): Promise<PadelData> {
  const [matches, ranking, tournaments] = await Promise.all([
    fetchMatches(),
    fetchRanking(),
    fetchTournaments(),
  ])
  return { matches, ranking, tournaments }
}
