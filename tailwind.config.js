/** @type {import('tailwindcss').Config} */
export default {
  // Archivos donde Tailwind buscará clases para generar el CSS final.
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oscura propia, inspirada en Promiedos.
        ink: {
          900: '#0d0f12', // fondo general
          800: '#14171c', // tarjetas / secciones
          700: '#1c2026', // filas / hover
          600: '#272c34', // bordes
        },
        accent: {
          DEFAULT: '#3ad17a', // verde "padel"
          dim: '#2aa45f',
        },
        live: '#ff4d4d', // estado en vivo
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
