"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
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
} from "lucide-react";

/* â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type Section =
  | "dashboard"
  | "attendance"
  | "mcq"
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
type McqTestFaculty = {
  id: number;
  title: string;
  total_marks: number;
  time_limit_minutes: number;
  exam_type: string;
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
  if (!s) return "â€”";
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
  const [batchStudents, setBatchStudents] = useState<BatchStudent[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [progressUpdating, setProgressUpdating] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

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

  /* classes */
  const [showClassForm, setShowClassForm] = useState(false);
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
  const [attendanceMsg, setAttendanceMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* â”€â”€ load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

      const [
        profileRes,
        batchesRes,
        classesRes,
        tasksRes,
        mcqRes,
        lecturesRes,
        attSessionsRes,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("user_id", uid)
          .single(),
        supabase
          .from("batches")
          .select(
            "id, batch_name, start_date, end_date, courses(id, title), enrollments(count)",
          )
          .eq("faculty_user_id", uid),
        supabase
          .from("class_sessions")
          .select(
            "id, title, session_date, start_time, end_time, meeting_link, is_live, batches(batch_name, courses(title))",
          )
          .eq("created_by", uid)
          .gte("session_date", new Date().toISOString().split("T")[0])
          .order("session_date", { ascending: true })
          .limit(10),
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
            "id, title, total_marks, time_limit_minutes, exam_type, scheduled_at, is_published, batch_id, courses(title), batches(batch_name), mcq_questions(count)",
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
          .select("id, title, session_date, start_time, batches(batch_name)")
          .eq("created_by", uid)
          .order("session_date", { ascending: false })
          .limit(30),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (tasksRes.data) setTasks(tasksRes.data as unknown as FacultyTask[]);
      if (mcqRes.data) setMcqTests(mcqRes.data as unknown as McqTestFaculty[]);
      if (lecturesRes.data)
        setLectures(lecturesRes.data as unknown as RecordedLectureFaculty[]);
      if (classesRes.data)
        setUpcomingClasses(classesRes.data as unknown as ClassSession[]);
      if (attSessionsRes.data)
        setAttendanceSessions(
          attSessionsRes.data as unknown as AttendanceSession[],
        );

      if (batchesRes.data) {
        const batchData = batchesRes.data as unknown as Batch[];
        setBatches(batchData);
        const total = batchData.reduce(
          (s, b) =>
            s +
            ((b.enrollments as unknown as { count: number }[])?.[0]?.count ??
              0),
          0,
        );
        setTotalStudents(total);

        if (batchData.length > 0) {
          const batchIds = batchData.map((b) => b.id);
          const { data: enrollData } = await supabase
            .from("enrollments")
            .select("batch_id, student_user_id, batches(batch_name)")
            .in("batch_id", batchIds);
          if (enrollData && enrollData.length > 0) {
            const studentIds = [
              ...new Set(enrollData.map((e) => e.student_user_id)),
            ];
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
                  | { batch_name: string }
                  | { batch_name: string }[]
                  | null;
              }[]
            ).map((e) => ({
              batch_id: e.batch_id,
              student_user_id: e.student_user_id,
              full_name: nameMap[e.student_user_id] ?? "Student",
              batch_name:
                (unwrapOne(e.batches) as { batch_name: string } | null)
                  ?.batch_name ?? "",
            }));
            setBatchStudents(students);

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
          }
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

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  /* â”€â”€ attendance: load session students & existing marks â”€â”€ */
  async function selectSession(session: AttendanceSession) {
    const supabase = createClient();
    setSelectedSession(session);
    const students = batchStudents.filter(
      (s) =>
        s.batch_id ===
        (session.batches
          ? Array.isArray(session.batches)
            ? session.batches[0]?.batch_name
            : (session.batches as { batch_name: string }).batch_name
          : null),
    );
    // fallback: get students from that batch via DB
    const batchName = unwrapOne(session.batches)?.batch_name;
    if (students.length === 0 && batchName) {
      const batch = batches.find((b) => b.batch_name === batchName);
      if (batch) {
        const { data: enrollData } = await supabase
          .from("enrollments")
          .select("student_user_id")
          .eq("batch_id", batch.id);
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
          }));
          setSessionStudents(mapped);
        }
      }
    } else {
      const batch = batches.find((b) => b.batch_name === batchName);
      if (batch)
        setSessionStudents(
          batchStudents.filter((s) => s.batch_id === batch.id),
        );
    }
    // load existing attendance
    const { data: existingData } = await supabase
      .from("student_attendance")
      .select("student_user_id, status")
      .eq("session_id", session.id);
    const map: Record<string, string> = {};
    ((existingData as unknown as StudentAttendance[]) ?? []).forEach((a) => {
      map[a.student_user_id] = a.status;
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

  /* â”€â”€ MCQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function createMcqTest() {
    const supabase = createClient();
    setMcqSubmitting(true);
    setMcqMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const batch = batches.find((b) => b.id === parseInt(mcqForm.batchId));
      const courseId = unwrapOne(
        batch?.courses as
          | { id: number; title: string }
          | { id: number; title: string }[]
          | null,
      )?.id;
      const { data, error } = await supabase
        .from("mock_tests")
        .insert({
          title: mcqForm.title,
          total_marks: parseInt(mcqForm.totalMarks),
          time_limit_minutes: parseInt(mcqForm.timeLimitMinutes),
          exam_type: mcqForm.examType,
          batch_id: parseInt(mcqForm.batchId) || null,
          course_id: courseId ?? 1,
          is_published: false,
          scheduled_at: mcqForm.scheduledAt || null,
          created_by: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      setMcqMsg({ type: "ok", text: "Test created! Add questions now." });
      setShowMcqForm(false);
      setMcqForm({
        batchId: "",
        title: "",
        timeLimitMinutes: "60",
        examType: "mock",
        scheduledAt: "",
        totalMarks: "100",
      });
      load();
      if (data) setSelectedTest(data as unknown as McqTestFaculty);
    } catch {
      setMcqMsg({ type: "err", text: "Failed to create test." });
    } finally {
      setMcqSubmitting(false);
    }
  }

  async function loadQuestions(test: McqTestFaculty) {
    const supabase = createClient();
    setSelectedTest(test);
    const { data } = await supabase
      .from("mcq_questions")
      .select("*")
      .eq("mock_test_id", test.id)
      .order("question_order", { ascending: true });
    setTestQuestions((data ?? []) as McqQuestion[]);
  }

  async function addQuestion() {
    if (!selectedTest) return;
    const supabase = createClient();
    setMcqSubmitting(true);
    try {
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
      setShowQForm(false);
      loadQuestions(selectedTest);
    } catch {
      setMcqMsg({ type: "err", text: "Failed to add question." });
    } finally {
      setMcqSubmitting(false);
    }
  }

  async function togglePublish(test: McqTestFaculty) {
    const supabase = createClient();
    const { error } = await supabase
      .from("mock_tests")
      .update({ is_published: !test.is_published })
      .eq("id", test.id);
    if (!error) load();
  }

  async function deleteQuestion(qId: number) {
    if (!confirm("Delete this question?")) return;
    const supabase = createClient();
    await supabase.from("mcq_questions").delete().eq("id", qId);
    if (selectedTest) loadQuestions(selectedTest);
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
      const { error } = await supabase.from("class_sessions").insert({
        batch_id: parseInt(classForm.batchId),
        title: classForm.title,
        session_date: classForm.sessionDate,
        start_time: classForm.startTime || null,
        end_time: classForm.endTime || null,
        meeting_link: classForm.meetingLink || null,
        is_live: classForm.isLive,
        created_by: user.id,
      });
      if (error) throw error;
      setClassMsg({ type: "ok", text: "Class session created!" });
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
      load();
    } catch {
      setClassMsg({ type: "err", text: "Failed to create class." });
    } finally {
      setClassSubmitting(false);
    }
  }

  async function toggleLive(session: ClassSession) {
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
                  {batches.length} batch{batches.length !== 1 ? "es" : ""} Â·{" "}
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
                label="MCQ Tests"
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                    value={upcomingClasses.length}
                    icon={Video}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                  />
                  <StatCard
                    label="Active Tasks"
                    value={tasks.filter((t) => t.status !== "completed").length}
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
                              {course?.title ?? "â€”"}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500">
                                <Users className="w-3.5 h-3.5 inline mr-1" />
                                {cnt} enrolled
                              </span>
                              <span className="text-xs text-gray-400">
                                {fmtDate(b.start_date)} â€“{" "}
                                {fmtDate(b.end_date)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* upcoming classes */}
                {upcomingClasses.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="text-base font-bold text-gray-900 mb-3">
                      Upcoming Classes
                    </h2>
                    <div className="space-y-2">
                      {upcomingClasses.map((s) => {
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
                                {fmtDate(s.session_date)} Â·{" "}
                                {fmtTime(s.start_time)} Â· {batch?.batch_name}
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
                  <h1 className="text-xl font-bold mb-1">
                    Attendance Management
                  </h1>
                  <p className="text-green-100 text-sm">
                    Select a session to mark or modify student attendance
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* session list */}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-3">
                      Select Session
                    </h2>
                    {attendanceSessions.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No class sessions found. Create classes first.
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
                                {s.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {fmtDate(s.session_date)} Â·{" "}
                                {fmtTime(s.start_time)} Â· {batch?.batch_name}
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
                              {selectedSession.title}
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
                                  {(["present", "late", "absent"] as const).map(
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
                                              : st === "late"
                                                ? "bg-amber-500 text-white"
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
                    MCQ Test Management
                  </h1>
                  <p className="text-purple-100 text-sm">
                    Create tests, add questions, publish to students, and view
                    results
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
                        Create New Test
                      </h2>
                      <button
                        onClick={() => setShowMcqForm(false)}
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
                        <Plus className="w-4 h-4" />
                      )}
                      Create Test
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
                        <h2 className="font-bold text-gray-900">
                          {selectedTest.title}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {testQuestions.length} questions Â·{" "}
                          {selectedTest.total_marks} marks Â·{" "}
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
                          Add Question
                        </h3>
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
                        <div className="flex gap-2">
                          <button
                            onClick={addQuestion}
                            disabled={mcqSubmitting || !qForm.questionText}
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
                                  {qCount} questions Â· {t.total_marks} marks Â·{" "}
                                  {t.time_limit_minutes} min Â· {t.exam_type}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => loadQuestions(t)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-200"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => togglePublish(t)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${t.is_published ? "bg-gray-200 text-gray-600" : "bg-green-100 text-green-700"}`}
                                >
                                  {t.is_published ? "Unpublish" : "Publish"}
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
                        Schedule New Class
                      </h2>
                      <button
                        onClick={() => setShowClassForm(false)}
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
                      Create Class
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
                                {fmtDate(s.session_date)} Â·{" "}
                                {fmtTime(s.start_time)} Â· {batch?.batch_name}
                              </p>
                              {s.meeting_link && (
                                <a
                                  href={s.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 flex items-center gap-1 mt-0.5 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" /> Meeting
                                  Link
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => toggleLive(s)}
                              className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex-shrink-0 ${s.is_live ? "bg-gray-200 text-gray-700" : "bg-red-600 text-white"}`}
                            >
                              {s.is_live ? "End Live" : "Go Live"}
                            </button>
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
                                {batch?.batch_name ?? "All batches"} Â·{" "}
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
                            <option value="">â€” Select batch â€”</option>
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
                            <option value="">â€” Entire batch â€”</option>
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
                  <h1 className="text-xl font-bold mb-1">
                    Student Progress Control
                  </h1>
                  <p className="text-teal-100 text-sm">
                    Update and monitor course progress for all your students
                  </p>
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
                      Student Progress
                    </h2>
                    <div className="space-y-4">
                      {batchStudents.map((student) => {
                        const progRows = studentProgress.filter(
                          (p) => p.student_user_id === student.student_user_id,
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
                            {progRows.length === 0 ? (
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
                                        <p className="text-xs font-semibold text-gray-700">
                                          {p.course_title}
                                        </p>
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
