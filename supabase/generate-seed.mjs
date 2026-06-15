// =====================================================================
// Genera supabase/seed.sql a partir de los JSON mock de src/data.
// Uso:  node supabase/generate-seed.mjs
// Reejecutalo si cambian los datos mock y querés regenerar el seed.
// =====================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'src', 'data')
const read = (f) => JSON.parse(readFileSync(join(dataDir, f), 'utf8'))

const matches = read('matches.json')
const ranking = read('ranking.json')
const tournaments = read('tournaments.json')

// Escapa una cadena para SQL (duplica comillas simples).
const s = (v) => `'${String(v).replace(/'/g, "''")}'`
const sn = (v) => (v == null ? 'null' : s(v)) // string o null

// --- Recolectar jugadores y parejas únicos desde los partidos ---------
const players = new Map()
const teams = new Map()
for (const m of matches) {
  for (const side of ['teamA', 'teamB']) {
    const t = m[side]
    teams.set(t.id, [t.players[0].id, t.players[1].id])
    for (const p of t.players) players.set(p.id, p)
  }
}
for (const r of ranking) players.set(r.player.id, r.player)

// --- Construir el SQL --------------------------------------------------
const out = []
out.push('-- Generado por generate-seed.mjs — NO editar a mano.')
out.push('-- Datos de ejemplo de La Bandeja. Ejecutar DESPUÉS de schema.sql.\n')

out.push('insert into players (id, name, country) values')
out.push(
  [...players.values()]
    .map((p) => `  (${s(p.id)}, ${s(p.name)}, ${s(p.country)})`)
    .join(',\n') + '\non conflict (id) do nothing;\n',
)

out.push('insert into teams (id, player1_id, player2_id) values')
out.push(
  [...teams.entries()]
    .map(([id, [p1, p2]]) => `  (${s(id)}, ${s(p1)}, ${s(p2)})`)
    .join(',\n') + '\non conflict (id) do nothing;\n',
)

out.push(
  'insert into tournaments (id, name, location, start_date, end_date, category, status) values',
)
out.push(
  tournaments
    .map(
      (t) =>
        `  (${s(t.id)}, ${s(t.name)}, ${s(t.location)}, ${s(t.startDate)}, ${s(
          t.endDate,
        )}, ${s(t.category)}, ${s(t.status)})`,
    )
    .join(',\n') + '\non conflict (id) do nothing;\n',
)

out.push(
  'insert into matches (id, start_time, tournament_name, round, court, status, sets, team_a_id, team_b_id, winner_team_id) values',
)
out.push(
  matches
    .map(
      (m) =>
        `  (${s(m.id)}, ${s(m.startTime)}, ${s(m.tournamentName)}, ${s(m.round)}, ` +
        `${sn(m.court)}, ${s(m.status)}, ${s(JSON.stringify(m.sets))}::jsonb, ` +
        `${s(m.teamA.id)}, ${s(m.teamB.id)}, ${sn(m.winnerTeamId)})`,
    )
    .join(',\n') + '\non conflict (id) do nothing;\n',
)

out.push('insert into rankings (position, player_id, points, movement) values')
out.push(
  ranking
    .map(
      (r) => `  (${r.position}, ${s(r.player.id)}, ${r.points}, ${r.movement})`,
    )
    .join(',\n') + '\non conflict (position) do nothing;\n',
)

writeFileSync(join(here, 'seed.sql'), out.join('\n'))
console.log(
  `seed.sql generado: ${players.size} jugadores, ${teams.size} parejas, ` +
    `${tournaments.length} torneos, ${matches.length} partidos, ${ranking.length} del ranking.`,
)
