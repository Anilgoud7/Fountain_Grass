// src/pages/Recommendations.jsx
import React, { useEffect, useMemo, useState } from "react";
import { THEME, Card, Button, Tag, Divider, SectionTitle, Progress, Input } from "../components/ui";

/* -------------------- API helpers -------------------- */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function getCSRFToken() {
  const m = document.cookie.match(/csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

async function jsonFetch(path, { method = "GET", body, headers = {}, ...rest } = {}) {
  const opts = {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(method !== "GET" ? { "X-CSRFToken": getCSRFToken() } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...rest,
  };
  const resp = await fetch(`${API_BASE}${path}`, opts);
  if (!resp.ok) {
    let detail = "";
    try {
      const j = await resp.json();
      detail = j?.detail || JSON.stringify(j);
    } catch (_) {
      detail = await resp.text();
    }
    throw new Error(`${resp.status} ${resp.statusText}${detail ? ` — ${detail}` : ""}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

/* -------------------- Small helpers -------------------- */

// Normalize mastery/risk that may arrive as 0..1 OR 0..100
const normalizePct = (v) => {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n > 1 ? Math.round(n) : Math.round(n * 100)));
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "—");
const estMinutes = (plan) =>
  Math.ceil((plan?.mcq || 0) * 0.75 + (plan?.flash || 0) * 0.33 + (plan?.interview || 0) * 1.5);

const toneForMastery = (p) => (p < 50 ? "danger" : p < 70 ? "warn" : "info");
const toneForRisk = (p) => (p >= 66 ? "danger" : p >= 33 ? "warn" : "neutral");

// Extract a YouTube video id from multiple URL shapes (watch, youtu.be, embed, shorts)
function getYouTubeId(url = "") {
  if (!url) return null;
  // regex-first for speed & robustness
  const rx = /(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{6,})/;
  const m1 = String(url).match(rx);
  if (m1) return m1[1];
  // URL parsing fallback
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

/* -------------------- Presentational bits -------------------- */

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

  // Use youtube-nocookie + playsinline; autoplay muted to satisfy browser policies
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
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
        }}
      />
    </div>
  );
}

function RecommendationCard({ rec, onStart }) {
  const cs = groupConceptSheet(rec.concept_sheet);
  const [showVideo, setShowVideo] = useState(true); // default visible

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
            <span>
              • Est: <strong>{estMinutes(rec.plan)} min</strong>
            </span>
          </div>
        )}

        {/* Concept Sheet buckets */}
        {(cs.definition || cs.types || cs.formulas || cs.rules || cs.method || (cs.other || []).length > 0) && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 700 }}>Concept Sheet</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
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
                      <li key={i} style={{ color: THEME.subtext, marginBottom: 2 }}>
                        {o}
                      </li>
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
                        <li key={j} style={{ color: THEME.subtext, marginBottom: 2 }}>
                          {s}
                        </li>
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

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => onStart?.("mcq", rec)}>
            Start MCQs
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onStart?.("flash", rec)}>
            Start Flashcards
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onStart?.("interview", rec)}>
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main component -------------------- */

export default function Recommendations() {
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [topics, setTopics] = useState([]); // {id,title,masteryRaw,attempts,last_activity_at}
  const [query, setQuery] = useState("");

  const [active, setActive] = useState(null); // {id,title,masteryRaw,...}

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [topicTrack, setTopicTrack] = useState(null); // { masteryRaw, attempts, last_activity_at, concepts:[{masteryRaw,...}] }
  const [recs, setRecs] = useState([]); // normalized array
  const [nextTopic, setNextTopic] = useState(null);
  const [error, setError] = useState("");

  // Load topics present in knowledge track (via summary)
  async function loadTopics() {
    setLoadingTopics(true);
    setError("");
    try {
      const data = await jsonFetch("/api/knowledge/summary/");
      const rows = Array.isArray(data?.by_topic) ? data.by_topic : [];
      const mapped = rows.map((t) => ({
        id: t.id || t.topic_id,
        title: t.title || t.name,
        masteryRaw: t.mastery, // keep raw; normalize at render
        attempts: t.attempts ?? 0,
        last_activity_at: t.last_activity_at || t.lastActivityAt || null,
      }));
      setTopics(mapped);
      if (!active && mapped.length) handlePick(mapped[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingTopics(false);
    }
  }

  // Fetch knowledge slice + recommendations for a topic
  async function loadDetailFor(title) {
    setLoadingDetail(true);
    setError("");
    try {
      // knowledge slice for this topic
      const summary = await jsonFetch(`/api/knowledge/summary/?topic=${encodeURIComponent(title)}`);
      const tRow = (summary?.by_topic || [])[0] || {};
      const conceptRows = Array.isArray(summary?.by_concept) ? summary.by_concept : [];
      const conceptsForTopic = conceptRows
        .filter((c) => (c.topic_title || c.topic) === title || !c.topic_title)
        .map((c) => ({
          id: c.id || c.concept_id,
          name: c.name || c.concept_name || "Concept",
          masteryRaw: c.mastery,
          attempts: c.attempts ?? 0,
          last_activity_at: c.last_activity_at || null,
        }));

      setTopicTrack({
        topic: title,
        masteryRaw: tRow.mastery, // raw 0..1 or 0..100
        attempts: tRow.attempts ?? 0,
        last_activity_at: tRow.last_activity_at || null,
        concepts: conceptsForTopic,
      });

      // Recommendations from backend
      const raw = await jsonFetch(`/api/recommendations/?topic=${encodeURIComponent(title)}&max_items=5`);

      const itemsArr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw?.recommendations)
        ? raw.recommendations
        : [];

      const normalized = itemsArr.map((it, idx) => ({
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
        definition: it.definition || null,
      }));

      setRecs(normalized);
      const maybeNext = !Array.isArray(raw) && raw?.next_topic ? raw.next_topic : null;
      setNextTopic(maybeNext);
    } catch (e) {
      setError(e.message);
      setRecs([]);
      setNextTopic(null);
      setTopicTrack(null);
    } finally {
      setLoadingDetail(false);
    }
  }

  function handlePick(t) {
    setActive(t);
    loadDetailFor(t.title);
  }

  useEffect(() => {
    loadTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => (t.title || "").toLowerCase().includes(q));
  }, [topics, query]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card
        title="Recommendations"
        subtitle="Pick a topic from your knowledge track to see its mastery and AI-guided study plan"
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="ghost" onClick={loadTopics} disabled={loadingTopics}>
              Refresh
            </Button>
          </div>
        }
      >
        {/* Topic picker */}
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Input
              placeholder="Filter topics…"
              value={query}
              onChange={(v) => setQuery(typeof v === "string" ? v : v?.target?.value || "")}
              style={{ width: 260 }}
            />
            {loadingTopics && <span style={{ color: THEME.subtext }}>Loading topics…</span>}
            {!!error && <span style={{ color: THEME.danger }}>{error}</span>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {filteredTopics.length === 0 ? (
              <div style={{ color: THEME.subtext }}>No topics in your knowledge track yet.</div>
            ) : (
              filteredTopics.map((t) => {
                const activeMatch = active && active.title === t.title;
                const mPct = normalizePct(t.masteryRaw);
                const tone = toneForMastery(mPct);
                return (
                  <button
                    key={t.id || t.title}
                    onClick={() => handlePick(t)}
                    style={{
                      border: `1px solid ${activeMatch ? THEME.primary : THEME.border}`,
                      background: activeMatch ? THEME.primarySoft : "#fff",
                      color: activeMatch ? THEME.primary : THEME.text,
                      borderRadius: 999,
                      padding: "6px 12px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>{t.title}</span>
                    <Tag tone={tone}>{mPct}%</Tag>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <Divider />

        {/* Topic knowledge + recs */}
        {!active ? (
          <div style={{ color: THEME.subtext }}>Select a topic to view details.</div>
        ) : loadingDetail ? (
          <div style={{ color: THEME.subtext }}>Loading {active.title}…</div>
        ) : (
          <>
            {topicTrack && (
              <div style={{ display: "grid",  gap: 16 }}>
                {/* Knowledge snapshot */}
                <Card title={`Knowledge • ${topicTrack.topic}`} subtitle="Your current mastery">
                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: THEME.subtext }}>Mastery</div>
                      <Progress value={normalizePct(topicTrack.masteryRaw)} />
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Tag tone="neutral">Attempts {topicTrack.attempts ?? 0}</Tag>
                      <Tag tone="neutral">Last activity {fmtDate(topicTrack.last_activity_at)}</Tag>
                    </div>
                    <Divider />
                    <SectionTitle>By Concept</SectionTitle>
                    {!topicTrack.concepts?.length ? (
                      <div style={{ color: THEME.subtext }}></div>
                    ) : (
                      <div style={{ display: "grid", gap: 8, maxHeight: 260, overflow: "auto", paddingRight: 6 }}>
                        {topicTrack.concepts.map((c) => {
                          const mPct = normalizePct(c.masteryRaw);
                          return (
                            <div
                              key={c.id || c.name}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "200px 1fr 80px",
                                gap: 10,
                                alignItems: "center",
                              }}
                            >
                              <div style={{ color: THEME.subtext }}>{c.name}</div>
                              <Progress value={mPct} />
                              <div style={{ textAlign: "right" }}>
                                <Tag tone={mPct < 60 ? "warn" : "info"}>{mPct}%</Tag>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>

                {/* AI Recommendations */}
                <Card
                  title="AI Recommendations"
                  subtitle="Focused practice + a quick video cue"
                  right={nextTopic ? <Tag tone="info">Next: {nextTopic.title}</Tag> : null}
                >
                  {!recs?.length ? (
                    <div style={{ color: THEME.subtext }}>No recommendations yet for this topic.</div>
                  ) : (
                    <div style={{ display: "grid", gap: 14 }}>
                      {recs.map((r) => (
                        <RecommendationCard
                          key={r.id || r.title}
                          rec={r}
                          onStart={(mode) => {
                            // Wire up to your practice flows here
                            alert(`Start ${mode} for ${r.title}`);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {nextTopic && (
                    <>
                      <Divider />
                      <div
                        style={{
                          padding: 12,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 12,
                          background: "#f5fbff",
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>Recommended next topic: {nextTopic.title}</div>
                        {nextTopic.reason && (
                          <div style={{ color: THEME.subtext, fontSize: 13 }}>{nextTopic.reason}</div>
                        )}
                        <div>
                          <Button size="sm" variant="soft" onClick={() => handlePick({ title: nextTopic.title })}>
                            View {nextTopic.title}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
