import { useMemo, useState } from "react";

const requiredRules = {
  "인성체험교양": 5,
  "기초교양-외국어역량": 6,
  "기초교양-글쓰기/독서와토론": 6,
  "기초교양-소프트웨어": 2,
  "인성체험/균형교양": 21,
};

const sampleStudents = [
  {
    id: "2021001",
    name: "김민수",
    year: 2021,
    courses: [
      ["2021-1", "대학생활과인성", "인성체험교양", 5, "A+"],
      ["2021-1", "College English", "기초교양-외국어역량", 6, "B+"],
      ["2021-2", "사고와글쓰기", "기초교양-글쓰기/독서와토론", 6, "A0"],
      ["2022-1", "AI와컴퓨팅기초", "기초교양-소프트웨어", 2, "A+"],
      ["2022-2", "세계문화의이해", "인성체험/균형교양", 21, "B0"],
    ],
  },
  {
    id: "2021002",
    name: "이서연",
    year: 2021,
    courses: [
      ["2021-1", "공동체와윤리", "인성체험교양", 2, "A0"],
      ["2021-1", "Academic English", "기초교양-외국어역량", 6, "A+"],
      ["2021-2", "비판적사고와토론", "기초교양-글쓰기/독서와토론", 6, "B+"],
      ["2022-1", "파이썬기초", "기초교양-소프트웨어", 2, "A0"],
      ["2022-2", "글로벌시민의식", "인성체험/균형교양", 21, "A+"],
    ],
  },
  {
    id: "2021006",
    name: "강도윤",
    year: 2021,
    courses: [
      ["2021-1", "인성세미나", "인성체험교양", 5, "A0"],
      ["2021-1", "English Reading", "기초교양-외국어역량", 6, "B+"],
      ["2021-2", "논리와글쓰기", "기초교양-글쓰기/독서와토론", 6, "A+"],
      ["2022-1", "컴퓨팅기초", "기초교양-소프트웨어", 2, "B0"],
      ["2022-2", "세계시민교육", "인성체험/균형교양", 15, "B+"],
    ],
  },
  {
    id: "2021008",
    name: "오세훈",
    year: 2021,
    courses: [
      ["2021-1", "대학과인성", "인성체험교양", 5, "B+"],
      ["2021-1", "Practical English", "기초교양-외국어역량", 3, "C+"],
      ["2021-2", "문제해결글쓰기", "기초교양-글쓰기/독서와토론", 6, "B0"],
      ["2022-1", "AI기초", "기초교양-소프트웨어", 2, "A0"],
      ["2022-2", "문학과삶", "인성체험/균형교양", 24, "B+"],
    ],
  },
  {
    id: "2021010",
    name: "박서준",
    year: 2021,
    courses: [
      ["2021-1", "대학생활과진로", "인성체험교양", 5, "B+"],
      ["2021-1", "English Communication", "기초교양-외국어역량", 6, "B0"],
      ["2021-2", "글쓰기기초", "기초교양-글쓰기/독서와토론", 3, "C+"],
      ["2022-1", "컴퓨팅사고", "기초교양-소프트웨어", 2, "A0"],
      ["2022-2", "글로벌문화이해", "인성체험/균형교양", 24, "B+"],
    ],
  },
];

function analyze(student) {
  const earnedMap = {};

  Object.keys(requiredRules).forEach((key) => {
    earnedMap[key] = 0;
  });

  student.courses.forEach((course) => {
    const category = course[2];
    const credit = Number(course[3]);

    if (earnedMap[category] !== undefined) {
      earnedMap[category] += credit;
    }
  });

  const rows = Object.entries(requiredRules).map(([category, required]) => {
    const earned = earnedMap[category];
    const lack = Math.max(required - earned, 0);

    return {
      category,
      required,
      earned,
      lack,
      status: lack === 0 ? "충족" : "미달",
    };
  });

  const missing = rows.filter((row) => row.status === "미달");

  return {
    rows,
    missing,
    pass: missing.length === 0,
  };
}

export default function App() {
  const [selectedId, setSelectedId] = useState("2021010");
  const [fileName, setFileName] = useState("sample_transcripts_10.csv");

  const student = sampleStudents.find((s) => s.id === selectedId);
  const result = useMemo(() => analyze(student), [student]);

  const requiredTotal = Object.values(requiredRules).reduce((a, b) => a + b, 0);

  const earnedTotal = result.rows.reduce(
    (sum, row) => sum + Math.min(row.earned, row.required),
    0
  );

  const aiMessage = result.pass
    ? `${student.name} 학생은 현재 입력된 성적증명서 기준으로 교양과정 졸업요건을 충족했습니다.`
    : `${student.name} 학생은 현재 입력된 성적증명서 기준으로 졸업요건이 미달됩니다. ${result.missing
        .map((m) => `${m.category} ${m.lack}학점`)
        .join(", ")}이 부족합니다.`;

  const jsonPreview = {
    status: result.pass ? "충족" : "미달",
    student: student.name,
    student_id: student.id,
    earned_total: earnedTotal,
    required_total: requiredTotal,
    missing: result.missing,
    transcript: student.courses,
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Graduation Check AI Agent</h1>
          <p style={styles.subtitle}>성적증명서 기반 졸업요건 자동 판정 서비스</p>
        </div>
        <button style={styles.darkButton}>관리자 기준표 설정</button>
      </header>

      <main style={styles.layout}>
        <section>
          <div style={styles.card}>
            <h2>샘플 데이터 테스트</h2>
            <p style={styles.muted}>
              학생을 선택하면 졸업 가능/불가능이 자동으로 계산됩니다.
            </p>

            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={styles.select}
            >
              {sampleStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.card}>
            <h2>성적증명서 업로드</h2>
            <label style={styles.uploadBox}>
              <strong>PDF / CSV / XLSX 파일 선택</strong>
              <span style={styles.muted}>현재는 파일명 표시만 지원합니다.</span>
              <input
                type="file"
                accept=".pdf,.csv,.xlsx"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFileName(file.name);
                }}
              />
            </label>

            <div style={styles.fileBox}>
              <small>선택된 파일</small>
              <strong>{fileName}</strong>
            </div>
          </div>

          <div style={styles.cardDark}>
            <h2>AI 안내 메시지</h2>
            <p>{aiMessage}</p>
          </div>

          <div style={styles.card}>
            <h2>Webhook JSON Preview</h2>
            <pre style={styles.pre}>{JSON.stringify(jsonPreview, null, 2)}</pre>
          </div>
        </section>

        <section>
          <div style={styles.statsGrid}>
            <div style={styles.card}>
              <p style={styles.muted}>판정 결과</p>
              <h2 style={{ color: result.pass ? "#059669" : "#dc2626" }}>
                {result.pass ? "졸업 가능" : "졸업 불가"}
              </h2>
            </div>

            <div style={styles.card}>
              <p style={styles.muted}>인정 학점</p>
              <h2>
                {earnedTotal} / {requiredTotal}
              </h2>
            </div>

            <div style={styles.card}>
              <p style={styles.muted}>미달 영역</p>
              <h2>{result.missing.length}개</h2>
            </div>
          </div>

          <div style={styles.card}>
            <h2>학생 기본정보</h2>
            <div style={styles.infoGrid}>
              <Info label="이름" value={student.name} />
              <Info label="학번" value={student.id} />
              <Info label="입학년도" value={student.year} />
              <Info label="적용 교육과정" value="2021학번 이후" />
            </div>
          </div>

          <div style={styles.card}>
            <h2>졸업요건 충족 현황</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>교과(이수)구분</th>
                  <th style={styles.th}>필요학점</th>
                  <th style={styles.th}>이수학점</th>
                  <th style={styles.th}>부족학점</th>
                  <th style={styles.th}>상태</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.category}>
                    <td style={styles.td}>{row.category}</td>
                    <td style={styles.td}>{row.required}</td>
                    <td style={styles.td}>{row.earned}</td>
                    <td style={styles.td}>{row.lack}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background: row.status === "충족" ? "#dcfce7" : "#fee2e2",
                          color: row.status === "충족" ? "#166534" : "#991b1b",
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.card}>
            <h2>성적증명서 추출 데이터</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>학기</th>
                  <th style={styles.th}>교과목명</th>
                  <th style={styles.th}>이수구분</th>
                  <th style={styles.th}>학점</th>
                  <th style={styles.th}>성적</th>
                </tr>
              </thead>
              <tbody>
                {student.courses.map((course, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{course[0]}</td>
                    <td style={styles.td}>{course[1]}</td>
                    <td style={styles.td}>{course[2]}</td>
                    <td style={styles.td}>{course[3]}</td>
                    <td style={styles.td}>{course[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  header: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  title: {
    margin: 0,
    fontSize: "28px",
  },
  subtitle: {
    color: "#64748b",
    marginTop: "6px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "22px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  cardDark: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "22px",
    marginBottom: "20px",
  },
  darkButton: {
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  muted: {
    color: "#64748b",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    marginTop: "12px",
  },
  uploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    cursor: "pointer",
    background: "#f8fafc",
  },
  fileBox: {
    marginTop: "14px",
    padding: "14px",
    borderRadius: "12px",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },
  infoBox: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
    fontSize: "14px",
  },
  th: {
    background: "#e2e8f0",
    border: "1px solid #cbd5e1",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #e2e8f0",
    padding: "10px",
  },
  badge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "12px",
  },
  pre: {
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "12px",
    overflowX: "auto",
    fontSize: "12px",
  },
};