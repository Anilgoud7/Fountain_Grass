// src/pages/Assignments.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  THEME,
  Card,
  Button,
  Tag,
  Divider,
  SectionTitle,
  Input,
} from "../components/ui";

/* ------------------- API + helpers ------------------- */
const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8000";

function getCSRFToken() {
  const m = document.cookie.match(/csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

async function jsonFetch(url, opts = {}) {
  const { method = "GET", body, headers = {}, ...rest } = opts;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(method !== "GET" ? { "X-CSRFToken": getCSRFToken() } : {}),
      ...headers,
    },
    ...(body ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
    method,
    ...rest,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text || "Request failed"}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}

function mapDifficultyForAPI(uiValue) {
  const v = String(uiValue || "").toLowerCase();
  if (v === "easy") return "EASY";
  if (v === "medium") return "MEDIUM";
  if (v === "hard") return "HARD";
  return "ALL"; // Mixed → list w/o filter; when generating we'll use MEDIUM
}

/* -- generation/list endpoints (aligned with SelfAssess) -- */
async function generateMCQsAPI({ topic_title, n = 10, difficulty = "MEDIUM" }) {
  return jsonFetch(`${API_BASE}/api/topics/mcqs/generate/`, {
    method: "POST",
    body: { topic: topic_title, n, difficulty },
  });
}
async function generateFlashcardsAPI({ topic_title, n = 10, difficulty = "MEDIUM" }) {
  return jsonFetch(`${API_BASE}/api/topics/flashcards/generate/`, {
    method: "POST",
    body: { topic: topic_title, n, difficulty },
  });
}
async function generateInterviewsAPI({ topic_title, n = 10, difficulty = "MEDIUM" }) {
  return jsonFetch(`${API_BASE}/api/topics/interviews/generate/`, {
    method: "POST",
    body: { topic: topic_title, n, difficulty },
  });
}

async function listMCQsAPI({ topic_title, difficulty = "ALL", limit = 50 }) {
  const params = new URLSearchParams({ topic: topic_title });
  if (difficulty !== "ALL") params.append("difficulty", difficulty);
  params.append("page_size", String(limit));
  const data = await jsonFetch(`${API_BASE}/api/topics/mcqs/?${params.toString()}`);
  return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
}
async function listFlashcardsAPI({ topic_title, difficulty = "ALL", limit = 50 }) {
  const params = new URLSearchParams({ topic: topic_title });
  if (difficulty !== "ALL") params.append("difficulty", difficulty);
  params.append("page_size", String(limit));
  const data = await jsonFetch(`${API_BASE}/api/topics/flashcards/?${params.toString()}`);
  return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
}
async function listInterviewsAPI({ topic_title, difficulty = "ALL", limit = 50 }) {
  const params = new URLSearchParams({ topic: topic_title });
  if (difficulty !== "ALL") params.append("difficulty", difficulty);
  params.append("page_size", String(limit));
  const data = await jsonFetch(`${API_BASE}/api/topics/interviews/?${params.toString()}`);
  return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
}

/* -- assignments endpoint -- */
async function createAssignmentAPI(payload) {
  // expected: { title, description?, due_at?, items:[{type:"MCQ"|"FLASH"|"INT", id:string}], class_id?, student_ids? }
  return jsonFetch(`${API_BASE}/api/assignments/create/`, {
    method: "POST",
    body: payload,
  });
}

/* ------------------- Normalizers (same spirit as SelfAssess) ------------------- */
const firstNonEmpty = (...vals) =>
  vals.find((v) => (v == null ? "" : String(v)).trim().length > 0);

const normalizeTopicTitle = (x) => {
  if (!x) return "";
  if (typeof x === "string") return x;
  return x.name || x.title || x.topic || x.topic_title || "";
};

function normalizeMCQItem(raw, idx = 0) {
  const id = raw.id || raw.uuid || raw.pk || raw._id || raw.question_id || `mcq_${idx}`;
  return {
    id,
    prompt: firstNonEmpty(raw.prompt, raw.question, raw.question_text, raw.stem, raw.text, "(untitled question)"),
    topic: normalizeTopicTitle(raw.topic),
    difficulty: raw.difficulty || raw.level || "MEDIUM",
    options: Array.isArray(raw.options) ? raw.options.map(String) : [],
    correct_answers: Array.isArray(raw.correct_answers) ? raw.correct_answers : [],
    explanation: raw.explanation || "",
    _raw: raw,
  };
}

function normalizeTextItem(raw, idx, prefix) {
  return {
    id: raw.id || raw.uuid || raw.pk || `${prefix}_${idx}`,
    prompt: firstNonEmpty(raw.prompt, raw.question, raw.text, "(untitled)"),
    topic: normalizeTopicTitle(raw.topic),
    difficulty: raw.difficulty || "MEDIUM",
    _raw: raw,
  };
}

/* ------------------- Small UI bits ------------------- */
const TopicChip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      border: `1px solid ${active ? THEME.primary : THEME.border}`,
      background: active ? THEME.primarySoft : "#fff",
      color: active ? THEME.primary : THEME.text,
      padding: "6px 10px",
      borderRadius: 999,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

/* Cards styled like SelfAssess, but with a single checkbox to select the item */
function MCQSelectableCard({ q, checked, onToggle }) {
  return (
    <div
      style={{
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        background: "#fff",
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontWeight: 600 }}>{q.prompt}</div>
        <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={checked} onChange={onToggle} />
          Select
        </label>
      </div>

      {!!q.topic && (
        <div style={{ fontSize: 12, color: THEME.subtext }}>{q.topic}</div>
      )}

      {Array.isArray(q.options) && q.options.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {q.options.map((opt, i) => (
            <li key={i} style={{ marginBottom: 2 }}>{opt}</li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 4 }}>
        <Tag>{q.difficulty || "MEDIUM"}</Tag>
      </div>
    </div>
  );
}

function TextSelectableCard({ q, checked, onToggle }) {
  return (
    <div
      style={{
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        background: "#fff",
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontWeight: 600 }}>{q.prompt}</div>
        <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={checked} onChange={onToggle} />
          Select
        </label>
      </div>
      {!!q.topic && (
        <div style={{ fontSize: 12, color: THEME.subtext }}>{q.topic}</div>
      )}
      <div style={{ marginTop: 4 }}>
        <Tag>{q.difficulty || "MEDIUM"}</Tag>
      </div>
    </div>
  );
}

/* ------------------- Main component ------------------- */
export default function AssignmentsPage(props) {
  const outlet = (typeof useOutletContext === "function" ? useOutletContext() : {}) || {};
  const activeSubject = props.activeSubject || outlet.activeSubject || null;

  // topic filters
  const [topicQuery, setTopicQuery] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // generation/list settings
  const [difficulty, setDifficulty] = useState("Mixed");
  const [countEach, setCountEach] = useState(10);
  const apiDiff = mapDifficultyForAPI(difficulty);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("MCQ"); // MCQ | FLASH | INT

  // loaded content
  const [mcqs, setMcqs] = useState([]);
  const [flash, setFlash] = useState([]);
  const [ints, setInts] = useState([]);

  // selection for assignment
  const [selMCQ, setSelMCQ] = useState({});
  const [selFLASH, setSelFLASH] = useState({});
  const [selINT, setSelINT] = useState({});

  // assignment meta
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [classId, setClassId] = useState(""); // optional
  const [studentIds, setStudentIds] = useState(""); // optional comma-separated

  // subject change → reset (with safe fallback topics)
  useEffect(() => {
    const pre = Array.isArray(activeSubject?.topics)
      ? activeSubject.topics
      : [
          { id: "t1", name: "Light" },
          { id: "t2", name: "Motion" },
          { id: "t3", name: "Work & Energy" },
        ];
    setTopics(pre);
    setSelectedIds([]);
    setMcqs([]); setFlash([]); setInts([]);
    setSelMCQ({}); setSelFLASH({}); setSelINT({});
    setTitle(""); setDueAt(""); setClassId(""); setStudentIds("");
    setTab("MCQ");
  }, [activeSubject?.id]); // eslint-disable-line

  const topicList = useMemo(
    () => (topics || []).filter((t) => (t.name || "").toLowerCase().includes(topicQuery.toLowerCase())),
    [topics, topicQuery]
  );

  const toggleTopic = (id) =>
    setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const selectedTopicTitles = () => {
    const sel = (topics || []).filter((t) => selectedIds.includes(t.id));
    if (!sel.length) {
      alert("Pick topics first.");
      return [];
    }
    return sel.map((t) => t.name);
  };

  /* ------------------- generate & list helpers (like SelfAssess) ------------------- */
  async function generateAndList(kind) {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      for (const tt of titles) {
        const common = { topic_title: tt, n: countEach, difficulty: apiDiff === "ALL" ? "MEDIUM" : apiDiff };
        if (kind === "MCQ") await generateMCQsAPI(common);
        if (kind === "FLASH") await generateFlashcardsAPI(common);
        if (kind === "INT") await generateInterviewsAPI(common);
      }
      await listOnly(kind, true);
    } catch (e) {
      alert(`Generate ${kind} failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function listOnly(kind, setActiveTab = false) {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      const all = [];
      for (const tt of titles) {
        if (kind === "MCQ") {
          const list = await listMCQsAPI({ topic_title: tt, difficulty: apiDiff, limit: countEach });
          const normalized = list.map((item, i) => normalizeMCQItem(item, i));
          all.push(...normalized);
        } else if (kind === "FLASH") {
          const list = await listFlashcardsAPI({ topic_title: tt, difficulty: apiDiff, limit: countEach });
          all.push(...list.map((raw, i) => normalizeTextItem(raw, i, "flash")));
        } else if (kind === "INT") {
          const list = await listInterviewsAPI({ topic_title: tt, difficulty: apiDiff, limit: countEach });
          all.push(...list.map((raw, i) => normalizeTextItem(raw, i, "int")));
        }
      }
      if (kind === "MCQ") setMcqs(all.slice(0, countEach));
      if (kind === "FLASH") setFlash(all.slice(0, countEach));
      if (kind === "INT") setInts(all.slice(0, countEach));
      if (setActiveTab) setTab(kind);
    } catch (e) {
      alert(`Load ${kind} failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  /* ------------------- assign ------------------- */
  function gatherSelectedItems() {
    const mcqItems = mcqs.filter((q) => selMCQ[q.id]).map((q) => ({ type: "MCQ", id: q.id }));
    const flItems = flash.filter((q) => selFLASH[q.id]).map((q) => ({ type: "FLASH", id: q.id }));
    const intItems = ints.filter((q) => selINT[q.id]).map((q) => ({ type: "INT", id: q.id }));
    return [...mcqItems, ...flItems, ...intItems];
  }

  async function handleAssign() {
    const items = gatherSelectedItems();
    if (!items.length) {
      alert("Select at least one item to assign.");
      return;
    }
    const payload = {
      title: title || "Practice Set",
      description: `Auto-created from Assignments page (${items.length} items)`,
      due_at: dueAt || null,
      items,
      class_id: classId || null,
      student_ids: (studentIds || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      subject_id: activeSubject?.id || null,
    };
    try {
      await createAssignmentAPI(payload);
      alert("Assignment created!");
      setSelMCQ({}); setSelFLASH({}); setSelINT({});
    } catch (e) {
      alert(`Create assignment failed: ${e.message}`);
    }
  }

  /* ------------------- render ------------------- */
  return (
    <Card
      title="Assignments"
      subtitle="Generate or load content by topic • Select items • Assign to class or students"
      right={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setTab("MCQ")}
            style={{
              border: `1px solid ${tab === "MCQ" ? THEME.primary : THEME.border}`,
              background: tab === "MCQ" ? THEME.primarySoft : "#fff",
              color: tab === "MCQ" ? THEME.primary : THEME.text,
              borderRadius: 999,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            MCQs ({mcqs.length})
          </button>
          <button
            onClick={() => setTab("FLASH")}
            style={{
              border: `1px solid ${tab === "FLASH" ? THEME.primary : THEME.border}`,
              background: tab === "FLASH" ? THEME.primarySoft : "#fff",
              color: tab === "FLASH" ? THEME.primary : THEME.text,
              borderRadius: 999,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Flashcards ({flash.length})
          </button>
          <button
            onClick={() => setTab("INT")}
            style={{
              border: `1px solid ${tab === "INT" ? THEME.primary : THEME.border}`,
              background: tab === "INT" ? THEME.primarySoft : "#fff",
              color: tab === "INT" ? THEME.primary : THEME.text,
              borderRadius: 999,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Interview ({ints.length})
          </button>
        </div>
      }
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* picker + settings */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <div>
            <SectionTitle>Topics</SectionTitle>
            <Input
              placeholder="Filter topics..."
              value={topicQuery}
              onChange={setTopicQuery}
              style={{ width: 250, fontSize: 13, padding: "4px 8px" }}
            />
            <Divider />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {topicList.map((t) => (
                <TopicChip key={t.id} active={selectedIds.includes(t.id)} onClick={() => toggleTopic(t.id)}>
                  {t.name}
                </TopicChip>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>Settings</SectionTitle>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Difficulty</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Easy", "Medium", "Hard", "Mixed"].map((d) => {
                    const active = difficulty === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        style={{
                          border: `1px solid ${active ? THEME.primary : THEME.border}`,
                          background: active ? THEME.primarySoft : "#fff",
                          color: active ? THEME.primary : THEME.text,
                          padding: "6px 10px",
                          borderRadius: 999,
                          cursor: "pointer",
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Count per type</div>
                <Input
                  type="number"
                  value={countEach}
                  onChange={(v) => setCountEach(Math.max(1, Number(v) || 10))}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button variant="soft" onClick={() => generateAndList("MCQ")} disabled={busy}>
                    Generate MCQs
                  </Button>
                  <Button variant="ghost" onClick={() => listOnly("MCQ", true)} disabled={busy}>
                    Load MCQs
                  </Button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button variant="soft" onClick={() => generateAndList("FLASH")} disabled={busy}>
                    Generate Flashcards
                  </Button>
                  <Button variant="ghost" onClick={() => listOnly("FLASH", true)} disabled={busy}>
                    Load Flashcards
                  </Button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button variant="soft" onClick={() => generateAndList("INT")} disabled={busy}>
                    Generate Interviews
                  </Button>
                  <Button variant="ghost" onClick={() => listOnly("INT", true)} disabled={busy}>
                    Load Interviews
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* MCQs */}
        {tab === "MCQ" && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <SectionTitle>MCQs</SectionTitle>
              <Tag tone="info">Selected {Object.values(selMCQ).filter(Boolean).length}</Tag>
            </div>
            {!mcqs.length ? (
              <div style={{ color: THEME.subtext }}>No MCQs yet. Use the buttons above.</div>
            ) : (
              mcqs.map((q) => (
                <MCQSelectableCard
                  key={q.id}
                  q={q}
                  checked={!!selMCQ[q.id]}
                  onToggle={() => setSelMCQ((s) => ({ ...s, [q.id]: !s[q.id] }))}
                />
              ))
            )}

            <AssignBlock
              title={title} setTitle={setTitle}
              dueAt={dueAt} setDueAt={setDueAt}
              classId={classId} setClassId={setClassId}
              studentIds={studentIds} setStudentIds={setStudentIds}
              onAssign={handleAssign}
              disabled={busy}
            />
          </div>
        )}

        {/* Flashcards */}
        {tab === "FLASH" && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <SectionTitle>Flashcards</SectionTitle>
              <Tag tone="info">Selected {Object.values(selFLASH).filter(Boolean).length}</Tag>
            </div>
            {!flash.length ? (
              <div style={{ color: THEME.subtext }}>No flashcards yet. Use the buttons above.</div>
            ) : (
              flash.map((q) => (
                <TextSelectableCard
                  key={q.id}
                  q={q}
                  checked={!!selFLASH[q.id]}
                  onToggle={() => setSelFLASH((s) => ({ ...s, [q.id]: !s[q.id] }))}
                />
              ))
            )}

            <AssignBlock
              title={title} setTitle={setTitle}
              dueAt={dueAt} setDueAt={setDueAt}
              classId={classId} setClassId={setClassId}
              studentIds={studentIds} setStudentIds={setStudentIds}
              onAssign={handleAssign}
              disabled={busy}
            />
          </div>
        )}

        {/* Interviews */}
        {tab === "INT" && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <SectionTitle>Interview Questions</SectionTitle>
              <Tag tone="info">Selected {Object.values(selINT).filter(Boolean).length}</Tag>
            </div>
            {!ints.length ? (
              <div style={{ color: THEME.subtext }}>No interview questions yet. Use the buttons above.</div>
            ) : (
              ints.map((q) => (
                <TextSelectableCard
                  key={q.id}
                  q={q}
                  checked={!!selINT[q.id]}
                  onToggle={() => setSelINT((s) => ({ ...s, [q.id]: !s[q.id] }))}
                />
              ))
            )}

            <AssignBlock
              title={title} setTitle={setTitle}
              dueAt={dueAt} setDueAt={setDueAt}
              classId={classId} setClassId={setClassId}
              studentIds={studentIds} setStudentIds={setStudentIds}
              onAssign={handleAssign}
              disabled={busy}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

/* ------------------- Assign footer block ------------------- */
function AssignBlock({
  title, setTitle,
  dueAt, setDueAt,
  classId, setClassId,
  studentIds, setStudentIds,
  onAssign, disabled
}) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: 12,
        border: `1px dashed ${THEME.border}`,
        borderRadius: 12,
        background: "#fcfcff",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "2fr 1fr 1fr", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Assignment Title</div>
          <Input value={title} onChange={setTitle} placeholder="e.g., Motion — Mixed Practice" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Due (optional)</div>
          <Input type="datetime-local" value={dueAt} onChange={setDueAt} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Class ID (optional)</div>
          <Input value={classId} onChange={setClassId} placeholder="e.g., 10A" />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>
          Student IDs (optional, comma-separated)
        </div>
        <Input
          value={studentIds}
          onChange={setStudentIds}
          placeholder="s101, s102, s103"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onAssign} disabled={disabled}>Assign</Button>
      </div>
    </div>
  );
}
