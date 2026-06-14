/**
 * Convierte un código de país ISO de 2 letras en su emoji de bandera.
 * Ej: "ES" -> 🇪🇸. Si el código no es válido devuelve cadena vacía.
 */
export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return ''
  const base = 0x1f1e6 // código del regional indicator 'A'
  const chars = code
    .toUpperCase()
    .split('')
    .map((c) => base + (c.charCodeAt(0) - 65))
  return String.fromCodePoint(...chars)
}
