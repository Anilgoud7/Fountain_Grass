export const S = {
app: { fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial", background: "#f7fafc", color: "#0f172a", minHeight: "100vh" },
wrap: { maxWidth: 1220, margin: "0 auto", padding: 16 },
top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
small: { fontSize: 12, color: "#475569" },
card: { background: "#fff", borderRadius: 14, boxShadow: "0 6px 20px rgba(2,6,23,0.06)", padding: 14 },
kpi: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
kpiItem: { background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 2px 8px rgba(2,6,23,0.05)" },
table: { width: "100%", borderCollapse: "collapse" },
th: { textAlign: "left", fontSize: 12, color: "#64748b", padding: 8, borderBottom: "1px solid #e2e8f0" },
td: { padding: 8, borderBottom: "1px solid #f1f5f9", fontSize: 13 },
pill: { display: "inline-block", padding: "4px 8px", background: "#eef2ff", borderRadius: 999, fontSize: 12 },
roleBtn: (active) => ({ padding: "8px 12px", borderRadius: 999, border: "1px solid #e2e8f0", background: active ? "#1d4ed8" : "#fff", color: active ? "#fff" : "#0f172a", cursor: "pointer" }),
};