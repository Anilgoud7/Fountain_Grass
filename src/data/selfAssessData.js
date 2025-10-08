// src/data/selfAssessData.js
export function selfAssessDataFor(subject) {
  return {
    topics: subject?.topics || [],
  };
}
