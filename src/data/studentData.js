// src/data/studentData.js
export const studentData = {
  id: "stu1",
  user: { name: "Ananya Sharma", email: "ananya@example.edu" },
  subjects: [
    {
      id: "phy10",
      name: "Physics",
      mastery: 61,
      topics: [
        { id: "101", name: "Relative Velocity", mastery: 52 },
        { id: "102", name: "Motion Graphs", mastery: 61 },
        { id: "103", name: "Acceleration & Deceleration", mastery: 49 },
        { id: "104", name: "Newton’s First Law", mastery: 70 },
        { id: "105", name: "Newton’s Second Law", mastery: 55 },
        { id: "106", name: "Newton’s Third Law", mastery: 60 },
        { id: "107", name: "Friction", mastery: 44 },
        { id: "108", name: "Work", mastery: 62 },
        { id: "109", name: "Energy", mastery: 50 },
        { id: "110", name: "Power", mastery: 57 },
      ],
      syllabus: [
        {
          id: "t1",
          name: "Term 1",
          chapters: [
            {
              id: "c1",
              name: "Motion",
              topics: [
                { id: "101", name: "Relative Velocity", mastery: 52 },
                { id: "102", name: "Motion Graphs", mastery: 61 },
              ],
            },
            {
              id: "c2",
              name: "Force & Laws",
              topics: [
                { id: "104", name: "Newton’s First Law", mastery: 70 },
                { id: "105", name: "Newton’s Second Law", mastery: 55 },
                { id: "106", name: "Newton’s Third Law", mastery: 60 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "mat10",
      name: "Maths",
      mastery: 59,
      topics: [
        { id: "201", name: "Euclid’s Division Lemma", mastery: 65 },
        { id: "202", name: "Prime Factorization", mastery: 59 },
        { id: "203", name: "HCF & LCM", mastery: 54 },
        { id: "204", name: "Zeros of Polynomial", mastery: 61 },
        { id: "205", name: "Remainder Theorem", mastery: 48 },
        { id: "206", name: "Factorization", mastery: 50 },
        { id: "207", name: "General Form & Roots", mastery: 60 },
        { id: "208", name: "Discriminant & Nature of Roots", mastery: 52 },
        { id: "209", name: "Applications", mastery: 49 },
      ],
      syllabus: [],
    },
  ],
  recentTopics: [
    { id: "107", title: "Friction", mastery: 44 },
    { id: "103", title: "Acceleration & Deceleration", mastery: 49 },
    { id: "109", title: "Energy", mastery: 50 },
  ],
};
