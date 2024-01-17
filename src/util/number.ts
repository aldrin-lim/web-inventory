export function sanitizeNaN(x: number) {
  if (isNaN(x)) {
    return 0
  }
  return x
}

export function toNumber(x: string | undefined | null) {
  // Parse string to number
  // If NaN return 0
  return sanitizeNaN(Number(x))
}
