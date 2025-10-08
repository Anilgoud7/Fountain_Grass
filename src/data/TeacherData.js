// src/data/teacherData.js

export const teacherData = {
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
};
