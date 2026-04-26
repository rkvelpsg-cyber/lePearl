"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  LogOut,
  BookOpen,
  LayoutDashboard,
  PlayCircle,
  Calendar,
  TrendingUp,
  BarChart2,
  AlertCircle,
  Video,
  Loader2,
  CheckCircle,
  Clock,
  CreditCard,
  ClipboardList,
  ExternalLink,
  ChevronRight,
  BookMarked,
  FileQuestion,
  Timer,
  X,
} from "lucide-react";

/* â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type Section =
  | "overview"
  | "attendance"
  | "tests"
  | "classes"
  | "lectures"
  | "fees"
  | "tasks";
type Profile = { full_name: string; phone: string | null };
type StudentProfile = { registration_no: string; target_exam: string | null };
type CourseProgress = {
  course_id: number;
  instructor_name: string | null;
  duration_label: string | null;
  exam_label: string | null;
  progress_percent: number;
  courses: { title: string } | null;
};
type Payment = {
  id: number;
  amount: number;
  payment_date: string;
  payment_mode: string | null;
  status: string;
  razorpay_payment_id: string | null;
  description: string | null;
};
type FeePlan = {
  total_fee: number;
  next_due_amount: number;
  next_due_date: string | null;
};
type ClassSession = {
  id: number;
  title: string;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  meeting_link: string | null;
  is_live: boolean;
  batches: { batch_name: string; courses: { title: string } | null } | null;
};
type AttendanceRecord = {
  id: number;
  status: string;
  marked_at: string;
  class_sessions: {
    session_date: string;
    title: string;
    batches: { batch_name: string } | null;
  } | null;
};
type McqTest = {
  id: number;
  title: string;
  total_marks: number;
  time_limit_minutes: number;
  exam_type: string;
  test_type?: string; // 'mcq' or 'descriptive'
  scheduled_at: string | null;
  is_published: boolean;
  courses: { title: string } | null;
  batches: { batch_name: string } | null;
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
  question_id: number;
  answer_file_url: string | null;
  submitted_at: string | null;
  marks_obtained: number | null;
  faculty_notes: string | null;
};
type McqQuestion = {
  id: number;
  question_text: string;
  question_order: number;
  marks: number;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};
type StudentTask = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  batches: { batch_name: string } | null;
  profiles: { full_name: string } | null;
};
type RecordedLecture = {
  id: number;
  title: string;
  description: string | null;
  subject: string | null;
  drive_link: string;
  created_at: string;
  batches: { batch_name: string; courses: { title: string } | null } | null;
};
type EnrollmentRow = {
  batch_id: number;
  batches: {
    batch_name: string;
    courses: { id: number; title: string } | null;
  } | null;
};

function unwrapOne<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}
function pct(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}
function fmt(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
function fmtCurrency(n: number) {
  return `\u20B9${fmt(n)}`;
}
function fmtDate(s: string | null) {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}
function localDateKey(d: Date = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

/* â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

function ProgressBar({ pct: p }: { pct: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700"
        style={{ width: `${p}%` }}
      />
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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
        isActive
          ? "bg-white text-purple-700 font-semibold shadow-sm border border-purple-100"
          : "text-gray-700 hover:bg-white hover:shadow-sm"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STUDENT DASHBOARD
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function StudentDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("overview");

  /* data states */
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [batchLabel, setBatchLabel] = useState<string | null>(null);
  const [batchIds, setBatchIds] = useState<number[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [attendancePeriod, setAttendancePeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("weekly");
  const [availableTests, setAvailableTests] = useState<McqTest[]>([]);
  const [testAttempted, setTestAttempted] = useState<Set<number>>(new Set());
  const [descriptiveTests, setDescriptiveTests] = useState<McqTest[]>([]);
  const [descriptiveQuestions, setDescriptiveQuestions] = useState<
    DescriptiveQuestion[]
  >([]);
  const [descriptiveAnswers, setDescriptiveAnswers] = useState<
    DescriptiveAnswer[]
  >([]);
  const [selectedDescriptiveTest, setSelectedDescriptiveTest] =
    useState<McqTest | null>(null);
  const [uploadingQuestion, setUploadingQuestion] = useState<number | null>(
    null,
  );
  const [uploadMsg, setUploadMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [lectures, setLectures] = useState<RecordedLecture[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feePlan, setFeePlan] = useState<FeePlan | null>(null);
  const [facultyTasks, setFacultyTasks] = useState<StudentTask[]>([]);
  const [mockStat, setMockStat] = useState({ scored: 0, total: 0 });

  /* MCQ test state */
  const [activeTest, setActiveTest] = useState<{
    test: McqTest;
    questions: McqQuestion[];
  } | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [timerSecs, setTimerSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    scored: number;
    total: number;
    correct: number;
    totalQ: number;
  } | null>(null);

  /* fee/payment state */
  const [payAmount, setPayAmount] = useState("");
  const [payDesc, setPayDesc] = useState("Course fee payment");
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* â”€â”€ load data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login-portal");
        return;
      }
      const uid = user.id;

      /* stage 1 */
      const [profileRes, spRes, enrollRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("user_id", uid)
          .single(),
        supabase
          .from("student_profiles")
          .select("registration_no, target_exam")
          .eq("user_id", uid)
          .single(),
        supabase
          .from("enrollments")
          .select("batch_id, batches(batch_name, courses(id, title))")
          .eq("student_user_id", uid),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (spRes.data) setStudentProfile(spRes.data as StudentProfile);

      const enrollRows =
        (enrollRes.data as unknown as EnrollmentRow[] | null) ?? [];
      const ids = enrollRows.map((e) => e.batch_id).filter(Boolean);
      setBatchIds(ids);
      const firstBatch = unwrapOne(enrollRows[0]?.batches) as {
        batch_name: string;
      } | null;
      if (firstBatch?.batch_name) setBatchLabel(firstBatch.batch_name);

      /* stage 2 */
      const [
        coursesRes,
        paymentsRes,
        feePlanRes,
        classesRes,
        attendRes,
        mockRes,
        tasksRes,
        lecturesRes,
      ] = await Promise.all([
        supabase
          .from("student_course_progress")
          .select(
            "course_id, instructor_name, duration_label, exam_label, progress_percent, courses(title)",
          )
          .eq("student_user_id", uid),
        supabase
          .from("payments")
          .select(
            "id, amount, payment_date, payment_mode, status, razorpay_payment_id, description",
          )
          .eq("student_user_id", uid)
          .order("payment_date", { ascending: false }),
        supabase
          .from("student_fee_plans")
          .select("total_fee, next_due_amount, next_due_date")
          .eq("student_user_id", uid)
          .single(),
        ids.length > 0
          ? supabase
              .from("class_sessions")
              .select(
                "id, title, session_date, start_time, end_time, meeting_link, is_live, batches(batch_name, courses(title))",
              )
              .in("batch_id", ids)
              .order("session_date", { ascending: false })
              .limit(50)
          : Promise.resolve({ data: [], error: null }),
        supabase
          .from("student_attendance")
          .select(
            "id, status, marked_at, class_sessions(session_date, title, batches(batch_name))",
          )
          .eq("student_user_id", uid)
          .order("marked_at", { ascending: false }),
        supabase
          .from("mock_test_attempts")
          .select("scored_marks, mock_test_id, mock_tests(total_marks)")
          .eq("student_user_id", uid),
        supabase
          .from("faculty_tasks")
          .select(
            "id, title, description, due_date, status, batches(batch_name), profiles(full_name)",
          )
          .order("due_date", { ascending: true }),
        ids.length > 0
          ? supabase
              .from("recorded_lectures")
              .select(
                "id, title, description, subject, drive_link, created_at, batches(batch_name, courses(title))",
              )
              .in("batch_id", ids)
              .eq("is_active", true)
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ]);

      /* set course progress */
      const cpRows =
        (coursesRes.data as unknown as CourseProgress[] | null) ?? [];
      if (cpRows.length > 0) {
        setCourses(cpRows);
      } else if (enrollRows.length > 0) {
        setCourses(
          Array.from(
            new Map(
              enrollRows.map((e) => {
                const c = unwrapOne(unwrapOne(e.batches)?.courses) as {
                  id: number;
                  title: string;
                } | null;
                return [
                  c?.id ?? e.batch_id,
                  {
                    course_id: c?.id ?? e.batch_id,
                    instructor_name: null,
                    duration_label: null,
                    exam_label: null,
                    progress_percent: 0,
                    courses: c ? { title: c.title } : { title: "Course" },
                  } as CourseProgress,
                ];
              }),
            ).values(),
          ),
        );
      }

      if (paymentsRes.data)
        setPayments(paymentsRes.data as unknown as Payment[]);
      if (feePlanRes.data) setFeePlan(feePlanRes.data as FeePlan);
      if (classesRes.data)
        setClassSessions(classesRes.data as unknown as ClassSession[]);
      if (attendRes.data)
        setAttendanceRecords(attendRes.data as unknown as AttendanceRecord[]);
      if (lecturesRes.data)
        setLectures(lecturesRes.data as unknown as RecordedLecture[]);
      if (tasksRes.data)
        setFacultyTasks(tasksRes.data as unknown as StudentTask[]);

      if (mockRes.data && mockRes.data.length > 0) {
        const scored = mockRes.data.reduce(
          (s, r) => s + Number(r.scored_marks),
          0,
        );
        const total = mockRes.data.reduce((s, r) => {
          const mt = unwrapOne(
            r.mock_tests as
              | { total_marks: number }
              | { total_marks: number }[]
              | null,
          );
          return s + Number(mt?.total_marks ?? 0);
        }, 0);
        setMockStat({ scored, total });
        setTestAttempted(new Set(mockRes.data.map((a) => a.mock_test_id)));
      }

      /* MCQ tests for student's batches */
      if (ids.length > 0) {
        const { data: testsData } = await supabase
          .from("mock_tests")
          .select(
            "id, title, total_marks, time_limit_minutes, exam_type, test_type, scheduled_at, is_published, courses(title), batches(batch_name)",
          )
          .in("batch_id", ids)
          .eq("is_published", true)
          .order("scheduled_at", { ascending: true });
        if (testsData) {
          const tests = testsData as unknown as McqTest[];
          const mcqTests = tests.filter((t) => t.test_type !== "descriptive");
          const descTests = tests.filter((t) => t.test_type === "descriptive");
          setAvailableTests(mcqTests);
          setDescriptiveTests(descTests);

          // Load student's descriptive answers
          if (user) {
            const { data: answersData } = await supabase
              .from("descriptive_student_answers")
              .select("*")
              .eq("student_user_id", user.id)
              .in(
                "mock_test_id",
                descTests.map((t) => t.id),
              );
            if (answersData)
              setDescriptiveAnswers(
                answersData as unknown as DescriptiveAnswer[],
              );
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  /* â”€â”€ attendance filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const filteredAttendance = (() => {
    const now = new Date();
    return attendanceRecords.filter((a) => {
      const dateStr =
        (a.class_sessions as { session_date?: string } | null)?.session_date ??
        a.marked_at;
      const d = new Date(dateStr);
      if (attendancePeriod === "daily")
        return d.toDateString() === now.toDateString();
      if (attendancePeriod === "weekly") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return d >= start && d <= end;
      }
      if (attendancePeriod === "monthly")
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      return d.getFullYear() === now.getFullYear();
    });
  })();
  const filteredPct = pct(
    filteredAttendance.filter((a) => a.status === "present").length,
    filteredAttendance.length,
  );

  /* â”€â”€ MCQ timer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const handleSubmitTest = useCallback(async () => {
    if (!activeTest) return;
    const supabase = createClient();
    if (timerRef.current) clearInterval(timerRef.current);
    setTestSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: qWithAnswers } = await supabase
        .from("mcq_questions")
        .select("id, correct_option, marks")
        .eq("mock_test_id", activeTest.test.id);
      const answers = activeTest.questions.map((q) => {
        const chosen = testAnswers[q.id] ?? null;
        const correct =
          qWithAnswers?.find((cq) => cq.id === q.id)?.correct_option ?? null;
        return {
          mock_test_id: activeTest.test.id,
          student_user_id: user.id,
          question_id: q.id,
          chosen_option: chosen,
          is_correct: chosen !== null && chosen === correct,
        };
      });
      await supabase.from("mcq_student_answers").upsert(answers, {
        onConflict: "mock_test_id,student_user_id,question_id",
      });
      const scored = answers.reduce(
        (s, a) =>
          a.is_correct
            ? s +
              (activeTest.questions.find((q) => q.id === a.question_id)
                ?.marks ?? 1)
            : s,
        0,
      );
      const totalMarks = activeTest.questions.reduce((s, q) => s + q.marks, 0);
      await supabase.from("mock_test_attempts").upsert(
        {
          mock_test_id: activeTest.test.id,
          student_user_id: user.id,
          scored_marks: scored,
        },
        { onConflict: "mock_test_id,student_user_id" },
      );
      setTestResult({
        scored,
        total: totalMarks,
        correct: answers.filter((a) => a.is_correct).length,
        totalQ: activeTest.questions.length,
      });
      setTestAttempted((prev) => new Set([...prev, activeTest.test.id]));
    } finally {
      setTestSubmitting(false);
    }
  }, [activeTest, testAnswers]);

  useEffect(() => {
    if (!activeTest || testResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSecs((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTest, testResult, handleSubmitTest]);

  async function startTest(test: McqTest) {
    const supabase = createClient();
    const { data: qData } = await supabase
      .from("mcq_questions")
      .select(
        "id, question_text, question_order, marks, option_a, option_b, option_c, option_d",
      )
      .eq("mock_test_id", test.id)
      .order("question_order", { ascending: true });
    if (!qData || qData.length === 0) {
      alert("No questions found for this test.");
      return;
    }
    setActiveTest({ test, questions: qData as McqQuestion[] });
    setTestAnswers({});
    setTestResult(null);
    setTimerSecs(test.time_limit_minutes * 60);
  }

  async function loadDescriptiveQuestions(test: McqTest) {
    const supabase = createClient();
    const now = new Date();

    // Check if test has started (if scheduled_at is set)
    if (test.scheduled_at) {
      const scheduledTime = new Date(test.scheduled_at);
      if (now < scheduledTime) {
        setUploadMsg({
          type: "err",
          text: `This test will be available from ${scheduledTime.toLocaleString()}`,
        });
        return;
      }
    }

    const { data: qData } = await supabase
      .from("descriptive_questions")
      .select("*")
      .eq("mock_test_id", test.id)
      .order("question_order", { ascending: true });

    if (qData) {
      setDescriptiveQuestions(qData as unknown as DescriptiveQuestion[]);
      setSelectedDescriptiveTest(test);
    }
  }

  async function handleFileUpload(questionId: number, file: File | null) {
    if (!file || !selectedDescriptiveTest) return;

    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    setUploadingQuestion(questionId);
    setUploadMsg(null);

    try {
      // Upload file to Supabase Storage
      const fileName = `descriptive/${selectedDescriptiveTest.id}/${user.user.id}/${questionId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("test-submissions")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("test-submissions")
        .getPublicUrl(fileName);

      // Update or insert descriptive answer record
      const { error: answerError } = await supabase
        .from("descriptive_student_answers")
        .upsert({
          mock_test_id: selectedDescriptiveTest.id,
          student_user_id: user.user.id,
          question_id: questionId,
          answer_file_url: urlData.publicUrl,
          submitted_at: new Date().toISOString(),
        });

      if (answerError) throw answerError;

      setUploadMsg({ type: "ok", text: "Answer uploaded successfully!" });

      // Reload answers
      const { data: updatedAnswers } = await supabase
        .from("descriptive_student_answers")
        .select("*")
        .eq("student_user_id", user.user.id)
        .eq("mock_test_id", selectedDescriptiveTest.id);

      if (updatedAnswers)
        setDescriptiveAnswers(updatedAnswers as unknown as DescriptiveAnswer[]);
    } catch (err) {
      console.error(err);
      setUploadMsg({
        type: "err",
        text: "Failed to upload answer. Please try again.",
      });
    } finally {
      setUploadingQuestion(null);
    }
  }

  /* â”€â”€ Razorpay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function handlePay() {
    setPaying(false);
    setPayMsg({
      type: "err",
      text: "Online payment is temporarily disabled. Please contact support.",
    });
  }

  /* â”€â”€ computed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const overallProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((s, c) => s + c.progress_percent, 0) / courses.length,
        )
      : 0;
  const liveSessions = classSessions.filter((s) => s.is_live);
  const upcomingSessions = classSessions.filter(
    (s) => !s.is_live && isUpcomingSession(s.session_date, s.start_time),
  );
  const recentSessions = classSessions
    .filter(
      (s) => !s.is_live && !isUpcomingSession(s.session_date, s.start_time),
    )
    .slice(0, 10);

  /* â”€â”€ loading / error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• RENDER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <>
      {/* â”€â”€ MCQ TEST OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-4 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  {activeTest.test.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTest.questions.length} questions |{" "}
                  {activeTest.test.total_marks} marks
                </p>
              </div>
              {testResult ? (
                <button
                  onClick={() => setActiveTest(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm"
                >
                  <X className="w-4 h-4" /> Close
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm ${timerSecs < 120 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    <Timer className="w-4 h-4" />
                    {String(Math.floor(timerSecs / 60)).padStart(2, "0")}:
                    {String(timerSecs % 60).padStart(2, "0")}
                  </div>
                  <button
                    onClick={handleSubmitTest}
                    disabled={testSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
                  >
                    {testSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Submit
                  </button>
                </div>
              )}
            </div>

            {testResult ? (
              <div className="p-8 text-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold ${pct(testResult.scored, testResult.total) >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {pct(testResult.scored, testResult.total)}%
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pct(testResult.scored, testResult.total) >= 60
                    ? "Well done!"
                    : "Keep practising!"}
                </h3>
                <p className="text-gray-600 mb-6">
                  You scored <strong>{testResult.scored}</strong> out of{" "}
                  <strong>{testResult.total}</strong> marks (
                  {testResult.correct}/{testResult.totalQ} correct)
                </p>
                <button
                  onClick={() => setActiveTest(null)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {activeTest.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                  >
                    <p className="font-semibold text-gray-900 mb-3">
                      <span className="text-purple-600 mr-2">Q{idx + 1}.</span>
                      {q.question_text}
                      <span className="ml-2 text-xs text-gray-500">
                        ({q.marks} mark{q.marks > 1 ? "s" : ""})
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(["A", "B", "C", "D"] as const).map((opt) => {
                        const text =
                          q[
                            `option_${opt.toLowerCase()}` as
                              | "option_a"
                              | "option_b"
                              | "option_c"
                              | "option_d"
                          ];
                        const selected = testAnswers[q.id] === opt;
                        return (
                          <label
                            key={opt}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-200"}`}
                          >
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt}
                              checked={selected}
                              onChange={() =>
                                setTestAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt,
                                }))
                              }
                              className="mt-0.5 accent-purple-600"
                            />
                            <span className="text-sm text-gray-800">
                              <strong className="text-purple-600">
                                {opt}.
                              </strong>{" "}
                              {text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmitTest}
                    disabled={testSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-60"
                  >
                    {testSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Submit Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                <p className="text-base font-bold text-purple-700 sm:text-lg leading-tight">
                  LePearl Education
                </p>
                <p className="text-[10px] leading-tight text-slate-600 sm:text-xs">
                  Centre of Excellence in English Language &amp; Literature
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
            <aside className="bg-purple-50 border border-purple-100 rounded-2xl p-4 h-fit lg:sticky lg:top-24">
              <div className="flex items-center gap-3 pb-4 border-b border-purple-100">
                <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
                  {profile?.full_name?.charAt(0) ?? "S"}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {profile?.full_name ?? "Student"}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {studentProfile?.registration_no ?? "N/A"}
                  </p>
                  <p className="text-xs text-purple-700 font-semibold mt-1">
                    Batch: {batchLabel ?? "Not Assigned"}
                  </p>
                </div>
              </div>
              <nav className="mt-4 space-y-1.5">
                <NavBtn
                  section="overview"
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
                  section="tests"
                  active={activeSection}
                  onClick={setActiveSection}
                  icon={FileQuestion}
                  label="Mock &amp; Tests"
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
                  section="fees"
                  active={activeSection}
                  onClick={setActiveSection}
                  icon={CreditCard}
                  label="Fees &amp; Payments"
                />
                <NavBtn
                  section="tasks"
                  active={activeSection}
                  onClick={setActiveSection}
                  icon={ClipboardList}
                  label="My Tasks"
                />
              </nav>
            </aside>

            {/* main content */}
            <section className="space-y-6 min-w-0">
              {/* â•â• OVERVIEW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              {activeSection === "overview" && (
                <>
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-0.5">
                      Welcome back,{" "}
                      {profile?.full_name?.split(" ")[0] ?? "Student"}!
                    </h1>
                    <p className="text-purple-200 text-sm">
                      Here&apos;s your learning journey at a glance
                    </p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      label="Enrolled Courses"
                      value={courses.length}
                      icon={BookOpen}
                      iconBg="bg-indigo-100"
                      iconColor="text-indigo-600"
                    />
                    <StatCard
                      label="Overall Attendance"
                      value={
                        attendanceRecords.length > 0
                          ? `${pct(attendanceRecords.filter((a) => a.status === "present").length, attendanceRecords.length)}%`
                          : "-"
                      }
                      icon={Calendar}
                      iconBg="bg-green-100"
                      iconColor="text-green-600"
                    />
                    <StatCard
                      label="Avg. Test Score"
                      value={
                        mockStat.total > 0
                          ? `${pct(mockStat.scored, mockStat.total)}%`
                          : "-"
                      }
                      icon={BarChart2}
                      iconBg="bg-purple-100"
                      iconColor="text-purple-600"
                    />
                    <StatCard
                      label="Course Progress"
                      value={courses.length > 0 ? `${overallProgress}%` : "-"}
                      icon={TrendingUp}
                      iconBg="bg-orange-100"
                      iconColor="text-orange-500"
                    />
                  </div>
                  {courses.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        My Courses
                      </h2>
                      <div className="space-y-5">
                        {courses.map((c) => (
                          <div key={c.course_id}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {unwrapOne(c.courses)?.title ?? "Course"}
                                </p>
                                {c.instructor_name && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Instructor: {c.instructor_name}
                                  </p>
                                )}
                                {c.exam_label && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                    {c.exam_label}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-bold text-purple-700">
                                {c.progress_percent}%
                              </span>
                            </div>
                            <ProgressBar pct={c.progress_percent} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Check Attendance",
                        section: "attendance" as Section,
                        icon: Calendar,
                        color: "bg-green-600",
                      },
                      {
                        label: "Take a Test",
                        section: "tests" as Section,
                        icon: FileQuestion,
                        color: "bg-purple-600",
                      },
                      {
                        label: "Join Live Class",
                        section: "classes" as Section,
                        icon: Video,
                        color: "bg-blue-600",
                      },
                      {
                        label: "Pay Fees",
                        section: "fees" as Section,
                        icon: CreditCard,
                        color: "bg-amber-600",
                      },
                    ].map((q) => (
                      <button
                        key={q.label}
                        onClick={() => setActiveSection(q.section)}
                        className={`${q.color} text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
                      >
                        <q.icon className="w-6 h-6" />
                        <span className="text-xs font-semibold text-center">
                          {q.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* â•â• ATTENDANCE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              {activeSection === "attendance" && (
                <>
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-1">My Attendance</h1>
                    <p className="text-green-100 text-sm">
                      Track your attendance across all sessions
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-2 flex-wrap">
                    {(["daily", "weekly", "monthly", "yearly"] as const).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setAttendancePeriod(p)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${attendancePeriod === p ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {
                          filteredAttendance.filter(
                            (a) => a.status === "present",
                          ).length
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Present</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
                      <p className="text-3xl font-bold text-red-500">
                        {
                          filteredAttendance.filter(
                            (a) => a.status === "absent",
                          ).length
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Absent</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {filteredAttendance.length > 0
                          ? `${filteredPct}%`
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Attendance %</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="text-base font-bold text-gray-900 mb-4 capitalize">
                      {attendancePeriod} Records
                    </h2>
                    {filteredAttendance.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No attendance records for this period.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {filteredAttendance.map((a) => {
                          const session = unwrapOne(a.class_sessions);
                          const batch = unwrapOne(session?.batches);
                          return (
                            <div
                              key={a.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {session?.title ?? "Class Session"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {fmtDate(session?.session_date ?? null)} |{" "}
                                  {batch?.batch_name ?? ""}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                                  a.status === "present"
                                    ? "bg-green-100 text-green-700"
                                    : a.status === "late"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {a.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* â•â• TESTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              {activeSection === "tests" && (
                <>
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-1">
                      Mock &amp; Original Tests
                    </h1>
                    <p className="text-purple-100 text-sm">
                      Attempt MCQ tests or submit descriptive test answers
                    </p>
                  </div>
                  {selectedDescriptiveTest ? (
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                            Descriptive Test
                          </span>
                          <h2 className="font-bold text-gray-900 mt-2">
                            {selectedDescriptiveTest.title}
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            {unwrapOne(selectedDescriptiveTest.courses)?.title}{" "}
                            | {selectedDescriptiveTest.total_marks} marks
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedDescriptiveTest(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {descriptiveQuestions.map((q) => {
                          const answer = descriptiveAnswers.find(
                            (a) => a.question_id === q.id,
                          );
                          return (
                            <div
                              key={q.id}
                              className="border border-gray-200 rounded-xl p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">
                                    Q{q.question_order}: {q.question_text}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                      {q.marks} marks
                                    </span>
                                    {q.category && (
                                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                        {q.category}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {answer?.marks_obtained !== null && (
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                      Marks
                                    </p>
                                    <p className="text-lg font-bold text-green-600">
                                      {answer?.marks_obtained}/{q.marks}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {answer?.submitted_at ? (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-xs text-blue-700 font-semibold mb-2">
                                    ✓ Submitted
                                  </p>
                                  {answer.answer_file_url && (
                                    <a
                                      href={answer.answer_file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3 h-3" /> View
                                      Submission
                                    </a>
                                  )}
                                  {answer.faculty_notes && (
                                    <p className="text-xs text-gray-700 mt-2">
                                      <span className="font-semibold">
                                        Faculty Feedback:
                                      </span>{" "}
                                      {answer.faculty_notes}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-3">
                                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                                    Upload Answer (Scan/Image)
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        handleFileUpload(
                                          q.id,
                                          e.target.files[0],
                                        );
                                      }
                                    }}
                                    disabled={uploadingQuestion === q.id}
                                    className="text-xs"
                                  />
                                  {uploadingQuestion === q.id && (
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      Uploading...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : availableTests.length === 0 &&
                    descriptiveTests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                      <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No tests available right now. Check back later.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {availableTests.map((t) => {
                        const attempted = testAttempted.has(t.id);
                        return (
                          <div
                            key={t.id}
                            className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.exam_type === "original" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                                >
                                  {t.exam_type === "original"
                                    ? "Original Test"
                                    : "Mock Test"}
                                </span>
                                <h3 className="font-bold text-gray-900 mt-2 text-sm">
                                  {t.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {unwrapOne(t.courses)?.title ?? ""}
                                </p>
                              </div>
                              {attempted && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                              <span className="flex items-center gap-1">
                                <BookMarked className="w-3.5 h-3.5" />
                                {t.total_marks} marks
                              </span>
                              <span className="flex items-center gap-1">
                                <Timer className="w-3.5 h-3.5" />
                                {t.time_limit_minutes} min
                              </span>
                              {t.scheduled_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {fmtDate(t.scheduled_at)}
                                </span>
                              )}
                            </div>
                            {attempted ? (
                              <div className="w-full py-2 text-center text-sm font-semibold text-green-600 bg-green-50 rounded-xl">
                                âœ“ Completed
                              </div>
                            ) : (
                              <button
                                onClick={() => startTest(t)}
                                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                              >
                                <ChevronRight className="w-4 h-4" /> Start Test
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* â•â• LIVE CLASSES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              {activeSection === "classes" && (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-1">
                      Live &amp; Upcoming Classes
                    </h1>
                    <p className="text-blue-100 text-sm">
                      Join Google Meet or Zoom sessions assigned by your faculty
                    </p>
                  </div>
                  {liveSessions.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                        <h2 className="font-bold text-gray-900">Live Now</h2>
                      </div>
                      <div className="space-y-3">
                        {liveSessions.map((s) => {
                          const batch = unwrapOne(s.batches);
                          const course = unwrapOne(batch?.courses);
                          return (
                            <div
                              key={s.id}
                              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3"
                            >
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {s.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {course?.title ?? batch?.batch_name ?? ""} |{" "}
                                  {fmtTime(s.start_time)} -{" "}
                                  {fmtTime(s.end_time)}
                                </p>
                              </div>
                              {s.meeting_link && (
                                <a
                                  href={s.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Join meeting anytime - works before, during, and after scheduled time"
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 whitespace-nowrap"
                                >
                                  <Video className="w-3.5 h-3.5" /> Join Now
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-4">
                      Upcoming Classes
                    </h2>
                    {upcomingSessions.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No upcoming classes scheduled.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingSessions.map((s) => {
                          const batch = unwrapOne(s.batches);
                          const course = unwrapOne(batch?.courses);
                          const isToday =
                            s.session_date ===
                            new Date().toISOString().split("T")[0];
                          return (
                            <div
                              key={s.id}
                              className={`rounded-xl p-4 border flex items-center justify-between gap-3 ${isToday ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {s.title}
                                  </p>
                                  {isToday && (
                                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                      Today
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {fmtDate(s.session_date)} |{" "}
                                  {fmtTime(s.start_time)}{" "}
                                  {s.end_time && `- ${fmtTime(s.end_time)}`}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {course?.title ?? batch?.batch_name ?? ""}
                                </p>
                              </div>
                              {s.meeting_link && (
                                <a
                                  href={s.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Join meeting anytime - works before, during, and after scheduled time"
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 whitespace-nowrap"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> Join
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-4">
                      Recent Classes
                    </h2>
                    {recentSessions.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No recent class details available.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {recentSessions.map((s) => {
                          const batch = unwrapOne(s.batches);
                          const course = unwrapOne(batch?.courses);
                          return (
                            <div
                              key={s.id}
                              className="rounded-xl p-4 border border-gray-100 bg-gray-50 flex items-center justify-between gap-3"
                            >
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {s.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {fmtDate(s.session_date)} |{" "}
                                  {fmtTime(s.start_time)}{" "}
                                  {s.end_time && `- ${fmtTime(s.end_time)}`}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {course?.title ?? batch?.batch_name ?? ""}
                                </p>
                              </div>
                              {s.meeting_link && (
                                <a
                                  href={s.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Access meeting recording or details anytime"
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 whitespace-nowrap"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> Open
                                </a>
                              )}
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
                    <h1 className="text-xl font-bold mb-1">
                      Recorded Lectures
                    </h1>
                    <p className="text-indigo-100 text-sm">
                      Click any lecture to open the recording in Google Drive
                    </p>
                  </div>
                  {lectures.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                      <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No recorded lectures available yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {lectures.map((lec) => {
                        const batch = unwrapOne(lec.batches);
                        const course = unwrapOne(batch?.courses);
                        return (
                          <div
                            key={lec.id}
                            className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:border-indigo-200 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <PlayCircle className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                  {lec.title}
                                </h3>
                                {lec.subject && (
                                  <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                                    {lec.subject}
                                  </p>
                                )}
                                {course?.title && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {course.title}
                                  </p>
                                )}
                                {lec.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {lec.description}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {fmtDate(lec.created_at)}
                                </p>
                              </div>
                            </div>
                            <a
                              href={lec.drive_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> Open in
                              Google Drive
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* â•â• FEES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              {activeSection === "fees" && (
                <>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-1">
                      Fees &amp; Payments
                    </h1>
                    <p className="text-amber-100 text-sm">
                      Pay securely via Razorpay | All transactions are encrypted
                    </p>
                  </div>
                  {feePlan && (
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">
                          Total Course Fee
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {fmtCurrency(feePlan.total_fee)}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">Total Paid</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {fmtCurrency(paidAmount)}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">Next Due Amount</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                          {fmtCurrency(feePlan.next_due_amount)}
                        </p>
                        {feePlan.next_due_date && (
                          <p className="text-xs text-gray-400 mt-1">
                            Due: {fmtDate(feePlan.next_due_date)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4">
                      Make a Payment
                    </h2>
                    <div className="space-y-4 max-w-sm">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Amount (INR)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          placeholder={
                            feePlan
                              ? String(feePlan.next_due_amount)
                              : "Enter amount"
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Description
                        </label>
                        <input
                          type="text"
                          value={payDesc}
                          onChange={(e) => setPayDesc(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        />
                      </div>
                      {payMsg && (
                        <div
                          className={`flex items-start gap-2 p-3 rounded-xl text-sm ${payMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                        >
                          {payMsg.type === "ok" ? (
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                          {payMsg.text}
                        </div>
                      )}
                      <button
                        onClick={handlePay}
                        disabled={paying}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                      >
                        {paying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        Pay Securely via Razorpay
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-4">
                      Payment History
                    </h2>
                    {payments.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-6">
                        No payment records found.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                              <th className="pb-2 font-semibold">Date</th>
                              <th className="pb-2 font-semibold">Amount</th>
                              <th className="pb-2 font-semibold">
                                Description
                              </th>
                              <th className="pb-2 font-semibold">Mode</th>
                              <th className="pb-2 font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {payments.map((p) => (
                              <tr key={p.id}>
                                <td className="py-3 text-gray-700">
                                  {fmtDate(p.payment_date)}
                                </td>
                                <td className="py-3 font-semibold text-gray-900">
                                  {fmtCurrency(p.amount)}
                                </td>
                                <td className="py-3 text-gray-500 max-w-[140px] truncate">
                                  {p.description ?? "-"}
                                </td>
                                <td className="py-3 text-gray-500">
                                  {p.payment_mode ?? "-"}
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                  >
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* â•â• TASKS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              {activeSection === "tasks" && (
                <>
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-1">My Tasks</h1>
                    <p className="text-violet-100 text-sm">
                      Tasks and assignments given by your faculty
                    </p>
                  </div>
                  {facultyTasks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                      <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No tasks assigned yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {facultyTasks.map((t) => {
                        const batch = unwrapOne(t.batches);
                        const faculty = unwrapOne(t.profiles);
                        const overdue =
                          t.due_date &&
                          new Date(t.due_date) < new Date() &&
                          t.status !== "completed";
                        return (
                          <div
                            key={t.id}
                            className={`bg-white rounded-2xl shadow-sm p-5 border ${overdue ? "border-red-200" : "border-gray-100"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  {batch && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                                      {batch.batch_name}
                                    </span>
                                  )}
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                      t.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : t.status === "reviewed"
                                          ? "bg-purple-100 text-purple-700"
                                          : t.status === "submitted"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {t.status}
                                  </span>
                                  {overdue && (
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">
                                  {t.title}
                                </h3>
                                {faculty && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Assigned by: {faculty.full_name}
                                  </p>
                                )}
                                {t.description && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    {t.description}
                                  </p>
                                )}
                              </div>
                              {t.due_date && (
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs text-gray-400">Due</p>
                                  <p
                                    className={`text-xs font-bold ${overdue ? "text-red-600" : "text-orange-600"}`}
                                  >
                                    {fmtDate(t.due_date)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
