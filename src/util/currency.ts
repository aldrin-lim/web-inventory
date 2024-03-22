export function formatToPeso(number: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0, // Minimum number of decimal places to show
    maximumFractionDigits, // Maximum number of decimal places to show
  }).format(number)
}
