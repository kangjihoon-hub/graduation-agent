import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, GraduationCap, BookOpen, BarChart3, User, AlertCircle, ChevronDown } from "lucide-react";

// ─── 졸업 요건 정의 ───────────────────────────────────────────────────────────
const requiredRules = {
  "인성체험교양": 5,
  "기초교양-외국어역량": 6,
  "기초교양-글쓰기/독서와토론": 6,
  "기초교양-소프트웨어": 2,
  "인성체험/균형교양": 21,
};

// ─── 샘플 학생 데이터 ─────────────────────────────────────────────────────────
const sampleStudents = [
  {
    id: "2021001", name: "김민수", year: 2021, email: "mskim@univ.ac.kr",
    courses: [
      ["2021-1", "대학생활과인성", "인성체험교양", 5, "A+"],
      ["2021-1", "College English", "기초교양-외국어역량", 6, "B+"],
      ["2021-2", "사고와글쓰기", "기초교양-글쓰기/독서와토론", 6, "A0"],
      ["2022-1", "AI와컴퓨팅기초", "기초교양-소프트웨어", 2, "A+"],
      ["2022-2", "세계문화의이해", "인성체험/균형교양", 21, "B0"],
    ],
  },
  {
    id: "2021002", name: "이서연", year: 2021, email: "sylee@univ.ac.kr",
    courses: [
      ["2021-1", "공동체와윤리", "인성체험교양", 2, "A0"],
      ["2021-1", "Academic English", "기초교양-외국어역량", 6, "A+"],
      ["2021-2", "비판적사고와토론", "기초교양-글쓰기/독서와토론", 6, "B+"],
      ["2022-1", "파이썬기초", "기초교양-소프트웨어", 2, "A0"],
      ["2022-2", "글로벌시민의식", "인성체험/균형교양", 21, "A+"],
    ],
  },
  {
    id: "2021006", name: "강도윤", year: 2021, email: "dykang@univ.ac.kr",
    courses: [
      ["2021-1", "인성세미나", "인성체험교양", 5, "A0"],
      ["2021-1", "English Reading", "기초교양-외국어역량", 6, "B+"],
      ["2021-2", "논리와글쓰기", "기초교양-글쓰기/독서와토론", 6, "A+"],
      ["2022-1", "컴퓨팅기초", "기초교양-소프트웨어", 2, "B0"],
      ["2022-2", "세계시민교육", "인성체험/균형교양", 15, "B+"],
    ],
  },
  {
    id: "2021008", name: "오세훈", year: 2021, email: "sho@univ.ac.kr",
    courses: [
      ["2021-1", "대학과인성", "인성체험교양", 5, "B+"],
      ["2021-1", "Practical English", "기초교양-외국어역량", 3, "C+"],
      ["2021-2", "문제해결글쓰기", "기초교양-글쓰기/독서와토론", 6, "B0"],
      ["2022-1", "AI기초", "기초교양-소프트웨어", 2, "A0"],
      ["2022-2", "문학과삶", "인성체험/균형교양", 24, "B+"],
    ],
  },
  {
    id: "2021010", name: "박서준", year: 2021, email: "sjpark@univ.ac.kr",
    courses: [
      ["2021-1", "대학생활과진로", "인성체험교양", 5, "B+"],
      ["2021-1", "English Communication", "기초교양-외국어역량", 6, "B0"],
      ["2021-2", "글쓰기기초", "기초교양-글쓰기/독서와토론", 3, "C+"],
      ["2022-1", "컴퓨팅사고", "기초교양-소프트웨어", 2, "A0"],
      ["2022-2", "글로벌문화이해", "인성체험/균형교양", 24, "B+"],
    ],
  },
];

// ─── 분석 함수 ────────────────────────────────────────────────────────────────
function analyze(student) {
  const earnedMap = Object.fromEntries(Object.keys(requiredRules).map(k => [k, 0]));

  student.courses.forEach(([, , category, credit]) => {
    if (earnedMap[category] !== undefined) {
      earnedMap[category] += Number(credit);
    }
  });

  const rows = Object.entries(requiredRules).map(([category, required]) => {
    const earned = earnedMap[category];
    const lack = Math.max(required - earned, 0);
    return { category, required, earned, lack, status: lack === 0 ? "충족" : "미달" };
  });

  const missing = rows.filter(r => r.status === "미달");
  return { rows, missing, pass: missing.length === 0 };
}

// ─── 성적 → 색상 ──────────────────────────────────────────────────────────────
function gradeColor(grade) {
  if (grade.startsWith("A")) return "#15803d";
  if (grade.startsWith("B")) return "#1d4ed8";
  if (grade.startsWith("C")) return "#b45309";
  return "#6b7280";
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function Bar({ earned, required }) {
  const pct = Math.min((earned / required) * 100, 100);
  return (
    <div style={{ background: "#e2e8f0", borderRadius: 99, height: 8, overflow: "hidden", marginTop: 6 }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: 99,
        background: pct >= 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#f59e0b,#d97706)",
        transition: "width .4s ease",
      }} />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedId, setSelectedId] = useState("2021010");
  const [fileName, setFileName] = useState(null);
  const [tab, setTab] = useState("result");  // result | transcript | json

  const student = sampleStudents.find(s => s.id === selectedId) || sampleStudents[0];
  const result = useMemo(() => analyze(student), [student]);

  const requiredTotal = Object.values(requiredRules).reduce((a, b) => a + b, 0);
  const earnedTotal = result.rows.reduce((s, r) => s + Math.min(r.earned, r.required), 0);
  const progressPct = Math.round((earnedTotal / requiredTotal) * 100);

  const aiMessage = result.pass
    ? `${student.name} 학생은 교양과정 졸업요건을 모두 충족했습니다. 총 ${earnedTotal}/${requiredTotal}학점 이수 완료.`
    : `${student.name} 학생은 졸업요건이 미달됩니다. ${result.missing.map(m => `[${m.category} ${m.lack}학점 부족]`).join(" ")}`;

  const jsonPreview = JSON.stringify({
    status: result.pass ? "충족" : "미달",
    student: student.name,
    student_id: student.id,
    student_email: student.email,
    earned_total: earnedTotal,
    required_total: requiredTotal,
    missing: result.missing,
    transcript: student.courses,
  }, null, 2);

  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logo}><GraduationCap size={26} color="#fff" /></div>
          <div>
            <div style={s.title}>Graduation Check AI Agent</div>
            <div style={s.subtitle}>성적증명서 기반 졸업요건 자동 판정 서비스</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>v1.0 · n8n 연동</div>
      </header>

      <div style={s.layout}>
        {/* ── Left Panel ── */}
        <aside style={s.aside}>
          {/* Student Select */}
          <div style={s.card}>
            <div style={s.cardHeader}><User size={16} />&nbsp;학생 선택</div>
            <div style={{ position: "relative" }}>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                style={s.select}
              >
                {sampleStudents.map(st => (
                  <option key={st.id} value={st.id}>{st.id} — {st.name}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
            </div>
          </div>

          {/* Upload */}
          <div style={s.card}>
            <div style={s.cardHeader}><BookOpen size={16} />&nbsp;성적증명서 업로드</div>
            <label style={s.uploadBox}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>파일 선택 (PDF · CSV · XLSX)</span>
              <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>드래그 또는 클릭</span>
              <input type="file" accept=".pdf,.csv,.xlsx" style={{ display: "none" }}
                onChange={e => { if (e.target.files?.[0]) setFileName(e.target.files[0].name); }} />
            </label>
            {fileName && (
              <div style={s.fileBox}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>선택된 파일</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{fileName}</span>
              </div>
            )}
          </div>

          {/* Student Info */}
          <div style={s.card}>
            <div style={s.cardHeader}><User size={16} />&nbsp;학생 기본정보</div>
            <div style={s.infoGrid}>
              {[["이름", student.name], ["학번", student.id], ["입학년도", student.year + "년"], ["이메일", student.email]].map(([l, v]) => (
                <div key={l} style={s.infoBox}>
                  <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Message */}
          <div style={{ ...s.card, background: result.pass ? "#f0fdf4" : "#fff7ed", border: `1px solid ${result.pass ? "#bbf7d0" : "#fed7aa"}` }}>
            <div style={s.cardHeader}>
              <AlertCircle size={16} color={result.pass ? "#15803d" : "#c2410c"} />
              &nbsp;<span style={{ color: result.pass ? "#15803d" : "#c2410c" }}>AI 판정 메시지</span>
            </div>
            <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: 0 }}>{aiMessage}</p>
          </div>
        </aside>

        {/* ── Right Panel ── */}
        <main style={s.main}>
          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={{ ...s.statCard, background: result.pass ? "#f0fdf4" : "#fff1f2" }}>
              <div style={s.statLabel}>판정 결과</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                {result.pass ? <CheckCircle2 size={28} color="#16a34a" /> : <XCircle size={28} color="#dc2626" />}
                <span style={{ fontSize: 22, fontWeight: 800, color: result.pass ? "#15803d" : "#dc2626" }}>
                  {result.pass ? "졸업 가능" : "졸업 불가"}
                </span>
              </div>
            </div>

            <div style={s.statCard}>
              <div style={s.statLabel}>이수 학점</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{earnedTotal}<span style={{ fontSize: 14, color: "#94a3b8" }}>/{requiredTotal}</span></div>
              <Bar earned={earnedTotal} required={requiredTotal} />
            </div>

            <div style={s.statCard}>
              <div style={s.statLabel}>달성률</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{progressPct}<span style={{ fontSize: 14, color: "#94a3b8" }}>%</span></div>
              <Bar earned={earnedTotal} required={requiredTotal} />
            </div>

            <div style={s.statCard}>
              <div style={s.statLabel}>미달 영역</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: result.missing.length > 0 ? "#dc2626" : "#15803d" }}>
                {result.missing.length}<span style={{ fontSize: 14, color: "#94a3b8" }}>개</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={s.tabBar}>
            {[["result","졸업요건 충족 현황"], ["transcript","성적증명서 데이터"], ["json","Webhook JSON"]].map(([key, label]) => (
              <button key={key} style={{ ...s.tab, ...(tab === key ? s.tabActive : {}) }} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Result */}
          {tab === "result" && (
            <div style={s.card}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["교과(이수)구분", "필요학점", "이수학점", "부족학점", "달성률", "상태"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map(row => (
                    <tr key={row.category} style={{ background: row.status === "미달" ? "#fff7f7" : "#fff" }}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{row.category}</td>
                      <td style={s.td}>{row.required}</td>
                      <td style={s.td}>{row.earned}</td>
                      <td style={{ ...s.td, color: row.lack > 0 ? "#dc2626" : "#94a3b8", fontWeight: row.lack > 0 ? 700 : 400 }}>{row.lack}</td>
                      <td style={{ ...s.td, minWidth: 120 }}>
                        <Bar earned={row.earned} required={row.required} />
                      </td>
                      <td style={s.td}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: row.status === "충족" ? "#dcfce7" : "#fee2e2",
                          color: row.status === "충족" ? "#15803d" : "#dc2626",
                        }}>
                          {row.status === "충족" ? "✓ 충족" : "✗ 미달"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab: Transcript */}
          {tab === "transcript" && (
            <div style={s.card}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["학기", "교과목명", "이수구분", "학점", "성적"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.courses.map((course, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={s.td}>{course[0]}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{course[1]}</td>
                      <td style={{ ...s.td, fontSize: 12, color: "#475569" }}>{course[2]}</td>
                      <td style={s.td}>{course[3]}</td>
                      <td style={{ ...s.td, fontWeight: 700, color: gradeColor(course[4]) }}>{course[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab: JSON */}
          {tab === "json" && (
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>n8n Webhook 전송 데이터 미리보기</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(jsonPreview)}
                  style={{ fontSize: 11, padding: "4px 10px", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", background: "#f8fafc" }}
                >
                  복사
                </button>
              </div>
              <pre style={s.pre}>{jsonPreview}</pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "20px",
    fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
    color: "#0f172a",
    boxSizing: "border-box",
  },
  header: {
    background: "#0f172a",
    borderRadius: 18,
    padding: "18px 24px",
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { display: "flex", gap: 16, alignItems: "center" },
  logo: {
    width: 48, height: 48,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  layout: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" },
  aside: {},
  main: {},
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: { display: "flex", alignItems: "center", fontWeight: 700, fontSize: 13, marginBottom: 14, color: "#334155" },
  select: {
    width: "100%", padding: "10px 36px 10px 12px",
    borderRadius: 10, border: "1px solid #e2e8f0",
    fontSize: 13, background: "#f8fafc",
    appearance: "none", cursor: "pointer",
    outline: "none",
  },
  uploadBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    border: "2px dashed #cbd5e1", borderRadius: 12, padding: "24px 16px",
    cursor: "pointer", background: "#f8fafc", gap: 4,
  },
  fileBox: {
    marginTop: 12, padding: "10px 14px",
    background: "#f1f5f9", borderRadius: 10,
    display: "flex", flexDirection: "column", gap: 2,
  },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  infoBox: {
    background: "#f8fafc", padding: "12px 14px",
    borderRadius: 10, display: "flex", flexDirection: "column",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 },
  statCard: {
    background: "#fff", borderRadius: 16, padding: "16px 18px",
    boxShadow: "0 1px 4px rgba(0,0,0,.06)", border: "1px solid #e2e8f0",
  },
  statLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  tabBar: { display: "flex", gap: 4, marginBottom: 14 },
  tab: {
    padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
    border: "none", cursor: "pointer", background: "#e2e8f0", color: "#64748b",
    transition: "all .15s",
  },
  tabActive: { background: "#0f172a", color: "#fff" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    background: "#f1f5f9", border: "1px solid #e2e8f0",
    padding: "10px 12px", textAlign: "left", fontWeight: 700,
    fontSize: 12, color: "#475569",
  },
  td: { border: "1px solid #e2e8f0", padding: "10px 12px" },
  pre: {
    background: "#0f172a", color: "#7dd3fc",
    padding: 16, borderRadius: 12,
    overflowX: "auto", fontSize: 11,
    lineHeight: 1.7, margin: 0,
  },
};
