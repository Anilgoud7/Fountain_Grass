import React, { useMemo, useState, useEffect } from "react";

/**
 * Qboxai — Multi‑role Education Dashboard (Enhanced)
 * New in this version:
 *  - AI Tech School branding
 *  - Teacher role added
 *  - Attendance removed from all views
 *  - Maintains all existing themes and layouts
 */

// -------------------------------------------------- Mock Data
// -------------------------------------------------- Mock Data (expanded)
const MOCK = {
  schools: [
    {
      id: "sch1",
      name: "Ybrant Smartek Schools",
      classes: [
        /* ----------------------- Class 9 ----------------------- */
        {
          id: "cls9",
          name: "Class 9 AI Tech",
          subjects: [
            {
              id: "phy9",
              name: "Physics",
              syllabus: [
                {
                  id: "phy9-sy1",
                  name: "Term 1",
                  chapters: [
                    {
                      id: "phy9-ch1",
                      name: "Motion",
                      topics: [
                        { id: "phy9-t1", name: "Distance & Displacement", mastery: 61 },
                        { id: "phy9-t2", name: "Uniform vs Non-uniform Motion", mastery: 55 }
                      ]
                    },
                    {
                      id: "phy9-ch2",
                      name: "Force & Laws of Motion",
                      topics: [
                        { id: "phy9-t3", name: "Newton’s First Law", mastery: 52 },
                        { id: "phy9-t4", name: "Momentum", mastery: 48 }
                      ]
                    }
                  ]
                },
                {
                  id: "phy9-sy2",
                  name: "Term 2",
                  chapters: [
                    {
                      id: "phy9-ch3",
                      name: "Gravitation",
                      topics: [
                        { id: "phy9-t5", name: "Free Fall", mastery: 59 },
                        { id: "phy9-t6", name: "Weight vs Mass", mastery: 64 }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "math9",
              name: "Mathematics",
              syllabus: [
                {
                  id: "math9-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "math9-ch1", name: "Number Systems", topics: [{ id: "math9-t1", name: "Irrational Numbers", mastery: 62 }] },
                    { id: "math9-ch2", name: "Polynomials", topics: [{ id: "math9-t2", name: "Factorisation", mastery: 57 }] }
                  ]
                },
                {
                  id: "math9-sy2",
                  name: "Term 2",
                  chapters: [
                    { id: "math9-ch3", name: "Coordinate Geometry", topics: [{ id: "math9-t3", name: "Cartesian Plane", mastery: 65 }] }
                  ]
                }
              ]
            },
            {
              id: "chem9",
              name: "Chemistry",
              syllabus: [
                {
                  id: "chem9-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "chem9-ch1", name: "Matter in Our Surroundings", topics: [{ id: "chem9-t1", name: "States of Matter", mastery: 60 }] },
                    { id: "chem9-ch2", name: "Is Matter Around Us Pure", topics: [{ id: "chem9-t2", name: "Mixtures vs Compounds", mastery: 58 }] }
                  ]
                }
              ]
            },
            {
              id: "eng9",
              name: "English",
              syllabus: [
                {
                  id: "eng9-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "eng9-ch1", name: "Grammar Basics", topics: [{ id: "eng9-t1", name: "Tenses", mastery: 72 }] },
                    { id: "eng9-ch2", name: "Writing", topics: [{ id: "eng9-t2", name: "Formal Letters", mastery: 69 }] }
                  ]
                }
              ]
            },
            {
              id: "cs9",
              name: "Computer Science",
              syllabus: [
                {
                  id: "cs9-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "cs9-ch1", name: "Computational Thinking", topics: [{ id: "cs9-t1", name: "Flowcharts", mastery: 63 }] },
                    { id: "cs9-ch2", name: "Python Basics", topics: [{ id: "cs9-t2", name: "Variables & Types", mastery: 66 }] }
                  ]
                }
              ]
            }
          ],
          students: [
            { id: "c9-s1", name: "Ira", mastery: 62 },
            { id: "c9-s2", name: "Rudra", mastery: 57 },
            { id: "c9-s3", name: "Tara", mastery: 71 },
            { id: "c9-s4", name: "Dhruv", mastery: 54 },
            { id: "c9-s5", name: "Meera", mastery: 66 },
            { id: "c9-s6", name: "Aarav", mastery: 59 },
            { id: "c9-s7", name: "Vihaan", mastery: 63 },
            { id: "c9-s8", name: "Sana", mastery: 68 },
            { id: "c9-s9", name: "Aisha", mastery: 52 },
            { id: "c9-s10", name: "Reyansh", mastery: 60 },
            { id: "c9-s11", name: "Divya", mastery: 73 },
            { id: "c9-s12", name: "Jay", mastery: 58 }
          ],
          teachers: [
            { id: "c9-t1", name: "Mr. Nikhil", score: 84, subject: "Physics", experience: "6 years" },
            { id: "c9-t2", name: "Ms. Rhea", score: 86, subject: "Mathematics", experience: "7 years" },
            { id: "c9-t3", name: "Mrs. Anu", score: 80, subject: "English", experience: "9 years" },
            { id: "c9-t4", name: "Mr. Dev", score: 78, subject: "Computer Science", experience: "4 years" }
          ]
        },

        /* ----------------------- Class 10 (expanded) ----------------------- */
        {
          id: "cls10",
          name: "Class 10 AI Tech",
          subjects: [
            {
              id: "phy",
              name: "Physics",
              syllabus: [
                {
                  id: "sy1",
                  name: "Term 1",
                  chapters: [
                    {
                      id: "phy-ch1",
                      name: "Kinematics",
                      topics: [
                        { id: "t1", name: "Displacement vs Distance", mastery: 72 },
                        { id: "t2", name: "Speed vs Velocity", mastery: 58 }
                      ]
                    },
                    {
                      id: "phy-ch2",
                      name: "Laws of Motion",
                      topics: [
                        { id: "t3", name: "Newton's Laws", mastery: 40 },
                        { id: "t4", name: "Friction", mastery: 66 }
                      ]
                    }
                  ]
                },
                {
                  id: "sy2",
                  name: "Term 2",
                  chapters: [
                    { id: "phy-ch3", name: "Work & Energy", topics: [{ id: "t5", name: "Work", mastery: 78 }] }
                  ]
                }
              ]
            },
            {
              id: "math",
              name: "Mathematics",
              syllabus: [
                {
                  id: "m-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "m-ch1", name: "Real Numbers", topics: [{ id: "mt1", name: "Euclid's Lemma", mastery: 50 }] },
                    { id: "m-ch2", name: "Polynomials", topics: [{ id: "mt2", name: "Quadratic", mastery: 62 }] }
                  ]
                },
                {
                  id: "m-sy2",
                  name: "Term 2",
                  chapters: [
                    { id: "m-ch3", name: "Trigonometry", topics: [{ id: "mt3", name: "Heights & Distances", mastery: 55 }] }
                  ]
                }
              ]
            },
            {
              id: "chem10",
              name: "Chemistry",
              syllabus: [
                {
                  id: "chem10-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "chem10-ch1", name: "Chemical Reactions", topics: [{ id: "chem10-t1", name: "Balancing Equations", mastery: 64 }] },
                    { id: "chem10-ch2", name: "Acids, Bases & Salts", topics: [{ id: "chem10-t2", name: "pH Scale", mastery: 70 }] }
                  ]
                }
              ]
            },
            {
              id: "eng10",
              name: "English",
              syllabus: [
                {
                  id: "eng10-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "eng10-ch1", name: "Reading Skills", topics: [{ id: "eng10-t1", name: "Comprehension", mastery: 76 }] },
                    { id: "eng10-ch2", name: "Writing Skills", topics: [{ id: "eng10-t2", name: "Report Writing", mastery: 68 }] }
                  ]
                }
              ]
            },
            {
              id: "cs10",
              name: "Computer Science",
              syllabus: [
                {
                  id: "cs10-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "cs10-ch1", name: "Python Programming", topics: [{ id: "cs10-t1", name: "Loops", mastery: 71 }] },
                    { id: "cs10-ch2", name: "Data Handling", topics: [{ id: "cs10-t2", name: "Lists & Dicts", mastery: 66 }] }
                  ]
                }
              ]
            }
          ],
          students: [
            { id: "stu1", name: "Anaya", mastery: 68 },
            { id: "stu2", name: "Kabir", mastery: 61 },
            { id: "stu3", name: "Zara", mastery: 77 },
            { id: "stu4", name: "Ishan", mastery: 54 },
            { id: "stu5", name: "Aditi", mastery: 73 },
            { id: "stu6", name: "Rohit", mastery: 63 },
            { id: "stu7", name: "Nisha", mastery: 69 },
            { id: "stu8", name: "Varun", mastery: 57 },
            { id: "stu9", name: "Maya", mastery: 71 },
            { id: "stu10", name: "Karan", mastery: 65 },
            { id: "stu11", name: "Neel", mastery: 58 },
            { id: "stu12", name: "Riya", mastery: 76 }
          ],
          teachers: [
            { id: "tch1", name: "Ms. Kavya", score: 88, subject: "Physics", experience: "5 years" },
            { id: "tch2", name: "Mr. Arjun", score: 82, subject: "Mathematics", experience: "8 years" },
            { id: "tch3", name: "Mrs. Isha", score: 91, subject: "Chemistry", experience: "6 years" },
            { id: "tch4", name: "Ms. Neha", score: 87, subject: "English", experience: "7 years" },
            { id: "tch5", name: "Mr. Kunal", score: 83, subject: "Computer Science", experience: "4 years" }
          ]
        },

        /* ----------------------- Class 11 ----------------------- */
        {
          id: "cls11",
          name: "Class 11 AI Tech",
          subjects: [
            {
              id: "phy11",
              name: "Physics",
              syllabus: [
                {
                  id: "phy11-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "phy11-ch1", name: "Units & Measurements", topics: [{ id: "phy11-t1", name: "Significant Figures", mastery: 67 }] },
                    { id: "phy11-ch2", name: "Kinematics (Advanced)", topics: [{ id: "phy11-t2", name: "Relative Motion", mastery: 62 }] }
                  ]
                }
              ]
            },
            {
              id: "math11",
              name: "Mathematics",
              syllabus: [
                {
                  id: "math11-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "math11-ch1", name: "Sets & Functions", topics: [{ id: "math11-t1", name: "Binary Operations", mastery: 58 }] },
                    { id: "math11-ch2", name: "Trigonometric Functions", topics: [{ id: "math11-t2", name: "Trigonometric Identities", mastery: 64 }] }
                  ]
                }
              ]
            },
            {
              id: "chem11",
              name: "Chemistry",
              syllabus: [
                {
                  id: "chem11-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "chem11-ch1", name: "Structure of Atom", topics: [{ id: "chem11-t1", name: "Quantum Numbers", mastery: 56 }] },
                    { id: "chem11-ch2", name: "Thermodynamics", topics: [{ id: "chem11-t2", name: "Enthalpy & Entropy", mastery: 53 }] }
                  ]
                }
              ]
            },
            {
              id: "cs11",
              name: "Computer Science",
              syllabus: [
                {
                  id: "cs11-sy1",
                  name: "Term 1",
                  chapters: [
                    { id: "cs11-ch1", name: "Programming in Python", topics: [{ id: "cs11-t1", name: "Functions & Modules", mastery: 61 }] },
                    { id: "cs11-ch2", name: "OOP Basics", topics: [{ id: "cs11-t2", name: "Classes & Objects", mastery: 58 }] }
                  ]
                }
              ]
            }
          ],
          students: [
            { id: "c11-s1", name: "Rohan", mastery: 64 },
            { id: "c11-s2", name: "Siddhi", mastery: 72 },
            { id: "c11-s3", name: "Harsh", mastery: 59 },
            { id: "c11-s4", name: "Keerthi", mastery: 61 },
            { id: "c11-s5", name: "Manav", mastery: 55 },
            { id: "c11-s6", name: "Ishita", mastery: 69 },
            { id: "c11-s7", name: "Ritika", mastery: 74 },
            { id: "c11-s8", name: "Saket", mastery: 63 },
            { id: "c11-s9", name: "Om", mastery: 57 },
            { id: "c11-s10", name: "Pia", mastery: 71 }
          ],
          teachers: [
            { id: "c11-t1", name: "Dr. Mehul", score: 90, subject: "Physics", experience: "10 years" },
            { id: "c11-t2", name: "Ms. Natasha", score: 85, subject: "Mathematics", experience: "9 years" },
            { id: "c11-t3", name: "Mr. Farhan", score: 79, subject: "Computer Science", experience: "5 years" }
          ]
        }
      ]
    }
  ],

  /* -------- Institutes (kept original; added one more batch numbers for richness) -------- */
  institutes: [
    {
      id: "inst1",
      name: "Nexus AI Tech Institute",
      batches: ["Alpha", "Bravo", "Charlie"],
      courses: [
        {
          id: "jee-found",
          name: "JEE Foundation",
          batches: {
            Alpha: { avgScore: 65, videoDrop: [10, 20, 35, 25, 10] },
            Bravo: { avgScore: 72, videoDrop: [8, 16, 30, 28, 18] },
            Charlie: { avgScore: 69, videoDrop: [12, 22, 31, 24, 11] }
          },
          subjects: [
            {
              id: "chem",
              name: "Chemistry",
              chapters: [
                { id: "ch-ch1", name: "Atomic Structure", topics: [{ id: "ct1", name: "Bohr Model", mastery: 55 }] },
                { id: "ch-ch2", name: "Periodic Table", topics: [{ id: "ct2", name: "Trends", mastery: 47 }] }
              ]
            },
            {
              id: "phy",
              name: "Physics",
              chapters: [
                { id: "i-ph1", name: "Vectors", topics: [{ id: "i-pt1", name: "Dot Product", mastery: 60 }] }
              ]
            }
          ]
        }
      ]
    }
  ],

  /* -------- Colleges (kept original) -------- */
  colleges: [
    {
      id: "col1",
      name: "Quantum AI Tech College",
      semesters: [
        {
          id: "sem1",
          name: "Semester 1",
          subjects: [
            {
              id: "calc",
              name: "Calculus",
              chapters: [
                { id: "c-ch1", name: "Limits", topics: [{ id: "c-t1", name: "Epsilon-Delta", mastery: 35 }] },
                { id: "c-ch2", name: "Derivatives", topics: [{ id: "c-t2", name: "Chain Rule", mastery: 60 }] }
              ],
              compliance: { covered: 7, planned: 12 }
            },
            {
              id: "prog",
              name: "Programming 101",
              chapters: [
                { id: "p-ch1", name: "Basics", topics: [{ id: "p-t1", name: "Variables", mastery: 68 }] }
              ],
              compliance: { covered: 4, planned: 8 }
            }
          ],
          labLog: [
            { id: "lab1", exp: "Ohm's Law Measurement", completed: true },
            { id: "lab2", exp: "RC Circuit Timing", completed: false }
          ]
        }
      ]
    }
  ],

  /* -------- Teacher (expanded classes) -------- */
  teacher: {
    user: { id: "t1", name: "Ms. Kavya" },
    class: "Class 10 AI Tech",
    subject: "Physics",
    experience: "5 years",
    rating: 4.8,
    totalStudents: 28,
    classes: [
      {
        id: "cls10a",
        name: "Class 10-A AI Tech",
        subject: "Physics",
        students: [
          { id: "stu1", name: "Anaya", mastery: 68 },
          { id: "stu2", name: "Kabir", mastery: 61 },
          { id: "stu3", name: "Zara", mastery: 77 },
          { id: "stu4", name: "Ishan", mastery: 54 },
          { id: "stu10a-5", name: "Mihir", mastery: 63 },
          { id: "stu10a-6", name: "Khushi", mastery: 70 }
        ]
      },
      {
        id: "cls10b",
        name: "Class 10-B AI Tech",
        subject: "Physics",
        students: [
          { id: "stu5", name: "Arjun", mastery: 72 },
          { id: "stu6", name: "Priya", mastery: 85 },
          { id: "stu7", name: "Rohan", mastery: 59 },
          { id: "stu10b-4", name: "Navya", mastery: 66 },
          { id: "stu10b-5", name: "Harshita", mastery: 62 }
        ]
      },
      {
        id: "cls9a",
        name: "Class 9-A AI Tech",
        subject: "Physics",
        students: [
          { id: "c9-s1", name: "Ira", mastery: 62 },
          { id: "c9-s2", name: "Rudra", mastery: 57 },
          { id: "c9-s3", name: "Tara", mastery: 71 },
          { id: "c9-s4", name: "Dhruv", mastery: 54 }
        ]
      }
    ],
    syllabusProgress: [
      { topic: "Kinematics", planned: 10, covered: 8, mastery: 65 },
      { topic: "Laws of Motion", planned: 8, covered: 6, mastery: 52 },
      { topic: "Work & Energy", planned: 12, covered: 9, mastery: 71 }
    ],
    recentActivity: [
      { date: "2024-08-20", activity: "Uploaded notes for Newton's Laws" },
      { date: "2024-08-19", activity: "Conducted doubt clearing session" },
      { date: "2024-08-18", activity: "Graded weekly assessment" }
    ]
  },

  /* -------- Parent & Student (kept original) -------- */
  parent: {
    user: { id: "p1", name: "Parent: Riya" },
    children: [
      {
        id: "child1",
        name: "Anaya (Class 10 AI Tech)",
        mastery: 68,
        radar: { Physics: 55, Math: 70, Chemistry: 72, English: 80, History: 62 },
        digest: ["Completed 2 topics", "Needs focus on Newton's Laws"],
        alerts: ["Missed 1 homework in Math"]
      },
      {
        id: "child2",
        name: "Kabir (Class 8 AI Tech)",
        mastery: 74,
        radar: { Physics: 65, Math: 78, Chemistry: 60, English: 75, History: 70 },
        digest: ["Good weekly consistency", "Try tougher MCQs in Math"],
        alerts: []
      }
    ]
  },

  student: {
    user: { id: "sUsr1", name: "Anaya" },
    class: "Class 10 AI Tech",
    xp: 120,
    streak: 4,
    subjects: [
      { id: "s-phy", name: "Physics", mastery: 59 },
      { id: "s-math", name: "Mathematics", mastery: 67 },
      { id: "s-chem", name: "Chemistry", mastery: 72 }
    ],
    recentTopics: [
      { id: "rt1", title: "Speed vs Velocity", mastery: 58 },
      { id: "rt2", title: "Newton's Laws", mastery: 40 }
    ],
    flashcards: [
      {
        id: "f1",
        front: "What is Newton's First Law?",
        back: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
        subject: "Physics",
        mastery: 65
      },
      {
        id: "f2",
        front: "Define Velocity",
        back: "Velocity is displacement per unit time in a specific direction. It's a vector quantity.",
        subject: "Physics",
        mastery: 80
      },
      {
        id: "f3",
        front: "What is the quadratic formula?",
        back: "x = (-b ± √(b²-4ac)) / 2a",
        subject: "Mathematics",
        mastery: 45
      }
    ],
    previousYearQuestions: [
      { id: "pyq1", year: "2023", subject: "Physics", question: "Derive the equations of motion for uniform acceleration.", difficulty: "Medium", solved: true },
      { id: "pyq2", year: "2022", subject: "Mathematics", question: "Solve the quadratic equation: x² - 5x + 6 = 0", difficulty: "Easy", solved: false },
      { id: "pyq3", year: "2023", subject: "Physics", question: "Explain the concept of friction and its types.", difficulty: "Easy", solved: true }
    ],
    interviewQuestions: [
      { id: "iq1", category: "Technical", question: "Explain the difference between HTTP and HTTPS", difficulty: "Medium", practiced: false },
      { id: "iq2", category: "Behavioral", question: "Tell me about a time you overcame a challenge", difficulty: "Easy", practiced: true },
      { id: "iq3", category: "Technical", question: "What is Object-Oriented Programming?", difficulty: "Medium", practiced: false }
    ]
  }
};


// -------------------------------------------------- Styles (inline to stay single‑file & Canva‑friendly)
const S = {
  app: { fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial", background: "#f7fafc", color: "#0f172a", minHeight: "100vh" },
  wrap: { maxWidth: 1220, margin: "0 auto", padding: 16 },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  roleBtn: (active) => ({ padding: "8px 12px", borderRadius: 999, border: "1px solid #e2e8f0", background: active ? "#1d4ed8" : "#fff", color: active ? "#fff" : "#0f172a", cursor: "pointer" }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  gridLeft: { display: "grid", gridTemplateColumns: "280px 1fr", gap: 12 },
  card: { background: "#fff", borderRadius: 14, boxShadow: "0 6px 20px rgba(2,6,23,0.06)", padding: 14 },
  small: { fontSize: 12, color: "#475569" },
  pill: { display: "inline-block", padding: "4px 8px", background: "#eef2ff", borderRadius: 999, fontSize: 12 },
  kpi: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
  kpiItem: { background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 2px 8px rgba(2,6,23,0.05)" },
  listBtn: (active) => ({ display: "block", width: "100%", textAlign: "left", padding: 8, borderRadius: 10, border: "1px solid #e2e8f0", background: active ? "#eef2ff" : "#fff", cursor: "pointer", marginTop: 6 }),
  flashcard: { minHeight: 200, perspective: "1000px", cursor: "pointer" },
  flashcardInner: (flipped) => ({ position: "relative", width: "100%", height: "200px", textAlign: "center", transition: "transform 0.6s", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }),
  flashcardFace: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff" },
  flashcardBack: { transform: "rotateY(180deg)" },
  codeEditor: { fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace", fontSize: 14, background: "#1e1e1e", color: "#d4d4d4", border: "none", borderRadius: 8, padding: 12, minHeight: 300, resize: "vertical" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 12, color: "#64748b", padding: 8, borderBottom: "1px solid #e2e8f0" },
  td: { padding: 8, borderBottom: "1px solid #f1f5f9", fontSize: 13 },
};

// -------------------------------------------------- UI Atoms
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
      <circle cx={c} cy={c} r={r} stroke="#6366f1" strokeWidth="10" fill="none" strokeDasharray={dash + " " + rest} strokeLinecap="round" transform={"rotate(-90 " + c + " " + c + ")"} />
      <text x={c} y={c + 4} textAnchor="middle" fontSize="14" fontWeight="700">{pct + "%"}</text>
    </svg>
  );
}

function SimpleBar({ series, height }) {
  const max = Math.max.apply(null, series);
  const h = height;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: h }}>
      {series.map((v, i) => {
        const bh = Math.round((v / Math.max(1, max)) * (h - 20));
        return (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: 20, height: bh + "px", background: "#22c55e", borderRadius: 6, marginBottom: 6 }} />
            <div style={{ fontSize: 11, color: "#64748b" }}>{"P" + (i + 1)}</div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------- Helpers
function avg(values) { if (!values.length) return 0; return Math.round(values.reduce((a,b)=>a+b,0)/values.length); }
function avgMasteryTopicsFromChapters(chapters) {
  const topics = [];
  chapters.forEach((c) => c.topics.forEach((t) => topics.push(t.mastery)));
  if (topics.length === 0) return 0;
  return avg(topics);
}
function avgMasterySubjectWithSyllabus(subject) {
  const chapters = [];
  subject.syllabus.forEach((sy) => sy.chapters.forEach((c) => chapters.push(c)));
  return avgMasteryTopicsFromChapters(chapters);
}
function avgMasteryClass(cls) {
  const allTopics = [];
  cls.subjects.forEach((s) => s.syllabus.forEach((sy) => sy.chapters.forEach((c) => c.topics.forEach((t) => allTopics.push(t.mastery)))));
  if (allTopics.length === 0) return 0;
  return avg(allTopics);
}

// -------------------------------------------------- Student Features (unchanged components)
function FlashcardView({ flashcards, onMasteryUpdate }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = ["All", ...new Set(flashcards.map(f => f.subject))];
  const filteredCards = selectedSubject === "All" ? flashcards : flashcards.filter(f => f.subject === selectedSubject);

  const handleKnow = (know) => {
    const card = filteredCards[currentCard];
    const masteryChange = know ? 10 : -5;
    onMasteryUpdate(card.id, masteryChange);
    setFlipped(false);
    setCurrentCard((currentCard + 1) % filteredCards.length);
  };

  if (filteredCards.length === 0) return <div>No flashcards available</div>;

  const card = filteredCards[currentCard];

  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>Flashcards</div>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <span style={S.small}>{currentCard + 1} of {filteredCards.length} • {card.subject}</span>
      </div>

      <div style={S.flashcard} onClick={() => setFlipped(!flipped)}>
        <div style={S.flashcardInner(flipped)}>
          <div style={S.flashcardFace}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Question</div>
              <div>{card.front}</div>
            </div>
          </div>
          <div style={{...S.flashcardFace, ...S.flashcardBack}}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Answer</div>
              <div>{card.back}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <div style={S.small}>Mastery: {card.mastery}%</div>
        <Progress value={card.mastery} />
      </div>

      {flipped && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
          <button onClick={() => handleKnow(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ef4444", background: "#fef2f2", color: "#ef4444" }}>Don't Know</button>
          <button onClick={() => handleKnow(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #16a34a", background: "#f0fdf4", color: "#16a34a" }}>Know It</button>
        </div>
      )}
    </div>
  );
}

function PreviousYearQuestions({ questions, onSolveToggle }) {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const years = ["All", ...new Set(questions.map(q => q.year))];
  const subjects = ["All", ...new Set(questions.map(q => q.subject))];
  const filteredQuestions = questions.filter(q => (selectedYear === "All" || q.year === selectedYear) && (selectedSubject === "All" || q.subject === selectedSubject));
  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>Previous Year Questions</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {filteredQuestions.map(q => (
          <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={S.pill}>{q.year}</span>
                <span style={S.pill}>{q.subject}</span>
                <span style={{ ...S.pill, background: q.difficulty === "Easy" ? "#dcfce7" : q.difficulty === "Medium" ? "#fef3c7" : "#fecaca" }}>{q.difficulty}</span>
              </div>
              <button onClick={() => onSolveToggle(q.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", background: q.solved ? "#dcfce7" : "#fff", color: q.solved ? "#16a34a" : "#0f172a" }}>{q.solved ? "Solved" : "Mark Solved"}</button>
            </div>
            <div>{q.question}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InterviewQuestions({ questions, onPracticeToggle }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...new Set(questions.map(q => q.category))];
  const filteredQuestions = selectedCategory === "All" ? questions : questions.filter(q => q.category === selectedCategory);
  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>Interview Questions</div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {filteredQuestions.map(q => (
          <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={S.pill}>{q.category}</span>
                <span style={{ ...S.pill, background: q.difficulty === "Easy" ? "#dcfce7" : q.difficulty === "Medium" ? "#fef3c7" : "#fecaca" }}>{q.difficulty}</span>
              </div>
              <button onClick={() => onPracticeToggle(q.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", background: q.practiced ? "#dcfce7" : "#fff", color: q.practiced ? "#16a34a" : "#0f172a" }}>{q.practiced ? "Practiced" : "Practice"}</button>
            </div>
            <div>{q.question}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeEditor() {
  const [code, setCode] = useState(`# Python Code Editor\n# (Mock execution output)\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(10):\n    print(f"F({i}) = {fibonacci(i)}")`);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const runCode = () => {
    if (language === "python") setOutput("F(0) = 0\nF(1) = 1\nF(2) = 1\nF(3) = 2\nF(4) = 3\nF(5) = 5\n...");
    else setOutput("Code execution simulation - replace with real runner");
  };
  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>Code Editor</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button onClick={runCode} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#16a34a", color: "#fff" }}>Run Code</button>
        </div>
      </div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} style={S.codeEditor} placeholder="Write your code here..." />
      {output && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Output:</div>
          <div style={{ background: "#1e1e1e", color: "#d4d4d4", padding: 12, borderRadius: 8, fontFamily: "Monaco, monospace", fontSize: 12, whiteSpace: "pre-line" }}>{output}</div>
        </div>
      )}
    </div>
  );
}

function VoiceInterviewer() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const interviewQuestions = [
    "Tell me about yourself and your background.",
    "What are your strengths and weaknesses?",
    "Why are you interested in this field?",
    "Describe a challenging project you worked on.",
    "Where do you see yourself in 5 years?"
  ];
  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      alert("Recording stopped. Analysis: Good eye contact, clear speech. Try to elaborate more on technical details.");
    }, 2000);
  };
  const playQuestion = () => { setIsPlaying(true); setTimeout(() => setIsPlaying(false), 1200); };
  return (
    <div style={S.card}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Voice Interviewer</div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Question {currentQuestion + 1} of {interviewQuestions.length}</div>
        <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, marginBottom: 12 }}>{interviewQuestions[currentQuestion]}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          <button onClick={playQuestion} disabled={isPlaying} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #3b82f6", background: isPlaying ? "#e5e7eb" : "#3b82f6", color: isPlaying ? "#6b7280" : "#fff" }}>{isPlaying ? "Playing..." : "🔊 Play Question"}</button>
          <button onClick={startRecording} disabled={isRecording} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ef4444", background: isRecording ? "#ef4444" : "#fff", color: isRecording ? "#fff" : "#ef4444" }}>{isRecording ? "🎤 Recording..." : "🎤 Start Answer"}</button>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e2e8f0" }}>Previous</button>
          <button onClick={() => setCurrentQuestion(Math.min(interviewQuestions.length - 1, currentQuestion + 1))} disabled={currentQuestion === interviewQuestions.length - 1} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e2e8f0" }}>Next</button>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>AI Feedback Tips:</div>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          <li>Maintain good eye contact with the camera</li>
          <li>Speak clearly and at a moderate pace</li>
          <li>Use the STAR method for behavioral questions</li>
          <li>Practice technical explanations with examples</li>
        </ul>
      </div>
    </div>
  );
}

// -------------------------------------------------- Teacher View
function TeacherView({ data }) {
  const teacher = data.teacher;
  const [selectedClassId, setSelectedClassId] = useState(teacher.classes[0]?.id);
  const selectedClass = teacher.classes.find(c => c.id === selectedClassId) || teacher.classes[0];

  const totalStudents = teacher.classes.reduce((sum, cls) => sum + cls.students.length, 0);
  const avgMastery = useMemo(() => {
    const allMasteries = teacher.classes.flatMap(cls => cls.students.map(s => s.mastery));
    return allMasteries.length > 0 ? avg(allMasteries) : 0;
  }, [teacher.classes]);
  const atRiskStudents = teacher.classes.flatMap(cls => cls.students.filter(s => s.mastery < 60));
  const syllabusCompletion = useMemo(() => {
    const totalPlanned = teacher.syllabusProgress.reduce((sum, topic) => sum + topic.planned, 0);
    const totalCovered = teacher.syllabusProgress.reduce((sum, topic) => sum + topic.covered, 0);
    return totalPlanned > 0 ? Math.round((totalCovered / totalPlanned) * 100) : 0;
  }, [teacher.syllabusProgress]);

  return (
    <div>
      {/* Header */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Welcome {teacher.user.name}</div>
            <div style={S.small}>Teacher Dashboard • {teacher.subject} • {teacher.experience} experience</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#f59e0b" }}>⭐</span>
              <span style={{ fontWeight: 600 }}>{teacher.rating}</span>
            </div>
            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              {teacher.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

      {/* Main Content */}
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
                {selectedClass.students.map(stu => (
                  <tr key={stu.id}>
                    <td style={S.td}>{stu.name}</td>
                    <td style={S.td}><div style={{ width: 120 }}><Progress value={stu.mastery} /></div></td>
                    <td style={S.td}>
                      <span style={{
                        ...S.pill,
                        background: stu.mastery >= 70 ? "#dcfce7" : stu.mastery >= 60 ? "#fef3c7" : "#fecaca",
                        color: stu.mastery >= 70 ? "#16a34a" : stu.mastery >= 60 ? "#d97706" : "#dc2626"
                      }}>
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
                    <div style={S.small}>{topic.covered}/{topic.planned} lessons</div>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <Progress value={(topic.covered / topic.planned) * 100} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={S.small}>Class Mastery: {topic.mastery}%</div>
                    <button style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                      Update Progress
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tools & Activities */}
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
                {atRiskStudents.slice(0, 3).map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fee2e2", background: "#fef2f2", padding: 8, borderRadius: 10 }}>
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
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, background: "#f8fafc" }}>
                  <div style={{ fontSize: 13 }}>{activity.activity}</div>
                  <div style={{ ...S.small, fontSize: 11 }}>{activity.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------- School Admin UI (attendance removed)
function AdminSchoolInstitute({ data }) {
  const school = data.schools[0];
  const [selectedClassId, setSelectedClassId] = useState(school.classes[0]?.id);
  const cls = school.classes.find(c => c.id === selectedClassId) || school.classes[0];
  const [selectedSubjectId, setSelectedSubjectId] = useState(cls.subjects[0]?.id);
  const subject = cls.subjects.find(s => s.id === selectedSubjectId) || cls.subjects[0];

  const classAvgMastery = useMemo(() => avgMasteryClass(cls), [cls]);
  const teacherAvg = useMemo(() => avg(cls.teachers.map(t => t.score)), [cls]);
  const atRisk = useMemo(() => cls.students.filter(s => s.mastery < 60), [cls]);

  return (
    <div>
      {/* Header */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{school.name}</div>
            <div style={S.small}>School Admin • Manage classes, teachers, students</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={selectedClassId} onChange={(e)=>{ setSelectedClassId(e.target.value); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              {school.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={selectedSubjectId} onChange={(e)=>setSelectedSubjectId(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              {cls.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={S.kpi}>
        <div style={S.kpiItem}>
          <div style={S.small}>Class Avg Mastery</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <Ring value={classAvgMastery} size={90} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{classAvgMastery}%</div>
              <div style={S.small}>Across all subjects</div>
            </div>
          </div>
        </div>
        <div style={S.kpiItem}>
          <div style={S.small}>Total Students</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{cls.students.length}</div>
          <div style={S.small}>In {cls.name}</div>
        </div>
        <div style={S.kpiItem}>
          <div style={S.small}>Teacher Effectiveness</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{teacherAvg}</div>
          <div style={S.small}>Average score</div>
        </div>
        <div style={S.kpiItem}>
          <div style={S.small}>At‑risk Students</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{atRisk.length}</div>
          <div style={S.small}>Needs attention</div>
        </div>
      </div>

      {/* Two‑column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12, marginTop: 12 }}>
        {/* Left: Subject Drilldown */}
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Subject • {subject.name}</div>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 12 }}>
            <div>
              {(subject.syllabus || []).map((sy) => (
                <div key={sy.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{sy.name}</div>
                  {sy.chapters.map(ch => (
                    <div key={ch.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 8, marginBottom: 6 }}>
                      <div style={{ fontWeight: 600 }}>{ch.name}</div>
                      <div style={{ marginTop: 6 }}>
                        {ch.topics.map(tp => (
                          <div key={tp.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 4 }}>
                            <div style={{ fontSize: 13 }}>{tp.name}</div>
                            <div style={{ width: 120 }}><Progress value={tp.mastery} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Interventions</div>
                <ul style={{ paddingLeft: 16, margin: 0, lineHeight: 1.8 }}>
                  <li>Auto‑assign <b>remedial MCQs</b> for topics &lt; 60% mastery</li>
                  <li>Schedule <b>doubt clearing</b> with top teacher (score &gt; 85)</li>
                  <li>Send <b>AI-powered practice</b> for weak areas</li>
                </ul>
                <div style={{ marginTop: 10 }}>
                  <button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }}>Generate Plan</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rosters & Insights */}
        <div style={{ display: "grid", gap: 12 }}>
          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Student Roster — {cls.name}</div>
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
                {cls.students.map(stu => (
                  <tr key={stu.id}>
                    <td style={S.td}>{stu.name}</td>
                    <td style={S.td}><div style={{ width: 140 }}><Progress value={stu.mastery} /></div></td>
                    <td style={S.td}>
                      <span style={{
                        ...S.pill,
                        background: stu.mastery >= 70 ? "#dcfce7" : stu.mastery >= 60 ? "#fef3c7" : "#fecaca",
                        color: stu.mastery >= 70 ? "#16a34a" : stu.mastery >= 60 ? "#d97706" : "#dc2626"
                      }}>
                        {stu.mastery >= 70 ? "Good" : stu.mastery >= 60 ? "Average" : "At Risk"}
                      </span>
                    </td>
                    <td style={S.td}><button style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>View Profile</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>At‑risk Students</div>
            {atRisk.length === 0 ? (
              <div style={S.small}>No risks detected 🎉</div>
            ) : (
              <div style={{ display: "grid", gap: 6 }}>
                {atRisk.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fee2e2", background: "#fef2f2", padding: 8, borderRadius: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={S.small}>Mastery {s.mastery}%</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Assign Remedial</button>
                      <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Notify Parent</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Teacher Performance</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {cls.teachers.map(t => (
                <div key={t.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>{t.subject}</div>
                  <div style={{ marginTop: 6 }}>Score: {t.score}</div>
                  <div style={{ marginTop: 6 }}><Progress value={t.score} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------- Parent Admin UI (attendance removed)
function ParentView({ data }) {
  const { user, children } = data.parent;
  const [childId, setChildId] = useState(children[0]?.id);
  const child = children.find(c => c.id === childId) || children[0];

  const subjects = Object.entries(child.radar).map(([name, val]) => ({ name, mastery: val }));

  return (
    <div>
      {/* Header */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{user.name}</div>
            <div style={S.small}>Parent Admin • Track progress & get alerts</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={childId} onChange={(e)=>setChildId(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              {children.map(ch => (<option key={ch.id} value={ch.id}>{ch.name}</option>))}
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
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{Math.floor(child.mastery/10)} days</div>
          <div style={S.small}>Estimated</div>
        </div>
        <div style={S.kpiItem}>
          <div style={S.small}>Next PTM</div>
          <div style={{ fontWeight: 800, fontSize: 16, marginTop: 6 }}>Not scheduled</div>
          <button style={{ marginTop: 6, padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0" }}>Schedule PTM</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12, marginTop: 12 }}>
        {/* Left: Subjects & Digest */}
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Subject Mastery</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {subjects.map(s => (
              <div key={s.name} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={S.small}>{s.mastery}%</div>
                </div>
                <div style={{ marginTop: 6 }}><Progress value={s.mastery} /></div>
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
              {child.digest.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>

        {/* Right: Alerts & Actions */}
        <div style={{ display: "grid", gap: 12 }}>
          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Alerts</div>
            {child.alerts.length === 0 ? (
              <div style={S.small}>No alerts 🎉</div>
            ) : (
              child.alerts.map((a, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fee2e2", background: "#fef2f2", padding: 8, borderRadius: 10, marginBottom: 6 }}>
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
    </div>
  );
}

// -------------------------------------------------- Enhanced Student View
function StudentView({ data }) {
  const st = data.student;
  const [xp, setXp] = useState(st.xp);
  const [streak, setStreak] = useState(st.streak);
  const [focus, setFocus] = useState({ running: false, seconds: 0 });
  const [topics, setTopics] = useState(st.recentTopics);
  const [flashcards, setFlashcards] = useState(st.flashcards);
  const [pyqs, setPyqs] = useState(st.previousYearQuestions);
  const [interviewQs, setInterviewQs] = useState(st.interviewQuestions);
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentMCQ, setCurrentMCQ] = useState(null);
  const [mcqIdx, setMcqIdx] = useState(0);

  const mcqs = [
    { q: "Speed vs Velocity — which is vector?", options: ["Speed", "Velocity"], a: 1, topicId: "rt1" },
    { q: "Which law explains inertia?", options: ["Newton I", "Newton II", "Newton III"], a: 0, topicId: "rt2" }
  ];

  useEffect(() => {
    let id = null;
    if (focus.running) { id = setInterval(() => setFocus(p => ({ ...p, seconds: p.seconds + 1 })), 1000); }
    return () => { if (id) clearInterval(id); };
  }, [focus.running]);

  const weak = topics.filter((t) => t.mastery < 60);

  function handleAnswer(idx) {
    const q = mcqs[mcqIdx];
    const correct = idx === q.a;
    const up = topics.map(t => {
      if (t.id === q.topicId) {
        let m = t.mastery + (correct ? 8 : -3);
        if (m < 0) m = 0; if (m > 100) m = 100;
        return { ...t, mastery: m };
      }
      return t;
    });
    setTopics(up);
    if (correct) setXp(xp + 10);
    setMcqIdx((mcqIdx + 1) % mcqs.length);
    setCurrentMCQ(null);
  }

  function updateFlashcardMastery(cardId, change) {
    setFlashcards(cards => cards.map(c => {
      if (c.id === cardId) {
        let newMastery = c.mastery + change; if (newMastery < 0) newMastery = 0; if (newMastery > 100) newMastery = 100; return { ...c, mastery: newMastery };
      }
      return c;
    }));
  }

  function togglePYQSolved(qId) { setPyqs(questions => questions.map(q => q.id === qId ? { ...q, solved: !q.solved } : q)); }
  function toggleInterviewPracticed(qId) { setInterviewQs(questions => questions.map(q => q.id === qId ? { ...q, practiced: !q.practiced } : q)); }

  function formatTime(sec) { const mm = Math.floor(sec / 60); const ss = sec % 60; const ms = mm < 10 ? "0" + mm : "" + mm; const s2 = ss < 10 ? "0" + ss : "" + ss; return ms + ":" + s2; }

  const viewButtons = [
    { key: "dashboard", label: "Dashboard" },
    { key: "flashcards", label: "Flashcards" },
    { key: "pyq", label: "Previous Year Q" },
    { key: "interview", label: "Interview Q" },
    { key: "code", label: "Code Editor" },
    { key: "voice", label: "Voice Interview" }
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {viewButtons.map(btn => (
          <button key={btn.key} onClick={() => setCurrentView(btn.key)} style={{ ...S.roleBtn(currentView === btn.key), fontSize: 12 }}>{btn.label}</button>
        ))}
      </div>

      {currentView === "dashboard" && (
        <div style={S.grid2}>
          <div>
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Hi {st.user.name}</div>
                  <div style={S.small}>{st.class} • Knowledge Track</div>
                </div>
                <span style={S.pill}>Student</span>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>XP</div>
                  <Ring value={Math.min(100, (xp % 100))} size={120} />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Total XP {xp}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Streak</div>
                  <div style={{ fontWeight: 800, fontSize: 26 }}>{streak + " days"}</div>
                  <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 6 }} onClick={() => setStreak(streak + 1)}>Claim day</button>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Focus Timer</div>
                  <div style={{ fontWeight: 800, fontSize: 26 }}>{formatTime(focus.seconds)}</div>
                  {!focus.running ? (
                    <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 6 }} onClick={() => setFocus({ running: true, seconds: 0 })}>Start</button>
                  ) : (
                    <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 6 }} onClick={() => setFocus({ running: false, seconds: focus.seconds })}>Pause</button>
                  )}
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700 }}>My Subjects</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 8 }}>
                {st.subjects.map((s) => (
                  <div key={s.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ marginTop: 6 }}><Progress value={s.mastery} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button onClick={() => setCurrentView("flashcards")} style={{ padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📚 Study Flashcards</button>
                <button onClick={() => setCurrentView("pyq")} style={{ padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }}>📝 Previous Year Questions</button>
                <button onClick={() => setCurrentView("interview")} style={{ padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }}>💼 Interview Practice</button>
                <button onClick={() => setCurrentView("code")} style={{ padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }}>💻 Code Editor</button>
              </div>
            </div>
            <div style={S.card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Strengths & Weaknesses</div>
              <div>
                {weak.length === 0 ? (
                  <div style={S.small}>Looking great! No weak topics detected.</div>
                ) : (
                  weak.map((w) => (
                    <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>{w.title}</div>
                      <div style={{ width: 160 }}><Progress value={w.mastery} /></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "flashcards" && (<FlashcardView flashcards={flashcards} onMasteryUpdate={updateFlashcardMastery} />)}
      {currentView === "pyq" && (<PreviousYearQuestions questions={pyqs} onSolveToggle={togglePYQSolved} />)}
      {currentView === "interview" && (<InterviewQuestions questions={interviewQs} onPracticeToggle={toggleInterviewPracticed} />)}
      {currentView === "code" && <CodeEditor />}
      {currentView === "voice" && <VoiceInterviewer />}
    </div>
  );
}

// -------------------------------------------------- Root Component
export default function QboxaiDashboardPro() {
  const [role, setRole] = useState("student"); // Default to student to showcase features

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={S.top}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Your AI Tech School</div>
            <div style={S.small}>School Admin • Teacher Dashboard • Parent Admin • Student Pro Toolkit</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setRole("school")} style={S.roleBtn(role === "school")}>School Admin</button>
            <button onClick={() => setRole("teacher")} style={S.roleBtn(role === "teacher")}>Teacher</button>
            <button onClick={() => setRole("student")} style={S.roleBtn(role === "student")}>Student ⭐</button>
            <button onClick={() => setRole("parent")} style={S.roleBtn(role === "parent")}>Parent</button>
          </div>
        </div>

        {role === "school" && <AdminSchoolInstitute data={MOCK} />}
        {role === "teacher" && <TeacherView data={MOCK} />}
        {role === "student" && <StudentView data={MOCK} />}
        {role === "parent" && <ParentView data={MOCK} />}

        <div style={{ marginTop: 16, color: "#94a3b8", fontSize: 12 }}>
          🎉 New: AI Tech School branding, Teacher Dashboard added, attendance removed. Student Toolkit includes Flashcards, PYQ, Interview Prep, Code Editor, and Voice Interviewer.
        </div>
      </div>
    </div>
  );
}
