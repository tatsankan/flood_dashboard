export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `฿${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `฿${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `฿${(value / 1_000).toFixed(0)}K`;
  }
  return `฿${value.toFixed(0)}`;
}

export function formatCurrencyFull(value: number): string {
  return `฿${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value).toFixed(decimals)}%`;
}

export function formatProbability(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function formatDepth(cm: number): string {
  return `${cm} cm`;
}

export function formatDuration(hours: number): string {
  return `${hours} hrs`;
}

export function formatScore(score: number): string {
  return `${score}/100`;
}
