export function getRiskColor(risco) {
  if (typeof risco !== "number") return "#999999";

  if (risco <= 0) return "#00cc00";        // very low
  if (risco <= 0.5) return "#66cc00";      // low
  if (risco <= 0.75) return "#cccc00";     // medium
  if (risco <= 0.85) return "#cc6600";     // high
  if (risco <= 1) return "#cc0000";        // very high
  return "#660000";                        // extreme (>1)
}
