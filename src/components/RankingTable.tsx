import { useMemo, useState } from 'react'
import type { RankingEntry } from '../types'
import { countryFlag } from '../utils/flag'
import { useNavigation } from '../context/NavigationContext'

interface RankingTableProps {
  entries: RankingEntry[]
}

/** Indicador de variación de posición respecto a la semana anterior. */
function Movement({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-gray-600">–</span>
  }
  const up = value > 0
  return (
    <span className={up ? 'text-accent' : 'text-live'}>
      {up ? '▲' : '▼'} {Math.abs(value)}
    </span>
  )
}

/** Tabla del ranking mundial: posición, jugador, país y puntos. Filtrable. */
export function RankingTable({ entries }: RankingTableProps) {
  const { openPlayer } = useNavigation()
  const [query, setQuery] = useState('')

  // Filtra por nombre de jugador (sin distinguir mayúsculas/acentos básicos).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.player.name.toLowerCase().includes(q))
  }, [entries, query])

  return (
    <div className="flex flex-col">
      {/* Filtro de búsqueda */}
      <div className="border-b border-ink-700/60 p-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar jugador…"
          className="w-full rounded border border-ink-600 bg-ink-900 px-2 py-1 text-sm text-gray-100 placeholder:text-gray-600 focus:border-accent focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-gray-500">
          Sin jugadores que coincidan.
        </p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-gray-500">
              <th className="py-1.5 pl-3 text-left font-medium">#</th>
              <th className="py-1.5 text-left font-medium">Jugador</th>
              <th className="py-1.5 pr-2 text-right font-medium">Var.</th>
              <th className="py-1.5 pr-3 text-right font-medium">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.player.id}
                onClick={() => openPlayer(e.player.id)}
                className="cursor-pointer border-t border-ink-700/60 hover:bg-ink-700/40"
              >
                <td className="py-1.5 pl-3 text-left font-semibold tabular-nums text-gray-400">
                  {e.position}
                </td>
                <td className="py-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs">{countryFlag(e.player.country)}</span>
                    <span className="truncate text-gray-100">{e.player.name}</span>
                  </span>
                </td>
                <td className="py-1.5 pr-2 text-right text-xs tabular-nums">
                  <Movement value={e.movement} />
                </td>
                <td className="py-1.5 pr-3 text-right font-semibold tabular-nums text-gray-200">
                  {e.points.toLocaleString('es-ES')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
