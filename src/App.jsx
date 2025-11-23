// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SchoolAdmin from "./pages/SchoolAdmin";
import Teacher from "./pages/Teacher";
import Parent from "./pages/Parent";

// Student wrapper (must be a DEFAULT export from src/pages/Student.jsx)
import StudentLayout from "./pages/Student";

// Student child pages (each should be a DEFAULT export)
import Dashboard from "./pages/Dashboard";
import SelfAssess from "./pages/SelfAssess";
import Recommendations from "./pages/Recommendations";
import Syllabus from "./pages/Syllabus";
import Assigned from "./pages/Assigned";
import VoiceTutorPage from "./pages/VoiceTutorPage";
import AssignmentsPage from "./pages/assignments";

const FONT_STACK =
  'Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif';

export default function App() {
  return (
    <div style={{ fontFamily: FONT_STACK, minHeight: "100vh" }}>
      <Navbar />
      <Routes>
        {/* Main */}
        <Route path="/" element={<Home />} />
        <Route path="/school" element={<SchoolAdmin />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/parent" element={<Parent />} />

        {/* Student namespace */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/*" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="self-assess" element={<SelfAssess />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="assigned" element={<Assigned />} />
          <Route path="voice" element={<VoiceTutorPage />} />
        
        </Route>
        <Route path="/teacher" element={<Navigate to="/teacher" replace />} />
        
          <Route path="assignments" element={<AssignmentsPage />} />
        

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
