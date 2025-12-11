// src/pages/Student.jsx
import React, { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Card, Button } from "../components/ui";
import { studentData } from "/src/data/studentData.js";

function StudentLayout({ data }) {
  const student = data || studentData;
  const subjects = student?.subjects || [];
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const activeSubject = useMemo(
    () => subjects.find((s) => s.id === subjectId) || subjects[0] || null,
    [subjects, subjectId]
  );

  const navLinks = [
    { to: "/student/Dashboard", label: "Dashboard" },
    { to: "/student/self-assess", label: "Self Assess" },
    { to: "/student/recommendations", label: "Recommendations" },
    { to: "/student/syllabus", label: "Syllabus" },
    { to: "/student/assigned", label: "Assigned" },
    { to: "/student/ai-tutor", label: "AI Tutor" },
  ];

  return (
    <div className="bg-gray-50 text-gray-900 p-4 grid gap-4">
      <Card title={`Welcome, ${student?.user?.name || "Student"}`}>
        <div className="flex gap-2 flex-wrap items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </Card>

      {/* Child pages render here */}
      <Outlet context={{ student, activeSubject }} />
    </div>
  );
}

export default StudentLayout;
