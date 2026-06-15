-- =====================================================================
-- La Bandeja — Esquema de base de datos (Supabase / PostgreSQL)
--
-- Pegá este archivo en el SQL Editor de Supabase y ejecutalo.
-- Crea las tablas, las relaciones y las políticas de LECTURA PÚBLICA
-- (la clave anónima solo puede leer; nadie puede escribir sin service key).
-- Luego ejecutá seed.sql para cargar los datos de ejemplo.
-- =====================================================================

-- Limpieza (orden inverso por las claves foráneas).
drop table if exists rankings cascade;
drop table if exists matches cascade;
drop table if exists tournaments cascade;
drop table if exists teams cascade;
drop table if exists players cascade;

-- Jugadores --------------------------------------------------------------
create table players (
  id      text primary key,
  name    text not null,
  country text not null            -- código ISO de 2 letras (ES, AR, ...)
);

-- Parejas (dos jugadores) ------------------------------------------------
create table teams (
  id         text primary key,
  player1_id text not null references players (id),
  player2_id text not null references players (id)
);

-- Torneos ----------------------------------------------------------------
create table tournaments (
  id         text primary key,
  name       text not null,
  location   text not null,
  start_date date not null,
  end_date   date not null,
  category   text not null,
  status     text not null check (status in ('upcoming', 'ongoing', 'finished'))
);

-- Partidos ---------------------------------------------------------------
create table matches (
  id              text primary key,
  start_time      timestamp not null,           -- hora local del partido
  tournament_name text not null,
  round           text not null,
  court           text,
  status          text not null check (status in ('upcoming', 'live', 'finished')),
  sets            jsonb not null default '[]'::jsonb,  -- [[6,4],[3,6],...]
  team_a_id       text not null references teams (id),
  team_b_id       text not null references teams (id),
  winner_team_id  text references teams (id)
);

create index on matches (start_time);
create index on matches (status);

-- Ranking ----------------------------------------------------------------
create table rankings (
  position  int primary key,
  player_id text not null references players (id),
  points    int not null,
  movement  int not null default 0       -- variación de posición (+ sube)
);

-- =====================================================================
-- Row Level Security: lectura pública, escritura bloqueada
-- =====================================================================
alter table players     enable row level security;
alter table teams       enable row level security;
alter table tournaments enable row level security;
alter table matches     enable row level security;
alter table rankings    enable row level security;

create policy "lectura pública" on players     for select using (true);
create policy "lectura pública" on teams       for select using (true);
create policy "lectura pública" on tournaments for select using (true);
create policy "lectura pública" on matches     for select using (true);
create policy "lectura pública" on rankings    for select using (true);
