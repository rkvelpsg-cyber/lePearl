"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/supabase/auth";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { formatDateIST } from "@/lib/timezone";
import { studentRegistrationCourses } from "@/lib/studentRegistration";
import {
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CalendarDays,
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
  Download,
  ChevronDown,
  Trash2,
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
  registration_no: string | null;
  email: string | null;
  username: string | null;
  enrollment_no: string | null;
  created_at: string;
  enrollments?: {
    batch_name: string;
    course_title: string;
    faculty_name: string;
  }[];
};
type FacultyRow = {
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  username: string | null;
  created_at: string;
  batchCount: number;
};
type AttendanceRow = {
  id: number;
  session_id: number;
  student_user_id: string;
  status: "present" | "absent" | "late";
  marked_at: string;
  student_name: string;
  registration_no: string;
  course_name: string;
  session_title: string;
  session_date: string;
  batch_name: string;
};
type PaymentRow = {
  id: number;
  student_user_id: string;
  amount: number;
  status: string;
  payment_date: string | null;
  payment_mode: string | null;
  razorpay_payment_id: string | null;
  description: string | null;
  student_name: string;
  course_title: string;
};
type StudentFeeDetailRow = {
  student_user_id: string;
  student_name: string;
  registration_no: string | null;
  course_name: string | null;
  total_fee: number;
  total_paid: number;
  pending_amount: number;
  next_due_amount: number;
  next_due_date: string | null;
};
type FacultyAttendanceRow = {
  id: number;
  faculty_user_id: string;
  faculty_name: string;
  phone: string | null;
  attendance_date: string;
  status: "present" | "absent" | "leave";
  notes: string | null;
  marked_at: string;
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

type StudentEditForm = {
  registrationNo: string;
  phone: string;
  courseName: string;
  studentName: string;
  facultyName: string;
  studentEmail: string;
  username: string;
  password: string;
};

type FacultyManageForm = {
  facultyUserId: string;
  facultyName: string;
  phone: string;
  facultyEmail: string;
  username: string;
  defaultPassword: string;
};

const adminFacultyOptions = [
  "Ms Sadhana",
  "Ms Neelu Patel",
  "Dr Babli Mallick",
  "Dr Harendra K Tripathi",
  "Dr. Prem Shankar Pandey",
] as const;

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
  const [studentFeeDetails, setStudentFeeDetails] = useState<
    StudentFeeDetailRow[]
  >([]);
  const [overallFeeSummary, setOverallFeeSummary] = useState({
    totalFee: 0,
    totalPaid: 0,
    totalPending: 0,
  });
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [mcqTests, setMcqTests] = useState<McqRow[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClassRow[]>([]);
  const [credentialSubmitting, setCredentialSubmitting] = useState(false);
  const [credentialMsg, setCredentialMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [credentialForm, setCredentialForm] = useState({
    registrationId: "",
    courseName: "",
    registrationNumber: "",
    studentName: "",
    facultyName: "",
    studentEmail: "",
    studentPhone: "",
    username: "",
    defaultPassword: "LePearl@123",
  });

  /* registrations filters */
  const [regDateFrom, setRegDateFrom] = useState("");
  const [regDateTo, setRegDateTo] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

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

  /* faculty manage + attendance */
  const [facultyManageMode, setFacultyManageMode] = useState<
    "create" | "update"
  >("create");
  const [facultyManageForm, setFacultyManageForm] = useState<FacultyManageForm>(
    {
      facultyUserId: "",
      facultyName: "",
      phone: "",
      facultyEmail: "",
      username: "",
      defaultPassword: "Faculty@123",
    },
  );
  const [facultyManageMsg, setFacultyManageMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [facultyManageLoading, setFacultyManageLoading] = useState(false);
  const [facultyManageAction, setFacultyManageAction] = useState<
    "save" | "remove" | null
  >(null);

  const [facultyAttendanceRows, setFacultyAttendanceRows] = useState<
    FacultyAttendanceRow[]
  >([]);
  const [attendanceRange, setAttendanceRange] = useState<
    "daily" | "weekly" | "monthly" | "yearly" | "custom"
  >("daily");
  const [attendanceView, setAttendanceView] = useState<
    "all" | "student" | "faculty"
  >("all");
  const [attendanceFrom, setAttendanceFrom] = useState("");
  const [attendanceTo, setAttendanceTo] = useState("");
  const [attendanceEditForm, setAttendanceEditForm] = useState({
    facultyUserId: "",
    attendanceDate: new Date().toISOString().slice(0, 10),
    status: "present" as "present" | "absent" | "leave",
    notes: "",
  });
  const [studentAttendanceEditForm, setStudentAttendanceEditForm] = useState({
    studentUserId: "",
    sessionId: "",
    status: "present" as "present" | "absent" | "late",
  });
  const [studentAttendanceMsg, setStudentAttendanceMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [studentAttendanceLoading, setStudentAttendanceLoading] =
    useState(false);
  const [facultyAttendanceMsg, setFacultyAttendanceMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [facultyAttendanceLoading, setFacultyAttendanceLoading] =
    useState(false);

  /* selected student detail */
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null,
  );
  const [studentEditForm, setStudentEditForm] = useState<StudentEditForm>({
    registrationNo: "",
    phone: "",
    courseName: "",
    studentName: "",
    facultyName: "",
    studentEmail: "",
    username: "",
    password: "",
  });
  const [studentActionMsg, setStudentActionMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [studentActionLoading, setStudentActionLoading] = useState(false);

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
        facultyAttendanceRes,
        paymentsRes,
        feePlansRes,
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
          .select(
            "user_id, full_name, phone, email, username, registration_no, created_at",
          )
          .eq("role", "faculty"),
        supabase
          .from("student_attendance")
          .select(
            "id, session_id, student_user_id, status, marked_at, class_sessions(id, title, session_date, batches(batch_name, courses(title))), student_profiles(registration_no, profiles(full_name))",
          )
          .order("marked_at", { ascending: false })
          .limit(100),
        supabase
          .from("faculty_attendance")
          .select(
            "id, faculty_user_id, attendance_date, status, notes, marked_at",
          )
          .order("attendance_date", { ascending: false })
          .limit(500),
        supabase
          .from("payments")
          .select(
            "id, student_user_id, amount, status, payment_date, payment_mode, razorpay_payment_id, description, student_profiles(profiles(full_name)), courses(title)",
          )
          .order("payment_date", { ascending: false })
          .limit(100),
        supabase
          .from("student_fee_plans")
          .select(
            "student_user_id, total_fee, next_due_amount, next_due_date, student_profiles(registration_no, target_exam, profiles(full_name))",
          ),
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
                .select(
                  "user_id, full_name, phone, email, username, registration_no",
                )
                .in("user_id", studentIds)
            : Promise.resolve({ data: [], error: null }),
          batchIds.length > 0
            ? supabase
                .from("batches")
                .select("id, batch_name, courses(title), profiles(full_name)")
                .in("id", batchIds)
            : Promise.resolve({ data: [], error: null }),
          studentIds.length > 0
            ? supabase
                .from("student_profiles")
                .select("user_id, registration_no, enrollment_no")
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
          {
            full_name: string;
            phone: string | null;
            email: string | null;
            username: string | null;
            registration_no: string | null;
          }
        >();
        (
          profileNamesData as unknown as
            | {
                user_id: string;
                full_name: string;
                phone: string | null;
                email: string | null;
                username: string | null;
                registration_no: string | null;
              }[]
            | null
        )?.forEach((p) => {
          namesById.set(p.user_id, {
            full_name: p.full_name,
            phone: p.phone,
            email: p.email,
            username: p.username,
            registration_no: p.registration_no,
          });
        });

        const registrationNoById = new Map<string, string>();
        (
          studentProfilesData as unknown as
            | {
                user_id: string;
                registration_no: string | null;
                enrollment_no: string | null;
              }[]
            | null
        )?.forEach((sp) => {
          if (sp.registration_no)
            registrationNoById.set(sp.user_id, sp.registration_no);
        });

        const batchById = new Map<
          number,
          { batch_name: string; course_title: string; faculty_name: string }
        >();
        (
          batchesLookupData as unknown as
            | {
                id: number;
                batch_name: string;
                courses: { title: string } | { title: string }[] | null;
                profiles: { full_name: string } | null;
              }[]
            | null
        )?.forEach((b) => {
          batchById.set(b.id, {
            batch_name: b.batch_name,
            course_title: unwrapOne(b.courses)?.title ?? "Unassigned Course",
            faculty_name:
              unwrapOne(b.profiles)?.full_name ?? "Unassigned Faculty",
          });
        });

        const mapByStudent = new Map<string, StudentRow>();
        enrollRows.forEach((row) => {
          const studentId = row.student_user_id;

          const batchInfo = batchById.get(row.batch_id) ?? {
            batch_name: "Unknown Batch",
            course_title: "Unassigned Course",
            faculty_name: "Unassigned Faculty",
          };

          const existing = mapByStudent.get(studentId);
          const enrollmentInfo = {
            batch_name: batchInfo.batch_name,
            course_title: batchInfo.course_title,
            faculty_name: batchInfo.faculty_name,
          };

          if (!existing) {
            const profileName = namesById.get(studentId);
            mapByStudent.set(studentId, {
              user_id: studentId,
              email: profileName?.email ?? null,
              username: profileName?.username ?? null,
              registration_no:
                profileName?.registration_no ||
                registrationNoById.get(studentId) ||
                null,
              enrollment_no: null,
              full_name: profileName?.full_name ?? "Unknown",
              phone: profileName?.phone ?? null,
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
          email: string | null;
          username: string | null;
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
        setFaculty(fRows.map((f) => ({ ...f, batchCount: 0 })));
        setTotalFaculty(fRows.length);
      }

      /* attendance */
      if (attendanceRes.data) {
        const rows: AttendanceRow[] = (
          attendanceRes.data as unknown as {
            id: number;
            session_id: number;
            student_user_id: string;
            status: "present" | "absent" | "late";
            marked_at: string;
            class_sessions: {
              id: number;
              title: string;
              session_date: string;
              batches: {
                batch_name: string;
                courses: { title: string } | null;
              } | null;
            } | null;
            student_profiles: {
              registration_no: string | null;
              profiles: { full_name: string } | null;
            } | null;
          }[]
        ).map((a) => {
          const classSession = unwrapOne(a.class_sessions);
          const batch =
            unwrapOne(
              classSession?.batches as {
                batch_name: string;
                courses: { title: string } | null;
              } | null,
            ) ?? null;

          return {
            id: a.id,
            session_id: a.session_id,
            student_user_id: a.student_user_id,
            status: a.status,
            marked_at: a.marked_at,
            student_name:
              unwrapOne(a.student_profiles)?.profiles?.full_name ?? "Student",
            registration_no:
              unwrapOne(a.student_profiles)?.registration_no ?? "-",
            course_name: batch?.courses?.title ?? "-",
            session_title: classSession?.title ?? "-",
            session_date: classSession?.session_date ?? "",
            batch_name: batch?.batch_name ?? "-",
          };
        });
        setAttendance(rows);
      }

      if (facultyAttendanceRes.error) {
        console.warn(
          "Failed to load faculty attendance:",
          facultyAttendanceRes.error,
        );
      }
      if (facultyAttendanceRes.data) {
        const rows = facultyAttendanceRes.data as unknown as {
          id: number;
          faculty_user_id: string;
          attendance_date: string;
          status: "present" | "absent" | "leave";
          notes: string | null;
          marked_at: string;
        }[];

        const facultyIds = [...new Set(rows.map((row) => row.faculty_user_id))];
        const { data: facultyProfilesData } =
          facultyIds.length > 0
            ? await supabase
                .from("profiles")
                .select("user_id, full_name, phone")
                .in("user_id", facultyIds)
            : { data: [] };

        const facultyProfileById = new Map<
          string,
          { full_name: string | null; phone: string | null }
        >();
        (
          facultyProfilesData as
            | {
                user_id: string;
                full_name: string | null;
                phone: string | null;
              }[]
            | null
        )?.forEach((profile) => {
          facultyProfileById.set(profile.user_id, {
            full_name: profile.full_name,
            phone: profile.phone,
          });
        });

        setFacultyAttendanceRows(
          rows.map((row) => {
            const profile = facultyProfileById.get(row.faculty_user_id);
            return {
              id: row.id,
              faculty_user_id: row.faculty_user_id,
              faculty_name: profile?.full_name || "Faculty",
              phone: profile?.phone || null,
              attendance_date: row.attendance_date,
              status: row.status,
              notes: row.notes,
              marked_at: row.marked_at,
            } as FacultyAttendanceRow;
          }),
        );
      } else {
        setFacultyAttendanceRows([]);
      }

      /* payments */
      let paidByStudentId = new Map<string, number>();
      if (paymentsRes.data) {
        let rev = 0;
        const rows: PaymentRow[] = (
          paymentsRes.data as unknown as {
            id: number;
            student_user_id: string;
            amount: number;
            status: string;
            payment_date: string | null;
            payment_mode: string | null;
            razorpay_payment_id: string | null;
            description: string | null;
            student_profiles: { profiles: { full_name: string } | null } | null;
            courses: { title: string } | null;
          }[]
        ).map((p) => {
          const normalizedStatus = (p.status || "").toLowerCase();
          if (normalizedStatus === "paid" || normalizedStatus === "completed") {
            rev += p.amount ?? 0;
            paidByStudentId.set(
              p.student_user_id,
              (paidByStudentId.get(p.student_user_id) ?? 0) + (p.amount ?? 0),
            );
          }
          return {
            id: p.id,
            student_user_id: p.student_user_id,
            amount: p.amount,
            status: p.status,
            payment_date: p.payment_date,
            payment_mode: p.payment_mode,
            razorpay_payment_id: p.razorpay_payment_id,
            description: p.description,
            student_name:
              unwrapOne(p.student_profiles)?.profiles?.full_name ?? "Student",
            course_title: unwrapOne(p.courses)?.title ?? "-",
          };
        });
        setPayments(rows);
        setTotalRevenue(rev);
      }

      if (feePlansRes.error) {
        console.error("Failed to load student fee plans:", feePlansRes.error);
      }
      if (feePlansRes.data) {
        const feeRows = feePlansRes.data as unknown as {
          student_user_id: string;
          total_fee: number;
          next_due_amount: number;
          next_due_date: string | null;
          student_profiles:
            | {
                registration_no: string | null;
                target_exam: string | null;
                profiles: { full_name: string } | null;
              }
            | {
                registration_no: string | null;
                target_exam: string | null;
                profiles: { full_name: string } | null;
              }[]
            | null;
        }[];

        const detailRows: StudentFeeDetailRow[] = feeRows.map((row) => {
          const profileData = unwrapOne(row.student_profiles);
          const totalPaid = paidByStudentId.get(row.student_user_id) ?? 0;
          const totalFee = Number(row.total_fee ?? 0);
          const pendingAmount = Math.max(totalFee - totalPaid, 0);

          return {
            student_user_id: row.student_user_id,
            student_name: profileData?.profiles?.full_name ?? "Student",
            registration_no: profileData?.registration_no ?? null,
            course_name: profileData?.target_exam ?? null,
            total_fee: totalFee,
            total_paid: totalPaid,
            pending_amount: pendingAmount,
            next_due_amount: Number(row.next_due_amount ?? 0),
            next_due_date: row.next_due_date,
          };
        });

        const totals = detailRows.reduce(
          (acc, row) => {
            acc.totalFee += row.total_fee;
            acc.totalPaid += row.total_paid;
            acc.totalPending += row.pending_amount;
            return acc;
          },
          { totalFee: 0, totalPaid: 0, totalPending: 0 },
        );

        setStudentFeeDetails(detailRows);
        setOverallFeeSummary(totals);
      } else {
        setStudentFeeDetails([]);
        setOverallFeeSummary({ totalFee: 0, totalPaid: 0, totalPending: 0 });
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

  useEffect(() => {
    if (!selectedStudent) {
      setStudentEditForm({
        registrationNo: "",
        phone: "",
        courseName: "",
        studentName: "",
        facultyName: "",
        studentEmail: "",
        username: "",
        password: "",
      });
      setStudentActionMsg(null);
      return;
    }

    const currentEnrollment = selectedStudent.enrollments?.[0] ?? null;

    setStudentEditForm({
      registrationNo: selectedStudent.registration_no ?? "",
      phone: selectedStudent.phone ?? "",
      courseName: currentEnrollment?.course_title ?? "",
      studentName: selectedStudent.full_name ?? "",
      facultyName: currentEnrollment?.faculty_name ?? "",
      studentEmail: selectedStudent.email ?? "",
      username: selectedStudent.username ?? "",
      password: "",
    });
    setStudentActionMsg(null);
  }, [selectedStudent]);

  useEffect(() => {
    if (facultyManageMode === "create") {
      setFacultyManageForm({
        facultyUserId: "",
        facultyName: "",
        phone: "",
        facultyEmail: "",
        username: "",
        defaultPassword: "Faculty@123",
      });
      return;
    }

    const selectedFaculty = faculty.find(
      (f) => f.user_id === facultyManageForm.facultyUserId,
    );
    if (!selectedFaculty) return;

    setFacultyManageForm((prev) => ({
      ...prev,
      facultyName: selectedFaculty.full_name,
      phone: selectedFaculty.phone ?? "",
      facultyEmail: selectedFaculty.email ?? "",
      username: selectedFaculty.username ?? "",
      defaultPassword: "",
    }));
  }, [facultyManageMode, faculty, facultyManageForm.facultyUserId]);

  useEffect(() => {
    if (attendanceRange !== "custom") {
      setAttendanceFrom("");
      setAttendanceTo("");
    }
  }, [attendanceRange]);

  function getRangeDates() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    if (attendanceRange === "daily") {
      const day = fmt(today);
      return { from: day, to: day };
    }
    if (attendanceRange === "weekly") {
      const from = new Date(today);
      from.setDate(today.getDate() - 6);
      return { from: fmt(from), to: fmt(today) };
    }
    if (attendanceRange === "monthly") {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: fmt(from), to: fmt(today) };
    }
    if (attendanceRange === "yearly") {
      const from = new Date(today.getFullYear(), 0, 1);
      return { from: fmt(from), to: fmt(today) };
    }

    return { from: attendanceFrom || null, to: attendanceTo || null };
  }

  const filteredFacultyAttendance = facultyAttendanceRows.filter((row) => {
    const matchSearch =
      !search ||
      row.faculty_name.toLowerCase().includes(search.toLowerCase()) ||
      (row.phone ?? "").toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    const { from, to } = getRangeDates();
    if (from && row.attendance_date < from) return false;
    if (to && row.attendance_date > to) return false;
    return true;
  });

  function exportFacultyAttendanceCsv(rows: FacultyAttendanceRow[]) {
    const headers = ["Faculty", "Phone", "Date", "Status", "Notes"];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          `"${r.faculty_name.replace(/"/g, '""')}"`,
          `"${(r.phone || "").replace(/"/g, '""')}"`,
          `"${r.attendance_date}"`,
          `"${r.status}"`,
          `"${(r.notes || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faculty-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveFacultyProfileAndCredentials() {
    setFacultyManageAction("save");
    setFacultyManageLoading(true);
    setFacultyManageMsg(null);
    try {
      const accessToken = await getAdminAccessToken();
      if (!accessToken) {
        throw new Error("Session expired. Please sign in again.");
      }

      if (facultyManageMode === "update" && !facultyManageForm.facultyUserId) {
        throw new Error("Please select an existing faculty to update.");
      }

      const res = await fetch("/api/admin/faculty/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: facultyManageMode,
          facultyUserId:
            facultyManageMode === "update"
              ? facultyManageForm.facultyUserId
              : undefined,
          facultyName: facultyManageForm.facultyName,
          phone: facultyManageForm.phone,
          facultyEmail: facultyManageForm.facultyEmail,
          username: facultyManageForm.username,
          defaultPassword: facultyManageForm.defaultPassword,
        }),
      });

      const payload = (await res.json()) as {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(payload.error || "Failed to manage faculty.");
      }

      setFacultyManageMsg({
        type: "ok",
        text: payload.message || "Faculty details saved successfully.",
      });

      if (facultyManageMode === "create") {
        setFacultyManageForm({
          facultyUserId: "",
          facultyName: "",
          phone: "",
          facultyEmail: "",
          username: "",
          defaultPassword: "Faculty@123",
        });
      } else {
        setFacultyManageForm((prev) => ({ ...prev, defaultPassword: "" }));
      }

      await load();
    } catch (err) {
      setFacultyManageMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to manage faculty.",
      });
    } finally {
      setFacultyManageLoading(false);
      setFacultyManageAction(null);
    }
  }

  async function removeFacultyFromForm() {
    if (!facultyManageForm.facultyUserId) {
      setFacultyManageMsg({
        type: "err",
        text: "Please select an existing faculty to remove.",
      });
      return;
    }

    const selectedFaculty =
      faculty.find((entry) => entry.user_id === facultyManageForm.facultyUserId)
        ?.full_name ||
      facultyManageForm.facultyName ||
      "this faculty";

    const ok = window.confirm(
      `Remove ${selectedFaculty}? This will delete the faculty login and related faculty records.`,
    );
    if (!ok) return;

    setFacultyManageAction("remove");
    setFacultyManageLoading(true);
    setFacultyManageMsg(null);

    try {
      const accessToken = await getAdminAccessToken();
      if (!accessToken) {
        throw new Error("Session expired. Please sign in again.");
      }

      const res = await fetch("/api/admin/faculty/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "delete",
          facultyUserId: facultyManageForm.facultyUserId,
        }),
      });

      const payload = (await res.json()) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        throw new Error(payload.error || "Failed to remove faculty.");
      }

      setFacultyManageMsg({
        type: "ok",
        text: payload.message || "Faculty removed successfully.",
      });
      setFacultyManageMode("create");
      setFacultyManageForm({
        facultyUserId: "",
        facultyName: "",
        phone: "",
        facultyEmail: "",
        username: "",
        defaultPassword: "Faculty@123",
      });
      await load();
    } catch (err) {
      setFacultyManageMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to remove faculty.",
      });
    } finally {
      setFacultyManageLoading(false);
      setFacultyManageAction(null);
    }
  }

  async function saveStudentAttendance() {
    setStudentAttendanceLoading(true);
    setStudentAttendanceMsg(null);
    try {
      if (!studentAttendanceEditForm.studentUserId) {
        throw new Error("Please select a student.");
      }
      if (!studentAttendanceEditForm.sessionId) {
        throw new Error("Please select a class session.");
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Session expired. Please sign in again.");
      }

      const { error: upsertError } = await supabase
        .from("student_attendance")
        .upsert(
          {
            student_user_id: studentAttendanceEditForm.studentUserId,
            session_id: Number(studentAttendanceEditForm.sessionId),
            status: studentAttendanceEditForm.status,
            marked_by: user.id,
          },
          { onConflict: "session_id,student_user_id" },
        );

      if (upsertError) throw upsertError;

      setStudentAttendanceMsg({
        type: "ok",
        text: "Student attendance saved successfully.",
      });

      await load();
    } catch (err) {
      setStudentAttendanceMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save attendance.",
      });
    } finally {
      setStudentAttendanceLoading(false);
    }
  }

  async function saveFacultyAttendance() {
    setFacultyAttendanceLoading(true);
    setFacultyAttendanceMsg(null);
    try {
      if (!attendanceEditForm.facultyUserId) {
        throw new Error("Please select faculty.");
      }
      if (!attendanceEditForm.attendanceDate) {
        throw new Error("Please select attendance date.");
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Session expired. Please sign in again.");
      }

      const { error: upsertError } = await supabase
        .from("faculty_attendance")
        .upsert(
          {
            faculty_user_id: attendanceEditForm.facultyUserId,
            attendance_date: attendanceEditForm.attendanceDate,
            status: attendanceEditForm.status,
            notes: attendanceEditForm.notes.trim() || null,
            marked_by: user.id,
          },
          { onConflict: "faculty_user_id,attendance_date" },
        );

      if (upsertError) throw upsertError;

      setFacultyAttendanceMsg({
        type: "ok",
        text: "Faculty attendance saved successfully.",
      });

      await load();
    } catch (err) {
      setFacultyAttendanceMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save attendance.",
      });
    } finally {
      setFacultyAttendanceLoading(false);
    }
  }

  async function handleLogout() {
    await signOut("admin");
    router.push("/login-portal");
  }

  async function getAdminAccessToken() {
    const supabase = createClient();

    const { data: refreshed } = await supabase.auth.refreshSession();
    const refreshedToken = refreshed.session?.access_token || null;
    if (refreshedToken) return refreshedToken;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
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

  async function saveSelectedStudent() {
    if (!selectedStudent) return;

    setStudentActionLoading(true);
    setStudentActionMsg(null);
    try {
      const accessToken = await getAdminAccessToken();
      if (!accessToken) {
        throw new Error("Session expired. Please sign in again.");
      }

      const res = await fetch("/api/admin/students/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "update",
          studentUserId: selectedStudent.user_id,
          registrationNo: studentEditForm.registrationNo,
          phone: studentEditForm.phone,
          courseName: studentEditForm.courseName,
          studentName: studentEditForm.studentName,
          facultyName: studentEditForm.facultyName,
          studentEmail: studentEditForm.studentEmail,
          username: studentEditForm.username,
          password: studentEditForm.password,
        }),
      });

      const payload = (await res.json()) as {
        error?: string;
        message?: string;
      };
      if (!res.ok)
        throw new Error(payload.error || "Failed to update student.");

      setStudentActionMsg({
        type: "ok",
        text: payload.message || "Student updated successfully.",
      });
      await load();
      setSelectedStudent((prev) =>
        prev
          ? {
              ...prev,
              registration_no: studentEditForm.registrationNo.trim() || null,
              phone: studentEditForm.phone.trim() || null,
              full_name: studentEditForm.studentName.trim() || prev.full_name,
              email: studentEditForm.studentEmail.trim() || null,
              username: studentEditForm.username.trim() || null,
              enrollments: [
                {
                  batch_name:
                    studentEditForm.courseName.trim() || "Updated Batch",
                  course_title:
                    studentEditForm.courseName.trim() || "Updated Course",
                  faculty_name:
                    studentEditForm.facultyName.trim() || "Updated Faculty",
                },
              ],
            }
          : prev,
      );
    } catch (err) {
      setStudentActionMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to update student.",
      });
    } finally {
      setStudentActionLoading(false);
    }
  }

  async function deleteSelectedStudent() {
    if (!selectedStudent) return;

    const ok = window.confirm(
      `Delete ${selectedStudent.full_name}? This will permanently remove the student login and related records.`,
    );
    if (!ok) return;

    setStudentActionLoading(true);
    setStudentActionMsg(null);
    try {
      const accessToken = await getAdminAccessToken();
      if (!accessToken) {
        throw new Error("Session expired. Please sign in again.");
      }

      const res = await fetch("/api/admin/students/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "delete",
          studentUserId: selectedStudent.user_id,
        }),
      });

      const payload = (await res.json()) as {
        error?: string;
        message?: string;
      };
      if (!res.ok)
        throw new Error(payload.error || "Failed to delete student.");

      setStudentActionMsg({
        type: "ok",
        text: payload.message || "Student deleted.",
      });
      setSelectedStudent(null);
      await load();
    } catch (err) {
      setStudentActionMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to delete student.",
      });
    } finally {
      setStudentActionLoading(false);
    }
  }

  async function createStudentCredentials() {
    setCredentialSubmitting(true);
    setCredentialMsg(null);
    try {
      const supabase = createClient();
      // Ensure the local admin session is valid before reading token.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Session expired. Please sign in again from Admin Login.",
        );
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      let accessToken = currentSession?.access_token || null;

      if (!accessToken) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        accessToken = refreshed.session?.access_token || null;
      }

      if (!accessToken) {
        throw new Error(
          "Session expired. Please sign in again from Admin Login.",
        );
      }

      let res = await fetch("/api/admin/student-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          accessToken,
          registrationId: credentialForm.registrationId || undefined,
          courseName: credentialForm.courseName,
          registrationNumber: credentialForm.registrationNumber,
          studentName: credentialForm.studentName,
          facultyName: credentialForm.facultyName,
          studentEmail: credentialForm.studentEmail,
          studentPhone: credentialForm.studentPhone,
          username: credentialForm.username,
          defaultPassword: credentialForm.defaultPassword,
        }),
      });

      // One transparent retry for stale/expired token cases.
      if (res.status === 401) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        const retryToken = refreshed.session?.access_token;

        if (retryToken) {
          res = await fetch("/api/admin/student-credentials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${retryToken}`,
            },
            body: JSON.stringify({
              accessToken: retryToken,
              registrationId: credentialForm.registrationId || undefined,
              courseName: credentialForm.courseName,
              registrationNumber: credentialForm.registrationNumber,
              studentName: credentialForm.studentName,
              facultyName: credentialForm.facultyName,
              studentEmail: credentialForm.studentEmail,
              studentPhone: credentialForm.studentPhone,
              username: credentialForm.username,
              defaultPassword: credentialForm.defaultPassword,
            }),
          });
        }
      }

      let payload: { error?: string; message?: string } = {};
      try {
        payload = (await res.json()) as { error?: string; message?: string };
      } catch {
        payload = {};
      }

      if (!res.ok) {
        const fallback =
          payload.error ||
          payload.message ||
          `Request failed with status ${res.status}.`;

        if (
          fallback.toLowerCase().includes("invalid or expired session token")
        ) {
          throw new Error(
            "Session token is invalid or expired. Please click Sign Out, sign in again from Admin Login, and retry.",
          );
        }

        throw new Error(fallback || "Failed to create student credentials.");
      }

      setCredentialMsg({
        type: "ok",
        text:
          payload.message ||
          "Student credentials created. Student can sign in and reset password after first login.",
      });

      setCredentialForm({
        registrationId: "",
        courseName: "",
        registrationNumber: "",
        studentName: "",
        facultyName: "",
        studentEmail: "",
        studentPhone: "",
        username: "",
        defaultPassword: "LePearl@123",
      });

      await load();
    } catch (err) {
      setCredentialMsg({
        type: "err",
        text:
          err instanceof Error
            ? err.message
            : "Failed to create student credentials.",
      });
    } finally {
      setCredentialSubmitting(false);
    }
  }

  /* ── update registration status ── */
  async function updateRegistrationStatus(id: string, newStatus: string) {
    setStatusUpdatingId(id);
    try {
      const normalizedStatus = newStatus.toLowerCase();
      if (
        normalizedStatus !== "pending" &&
        normalizedStatus !== "completed" &&
        normalizedStatus !== "cancelled"
      ) {
        throw new Error("Invalid status selected.");
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("student_registrations")
        .update({ status: normalizedStatus })
        .eq("id", id);

      if (error) throw error;

      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: normalizedStatus } : r)),
      );
    } catch (error) {
      console.error("Failed to update registration status:", error);
    } finally {
      setStatusUpdatingId(null);
    }
  }

  /* ── export registrations to CSV (Excel-compatible) ── */
  function exportRegistrationsToExcel(rows: RegistrationRow[]) {
    const headers = [
      "Name",
      "Qualification",
      "Course",
      "Phone",
      "Email",
      "Submitted",
      "Status",
    ];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          `"${r.full_name.replace(/"/g, '""')}"`,
          `"${(r.qualification || "").replace(/"/g, '""')}"`,
          `"${r.course.replace(/"/g, '""')}"`,
          `"${r.phone}"`,
          `"${r.email}"`,
          `"${fmtDate(r.created_at)}"`,
          `"${r.status || "pending"}"`,
        ].join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportStudentAttendanceCsv(rows: AttendanceRow[]) {
    const headers = [
      "Student",
      "Registration No",
      "Course",
      "Session",
      "Date",
      "Status",
      "Last Updated",
    ];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          `"${r.student_name.replace(/"/g, '""')}"`,
          `"${(r.registration_no || "-").replace(/"/g, '""')}"`,
          `"${(r.course_name || "-").replace(/"/g, '""')}"`,
          `"${r.session_title.replace(/"/g, '""')}"`,
          `"${r.session_date}"`,
          `"${r.status}"`,
          `"${fmtDate(r.marked_at)}"`,
        ].join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
  const filteredStudentFeeDetails = studentFeeDetails.filter(
    (row) =>
      !search ||
      row.student_name.toLowerCase().includes(search.toLowerCase()) ||
      (row.registration_no ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (row.course_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const filteredStudentAttendance = attendance.filter((row) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      row.student_name.toLowerCase().includes(q) ||
      row.registration_no.toLowerCase().includes(q) ||
      row.course_name.toLowerCase().includes(q) ||
      row.session_title.toLowerCase().includes(q);
    if (!matchSearch) return false;

    const { from, to } = getRangeDates();
    if (from && row.session_date < from) return false;
    if (to && row.session_date > to) return false;
    return true;
  });
  const showStudentAttendance =
    activeSection === "attendance" && attendanceView !== "faculty";
  const showFacultyAttendance =
    activeSection === "attendance" && attendanceView !== "student";

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
                label={`Tests (${totalTests})`}
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
                    label="Tests"
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
                        <p className="text-xs text-gray-500">
                          Registration Number
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.registration_no ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mobile Number</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.phone ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Course Name</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.enrollments?.[0]?.course_title ??
                            "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Faculty</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.enrollments?.[0]?.faculty_name ??
                            "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Student Email</p>
                        <p className="font-semibold text-gray-900 break-all">
                          {selectedStudent.email ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">User Name</p>
                        <p className="font-semibold text-gray-900 break-all">
                          {selectedStudent.username ?? "-"}
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

                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Manage Student
                      </h3>

                      {studentActionMsg && (
                        <div
                          className={`mb-3 rounded-xl p-3 text-sm ${studentActionMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                        >
                          {studentActionMsg.text}
                        </div>
                      )}

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Registration Number
                          </label>
                          <input
                            value={studentEditForm.registrationNo}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                registrationNo: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Mobile Number
                          </label>
                          <input
                            value={studentEditForm.phone}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Student Name
                          </label>
                          <input
                            value={studentEditForm.studentName}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                studentName: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Course Name
                          </label>
                          <select
                            value={studentEditForm.courseName}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                courseName: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
                          >
                            <option value="">Select course</option>
                            {studentRegistrationCourses.map((courseName) => (
                              <option key={courseName} value={courseName}>
                                {courseName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Faculty
                          </label>
                          <select
                            value={studentEditForm.facultyName}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                facultyName: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
                          >
                            <option value="">Select faculty</option>
                            {faculty.map((facultyItem) => (
                              <option
                                key={facultyItem.user_id}
                                value={facultyItem.full_name}
                              >
                                {facultyItem.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Student Email ID
                          </label>
                          <input
                            value={studentEditForm.studentEmail}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                studentEmail: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            User Name
                          </label>
                          <input
                            value={studentEditForm.username}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                username: e.target.value.toLowerCase(),
                              }))
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={studentEditForm.password}
                            onChange={(e) =>
                              setStudentEditForm((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            placeholder="Leave blank to keep the current password"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            If you set a new username or password, the student
                            will be forced to change the password on first
                            login.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 items-center">
                        <button
                          onClick={saveSelectedStudent}
                          disabled={studentActionLoading}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                        >
                          {studentActionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          Save Changes
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={deleteSelectedStudent}
                          disabled={studentActionLoading}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                        >
                          {studentActionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          Delete Student
                        </button>
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                          Close details
                        </button>
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
                              Registration Number
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Mobile Number
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
                                {s.registration_no ?? "-"}
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

                <div className="bg-white rounded-2xl shadow-sm p-5 border border-purple-100">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <h2 className="font-bold text-gray-900">
                      Manage Faculty Details & Credentials
                    </h2>
                    <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => {
                          setFacultyManageMode("create");
                          setFacultyManageMsg(null);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold ${facultyManageMode === "create" ? "bg-purple-600 text-white" : "bg-white text-gray-600"}`}
                      >
                        Add New Faculty
                      </button>
                      <button
                        onClick={() => {
                          setFacultyManageMode("update");
                          setFacultyManageMsg(null);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold ${facultyManageMode === "update" ? "bg-purple-600 text-white" : "bg-white text-gray-600"}`}
                      >
                        Update Existing
                      </button>
                    </div>
                  </div>

                  {facultyManageMsg && (
                    <div
                      className={`mb-4 rounded-xl p-3 text-sm ${facultyManageMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                    >
                      {facultyManageMsg.text}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    {facultyManageMode === "update" && (
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Select Faculty
                        </label>
                        <select
                          value={facultyManageForm.facultyUserId}
                          onChange={(e) =>
                            setFacultyManageForm((prev) => ({
                              ...prev,
                              facultyUserId: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
                        >
                          <option value="">Select faculty to update</option>
                          {faculty.map((f) => (
                            <option key={f.user_id} value={f.user_id}>
                              {f.full_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Faculty Name
                      </label>
                      <input
                        value={facultyManageForm.facultyName}
                        onChange={(e) =>
                          setFacultyManageForm((prev) => ({
                            ...prev,
                            facultyName: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="Faculty full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Phone Number
                      </label>
                      <input
                        value={facultyManageForm.phone}
                        onChange={(e) =>
                          setFacultyManageForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="+91-98xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Faculty Email ID
                      </label>
                      <input
                        type="email"
                        value={facultyManageForm.facultyEmail}
                        onChange={(e) =>
                          setFacultyManageForm((prev) => ({
                            ...prev,
                            facultyEmail: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="faculty@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Username
                      </label>
                      <input
                        value={facultyManageForm.username}
                        onChange={(e) =>
                          setFacultyManageForm((prev) => ({
                            ...prev,
                            username: e.target.value.toLowerCase(),
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="username"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        {facultyManageMode === "create"
                          ? "Default Password"
                          : "New Default Password (optional)"}
                      </label>
                      <input
                        type="text"
                        value={facultyManageForm.defaultPassword}
                        onChange={(e) =>
                          setFacultyManageForm((prev) => ({
                            ...prev,
                            defaultPassword: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
                        placeholder={
                          facultyManageMode === "create"
                            ? "Faculty@123"
                            : "Leave blank to keep current password"
                        }
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Faculty must reset password on first login when a
                        default/new password is set.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={saveFacultyProfileAndCredentials}
                      disabled={
                        facultyManageLoading ||
                        !facultyManageForm.facultyName ||
                        !facultyManageForm.facultyEmail ||
                        !facultyManageForm.username ||
                        (facultyManageMode === "create" &&
                          !facultyManageForm.defaultPassword)
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-60"
                    >
                      {facultyManageLoading &&
                      facultyManageAction === "save" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {facultyManageMode === "create"
                        ? "Create Faculty Credentials"
                        : "Save Faculty Changes"}
                    </button>

                    {facultyManageMode === "update" && (
                      <button
                        onClick={removeFacultyFromForm}
                        disabled={
                          facultyManageLoading ||
                          !facultyManageForm.facultyUserId
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                      >
                        {facultyManageLoading &&
                        facultyManageAction === "remove" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Remove Faculty
                      </button>
                    )}
                  </div>
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
                            Email
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Username
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
                            <td className="px-4 py-3 text-gray-600 text-xs">
                              {f.email ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {f.username ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {fmtDate(f.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    setFacultyManageMode("update");
                                    setFacultyManageMsg(null);
                                    setFacultyManageForm({
                                      facultyUserId: f.user_id,
                                      facultyName: f.full_name,
                                      phone: f.phone ?? "",
                                      facultyEmail: f.email ?? "",
                                      username: f.username ?? "",
                                      defaultPassword: "",
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 text-xs font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    const ok = window.confirm(
                                      `Remove ${f.full_name}? This will delete the faculty login and related faculty records.`,
                                    );
                                    if (!ok) return;

                                    try {
                                      const accessToken =
                                        await getAdminAccessToken();
                                      if (!accessToken) {
                                        throw new Error(
                                          "Session expired. Please sign in again.",
                                        );
                                      }

                                      setFacultyManageAction("remove");
                                      setFacultyManageLoading(true);
                                      setFacultyManageMsg(null);

                                      const res = await fetch(
                                        "/api/admin/faculty/manage",
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${accessToken}`,
                                          },
                                          body: JSON.stringify({
                                            action: "delete",
                                            facultyUserId: f.user_id,
                                          }),
                                        },
                                      );

                                      const payload = (await res.json()) as {
                                        error?: string;
                                        message?: string;
                                      };

                                      if (!res.ok) {
                                        throw new Error(
                                          payload.error ||
                                            "Failed to remove faculty.",
                                        );
                                      }

                                      setFacultyManageMsg({
                                        type: "ok",
                                        text:
                                          payload.message ||
                                          "Faculty removed successfully.",
                                      });
                                      await load();
                                    } catch (err) {
                                      setFacultyManageMsg({
                                        type: "err",
                                        text:
                                          err instanceof Error
                                            ? err.message
                                            : "Failed to remove faculty.",
                                      });
                                    } finally {
                                      setFacultyManageLoading(false);
                                      setFacultyManageAction(null);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold"
                                >
                                  Remove
                                </button>
                              </div>
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
                  <h1 className="text-xl font-bold mb-1">
                    Attendance Management
                  </h1>
                  <p className="text-teal-100 text-sm">
                    Student ({filteredStudentAttendance.length}) and Faculty (
                    {filteredFacultyAttendance.length}) attendance synced with
                    dashboards
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                  <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setAttendanceView("all")}
                      className={`px-4 py-2 text-xs font-semibold ${attendanceView === "all" ? "bg-teal-600 text-white" : "bg-white text-gray-600"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setAttendanceView("student")}
                      className={`px-4 py-2 text-xs font-semibold ${attendanceView === "student" ? "bg-teal-600 text-white" : "bg-white text-gray-600"}`}
                    >
                      Student Only
                    </button>
                    <button
                      onClick={() => setAttendanceView("faculty")}
                      className={`px-4 py-2 text-xs font-semibold ${attendanceView === "faculty" ? "bg-teal-600 text-white" : "bg-white text-gray-600"}`}
                    >
                      Faculty Only
                    </button>
                  </div>
                </div>

                {showStudentAttendance && studentAttendanceMsg && (
                  <div
                    className={`rounded-xl p-3 text-sm ${studentAttendanceMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                  >
                    {studentAttendanceMsg.text}
                  </div>
                )}

                {showFacultyAttendance && facultyAttendanceMsg && (
                  <div
                    className={`rounded-xl p-3 text-sm ${facultyAttendanceMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                  >
                    {facultyAttendanceMsg.text}
                  </div>
                )}

                {showStudentAttendance && (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-indigo-100">
                    <h2 className="font-bold text-gray-900 mb-3">
                      Mark/Update Student Attendance (Session-wise)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Student
                        </label>
                        <select
                          value={studentAttendanceEditForm.studentUserId}
                          onChange={(e) =>
                            setStudentAttendanceEditForm((prev) => ({
                              ...prev,
                              studentUserId: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
                        >
                          <option value="">Select student</option>
                          {students.map((s) => (
                            <option key={s.user_id} value={s.user_id}>
                              {s.full_name} ({s.registration_no || "-"})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Class Session
                        </label>
                        <select
                          value={studentAttendanceEditForm.sessionId}
                          onChange={(e) =>
                            setStudentAttendanceEditForm((prev) => ({
                              ...prev,
                              sessionId: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
                        >
                          <option value="">Select session</option>
                          {liveClasses.map((session) => (
                            <option key={session.id} value={String(session.id)}>
                              {fmtDate(session.session_date)} • {session.title}{" "}
                              ({session.batch_name})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Status
                        </label>
                        <select
                          value={studentAttendanceEditForm.status}
                          onChange={(e) =>
                            setStudentAttendanceEditForm((prev) => ({
                              ...prev,
                              status: e.target.value as
                                | "present"
                                | "absent"
                                | "late",
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={saveStudentAttendance}
                        disabled={studentAttendanceLoading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
                      >
                        {studentAttendanceLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Save Student Attendance
                      </button>
                    </div>
                  </div>
                )}

                {showFacultyAttendance && (
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-teal-100">
                    <h2 className="font-bold text-gray-900 mb-3">
                      Mark Faculty Attendance (Daily)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Faculty
                        </label>
                        <select
                          value={attendanceEditForm.facultyUserId}
                          onChange={(e) =>
                            setAttendanceEditForm((prev) => ({
                              ...prev,
                              facultyUserId: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
                        >
                          <option value="">Select faculty</option>
                          {faculty.map((f) => (
                            <option key={f.user_id} value={f.user_id}>
                              {f.full_name}
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
                          value={attendanceEditForm.attendanceDate}
                          onChange={(e) =>
                            setAttendanceEditForm((prev) => ({
                              ...prev,
                              attendanceDate: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Status
                        </label>
                        <select
                          value={attendanceEditForm.status}
                          onChange={(e) =>
                            setAttendanceEditForm((prev) => ({
                              ...prev,
                              status: e.target.value as
                                | "present"
                                | "absent"
                                | "leave",
                            }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="leave">Leave</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Notes
                        </label>
                        <input
                          value={attendanceEditForm.notes}
                          onChange={(e) =>
                            setAttendanceEditForm((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="Optional remarks"
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={saveFacultyAttendance}
                        disabled={facultyAttendanceLoading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
                      >
                        {facultyAttendanceLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Save Attendance
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                  <div className="flex flex-wrap items-end gap-3 justify-between">
                    <div className="flex flex-wrap items-end gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          View Range
                        </label>
                        <select
                          value={attendanceRange}
                          onChange={(e) =>
                            setAttendanceRange(
                              e.target.value as
                                | "daily"
                                | "weekly"
                                | "monthly"
                                | "yearly"
                                | "custom",
                            )
                          }
                          className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>

                      {attendanceRange === "custom" && (
                        <>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                              From
                            </label>
                            <input
                              type="date"
                              value={attendanceFrom}
                              onChange={(e) =>
                                setAttendanceFrom(e.target.value)
                              }
                              className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                              To
                            </label>
                            <input
                              type="date"
                              value={attendanceTo}
                              onChange={(e) => setAttendanceTo(e.target.value)}
                              className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {showStudentAttendance && (
                      <button
                        onClick={() =>
                          exportStudentAttendanceCsv(filteredStudentAttendance)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                      >
                        <Download className="w-4 h-4" />
                        Export Student Excel
                      </button>
                    )}
                    {showFacultyAttendance && (
                      <button
                        onClick={() =>
                          exportFacultyAttendanceCsv(filteredFacultyAttendance)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                      >
                        <Download className="w-4 h-4" />
                        Export Faculty Excel
                      </button>
                    )}
                  </div>
                </div>

                {showStudentAttendance && (
                  <div className="grid grid-cols-3 gap-4">
                    {(["present", "absent", "late"] as const).map((st) => {
                      const count = filteredStudentAttendance.filter(
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
                          <p className="text-xs font-semibold capitalize">
                            {st}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showStudentAttendance && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Student
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Registration No
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Course
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Session
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Date
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Last Updated
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredStudentAttendance
                            .slice(0, 300)
                            .map((row) => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  {row.student_name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {row.registration_no || "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {row.course_name || "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {row.session_title}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                  {fmtDate(row.session_date)}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                    text={row.status}
                                    color={
                                      row.status === "present"
                                        ? "green"
                                        : row.status === "late"
                                          ? "yellow"
                                          : "red"
                                    }
                                  />
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                  {fmtDate(row.marked_at)}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() =>
                                      setStudentAttendanceEditForm({
                                        studentUserId: row.student_user_id,
                                        sessionId: String(row.session_id),
                                        status: row.status,
                                      })
                                    }
                                    className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {filteredStudentAttendance.length === 0 && (
                        <p className="text-center py-8 text-sm text-gray-400">
                          No student attendance records for selected range.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* stats */}
                {showFacultyAttendance && (
                  <div className="grid grid-cols-3 gap-4">
                    {(["present", "absent", "leave"] as const).map((st) => {
                      const count = filteredFacultyAttendance.filter(
                        (a) => a.status === st,
                      ).length;
                      const colors = {
                        present: "bg-green-100 text-green-700",
                        leave: "bg-blue-100 text-blue-700",
                        absent: "bg-red-100 text-red-700",
                      };
                      return (
                        <div
                          key={st}
                          className={`rounded-2xl p-4 ${colors[st]} text-center`}
                        >
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-xs font-semibold capitalize">
                            {st}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {showFacultyAttendance && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Faculty
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Phone
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Date
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredFacultyAttendance.slice(0, 200).map((a) => (
                            <tr key={a.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {a.faculty_name}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {a.phone ?? "-"}
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {fmtDate(a.attendance_date)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  text={a.status}
                                  color={
                                    a.status === "present"
                                      ? "green"
                                      : a.status === "leave"
                                        ? "blue"
                                        : "red"
                                  }
                                />
                              </td>
                              <td className="px-4 py-3 text-gray-500 text-xs">
                                {a.notes ?? "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredFacultyAttendance.length === 0 && (
                        <p className="text-center py-8 text-sm text-gray-400">
                          No faculty attendance records for selected range.
                        </p>
                      )}
                    </div>
                  </div>
                )}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-center">
                    <p className="text-xs font-semibold text-blue-700">
                      Overall Fees (All Students)
                    </p>
                    <p className="text-lg font-bold text-blue-900 mt-1">
                      {fmtCurrency(overallFeeSummary.totalFee)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
                    <p className="text-xs font-semibold text-green-700">
                      Overall Paid
                    </p>
                    <p className="text-lg font-bold text-green-900 mt-1">
                      {fmtCurrency(overallFeeSummary.totalPaid)}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
                    <p className="text-xs font-semibold text-amber-700">
                      Overall Pending
                    </p>
                    <p className="text-lg font-bold text-amber-900 mt-1">
                      {fmtCurrency(overallFeeSummary.totalPending)}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">
                      Student Fee Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Individual paid amount, pending amount, and due date.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Student
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Registration
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Course
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Total Fee
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Paid
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Pending
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredStudentFeeDetails.map((row) => (
                          <tr
                            key={row.student_user_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {row.student_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {row.registration_no ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {row.course_name ?? "-"}
                            </td>
                            <td className="px-4 py-3 font-semibold text-blue-700">
                              {fmtCurrency(row.total_fee)}
                            </td>
                            <td className="px-4 py-3 font-semibold text-green-700">
                              {fmtCurrency(row.total_paid)}
                            </td>
                            <td className="px-4 py-3 font-semibold text-amber-700">
                              {fmtCurrency(row.pending_amount)}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {row.next_due_date
                                ? fmtDate(row.next_due_date)
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredStudentFeeDetails.length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-400">
                        No student fee plan records.
                      </p>
                    )}
                  </div>
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
                            Method
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                            Transaction ID
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
                            <td className="px-4 py-3 text-gray-500">
                              {p.payment_mode ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                              {p.razorpay_payment_id ?? "-"}
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
                  <h1 className="text-xl font-bold mb-1">Tests & Results</h1>
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
                {/* header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                  <h1 className="text-xl font-bold mb-1">
                    New Student Registrations
                  </h1>
                  <p className="text-blue-100 text-sm">
                    {registrations.length} enrollment requests submitted · click
                    a row to prefill the credentials form
                  </p>
                </div>

                {/* two-column split */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  {/* ── LEFT: registration requests table ── */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h2 className="font-bold text-gray-900">
                            Student Registration Requests
                          </h2>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Select a row to prefill the credentials form on the
                            right.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const filtered = registrations.filter((r) => {
                              const match = search
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
                                : true;
                              const d = r.created_at.slice(0, 10);
                              const fromOk = regDateFrom
                                ? d >= regDateFrom
                                : true;
                              const toOk = regDateTo ? d <= regDateTo : true;
                              return match && fromOk && toOk;
                            });
                            exportRegistrationsToExcel(filtered);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export to Excel
                        </button>
                      </div>

                      {/* date range filter */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 shrink-0">
                          Filter by date:
                        </span>
                        <input
                          type="date"
                          value={regDateFrom}
                          onChange={(e) => setRegDateFrom(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700"
                        />
                        <span className="text-xs text-gray-400">to</span>
                        <input
                          type="date"
                          value={regDateTo}
                          onChange={(e) => setRegDateTo(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700"
                        />
                        {(regDateFrom || regDateTo) && (
                          <button
                            onClick={() => {
                              setRegDateFrom("");
                              setRegDateTo("");
                            }}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                              Name
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
                            .filter((r) => {
                              const textMatch = search
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
                                : true;
                              const d = r.created_at.slice(0, 10);
                              const fromOk = regDateFrom
                                ? d >= regDateFrom
                                : true;
                              const toOk = regDateTo ? d <= regDateTo : true;
                              return textMatch && fromOk && toOk;
                            })
                            .map((r) => (
                              <tr
                                key={r.id}
                                onClick={() => {
                                  setCredentialForm((p) => ({
                                    ...p,
                                    registrationId: r.id,
                                    studentName: r.full_name,
                                    studentEmail: r.email,
                                    courseName: r.course,
                                    username: r.email
                                      .split("@")[0]
                                      .toLowerCase()
                                      .replace(/[^a-z0-9._-]/g, ""),
                                  }));
                                  setCredentialMsg(null);
                                }}
                                className={`cursor-pointer transition-colors ${
                                  credentialForm.registrationId === r.id
                                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  {r.full_name}
                                  {r.qualification && (
                                    <span className="ml-1 text-xs text-gray-400">
                                      ({r.qualification})
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                                  {r.course}
                                </td>
                                <td className="px-4 py-3 text-gray-600 text-xs">
                                  {r.phone}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  <a
                                    href={`mailto:${r.email}`}
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {r.email}
                                  </a>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                  {fmtDate(r.created_at)}
                                </td>
                                <td
                                  className="px-4 py-3"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="relative inline-flex items-center gap-1">
                                    {statusUpdatingId === r.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                    ) : (
                                      <>
                                        <select
                                          value={
                                            r.status === "credentials_created"
                                              ? "completed"
                                              : r.status === "canceled"
                                                ? "cancelled"
                                                : r.status || "pending"
                                          }
                                          onChange={(e) =>
                                            updateRegistrationStatus(
                                              r.id,
                                              e.target.value,
                                            )
                                          }
                                          className={`appearance-none pr-5 pl-2 py-0.5 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                            r.status === "completed" ||
                                            r.status === "credentials_created"
                                              ? "bg-green-100 text-green-700 focus:ring-green-400"
                                              : r.status === "cancelled" ||
                                                  r.status === "canceled"
                                                ? "bg-red-100 text-red-700 focus:ring-red-400"
                                                : "bg-amber-100 text-amber-700 focus:ring-amber-400"
                                          }`}
                                        >
                                          <option value="pending">
                                            Pending
                                          </option>
                                          <option value="cancelled">
                                            Cancelled
                                          </option>
                                          <option value="completed">
                                            Completed
                                          </option>
                                        </select>
                                        <ChevronDown className="w-3 h-3 absolute right-1 pointer-events-none text-current opacity-60" />
                                      </>
                                    )}
                                  </div>
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

                  {/* ── RIGHT: create credentials form ── */}
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100 xl:sticky xl:top-24">
                    <h2 className="font-bold text-gray-900 text-base mb-0.5">
                      Create Student Credentials
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                      Create login credentials, assign course and faculty, and
                      auto-enroll the student.
                      {credentialForm.registrationId && (
                        <span className="ml-1 text-blue-600 font-medium">
                          (prefilled from selected registration)
                        </span>
                      )}
                    </p>

                    {credentialMsg && (
                      <div
                        className={`mb-4 rounded-xl p-3 text-sm ${credentialMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                      >
                        {credentialMsg.text}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Course Name
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          value={credentialForm.courseName}
                          onChange={(e) =>
                            setCredentialForm((p) => ({
                              ...p,
                              courseName: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select course</option>
                          {studentRegistrationCourses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Registration Number
                          </label>
                          <input
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            value={credentialForm.registrationNumber}
                            onChange={(e) =>
                              setCredentialForm((p) => ({
                                ...p,
                                registrationNumber: e.target.value,
                              }))
                            }
                            placeholder="LP-REG-2026-001"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Student Name
                          </label>
                          <input
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            value={credentialForm.studentName}
                            onChange={(e) =>
                              setCredentialForm((p) => ({
                                ...p,
                                studentName: e.target.value,
                              }))
                            }
                            placeholder="Full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Faculty Name
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          value={credentialForm.facultyName}
                          onChange={(e) =>
                            setCredentialForm((p) => ({
                              ...p,
                              facultyName: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select faculty</option>
                          {adminFacultyOptions.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Student Email ID
                        </label>
                        <input
                          type="email"
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          value={credentialForm.studentEmail}
                          onChange={(e) =>
                            setCredentialForm((p) => ({
                              ...p,
                              studentEmail: e.target.value,
                            }))
                          }
                          placeholder="student@example.com"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          value={credentialForm.studentPhone}
                          onChange={(e) =>
                            setCredentialForm((p) => ({
                              ...p,
                              studentPhone: e.target.value,
                            }))
                          }
                          placeholder="+91-9876543210"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            User Name
                          </label>
                          <input
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            value={credentialForm.username}
                            onChange={(e) =>
                              setCredentialForm((p) => ({
                                ...p,
                                username: e.target.value.toLowerCase(),
                              }))
                            }
                            placeholder="username"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Default Password
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            value={credentialForm.defaultPassword}
                            onChange={(e) =>
                              setCredentialForm((p) => ({
                                ...p,
                                defaultPassword: e.target.value,
                              }))
                            }
                            placeholder="LePearl@123"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={createStudentCredentials}
                        disabled={
                          credentialSubmitting ||
                          !credentialForm.courseName ||
                          !credentialForm.registrationNumber ||
                          !credentialForm.studentName ||
                          !credentialForm.facultyName ||
                          !credentialForm.studentEmail ||
                          !credentialForm.username ||
                          !credentialForm.defaultPassword
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                      >
                        {credentialSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Create Credentials
                      </button>

                      {(credentialForm.registrationId ||
                        credentialForm.studentName) && (
                        <button
                          type="button"
                          onClick={() => {
                            setCredentialForm({
                              registrationId: "",
                              courseName: "",
                              registrationNumber: "",
                              studentName: "",
                              facultyName: "",
                              studentEmail: "",
                              studentPhone: "",
                              username: "",
                              defaultPassword: "LePearl@123",
                            });
                            setCredentialMsg(null);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Clear form
                        </button>
                      )}
                    </div>
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
