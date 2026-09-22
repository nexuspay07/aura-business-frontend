export const windows = [["24h", "24 hours"], ["7d", "7 days"], ["30d", "30 days"]];

export function formatNumber(value) { return new Intl.NumberFormat().format(value ?? 0); }
export function formatDate(value, withTime = false) { return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", ...(withTime ? { timeStyle: "short" } : {}), timeZone: "UTC" }).format(new Date(value)) : "Never"; }
export function formatLatency(value) { if (value == null) return "Unavailable"; return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`; }
