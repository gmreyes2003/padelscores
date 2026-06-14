import type { RankingEntry } from '../types'
import { countryFlag } from '../utils/flag'

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

/** Tabla del ranking mundial: posición, jugador, país y puntos. */
export function RankingTable({ entries }: RankingTableProps) {
  return (
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
        {entries.map((e) => (
          <tr
            key={e.player.id}
            className="border-t border-ink-700/60 hover:bg-ink-700/40"
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
  )
}
