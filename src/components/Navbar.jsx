// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const pill = (active) => ({
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: active ? "#1d4ed8" : "#fff",
  color: active ? "#fff" : "#0f172a",
  textDecoration: "none",
});

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: 8, padding: 12, alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
      <NavLink to="/" end style={({ isActive }) => pill(isActive)}>Home</NavLink>
      <NavLink to="/school"  style={({ isActive }) => pill(isActive)}>School Admin</NavLink>
      <NavLink to="/teacher" style={({ isActive }) => pill(isActive)}>Teacher</NavLink>
      <NavLink to="/student" style={({ isActive }) => pill(isActive)}>Student</NavLink>
      <NavLink to="/parent"  style={({ isActive }) => pill(isActive)}>Parent</NavLink>
    </nav>
  );
}
