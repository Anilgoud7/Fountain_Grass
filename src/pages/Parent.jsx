// src/pages/parents.jsx
import React, { useMemo, useState } from "react";
import { parentData } from "../data/parentData";

// ----------------------------- Styles
const S = {
  page: { background: "#f7fafc", minHeight: "100vh", color: "#0f172a" },
  wrap: { maxWidth: 1220, margin: "0 auto", padding: 16, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial" },
  card: { background: "#fff", borderRadius: 14, boxShadow: "0 6px 20px rgba(2,6,23,0.06)", padding: 14 },
  small: { fontSize: 12, color: "#475569" },
  kpi: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12 },
  kpiItem: { background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 2px 8px rgba(2,6,23,0.05)" },
  gridMain: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12, marginTop: 12 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 12, color: "#64748b", padding: 8, borderBottom: "1px solid #e2e8f0" },
  td: { padding: 8, borderBottom: "1px solid #f1f5f9", fontSize: 13 },
  pill: { display: "inline-block", padding: "4px 8px", background: "#eef2ff", borderRadius: 999, fontSize: 12 }
};

// ----------------------------- UI atoms
function Progress({ value }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div style={{ background: "#eef2ff", height: 10, borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: 10, background: "#1d4ed8" }} />
    </div>
  );
}

function Ring({ value, size }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = Math.floor((size - 12) / 2);
  const c = Math.floor(size / 2);
  const circ = 2 * Math.PI * r;
  const dash = Math.round((pct / 100) * circ);
  const rest = circ - dash;
  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={r} stroke="#e2e8f0" strokeWidth="10" fill="none" />
      <circle
        cx={c}
        cy={c}
        r={r}
        stroke="#6366f1"
        strokeWidth="10"
        fill="none"
        strokeDasharray={dash + " " + rest}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
      />
      <text x={c} y={c + 4} textAnchor="middle" fontSize="14" fontWeight="700">
        {pct + "%"}
      </text>
    </svg>
  );
}

// ----------------------------- Helpers
const entries = (obj) => Object.entries(obj || {});
const toSubjectList = (radar) => entries(radar).map(([name, mastery]) => ({ name, mastery }));

// ----------------------------- Parent Page
export default function Parents() {
  const { user, children } = parentData;
  const [childId, setChildId] = useState(children[0]?.id);
  const child = children.find((c) => c.id === childId) || children[0];

  const subjects = useMemo(() => toSubjectList(child.radar), [child]);

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{user.name}</div>
              <div style={S.small}>Parent Admin • Track progress & get alerts</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}
              >
                {children.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
              <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Download Report</button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={S.kpi}>
          <div style={S.kpiItem}>
            <div style={S.small}>Overall Mastery</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <Ring value={child.mastery} size={90} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{child.mastery}%</div>
                <div style={S.small}>Across subjects</div>
              </div>
            </div>
          </div>
          <div style={S.kpiItem}>
            <div style={S.small}>Pending Alerts</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{child.alerts.length}</div>
            <div style={S.small}>Homework / Study</div>
          </div>
          <div style={S.kpiItem}>
            <div style={S.small}>Weekly Study Streak</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{Math.floor(child.mastery / 10)} days</div>
            <div style={S.small}>Estimated</div>
          </div>
          <div style={S.kpiItem}>
            <div style={S.small}>Next PTM</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginTop: 6 }}>Not scheduled</div>
            <button style={{ marginTop: 6, padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Schedule PTM</button>
          </div>
        </div>

        {/* Main */}
        <div style={S.gridMain}>
          {/* Left: Subject Mastery & Digest */}
          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Subject Mastery</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {subjects.map((s) => (
                <div key={s.name} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={S.small}>{s.mastery}%</div>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <Progress value={s.mastery} />
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #e2e8f0" }}>View Topics</button>
                    <button style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Assign Practice</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Weekly Digest</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {child.digest.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Alerts & Quick Actions */}
          <div style={{ display: "grid", gap: 12 }}>
            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Alerts</div>
              {child.alerts.length === 0 ? (
                <div style={S.small}>No alerts 🎉</div>
              ) : (
                child.alerts.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #fee2e2",
                      background: "#fef2f2",
                      padding: 8,
                      borderRadius: 10,
                      marginBottom: 6
                    }}
                  >
                    <div>{a}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Acknowledge</button>
                      <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Message Teacher</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📄 View Report Card</button>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>🧠 Practice Weak Topics</button>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📅 Book Doubt Session</button>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>💬 Chat with Mentor</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, color: "#94a3b8", fontSize: 12 }}>Parent Admin • AI Tech School • Attendance removed</div>
      </div>
    </div>
  );
}
