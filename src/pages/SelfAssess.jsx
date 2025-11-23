// src/pages/SelfAssess.jsx
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  THEME,
  Card,
  Button,
  Tag,
  Divider,
  SectionTitle,
  Input,
  Progress,
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
  return "ALL"; // Mixed → no filter for list; MEDIUM default for generate
}

/* -- generate endpoints -- */
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

/* -- list endpoints (GET, topic via query) -- */
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

/* -- submit endpoints -- */
async function submitMCQAPI({ question, submitted_answers = [], time_taken_seconds = 0 }) {
  return jsonFetch(`${API_BASE}/api/submit/mcq/`, {
    method: "POST",
    body: { question, submitted_answers, time_taken_seconds },
  });
}
async function submitTextAPI({ question, submitted_text = "", time_taken_seconds = 0 }) {
  return jsonFetch(`${API_BASE}/api/submit/text/`, {
    method: "POST",
    body: { question, submitted_text, time_taken_seconds },
  });
}

/* ------------------- Recommendations: API + UI helpers ------------------- */

// Normalize any topic-like value to a string title
function normalizeTopicTitle(x) {
  if (!x) return "";
  if (typeof x === "string") return x;
  // Try common keys
  return x.name || x.title || x.topic || x.topic_title || "";
}

// Prefer topics attached to the questions we actually rendered.
function topicsFromPreview(preview) {
  const set = new Set();
  (preview?.mcqs || []).forEach((q) => normalizeTopicTitle(q?.topic) && set.add(normalizeTopicTitle(q.topic)));
  (preview?.flashcards || []).forEach((q) => normalizeTopicTitle(q?.topic) && set.add(normalizeTopicTitle(q.topic)));
  (preview?.interviews || []).forEach((q) => normalizeTopicTitle(q?.topic) && set.add(normalizeTopicTitle(q.topic)));
  return Array.from(set);
}

// GET /api/recommendations/?topic=A&topic=B&max_items=5  (multi-topic)
async function fetchRecommendationsAPI({ topics = [], max_items = 5 }) {
  const params = new URLSearchParams();
  topics
    .map(normalizeTopicTitle)
    .filter(Boolean)
    .forEach((t) => params.append("topic", t));
  params.append("max_items", String(max_items));
  return jsonFetch(`${API_BASE}/api/recommendations/?${params.toString()}`);
}

// Response shape tolerant parser (raw | {items} | {recommendations})
function parseRecommendationsResponse(raw) {
  const itemsArr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.recommendations)
    ? raw.recommendations
    : [];
  return itemsArr;
}

// Normalize mastery/risk (0..1 or 0..100 → 0..100)
const normalizePct = (v) => {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n > 1 ? Math.round(n) : Math.round(n * 100)));
};

const estMinutes = (plan) =>
  Math.ceil((plan?.mcq || 0) * 0.75 + (plan?.flash || 0) * 0.33 + (plan?.interview || 0) * 1.5);

// YouTube id extractor (watch / youtu.be / embed / shorts)
function getYouTubeId(url = "") {
  if (!url) return null;
  const rx = /(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{6,})/;
  const m1 = String(url).match(rx);
  if (m1) return m1[1];
  try {
    const u = new URL(url, window.location.origin);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m2 = u.pathname.match(/\/(embed|shorts)\/([A-Za-z0-9_-]{6,})/);
    if (m2) return m2[2];
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "");
      if (id) return id;
    }
  } catch (_) {}
  return null;
}

function Pill({ children, tone = "neutral" }) {
  const colors = {
    neutral: { bg: "#f6f7f9", fg: THEME.text },
    info: { bg: "#eef6ff", fg: THEME.primary },
    warn: { bg: "#fff7e6", fg: "#a15c00" },
    danger: { bg: "#fff0f0", fg: "#c92a2a" },
    success: { bg: "#eefaf1", fg: "#0a7c3b" },
  }[tone] || { bg: "#f6f7f9", fg: THEME.text };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: colors.bg,
        color: colors.fg,
        fontSize: 12,
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </span>
  );
}

function VideoEmbed({ url, title = "Video", autoplay = true }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  const qs = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    ...(autoplay ? { autoplay: "1", mute: "1" } : {}),
  }).toString();
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%", // 16:9
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${THEME.border}`,
        background: "#000",
      }}
    >
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?${qs}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </div>
  );
}

function RecommendationCard({ rec, onStart }) {
  const cs = groupConceptSheet(rec.concept_sheet);
  const [showVideo, setShowVideo] = useState(true);

  return (
    <div
      style={{
        border: `1px solid ${THEME.border}`,
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 0 rgba(16,24,40,0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: 14,
          borderBottom: `1px dashed ${THEME.border}`,
          background: "#fcfcfd",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{rec.title || "Recommendation"}</div>
          {rec.reason && <div style={{ fontSize: 12, color: THEME.subtext }}>{rec.reason}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Number.isFinite(rec.masteryPct) && (
            <Tag tone={rec.masteryPct < 50 ? "danger" : rec.masteryPct < 70 ? "warn" : "info"}>
              Mastery {rec.masteryPct}%
            </Tag>
          )}
          {Number.isFinite(rec.riskPct) && (
            <Tag tone={rec.riskPct >= 66 ? "danger" : rec.riskPct >= 33 ? "warn" : "neutral"}>
              Risk {rec.riskPct}%
            </Tag>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 16, display: "grid", gap: 14 }}>
        {/* Plan */}
        {rec?.plan && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              color: THEME.subtext,
              fontSize: 14,
            }}
          >
            <span style={{ fontWeight: 600 }}>Plan:</span>
            <Pill>🧩 {rec.plan.mcq || 0} MCQ</Pill>
            <Pill>🗂 {rec.plan.flash || 0} Flash</Pill>
            <Pill>💬 {rec.plan.interview || 0} Interview</Pill>
            <span>• Est: <strong>{estMinutes(rec.plan)} min</strong></span>
          </div>
        )}

        {/* Concept Sheet buckets */}
        {(cs.definition || cs.types || cs.formulas || cs.rules || cs.method || (cs.other || []).length > 0) && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 700 }}>Concept Sheet</div>
            <div style={{ display: "grid", gridTemplateColumns: "repea t(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {cs.definition && (
                <div style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Definition</div>
                  <div>{cs.definition}</div>
                </div>
              )}
              {cs.types && (
                <div style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Types</div>
                  <div>{cs.types}</div>
                </div>
              )}
              {cs.formulas && (
                <div style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Key formulas</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{cs.formulas}</div>
                </div>
              )}
              {cs.rules && (
                <div style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Rules of thumb</div>
                  <div>{cs.rules}</div>
                </div>
              )}
              {cs.method && (
                <div style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Standard approach</div>
                  <div>{cs.method}</div>
                </div>
              )}
              {(cs.other || []).length > 0 && (
                <div style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Notes</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {cs.other.map((o, i) => (
                      <li key={i} style={{ color: THEME.subtext, marginBottom: 2 }}>{o}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confusions */}
        {Array.isArray(rec.confusions) && rec.confusions.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>Common Confusions</div>
            <div style={{ display: "grid", gap: 10 }}>
              {rec.confusions.map((c, i) => (
                <div key={i} style={{ border: `1px dashed ${THEME.border}`, borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 4 }}>Misconception</div>
                  <div style={{ marginBottom: 6 }}>{c.misconception}</div>
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 4 }}>Correction</div>
                  <div>{c.correction}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Worked Examples */}
        {Array.isArray(rec.worked_examples) && rec.worked_examples.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>Worked Examples</div>
            <div style={{ display: "grid", gap: 10 }}>
              {rec.worked_examples.map((ex, i) => (
                <div key={i} style={{ border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{ex.title || `Example ${i + 1}`}</div>
                  {Array.isArray(ex.steps) && (
                    <ol style={{ margin: 0, paddingLeft: 18 }}>
                      {ex.steps.map((s, j) => (
                        <li key={j} style={{ color: THEME.subtext, marginBottom: 2 }}>{s}</li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini Lab */}
        {rec?.mini_lab && (
          <div
            style={{
              padding: 12,
              background: "#f9fafb",
              border: `1px dashed ${THEME.border}`,
              borderRadius: 12,
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ fontWeight: 700 }}>Mini-lab</div>
            <div style={{ color: THEME.subtext }}>{rec.mini_lab}</div>
          </div>
        )}

        {/* Video */}
        {rec?.yt?.url && (
          <div
            style={{
              padding: 12,
              background: "#f9fbff",
              border: `1px dashed ${THEME.border}`,
              borderRadius: 12,
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>Watch</div>
                <div style={{ color: THEME.subtext, fontSize: 12 }}>{rec?.yt?.title || "Recommended video"}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button as="a" href={rec.yt.url} target="_blank" rel="noreferrer" variant="secondary" size="sm">
                  Open on YouTube
                </Button>
                <Button size="sm" onClick={() => setShowVideo((s) => !s)}>
                  {showVideo ? "Hide player" : "Play inline"}
                </Button>
              </div>
            </div>
            {showVideo && <VideoEmbed url={rec.yt.url} title={rec?.yt?.title || rec?.title || "Video"} autoplay />}
          </div>
        )}

        {/* Actions (hook up to flows as desired) */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => onStart?.("mcq", rec)}>Start MCQs</Button>
          <Button size="sm" variant="secondary" onClick={() => onStart?.("flash", rec)}>Start Flashcards</Button>
          <Button size="sm" variant="ghost" onClick={() => onStart?.("interview", rec)}>Start Interview</Button>
        </div>
      </div>
    </div>
  );
}

// Group concept-sheet lines into buckets for nicer layout
function groupConceptSheet(lines = []) {
  const buckets = {
    definition: null,
    types: null,
    formulas: null,
    rules: null,
    method: null,
    other: [],
  };
  lines.forEach((raw) => {
    const s = String(raw || "").trim();
    const lower = s.toLowerCase();
    if (lower.startsWith("definition")) buckets.definition = s.replace(/^definition:\s*/i, "");
    else if (lower.startsWith("types")) buckets.types = s.replace(/^types:\s*/i, "");
    else if (lower.startsWith("key formulas") || lower.startsWith("key formula"))
      buckets.formulas = s.replace(/^key formulas?:\s*/i, "");
    else if (lower.startsWith("rules of thumb") || lower.startsWith("rule of thumb"))
      buckets.rules = s.replace(/^rules? of thumb:\s*/i, "");
    else if (lower.startsWith("core method") || lower.includes("recipe"))
      buckets.method = s.replace(/^(core method\/recipe|core method|method|recipe):?\s*/i, "");
    else buckets.other.push(s);
  });
  return buckets;
}

/* ------------------- tiny UI bits for Q/A ------------------- */
function RadioRow({ value, onChange, items }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            style={{
              border: `1px solid ${active ? THEME.primary : THEME.border}`,
              background: active ? THEME.primarySoft : "#fff",
              color: active ? THEME.primary : THEME.text,
              padding: "6px 10px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function MCQCard({ q, selected = [], setSelected, submitted, result }) {
  const toggle = (i) =>
    setSelected((curr) => (curr.includes(i) ? curr.filter((x) => x !== i) : [...curr, i]));
  const correct = submitted ? result?.is_correct : null;
  return (
    <div
      style={{
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        background: "#fff",
        padding: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600 }}>{q.prompt}</div>
      <div style={{ display: "grid", gap: 6 }}>
        {(q.options || []).map((opt, i) => {
          const on = selected.includes(i);
          const showKey =
            submitted && Array.isArray(q.correct_answers) && q.correct_answers.includes(i);
          return (
            <button
              key={i}
              onClick={() => !submitted && toggle(i)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 10,
                border: `1px solid ${showKey ? "#10b981" : on ? THEME.primary : THEME.border}`,
                background: showKey ? "#ecfdf5" : on ? THEME.primarySoft : "#fff",
                cursor: submitted ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <Tag>{q.difficulty || "MEDIUM"}</Tag>
        {submitted && (
          <>
            <Tag tone={correct ? "success" : "danger"}>{correct ? "Correct" : "Incorrect"}</Tag>
            {q.explanation && <div style={{ fontSize: 12, color: THEME.subtext }}>{q.explanation}</div>}
          </>
        )}
      </div>
    </div>
  );
}

function TextQAcard({ q, qType, text, setText, submitted, result }) {
  const correctish = submitted ? result?.is_correct : null;
  return (
    <div
      style={{
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        background: "#fff",
        padding: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600 }}>{q.prompt}</div>
      {!submitted ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={qType === "FLASH" ? "Type the answer…" : "Type your short answer…"}
          style={{
            width: "100%",
            minHeight: 80,
            padding: 8,
            borderRadius: 8,
            border: `1px solid ${THEME.border}`,
          }}
        />
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          <div>
            <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 4 }}>Your answer</div>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${correctish ? "#10b981" : THEME.border}`,
                background: "#fff",
              }}
            >
              {text || "—"}
            </div>
          </div>
          {q.answer_text && (
            <div>
              <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 4 }}>Model answer</div>
              <div
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: `1px dashed ${THEME.border}`,
                  background: "#fafafa",
                }}
              >
                {q.answer_text}
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <Tag>{q.difficulty || "MEDIUM"}</Tag>
        {submitted && <Tag tone={correctish ? "success" : "warn"}>{correctish ? "Looks good" : "Review"}</Tag>}
      </div>
    </div>
  );
}

/* ------------------- SelfAssess main ------------------- */
export default function SelfAssess(props) {
  const outlet = (typeof useOutletContext === "function" ? useOutletContext() : {}) || {};
  const activeSubject = props.activeSubject || outlet.activeSubject || null;

  const [topicQuery, setTopicQuery] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [difficulty, setDifficulty] = useState("Mixed"); // Easy|Medium|Hard|Mixed
  const [countEach, setCountEach] = useState(10);
  const [busy, setBusy] = useState(false);

  const [preview, setPreview] = useState({ mcqs: [], flashcards: [], interviews: [] });
  const [tab, setTab] = useState("MCQ"); // MCQ|FLASH|INT

  const [mcqSelections, setMcqSelections] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [results, setResults] = useState({});
  const [submittedType, setSubmittedType] = useState({ MCQ: false, FLASH: false, INT: false });

  // recommendations
  const [recs, setRecs] = useState([]); // normalized items array
  const [recsError, setRecsError] = useState(null);
  const [nextTopic, setNextTopic] = useState(null); // optional if backend returns
  const recsRef = useRef(null);

  // Remember the last topics we actually loaded content for (for precise recs)
  const [lastLoadedTopics, setLastLoadedTopics] = useState([]);

  // load subject topics when subject changes
  useEffect(() => {
    const pre = Array.isArray(activeSubject?.topics) ? activeSubject.topics : [];
    setTopics(pre);
    setSelectedIds([]);
    setPreview({ mcqs: [], flashcards: [], interviews: [] });
    setMcqSelections({});
    setTextAnswers({});
    setResults({});
    setSubmittedType({ MCQ: false, FLASH: false, INT: false });
    setRecs([]);
    setRecsError(null);
    setNextTopic(null);
    setLastLoadedTopics([]);
  }, [activeSubject?.id]); // eslint-disable-line

  const topicList = (topics || []).filter((t) =>
    (t.name || "").toLowerCase().includes(topicQuery.toLowerCase())
  );

  const selectedTopicTitles = () => {
    const sel = (topics || []).filter((t) => selectedIds.includes(t.id));
    if (!sel.length) {
      alert("Pick topics first.");
      return [];
    }
    return sel.map((t) => t.name);
  };

  const apiDiff = mapDifficultyForAPI(difficulty);

  const toggle = (id) =>
    setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const setMcqSelFor = (id) => (updater) =>
    setMcqSelections((prev) => {
      const curr = prev[id] || [];
      const next = typeof updater === "function" ? updater(curr) : updater;
      return { ...prev, [id]: next };
    });
  const setTextAnsFor = (id) => (val) =>
    setTextAnswers((prev) => ({
      ...prev,
      [id]: typeof val === "function" ? val(prev[id] || "") : val,
    }));

  /* ------------------- GENERATE then LIST ------------------- */
  async function generateThenListMCQs() {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      for (const tt of titles) {
        await generateMCQsAPI({
          topic_title: tt,
          n: countEach,
          difficulty: apiDiff === "ALL" ? "MEDIUM" : apiDiff,
        });
      }
      await loadMCQs(false);
      setTab("MCQ");
    } catch (e) {
      alert(`Generate MCQs failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function generateThenListFlashcards() {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      for (const tt of titles) {
        await generateFlashcardsAPI({
          topic_title: tt,
          n: countEach,
          difficulty: apiDiff === "ALL" ? "MEDIUM" : apiDiff,
        });
      }
      await loadFlashcards(false);
      setTab("FLASH");
    } catch (e) {
      alert(`Generate Flashcards failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function generateThenListInterviews() {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      for (const tt of titles) {
        await generateInterviewsAPI({
          topic_title: tt,
          n: countEach,
          difficulty: apiDiff === "ALL" ? "MEDIUM" : apiDiff,
        });
      }
      await loadInterviews(false);
      setTab("INT");
    } catch (e) {
      alert(`Generate Interview questions failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  /* ------------------- LIST only ------------------- */
  async function loadMCQs(setActiveTab = true) {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      const all = [];
      for (const tt of titles) {
        const list = await listMCQsAPI({ topic_title: tt, difficulty: apiDiff, limit: countEach });
        all.push(...list);
      }
      setPreview((p) => ({ ...p, mcqs: all.slice(0, countEach) }));
      setSubmittedType((s) => ({ ...s, MCQ: false }));
      // Remember topics we just actually loaded
      const loadedTopics = new Set(all.map((q) => normalizeTopicTitle(q?.topic)).filter(Boolean));
      setLastLoadedTopics(Array.from(loadedTopics));
      if (setActiveTab) setTab("MCQ");
    } catch (e) {
      alert(`Loading MCQs failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function loadFlashcards(setActiveTab = true) {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      const all = [];
      for (const tt of titles) {
        const list = await listFlashcardsAPI({
          topic_title: tt,
          difficulty: apiDiff,
          limit: countEach,
        });
        all.push(...list);
      }
      setPreview((p) => ({ ...p, flashcards: all.slice(0, countEach) }));
      setSubmittedType((s) => ({ ...s, FLASH: false }));
      const loadedTopics = new Set(all.map((q) => normalizeTopicTitle(q?.topic)).filter(Boolean));
      setLastLoadedTopics(Array.from(loadedTopics));
      if (setActiveTab) setTab("FLASH");
    } catch (e) {
      alert(`Loading Flashcards failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function loadInterviews(setActiveTab = true) {
    const titles = selectedTopicTitles();
    if (!titles.length) return;
    setBusy(true);
    try {
      const all = [];
      for (const tt of titles) {
        const list = await listInterviewsAPI({
          topic_title: tt,
          difficulty: apiDiff,
          limit: countEach,
        });
        all.push(...list);
      }
      setPreview((p) => ({ ...p, interviews: all.slice(0, countEach) }));
      setSubmittedType((s) => ({ ...s, INT: false }));
      const loadedTopics = new Set(all.map((q) => normalizeTopicTitle(q?.topic)).filter(Boolean));
      setLastLoadedTopics(Array.from(loadedTopics));
      if (setActiveTab) setTab("INT");
    } catch (e) {
      alert(`Loading Interview questions failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  /* ------------------- RECOMMENDATIONS ------------------- */
  function scrollToRecommendations() {
    requestAnimationFrame(() => {
      if (recsRef.current) recsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function loadRecommendations() {
    // 1) Topics we just loaded content for (exact)
    let topicsWanted = Array.from(new Set((lastLoadedTopics || []).map(normalizeTopicTitle).filter(Boolean)));

    // 2) If empty, mine from rendered preview
    if (!topicsWanted.length) topicsWanted = topicsFromPreview(preview);

    // 3) If still empty, fall back to selected chips
    if (!topicsWanted.length) topicsWanted = selectedTopicTitles();
    if (!topicsWanted.length) return;

    try {
      setRecsError(null);
      setNextTopic(null);
      const raw = await fetchRecommendationsAPI({ topics: topicsWanted, max_items: 5 });

      const normalized = parseRecommendationsResponse(raw).map((it, idx) => ({
        ...it,
        id: it.id || `rec_${it.topic_id || idx}`,
        title: it.title || it.topic || "Study guide",
        masteryPct: normalizePct(it.mastery),
        riskPct: normalizePct(it.risk),
        yt: it.youtube || it.yt || null, // normalize youtube field for UI
        concept_sheet: Array.isArray(it.concept_sheet) ? it.concept_sheet : [],
        confusions: Array.isArray(it.confusions) ? it.confusions : [],
        mini_lab: it.mini_lab || null,
        worked_examples: Array.isArray(it.worked_examples) ? it.worked_examples : [],
        plan: it.plan || { mcq: 0, flash: 0, interview: 0 },
        reason: it.reason || "",
      }));

      setRecs(normalized);
      if (!Array.isArray(raw) && raw?.next_topic) setNextTopic(raw.next_topic);
    } catch (e) {
      setRecsError(e.message || "Failed to load recommendations");
      setRecs([]);
      setNextTopic(null);
    }
  }

  /* ------------------- SUBMIT ------------------- */
  async function submitAllMCQs() {
    if (!preview.mcqs.length) return;
    setBusy(true);
    try {
      const resMap = {};
      for (const q of preview.mcqs) {
        const sel = mcqSelections[q.id] || [];
        const r = await submitMCQAPI({
          question: q.id,
          submitted_answers: sel,
          time_taken_seconds: 20,
        });
        resMap[q.id] = r;
      }
      setResults((prev) => ({ ...prev, ...resMap }));
      setSubmittedType((s) => ({ ...s, MCQ: true }));
      await loadRecommendations();
      scrollToRecommendations();
    } catch (e) {
      alert(`Submitting MCQs failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function submitAllFlashcards() {
    if (!preview.flashcards.length) return;
    setBusy(true);
    try {
      const resMap = {};
      for (const q of preview.flashcards) {
        const txt = textAnswers[q.id] || "";
        const r = await submitTextAPI({
          question: q.id,
          submitted_text: txt,
          time_taken_seconds: 30,
        });
        resMap[q.id] = r;
      }
      setResults((prev) => ({ ...prev, ...resMap }));
      setSubmittedType((s) => ({ ...s, FLASH: true }));
      await loadRecommendations();
      scrollToRecommendations();
    } catch (e) {
      alert(`Submitting flashcards failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function submitAllInterviews() {
    if (!preview.interviews.length) return;
    setBusy(true);
    try {
      const resMap = {};
      for (const q of preview.interviews) {
        const txt = textAnswers[q.id] || "";
        const r = await submitTextAPI({
          question: q.id,
          submitted_text: txt,
          time_taken_seconds: 35,
        });
        resMap[q.id] = r;
      }
      setResults((prev) => ({ ...prev, ...resMap }));
      setSubmittedType((s) => ({ ...s, INT: true }));
      await loadRecommendations();
      scrollToRecommendations();
    } catch (e) {
      alert(`Submitting interview answers failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  /* ------------------- render ------------------- */
  return (
    <Card
      title="Self Assess"
      subtitle="Pick topics • per-type APIs (generate/list/submit) • Updates knowledge on submit"
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
            MCQs ({preview.mcqs.length})
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
            Flashcards ({preview.flashcards.length})
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
            Interview ({preview.interviews.length})
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
              {topicList.map((t) => {
                const active = selectedIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggle(t.id)}
                    style={{
                      border: `1px solid ${active ? THEME.primary : THEME.border}`,
                      background: active ? THEME.primarySoft : "#fff",
                      color: active ? THEME.primary : THEME.text,
                      padding: "6px 10px",
                      borderRadius: 999,
                      cursor: "pointer",
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <SectionTitle>Settings</SectionTitle>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Difficulty</div>
                <RadioRow
                  value={difficulty}
                  onChange={setDifficulty}
                  items={[
                    { label: "Easy", value: "Easy" },
                    { label: "Medium", value: "Medium" },
                    { label: "Hard", value: "Hard" },
                    { label: "Mixed", value: "Mixed" },
                  ]}
                />
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
                  <Button variant="soft" onClick={generateThenListMCQs} disabled={busy}>
                    Generate MCQs
                  </Button>
                  <Button variant="ghost" onClick={() => loadMCQs(true)} disabled={busy}>
                    Load MCQs
                  </Button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button variant="soft" onClick={generateThenListFlashcards} disabled={busy}>
                    Generate Flashcards
                  </Button>
                  <Button variant="ghost" onClick={() => loadFlashcards(true)} disabled={busy}>
                    Load Flashcards
                  </Button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button variant="soft" onClick={generateThenListInterviews} disabled={busy}>
                    Generate Interviews
                  </Button>
                  <Button variant="ghost" onClick={() => loadInterviews(true)} disabled={busy}>
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
            </div>

            {!preview.mcqs.length ? (
              <div style={{ color: THEME.subtext }}>No MCQs yet. Use the buttons above.</div>
            ) : (
              preview.mcqs.map((q) => (
                <MCQCard
                  key={`m-${q.id}`}
                  q={q}
                  selected={mcqSelections[q.id] || []}
                  setSelected={setMcqSelFor(q.id)}
                  submitted={submittedType.MCQ}
                  result={results[q.id]}
                />
              ))
            )}

            {/* Submit at bottom */}
            <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button
                onClick={submitAllMCQs}
                disabled={!preview.mcqs.length || submittedType.MCQ || busy}
              >
                {submittedType.MCQ ? "Submitted" : "Submit All"}
              </Button>
            </div>
          </div>
        )}

        {/* Flashcards */}
        {tab === "FLASH" && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <SectionTitle>Flashcards</SectionTitle>
            </div>

            {!preview.flashcards.length ? (
              <div style={{ color: THEME.subtext }}>No flashcards yet. Use the buttons above.</div>
            ) : (
              preview.flashcards.map((q, i) => (
                <TextQAcard
                  key={`f-${q.id || i}`}
                  q={q}
                  qType="FLASH"
                  text={textAnswers[q.id] || ""}
                  setText={setTextAnsFor(q.id)}
                  submitted={submittedType.FLASH}
                  result={results[q.id]}
                />
              ))
            )}

            {/* Submit at bottom */}
            <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button
                onClick={submitAllFlashcards}
                disabled={!preview.flashcards.length || submittedType.FLASH || busy}
              >
                {submittedType.FLASH ? "Submitted" : "Submit All"}
              </Button>
            </div>
          </div>
        )}

        {/* Interviews */}
        {tab === "INT" && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <SectionTitle>Interview Questions</SectionTitle>
            </div>

            {!preview.interviews.length ? (
              <div style={{ color: THEME.subtext }}>No interview questions yet. Use the buttons above.</div>
            ) : (
              preview.interviews.map((q, i) => (
                <TextQAcard
                  key={`i-${q.id || i}`}
                  q={q}
                  qType="INT"
                  text={textAnswers[q.id] || ""}
                  setText={setTextAnsFor(q.id)}
                  submitted={submittedType.INT}
                  result={results[q.id]}
                />
              ))
            )}

            {/* Submit at bottom */}
            <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button
                onClick={submitAllInterviews}
                disabled={!preview.interviews.length || submittedType.INT || busy}
              >
                {submittedType.INT ? "Submitted" : "Submit All"}
              </Button>
            </div>
          </div>
        )}

        {/* ------------------- Recommendations (Recommendations.jsx style) ------------------- */}
        <Divider />
        <div ref={recsRef} />
        <div style={{ display: "grid", gap: 8 }}>
          <SectionTitle>Recommendations</SectionTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
              variant="ghost"
              onClick={() => {
                loadRecommendations();
                scrollToRecommendations();
              }}
              disabled={busy}
            >
              Refresh Recommendations
            </Button>
            {nextTopic?.title && <Tag tone="info">Next: {nextTopic.title}</Tag>}
          </div>

          {recsError && (
            <div style={{ color: "#b91c1c", fontSize: 13 }}>
              Failed to load recommendations: {recsError}
            </div>
          )}

          {!recs.length && !recsError && (
            <div style={{ color: THEME.subtext, fontSize: 13 }}>
              No recommendations yet. Submit some answers or click “Refresh Recommendations”.
            </div>
          )}

          {!!recs.length && (
            <div style={{ display: "grid", gap: 14 }}>
              {recs.map((r) => (
                <RecommendationCard
                  key={r.id || r.title}
                  rec={r}
                  onStart={(mode) => {
                    // Wire this to your practice flows if desired
                    alert(`Start ${mode} for ${r.title}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
