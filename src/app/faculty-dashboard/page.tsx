"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import {
  formatDateIST,
  istDateTimeInputToUtcIso,
  localDateKeyIST,
  utcToIstDateTimeInput,
} from "@/lib/timezone";
import {
  Bell,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  BarChart2,
  Video,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  ClipboardList,
  Plus,
  X,
  Send,
  PlayCircle,
  ExternalLink,
  FileQuestion,
  Trash2,
  Edit3,
  FileDown,
  Zap,
  ChevronRight,
} from "lucide-react";

/* â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type Section =
  | "dashboard"
  | "attendance"
  | "mcq"
  | "evaluations"
  | "classes"
  | "lectures"
  | "tasks"
  | "students";
type Profile = { full_name: string; phone: string | null };
type Batch = {
  id: number;
  batch_name: string;
  start_date: string | null;
  end_date: string | null;
  courses: { id: number; title: string } | null;
  enrollments: { count: number }[];
};
type ClassSession = {
  id: number;
  batch_id: number;
  title: string;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  meeting_link: string | null;
  is_live: boolean;
  batches: { batch_name: string; courses: { title: string } | null } | null;
};
type BatchStudent = {
  batch_id: number;
  student_user_id: string;
  full_name: string;
  batch_name: string;
  course_id: number | null;
  course_title: string;
};
type FacultyTask = {
  id: number;
  batch_id: number | null;
  student_user_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  batches: { batch_name: string } | null;
  profiles: { full_name: string } | null;
};
type StudentProgress = {
  student_user_id: string;
  course_id: number;
  progress_percent: number;
  full_name: string;
  course_title: string;
};
type ExamScore = {
  mock_test_id: number;
  student_user_id: string;
  mcq_score: number | null;
  descriptive_score: number | null;
};
type McqTestFaculty = {
  id: number;
  title: string;
  total_marks: number;
  time_limit_minutes: number;
  exam_type: string;
  test_type?: string; // 'mcq' or 'descriptive'
  scheduled_at: string | null;
  is_published: boolean;
  batch_id: number | null;
  courses: { title: string } | null;
  batches: { batch_name: string } | null;
  mcq_questions?: { count: number }[];
};
type McqQuestion = {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  marks: number;
  question_order: number;
};
type DescriptiveQuestion = {
  id: number;
  mock_test_id: number;
  question_text: string;
  marks: number;
  question_order: number;
  category: string | null;
};
type DescriptiveAnswer = {
  id: number;
  mock_test_id: number;
  student_user_id: string;
  question_id: number;
  answer_file_url: string | null;
  submitted_at: string | null;
  marks_obtained: number | null;
  faculty_notes: string | null;
  evaluated_at: string | null;
  student_name?: string; // For display purposes
};
type RecordedLectureFaculty = {
  id: number;
  title: string;
  description: string | null;
  subject: string | null;
  drive_link: string;
  created_at: string;
  batch_id: number | null;
  batches: { batch_name: string } | null;
};
type AttendanceSession = {
  id: number;
  batch_id: number;
  title: string;
  session_date: string;
  start_time: string | null;
  batches: { batch_name: string } | null;
};
type StudentAttendance = { student_user_id: string; status: string };

function unwrapOne<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}
function fmtDate(s: string | null) {
  return formatDateIST(s);
}
function fmtTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}
function toLocalDateTimeInput(value: string | null) {
  return utcToIstDateTimeInput(value);
}
function toUtcIsoFromLocalInput(value: string) {
  return istDateTimeInputToUtcIso(value);
}
function localDateKey(d: Date = new Date()) {
  return localDateKeyIST(d);
}
function isCompletedSession(sessionDate: string, startTime: string | null) {
  const today = localDateKey();
  if (sessionDate < today) return true;
  if (sessionDate > today) return false;
  if (!startTime) return false;

  const [h, m] = startTime.split(":").map((v) => parseInt(v, 10));
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sessionMinutes = h * 60 + m;
  return sessionMinutes <= nowMinutes;
}
function isUpcomingSession(sessionDate: string, startTime: string | null) {
  const today = localDateKey();
  if (sessionDate > today) return true;
  if (sessionDate < today) return false;
  if (!startTime) return true;

  const [h, m] = startTime.split(":").map((v) => parseInt(v, 10));
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sessionMinutes = h * 60 + m;
  return sessionMinutes > nowMinutes;
}
function normalizeAttendanceTitle(title: string) {
  return title.replace(/\s*\(upcoming\)\s*$/i, "").trim();
}
function csvEscape(value: string | number | null | undefined) {
  const raw = String(value ?? "");
  return `"${raw.replace(/"/g, '""')}"`;
}
function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const csv = [
    headers.map((h) => csvEscape(h)).join(","),
    ...rows.map((row) => row.map((cell) => csvEscape(cell)).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function pct(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  submitted: "bg-blue-100 text-blue-700",
  reviewed: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
};
const NEXT_STATUS: Record<string, string> = {
  pending: "submitted",
  submitted: "reviewed",
  reviewed: "completed",
  completed: "completed",
};

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );
}

function NavBtn({
  section,
  active,
  onClick,
  icon: Icon,
  label,
}: {
  section: Section;
  active: Section;
  onClick: (s: Section) => void;
  icon: React.ElementType;
  label: string;
}) {
  const isActive = section === active;
  return (
    <button
      onClick={() => onClick(section)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${isActive ? "bg-white text-emerald-700 font-semibold shadow-sm border border-emerald-100" : "text-gray-700 hover:bg-white hover:shadow-sm"}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FACULTY DASHBOARD
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function FacultyDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassSession[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [batchStudents, setBatchStudents] = useState<BatchStudent[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [progressUpdating, setProgressUpdating] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* exam scores */
  const [examScores, setExamScores] = useState<ExamScore[]>([]);
  const [examScoreSaving, setExamScoreSaving] = useState<string | null>(null);
  const [examScoreMsg, setExamScoreMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [completedTestIdsByStudent, setCompletedTestIdsByStudent] = useState<
    Record<string, number[]>
  >({});
  const [scoreInputs, setScoreInputs] = useState<
    Record<string, { mcq: string; desc: string }>
  >({});

  /* tasks */
  const [tasks, setTasks] = useState<FacultyTask[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskMsg, setTaskMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [taskForm, setTaskForm] = useState({
    batchId: "",
    studentId: "",
    title: "",
    description: "",
    dueDate: "",
  });

  /* MCQ */
  const [mcqTests, setMcqTests] = useState<McqTestFaculty[]>([]);
  const [selectedTest, setSelectedTest] = useState<McqTestFaculty | null>(null);
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [testQuestions, setTestQuestions] = useState<McqQuestion[]>([]);
  const [showMcqForm, setShowMcqForm] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [mcqMsg, setMcqMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [mcqSubmitting, setMcqSubmitting] = useState(false);
  const [mcqForm, setMcqForm] = useState({
    batchId: "",
    title: "",
    testType: "mcq", // 'mcq' or 'descriptive'
    timeLimitMinutes: "60",
    examType: "mock",
    scheduledAt: "",
    totalMarks: "100",
  });
  const [qForm, setQForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    marks: "1",
  });
  const [descriptiveQForm, setDescriptiveQForm] = useState({
    questionText: "",
    marks: "5",
    category: "",
  });

  /* evaluations - descriptive test grading */
  const [descriptiveTests, setDescriptiveTests] = useState<McqTestFaculty[]>(
    [],
  );
  const [selectedEvalTest, setSelectedEvalTest] =
    useState<McqTestFaculty | null>(null);
  const [descriptiveQuestions, setDescriptiveQuestions] = useState<
    DescriptiveQuestion[]
  >([]);
  const [studentSubmissions, setStudentSubmissions] = useState<
    DescriptiveAnswer[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<DescriptiveAnswer | null>(null);
  const [evaluationForm, setEvaluationForm] = useState({
    marksObtained: "",
    facultyNotes: "",
  });
  const [evaluationUpdating, setEvaluationUpdating] = useState(false);
  const [evaluationMsg, setEvaluationMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* classes */
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [classMsg, setClassMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [classSubmitting, setClassSubmitting] = useState(false);
  const [classForm, setClassForm] = useState({
    batchId: "",
    title: "",
    sessionDate: "",
    startTime: "",
    endTime: "",
    meetingLink: "",
    isLive: false,
  });

  /* lectures */
  const [lectures, setLectures] = useState<RecordedLectureFaculty[]>([]);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [lectureMsg, setLectureMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [lectureSubmitting, setLectureSubmitting] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    batchId: "",
    title: "",
    subject: "",
    description: "",
    driveLink: "",
  });

  /* attendance */
  const [attendanceSessions, setAttendanceSessions] = useState<
    AttendanceSession[]
  >([]);
  const [selectedSession, setSelectedSession] =
    useState<AttendanceSession | null>(null);
  const [sessionStudents, setSessionStudents] = useState<BatchStudent[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>(
    {},
  );
  const [attendanceSubmitting, setAttendanceSubmitting] = useState(false);
  const [attendanceExporting, setAttendanceExporting] = useState(false);
  const [attendanceMsg, setAttendanceMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* â”€â”€ load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      setTotalStudents(0);
      setActiveTasksCount(0);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login-portal");
        return;
      }
      const uid = user.id;

      const [
        profileRes,
        batchesRes,
        tasksRes,
        mcqRes,
        lecturesRes,
        attSessionsRes,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, role")
          .eq("user_id", uid)
          .single(),
        supabase
          .from("batches")
          .select(
            "id, batch_name, start_date, end_date, courses(id, title), enrollments(count)",
          )
          .eq("faculty_user_id", uid),
        supabase
          .from("faculty_tasks")
          .select(
            "id, batch_id, student_user_id, title, description, due_date, status, batches(batch_name), profiles(full_name)",
          )
          .eq("faculty_user_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("mock_tests")
          .select(
            "id, title, total_marks, time_limit_minutes, exam_type, test_type, scheduled_at, is_published, batch_id, courses(title), batches(batch_name), mcq_questions(count)",
          )
          .eq("created_by", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("recorded_lectures")
          .select(
            "id, title, description, subject, drive_link, created_at, batch_id, batches(batch_name)",
          )
          .eq("faculty_user_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("class_sessions")
          .select(
            "id, batch_id, title, session_date, start_time, batches(batch_name)",
          )
          .order("session_date", { ascending: false })
          .limit(30),
      ]);

      if (profileRes.data) {
        const role = (profileRes.data as { role?: string }).role;
        if (role === "student") {
          router.push("/student-dashboard");
          return;
        }
        if (role === "admin") {
          router.push("/admin-dashboard");
          return;
        }
        setProfile(profileRes.data as Profile);
      }
      if (tasksRes.data) {
        const taskRows = tasksRes.data as unknown as FacultyTask[];
        setTasks(taskRows);
        setActiveTasksCount(
          taskRows.filter((t) => t.status !== "completed").length,
        );
      }
      if (mcqRes.data) setMcqTests(mcqRes.data as unknown as McqTestFaculty[]);
      if (lecturesRes.data)
        setLectures(lecturesRes.data as unknown as RecordedLectureFaculty[]);

      // Load classes with backward-compatible fallback for DBs missing is_live.
      const { data: classesData, error: classesError } = await supabase
        .from("class_sessions")
        .select(
          "id, batch_id, title, session_date, start_time, end_time, meeting_link, is_live, batches(batch_name, courses(title))",
        )
        .order("session_date", { ascending: false })
        .limit(50);

      if (!classesError && classesData) {
        setUpcomingClasses(classesData as unknown as ClassSession[]);
      } else if (classesError && /is_live/i.test(classesError.message)) {
        const { data: legacyClassesData, error: legacyClassesError } =
          await supabase
            .from("class_sessions")
            .select(
              "id, batch_id, title, session_date, start_time, end_time, meeting_link, batches(batch_name, courses(title))",
            )
            .order("session_date", { ascending: false })
            .limit(50);

        if (legacyClassesError) throw legacyClassesError;
        const normalized =
          (
            legacyClassesData as unknown as Omit<ClassSession, "is_live">[]
          )?.map((row) => ({
            ...row,
            is_live: false,
          })) ?? [];
        setUpcomingClasses(normalized);
      } else if (classesError) {
        throw classesError;
      }

      if (attSessionsRes.data)
        setAttendanceSessions(
          (attSessionsRes.data as unknown as AttendanceSession[]).filter((s) =>
            isCompletedSession(s.session_date, s.start_time),
          ),
        );

      if (batchesRes.data) {
        const batchData = batchesRes.data as unknown as Batch[];
        setBatches(batchData);

        if (batchData.length > 0) {
          const batchIds = batchData.map((b) => b.id);

          // Pull tests tied to faculty batches (not only tests created by this faculty)
          const { data: batchTestsData } = await supabase
            .from("mock_tests")
            .select(
              "id, title, total_marks, time_limit_minutes, exam_type, test_type, scheduled_at, is_published, batch_id, courses(title), batches(batch_name), mcq_questions(count)",
            )
            .in("batch_id", batchIds)
            .order("created_at", { ascending: false });
          if (batchTestsData) {
            setMcqTests(batchTestsData as unknown as McqTestFaculty[]);
          }

          const { data: enrollData } = await supabase
            .from("enrollments")
            .select(
              "batch_id, student_user_id, batches(batch_name, courses(id, title))",
            )
            .in("batch_id", batchIds);
          if (enrollData && enrollData.length > 0) {
            const studentIds = [
              ...new Set(enrollData.map((e) => e.student_user_id)),
            ];
            setTotalStudents(studentIds.length);
            const { data: profilesData } = await supabase
              .from("profiles")
              .select("user_id, full_name")
              .in("user_id", studentIds);
            const nameMap: Record<string, string> = {};
            (profilesData ?? []).forEach((p) => {
              nameMap[p.user_id] = p.full_name;
            });
            const students: BatchStudent[] = (
              enrollData as unknown as {
                batch_id: number;
                student_user_id: string;
                batches:
                  | {
                      batch_name: string;
                      courses:
                        | { id: number; title: string }
                        | { id: number; title: string }[]
                        | null;
                    }
                  | {
                      batch_name: string;
                      courses:
                        | { id: number; title: string }
                        | { id: number; title: string }[]
                        | null;
                    }[]
                  | null;
              }[]
            ).map((e) => {
              const batchObj = unwrapOne(e.batches) as {
                batch_name: string;
                courses: { id: number; title: string } | null;
              } | null;
              const courseObj = unwrapOne(batchObj?.courses ?? null) as {
                id: number;
                title: string;
              } | null;
              return {
                batch_id: e.batch_id,
                student_user_id: e.student_user_id,
                full_name: nameMap[e.student_user_id] ?? "Student",
                batch_name: batchObj?.batch_name ?? "",
                course_id: courseObj?.id ?? null,
                course_title: courseObj?.title ?? "Course",
              };
            });
            setBatchStudents(students);

            // Exams each student has actually completed (MCQ/descriptive)
            const [mcqAttemptsRes, descAttemptsRes] = await Promise.all([
              supabase
                .from("mcq_student_answers")
                .select("mock_test_id, student_user_id")
                .in("student_user_id", studentIds),
              supabase
                .from("descriptive_student_answers")
                .select("mock_test_id, student_user_id, submitted_at")
                .in("student_user_id", studentIds)
                .not("submitted_at", "is", null),
            ]);

            const completedMap: Record<string, number[]> = {};
            const pushUnique = (studentId: string, testId: number) => {
              if (!completedMap[studentId]) completedMap[studentId] = [];
              if (!completedMap[studentId].includes(testId)) {
                completedMap[studentId].push(testId);
              }
            };

            (mcqAttemptsRes.data ?? []).forEach((row) => {
              pushUnique(
                row.student_user_id as string,
                row.mock_test_id as number,
              );
            });
            (descAttemptsRes.data ?? []).forEach((row) => {
              pushUnique(
                row.student_user_id as string,
                row.mock_test_id as number,
              );
            });
            setCompletedTestIdsByStudent(completedMap);

            const courseIds = batchData
              .map(
                (b) =>
                  unwrapOne(
                    b.courses as
                      | { id: number; title: string }
                      | { id: number; title: string }[]
                      | null,
                  )?.id,
              )
              .filter(Boolean) as number[];
            if (courseIds.length > 0 && studentIds.length > 0) {
              const { data: progressData } = await supabase
                .from("student_course_progress")
                .select(
                  "student_user_id, course_id, progress_percent, courses(title)",
                )
                .in("student_user_id", studentIds)
                .in("course_id", courseIds);
              if (progressData) {
                setStudentProgress(
                  (
                    progressData as unknown as {
                      student_user_id: string;
                      course_id: number;
                      progress_percent: number;
                      courses: { title: string } | null;
                    }[]
                  ).map((p) => ({
                    student_user_id: p.student_user_id,
                    course_id: p.course_id,
                    progress_percent: p.progress_percent,
                    full_name: nameMap[p.student_user_id] ?? "Student",
                    course_title: unwrapOne(p.courses)?.title ?? "Course",
                  })),
                );
              }
            }

            // Load existing exam scores for these students
            const [{ data: scoresData }, { data: attemptScoresData }] =
              await Promise.all([
                supabase
                  .from("student_mock_test_scores")
                  .select(
                    "mock_test_id, student_user_id, mcq_score, descriptive_score",
                  )
                  .in("student_user_id", studentIds),
                supabase
                  .from("mock_test_attempts")
                  .select("mock_test_id, student_user_id, scored_marks")
                  .in("student_user_id", studentIds),
              ]);

            const mergedScores = new Map<string, ExamScore>();

            (attemptScoresData ?? []).forEach((row) => {
              const key = `${row.mock_test_id}_${row.student_user_id}`;
              mergedScores.set(key, {
                mock_test_id: row.mock_test_id as number,
                student_user_id: row.student_user_id as string,
                mcq_score: Number(row.scored_marks ?? 0),
                descriptive_score: null,
              });
            });

            ((scoresData as ExamScore[] | null) ?? []).forEach((row) => {
              const key = `${row.mock_test_id}_${row.student_user_id}`;
              const existing = mergedScores.get(key);
              mergedScores.set(key, {
                mock_test_id: row.mock_test_id,
                student_user_id: row.student_user_id,
                mcq_score:
                  row.mcq_score != null
                    ? row.mcq_score
                    : (existing?.mcq_score ?? null),
                descriptive_score:
                  row.descriptive_score != null
                    ? row.descriptive_score
                    : (existing?.descriptive_score ?? null),
              });
            });

            const mergedScoresList = Array.from(mergedScores.values());
            setExamScores(mergedScoresList);

            const inputs: Record<string, { mcq: string; desc: string }> = {};
            mergedScoresList.forEach((s) => {
              const key = `${s.mock_test_id}_${s.student_user_id}`;
              inputs[key] = {
                mcq: s.mcq_score != null ? String(s.mcq_score) : "",
                desc:
                  s.descriptive_score != null
                    ? String(s.descriptive_score)
                    : "",
              };
            });
            setScoreInputs(inputs);
          } else {
            setTotalStudents(0);
          }
        } else {
          setTotalStudents(0);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (activeSection === "evaluations") {
      loadDescriptiveTests();
    }
  }, [activeSection]);

  const dashboardUpcomingClasses = upcomingClasses.filter((s) =>
    isUpcomingSession(s.session_date, s.start_time),
  );

  const upcomingLiveClassesCount = dashboardUpcomingClasses.filter(
    (s) => s.is_live,
  ).length;

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  /* â”€â”€ attendance: load session students & existing marks â”€â”€ */
  async function selectSession(session: AttendanceSession) {
    const supabase = createClient();
    if (!isCompletedSession(session.session_date, session.start_time)) {
      setAttendanceMsg({
        type: "err",
        text: "Attendance can be marked only for completed sessions.",
      });
      return;
    }
    setSelectedSession(session);
    const students = batchStudents.filter(
      (s) => s.batch_id === session.batch_id,
    );
    // fallback: get students from that batch via DB
    if (students.length === 0) {
      const batch = batches.find((b) => b.id === session.batch_id);
      if (batch) {
        const { data: enrollData } = await supabase
          .from("enrollments")
          .select("student_user_id")
          .eq("batch_id", session.batch_id);
        const ids = enrollData?.map((e) => e.student_user_id) ?? [];
        if (ids.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("user_id, full_name")
            .in("user_id", ids);
          const mapped: BatchStudent[] = (profilesData ?? []).map((p) => ({
            batch_id: batch.id,
            student_user_id: p.user_id,
            full_name: p.full_name,
            batch_name: batch.batch_name,
            course_id: null,
            course_title: "Course",
          }));
          setSessionStudents(mapped);
        } else {
          setSessionStudents([]);
        }
      }
    } else {
      setSessionStudents(students);
    }
    // load existing attendance
    const { data: existingData } = await supabase
      .from("student_attendance")
      .select("student_user_id, status")
      .eq("session_id", session.id);
    const map: Record<string, string> = {};
    ((existingData as unknown as StudentAttendance[]) ?? []).forEach((a) => {
      map[a.student_user_id] = a.status === "present" ? "present" : "absent";
    });
    setAttendanceMap(map);
  }

  async function saveAttendance() {
    if (!selectedSession) return;
    const supabase = createClient();
    setAttendanceSubmitting(true);
    setAttendanceMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const rows = sessionStudents.map((s) => ({
        session_id: selectedSession.id,
        student_user_id: s.student_user_id,
        status: attendanceMap[s.student_user_id] ?? "absent",
        marked_by: user.id,
      }));
      const { error } = await supabase
        .from("student_attendance")
        .upsert(rows, { onConflict: "session_id,student_user_id" });
      if (error) throw error;
      setAttendanceMsg({ type: "ok", text: "Attendance saved successfully!" });
    } catch {
      setAttendanceMsg({ type: "err", text: "Failed to save attendance." });
    } finally {
      setAttendanceSubmitting(false);
    }
  }

  function exportAttendanceSectionWise() {
    if (!selectedSession) {
      setAttendanceMsg({
        type: "err",
        text: "Select a session to export section-wise attendance.",
      });
      return;
    }
    if (sessionStudents.length === 0) {
      setAttendanceMsg({
        type: "err",
        text: "No students found to export.",
      });
      return;
    }

    const batch = unwrapOne(selectedSession.batches)?.batch_name ?? "-";
    const rows = sessionStudents.map((s) => [
      normalizeAttendanceTitle(selectedSession.title),
      fmtDate(selectedSession.session_date),
      fmtTime(selectedSession.start_time),
      batch,
      s.full_name,
      attendanceMap[s.student_user_id] === "present" ? "Present" : "Absent",
    ]);
    downloadCsv(
      `attendance_section_${selectedSession.id}.csv`,
      ["Session", "Date", "Time", "Batch", "Student", "Status"],
      rows,
    );
    setAttendanceMsg({ type: "ok", text: "Section-wise attendance exported." });
  }

  async function exportAttendanceConsolidated() {
    if (attendanceSessions.length === 0) {
      setAttendanceMsg({
        type: "err",
        text: "No completed sessions available for consolidated export.",
      });
      return;
    }

    const supabase = createClient();
    setAttendanceExporting(true);
    setAttendanceMsg(null);
    try {
      const sessionMap = new Map(attendanceSessions.map((s) => [s.id, s]));
      const sessionIds = attendanceSessions.map((s) => s.id);
      const { data, error } = await supabase
        .from("student_attendance")
        .select("session_id, student_user_id, status")
        .in("session_id", sessionIds);
      if (error) throw error;

      const nameMap: Record<string, string> = {};
      batchStudents.forEach((s) => {
        nameMap[s.student_user_id] = s.full_name;
      });
      sessionStudents.forEach((s) => {
        nameMap[s.student_user_id] = s.full_name;
      });

      const rows = (
        (data as unknown as {
          session_id: number;
          student_user_id: string;
          status: string;
        }[]) ?? []
      )
        .map((r) => {
          const session = sessionMap.get(r.session_id);
          if (!session) return null;
          const batch = unwrapOne(session.batches)?.batch_name ?? "-";
          return [
            normalizeAttendanceTitle(session.title),
            fmtDate(session.session_date),
            fmtTime(session.start_time),
            batch,
            nameMap[r.student_user_id] ?? "Student",
            r.status === "present" ? "Present" : "Absent",
          ];
        })
        .filter(Boolean) as (string | number)[][];

      if (rows.length === 0) {
        setAttendanceMsg({
          type: "err",
          text: "No attendance records found for consolidated export.",
        });
        return;
      }

      downloadCsv(
        "attendance_consolidated.csv",
        ["Session", "Date", "Time", "Batch", "Student", "Status"],
        rows,
      );
      setAttendanceMsg({
        type: "ok",
        text: "Consolidated attendance exported.",
      });
    } catch {
      setAttendanceMsg({
        type: "err",
        text: "Failed to export consolidated attendance.",
      });
    } finally {
      setAttendanceExporting(false);
    }
  }

  /* â”€â”€ MCQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function resetMcqForm() {
    setEditingTestId(null);
    setShowMcqForm(false);
    setMcqForm({
      batchId: "",
      title: "",
      testType: "mcq",
      timeLimitMinutes: "60",
      examType: "mock",
      scheduledAt: "",
      totalMarks: "100",
    });
  }

  function startEditingTest(test: McqTestFaculty) {
    setEditingTestId(test.id);
    setShowMcqForm(true);
    setMcqForm({
      batchId: test.batch_id ? String(test.batch_id) : "",
      title: test.title,
      testType: test.test_type ?? "mcq",
      timeLimitMinutes: String(test.time_limit_minutes ?? 60),
      examType: test.exam_type ?? "mock",
      scheduledAt: toLocalDateTimeInput(test.scheduled_at),
      totalMarks: String(test.total_marks),
    });
  }

  async function createMcqTest() {
    const supabase = createClient();
    setMcqSubmitting(true);
    setMcqMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const batchId = parseInt(mcqForm.batchId, 10);
      const totalMarks = parseInt(mcqForm.totalMarks, 10);
      const timeLimitMinutes = parseInt(mcqForm.timeLimitMinutes, 10);

      if (!Number.isFinite(batchId)) {
        setMcqMsg({ type: "err", text: "Please select a batch." });
        return;
      }
      if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
        setMcqMsg({ type: "err", text: "Total marks must be greater than 0." });
        return;
      }
      if (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes <= 0) {
        setMcqMsg({ type: "err", text: "Time limit must be greater than 0." });
        return;
      }

      const batch = batches.find((b) => b.id === batchId);
      const courseId = unwrapOne(
        batch?.courses as
          | { id: number; title: string }
          | { id: number; title: string }[]
          | null,
      )?.id;
      if (!courseId) {
        setMcqMsg({
          type: "err",
          text: "Selected batch has no linked course. Please assign a course to this batch first.",
        });
        return;
      }

      const fullPayload = {
        title: mcqForm.title.trim(),
        total_marks: totalMarks,
        time_limit_minutes: timeLimitMinutes,
        exam_type: mcqForm.examType,
        test_type: mcqForm.testType,
        batch_id: batchId,
        course_id: courseId,
        is_published: editingTestId
          ? (selectedTest?.is_published ?? false)
          : false,
        scheduled_at: toUtcIsoFromLocalInput(mcqForm.scheduledAt),
        created_by: user.id,
      };

      const minimalPayload = {
        // Base schema compatibility payload (without newer columns)
        title: mcqForm.title.trim(),
        total_marks: totalMarks,
        course_id: courseId,
        scheduled_at: toUtcIsoFromLocalInput(mcqForm.scheduledAt),
        created_by: user.id,
      };

      // Some DB instances still have the older mock_tests schema.
      // Try full write first; if columns are missing, retry with minimal payload.
      let insertData: unknown = null;
      let insertError: { code?: string; message?: string } | null = null;

      const fullInsert = editingTestId
        ? await supabase
            .from("mock_tests")
            .update(fullPayload)
            .eq("id", editingTestId)
            .select()
            .single()
        : await supabase
            .from("mock_tests")
            .insert(fullPayload)
            .select()
            .single();
      insertData = fullInsert.data;
      insertError = fullInsert.error as {
        code?: string;
        message?: string;
      } | null;

      if (insertError?.code === "42703") {
        const fallbackInsert = editingTestId
          ? await supabase
              .from("mock_tests")
              .update(minimalPayload)
              .eq("id", editingTestId)
              .select()
              .single()
          : await supabase
              .from("mock_tests")
              .insert(minimalPayload)
              .select()
              .single();
        insertData = fallbackInsert.data;
        insertError = fallbackInsert.error as {
          code?: string;
          message?: string;
        } | null;
      }

      if (insertError) throw insertError;

      setMcqMsg({
        type: "ok",
        text: editingTestId
          ? "Test updated successfully."
          : "Test created! Add questions now.",
      });
      resetMcqForm();
      load();
      if (insertData) setSelectedTest(insertData as McqTestFaculty);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to create test.";
      setMcqMsg({ type: "err", text: msg });
    } finally {
      setMcqSubmitting(false);
    }
  }

  async function loadQuestions(test: McqTestFaculty) {
    const supabase = createClient();
    setSelectedTest(test);

    if (test.test_type === "mcq") {
      const { data } = await supabase
        .from("mcq_questions")
        .select("*")
        .eq("mock_test_id", test.id)
        .order("question_order", { ascending: true });
      setTestQuestions((data ?? []) as McqQuestion[]);
    } else {
      // For descriptive tests, fetch from descriptive_questions table
      const { data } = await supabase
        .from("descriptive_questions")
        .select("*")
        .eq("mock_test_id", test.id)
        .order("question_order", { ascending: true });
      // Convert descriptive questions to a format compatible with testQuestions
      setTestQuestions(
        (data ?? []).map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          marks: q.marks,
          question_order: q.question_order,
          category: q.category,
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_option: "",
        })) as unknown as McqQuestion[],
      );
    }
  }

  async function addQuestion() {
    if (!selectedTest) return;
    const supabase = createClient();
    setMcqSubmitting(true);
    try {
      // Handle MCQ questions
      if (selectedTest.test_type === "mcq") {
        const { error } = await supabase.from("mcq_questions").insert({
          mock_test_id: selectedTest.id,
          question_text: qForm.questionText,
          option_a: qForm.optionA,
          option_b: qForm.optionB,
          option_c: qForm.optionC,
          option_d: qForm.optionD,
          correct_option: qForm.correctOption,
          marks: parseInt(qForm.marks),
          question_order: testQuestions.length + 1,
        });
        if (error) throw error;
        setQForm({
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctOption: "A",
          marks: "1",
        });
      } else {
        // Handle Descriptive questions
        const { error } = await supabase.from("descriptive_questions").insert({
          mock_test_id: selectedTest.id,
          question_text: descriptiveQForm.questionText,
          marks: parseInt(descriptiveQForm.marks),
          category: descriptiveQForm.category || null,
          question_order: testQuestions.length + 1,
        });
        if (error) throw error;
        setDescriptiveQForm({
          questionText: "",
          marks: "5",
          category: "",
        });
      }
      setShowQForm(false);
      loadQuestions(selectedTest);
    } catch (err) {
      console.error(err);
      setMcqMsg({ type: "err", text: "Failed to add question." });
    } finally {
      setMcqSubmitting(false);
    }
  }

  async function togglePublish(test: McqTestFaculty) {
    const supabase = createClient();
    setMcqMsg(null);
    const nextPublished = !test.is_published;
    const { error } = await supabase
      .from("mock_tests")
      .update({ is_published: nextPublished })
      .eq("id", test.id);

    if (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === "42703") {
        setMcqMsg({
          type: "err",
          text: "Publish is unavailable because 'is_published' column is missing in your DB. Please run the migration 20260423_add_mcq_lectures_razorpay.sql.",
        });
        return;
      }
      setMcqMsg({
        type: "err",
        text: err.message || "Failed to update publish status.",
      });
      return;
    }

    setMcqMsg({
      type: "ok",
      text: nextPublished
        ? "Test published to students."
        : "Test unpublished successfully.",
    });

    if (selectedTest?.id === test.id) {
      setSelectedTest({ ...selectedTest, is_published: nextPublished });
    }
    load();
  }

  async function deleteTest(test: McqTestFaculty) {
    if (!confirm(`Delete test "${test.title}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("mock_tests")
      .delete()
      .eq("id", test.id);
    if (!error) {
      if (selectedTest?.id === test.id) {
        setSelectedTest(null);
        setTestQuestions([]);
      }
      if (editingTestId === test.id) {
        resetMcqForm();
      }
      setMcqMsg({ type: "ok", text: "Test deleted successfully." });
      load();
    } else {
      setMcqMsg({ type: "err", text: "Failed to delete test." });
    }
  }

  async function deleteQuestion(qId: number) {
    if (!confirm("Delete this question?")) return;
    const supabase = createClient();
    await supabase.from("mcq_questions").delete().eq("id", qId);
    if (selectedTest) loadQuestions(selectedTest);
  }

  async function loadDescriptiveTests() {
    const supabase = createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("mock_tests")
        .select("*,batches(batch_name),courses(title)")
        .eq("test_type", "descriptive");

      if (error) throw error;
      setDescriptiveTests(data || []);
    } catch (err) {
      console.error("Error loading descriptive tests:", err);
    }
  }

  async function loadDescriptiveQuestions(test: McqTestFaculty) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("descriptive_questions")
        .select("*")
        .eq("mock_test_id", test.id)
        .order("question_order");

      if (error) throw error;
      setDescriptiveQuestions(data || []);

      await loadSubmissions(test.id);
    } catch (err) {
      console.error("Error loading descriptive questions:", err);
    }
  }

  async function loadSubmissions(testId: number) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("descriptive_student_answers")
        .select("*, student_profiles(full_name)")
        .eq("mock_test_id", testId);

      if (error) throw error;

      const submissions = (data || []).map((s: any) => ({
        ...s,
        student_name: s.student_profiles?.full_name || "Unknown Student",
      }));

      setStudentSubmissions(submissions);
    } catch (err) {
      console.error("Error loading submissions:", err);
    }
  }

  /* â”€â”€ create class session â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function createClass() {
    const supabase = createClient();
    setClassSubmitting(true);
    setClassMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const batchId = parseInt(classForm.batchId, 10);
      if (!classForm.title.trim()) {
        setClassMsg({ type: "err", text: "Please enter class title." });
        return;
      }
      if (!Number.isFinite(batchId)) {
        setClassMsg({ type: "err", text: "Please select a valid batch." });
        return;
      }
      if (!classForm.sessionDate) {
        setClassMsg({ type: "err", text: "Please select class date." });
        return;
      }
      if (classForm.startTime && classForm.endTime) {
        const start = classForm.startTime;
        const end = classForm.endTime;
        if (end <= start) {
          setClassMsg({
            type: "err",
            text: "End time must be later than start time.",
          });
          return;
        }
      }

      const { data: ownBatch, error: ownBatchErr } = await supabase
        .from("batches")
        .select("id")
        .eq("id", batchId)
        .eq("faculty_user_id", user.id)
        .maybeSingle();

      if (ownBatchErr) throw ownBatchErr;
      if (!ownBatch) {
        setClassMsg({
          type: "err",
          text: "You can create classes only for your assigned batches.",
        });
        return;
      }

      const payload = {
        batch_id: batchId,
        title: classForm.title.trim(),
        session_date: classForm.sessionDate,
        start_time: classForm.startTime || null,
        end_time: classForm.endTime || null,
        meeting_link: classForm.meetingLink || null,
        is_live: classForm.isLive,
        created_by: user.id,
      };

      let error: { message?: string } | null = null;

      if (editingClassId) {
        const { error: updateError } = await supabase
          .from("class_sessions")
          .update({
            batch_id: batchId,
            title: classForm.title.trim(),
            session_date: classForm.sessionDate,
            start_time: classForm.startTime || null,
            end_time: classForm.endTime || null,
            meeting_link: classForm.meetingLink || null,
            is_live: classForm.isLive,
          })
          .eq("id", editingClassId);

        error = updateError;
        // Backward compatibility if DB has not yet received is_live column migration.
        if (error && /is_live/i.test(error.message ?? "")) {
          const fallback = await supabase
            .from("class_sessions")
            .update({
              batch_id: batchId,
              title: classForm.title.trim(),
              session_date: classForm.sessionDate,
              start_time: classForm.startTime || null,
              end_time: classForm.endTime || null,
              meeting_link: classForm.meetingLink || null,
            })
            .eq("id", editingClassId);
          error = fallback.error;
        }
      } else {
        const insertRes = await supabase.from("class_sessions").insert(payload);
        error = insertRes.error;

        // Backward compatibility if DB has not yet received is_live column migration.
        if (error && /is_live/i.test(error.message ?? "")) {
          const fallback = await supabase.from("class_sessions").insert({
            batch_id: batchId,
            title: classForm.title.trim(),
            session_date: classForm.sessionDate,
            start_time: classForm.startTime || null,
            end_time: classForm.endTime || null,
            meeting_link: classForm.meetingLink || null,
            created_by: user.id,
          });
          error = fallback.error;
        }
      }

      if (error) throw error;
      setClassMsg({
        type: "ok",
        text: editingClassId
          ? "Class session updated!"
          : "Class session created!",
      });
      setShowClassForm(false);
      setEditingClassId(null);
      setClassForm({
        batchId: "",
        title: "",
        sessionDate: "",
        startTime: "",
        endTime: "",
        meetingLink: "",
        isLive: false,
      });
      load();
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to create class.";
      setClassMsg({ type: "err", text: msg });
    } finally {
      setClassSubmitting(false);
    }
  }

  function startEditClass(session: ClassSession) {
    setEditingClassId(session.id);
    setShowClassForm(true);
    setClassMsg(null);
    setClassForm({
      batchId: String(session.batch_id),
      title: session.title,
      sessionDate: session.session_date,
      startTime: session.start_time ?? "",
      endTime: session.end_time ?? "",
      meetingLink: session.meeting_link ?? "",
      isLive: session.is_live,
    });
  }

  async function deleteClass(session: ClassSession) {
    if (!confirm(`Delete class session \"${session.title}\"?`)) return;
    const supabase = createClient();
    setClassMsg(null);
    try {
      const { error: deleteError } = await supabase
        .from("class_sessions")
        .delete()
        .eq("id", session.id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        setClassMsg({
          type: "err",
          text:
            deleteError.message ||
            "Failed to delete class session. Please ensure you have permission to delete this session.",
        });
        return;
      }

      if (editingClassId === session.id) {
        setEditingClassId(null);
        setShowClassForm(false);
        setClassForm({
          batchId: "",
          title: "",
          sessionDate: "",
          startTime: "",
          endTime: "",
          meetingLink: "",
          isLive: false,
        });
      }

      setClassMsg({ type: "ok", text: "Class session deleted." });
      load();
    } catch (err) {
      console.error("Delete exception:", err);
      setClassMsg({
        type: "err",
        text: "Failed to delete class session. An unexpected error occurred.",
      });
    }
  }

  async function toggleLive(session: ClassSession) {
    if (!session.meeting_link) {
      setClassMsg({
        type: "err",
        text: "No meeting link available. Please add a meeting link to this session.",
      });
      return;
    }
    // Open meeting in new tab
    window.open(session.meeting_link, "_blank");

    // Also update is_live status in database
    const supabase = createClient();
    await supabase
      .from("class_sessions")
      .update({ is_live: !session.is_live })
      .eq("id", session.id);
    load();
  }

  /* â”€â”€ recorded lectures â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function addLecture() {
    const supabase = createClient();
    setLectureSubmitting(true);
    setLectureMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("recorded_lectures").insert({
        batch_id: lectureForm.batchId ? parseInt(lectureForm.batchId) : null,
        faculty_user_id: user.id,
        title: lectureForm.title,
        subject: lectureForm.subject || null,
        description: lectureForm.description || null,
        drive_link: lectureForm.driveLink,
      });
      if (error) throw error;
      setLectureMsg({ type: "ok", text: "Lecture link added!" });
      setShowLectureForm(false);
      setLectureForm({
        batchId: "",
        title: "",
        subject: "",
        description: "",
        driveLink: "",
      });
      load();
    } catch {
      setLectureMsg({ type: "err", text: "Failed to add lecture." });
    } finally {
      setLectureSubmitting(false);
    }
  }

  async function deleteLecture(id: number) {
    if (!confirm("Delete this lecture link?")) return;
    const supabase = createClient();
    await supabase
      .from("recorded_lectures")
      .update({ is_active: false })
      .eq("id", id);
    load();
  }

  /* â”€â”€ tasks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function submitTask() {
    const supabase = createClient();
    setTaskSubmitting(true);
    setTaskMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("faculty_tasks").insert({
        faculty_user_id: user.id,
        batch_id: taskForm.batchId ? parseInt(taskForm.batchId) : null,
        student_user_id: taskForm.studentId || null,
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: taskForm.dueDate || null,
        status: "pending",
      });
      if (error) throw error;
      setTaskMsg({ type: "ok", text: "Task assigned!" });
      setShowTaskForm(false);
      setTaskForm({
        batchId: "",
        studentId: "",
        title: "",
        description: "",
        dueDate: "",
      });
      load();
    } catch {
      setTaskMsg({ type: "err", text: "Failed to assign task." });
    } finally {
      setTaskSubmitting(false);
    }
  }

  async function updateTaskStatus(taskId: number, status: string) {
    const supabase = createClient();
    await supabase.from("faculty_tasks").update({ status }).eq("id", taskId);
    load();
  }

  /* â”€â”€ student progress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function updateProgress(
    studentUserId: string,
    courseId: number,
    newPct: number,
  ) {
    const supabase = createClient();
    const key = `${studentUserId}_${courseId}`;
    setProgressUpdating(key);
    const { error } = await supabase.from("student_course_progress").upsert(
      {
        student_user_id: studentUserId,
        course_id: courseId,
        progress_percent: newPct,
      },
      { onConflict: "student_user_id,course_id" },
    );
    if (!error) {
      setStudentProgress((prev) =>
        prev.map((p) =>
          p.student_user_id === studentUserId && p.course_id === courseId
            ? { ...p, progress_percent: newPct }
            : p,
        ),
      );
      setProgressMsg({ type: "ok", text: "Progress updated!" });
    } else {
      setProgressMsg({ type: "err", text: "Update failed." });
    }
    setProgressUpdating(null);
    setTimeout(() => setProgressMsg(null), 2500);
  }

  async function saveExamScore(
    mockTestId: number,
    studentUserId: string,
    mcqScore: number | null,
    descriptiveScore: number | null,
  ) {
    const supabase = createClient();
    const key = `${mockTestId}_${studentUserId}`;
    setExamScoreSaving(key);
    const { error } = await supabase.from("student_mock_test_scores").upsert(
      {
        mock_test_id: mockTestId,
        student_user_id: studentUserId,
        mcq_score: mcqScore,
        descriptive_score: descriptiveScore,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "mock_test_id,student_user_id" },
    );
    if (!error) {
      setExamScores((prev) => {
        const existing = prev.find(
          (s) =>
            s.mock_test_id === mockTestId &&
            s.student_user_id === studentUserId,
        );
        if (existing) {
          return prev.map((s) =>
            s.mock_test_id === mockTestId && s.student_user_id === studentUserId
              ? {
                  ...s,
                  mcq_score: mcqScore,
                  descriptive_score: descriptiveScore,
                }
              : s,
          );
        }
        return [
          ...prev,
          {
            mock_test_id: mockTestId,
            student_user_id: studentUserId,
            mcq_score: mcqScore,
            descriptive_score: descriptiveScore,
          },
        ];
      });
      setExamScoreMsg({ type: "ok", text: "Scores saved!" });
    } else {
      setExamScoreMsg({ type: "err", text: "Failed to save scores." });
    }
    setExamScoreSaving(null);
    setTimeout(() => setExamScoreMsg(null), 2500);
  }

  function exportProgressSectionWise() {
    if (studentProgress.length === 0) {
      setProgressMsg({ type: "err", text: "No progress data to export." });
      return;
    }
    const studentBatchMap: Record<string, string> = {};
    batchStudents.forEach((s) => {
      studentBatchMap[s.student_user_id] = s.batch_name;
    });

    const rows = studentProgress.map((p) => [
      p.full_name,
      studentBatchMap[p.student_user_id] ?? "-",
      p.course_title,
      p.progress_percent,
    ]);
    downloadCsv(
      "student_progress_section_wise.csv",
      ["Student", "Batch", "Course", "Progress (%)"],
      rows,
    );
    setProgressMsg({ type: "ok", text: "Section-wise progress exported." });
    setTimeout(() => setProgressMsg(null), 2500);
  }

  function exportProgressConsolidated() {
    if (studentProgress.length === 0) {
      setProgressMsg({ type: "err", text: "No progress data to export." });
      return;
    }
    const studentBatchMap: Record<string, string> = {};
    batchStudents.forEach((s) => {
      studentBatchMap[s.student_user_id] = s.batch_name;
    });

    const grouped = new Map<
      string,
      { name: string; batch: string; total: number; count: number }
    >();

    studentProgress.forEach((p) => {
      const prev = grouped.get(p.student_user_id);
      if (!prev) {
        grouped.set(p.student_user_id, {
          name: p.full_name,
          batch: studentBatchMap[p.student_user_id] ?? "-",
          total: p.progress_percent,
          count: 1,
        });
      } else {
        prev.total += p.progress_percent;
        prev.count += 1;
      }
    });

    const rows = Array.from(grouped.values()).map((g) => [
      g.name,
      g.batch,
      g.count,
      Math.round(g.total / g.count),
    ]);

    downloadCsv(
      "student_progress_consolidated.csv",
      ["Student", "Batch", "Courses", "Average Progress (%)"],
      rows,
    );
    setProgressMsg({ type: "ok", text: "Consolidated progress exported." });
    setTimeout(() => setProgressMsg(null), 2500);
  }

  /* â”€â”€ loading / error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     RENDER
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-14 w-14 flex-shrink-0">
              <Image
                src="/LePearl_Logo_Canva_1.png"
                alt="LePearl logo"
                fill
                quality={100}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-base font-bold text-emerald-700 sm:text-lg leading-tight">
                LePearl Education
              </p>
              <p className="text-[10px] leading-tight text-slate-600 sm:text-xs">
                Faculty Dashboard
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* sidebar */}
          <aside className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
              <div className="w-14 h-14 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xl">
                {profile?.full_name?.charAt(0) ?? "F"}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {profile?.full_name ?? "Faculty"}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  {batches.length} batch{batches.length !== 1 ? "es" : ""} |{" "}
                  {totalStudents} students
                </p>
              </div>
            </div>
            <nav className="mt-4 space-y-1.5">
              <NavBtn
                section="dashboard"
                active={activeSection}
                onClick={setActiveSection}
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <NavBtn
                section="attendance"
                active={activeSection}
                onClick={setActiveSection}
                icon={Calendar}
                label="Attendance"
              />
              <NavBtn
                section="mcq"
                active={activeSection}
                onClick={setActiveSection}
                icon={FileQuestion}
                label="Mock Tests"
              />
              <NavBtn
                section="evaluations"
                active={activeSection}
                onClick={setActiveSection}
                icon={CheckCircle}
                label="Evaluations"
              />
              <NavBtn
                section="classes"
                active={activeSection}
                onClick={setActiveSection}
                icon={Video}
                label="Live Classes"
              />
              <NavBtn
                section="lectures"
                active={activeSection}
                onClick={setActiveSection}
                icon={PlayCircle}
                label="Recorded Lectures"
              />
              <NavBtn
                section="tasks"
                active={activeSection}
                onClick={setActiveSection}
                icon={ClipboardList}
                label="Tasks"
              />
              <NavBtn
                section="students"
                active={activeSection}
                onClick={setActiveSection}
                icon={Users}
                label="Student Progress"
              />
            </nav>
          </aside>

          {/* content */}
          <section className="space-y-6 min-w-0">
            {/* â•â• DASHBOARD OVERVIEW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "dashboard" && (
              <>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                  <h1 className="text-2xl font-bold mb-0.5">
                    Welcome, {profile?.full_name?.split(" ")[0] ?? "Faculty"}!
                  </h1>
                  <p className="text-emerald-200 text-sm">
                    Manage your batches, students, and content from here
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatCard
                    label="My Batches"
                    value={batches.length}
                    icon={BookOpen}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                  />
                  <StatCard
                    label="Total Students"
                    value={totalStudents}
                    icon={Users}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                  />
                  <StatCard
                    label="Upcoming Classes"
                    value={dashboardUpcomingClasses.length}
                    icon={Video}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                  />
                  <StatCard
                    label="Live Classes"
                    value={upcomingLiveClassesCount}
                    icon={Zap}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                  />
                  <StatCard
                    label="Active Tasks"
                    value={activeTasksCount}
                    icon={ClipboardList}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                  />
                </div>

                {/* batches */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    My Batches
                  </h2>
                  {batches.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No batches assigned.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {batches.map((b) => {
                        const course = unwrapOne(
                          b.courses as
                            | { id: number; title: string }
                            | { id: number; title: string }[]
                            | null,
                        );
                        const cnt =
                          (b.enrollments as unknown as { count: number }[])?.[0]
                            ?.count ?? 0;
                        return (
                          <div
                            key={b.id}
                            className="bg-emerald-50 rounded-xl p-4 border border-emerald-100"
                          >
                            <p className="font-bold text-emerald-800">
                              {b.batch_name}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {course?.title ?? "-"}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500">
                                <Users className="w-3.5 h-3.5 inline mr-1" />
                                {cnt} enrolled
                              </span>
                              <span className="text-xs text-gray-400">
                                {fmtDate(b.start_date)} - {fmtDate(b.end_date)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* upcoming classes */}
                {dashboardUpcomingClasses.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="text-base font-bold text-gray-900 mb-3">
                      Upcoming Classes
                    </h2>
                    <div className="space-y-2">
                      {dashboardUpcomingClasses.map((s) => {
                        const batch = unwrapOne(s.batches);
                        return (
                          <div
                            key={s.id}
                            className={`flex items-center justify-between p-3 rounded-xl border ${s.is_live ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                  {s.title}
                                </p>
                                {s.is_live && (
                                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {fmtDate(s.session_date)} |{" "}
                                {fmtTime(s.start_time)} | {batch?.batch_name}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleLive(s)}
                              className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${s.is_live ? "bg-gray-200 text-gray-700" : "bg-red-600 text-white"}`}
                            >
                              {s.is_live ? "End Live" : "Go Live"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* â•â• ATTENDANCE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "attendance" && (
              <>
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h1 className="text-xl font-bold mb-1">
                        Attendance Management
                      </h1>
                      <p className="text-green-100 text-sm">
                        Select a session to mark or modify student attendance
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={exportAttendanceSectionWise}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30"
                      >
                        <FileDown className="w-4 h-4" />
                        Export Section Wise
                      </button>
                      <button
                        onClick={exportAttendanceConsolidated}
                        disabled={attendanceExporting}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 disabled:opacity-60"
                      >
                        {attendanceExporting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileDown className="w-4 h-4" />
                        )}
                        Export Consolidated
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* session list */}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-3">
                      Select Session
                    </h2>
                    {attendanceSessions.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No completed class sessions found.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {attendanceSessions.map((s) => {
                          const batch = unwrapOne(s.batches);
                          return (
                            <button
                              key={s.id}
                              onClick={() => selectSession(s)}
                              className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedSession?.id === s.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"}`}
                            >
                              <p className="text-sm font-semibold text-gray-900">
                                {normalizeAttendanceTitle(s.title)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {fmtDate(s.session_date)} |{" "}
                                {fmtTime(s.start_time)} | {batch?.batch_name}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* attendance marking */}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    {!selectedSession ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Select a session to mark attendance
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="font-bold text-gray-900">
                              {normalizeAttendanceTitle(selectedSession.title)}
                            </h2>
                            <p className="text-xs text-gray-500">
                              {fmtDate(selectedSession.session_date)}
                            </p>
                          </div>
                          <button
                            onClick={saveAttendance}
                            disabled={attendanceSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl disabled:opacity-60"
                          >
                            {attendanceSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Save
                          </button>
                        </div>
                        {attendanceMsg && (
                          <div
                            className={`text-sm p-2 rounded-xl mb-3 ${attendanceMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                          >
                            {attendanceMsg.text}
                          </div>
                        )}
                        {sessionStudents.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No students found in this batch.
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto">
                            {sessionStudents.map((s) => (
                              <div
                                key={s.student_user_id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                              >
                                <span className="text-sm font-medium text-gray-900">
                                  {s.full_name}
                                </span>
                                <div className="flex gap-1">
                                  {(["present", "absent"] as const).map(
                                    (st) => (
                                      <button
                                        key={st}
                                        onClick={() =>
                                          setAttendanceMap((prev) => ({
                                            ...prev,
                                            [s.student_user_id]: st,
                                          }))
                                        }
                                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                                          attendanceMap[s.student_user_id] ===
                                          st
                                            ? st === "present"
                                              ? "bg-green-600 text-white"
                                              : "bg-red-500 text-white"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                      >
                                        {st}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* â•â• MCQ TESTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "mcq" && (
              <>
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    Mock Test Management
                  </h1>
                  <p className="text-purple-100 text-sm">
                    Create MCQ or Descriptive tests, add questions, publish to
                    students, and manage results
                  </p>
                </div>

                {mcqMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${mcqMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {mcqMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {mcqMsg.text}
                  </div>
                )}

                {/* create test form */}
                {showMcqForm ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">
                        {editingTestId
                          ? "Edit Test Details"
                          : "Create New Test"}
                      </h2>
                      <button
                        onClick={resetMcqForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Test Title
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                          value={mcqForm.title}
                          onChange={(e) =>
                            setMcqForm((p) => ({ ...p, title: e.target.value }))
                          }
                          placeholder="e.g., UGC NET Paper 1 Mock Test 1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Test Type
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                          value={mcqForm.testType}
                          onChange={(e) =>
                            setMcqForm((p) => ({
                              ...p,
                              testType: e.target.value,
                            }))
                          }
                        >
                          <option value="mcq">MCQ Test</option>
                          <option value="descriptive">Descriptive Test</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Batch
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                          value={mcqForm.batchId}
                          onChange={(e) =>
                            setMcqForm((p) => ({
                              ...p,
                              batchId: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select batch</option>
                          {batches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.batch_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Exam Type
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                          value={mcqForm.examType}
                          onChange={(e) =>
                            setMcqForm((p) => ({
                              ...p,
                              examType: e.target.value,
                            }))
                          }
                        >
                          <option value="mock">Mock Test</option>
                          <option value="original">Original Test</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={mcqForm.totalMarks}
                          onChange={(e) =>
                            setMcqForm((p) => ({
                              ...p,
                              totalMarks: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Time Limit (minutes)
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={mcqForm.timeLimitMinutes}
                          onChange={(e) =>
                            setMcqForm((p) => ({
                              ...p,
                              timeLimitMinutes: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Scheduled Date (optional)
                        </label>
                        <input
                          type="datetime-local"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={mcqForm.scheduledAt}
                          onChange={(e) =>
                            setMcqForm((p) => ({
                              ...p,
                              scheduledAt: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={createMcqTest}
                      disabled={
                        mcqSubmitting || !mcqForm.title || !mcqForm.batchId
                      }
                      className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
                    >
                      {mcqSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Edit3 className="w-4 h-4" />
                      )}
                      {editingTestId ? "Save Changes" : "Create Test"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMcqForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" /> Create New Test
                  </button>
                )}

                {/* test list / question editor */}
                {selectedTest ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-gray-900">
                            {selectedTest.title}
                          </h2>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selectedTest.test_type === "mcq" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {selectedTest.test_type === "mcq"
                              ? "MCQ"
                              : "Descriptive"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {testQuestions.length} questions |{" "}
                          {selectedTest.total_marks} marks |{" "}
                          {selectedTest.time_limit_minutes} min
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedTest(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {/* add question */}
                    {showQForm ? (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-4 space-y-3">
                        <h3 className="text-sm font-bold text-gray-900">
                          Add{" "}
                          {selectedTest?.test_type === "mcq"
                            ? "MCQ"
                            : "Descriptive"}{" "}
                          Question
                        </h3>

                        {/* MCQ QUESTION FORM */}
                        {selectedTest?.test_type === "mcq" ? (
                          <>
                            <textarea
                              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-purple-400 focus:outline-none"
                              rows={2}
                              placeholder="Question text"
                              value={qForm.questionText}
                              onChange={(e) =>
                                setQForm((p) => ({
                                  ...p,
                                  questionText: e.target.value,
                                }))
                              }
                            />
                            <div className="grid grid-cols-2 gap-2">
                              {(["A", "B", "C", "D"] as const).map((opt) => (
                                <input
                                  key={opt}
                                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                  placeholder={`Option ${opt}`}
                                  value={
                                    qForm[
                                      `option${opt}` as
                                        | "optionA"
                                        | "optionB"
                                        | "optionC"
                                        | "optionD"
                                    ]
                                  }
                                  onChange={(e) =>
                                    setQForm((p) => ({
                                      ...p,
                                      [`option${opt}`]: e.target.value,
                                    }))
                                  }
                                />
                              ))}
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                  Correct Answer
                                </label>
                                <select
                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                  value={qForm.correctOption}
                                  onChange={(e) =>
                                    setQForm((p) => ({
                                      ...p,
                                      correctOption: e.target.value,
                                    }))
                                  }
                                >
                                  {["A", "B", "C", "D"].map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                  Marks
                                </label>
                                <input
                                  type="number"
                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                  value={qForm.marks}
                                  onChange={(e) =>
                                    setQForm((p) => ({
                                      ...p,
                                      marks: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* DESCRIPTIVE QUESTION FORM */}
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                              placeholder="Enter a single-sentence question"
                              value={descriptiveQForm.questionText}
                              onChange={(e) =>
                                setDescriptiveQForm((p) => ({
                                  ...p,
                                  questionText: e.target.value,
                                }))
                              }
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                  Marks
                                </label>
                                <input
                                  type="number"
                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                  value={descriptiveQForm.marks}
                                  onChange={(e) =>
                                    setDescriptiveQForm((p) => ({
                                      ...p,
                                      marks: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                  Category (Optional)
                                </label>
                                <input
                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                  placeholder="e.g., History, Essay"
                                  value={descriptiveQForm.category}
                                  onChange={(e) =>
                                    setDescriptiveQForm((p) => ({
                                      ...p,
                                      category: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={addQuestion}
                            disabled={
                              mcqSubmitting ||
                              !(
                                (selectedTest?.test_type === "mcq" &&
                                  qForm.questionText) ||
                                (selectedTest?.test_type !== "mcq" &&
                                  descriptiveQForm.questionText)
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60"
                          >
                            {mcqSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                            Add
                          </button>
                          <button
                            onClick={() => setShowQForm(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowQForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold mb-4 hover:bg-purple-200"
                      >
                        <Plus className="w-4 h-4" /> Add Question
                      </button>
                    )}
                    {/* questions list */}
                    <div className="space-y-3">
                      {testQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-semibold text-gray-900">
                              <span className="text-purple-600 mr-2">
                                Q{idx + 1}.
                              </span>
                              {q.question_text}
                            </p>
                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {selectedTest?.test_type === "mcq" && (
                            <div className="grid grid-cols-2 gap-1 mt-2">
                              {(["A", "B", "C", "D"] as const).map((opt) => (
                                <p
                                  key={opt}
                                  className={`text-xs px-2 py-1 rounded-lg ${q.correct_option === opt ? "bg-green-100 text-green-700 font-semibold" : "text-gray-500"}`}
                                >
                                  {opt}.{" "}
                                  {
                                    q[
                                      `option_${opt.toLowerCase()}` as
                                        | "option_a"
                                        | "option_b"
                                        | "option_c"
                                        | "option_d"
                                    ]
                                  }
                                </p>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {q.marks} mark{q.marks > 1 ? "s" : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => togglePublish(selectedTest)}
                      className={`mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold ${selectedTest.is_published ? "bg-gray-200 text-gray-700" : "bg-green-600 text-white hover:bg-green-700"}`}
                    >
                      {selectedTest.is_published
                        ? "Unpublish Test"
                        : "Publish to Students"}
                    </button>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => startEditingTest(selectedTest)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        Edit Test Details
                      </button>
                      <button
                        onClick={() => deleteTest(selectedTest)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete Test
                      </button>
                    </div>
                  </div>
                ) : (
                  /* test list */
                  mcqTests.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                      <h2 className="font-bold text-gray-900 mb-3">My Tests</h2>
                      <div className="space-y-3">
                        {mcqTests.map((t) => {
                          const qCount =
                            (
                              t.mcq_questions as unknown as { count: number }[]
                            )?.[0]?.count ?? 0;
                          return (
                            <div
                              key={t.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {t.title}
                                  </p>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                                  >
                                    {t.is_published ? "Published" : "Draft"}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {qCount} questions | {t.total_marks} marks |{" "}
                                  {t.time_limit_minutes} min | {t.exam_type}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => loadQuestions(t)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-200"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Questions
                                </button>
                                <button
                                  onClick={() => startEditingTest(t)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-200"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Details
                                </button>
                                <button
                                  onClick={() => togglePublish(t)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${t.is_published ? "bg-gray-200 text-gray-600" : "bg-green-100 text-green-700"}`}
                                >
                                  {t.is_published ? "Unpublish" : "Publish"}
                                </button>
                                <button
                                  onClick={() => deleteTest(t)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </>
            )}

            {/* Evaluations - Descriptive Test Grading */}
            {activeSection === "evaluations" && (
              <>
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    Descriptive Test Evaluations
                  </h1>
                  <p className="text-amber-100 text-sm">
                    Review student submissions and provide marks &amp; feedback
                  </p>
                </div>

                {evaluationMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${evaluationMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {evaluationMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {evaluationMsg.text}
                  </div>
                )}

                {!selectedEvalTest ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    {descriptiveTests.length === 0 ? (
                      <div className="text-center py-12">
                        <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No descriptive tests available to evaluate
                        </p>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-bold text-gray-900 mb-4">
                          Select a Test
                        </h2>
                        <div className="space-y-3">
                          {descriptiveTests.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setSelectedEvalTest(t);
                                loadDescriptiveQuestions(t);
                              }}
                              className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {t.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {t.batches?.batch_name} | {t.total_marks}{" "}
                                    marks
                                  </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : !selectedSubmission ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-bold text-gray-900">
                          {selectedEvalTest.title}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedEvalTest.batches?.batch_name}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEvalTest(null);
                          setStudentSubmissions([]);
                          setDescriptiveQuestions([]);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {studentSubmissions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">
                          No submissions yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {studentSubmissions.map((s) => {
                          const question = descriptiveQuestions.find(
                            (q) => q.id === s.question_id,
                          );
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                setSelectedSubmission(s);
                                setEvaluationForm({
                                  marksObtained:
                                    s.marks_obtained?.toString() || "",
                                  facultyNotes: s.faculty_notes || "",
                                });
                              }}
                              className={`w-full text-left p-4 border rounded-xl transition-colors ${
                                s.marks_obtained !== null
                                  ? "bg-green-50 border-green-200"
                                  : "bg-yellow-50 border-yellow-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {s.student_name || "Unknown Student"}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Q{question?.question_order}:{" "}
                                    {question?.question_text}
                                  </p>
                                  {s.submitted_at && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Submitted:{" "}
                                      {new Date(
                                        s.submitted_at,
                                      ).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  {s.marks_obtained !== null ? (
                                    <div>
                                      <p className="text-lg font-bold text-green-600">
                                        {s.marks_obtained}/{question?.marks}
                                      </p>
                                      <p className="text-xs text-green-600">
                                        Evaluated
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-amber-600 font-medium">
                                      Pending
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">
                        Grade: {selectedSubmission.student_name || "Student"}{" "}
                        &mdash; Q
                        {
                          descriptiveQuestions.find(
                            (q) => q.id === selectedSubmission.question_id,
                          )?.question_order
                        }
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setEvaluationForm({
                            marksObtained: "",
                            facultyNotes: "",
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Question
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        {
                          descriptiveQuestions.find(
                            (q) => q.id === selectedSubmission.question_id,
                          )?.question_text
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        Max Marks:{" "}
                        {
                          descriptiveQuestions.find(
                            (q) => q.id === selectedSubmission.question_id,
                          )?.marks
                        }
                      </p>
                    </div>

                    {selectedSubmission.answer_file_url && (
                      <div className="border border-blue-200 rounded-xl p-4 mb-4 bg-blue-50">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Student Submission
                        </p>
                        <a
                          href={selectedSubmission.answer_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" /> View Submission
                          File
                        </a>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={
                            descriptiveQuestions.find(
                              (q) => q.id === selectedSubmission.question_id,
                            )?.marks || 100
                          }
                          value={evaluationForm.marksObtained}
                          onChange={(e) =>
                            setEvaluationForm((p) => ({
                              ...p,
                              marksObtained: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          placeholder="Enter marks"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Faculty Feedback
                        </label>
                        <textarea
                          value={evaluationForm.facultyNotes}
                          onChange={(e) =>
                            setEvaluationForm((p) => ({
                              ...p,
                              facultyNotes: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none h-24 resize-none"
                          placeholder="Provide feedback for the student..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!evaluationForm.marksObtained) {
                              setEvaluationMsg({
                                type: "err",
                                text: "Please enter marks",
                              });
                              return;
                            }
                            setEvaluationUpdating(true);
                            setEvaluationMsg(null);
                            try {
                              const supabase = createClient();
                              const { error } = await supabase
                                .from("descriptive_student_answers")
                                .update({
                                  marks_obtained: parseInt(
                                    evaluationForm.marksObtained,
                                  ),
                                  faculty_notes: evaluationForm.facultyNotes,
                                  evaluated_at: new Date().toISOString(),
                                })
                                .eq("id", selectedSubmission.id);
                              if (error) throw error;
                              setEvaluationMsg({
                                type: "ok",
                                text: "Evaluation saved!",
                              });
                              setTimeout(() => {
                                setSelectedSubmission(null);
                                setEvaluationForm({
                                  marksObtained: "",
                                  facultyNotes: "",
                                });
                                setEvaluationMsg(null);
                                if (selectedEvalTest)
                                  loadSubmissions(selectedEvalTest.id);
                              }, 1000);
                            } catch (err: any) {
                              setEvaluationMsg({
                                type: "err",
                                text:
                                  err.message || "Failed to save evaluation",
                              });
                            } finally {
                              setEvaluationUpdating(false);
                            }
                          }}
                          disabled={evaluationUpdating}
                          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                        >
                          {evaluationUpdating ? "Saving..." : "Save Evaluation"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubmission(null);
                            setEvaluationForm({
                              marksObtained: "",
                              facultyNotes: "",
                            });
                          }}
                          className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* â•â• LIVE CLASSES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "classes" && (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    Live Class Management
                  </h1>
                  <p className="text-blue-100 text-sm">
                    Schedule classes with Google Meet or Zoom links and go live
                  </p>
                </div>

                {classMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${classMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {classMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {classMsg.text}
                  </div>
                )}

                {showClassForm ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">
                        {editingClassId
                          ? "Edit Class Session"
                          : "Schedule New Class"}
                      </h2>
                      <button
                        onClick={() => {
                          setShowClassForm(false);
                          setEditingClassId(null);
                          setClassForm({
                            batchId: "",
                            title: "",
                            sessionDate: "",
                            startTime: "",
                            endTime: "",
                            meetingLink: "",
                            isLive: false,
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Class Title
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={classForm.title}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g., Paper 1 - Teaching Aptitude"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Batch
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={classForm.batchId}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              batchId: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select batch</option>
                          {batches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.batch_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={classForm.sessionDate}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              sessionDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={classForm.startTime}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              startTime: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          End Time
                        </label>
                        <input
                          type="time"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={classForm.endTime}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              endTime: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Google Meet / Zoom Link
                        </label>
                        <input
                          type="url"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={classForm.meetingLink}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              meetingLink: e.target.value,
                            }))
                          }
                          placeholder="https://meet.google.com/... or zoom.us/j/..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isLive"
                          checked={classForm.isLive}
                          onChange={(e) =>
                            setClassForm((p) => ({
                              ...p,
                              isLive: e.target.checked,
                            }))
                          }
                          className="accent-blue-600"
                        />
                        <label
                          htmlFor="isLive"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Start as Live now
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={createClass}
                      disabled={
                        classSubmitting ||
                        !classForm.title ||
                        !classForm.batchId ||
                        !classForm.sessionDate
                      }
                      className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
                    >
                      {classSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {editingClassId ? "Update Class" : "Create Class"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClassForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" /> Schedule New Class
                  </button>
                )}

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-3">My Classes</h2>
                  {upcomingClasses.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No classes scheduled.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingClasses.map((s) => {
                        const batch = unwrapOne(s.batches);
                        return (
                          <div
                            key={s.id}
                            className={`rounded-xl p-4 border flex items-center justify-between gap-3 ${s.is_live ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 text-sm">
                                  {s.title}
                                </p>
                                {s.is_live && (
                                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {fmtDate(s.session_date)} |{" "}
                                {fmtTime(s.start_time)} | {batch?.batch_name}
                              </p>
                              {s.meeting_link && (
                                <a
                                  href={s.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open meeting anytime - before, during, or after scheduled time"
                                  className="text-xs text-blue-600 flex items-center gap-1 mt-2 hover:underline font-medium"
                                >
                                  <ExternalLink className="w-3 h-3" /> Open
                                  Meeting Link
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                              <button
                                onClick={() => toggleLive(s)}
                                title={
                                  s.is_live
                                    ? "End live session"
                                    : "Start live session (works anytime, before or after scheduled time)"
                                }
                                className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex-shrink-0 ${s.is_live ? "bg-gray-200 text-gray-700" : "bg-red-600 text-white"}`}
                              >
                                {s.is_live ? "End Live" : "Go Live"}
                              </button>
                              <button
                                onClick={() => startEditClass(s)}
                                className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-blue-100 text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteClass(s)}
                                className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-red-100 text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* â•â• RECORDED LECTURES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "lectures" && (
              <>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">Recorded Lectures</h1>
                  <p className="text-indigo-100 text-sm">
                    Add Google Drive links for students to access recorded
                    classes
                  </p>
                </div>

                {lectureMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${lectureMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {lectureMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {lectureMsg.text}
                  </div>
                )}

                {showLectureForm ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">
                        Add Recorded Lecture
                      </h2>
                      <button
                        onClick={() => setShowLectureForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Lecture Title
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={lectureForm.title}
                          onChange={(e) =>
                            setLectureForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g., Research Methodology - Session 3"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Batch (optional)
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                            value={lectureForm.batchId}
                            onChange={(e) =>
                              setLectureForm((p) => ({
                                ...p,
                                batchId: e.target.value,
                              }))
                            }
                          >
                            <option value="">All my students</option>
                            {batches.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.batch_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Subject / Topic
                          </label>
                          <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                            value={lectureForm.subject}
                            onChange={(e) =>
                              setLectureForm((p) => ({
                                ...p,
                                subject: e.target.value,
                              }))
                            }
                            placeholder="e.g., Research Methodology"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Google Drive Link
                        </label>
                        <input
                          type="url"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={lectureForm.driveLink}
                          onChange={(e) =>
                            setLectureForm((p) => ({
                              ...p,
                              driveLink: e.target.value,
                            }))
                          }
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Description (optional)
                        </label>
                        <textarea
                          rows={2}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm resize-none"
                          value={lectureForm.description}
                          onChange={(e) =>
                            setLectureForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Brief notes about this lecture..."
                        />
                      </div>
                    </div>
                    <button
                      onClick={addLecture}
                      disabled={
                        lectureSubmitting ||
                        !lectureForm.title ||
                        !lectureForm.driveLink
                      }
                      className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
                    >
                      {lectureSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Add Lecture
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLectureForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" /> Add Recorded Lecture
                  </button>
                )}

                {lectures.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No recorded lectures added yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {lectures.map((lec) => {
                      const batch = unwrapOne(lec.batches);
                      return (
                        <div
                          key={lec.id}
                          className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <PlayCircle className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm">
                                {lec.title}
                              </h3>
                              {lec.subject && (
                                <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                                  {lec.subject}
                                </p>
                              )}
                              <p className="text-xs text-gray-400">
                                {batch?.batch_name ?? "All batches"} |{" "}
                                {fmtDate(lec.created_at)}
                              </p>
                              {lec.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {lec.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <a
                              href={lec.drive_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-200"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Open
                              Drive
                            </a>
                            <button
                              onClick={() => deleteLecture(lec.id)}
                              className="px-3 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* â•â• TASKS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "tasks" && (
              <>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">Task Management</h1>
                  <p className="text-amber-100 text-sm">
                    Assign and track tasks for your students
                  </p>
                </div>

                {taskMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${taskMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {taskMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {taskMsg.text}
                  </div>
                )}

                {showTaskForm ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-amber-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">Assign Task</h2>
                      <button
                        onClick={() => setShowTaskForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Batch (leave blank for individual)
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                            value={taskForm.batchId}
                            onChange={(e) =>
                              setTaskForm((p) => ({
                                ...p,
                                batchId: e.target.value,
                                studentId: "",
                              }))
                            }
                          >
                            <option value="">- Select batch -</option>
                            {batches.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.batch_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Specific Student (optional)
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                            value={taskForm.studentId}
                            onChange={(e) =>
                              setTaskForm((p) => ({
                                ...p,
                                studentId: e.target.value,
                              }))
                            }
                          >
                            <option value="">- Entire batch -</option>
                            {(taskForm.batchId
                              ? batchStudents.filter(
                                  (s) =>
                                    s.batch_id === parseInt(taskForm.batchId),
                                )
                              : batchStudents
                            ).map((s) => (
                              <option
                                key={s.student_user_id}
                                value={s.student_user_id}
                              >
                                {s.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Task Title
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={taskForm.title}
                          onChange={(e) =>
                            setTaskForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g., Read Chapter 5 and submit analysis"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm resize-none"
                          value={taskForm.description}
                          onChange={(e) =>
                            setTaskForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Due Date
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={taskForm.dueDate}
                          onChange={(e) =>
                            setTaskForm((p) => ({
                              ...p,
                              dueDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={submitTask}
                      disabled={taskSubmitting || !taskForm.title}
                      className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
                    >
                      {taskSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Assign Task
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600"
                  >
                    <Plus className="w-4 h-4" /> Assign New Task
                  </button>
                )}

                {tasks.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-3">All Tasks</h2>
                    <div className="space-y-3">
                      {tasks.map((t) => {
                        const batch = unwrapOne(t.batches);
                        const student = unwrapOne(t.profiles);
                        return (
                          <div
                            key={t.id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {batch && (
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                                      {batch.batch_name}
                                    </span>
                                  )}
                                  {student && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                      {student.full_name}
                                    </span>
                                  )}
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[t.status] ?? "bg-gray-100 text-gray-600"}`}
                                  >
                                    {t.status}
                                  </span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm mt-1">
                                  {t.title}
                                </p>
                                {t.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {t.description}
                                  </p>
                                )}
                                {t.due_date && (
                                  <p className="text-xs text-orange-600 mt-1 font-semibold">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Due: {fmtDate(t.due_date)}
                                  </p>
                                )}
                              </div>
                              {t.status !== "completed" && (
                                <button
                                  onClick={() =>
                                    updateTaskStatus(
                                      t.id,
                                      NEXT_STATUS[t.status] ?? "completed",
                                    )
                                  }
                                  className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-200 flex-shrink-0 capitalize"
                                >
                                  Mark {NEXT_STATUS[t.status]}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* â•â• STUDENT PROGRESS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeSection === "students" && (
              <>
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h1 className="text-xl font-bold mb-1">
                        Student Progress Control
                      </h1>
                      <p className="text-teal-100 text-sm">
                        Update and monitor course progress for all your students
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={exportProgressSectionWise}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30"
                      >
                        <FileDown className="w-4 h-4" />
                        Export Section Wise
                      </button>
                      <button
                        onClick={exportProgressConsolidated}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30"
                      >
                        <FileDown className="w-4 h-4" />
                        Export Consolidated
                      </button>
                    </div>
                  </div>
                </div>

                {progressMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${progressMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {progressMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {progressMsg.text}
                  </div>
                )}

                {examScoreMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${examScoreMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {examScoreMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {examScoreMsg.text}
                  </div>
                )}

                {batchStudents.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No students enrolled in your batches.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-4">
                      Student Progress & Exam Scores
                    </h2>
                    <div className="space-y-4">
                      {batchStudents.map((student) => {
                        const progRows = studentProgress.filter(
                          (p) => p.student_user_id === student.student_user_id,
                        );
                        const completedTestIds =
                          completedTestIdsByStudent[student.student_user_id] ??
                          [];
                        const studentTests = mcqTests.filter((t) =>
                          completedTestIds.includes(t.id),
                        );

                        return (
                          <div
                            key={student.student_user_id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                {student.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {student.full_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {student.batch_name}
                                </p>
                              </div>
                            </div>

                            {progRows.length === 0 &&
                            student.course_id != null ? (
                              // No record yet — show a 0% slider so faculty can set initial progress
                              (() => {
                                const key = `${student.student_user_id}_${student.course_id}`;
                                const localPct =
                                  studentProgress.find(
                                    (sp) =>
                                      sp.student_user_id ===
                                        student.student_user_id &&
                                      sp.course_id === student.course_id,
                                  )?.progress_percent ?? 0;
                                return (
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                                          Course Completion Progress
                                        </p>
                                        <p className="text-xs font-semibold text-gray-700">
                                          {student.course_title}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-emerald-600">
                                          {localPct}%
                                        </span>
                                        {progressUpdating === key && (
                                          <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={localPct}
                                        onChange={(e) =>
                                          setStudentProgress((prev) => {
                                            const exists = prev.find(
                                              (sp) =>
                                                sp.student_user_id ===
                                                  student.student_user_id &&
                                                sp.course_id ===
                                                  student.course_id,
                                            );
                                            if (exists) {
                                              return prev.map((sp) =>
                                                sp.student_user_id ===
                                                  student.student_user_id &&
                                                sp.course_id ===
                                                  student.course_id
                                                  ? {
                                                      ...sp,
                                                      progress_percent:
                                                        parseInt(
                                                          e.target.value,
                                                          10,
                                                        ),
                                                    }
                                                  : sp,
                                              );
                                            }
                                            return [
                                              ...prev,
                                              {
                                                student_user_id:
                                                  student.student_user_id,
                                                course_id: student.course_id!,
                                                progress_percent: parseInt(
                                                  e.target.value,
                                                  10,
                                                ),
                                                full_name: student.full_name,
                                                course_title:
                                                  student.course_title,
                                              },
                                            ];
                                          })
                                        }
                                        onMouseUp={(e) =>
                                          updateProgress(
                                            student.student_user_id,
                                            student.course_id!,
                                            parseInt(
                                              (e.target as HTMLInputElement)
                                                .value,
                                              10,
                                            ),
                                          )
                                        }
                                        className="flex-1 accent-emerald-600"
                                      />
                                      <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    </div>
                                  </div>
                                );
                              })()
                            ) : progRows.length === 0 ? (
                              <p className="text-xs text-gray-400">
                                No progress records yet.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {progRows.map((p) => {
                                  const key = `${p.student_user_id}_${p.course_id}`;
                                  return (
                                    <div key={key}>
                                      <div className="flex items-center justify-between mb-1">
                                        <div>
                                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                                            Course Completion Progress
                                          </p>
                                          <p className="text-xs font-semibold text-gray-700">
                                            {p.course_title}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-emerald-600">
                                            {p.progress_percent}%
                                          </span>
                                          {progressUpdating === key && (
                                            <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="range"
                                          min={0}
                                          max={100}
                                          value={p.progress_percent}
                                          onChange={(e) =>
                                            setStudentProgress((prev) =>
                                              prev.map((sp) =>
                                                sp.student_user_id ===
                                                  p.student_user_id &&
                                                sp.course_id === p.course_id
                                                  ? {
                                                      ...sp,
                                                      progress_percent:
                                                        parseInt(
                                                          e.target.value,
                                                          10,
                                                        ),
                                                    }
                                                  : sp,
                                              ),
                                            )
                                          }
                                          onMouseUp={(e) =>
                                            updateProgress(
                                              p.student_user_id,
                                              p.course_id,
                                              parseInt(
                                                (e.target as HTMLInputElement)
                                                  .value,
                                                10,
                                              ),
                                            )
                                          }
                                          className="flex-1 accent-emerald-600"
                                        />
                                        <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {studentTests.length > 0 && (
                              <div className="mt-4 border-t border-gray-200 pt-3">
                                <p className="text-xs font-bold text-gray-700 mb-2">
                                  Exam Scores
                                </p>
                                <div className="space-y-2">
                                  {studentTests.map((test) => {
                                    const scoreKey = `${test.id}_${student.student_user_id}`;
                                    const input = scoreInputs[scoreKey] ?? {
                                      mcq: "",
                                      desc: "",
                                    };
                                    const isSaving =
                                      examScoreSaving === scoreKey;

                                    return (
                                      <div
                                        key={scoreKey}
                                        className="bg-white border border-gray-200 rounded-lg p-3"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <p className="text-xs font-semibold text-gray-800 truncate max-w-[60%]">
                                            {test.title}
                                          </p>
                                          <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                              test.test_type === "descriptive"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}
                                          >
                                            {test.test_type === "descriptive"
                                              ? "Descriptive"
                                              : "MCQ"}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          {test.test_type !== "descriptive" && (
                                            <div className="flex-1">
                                              <label className="text-[10px] text-gray-500 block mb-0.5">
                                                MCQ Score
                                              </label>
                                              <input
                                                type="number"
                                                min={0}
                                                max={test.total_marks}
                                                placeholder={`/ ${test.total_marks}`}
                                                value={input.mcq}
                                                onChange={(e) =>
                                                  setScoreInputs((prev) => ({
                                                    ...prev,
                                                    [scoreKey]: {
                                                      ...input,
                                                      mcq: e.target.value,
                                                    },
                                                  }))
                                                }
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                              />
                                            </div>
                                          )}

                                          {test.test_type !== "mcq" && (
                                            <div className="flex-1">
                                              <label className="text-[10px] text-gray-500 block mb-0.5">
                                                Descriptive Score
                                              </label>
                                              <input
                                                type="number"
                                                min={0}
                                                max={test.total_marks}
                                                placeholder={`/ ${test.total_marks}`}
                                                value={input.desc}
                                                onChange={(e) =>
                                                  setScoreInputs((prev) => ({
                                                    ...prev,
                                                    [scoreKey]: {
                                                      ...input,
                                                      desc: e.target.value,
                                                    },
                                                  }))
                                                }
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                              />
                                            </div>
                                          )}

                                          <button
                                            onClick={() =>
                                              saveExamScore(
                                                test.id,
                                                student.student_user_id,
                                                input.mcq !== ""
                                                  ? parseFloat(input.mcq)
                                                  : null,
                                                input.desc !== ""
                                                  ? parseFloat(input.desc)
                                                  : null,
                                              )
                                            }
                                            disabled={isSaving}
                                            className="mt-4 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
                                          >
                                            {isSaving ? (
                                              <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                              <CheckCircle className="w-3 h-3" />
                                            )}
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
