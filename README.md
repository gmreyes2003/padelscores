# 🎾 PadelScores

Aplicación web responsive de resultados de **pádel**, inspirada en
[Promiedos](https://www.promiedos.com.ar/). Muestra partidos en vivo, próximos
encuentros, resultados recientes, ranking mundial y torneos — todo en una sola
pantalla, con diseño oscuro, minimalista y rápido.

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
    │   └── padelApi.ts       # Capa de datos (mock → API real)
    ├── hooks/
    │   └── usePadelData.ts   # Hook de carga de datos (loading / error)
    ├── utils/
    │   ├── matchUtils.ts     # Filtros y helpers de partidos
    │   └── flag.ts           # Código de país → emoji de bandera
    └── components/           # Componentes reutilizables
        ├── Header.tsx
        ├── Section.tsx
        ├── StatusBadge.tsx
        ├── MatchRow.tsx
        ├── MatchList.tsx
        ├── RankingTable.tsx
        └── TournamentList.tsx
```

## 🔌 Conectar una API real

La UI nunca importa los JSON directamente: todo pasa por
[`src/services/padelApi.ts`](src/services/padelApi.ts). Para usar datos reales:

1. Creá un archivo `.env` en la raíz:

   ```env
   VITE_API_BASE_URL=https://tu-api-de-padel.com
   ```

2. En `padelApi.ts`, reemplazá el cuerpo de `fetchMatches`, `fetchRanking` y
   `fetchTournaments` por llamadas `fetch` al endpoint correspondiente,
   manteniendo los tipos de retorno (`Match[]`, `RankingEntry[]`,
   `Tournament[]`). Por ejemplo:

   ```ts
   export async function fetchMatches(): Promise<Match[]> {
     const res = await fetch(`${API_BASE_URL}/matches`)
     return res.json()
   }
   ```

3. (Opcional) En [`src/App.tsx`](src/App.tsx), cambiá la constante
   `REFERENCE_DATE` por `new Date()` para que "Partidos de Hoy" use la fecha
   real, y considerá agregar *polling* llamando a `reload()` cada N segundos
   desde el hook `usePadelData`.

> Los datos incluidos son ficticios y con fines de demostración.
