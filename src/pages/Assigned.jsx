// src/pages/Assigned.jsx
import React from "react";
import { THEME, Card, Button, Tag } from "../components/ui";
import { assignedDataFor } from "../data/assignedData";

const SUBTABS = ["MCQs", "Flashcards", "Interview"];
const SOURCES = ["Teacher", "Parent"];

export default function Assigned({ activeSubject }) {
  const [subtab, setSubtab] = React.useState("MCQs");
  const [source, setSource] = React.useState("Teacher");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setItems(assignedDataFor(activeSubject, subtab, source));
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [activeSubject?.id, activeSubject?.name, subtab, source]);

  return (
    <Card
      title="Assignments"
      subtitle={`${source} → ${subtab}`}
      right={
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Source toggle */}
          <div style={{ display: "flex", gap: 6, padding: 4, border: `1px solid ${THEME.border}`, borderRadius: 999 }}>
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                aria-pressed={source === s}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background: source === s ? THEME.primary : "transparent",
                  color: source === s ? "#fff" : THEME.text,
                  fontWeight: 600,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Subtabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {SUBTABS.map((k) => (
              <Button key={k} variant={subtab === k ? "primary" : "soft"} onClick={() => setSubtab(k)}>
                {k}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      {loading ? (
        <div style={{ color: THEME.subtext }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: THEME.subtext }}>No assignments yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((a) => (
            <div
              key={a.id}
              style={{
                padding: 10,
                background: "#fff",
                border: `1px solid ${THEME.border}`,
                borderRadius: 12,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: THEME.subtext }}>
                  {a.count || 0} items {a.due_at ? `• Due ${new Date(a.due_at).toLocaleString()}` : ""}
                </div>
                {a.note ? (
                  <div style={{ marginTop: 4, fontSize: 12, color: THEME.subtext }}>
                    <em>{a.note}</em>
                  </div>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag tone={a.status === "Completed" ? "success" : a.status === "Overdue" ? "warn" : "info"}>
                  {a.status || "Assigned"}
                </Tag>
                <Button variant="soft" onClick={() => alert("Open assignment player…")}>Start</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
