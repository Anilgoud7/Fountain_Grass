// src/data/recommendationsData.js
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export function recsFor(student, subject) {
  const recent = Array.isArray(student?.recentTopics) ? student.recentTopics : [];
  const seed = recent.length
    ? recent
    : Array.isArray(subject?.topics)
    ? subject.topics.map((t) => ({ id: t.id, title: t.name, mastery: t.mastery }))
    : [];

  const risk = (m) => (typeof m === "number" ? clamp((100 - m) / 100, 0, 1) : 0.6);
  const plan = (m) => {
    if (m == null) return { mcq: 10, flash: 12, interview: 6, difficulty: "Mixed" };
    if (m < 40) return { mcq: 12, flash: 12, interview: 6, difficulty: "Easy" };
    if (m < 60) return { mcq: 12, flash: 12, interview: 6, difficulty: "Mixed" };
    if (m < 80) return { mcq: 10, flash: 10, interview: 8, difficulty: "Mixed (lean Hard)" };
    return { mcq: 8, flash: 8, interview: 10, difficulty: "Hard" };
  };

  return seed
    .map((t, i) => ({
      id: `rec-${t.id || i}`,
      title: t.title || t.name || "Recommended Practice",
      mastery: t.mastery,
      risk: risk(t.mastery),
      plan: plan(t.mastery),
      reason:
        t.mastery == null
          ? "Build a baseline understanding."
          : t.mastery < 50
          ? "Low mastery detected recently."
          : "Reinforce and stretch this topic.",
    }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 5);
}
