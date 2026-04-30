"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/supabase/auth";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { formatDateIST } from "@/lib/timezone";
import {
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  BarChart2,
  Bell,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileQuestion,
  ChevronRight,
  X,
  Plus,
  Search,
  Eye,
  Video,
  ExternalLink,
} from "lucide-react";

/* ── types ──────────────────────────────────────────────── */
type AdminSection =
  | "overview"
  | "students"
  | "faculty"
  | "attendance"
  | "payments"
  | "courses"
  | "mcq"
  | "registrations";

type StudentRow = {
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  enrollment_no: string | null;
  created_at: string;
  enrollments?: { batch_name: string; course_title: string }[];
};
type FacultyRow = {
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  batchCount: number;
};
type AttendanceRow = {
  id: number;
  status: string;
  marked_at: string;
  student_name: string;
  session_title: string;
  session_date: string;
  batch_name: string;
};
type PaymentRow = {
  id: number;
  amount: number;
  status: string;
  payment_date: string | null;
  description: string | null;
  student_name: string;
  course_title: string;
};
type CourseRow = {
  id: number;
  title: string;
  description: string | null;
  duration_weeks: number | null;
  batch_count: number;
};
type BatchRow = {
  id: number;
  batch_name: string;
  start_date: string | null;
  end_date: string | null;
  student_count: number;
  course_title: string;
  faculty_name: string;
};
type McqRow = {
  id: number;
  title: string;
  total_marks: number;
  exam_type: string;
  is_published: boolean;
  batch_name: string;
  attempt_count: number;
};
type LiveClassRow = {
  id: number;
  title: string;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  meeting_link: string | null;
  is_live: boolean;
  batch_name: string;
  faculty_name: string;
};
type RegistrationRow = {
  id: string;
  full_name: string;
  qualification: string;
  course: string;
  phone: string;
  email: string;
  created_at: string;
  status: string;
};

function unwrapOne<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}
function fmtDate(s: string | null) {
  return formatDateIST(s);
}
function fmtCurrency(n: number) {
  return `\u20B9${n.toLocaleString("en-IN")}`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );
}

function SideBtn({
  s,
  active,
  onClick,
  icon: Icon,
  label,
}: {
  s: AdminSection;
  active: AdminSection;
  onClick: (x: AdminSection) => void;
  icon: React.ElementType;
  label: string;
}) {
  const on = s === active;
  return (
    <button
      onClick={() => onClick(s)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${on ? "bg-white text-amber-700 font-semibold shadow-sm border border-amber-100" : "text-gray-700 hover:bg-white hover:shadow-sm"}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function Badge({
  text,
  color,
}: {
  text: string;
  color: "green" | "red" | "yellow" | "blue" | "gray";
}) {
  const map = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${map[color]}`}
    >
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const router = useRouter();
  const createClient = () => createSupabaseClient("admin");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [search, setSearch] = useState("");

  /* overview stats */
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [totalLiveClasses, setTotalLiveClasses] = useState(0);

  /* data tables */
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [mcqTests, setMcqTests] = useState<McqRow[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClassRow[]>([]);

  /* payment form */
  const [showPayForm, setShowPayForm] = useState(false);
  const [payMsg, setPayMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [payForm, setPayForm] = useState({
    studentId: "",
    courseId: "",
    amount: "",
    description: "",
    status: "paid",
  });
  const [allStudentsSimple, setAllStudentsSimple] = useState<
    { user_id: string; full_name: string }[]
  >([]);
  const [allCoursesSimple, setAllCoursesSimple] = useState<
    { id: number; title: string }[]
  >([]);

  /* selected student detail */
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null,
  );

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

      const [
        studentsRes,
        facultyRes,
        attendanceRes,
        paymentsRes,
        coursesRes,
        batchesRes,
        registrationsRes,
        mcqRes,
        classesRes,
      ] = await Promise.all([
        supabase
          .from("enrollments")
          .select("student_user_id, batch_id, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("user_id, full_name, phone, created_at")
          .eq("role", "faculty"),
        supabase
          .from("student_attendance")
          .select(
            "id, status, marked_at, class_sessions(title, session_date, batches(batch_name)), student_profiles(profiles(full_name))",
          )
          .order("marked_at", { ascending: false })
          .limit(100),
        supabase
          .from("payments")
          .select(
            "id, amount, status, payment_date, description, student_profiles(profiles(full_name)), courses(title)",
          )
          .order("payment_date", { ascending: false })
          .limit(100),
        supabase
          .from("courses")
          .select("id, title, description, duration_weeks, batches(count)"),
        supabase
          .from("batches")
          .select(
            "id, batch_name, start_date, end_date, enrollments(count), courses(title), profiles(full_name)",
          ),
        supabase
          .from("student_registrations")
          .select(
            "id, full_name, qualification, course, phone, email, created_at, status",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("mock_tests")
          .select(
            "id, title, total_marks, exam_type, is_published, batch_id, batches(batch_name), mock_test_attempts(count)",
          ),
        supabase
          .from("class_sessions")
          .select(
            "id, title, session_date, start_time, end_time, meeting_link, is_live, batches(batch_name), profiles(full_name)",
          )
          .order("session_date", { ascending: false })
          .limit(100),
      ]);

      /* students */
      if (studentsRes.error) {
        console.error("Failed to load enrolled students:", studentsRes.error);
      }
      if (studentsRes.data) {
        const enrollRows = studentsRes.data as unknown as {
          student_user_id: string;
          batch_id: number;
          created_at: string;
        }[];

        const studentIds = [
          ...new Set(enrollRows.map((r) => r.student_user_id)),
        ];
        const batchIds = [...new Set(enrollRows.map((r) => r.batch_id))];

        const [
          { data: profileNamesData, error: profileNamesError },
          { data: batchesLookupData, error: batchesLookupError },
          { data: studentProfilesData },
        ] = await Promise.all([
          studentIds.length > 0
            ? supabase
                .from("profiles")
                .select("user_id, full_name, phone")
                .in("user_id", studentIds)
            : Promise.resolve({ data: [], error: null }),
          batchIds.length > 0
            ? supabase
                .from("batches")
                .select("id, batch_name, courses(title)")
                .in("id", batchIds)
            : Promise.resolve({ data: [], error: null }),
          studentIds.length > 0
            ? supabase
                .from("student_profiles")
                .select("user_id, enrollment_no")
                .in("user_id", studentIds)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (profileNamesError) {
          console.warn("Failed to load profile names:", profileNamesError);
        }
        if (batchesLookupError) {
          console.warn("Failed to load batch lookup:", batchesLookupError);
        }

        const namesById = new Map<
          string,
          { full_name: string; phone: string | null }
        >();
        (
          profileNamesData as unknown as
            | {
                user_id: string;
                full_name: string;
                phone: string | null;
              }[]
            | null
        )?.forEach((p) => {
          namesById.set(p.user_id, {
            full_name: p.full_name,
            phone: p.phone,
          });
        });

        const enrollmentNoById = new Map<string, string>();
        (
          studentProfilesData as unknown as
            | { user_id: string; enrollment_no: string | null }[]
            | null
        )?.forEach((sp) => {
          if (sp.enrollment_no)
            enrollmentNoById.set(sp.user_id, sp.enrollment_no);
        });

        const batchById = new Map<
          number,
          { batch_name: string; course_title: string }
        >();
        (
          batchesLookupData as unknown as
            | {
                id: number;
                batch_name: string;
                courses: { title: string } | { title: string }[] | null;
              }[]
            | null
        )?.forEach((b) => {
          batchById.set(b.id, {
            batch_name: b.batch_name,
            course_title: unwrapOne(b.courses)?.title ?? "Unassigned Course",
          });
        });

        const mapByStudent = new Map<string, StudentRow>();
        enrollRows.forEach((row) => {
          const studentId = row.student_user_id;

          const batchInfo = batchById.get(row.batch_id) ?? {
            batch_name: "Unknown Batch",
            course_title: "Unassigned Course",
          };

          const existing = mapByStudent.get(studentId);
          const enrollmentInfo = {
            batch_name: batchInfo.batch_name,
            course_title: batchInfo.course_title,
          };

          if (!existing) {
            const profileName = namesById.get(studentId);
            mapByStudent.set(studentId, {
              user_id: studentId,
              enrollment_no: enrollmentNoById.get(studentId) ?? null,
              full_name: profileName?.full_name ?? "Unknown",
              phone: profileName?.phone ?? null,
              email: null,
              created_at: row.created_at,
              enrollments: [enrollmentInfo],
            });
            return;
          }

          const alreadyAdded = (existing.enrollments || []).some(
            (e) =>
              e.batch_name === enrollmentInfo.batch_name &&
              e.course_title === enrollmentInfo.course_title,
          );
          if (!alreadyAdded) {
            existing.enrollments = [
              ...(existing.enrollments || []),
              enrollmentInfo,
            ];
          }
        });

        const rows = Array.from(mapByStudent.values());
        setStudents(rows);
        setTotalStudents(rows.length);
        setAllStudentsSimple(
          rows.map((r) => ({ user_id: r.user_id, full_name: r.full_name })),
        );
      }

      /* faculty */
      if (facultyRes.data) {
        const fRows = facultyRes.data as {
          user_id: string;
          full_name: string;
          phone: string | null;
          created_at: string;
        }[];
        const batchCounts: Record<string, number> = {};
        if (batchesRes.data) {
          (
            batchesRes.data as unknown as {
              id: number;
              profiles: { user_id: string } | null;
            }[]
          ).forEach((b) => {
            // Note: faculty_user_id not in this select, will use batches query
          });
        }
        setFaculty(fRows.map((f) => ({ ...f, email: null, batchCount: 0 })));
        setTotalFaculty(fRows.length);
      }

      /* attendance */
      if (attendanceRes.data) {
        const rows: AttendanceRow[] = (
          attendanceRes.data as unknown as {
            id: number;
            status: string;
            marked_at: string;
            class_sessions: {
              title: string;
              session_date: string;
              batches: { batch_name: string } | null;
            } | null;
            student_profiles: { profiles: { full_name: string } | null } | null;
          }[]
        ).map((a) => ({
          id: a.id,
          status: a.status,
          marked_at: a.marked_at,
          student_name:
            unwrapOne(a.student_profiles)?.profiles?.full_name ?? "Student",
          session_title: unwrapOne(a.class_sessions)?.title ?? "-",
          session_date: unwrapOne(a.class_sessions)?.session_date ?? "",
          batch_name:
            (
              unwrapOne(a.class_sessions)?.batches as {
                batch_name: string;
              } | null
            )?.batch_name ?? "-",
        }));
        setAttendance(rows);
      }

      /* payments */
      if (paymentsRes.data) {
        let rev = 0;
        const rows: PaymentRow[] = (
          paymentsRes.data as unknown as {
            id: number;
            amount: number;
            status: string;
            payment_date: string | null;
            description: string | null;
            student_profiles: { profiles: { full_name: string } | null } | null;
            courses: { title: string } | null;
          }[]
        ).map((p) => {
          if (p.status === "paid" || p.status === "completed")
            rev += p.amount ?? 0;
          return {
            id: p.id,
            amount: p.amount,
            status: p.status,
            payment_date: p.payment_date,
            description: p.description,
            student_name:
              unwrapOne(p.student_profiles)?.profiles?.full_name ?? "Student",
            course_title: unwrapOne(p.courses)?.title ?? "-",
          };
        });
        setPayments(rows);
        setTotalRevenue(rev);
      }

      /* courses */
      if (coursesRes.data) {
        const rows: CourseRow[] = (
          coursesRes.data as unknown as {
            id: number;
            title: string;
            description: string | null;
            duration_weeks: number | null;
            batches: { count: number }[] | null;
          }[]
        ).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          duration_weeks: c.duration_weeks,
          batch_count:
            (c.batches as unknown as { count: number }[])?.[0]?.count ?? 0,
        }));
        setCourses(rows);
        setAllCoursesSimple(rows.map((r) => ({ id: r.id, title: r.title })));
      }

      /* batches */
      if (batchesRes.data) {
        const rows: BatchRow[] = (
          batchesRes.data as unknown as {
            id: number;
            batch_name: string;
            start_date: string | null;
            end_date: string | null;
            enrollments: { count: number }[] | null;
            courses: { title: string } | null;
            profiles: { full_name: string } | null;
          }[]
        ).map((b) => ({
          id: b.id,
          batch_name: b.batch_name,
          start_date: b.start_date,
          end_date: b.end_date,
          student_count:
            (b.enrollments as unknown as { count: number }[])?.[0]?.count ?? 0,
          course_title: unwrapOne(b.courses)?.title ?? "-",
          faculty_name: unwrapOne(b.profiles)?.full_name ?? "-",
        }));
        setBatches(rows);
        setTotalBatches(rows.length);
      }

      /* mcq */
      if (mcqRes.data) {
        const rows: McqRow[] = (
          mcqRes.data as unknown as {
            id: number;
            title: string;
            total_marks: number;
            exam_type: string;
            is_published: boolean;
            batches: { batch_name: string } | null;
            mock_test_attempts: { count: number }[] | null;
          }[]
        ).map((t) => ({
          id: t.id,
          title: t.title,
          total_marks: t.total_marks,
          exam_type: t.exam_type,
          is_published: t.is_published,
          batch_name: unwrapOne(t.batches)?.batch_name ?? "-",
          attempt_count:
            (t.mock_test_attempts as unknown as { count: number }[])?.[0]
              ?.count ?? 0,
        }));
        setMcqTests(rows);
        setTotalTests(rows.length);
      }

      /* registrations */
      if (registrationsRes.data) {
        setRegistrations(registrationsRes.data as RegistrationRow[]);
      }

      if (classesRes.data) {
        const rows: LiveClassRow[] = (
          classesRes.data as unknown as {
            id: number;
            title: string;
            session_date: string;
            start_time: string | null;
            end_time: string | null;
            meeting_link: string | null;
            is_live: boolean;
            batches: { batch_name: string } | null;
            profiles: { full_name: string } | null;
          }[]
        ).map((c) => ({
          id: c.id,
          title: c.title,
          session_date: c.session_date,
          start_time: c.start_time,
          end_time: c.end_time,
          meeting_link: c.meeting_link,
          is_live: c.is_live,
          batch_name: unwrapOne(c.batches)?.batch_name ?? "-",
          faculty_name: unwrapOne(c.profiles)?.full_name ?? "-",
        }));
        setLiveClasses(rows);
        setTotalLiveClasses(rows.length);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    await signOut("admin");
    router.push("/login-portal");
  }

  async function recordPayment() {
    setPaySubmitting(true);
    setPayMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("payments").insert({
        student_user_id: payForm.studentId,
        course_id: parseInt(payForm.courseId),
        amount: parseFloat(payForm.amount),
        status: payForm.status,
        description: payForm.description || null,
        payment_date: new Date().toISOString(),
      });
      if (error) throw error;
      setPayMsg({ type: "ok", text: "Payment recorded!" });
      setShowPayForm(false);
      setPayForm({
        studentId: "",
        courseId: "",
        amount: "",
        description: "",
        status: "paid",
      });
      load();
    } catch {
      setPayMsg({ type: "err", text: "Failed to record payment." });
    } finally {
      setPaySubmitting(false);
    }
  }

  const filteredStudents = students.filter(
    (s) =>
      !search ||
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.enrollment_no ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const filteredFaculty = faculty.filter(
    (f) => !search || f.full_name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredPayments = payments.filter(
    (p) =>
      !search ||
      p.student_name.toLowerCase().includes(search.toLowerCase()) ||
      p.course_title.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredAttendance = attendance.filter(
    (a) =>
      !search ||
      a.student_name.toLowerCase().includes(search.toLowerCase()) ||
      a.session_title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-600 text-white rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );

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
              <p className="text-base font-bold text-amber-700 sm:text-lg leading-tight">
                LePearl Education
              </p>
              <p className="text-[10px] leading-tight text-slate-600 sm:text-xs">
                Admin Control Panel
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
          <aside className="bg-amber-50 border border-amber-100 rounded-2xl p-4 h-fit lg:sticky lg:top-24">
            <div className="pb-4 border-b border-amber-100">
              <p className="text-lg font-bold text-gray-900">Admin</p>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                Full platform control
              </p>
            </div>
            <nav className="mt-4 space-y-1.5">
              <SideBtn
                s="overview"
                active={activeSection}
                onClick={setActiveSection}
                icon={LayoutDashboard}
                label="Overview"
              />
              <SideBtn
                s="students"
                active={activeSection}
                onClick={setActiveSection}
                icon={Users}
                label={`Students (${totalStudents})`}
              />
              <SideBtn
                s="faculty"
                active={activeSection}
                onClick={setActiveSection}
                icon={Users}
                label={`Faculty (${totalFaculty})`}
              />
              <SideBtn
                s="attendance"
                active={activeSection}
                onClick={setActiveSection}
                icon={Calendar}
                label="Attendance"
              />
              <SideBtn
                s="payments"
                active={activeSection}
                onClick={setActiveSection}
                icon={CreditCard}
                label="Payments"
              />
              <SideBtn
                s="courses"
                active={activeSection}
                onClick={setActiveSection}
                icon={BookOpen}
                label="Courses & Batches"
              />
              <SideBtn
                s="mcq"
                active={activeSection}
                onClick={setActiveSection}
                icon={FileQuestion}
                label={`MCQ Tests (${totalTests})`}
              />
              <SideBtn
                s="registrations"
                active={activeSection}
                onClick={setActiveSection}
                icon={Bell}
                label={`New Registrations (${registrations.length})`}
              />
            </nav>
          </aside>

          {/* main content */}
          <section className="space-y-6 min-w-0">
            {/* search bar for data sections */}
            {activeSection !== "overview" && (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

            {/* ══ OVERVIEW ══════════════════════════════════ */}
            {activeSection === "overview" && (
              <>
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
                  <h1 className="text-2xl font-bold mb-0.5">Admin Dashboard</h1>
                  <p className="text-amber-200 text-sm">
                    Complete platform overview - LePearl Education
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Students"
                    value={totalStudents}
                    icon={Users}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                  />
                  <StatCard
                    label="Total Faculty"
                    value={totalFaculty}
                    icon={Users}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                  />
                  <StatCard
                    label="Active Batches"
                    value={totalBatches}
                    icon={BookOpen}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                  />
                  <StatCard
                    label="Total Revenue"
                    value={fmtCurrency(totalRevenue)}
                    icon={CreditCard}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                    sub="Paid payments"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <StatCard
                    label="MCQ Tests"
                    value={totalTests}
                    icon={FileQuestion}
                    iconBg="bg-violet-100"
                    iconColor="text-violet-600"
                  />
                  <StatCard
                    label="Attendance Records"
                    value={attendance.length}
                    icon={Calendar}
                    iconBg="bg-teal-100"
                    iconColor="text-teal-600"
                    sub="Last 100 records"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <StatCard
                    label="Live Classes"
                    value={totalLiveClasses}
                    icon={Video}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                    sub={`${liveClasses.filter((c) => c.is_live).length} live now`}
                  />
                </div>
                {/* quick tables */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-900">
                        Recent Students
                      </h2>
                      <button
                        onClick={() => setActiveSection("students")}
                        className="text-xs text-amber-600 font-semibold flex items-center gap-1 hover:underline"
                      >
                        View all <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {students.slice(0, 5).map((s) => (
                        <div
                          key={s.user_id}
                          className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                              {s.full_name.charAt(0)}
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {s.full_name}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {fmtDate(s.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-900">
                        Recent Payments
                      </h2>
                      <button
                        onClick={() => setActiveSection("payments")}
                        className="text-xs text-amber-600 font-semibold flex items-center gap-1 hover:underline"
                      >
                        View all <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {payments.slice(0, 5).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {p.student_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {p.course_title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600">
                              {fmtCurrency(p.amount)}
                            </p>
                            <Badge
                              text={p.status}
                              color={
                                p.status === "paid" || p.status === "completed"
                                  ? "green"
                                  : p.status === "pending"
                                    ? "yellow"
                                    : "red"
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900">
                      Recent Live Class Details
                    </h2>
                    <span className="text-xs text-gray-400">
                      Last 10 classes
                    </span>
                  </div>
                  {liveClasses.length === 0 ? (
                    <p className="text-sm text-gray-500 py-6 text-center">
                      No class sessions available.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {liveClasses.slice(0, 10).map((c) => (
                        <div
                          key={c.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${c.is_live ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {c.title}
                              </p>
                              {c.is_live && (
                                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full">
                                  LIVE
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {fmtDate(c.session_date)} | {c.batch_name} |
                              Faculty: {c.faculty_name}
                            </p>
                          </div>
                          {c.meeting_link && (
                            <a
                              href={c.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Link
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ══ STUDENTS ══════════════════════════════════ */}
            {activeSection === "students" && (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    Students ({filteredStudents.length})
                  </h1>
                  <p className="text-blue-100 text-sm">
                    All enrolled students across all batches
                  </p>
                </div>
                {selectedStudent ? (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900 text-lg">
                        {selectedStudent.full_name}
                      </h2>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Enrollment No.</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.enrollment_no ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.phone ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="font-semibold text-gray-900">
                          {fmtDate(selectedStudent.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">User ID</p>
                        <p className="font-mono text-xs text-gray-500 break-all">
                          {selectedStudent.user_id}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              #
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Name
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Enrollment No.
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Phone
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Joined
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredStudents.map((s, i) => (
                            <tr key={s.user_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-500">
                                {i + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                                    {s.full_name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    {s.full_name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {s.enrollment_no ?? "-"}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {s.phone ?? "-"}
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {fmtDate(s.created_at)}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => setSelectedStudent(s)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredStudents.length === 0 && (
                        <p className="text-center py-8 text-sm text-gray-400">
                          No students found.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ══ FACULTY ═══════════════════════════════════ */}
            {activeSection === "faculty" && (
              <>
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    Faculty ({filteredFaculty.length})
                  </h1>
                  <p className="text-purple-100 text-sm">
                    All faculty members and their batch assignments
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            #
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Name
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Phone
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredFaculty.map((f, i) => (
                          <tr key={f.user_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">
                                  {f.full_name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">
                                  {f.full_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {f.phone ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {fmtDate(f.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredFaculty.length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-400">
                        No faculty found.
                      </p>
                    )}
                  </div>
                </div>

                {/* batches per faculty */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-3">All Batches</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {batches.map((b) => (
                      <div
                        key={b.id}
                        className="bg-purple-50 rounded-xl p-4 border border-purple-100"
                      >
                        <p className="font-bold text-purple-800 text-sm">
                          {b.batch_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {b.course_title}
                        </p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>Faculty: {b.faculty_name}</span>
                          <span>{b.student_count} students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ ATTENDANCE ════════════════════════════════ */}
            {activeSection === "attendance" && (
              <>
                <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">Attendance Records</h1>
                  <p className="text-teal-100 text-sm">
                    All attendance records across all sessions (
                    {attendance.length} total)
                  </p>
                </div>
                {/* stats */}
                <div className="grid grid-cols-3 gap-4">
                  {(["present", "late", "absent"] as const).map((st) => {
                    const count = attendance.filter(
                      (a) => a.status === st,
                    ).length;
                    const colors = {
                      present: "bg-green-100 text-green-700",
                      late: "bg-amber-100 text-amber-700",
                      absent: "bg-red-100 text-red-700",
                    };
                    return (
                      <div
                        key={st}
                        className={`rounded-2xl p-4 ${colors[st]} text-center`}
                      >
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs font-semibold capitalize">{st}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Student
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Session
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Batch
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Date
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredAttendance.slice(0, 50).map((a) => (
                          <tr key={a.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {a.student_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {a.session_title}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {a.batch_name}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {fmtDate(a.session_date)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                text={a.status}
                                color={
                                  a.status === "present"
                                    ? "green"
                                    : a.status === "late"
                                      ? "yellow"
                                      : "red"
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredAttendance.length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-400">
                        No attendance records.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ══ PAYMENTS ══════════════════════════════════ */}
            {activeSection === "payments" && (
              <>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">Payment Records</h1>
                  <p className="text-emerald-100 text-sm">
                    Total Revenue: {fmtCurrency(totalRevenue)} |{" "}
                    {payments.length} records
                  </p>
                </div>

                {payMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${payMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {payMsg.type === "ok" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {payMsg.text}
                  </div>
                )}

                {showPayForm ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-emerald-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">
                        Record Manual Payment
                      </h2>
                      <button
                        onClick={() => setShowPayForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Student
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={payForm.studentId}
                          onChange={(e) =>
                            setPayForm((p) => ({
                              ...p,
                              studentId: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select student</option>
                          {allStudentsSimple.map((s) => (
                            <option key={s.user_id} value={s.user_id}>
                              {s.full_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Course
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={payForm.courseId}
                          onChange={(e) =>
                            setPayForm((p) => ({
                              ...p,
                              courseId: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select course</option>
                          {allCoursesSimple.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Amount (INR)
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={payForm.amount}
                          onChange={(e) =>
                            setPayForm((p) => ({
                              ...p,
                              amount: e.target.value,
                            }))
                          }
                          placeholder="e.g., 5000"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Status
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={payForm.status}
                          onChange={(e) =>
                            setPayForm((p) => ({
                              ...p,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Description
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          value={payForm.description}
                          onChange={(e) =>
                            setPayForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          placeholder="e.g., Installment 1"
                        />
                      </div>
                    </div>
                    <button
                      onClick={recordPayment}
                      disabled={
                        paySubmitting ||
                        !payForm.studentId ||
                        !payForm.courseId ||
                        !payForm.amount
                      }
                      className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60"
                    >
                      {paySubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Record Payment
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPayForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4" /> Record Manual Payment
                  </button>
                )}

                <div className="grid grid-cols-3 gap-4">
                  {(["paid", "pending", "failed"] as const).map((st) => {
                    const total = payments
                      .filter((p) => p.status === st)
                      .reduce((s, p) => s + p.amount, 0);
                    const colors = {
                      paid: "bg-green-100 text-green-700",
                      pending: "bg-amber-100 text-amber-700",
                      failed: "bg-red-100 text-red-700",
                    };
                    return (
                      <div
                        key={st}
                        className={`rounded-2xl p-4 ${colors[st]} text-center`}
                      >
                        <p className="text-lg font-bold">
                          {fmtCurrency(total)}
                        </p>
                        <p className="text-xs font-semibold capitalize">{st}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Student
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Course
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Amount
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Date
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Status
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {p.student_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {p.course_title}
                            </td>
                            <td className="px-4 py-3 font-bold text-emerald-700">
                              {fmtCurrency(p.amount)}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {fmtDate(p.payment_date)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                text={p.status}
                                color={
                                  p.status === "paid" ||
                                  p.status === "completed"
                                    ? "green"
                                    : p.status === "pending"
                                      ? "yellow"
                                      : "red"
                                }
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                              {p.description ?? "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredPayments.length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-400">
                        No payment records.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ══ COURSES & BATCHES ═════════════════════════ */}
            {activeSection === "courses" && (
              <>
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">Courses & Batches</h1>
                  <p className="text-indigo-100 text-sm">
                    {courses.length} courses · {batches.length} batches
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-3">All Courses</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {courses.map((c) => (
                      <div
                        key={c.id}
                        className="bg-indigo-50 rounded-xl p-4 border border-indigo-100"
                      >
                        <p className="font-bold text-indigo-800">{c.title}</p>
                        {c.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {c.description}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          {c.duration_weeks && (
                            <span>
                              <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                              {c.duration_weeks} weeks
                            </span>
                          )}
                          <span>
                            <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                            {c.batch_count} batches
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">All Batches</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Batch Name
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Course
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Faculty
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Students
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Start → End
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {batches.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {b.batch_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {b.course_title}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {b.faculty_name}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                text={`${b.student_count} enrolled`}
                                color="blue"
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                              {fmtDate(b.start_date)} → {fmtDate(b.end_date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ══ MCQ TESTS ═════════════════════════════════ */}
            {activeSection === "mcq" && (
              <>
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    MCQ Tests & Results
                  </h1>
                  <p className="text-violet-100 text-sm">
                    {mcqTests.length} tests created across all faculty
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Test Title
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Batch
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Total Marks
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Type
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Attempts
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {mcqTests.map((t) => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {t.title}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {t.batch_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {t.total_marks}
                            </td>
                            <td className="px-4 py-3">
                              <Badge text={t.exam_type} color="blue" />
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {t.attempt_count}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                text={t.is_published ? "Published" : "Draft"}
                                color={t.is_published ? "green" : "gray"}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {mcqTests.length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-400">
                        No MCQ tests created yet.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeSection === "registrations" && (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    New Student Registrations
                  </h1>
                  <p className="text-blue-100 text-sm">
                    {registrations.length} new enrollment requests submitted
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Name
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Qualification
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Course
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Phone
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Email
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Submitted
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {registrations
                          .filter((r) =>
                            search
                              ? r.full_name
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) ||
                                r.email
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) ||
                                r.phone.includes(search) ||
                                r.course
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              : true,
                          )
                          .map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {r.full_name}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {r.qualification}
                              </td>
                              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                {r.course}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {r.phone}
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs">
                                <a
                                  href={`mailto:${r.email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {r.email}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs">
                                {fmtDate(r.created_at)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  text={r.status || "pending"}
                                  color="yellow"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {registrations.length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-400">
                        No student registrations yet.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
