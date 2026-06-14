import type { Match, RankingEntry, Tournament, PadelData } from '../types'
import matchesMock from '../data/matches.json'
import rankingMock from '../data/ranking.json'
import tournamentsMock from '../data/tournaments.json'

/**
 * Capa de acceso a datos.
 *
 * Hoy devuelve datos mock desde JSON, pero la firma de las funciones está
 * pensada para sustituir el cuerpo por llamadas `fetch` a una API real
 * (ej. WPT / Premier Padel) sin tocar los componentes que la consumen.
 *
 * Para conectar la API real:
 *   1. Definir VITE_API_BASE_URL en un archivo .env
 *   2. Reemplazar el cuerpo de cada función por un fetch al endpoint
 *      correspondiente, manteniendo el tipo de retorno.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/** Simula la latencia de red para que la UI muestre su estado de carga. */
const withDelay = <T>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

export async function fetchMatches(): Promise<Match[]> {
  // API real (ejemplo):
  // return fetch(`${API_BASE_URL}/matches`).then((r) => r.json())
  void API_BASE_URL
  return withDelay(matchesMock as Match[])
}

export async function fetchRanking(): Promise<RankingEntry[]> {
  // return fetch(`${API_BASE_URL}/ranking`).then((r) => r.json())
  return withDelay(rankingMock as RankingEntry[])
}

export async function fetchTournaments(): Promise<Tournament[]> {
  // return fetch(`${API_BASE_URL}/tournaments`).then((r) => r.json())
  return withDelay(tournamentsMock as Tournament[])
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
