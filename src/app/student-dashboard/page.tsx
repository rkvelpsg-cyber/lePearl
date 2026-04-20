"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

/* ── types ─────────────────────────────────────────────────── */
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
  batches: {
    batch_name: string;
    courses: { title: string } | null;
  } | null;
};
type AttendanceStat = { total: number; present: number };
type MockStat = { scored: number; total: number };
type QueryIssue = {
  query: string;
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};
type EnrollmentCourse = {
  batch_id: number;
  batches: {
    batch_name: string;
    courses: { id: number; title: string } | null;
  } | null;
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function pct(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}
function fmt(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
function fmtDate(s: string | null) {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── StatCard ───────────────────────────────────────────────── */
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

/* ── ProgressBar ────────────────────────────────────────────── */
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

/* ── Page ───────────────────────────────────────────────────── */
export default function StudentDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feePlan, setFeePlan] = useState<FeePlan | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassSession[]>([]);
  const [attendanceStat, setAttendanceStat] = useState<AttendanceStat>({
    total: 0,
    present: 0,
  });
  const [mockStat, setMockStat] = useState<MockStat>({ scored: 0, total: 0 });
  const [queryIssues, setQueryIssues] = useState<QueryIssue[]>([]);
  const [batchLabel, setBatchLabel] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
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
          studentProfileRes,
          coursesRes,
          enrollmentsRes,
          paymentsRes,
          feePlanRes,
          classesRes,
          attendanceRes,
          mockRes,
        ] = await Promise.all([
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
            .from("student_course_progress")
            .select(
              "course_id, instructor_name, duration_label, exam_label, progress_percent, courses(title)",
            )
            .eq("student_user_id", uid),

          supabase
            .from("enrollments")
            .select("batch_id, batches(batch_name, courses(id, title))")
            .eq("student_user_id", uid),

          supabase
            .from("payments")
            .select("id, amount, payment_date, payment_mode, status")
            .eq("student_user_id", uid)
            .order("payment_date", { ascending: false })
            .limit(5),

          supabase
            .from("student_fee_plans")
            .select("total_fee, next_due_amount, next_due_date")
            .eq("student_user_id", uid)
            .single(),

          supabase
            .from("class_sessions")
            .select(
              "id, title, session_date, start_time, end_time, meeting_link, batches(batch_name, courses(title))",
            )
            .gte("session_date", new Date().toISOString().split("T")[0])
            .order("session_date", { ascending: true })
            .limit(6),

          supabase
            .from("student_attendance")
            .select("status")
            .eq("student_user_id", uid),

          supabase
            .from("mock_test_attempts")
            .select("scored_marks, mock_tests(total_marks)")
            .eq("student_user_id", uid),
        ]);

        const queryResults = [
          { name: "profiles", error: profileRes.error },
          { name: "student_profiles", error: studentProfileRes.error },
          { name: "student_course_progress", error: coursesRes.error },
          { name: "enrollments", error: enrollmentsRes.error },
          { name: "payments", error: paymentsRes.error },
          { name: "student_fee_plans", error: feePlanRes.error },
          { name: "class_sessions", error: classesRes.error },
          { name: "student_attendance", error: attendanceRes.error },
          { name: "mock_test_attempts", error: mockRes.error },
        ];

        const issues = queryResults
          .filter((q) => Boolean(q.error))
          .map((q) => ({
            query: q.name,
            code: q.error?.code,
            message: q.error?.message ?? "Unknown query error",
            details: q.error?.details,
            hint: q.error?.hint,
          }));

        setQueryIssues(issues);
        if (issues.length > 0) {
          console.warn("Dashboard query issues:", issues);
        }

        if (profileRes.data) setProfile(profileRes.data as Profile);
        if (studentProfileRes.data)
          setStudentProfile(studentProfileRes.data as StudentProfile);

        const courseProgressRows =
          (coursesRes.data as unknown as CourseProgress[] | null) ?? [];
        const enrollmentRows =
          (enrollmentsRes.data as unknown as EnrollmentCourse[] | null) ?? [];

        if (enrollmentRows.length > 0) {
          const firstBatch = unwrapOne(enrollmentRows[0]?.batches) as {
            batch_name: string;
          } | null;
          if (firstBatch?.batch_name) {
            setBatchLabel(firstBatch.batch_name);
          }
        }

        if (courseProgressRows.length > 0) {
          setCourses(courseProgressRows);
        } else if (enrollmentRows.length > 0) {
          const fallbackCourses = Array.from(
            new Map(
              enrollmentRows.map((row) => {
                const course = unwrapOne(unwrapOne(row.batches)?.courses) as {
                  id: number;
                  title: string;
                } | null;
                return [
                  course?.id ?? row.batch_id,
                  {
                    course_id: course?.id ?? row.batch_id,
                    instructor_name: null,
                    duration_label: null,
                    exam_label: null,
                    progress_percent: 0,
                    courses: course
                      ? { title: course.title }
                      : { title: "Course" },
                  } as CourseProgress,
                ];
              }),
            ).values(),
          );

          setCourses(fallbackCourses);
        }

        if (paymentsRes.data) setPayments(paymentsRes.data as Payment[]);
        if (feePlanRes.data) setFeePlan(feePlanRes.data as FeePlan);
        if (classesRes.data)
          setUpcomingClasses(classesRes.data as unknown as ClassSession[]);

        if (attendanceRes.data) {
          const total = attendanceRes.data.length;
          const present = attendanceRes.data.filter(
            (a) => a.status === "present",
          ).length;
          setAttendanceStat({ total, present });
        }

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
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  const paidAmount = payments.reduce(
    (s, p) => (p.status === "paid" ? s + p.amount : s),
    0,
  );
  const attendancePct = pct(attendanceStat.present, attendanceStat.total);
  const avgScore = pct(mockStat.scored, mockStat.total);
  const overallProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((s, c) => s + c.progress_percent, 0) / courses.length,
        )
      : 0;

  /* ── render ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <Image
                src="/LePearl_Logo_Canva_1.png"
                alt="LePearl"
                width={28}
                height={28}
                className="rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className="text-base font-bold text-gray-900">
              LePearl Education
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-purple-50 border border-purple-100 rounded-2xl p-4 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-purple-100">
              <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
                {profile?.full_name?.charAt(0) ?? "S"}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-tight">
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
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white text-purple-700 font-semibold shadow-sm border border-purple-100">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white hover:shadow-sm transition-colors">
                <BookOpen className="w-4 h-4" />
                My Course
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white hover:shadow-sm transition-colors">
                <CreditCard className="w-4 h-4" />
                Fees & Payments
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white hover:shadow-sm transition-colors">
                <BarChart2 className="w-4 h-4" />
                Performance
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white hover:shadow-sm transition-colors">
                <Calendar className="w-4 h-4" />
                Attendance
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white hover:shadow-sm transition-colors">
                <Video className="w-4 h-4" />
                Live Class
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white hover:shadow-sm transition-colors">
                <PlayCircle className="w-4 h-4" />
                Recorder Classes
              </button>
            </nav>
          </aside>

          <section className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-0.5">
                Welcome back, {profile?.full_name?.split(" ")[0] ?? "Student"}!
              </h1>
              <p className="text-purple-200 text-sm">
                Here&apos;s what&apos;s happening with your learning journey
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Enrolled Courses"
                value={courses.length}
                icon={BookOpen}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
              />
              <StatCard
                label="Attendance"
                value={attendanceStat.total > 0 ? `${attendancePct}%` : "—"}
                icon={Calendar}
                iconBg="bg-green-100"
                iconColor="text-green-600"
              />
              <StatCard
                label="Avg. Score"
                value={mockStat.total > 0 ? `${avgScore}%` : "—"}
                icon={BarChart2}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
              <StatCard
                label="Overall Progress"
                value={courses.length > 0 ? `${overallProgress}%` : "—"}
                icon={TrendingUp}
                iconBg="bg-orange-100"
                iconColor="text-orange-500"
              />
            </div>

            {queryIssues.length > 0 && (
              <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">
                  Some dashboard sections could not load
                </h3>
                <div className="space-y-1.5">
                  {queryIssues.map((issue) => (
                    <p
                      key={`${issue.query}-${issue.code ?? "na"}`}
                      className="text-xs text-amber-700"
                    >
                      <span className="font-semibold">{issue.query}</span>:{" "}
                      {issue.message}
                      {issue.code ? ` (code: ${issue.code})` : ""}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {courses.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Current Courses
                </h2>
                <div className="space-y-5">
                  {courses.map((c) => (
                    <div key={c.course_id}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {c.courses?.title ?? "Course"}
                          </p>
                          {c.instructor_name && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              Instructor: {c.instructor_name}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-purple-600 whitespace-nowrap">
                          {c.progress_percent}%
                        </span>
                      </div>
                      <ProgressBar pct={c.progress_percent} />
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        {c.duration_label && (
                          <span>Duration: {c.duration_label}</span>
                        )}
                        {c.exam_label && <span>Exam: {c.exam_label}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {feePlan && (
              <section className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Fee Status
                </h2>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-500">Total Fee</span>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-900 font-semibold">
                      ₹{fmt(feePlan.total_fee)}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Paid</p>
                      <p className="font-bold text-green-600">
                        ₹{fmt(paidAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {feePlan.next_due_amount > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Pending Payment
                    </div>
                    <p className="text-orange-600 text-sm font-medium">
                      ₹{fmt(feePlan.next_due_amount)} due by{" "}
                      {fmtDate(feePlan.next_due_date)}
                    </p>
                    <button className="w-fit px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
                      Pay Now
                    </button>
                  </div>
                )}

                {payments.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-3">
                      Recent Payments
                    </h3>
                    <div className="space-y-3">
                      {payments.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {fmtDate(p.payment_date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.payment_mode ?? "Online"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ₹{fmt(p.amount)}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                p.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {p.status === "paid" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {p.status === "paid" ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {upcomingClasses.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Upcoming Live Classes
                  </h2>
                  <Video className="w-5 h-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                    >
                      <p className="font-semibold text-gray-900 text-sm leading-snug">
                        {cls.title}
                      </p>
                      {cls.batches?.courses?.title && (
                        <p className="text-xs text-purple-600 font-medium mt-0.5">
                          {cls.batches.courses.title}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {fmtDate(cls.session_date)}
                        {cls.start_time && cls.end_time
                          ? ` · ${cls.start_time.slice(0, 5)} – ${cls.end_time.slice(0, 5)}`
                          : ""}
                      </p>
                      {cls.meeting_link ? (
                        <a
                          href={cls.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 block w-full text-center py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Join Class
                        </a>
                      ) : (
                        <button
                          disabled
                          className="mt-3 block w-full text-center py-2 bg-gray-200 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed"
                        >
                          Link Pending
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {courses.length === 0 &&
              !feePlan &&
              upcomingClasses.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <BookOpen className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    No data yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your courses, fees, and classes will appear here once
                    enrolled.
                  </p>
                </div>
              )}

            <div className="flex items-center justify-center gap-2 pb-4 text-xs text-gray-400">
              <CreditCard className="w-4 h-4" />
              <span>Secured &middot; LePearl Education Platform</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
