# 🎾 La Bandeja

Aplicación web responsive de resultados de **pádel**, inspirada en
[Promiedos](https://www.promiedos.com.ar/). Muestra partidos en vivo, próximos
encuentros, resultados recientes, ranking mundial y torneos — todo en una sola
pantalla, con diseño oscuro, minimalista y rápido.

Navegá por **fecha** con el calendario (toda la página se filtra según el día),
filtrá las tablas y entrá al **detalle** de cualquier partido o jugador con un
click.

![stack](https://img.shields.io/badge/React-18-149eca) ![stack](https://img.shields.io/badge/TypeScript-5-3178c6) ![stack](https://img.shields.io/badge/Vite-5-646cff) ![stack](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## ✨ Características

- **Diseño minimalista** de fondo oscuro, denso en contenido y con poco espacio
  desperdiciado (estilo Promiedos).
- **Sin animaciones innecesarias** (solo un indicador "en vivo" sutil).
- **Responsive**: una columna en móvil, tres columnas en desktop.
- **Sin login ni registro**.
- **Datos mock en JSON** desacoplados mediante una capa de servicio, lista para
  conectar una API real sin tocar la UI.
- **Componentes reutilizables** y código comentado en español.

## 🗂️ Secciones

1. **Partidos de Hoy** — hora, Pareja A vs Pareja B, resultado y estado
   (Finalizado / En juego / Próximo).
2. **Resultados Recientes** — últimos 20 partidos finalizados.
3. **Próximos Partidos** — agenda de los próximos días.
4. **Ranking Mundial** — posición, jugador, país, variación y puntos.
5. **Torneos** — nombre, categoría, fechas y estado.

## 🛠️ Tecnología

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como bundler/dev server
- [Tailwind CSS](https://tailwindcss.com/) para los estilos
- [Supabase](https://supabase.com/) (PostgreSQL) como base de datos, con
  respaldo a datos mock

## 🚀 Ejecución local

Requisitos: **Node.js 18+** y **npm**.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

Luego abrí la URL que muestra la consola (por defecto
`http://localhost:5173`).

### Otros scripts

```bash
npm run build     # Compila TypeScript y genera el build de producción en dist/
npm run preview   # Sirve localmente el build de producción
```

## 📁 Estructura de carpetas

```
Promiedos padel/
├── index.html                # HTML raíz
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── public/
│   └── favicon.svg
├── supabase/                 # Base de datos
│   ├── schema.sql            # Tablas + RLS (lectura pública)
│   ├── seed.sql              # Datos de ejemplo (generado)
│   └── generate-seed.mjs     # Genera seed.sql desde los JSON
└── src/
    ├── main.tsx              # Punto de entrada
    ├── App.tsx               # Layout principal (ensambla las secciones)
    ├── index.css             # Estilos base + Tailwind
    ├── vite-env.d.ts
    ├── types/
    │   └── index.ts          # Tipos de dominio (Match, Team, Ranking, etc.)
    ├── data/                 # Datos mock en JSON
    │   ├── matches.json
    │   ├── ranking.json
    │   └── tournaments.json
    ├── services/
    │   ├── padelApi.ts       # Capa de datos (Supabase con respaldo a mock)
    │   └── supabaseClient.ts # Cliente de Supabase (lee credenciales del .env)
    ├── hooks/
    │   └── usePadelData.ts   # Hook de carga de datos (loading / error / polling)
    ├── context/
    │   └── NavigationContext.tsx  # Navegación a vistas de detalle
    ├── utils/
    │   ├── matchUtils.ts     # Filtros y helpers de partidos / fechas
    │   └── flag.ts           # Código de país → emoji de bandera
    └── components/           # Componentes reutilizables
        ├── Header.tsx
        ├── DateNavigator.tsx       # Calendario: filtra la página por día
        ├── Section.tsx
        ├── StatusBadge.tsx
        ├── MatchStatusFilter.tsx   # Chips de filtro por estado
        ├── MatchRow.tsx
        ├── MatchList.tsx
        ├── MatchDetail.tsx         # Vista de detalle de partido
        ├── PlayerDetail.tsx        # Vista de detalle de jugador
        ├── RankingTable.tsx        # Tabla con buscador
        └── TournamentList.tsx
```

## 🗄️ Base de datos (Supabase)

La app puede leer los datos desde **Supabase** (PostgreSQL gestionado). La UI
nunca conoce el origen: todo pasa por
[`src/services/padelApi.ts`](src/services/padelApi.ts), que lee de Supabase si
hay credenciales y, si no, usa los JSON mock como respaldo.

### Puesta en marcha

1. Creá un proyecto gratis en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, ejecutá en orden:
   - [`supabase/schema.sql`](supabase/schema.sql) — crea las tablas y las
     políticas de **lectura pública** (RLS).
   - [`supabase/seed.sql`](supabase/seed.sql) — carga los datos de ejemplo.
3. En **Project Settings → API**, copiá la *Project URL* y la *anon public key*.
4. Creá un `.env` en la raíz (basate en [`.env.example`](.env.example)):

   ```env
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-public-key
   ```

5. Reiniciá `npm run dev`. La app ahora lee de la base.

> Para el deploy en Vercel, cargá esas dos variables en
> **Project → Settings → Environment Variables**.

### Cargar / editar datos

Con la opción **solo lectura**, los registros se administran desde el
**Table Editor** de Supabase. La `anon key` solo permite `SELECT`; escribir
requiere la *service key* (que nunca va en el front).

### Modelo de datos

`players` ← `teams` (pareja de 2 jugadores) ← `matches`; `rankings` y
`tournaments` son independientes. El seed se genera desde los JSON con
[`supabase/generate-seed.mjs`](supabase/generate-seed.mjs)
(`node supabase/generate-seed.mjs`).

### Usar la fecha real

En [`src/App.tsx`](src/App.tsx), la constante `TODAY` está fijada al día de los
datos de ejemplo. Con datos reales, cambiala por `new Date()`.

> Los datos de ejemplo son ficticios y con fines de demostración.
