// Data model used by the School Admin page.
// Mirrors MOCK.schools[0] from your combined dashboard.

export const school = {
  id: "sch1",
  name: "Tatva Global AI Tech Schools",
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

    /* ----------------------- Class 10 ----------------------- */
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
              chapters: [{ id: "phy-ch3", name: "Work & Energy", topics: [{ id: "t5", name: "Work", mastery: 78 }] }]
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
              chapters: [{ id: "m-ch3", name: "Trigonometry", topics: [{ id: "mt3", name: "Heights & Distances", mastery: 55 }] }]
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
};
