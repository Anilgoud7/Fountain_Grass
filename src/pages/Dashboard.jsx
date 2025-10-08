// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  THEME,
  Card,
  Button,
  Tag,
  Progress,
  Divider,
  SectionTitle,
} from "../components/ui";
import { dashboardData } from "../data/dashboardData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

// ---------- helpers ----------
const avg = (arr) =>
  arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

const fmtDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);

function buildLastNDaysActivity(n = 14, activityDates = []) {
  const set = new Set((activityDates || []).map((d) => fmtDay(new Date(d))));
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = fmtDay(d);
    days.push({ date: key, active: set.has(key) });
  }
  return days;
}

// ---------- small bits ----------
function HeatmapStrip({ days }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      {days.map((d) => (
        <div
          key={d.date}
          title={`${d.date} • ${d.active ? "Practiced" : "No activity"}`}
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: d.active ? THEME.primary : "#e5e7eb",
            border: `1px solid ${d.active ? THEME.primary : THEME.border}`,
          }}
        />
      ))}
    </div>
  );
}

function SubjectTile({ s }) {
  return (
    <div
      style={{
        padding: 12,
        background: "#fff",
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontWeight: 700 }}>{s.name}</div>
        <Tag tone={s.mastery < 50 ? "danger" : s.mastery < 70 ? "warn" : "info"}>
          {Math.round(s.mastery)}%
        </Tag>
      </div>
      <Progress value={Math.round(s.mastery || 0)} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link to="/student/self-assess"><Button size="sm">Practice</Button></Link>
        <Link to="/student/recommendations"><Button size="sm" variant="soft">Plan</Button></Link>
        <Link to="/student/syllabus"><Button size="sm" variant="ghost">Syllabus</Button></Link>
      </div>
    </div>
  );
}

// ---------- main ----------
export default function Dashboard() {
  const { student, activeSubject } = useOutletContext?.() || {};

  // Subjects list (dashboard now surfaces them)
  const subjects = useMemo(() => {
    const src = Array.isArray(student?.subjects) ? student.subjects : [];
    // fallback demo if empty
    return src.length
      ? src
      : [
          { id: "math", name: "Mathematics", mastery: 62, topics: [] },
          { id: "sci", name: "Science", mastery: 58, topics: [] },
          { id: "eng", name: "English", mastery: 74, topics: [] },
          { id: "sst", name: "Social Studies", mastery: 51, topics: [] },
        ];
  }, [student?.subjects]);

  const overallMastery = useMemo(
    () => avg(subjects.map((s) => s.mastery || 0)),
    [subjects]
  );

  // XP
  const xp = useMemo(() => {
    const current = student?.xp?.current ?? 420;
    const level = student?.xp?.level ?? 3;
    const nextLevel = student?.xp?.nextLevel ?? 4;
    const needed = student?.xp?.needed ?? 800;
    const pct = Math.max(0, Math.min(100, Math.round((current / needed) * 100)));
    return { current, level, nextLevel, needed, pct };
  }, [student?.xp]);

  // Streak
  const streak = useMemo(() => {
    const current = student?.streak?.current ?? 5;
    const best = student?.streak?.best ?? 12;
    const activityDates =
      student?.streak?.activityDates ?? dashboardData?.streakActivityDates ?? [];
    const days = buildLastNDaysActivity(14, activityDates);
    return { current, best, days };
  }, [student?.streak]);

  // Active subject topic stats
  const topics = activeSubject?.topics || [];
  const stats = useMemo(
    () => ({
      mastery: topics.length ? avg(topics.map((t) => t.mastery || 0)) : overallMastery,
      byTopic: topics.map((t) => ({
        id: t.id,
        name: t.name,
        mastery: t.mastery || 0,
      })),
    }),
    [topics, overallMastery]
  );

  // Charts
  const masteryBySubjectData = useMemo(
    () => subjects.map((s) => ({ name: s.name, mastery: Math.round(s.mastery || 0) })),
    [subjects]
  );

  const progressSeries = useMemo(() => {
    const src =
      student?.progressByDate && student.progressByDate.length
        ? student.progressByDate
        : [
            { date: "2025-08-10", mastery: 48 },
            { date: "2025-08-15", mastery: 52 },
            { date: "2025-08-20", mastery: 56 },
            { date: "2025-08-25", mastery: 59 },
            { date: "2025-08-30", mastery: 62 },
          ];
    return src.map((p) => ({ date: p.date, mastery: Math.round(p.mastery || 0) }));
  }, [student?.progressByDate]);

  const reminders = dashboardData?.reminders?.slice(0, 6) || [];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Row 1: XP / Streak */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="XP & Level" subtitle={`Level ${xp.level} → ${xp.nextLevel}`}>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontSize: 12, color: THEME.subtext }}>
              {xp.current} / {xp.needed} XP
            </div>
            <Progress value={xp.pct} />
            <div style={{ fontSize: 12, color: THEME.subtext }}>
              Earn XP by completing MCQs, flashcards, and interviews.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/student/self-assess"><Button size="sm">Practice Now</Button></Link>
              <Link to="/student/recommendations"><Button size="sm" variant="soft">Recommendations</Button></Link>
            </div>
          </div>
        </Card>

        <Card title="Discipline Streak" subtitle="Keep the chain alive!">
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Tag tone="info">Current: {streak.current}d</Tag>
              <Tag tone="neutral">Best: {streak.best}d</Tag>
            </div>
            <HeatmapStrip days={streak.days} />
            <div style={{ fontSize: 12, color: THEME.subtext }}>
              Practice daily to grow your streak. Miss a day and it resets.
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Subjects at a glance */}
      <Card
        title="Subjects at a glance"
        subtitle="Quick view across all subjects"
        right={<Tag tone="neutral">{subjects.length} subjects</Tag>}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {subjects.map((s) => (
            <SubjectTile key={s.id || s.name} s={s} />
          ))}
        </div>
      </Card>

      {/* Row 3: Overall + Reminders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Your Progress" subtitle="Overall mastery across subjects">
          <div style={{ display: "grid", gap: 12 }}>
            <Progress value={overallMastery} />
            <div style={{ color: THEME.subtext }}>
              Average mastery: <strong>{overallMastery}%</strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/student/self-assess"><Button>Practice MCQs</Button></Link>
              <Link to="/student/self-assess"><Button variant="soft">Flashcards</Button></Link>
              <Link to="/student/self-assess"><Button variant="soft">Interview Prep</Button></Link>
            </div>
          </div>
        </Card>

        <Card title="Reminders" subtitle="Focus on weak topics">
          <ul style={{ marginTop: 4 }}>
            {reminders.map((t) => (
              <li key={t.id} style={{ marginBottom: 6 }}>
                <Tag tone={t.mastery < 50 ? "danger" : t.mastery < 70 ? "warn" : "success"}>
                  {t.title}
                </Tag>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Row 4: Mastery charts (Subjects + Trend) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Mastery by Subject" subtitle="Current % by subject">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={masteryBySubjectData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="mastery" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Progress Over Time" subtitle="Overall mastery trend">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={progressSeries} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="mastery" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 5: Active Subject Knowledge (optional) */}
      {!!topics.length && (
        <Card title={`Knowledge • ${activeSubject?.name || "Subject"}`} subtitle="By topic">
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontSize: 12, color: THEME.subtext }}>Overall Mastery</div>
            <Progress value={Math.round(stats.mastery || 0)} />
            <Divider />
            <SectionTitle>By Topic</SectionTitle>
            <div
              style={{
                display: "grid",
                gap: 8,
                maxHeight: 260,
                overflow: "auto",
                paddingRight: 6,
              }}
            >
              {stats.byTopic.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr 60px",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: THEME.subtext }}>{t.name}</div>
                  <Progress value={Math.round(t.mastery || 0)} />
                  <div style={{ textAlign: "right" }}>
                    <Tag tone={(t.mastery || 0) < 60 ? "warn" : "info"}>
                      {Math.round(t.mastery || 0)}%
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
