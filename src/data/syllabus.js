// src/data/syllabus.js
export const TREE_DATA = {
  maths: {
    name: "Mathematics",
    chapters: [
      {
        name: "Chapter 1: NUMBER SYSTEMS",
        topics: ["Representing Real Numbers", "Decimal Expansions"],
      },
      {
        name: "Chapter 2: POLYNOMIALS",
        topics: ["Introduction to Polynomials", "Algebraic Identities"],
      },
    ],
  },
  english: {
    name: "English",
    chapters: [
      {
        name: "Chapter 1: Fiction",
        topics: ["A Dog Named Duke", "Best Seller"],
      },
    ],
  },
  physics: {
    name: "Physics",
    chapters: [
      {
        name: "Chapter 1: Physical Nature of Matter",
        topics: ["Introduction to Matter"],
      },
    ],
  },
};

// optional helpers
export function updateTopic(subjectKey, chapterIndex, topicIndex, newTopicName) {
  if (!TREE_DATA[subjectKey]) return false;
  const chapter = TREE_DATA[subjectKey].chapters?.[chapterIndex];
  if (!chapter) return false;
  chapter.topics[topicIndex] = newTopicName;
  return true;
}

export function addTopic(subjectKey, chapterIndex, topicName) {
  if (!TREE_DATA[subjectKey]) return false;
  const chapter = TREE_DATA[subjectKey].chapters?.[chapterIndex];
  if (!chapter) return false;
  chapter.topics.push(topicName);
  return true;
}

// default export mainly for backward-compatibility
export default {
  TREE_DATA,
  updateTopic,
  addTopic,
};
