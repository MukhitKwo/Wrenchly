export function getRiskColor(risco) {
	if (typeof risco !== "number") return "#ccc";

	if (risco < 0.33) return "green";   // baixo
	if (risco < 0.66) return "orange";  // médio
	return "red";                       // alto
}
