// src/pages/Syllabus.jsx
import React, { useMemo, useState } from "react";
import { THEME, Card, Tag, Button } from "../components/ui";
import { syllabusDataFor, SUBJECT_KEYS } from "../data/syllabusData";

export default function Syllabus({ activeSubject }) {
  // Accepts a string ("Physics"/"Mathematics"/"Biology") or an object with .name
  const initialSubject =
    typeof activeSubject === "string"
      ? activeSubject
      : activeSubject?.name || "Physics";

  const [subject, setSubject] = useState(initialSubject);

  const { subjectTitle, units } = useMemo(
    () => syllabusDataFor(subject),
    [subject]
  );

  const [openUnits, setOpenUnits] = useState({});
  const [openChapters, setOpenChapters] = useState({});
  const [query, setQuery] = useState("");

  function toggleUnit(id) {
    setOpenUnits((s) => ({ ...s, [id]: !s[id] }));
  }
  function toggleChapter(id) {
    setOpenChapters((s) => ({ ...s, [id]: !s[id] }));
  }

  const filteredUnits = useMemo(() => {
    if (!query.trim()) return units;
    const q = query.toLowerCase();
    return units
      .map((u) => {
        const chapters = u.chapters
          .map((ch) => {
            const concepts = (ch.concepts || []).filter((c) =>
              c.name.toLowerCase().includes(q)
            );
            const chMatch =
              ch.name.toLowerCase().includes(q) || concepts.length > 0;
            return chMatch ? { ...ch, concepts } : null;
          })
          .filter(Boolean);
        const unitMatch = u.name.toLowerCase().includes(q) || chapters.length > 0;
        return unitMatch ? { ...u, chapters } : null;
      })
      .filter(Boolean);
  }, [units, query]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="My Syllabus"
        subtitle="Units → Chapters → Concepts"
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concept/chapter/unit…"
              style={{
                border: `1px solid ${THEME.border}`,
                borderRadius: 10,
                padding: "8px 10px",
                outline: "none",
                width: 220,
              }}
            />
          </div>
        }
      >
        {/* Subject tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {SUBJECT_KEYS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSubject(s);
                setQuery("");
                setOpenUnits({});
                setOpenChapters({});
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: `1px solid ${THEME.border}`,
                background: subject === s ? THEME.primary : "#fff",
                color: subject === s ? "#fff" : THEME.text,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {!filteredUnits?.length ? (
          <div style={{ color: THEME.subtext }}>
            No syllabus found for this subject.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {subjectTitle} — Class 10
            </div>

            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                style={{
                  padding: 10,
                  background: "#fff",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 10,
                }}
              >
                <div
                  onClick={() => toggleUnit(unit.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  <div>
                    {unit.name}
                    <span style={{ color: THEME.subtext, marginLeft: 8, fontWeight: 500 }}>
                      ({unit.chapters.length} chapters)
                    </span>
                  </div>
                  <span style={{ color: THEME.subtext }}>
                    {openUnits[unit.id] ? "▾" : "▸"}
                  </span>
                </div>

                {openUnits[unit.id] && (
                  <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                    {unit.chapters.map((ch) => (
                      <div
                        key={ch.id}
                        style={{
                          padding: "8px 10px",
                          border: `1px dashed ${THEME.border}`,
                          borderRadius: 10,
                          background: "#fafafa",
                        }}
                      >
                        <div
                          onClick={() => toggleChapter(ch.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          <div>
                            {ch.name}
                            <span
                              style={{
                                color: THEME.subtext,
                                marginLeft: 8,
                                fontWeight: 500,
                              }}
                            >
                              ({(ch.concepts || []).length} concepts)
                            </span>
                          </div>
                          <span style={{ color: THEME.subtext }}>
                            {openChapters[ch.id] ? "▾" : "▸"}
                          </span>
                        </div>

                        {openChapters[ch.id] && (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              marginTop: 8,
                            }}
                          >
                            {(ch.concepts || []).map((c) => (
                              <Tag key={c.id} tone="info">
                                {c.name}
                              </Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
