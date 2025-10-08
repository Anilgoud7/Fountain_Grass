// /src/pages/SchoolAdmin.jsx — API-free with complete mock school data
import React, { useEffect, useMemo, useState } from "react";
import {
  THEME,
  Card,
  Button,
  Select,
  Tag,
  Divider,
  Progress,
  SectionTitle,
  RadioRow,
  Input,
} from "../components/ui";
import { useNavigate } from "react-router-dom";

/** ------------------------------
 *  Complete mock school dataset
 *  ------------------------------ */
const SCHOOL_MOCK = {
  id: "school-1",
  name: "Your AI Tech School",
  classes: [
    {
      id: "10A",
      name: "Class 10 — A",
      teachers: [
        { id: "t1", name: "Alice Johnson" }, // class teacher
        { id: "t2", name: "Rajesh Singh" },  // Mathematics
        { id: "t3", name: "Priya Verma" },   // Science
        { id: "t4", name: "David Chen" },    // English
      ],
      students: [
        { id: "s101", name: "Aman Sharma", mastery: 58 },
        { id: "s102", name: "Neha Gupta", mastery: 74 },
        { id: "s103", name: "Arjun Patel", mastery: 62 },
        { id: "s104", name: "Riya Singh", mastery: 81 },
        { id: "s105", name: "Kabir Mehta", mastery: 47 },
        { id: "s106", name: "Ananya Rao", mastery: 69 },
        { id: "s107", name: "Mohit Kumar", mastery: 55 },
        { id: "s108", name: "Sana Ali", mastery: 77 },
        { id: "s109", name: "Vivaan Joshi", mastery: 63 },
        { id: "s110", name: "Ishita Nair", mastery: 88 },
        { id: "s111", name: "Harsh Vardhan", mastery: 52 },
        { id: "s112", name: "Tanya Malhotra", mastery: 71 },
      ],
      subjects: [
        {
          id: "subj_m10a",
          name: "Mathematics",
          teacherId: "t2",
          syllabus: [
            {
              id: "m-term1",
              name: "Term 1",
              chapters: [
                {
                  id: "m-ch1",
                  name: "Algebra Essentials",
                  topics: [
                    { id: "m-t1", name: "Linear Equations", mastery: 52 },
                    { id: "m-t2", name: "Quadratic Equations", mastery: 68 },
                    { id: "m-t3", name: "Polynomials", mastery: 61 },
                  ],
                },
                {
                  id: "m-ch2",
                  name: "Geometry Basics",
                  topics: [
                    { id: "m-t4", name: "Triangles", mastery: 72 },
                    { id: "m-t5", name: "Circles", mastery: 59 },
                  ],
                },
              ],
            },
            {
              id: "m-term2",
              name: "Term 2",
              chapters: [
                {
                  id: "m-ch3",
                  name: "Trigonometry",
                  topics: [
                    { id: "m-t6", name: "Ratios & Identities", mastery: 65 },
                    { id: "m-t7", name: "Heights & Distances", mastery: 57 },
                  ],
                },
                {
                  id: "m-ch4",
                  name: "Statistics & Probability",
                  topics: [
                    { id: "m-t8", name: "Mean/Median/Mode", mastery: 78 },
                    { id: "m-t9", name: "Probability Basics", mastery: 54 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "subj_s10a",
          name: "Science",
          teacherId: "t3",
          syllabus: [
            {
              id: "s-term1",
              name: "Term 1",
              chapters: [
                {
                  id: "s-ch1",
                  name: "Physics — Motion",
                  topics: [
                    { id: "s-t1", name: "Kinematics", mastery: 60 },
                    { id: "s-t2", name: "Newton’s Laws", mastery: 58 },
                  ],
                },
                {
                  id: "s-ch2",
                  name: "Chemistry — Reactions",
                  topics: [
                    { id: "s-t3", name: "Balancing Equations", mastery: 73 },
                    { id: "s-t4", name: "Acids & Bases", mastery: 64 },
                  ],
                },
              ],
            },
            {
              id: "s-term2",
              name: "Term 2",
              chapters: [
                {
                  id: "s-ch3",
                  name: "Biology — Life Processes",
                  topics: [
                    { id: "s-t5", name: "Respiration", mastery: 67 },
                    { id: "s-t6", name: "Nutrition", mastery: 61 },
                  ],
                },
                {
                  id: "s-ch4",
                  name: "Physics — Electricity",
                  topics: [
                    { id: "s-t7", name: "Ohm’s Law", mastery: 55 },
                    { id: "s-t8", name: "Series vs Parallel", mastery: 62 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "subj_e10a",
          name: "English",
          teacherId: "t4",
          syllabus: [
            {
              id: "e-term1",
              name: "Term 1",
              chapters: [
                {
                  id: "e-ch1",
                  name: "Reading Comprehension",
                  topics: [
                    { id: "e-t1", name: "Main Idea", mastery: 74 },
                    { id: "e-t2", name: "Inference", mastery: 66 },
                  ],
                },
                {
                  id: "e-ch2",
                  name: "Grammar Essentials",
                  topics: [
                    { id: "e-t3", name: "Tenses", mastery: 62 },
                    { id: "e-t4", name: "Clauses", mastery: 57 },
                  ],
                },
              ],
            },
            {
              id: "e-term2",
              name: "Term 2",
              chapters: [
                {
                  id: "e-ch3",
                  name: "Writing",
                  topics: [
                    { id: "e-t5", name: "Essay", mastery: 71 },
                    { id: "e-t6", name: "Letter", mastery: 79 },
                  ],
                },
                {
                  id: "e-ch4",
                  name: "Literature",
                  topics: [
                    { id: "e-t7", name: "Poetry Devices", mastery: 64 },
                    { id: "e-t8", name: "Drama Elements", mastery: 60 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "10B",
      name: "Class 10 — B",
      teachers: [
        { id: "tb1", name: "Meera Iyer" },   // class teacher
        { id: "tb2", name: "Suresh Rao" },   // Mathematics
        { id: "tb3", name: "Fatima Khan" },  // Science
        { id: "tb4", name: "Oliver Smith" }, // English
      ],
      students: [
        { id: "s201", name: "Rohan Das", mastery: 73 },
        { id: "s202", name: "Lavanya Iyer", mastery: 65 },
        { id: "s203", name: "Nikhil Jain", mastery: 59 },
        { id: "s204", name: "Diya Menon", mastery: 82 },
        { id: "s205", name: "Sameer Khan", mastery: 49 },
        { id: "s206", name: "Pooja Kulkarni", mastery: 68 },
        { id: "s207", name: "Aditya Roy", mastery: 56 },
        { id: "s208", name: "Mehak Arora", mastery: 77 },
        { id: "s209", name: "Ritika Bose", mastery: 63 },
        { id: "s210", name: "Yash Verma", mastery: 84 },
        { id: "s211", name: "Gauri Desai", mastery: 58 },
        { id: "s212", name: "Vikram Sethi", mastery: 69 },
      ],
      subjects: [
        {
          id: "subj_m10b",
          name: "Mathematics",
          teacherId: "tb2",
          syllabus: [
            {
              id: "mb-term1",
              name: "Term 1",
              chapters: [
                {
                  id: "mb-ch1",
                  name: "Number Systems",
                  topics: [
                    { id: "mb-t1", name: "Real Numbers", mastery: 66 },
                    { id: "mb-t2", name: "Irrational Numbers", mastery: 61 },
                  ],
                },
                {
                  id: "mb-ch2",
                  name: "Coordinate Geometry",
                  topics: [
                    { id: "mb-t3", name: "Distance Formula", mastery: 70 },
                    { id: "mb-t4", name: "Section Formula", mastery: 58 },
                  ],
                },
              ],
            },
            {
              id: "mb-term2",
              name: "Term 2",
              chapters: [
                {
                  id: "mb-ch3",
                  name: "Mensuration",
                  topics: [
                    { id: "mb-t5", name: "Surface Area", mastery: 63 },
                    { id: "mb-t6", name: "Volume", mastery: 57 },
                  ],
                },
                {
                  id: "mb-ch4",
                  name: "Probability",
                  topics: [
                    { id: "mb-t7", name: "Events", mastery: 55 },
                    { id: "mb-t8", name: "Theoretical Probability", mastery: 60 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "subj_s10b",
          name: "Science",
          teacherId: "tb3",
          syllabus: [
            {
              id: "sb-term1",
              name: "Term 1",
              chapters: [
                {
                  id: "sb-ch1",
                  name: "Matter",
                  topics: [
                    { id: "sb-t1", name: "States", mastery: 67 },
                    { id: "sb-t2", name: "Changes of State", mastery: 62 },
                  ],
                },
                {
                  id: "sb-ch2",
                  name: "Energy",
                  topics: [
                    { id: "sb-t3", name: "Heat", mastery: 65 },
                    { id: "sb-t4", name: "Work & Power", mastery: 59 },
                  ],
                },
              ],
            },
            {
              id: "sb-term2",
              name: "Term 2",
              chapters: [
                {
                  id: "sb-ch3",
                  name: "Life on Earth",
                  topics: [
                    { id: "sb-t5", name: "Ecosystems", mastery: 72 },
                    { id: "sb-t6", name: "Biodiversity", mastery: 60 },
                  ],
                },
                {
                  id: "sb-ch4",
                  name: "Technology & Society",
                  topics: [
                    { id: "sb-t7", name: "Materials", mastery: 64 },
                    { id: "sb-t8", name: "Sustainability", mastery: 57 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "subj_e10b",
          name: "English",
          teacherId: "tb4",
          syllabus: [
            {
              id: "eb-term1",
              name: "Term 1",
              chapters: [
                {
                  id: "eb-ch1",
                  name: "Vocabulary",
                  topics: [
                    { id: "eb-t1", name: "Context Clues", mastery: 69 },
                    { id: "eb-t2", name: "Word Families", mastery: 63 },
                  ],
                },
                {
                  id: "eb-ch2",
                  name: "Grammar",
                  topics: [
                    { id: "eb-t3", name: "Active/Passive", mastery: 61 },
                    { id: "eb-t4", name: "Reported Speech", mastery: 58 },
                  ],
                },
              ],
            },
            {
              id: "eb-term2",
              name: "Term 2",
              chapters: [
                {
                  id: "eb-ch3",
                  name: "Writing Skills",
                  topics: [
                    { id: "eb-t5", name: "Report Writing", mastery: 71 },
                    { id: "eb-t6", name: "Notice Writing", mastery: 76 },
                  ],
                },
                {
                  id: "eb-ch4",
                  name: "Literature",
                  topics: [
                    { id: "eb-t7", name: "Short Stories", mastery: 65 },
                    { id: "eb-t8", name: "Plays", mastery: 62 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default function SchoolAdminView({ school = SCHOOL_MOCK }) {
  const navigate = useNavigate();

  // ---------------- Backend-loaded state (now ONLY from `school` prop) ----------------
  const [classes, setClasses] = useState(school?.classes || []);
  const [teachersByClass, setTeachersByClass] = useState({}); // classId -> [{id,name}]
  const [studentsByClass, setStudentsByClass] = useState({}); // classId -> [{id,name,mastery}]
  const [subjectsByClass, setSubjectsByClass] = useState({}); // classId -> [{id,name}]
  const [syllabusBySubject, setSyllabusBySubject] = useState({}); // subjectId -> terms[]

  const [loading, setLoading] = useState(false);

  // Hydrate classes and per-class data from the `school` prop only
  function loadClasses() {
    setLoading(true);
    try {
      const cls = school?.classes || [];
      setClasses(cls);
    } finally {
      setLoading(false);
    }
  }

  // Populate in-memory maps using just the `school` prop
  function loadRoster(classId) {
    if (!classId) return;
    const c = (school?.classes || []).find((x) => x.id === classId);
    if (!c) return;
    if (c?.teachers) setTeachersByClass((m) => ({ ...m, [classId]: c.teachers }));
    if (c?.students) setStudentsByClass((m) => ({ ...m, [classId]: c.students }));
    if (c?.subjects) setSubjectsByClass((m) => ({ ...m, [classId]: c.subjects }));
  }

  // Load syllabus from the `school` prop if present under each subject
  function loadSyllabus(classId, subjectId) {
    if (!classId || !subjectId) return;
    const c = (school?.classes || []).find((x) => x.id === classId);
    const subj = c?.subjects?.find((s) => s.id === subjectId);
    if (subj?.syllabus) setSyllabusBySubject((m) => ({ ...m, [subjectId]: subj.syllabus }));
    else setSyllabusBySubject((m) => ({ ...m, [subjectId]: [] }));
  }

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school?.id]);

  // ---------------- Selections ----------------
  const [classId, setClassId] = useState(school?.classes?.[0]?.id || "");
  const classObj = useMemo(() => classes.find((c) => c.id === classId) || null, [classes, classId]);

  // When classes load/change, ensure a valid selection
  useEffect(() => {
    if (!classes.length) return;
    if (!classes.find((c) => c.id === classId)) setClassId(classes[0].id);
  }, [classes, classId]);

  useEffect(() => {
    if (classId) loadRoster(classId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const subjects = subjectsByClass[classId] || classObj?.subjects || [];
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  // eslint-disable-next-line no-unused-vars
  const subject = useMemo(() => subjects.find((s) => s.id === subjectId) || null, [subjects, subjectId]);

  // Ensure subject selection stays valid as subjects load
  useEffect(() => {
    if (!subjects.length) return;
    if (!subjects.find((s) => s.id === subjectId)) setSubjectId(subjects[0].id);
  }, [subjects, subjectId]);

  // Load syllabus when subject changes
  useEffect(() => {
    if (classId && subjectId) loadSyllabus(classId, subjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, subjectId]);

  // Teachers & students for the current class
  const teachers = teachersByClass[classId] || classObj?.teachers || [];
  const students = studentsByClass[classId] || classObj?.students || [];

  // ---------------- KPIs ----------------
  const classAvg = useMemo(
    () => Math.round((students.reduce((a, s) => a + (s.mastery || 0), 0) / (students.length || 1)) || 0),
    [students]
  );
  const atRisk = useMemo(() => students.filter((s) => (s.mastery || 0) < 60).length, [students]);

  // ---------------- Branding ----------------
  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        aria-label="School Logo"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: THEME.primary,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
        }}
      >
        {school?.name ? school.name.slice(0, 1).toUpperCase() : "S"}
      </div>
      <div style={{ fontWeight: 800 }}>{school?.name || "Your School"}</div>
      <div style={{ color: THEME.subtext, fontWeight: 700 }}>•</div>
      <div>
        <span style={{ fontWeight: 800, color: THEME.primary }}>Qboxai</span>{" "}
        <span style={{ color: THEME.subtext }}>Admin</span>
      </div>
    </div>
  );

  // ---------------- Teacher assignments (UI-only; no API calls) ----------------
  const [classTeacherId, setClassTeacherId] = useState(teachers[0]?.id || "");
  const [subjectTeacherMap, setSubjectTeacherMap] = useState({}); // { [subjectId]: teacherId }

  // Initialize mapping when class or teachers/subjects change
  useEffect(() => {
    const init = {};
    for (const s of subjects || []) init[s.id] = s.teacherId || teachers[0]?.id || "";
    setSubjectTeacherMap(init);
    setClassTeacherId(teachers[0]?.id || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, JSON.stringify(teachers), JSON.stringify(subjects)]);

  const updateClassTeacher = () => {
    alert("(Demo) Class teacher updated locally. Wire to backend when ready.");
  };

  const saveSubjectTeachers = () => {
    alert("(Demo) Subject teachers saved locally. Wire to backend when ready.");
  };

  // ---------------- Remedial (generate + notify) — UI-only ----------------
  const [difficulty, setDifficulty] = useState("Mixed");
  const [count, setCount] = useState(10);
  const [lowTopics, setLowTopics] = useState([]);
  const [preview, setPreview] = useState({ mcqs: [], flashcards: [], interviews: [] });
  const [busy, setBusy] = useState(false);

  const [notifyTeacherId, setNotifyTeacherId] = useState("");
  const [targetType, setTargetType] = useState("class"); // class | student
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || "");
  const [note, setNote] = useState("");

  // Ensure a default teacher to notify
  useEffect(() => {
    const def = subjectTeacherMap[subjectId] || classTeacherId || teachers[0]?.id || "";
    setNotifyTeacherId(def);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, classTeacherId, JSON.stringify(teachers), JSON.stringify(subjectTeacherMap)]);

  function computeLowTopics() {
    const terms = syllabusBySubject[subjectId] || [];
    const topics = terms.flatMap((t) => t.chapters).flatMap((c) => c.topics || []);
    setLowTopics(topics.filter((t) => (t.mastery || 0) < 60).map((t) => t.id));
  }

  function generateRemedials() {
    if (!lowTopics.length) return alert("No low-mastery topics selected");
    setBusy(true);
    try {
      // Demo-only: fabricate counts for preview
      setPreview({
        mcqs: Array.from({ length: Math.max(3, Math.round(count)) }, (_, i) => ({ id: `m${i + 1}` })),
        flashcards: Array.from({ length: Math.max(6, Math.round(count * 1.2)) }, (_, i) => ({ id: `f${i + 1}` })),
        interviews: Array.from({ length: Math.max(3, Math.round(count / 2)) }, (_, i) => ({ id: `i${i + 1}` })),
      });
    } finally {
      setBusy(false);
    }
  }

  function notifyTeacher() {
    if (!notifyTeacherId) return alert("Choose a teacher to notify");
    if (!lowTopics.length) return alert("Pick low-mastery topics first");
    if (targetType === "student" && !targetStudentId) return alert("Pick a student");

    alert("(Demo) Notification prepared. Wire this action to backend when ready.");
    setPreview({ mcqs: [], flashcards: [], interviews: [] });
    setNote("");
  }

  // ---------------- Knowledge tracks ----------------
  const bySubject = useMemo(() => {
    const list = (subjects || []).map((s) => {
      const terms = syllabusBySubject[s.id] || [];
      const topics = terms.flatMap((t) => t.chapters).flatMap((c) => c.topics || []);
      const avg =
        Math.round((topics.reduce((a, t) => a + (t.mastery || 0), 0) / (topics.length || 1)) || 0);
      return { id: s.id, name: s.name, mastery: avg };
    });
    return list;
  }, [subjects, syllabusBySubject]);

  const [studentId, setStudentId] = useState(students[0]?.id || "");
  useEffect(() => {
    if (students.length && !students.find((s) => s.id === studentId)) {
      setStudentId(students[0].id);
    }
  }, [students, studentId]);

  const stu = useMemo(() => students.find((s) => s.id === studentId) || null, [students, studentId]);

  const studentWeakTopics = useMemo(() => {
    const terms = syllabusBySubject[subjectId] || [];
    const tps = terms.flatMap((t) => t.chapters).flatMap((c) => c.topics || []);
    return tps.filter((t) => (t.mastery || 0) < 60).slice(0, 8);
  }, [subjectId, syllabusBySubject]);

  return (
    <div style={{ background: THEME.bg, color: THEME.text, padding: 16, display: "grid", gap: 16 }}>
      {/* Header with branding */}
      <Card right={<Tag>Blue/White Theme</Tag>}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="soft" onClick={loadClasses} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh Data"}
            </Button>
            <Button variant="soft" onClick={() => navigate("/teacher")}>
              Open Teacher Workspace
            </Button>
          </div>
        </div>
      </Card>

      {/* Class & subject selection + teacher assignments */}
      <Card title="Class Setup" subtitle="Pick class & subject • Assign teachers">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Class</div>
            <Select
              value={classId}
              onChange={setClassId}
              options={classes.map((c) => ({ label: c.name, value: c.id }))}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Subject</div>
            <Select
              value={subjectId}
              onChange={setSubjectId}
              options={(subjects || []).map((s) => ({ label: s.name, value: s.id }))}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Class Teacher</div>
            <Select
              value={classTeacherId}
              onChange={setClassTeacherId}
              options={(teachers || []).map((t) => ({ label: t.name, value: t.id }))}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: 8,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <SectionTitle>Subject ↔ Teacher</SectionTitle>
          <Button variant="soft" onClick={updateClassTeacher}>
            Update Class Teacher
          </Button>
          <Button onClick={saveSubjectTeachers}>Save Subject Teachers</Button>
        </div>

        <div
          style={{
            padding: 8,
            background: "#fff",
            border: `1px solid ${THEME.border}`,
            borderRadius: 12,
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            {(subjects || []).map((s) => (
              <div
                key={s.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}
              >
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <Select
                  value={subjectTeacherMap[s.id] || ""}
                  onChange={(v) => setSubjectTeacherMap((m) => ({ ...m, [s.id]: v }))}
                  options={(teachers || []).map((t) => ({ label: t.name, value: t.id }))}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <Card title="Class KPIs" subtitle="Holistic view">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: THEME.subtext }}>Class Average Mastery</div>
            <Progress value={classAvg} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: THEME.subtext }}>Students at Risk (&lt;60%)</div>
            <div style={{ fontWeight: 700 }}>{atRisk}</div>
          </div>
        </div>
      </Card>

      {/* Holistic track (by subject) */}
      <Card title="Holistic Knowledge Track" subtitle="Average mastery by subject">
        <div style={{ display: "grid", gap: 10 }}>
          {bySubject.map((s) => (
            <div
              key={s.id}
              style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px", gap: 12, alignItems: "center" }}
            >
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <Progress value={s.mastery} />
              <div style={{ textAlign: "right", fontWeight: 700 }}>{s.mastery}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Individual track */}
      <Card title="Individual Knowledge Track" subtitle="Pick a student • see progress & weak topics">
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ width: 280 }}>
            <Select
              value={studentId}
              onChange={setStudentId}
              options={(students || []).map((s) => ({ label: s.name, value: s.id }))}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div>
              <SectionTitle>Subject Progress</SectionTitle>
              <div style={{ display: "grid", gap: 8 }}>
                {bySubject.map((s) => (
                  <div
                    key={s.id}
                    style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", gap: 12, alignItems: "center" }}
                  >
                    <div style={{ color: THEME.subtext }}>{s.name}</div>
                    <Progress value={Math.max(0, Math.min(100, Math.round(stu?.mastery ?? s.mastery)))} />
                    <div style={{ textAlign: "right" }}>
                      <Tag tone={(stu?.mastery ?? s.mastery) < 60 ? "warn" : "info"}>
                        {Math.round(stu?.mastery ?? s.mastery)}%
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>Weak Topics (sample)</SectionTitle>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {studentWeakTopics.length ? (
                  studentWeakTopics.map((t) => (
                    <Tag key={t.id} tone="warn">
                      {t.name}
                    </Tag>
                  ))
                ) : (
                  <div style={{ color: THEME.subtext }}>No weak topics detected.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Remedial builder — notify teacher (demo only) */}
      <Card title="Remedial Builder" subtitle="Generate practice & notify a teacher to act">
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
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
              <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Count per set</div>
              <Input type="number" value={count} onChange={(v) => setCount(Number(v) || 0)} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Teacher to Notify</div>
              <Select
                value={notifyTeacherId}
                onChange={setNotifyTeacherId}
                options={(teachers || []).map((t) => ({ label: t.name, value: t.id }))}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Target</div>
              <RadioRow
                value={targetType}
                onChange={setTargetType}
                items={[
                  { label: "Whole Class", value: "class" },
                  { label: "Specific Student", value: "student" },
                ]}
              />
              {targetType === "student" && (
                <>
                  <Divider />
                  <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Student</div>
                  <Select
                    value={targetStudentId}
                    onChange={setTargetStudentId}
                    options={(students || []).map((s) => ({ label: s.name, value: s.id }))}
                  />
                </>
              )}
            </div>
            <div>
              <div style={{ fontSize: 12, color: THEME.subtext, marginBottom: 6 }}>Note to Teacher</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add instructions or context for the teacher…"
                rows={4}
                style={{
                  width: "100%",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 12,
                  padding: 12,
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="soft" onClick={computeLowTopics}>
              Pick Low Topics
            </Button>
            <Button onClick={generateRemedials} disabled={busy || !lowTopics.length}>
              Generate
            </Button>
            <Button variant="soft" onClick={notifyTeacher} disabled={busy}>
              Notify Teacher
            </Button>
          </div>

          <Divider />
          <div>
            <SectionTitle>Preview</SectionTitle>
            {!preview.mcqs.length && !preview.flashcards.length && !preview.interviews.length ? (
              <div style={{ color: THEME.subtext }}>Pick low-mastery topics then Generate.</div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {!!preview.mcqs.length && (
                  <div>
                    <strong>MCQs:</strong> {preview.mcqs.length}
                  </div>
                )}
                {!!preview.flashcards.length && (
                  <div>
                    <strong>Flashcards:</strong> {preview.flashcards.length}
                  </div>
                )}
                {!!preview.interviews.length && (
                  <div>
                    <strong>Interview Qs:</strong> {preview.interviews.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Syllabus snapshot */}
      <Card title="Syllabus (read-only snapshot)">
        {(syllabusBySubject[subjectId] || []).length ? (
          (syllabusBySubject[subjectId] || []).map((term) => (
            <div
              key={term.id}
              style={{
                padding: 8,
                marginBottom: 8,
                background: "#fff",
                border: `1px solid ${THEME.border}`,
                borderRadius: 10,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{term.name}</div>
              {term.chapters.map((ch) => (
                <div key={ch.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: 600 }}>{ch.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {ch.topics.map((tp) => (
                      <Tag key={tp.id} tone={(tp.mastery || 0) < 60 ? "warn" : "info"}>
                        {tp.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ color: THEME.subtext }}>
            No syllabus loaded yet. Ensure the Teacher workspace created topics, or embed syllabus in the `school` prop.
          </div>
        )}
      </Card>
    </div>
  );
}
