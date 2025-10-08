// src/data/assignedData.js
// Demo data for Assigned.jsx with Teacher + Parent sources.
// API: assignedDataFor(subject, subtab, source = "Teacher")

export function assignedDataFor(subjectInput, subtab = "MCQs", source = "Teacher") {
  const subject = normalize(subjectInput);
  const src = (source || "Teacher").toLowerCase();
  const key = `${subject}:${subtab}:${src}`;

  const DATA = {
    // ---------------- PHYSICS ----------------
    "physics:MCQs:teacher": [
      { id: "phy-t-m-1", title: "Ohm’s Law & Circuits", count: 12, due_at: "2025-09-02T18:00:00+05:30", status: "Assigned" },
      { id: "phy-t-m-2", title: "Magnetic Effects Quick Check", count: 10, due_at: "2025-09-04T09:00:00+05:30", status: "Assigned" },
    ],
    "physics:Flashcards:teacher": [
      { id: "phy-t-f-1", title: "Symbols & Units (Electricity)", count: 20, status: "Assigned" },
      { id: "phy-t-f-2", title: "Mirror vs Lens Formulae", count: 18, status: "Completed" },
    ],
    "physics:Interview:teacher": [
      { id: "phy-t-i-1", title: "Explain EM Induction", count: 6, due_at: "2025-09-03T17:00:00+05:30", status: "Assigned" },
    ],

    // Parent guidance: lighter + home-friendly
    "physics:MCQs:parent": [
      { id: "phy-p-m-1", title: "Weekly Practice: Electric Circuits", count: 8, note: "Try together. Discuss each mistake.", status: "Assigned" },
    ],
    "physics:Flashcards:parent": [
      { id: "phy-p-f-1", title: "Home Drill: Key Terms (Light)", count: 12, note: "5–7 min/day. Shuffle cards.", status: "Assigned" },
    ],
    "physics:Interview:parent": [
      { id: "phy-p-i-1", title: "Oral Qs: Eye & Colourful World", count: 5, note: "Ask 'why' after each answer.", status: "Assigned" },
    ],

    // ---------------- MATHEMATICS ----------------
    "mathematics:MCQs:teacher": [
      { id: "mat-t-m-1", title: "Quadratic Equations Basics", count: 15, due_at: "2025-09-02T20:00:00+05:30", status: "Assigned" },
      { id: "mat-t-m-2", title: "Triangles Similarity Check", count: 10, status: "Assigned" },
    ],
    "mathematics:Flashcards:teacher": [
      { id: "mat-t-f-1", title: "Trig Ratios & Values", count: 16, status: "Assigned" },
    ],
    "mathematics:Interview:teacher": [
      { id: "mat-t-i-1", title: "AP & nth Term Reasoning", count: 6, status: "Completed" },
    ],

    "mathematics:MCQs:parent": [
      { id: "mat-p-m-1", title: "Parent Pack: Real Numbers", count: 8, note: "Focus on Euclid’s lemma examples.", status: "Assigned" },
    ],
    "mathematics:Flashcards:parent": [
      { id: "mat-p-f-1", title: "Formulas Sprint (Daily 10')", count: 14, note: "Mix trig + AP + area.", status: "Assigned" },
    ],
    "mathematics:Interview:parent": [
      { id: "mat-p-i-1", title: "Explain 'similar triangles' to me", count: 5, note: "Listen for 'proportion' keyword.", status: "Assigned" },
    ],

    // ---------------- BIOLOGY ----------------
    "biology:MCQs:teacher": [
      { id: "bio-t-m-1", title: "Life Processes: Nutrition & Respiration", count: 12, due_at: "2025-09-03T18:30:00+05:30", status: "Assigned" },
    ],
    "biology:Flashcards:teacher": [
      { id: "bio-t-f-1", title: "Endocrine Glands & Hormones", count: 18, status: "Assigned" },
    ],
    "biology:Interview:teacher": [
      { id: "bio-t-i-1", title: "Reflex Arc & Coordination", count: 6, status: "Assigned" },
    ],

    "biology:MCQs:parent": [
      { id: "bio-p-m-1", title: "Home Quiz: Reproduction Basics", count: 8, note: "Emphasize concepts over terms.", status: "Assigned" },
    ],
    "biology:Flashcards:parent": [
      { id: "bio-p-f-1", title: "Daily Cards: Ecosystem terms", count: 12, note: "Ask examples from home life.", status: "Assigned" },
    ],
    "biology:Interview:parent": [
      { id: "bio-p-i-1", title: "Explain 'food chain' with examples", count: 5, note: "Ask 'what if one species vanishes?'", status: "Assigned" },
    ],
  };

  return DATA[key] || [];
}

function normalize(s) {
  if (!s) return "physics";
  const n = typeof s === "string" ? s : s?.name || s?.id || "physics";
  const low = n.trim().toLowerCase();
  if (["maths", "math", "mathematics"].includes(low)) return "mathematics";
  if (["bio", "biology"].includes(low)) return "biology";
  if (["physics", "phy"].includes(low)) return "physics";
  return "physics";
}
