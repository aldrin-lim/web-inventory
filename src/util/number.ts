import Big from 'big.js'

export function sanitizeNaN(x: number) {
  if (isNaN(x)) {
    return 0
  }
  return x
}

export function toNumber(x: unknown) {
  // Parse string to number
  // If NaN return 0
  return sanitizeNaN(Number(x))
}

export const computeProfitPercentage = (price: number, cost: number) => {
  const profitAmount = new Big(price).minus(cost)
  try {
    const profitPercentage = profitAmount.div(cost).times(100).toNumber()
    return profitPercentage
  } catch (error) {
    return 0
  }
}

export const computeProfitAmount = (price: number, cost: number) => {
  const profitAmount = new Big(price).minus(cost).toNumber()

  return profitAmount
}

export const profitPercentageColor = (amount: string | number) => {
  const amountNumber = toNumber(amount)
  if (amountNumber > 0) {
    return 'text-green-500'
  } else if (amountNumber < 0) {
    return 'text-red-500'
  }
  return ''
}
