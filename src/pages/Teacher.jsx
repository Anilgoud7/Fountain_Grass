// src/pages/teacher.jsx
import React, { useMemo, useState } from "react";
import { teacherData } from "../data/TeacherData";

// ----------------------------- Styles
const S = {
  wrap: { maxWidth: 1220, margin: "0 auto", padding: 16, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial", color: "#0f172a" },
  card: { background: "#fff", borderRadius: 14, boxShadow: "0 6px 20px rgba(2,6,23,0.06)", padding: 14 },
  small: { fontSize: 12, color: "#475569" },
  kpi: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12 },
  kpiItem: { background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 2px 8px rgba(2,6,23,0.05)" },
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
const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

// ----------------------------- Teacher page
export default function Teacher() {
  const teacher = teacherData;
  const [selectedClassId, setSelectedClassId] = useState(teacher.classes[0]?.id);
  const selectedClass = teacher.classes.find((c) => c.id === selectedClassId) || teacher.classes[0];

  const totalStudents = teacher.classes.reduce((sum, cls) => sum + cls.students.length, 0);
  const avgMastery = useMemo(() => {
    const all = teacher.classes.flatMap((cls) => cls.students.map((s) => s.mastery));
    return avg(all);
  }, [teacher.classes]);

  const atRiskStudents = selectedClass.students.filter((s) => s.mastery < 60);

  const syllabusCompletion = useMemo(() => {
    const totalPlanned = teacher.syllabusProgress.reduce((sum, topic) => sum + topic.planned, 0);
    const totalCovered = teacher.syllabusProgress.reduce((sum, topic) => sum + topic.covered, 0);
    return totalPlanned > 0 ? Math.round((totalCovered / totalPlanned) * 100) : 0;
  }, [teacher.syllabusProgress]);

  return (
    <div style={{ background: "#f7fafc", minHeight: "100vh" }}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Welcome {teacher.user.name}</div>
              <div style={S.small}>
                Teacher Dashboard • {teacher.subject} • {teacher.experience} experience
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#f59e0b" }}>⭐</span>
                <span style={{ fontWeight: 600 }}>{teacher.rating}</span>
              </div>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}
              >
                {teacher.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={S.kpi}>
          <div style={S.kpiItem}>
            <div style={S.small}>Total Students</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{totalStudents}</div>
            <div style={S.small}>Across all classes</div>
          </div>
          <div style={S.kpiItem}>
            <div style={S.small}>Avg Class Mastery</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <Ring value={avgMastery} size={90} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{avgMastery}%</div>
                <div style={S.small}>Overall progress</div>
              </div>
            </div>
          </div>
          <div style={S.kpiItem}>
            <div style={S.small}>Syllabus Progress</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{syllabusCompletion}%</div>
            <Progress value={syllabusCompletion} />
          </div>
          <div style={S.kpiItem}>
            <div style={S.small}>At-risk Students</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{atRiskStudents.length}</div>
            <div style={S.small}>Need attention</div>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12, marginTop: 12 }}>
          {/* Left: Class Management */}
          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Class Management • {selectedClass.name}</div>

            {/* Student Roster */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Student Performance</div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Student</th>
                    <th style={S.th}>Mastery</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.students.map((stu) => (
                    <tr key={stu.id}>
                      <td style={S.td}>{stu.name}</td>
                      <td style={S.td}>
                        <div style={{ width: 120 }}>
                          <Progress value={stu.mastery} />
                        </div>
                      </td>
                      <td style={S.td}>
                        <span
                          style={{
                            ...S.pill,
                            background: stu.mastery >= 70 ? "#dcfce7" : stu.mastery >= 60 ? "#fef3c7" : "#fecaca",
                            color: stu.mastery >= 70 ? "#16a34a" : stu.mastery >= 60 ? "#d97706" : "#dc2626"
                          }}
                        >
                          {stu.mastery >= 70 ? "Good" : stu.mastery >= 60 ? "Average" : "At Risk"}
                        </span>
                      </td>
                      <td style={S.td}>
                        <button style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                          {stu.mastery < 60 ? "Assign Help" : "View Details"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Syllabus Progress */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Syllabus Coverage</div>
              <div style={{ display: "grid", gap: 8 }}>
                {teacher.syllabusProgress.map((topic, idx) => (
                  <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 600 }}>{topic.topic}</div>
                      <div style={S.small}>
                        {topic.covered}/{topic.planned} lessons
                      </div>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <Progress value={(topic.covered / topic.planned) * 100} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={S.small}>Class Mastery: {topic.mastery}%</div>
                      <button style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>Update Progress</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Tools & Activity */}
          <div style={{ display: "grid", gap: 12 }}>
            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📝 Create Assignment</button>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📊 View Analytics</button>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>💬 Message Parents</button>
                <button style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📚 Upload Resources</button>
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>At-Risk Students</div>
              {atRiskStudents.length === 0 ? (
                <div style={S.small}>No students at risk 🎉</div>
              ) : (
                <div style={{ display: "grid", gap: 6 }}>
                  {atRiskStudents.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid #fee2e2",
                        background: "#fef2f2",
                        padding: 8,
                        borderRadius: 10
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={S.small}>Mastery: {s.mastery}%</div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 11 }}>Remedial</button>
                        <button style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 11 }}>1-on-1</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent Activity</div>
              <div style={{ display: "grid", gap: 6 }}>
                {teacher.recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, background: "#f8fafc" }}
                  >
                    <div style={{ fontSize: 13 }}>{activity.activity}</div>
                    <div style={{ ...S.small, fontSize: 11 }}>{activity.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 16, color: "#94a3b8", fontSize: 12 }}>
          Teacher Dashboard • AI Tech School • Attendance removed
        </div>
      </div>
    </div>
  );
}
