// src/routes.jsx
import { Routes, Route } from "react-router-dom";
import {
  StudentLayout,
  DashboardPage,
  AssignedPage,
  SelfAssessRoute,
  KnowledgePage,
  SyllabusPage,
  RecommendationsPage,
} from "./pages/Student";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="assigned" element={<AssignedPage />} />
        <Route path="self-assess" element={<SelfAssessRoute />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="syllabus" element={<SyllabusPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
      </Route>
    </Routes>
  );
}
