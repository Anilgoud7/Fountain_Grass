// src/pages/Student.jsx
import React, { useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { THEME, Card, Button, Select, Tag } from "../components/ui";
import { studentData } from "/src/data/studentData.js";

function StudentLayout({ data }) {
  const student = data || studentData;
  const subjects = student?.subjects || [];
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const activeSubject = useMemo(
    () => subjects.find((s) => s.id === subjectId) || subjects[0] || null,
    [subjects, subjectId]
  );

  return (
    <div
      style={{
        background: THEME.bg,
        color: THEME.text,
        padding: 16,
        display: "grid",
        gap: 16,
      }}
    >
      <Card title={`Welcome, ${student?.user?.name || "Student"}`}>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link to="/student/Dashboard">
            <Button variant="soft">Dashboard</Button>
          </Link>
          <Link to="/student/self-assess">
            <Button variant="soft">Self Assess</Button>
          </Link>
          <Link to="/student/recommendations">
            <Button variant="soft">Recommendations</Button>
          </Link>
          <Link to="/student/syllabus">
            <Button variant="soft">Syllabus</Button>
          </Link>
          <Link to="/student/assigned">
            <Button variant="soft">Assigned</Button>
          </Link>
          <Link to="/student/ai-tutor">
            <Button variant="soft">AI Tutor</Button>
          </Link>
        </div>
      </Card>

      {/* Child pages render here */}
      <Outlet context={{ student, activeSubject }} />
    </div>
  );
}

export default StudentLayout; // <-- IMPORTANT
