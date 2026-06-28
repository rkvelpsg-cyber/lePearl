"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/supabase/auth";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import {
  formatDateIST,
  formatDateTimeIST,
  localDateKeyIST,
} from "@/lib/timezone";
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
  Trash2,
  X,
} from "lucide-react";

/* â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type Section =
  | "overview"
  | "attendance"
  | "tests"
  | "classes"
  | "lectures"
  | "studyMaterials"
  | "fees"
  | "tasks";
type Profile = {
  full_name: string;
  phone: string | null;
  email?: string | null;
};
type StudentProfile = { registration_no: string; target_exam: string | null };
type PaidRegistrationSummary = {
  id: string;
  course: string;
  registration_no: string | null;
  username: string | null;
  payment_tenure: "full" | "instalment" | null;
  selected_fee_label: string | null;
  final_payable: number | null;
  payment_amount: number | null;
  payment_mode: string | null;
  payment_status: string | null;
  razorpay_payment_id: string | null;
  status: string;
  created_at: string;
};
type CourseProgress = {
  course_id: number;
  instructor_name: string | null;
  duration_label: string | null;
  exam_label: string | null;
  progress_percent: number;
  courses: { title: string } | null;
};
type Payment = {
  id: number | string;
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
  negative_marking: number | null;
  question_paper_file_url: string | null;
  time_limit_minutes: number;
  exam_type: string;
  test_type?: string; // 'mcq' or 'descriptive'
  created_by: string;
  scheduled_at: string | null;
  available_until: string | null;
  is_published: boolean;
  batch_id: number | null;
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
  evaluated_answer_file_url: string | null;
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
  correct_option?: "A" | "B" | "C" | "D" | null;
};
type McqResultSummary = {
  score: number;
  rank: number | null;
  participantCount: number;
};
type McqReviewQuestion = McqQuestion & {
  correct_option: "A" | "B" | "C" | "D" | null;
  chosen_option: "A" | "B" | "C" | "D" | null;
  is_correct: boolean;
};
type McqReviewState = {
  test: McqTest;
  summary: McqResultSummary | null;
  questions: McqReviewQuestion[];
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
type StudyMaterial = {
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
    faculty_user_id: string | null;
    courses: { id: number; title: string } | null;
  } | null;
};

const PROFILE_PHOTO_KEY_PREFIX = "lepearl-student-profile-photo";
const PROFILE_PHOTO_NAME_KEY_PREFIX = "lepearl-student-profile-photo-name";
const DEFAULT_FACULTY_KEY = "__default__";
const FACULTY_FULL_NAME_BY_TOKEN: Record<string, string> = {
  pandey: "Dr Prem Shankar Pandey",
  sadhana: "Ms Sadhana",
  patel: "Ms Neelu Patel",
  mallick: "Dr Babli Mallick",
};

function unwrapOne<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}
function normalizeCourseKey(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
function inferFacultyFromBatchName(batchName: string | null | undefined) {
  const raw = String(batchName ?? "").trim();
  if (!raw) return null;

  const tokens = raw
    .split(/[-_]/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length < 2) return null;

  const inferred = tokens[tokens.length - 2];
  if (!inferred || /^[A-Za-z]$/.test(inferred) || /^\d+$/.test(inferred)) {
    return null;
  }

  const token = inferred.toLowerCase();
  if (FACULTY_FULL_NAME_BY_TOKEN[token]) {
    return FACULTY_FULL_NAME_BY_TOKEN[token];
  }

  return inferred.toLowerCase().replace(/\b\w/g, (ch) => ch.toUpperCase());
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
  return formatDateIST(s);
}
function fmtDateTime(s: string | null) {
  return formatDateTimeIST(s);
}
function fmtTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}
function optionText(question: McqQuestion, option: "A" | "B" | "C" | "D") {
  return question[
    `option_${option.toLowerCase()}` as
      | "option_a"
      | "option_b"
      | "option_c"
      | "option_d"
  ];
}
function localDateKey(d: Date = new Date()) {
  return localDateKeyIST(d);
}
function getSessionStartMinutes(startTime: string | null) {
  if (!startTime) return null;
  const [h, m] = startTime.split(":").map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}
function isUpcomingSession(sessionDate: string, startTime: string | null) {
  const today = localDateKey();
  if (sessionDate > today) return true;
  if (sessionDate < today) return false;
  const sessionMinutes = getSessionStartMinutes(startTime);
  if (sessionMinutes === null) return true;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return sessionMinutes > nowMinutes;
}

function isRecentSession(sessionDate: string, startTime: string | null) {
  const today = localDateKey();
  if (sessionDate < today) return true;
  if (sessionDate > today) return false;

  const sessionMinutes = getSessionStartMinutes(startTime);
  if (sessionMinutes === null) return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return sessionMinutes <= nowMinutes;
}

function shouldIndentMcqQuestion(questionText: string) {
  const normalized = questionText.toLowerCase();
  return (
    questionText.includes("\n") ||
    normalized.includes("question:") ||
    normalized.includes("assertion") ||
    normalized.includes("reason") ||
    questionText.length > 180
  );
}

function mergePaymentHistory(
  paymentRows: Payment[],
  registration: PaidRegistrationSummary | null,
) {
  if (!registration) return paymentRows;

  const registrationAmount =
    Number(registration.payment_amount ?? registration.final_payable ?? 0) || 0;
  if (registrationAmount <= 0) return paymentRows;

  const registrationTxnId =
    registration.razorpay_payment_id?.trim().toLowerCase() ?? null;
  const hasMatchingTxn = registrationTxnId
    ? paymentRows.some(
        (row) =>
          (row.razorpay_payment_id?.trim().toLowerCase() ?? null) ===
          registrationTxnId,
      )
    : false;

  if (hasMatchingTxn) return paymentRows;

  const syntheticRegistrationPayment: Payment = {
    id: `registration-${registration.id}`,
    amount: registrationAmount,
    payment_date: registration.created_at,
    payment_mode: registration.payment_mode ?? "razorpay",
    status:
      registration.payment_status === "successful" ||
      registration.status === "completed"
        ? "paid"
        : registration.payment_status || registration.status,
    razorpay_payment_id: registration.razorpay_payment_id,
    description: registration.selected_fee_label
      ? `Registration payment - ${registration.selected_fee_label}`
      : `Registration payment - ${registration.course}`,
  };

  return [syntheticRegistrationPayment, ...paymentRows].sort(
    (a, b) =>
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
  );
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
  const createClient = () => createSupabaseClient("student");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("overview");

  /* data states */
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const [profilePhotoFileName, setProfilePhotoFileName] =
    useState<string>("No File Choosen");
  const [profilePhotoMsg, setProfilePhotoMsg] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [facultyByCourseName, setFacultyByCourseName] = useState<
    Record<string, string>
  >({});
  const [batchLabel, setBatchLabel] = useState<string | null>(null);
  const [batchIds, setBatchIds] = useState<number[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [attendancePeriod, setAttendancePeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("weekly");
  const [availableTests, setAvailableTests] = useState<McqTest[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<McqTest[]>([]);
  const [testAttempted, setTestAttempted] = useState<Set<number>>(new Set());
  const [descriptiveTests, setDescriptiveTests] = useState<McqTest[]>([]);
  const [facultyNameById, setFacultyNameById] = useState<
    Record<string, string>
  >({});
  const [descriptiveQuestions, setDescriptiveQuestions] = useState<
    DescriptiveQuestion[]
  >([]);
  const [descriptiveAnswers, setDescriptiveAnswers] = useState<
    DescriptiveAnswer[]
  >([]);
  const [selectedDescriptiveTest, setSelectedDescriptiveTest] =
    useState<McqTest | null>(null);
  const [uploadingFullSheet, setUploadingFullSheet] = useState(false);
  const [fullSheetFileName, setFullSheetFileName] =
    useState<string>("No File Choosen");
  const [uploadMsg, setUploadMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [lectures, setLectures] = useState<RecordedLecture[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feePlan, setFeePlan] = useState<FeePlan | null>(null);
  const [paidRegistration, setPaidRegistration] =
    useState<PaidRegistrationSummary | null>(null);
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
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [mcqResultsByTest, setMcqResultsByTest] = useState<
    Record<number, McqResultSummary>
  >({});
  const [reviewTest, setReviewTest] = useState<McqReviewState | null>(null);

  /* fee/payment state */
  const [payAmount, setPayAmount] = useState("");
  const [payDesc, setPayDesc] = useState("Course fee payment");
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const useUpiQrPayment = process.env.NEXT_PUBLIC_PAYMENT_MODE !== "razorpay";

  useEffect(() => {
    if (!userId) return;
    const stored = window.localStorage.getItem(
      `${PROFILE_PHOTO_KEY_PREFIX}-${userId}`,
    );
    if (stored) setProfilePhotoPreview(stored);

    const storedFileName = window.localStorage.getItem(
      `${PROFILE_PHOTO_NAME_KEY_PREFIX}-${userId}`,
    );
    if (storedFileName) {
      setProfilePhotoFileName(storedFileName);
    } else {
      setProfilePhotoFileName("No File Choosen");
    }
  }, [userId]);

  function handleProfilePhotoChange(file: File | null) {
    if (!userId) return;
    if (!file) {
      setProfilePhotoFileName("No File Choosen");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setProfilePhotoMsg("Please upload a valid image file.");
      setProfilePhotoFileName("No File Choosen");
      return;
    }

    setProfilePhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) return;
      setProfilePhotoPreview(dataUrl);
      window.localStorage.setItem(
        `${PROFILE_PHOTO_KEY_PREFIX}-${userId}`,
        dataUrl,
      );
      window.localStorage.setItem(
        `${PROFILE_PHOTO_NAME_KEY_PREFIX}-${userId}`,
        file.name,
      );
      setProfilePhotoMsg("Profile picture uploaded.");
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveProfilePhoto() {
    if (!userId) return;

    setProfilePhotoPreview(null);
    setProfilePhotoFileName("No File Choosen");
    setProfilePhotoMsg("Profile picture removed.");
    window.localStorage.removeItem(`${PROFILE_PHOTO_KEY_PREFIX}-${userId}`);
    window.localStorage.removeItem(
      `${PROFILE_PHOTO_NAME_KEY_PREFIX}-${userId}`,
    );
  }

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
      setUserId(uid);

      // Auto-heal legacy/missing batch enrollment mapping for paid accounts.
      // Student dashboard data (tests/classes/materials/tasks) is batch-scoped.
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const accessToken = session?.access_token;
        if (accessToken) {
          await fetch("/api/student/ensure-enrollment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
      } catch (ensureError) {
        console.warn(
          "Failed to ensure enrollment mapping:",
          ensureError instanceof Error ? ensureError.message : ensureError,
        );
      }

      /* stage 1 */
      const [profileRes, spRes, enrollRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, role, email")
          .eq("user_id", uid)
          .single(),
        supabase
          .from("student_profiles")
          .select("registration_no, target_exam")
          .eq("user_id", uid)
          .single(),
        supabase
          .from("enrollments")
          .select(
            "batch_id, batches(batch_name, faculty_user_id, courses(id, title))",
          )
          .eq("student_user_id", uid),
      ]);

      if (profileRes.data) {
        const role = (profileRes.data as { role?: string }).role;
        if (role !== "student") {
          router.push("/login-portal");
          return;
        }
        setProfile(profileRes.data as Profile);
      }
      if (spRes.data) setStudentProfile(spRes.data as StudentProfile);

      const enrollRows =
        (enrollRes.data as unknown as EnrollmentRow[] | null) ?? [];

      const facultyIds = Array.from(
        new Set(
          enrollRows
            .map((row) => unwrapOne(row.batches)?.faculty_user_id)
            .filter((id): id is string => !!id),
        ),
      );

      const facultyNameByUserId: Record<string, string> = {};
      if (facultyIds.length > 0) {
        const { data: facultyProfiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", facultyIds)
          .eq("role", "faculty");

        (
          (facultyProfiles ?? []) as Array<{
            user_id: string;
            full_name: string;
          }>
        ).forEach((faculty) => {
          facultyNameByUserId[faculty.user_id] = faculty.full_name;
        });
      }

      const facultyMap: Record<string, string> = {};
      enrollRows.forEach((row) => {
        const batch = unwrapOne(row.batches) as {
          batch_name: string;
          faculty_user_id: string | null;
          courses: { id: number; title: string } | null;
        } | null;

        const courseTitle = unwrapOne(batch?.courses)?.title?.trim();
        const facultyName =
          (batch?.faculty_user_id
            ? facultyNameByUserId[batch.faculty_user_id]
            : null) || inferFacultyFromBatchName(batch?.batch_name);

        if (courseTitle && facultyName) {
          const key = normalizeCourseKey(courseTitle);
          if (!facultyMap[key]) facultyMap[key] = facultyName;
        }
        if (facultyName && !facultyMap[DEFAULT_FACULTY_KEY]) {
          facultyMap[DEFAULT_FACULTY_KEY] = facultyName;
        }
      });
      setFacultyByCourseName(facultyMap);

      const ids = enrollRows.map((e) => e.batch_id).filter(Boolean);
      setBatchIds(ids);
      const firstBatch = unwrapOne(enrollRows[0]?.batches) as {
        batch_name: string;
      } | null;
      if (firstBatch?.batch_name) setBatchLabel(firstBatch.batch_name);

      const profileEmail =
        (profileRes.data as { email?: string | null } | null)?.email
          ?.trim()
          .toLowerCase() ?? null;
      const registrationNo =
        (
          spRes.data as { registration_no?: string | null } | null
        )?.registration_no?.trim() ?? null;

      /* stage 2 */
      const [
        coursesRes,
        paymentsRes,
        feePlanRes,
        paidRegistrationRes,
        classesRes,
        attendRes,
        mockRes,
        tasksRes,
        lecturesRes,
        studyMaterialsRes,
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
        profileEmail || registrationNo
          ? supabase
              .from("student_registrations")
              .select(
                "id, course, registration_no, username, final_payable, payment_amount, payment_mode, payment_tenure, selected_fee_label, payment_status, razorpay_payment_id, status, created_at",
              )
              .eq("mode", "paid")
              .match(
                registrationNo
                  ? { registration_no: registrationNo }
                  : { email: profileEmail },
              )
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
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
        ids.length > 0
          ? supabase
              .from("faculty_tasks")
              .select(
                "id, title, description, due_date, status, batches(batch_name), profiles(full_name)",
              )
              .in("batch_id", ids)
              .order("due_date", { ascending: true })
          : Promise.resolve({ data: [], error: null }),
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
        ids.length > 0
          ? supabase
              .from("study_materials")
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

      const paymentRows =
        (paymentsRes.data as unknown as Payment[] | null) ?? [];
      const registrationSummary =
        (paidRegistrationRes.data as PaidRegistrationSummary | null) ?? null;
      setPayments(mergePaymentHistory(paymentRows, registrationSummary));
      if (feePlanRes.data) setFeePlan(feePlanRes.data as FeePlan);
      if (registrationSummary) setPaidRegistration(registrationSummary);
      if (classesRes.data)
        setClassSessions(classesRes.data as unknown as ClassSession[]);
      if (attendRes.data)
        setAttendanceRecords(attendRes.data as unknown as AttendanceRecord[]);
      if (lecturesRes.data)
        setLectures(lecturesRes.data as unknown as RecordedLecture[]);
      if (lecturesRes.error) {
        console.error("Failed to load recorded lectures:", lecturesRes.error);
      }
      if (studyMaterialsRes.data)
        setStudyMaterials(studyMaterialsRes.data as unknown as StudyMaterial[]);
      if (studyMaterialsRes.error) {
        console.error(
          "Failed to load study materials:",
          studyMaterialsRes.error,
        );
      }
      if (tasksRes.data)
        setFacultyTasks(tasksRes.data as unknown as StudentTask[]);

      let attemptedTestIds: number[] = [];
      let accessTokenForResults: string | null = null;
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
        attemptedTestIds = mockRes.data.map((a) => a.mock_test_id);
        setTestAttempted(new Set(attemptedTestIds));
      } else {
        setMockStat({ scored: 0, total: 0 });
        setTestAttempted(new Set());
        setMcqResultsByTest({});
      }

      if (attemptedTestIds.length > 0) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        accessTokenForResults = accessToken ?? null;

        if (accessToken) {
          const response = await fetch("/api/student/test-results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ testIds: attemptedTestIds }),
          });

          if (response.ok) {
            const data = (await response.json()) as {
              summaries?: Record<string, McqResultSummary>;
            };

            const summaryMap: Record<number, McqResultSummary> = {};
            Object.entries(data.summaries ?? {}).forEach(([key, value]) => {
              summaryMap[Number(key)] = value;
            });
            setMcqResultsByTest(summaryMap);
          }
        }
      }

      /* Published tests visible to this student via RLS */
      if (ids.length > 0) {
        let testsData: unknown[] | null = null;
        let testsError: { code?: string; message?: string } | null = null;

        const fullTestsRes = await supabase
          .from("mock_tests")
          .select(
            "id, title, total_marks, negative_marking, question_paper_file_url, time_limit_minutes, exam_type, test_type, created_by, scheduled_at, available_until, is_published, batch_id, courses(title), batches(batch_name)",
          )
          .in("batch_id", ids)
          .eq("is_published", true)
          .order("scheduled_at", { ascending: true });

        testsData = fullTestsRes.data as unknown[] | null;
        testsError = fullTestsRes.error as {
          code?: string;
          message?: string;
        } | null;

        if (testsError?.code === "42703") {
          const fallbackTestsRes = await supabase
            .from("mock_tests")
            .select(
              "id, title, total_marks, time_limit_minutes, exam_type, test_type, created_by, scheduled_at, is_published, batch_id, courses(title), batches(batch_name)",
            )
            .in("batch_id", ids)
            .eq("is_published", true)
            .order("scheduled_at", { ascending: true });

          testsData = (
            (fallbackTestsRes.data ?? []) as Record<string, unknown>[]
          ).map((test) => ({
            ...test,
            negative_marking: 0,
            available_until: null,
            question_paper_file_url: null,
          }));
          testsError = fallbackTestsRes.error as {
            code?: string;
            message?: string;
          } | null;
        }

        console.log(
          "[student-tests] batch ids:",
          ids,
          "| data:",
          testsData,
          "| error:",
          testsError,
        );
        if (testsData) {
          const now = new Date();
          const allPublishedTests = testsData as unknown as McqTest[];
          const enrolledBatchIdSet = new Set(ids);
          const batchScopedTests = allPublishedTests.filter(
            (test) =>
              test.batch_id != null && enrolledBatchIdSet.has(test.batch_id),
          );

          // Filter tests based on availability window
          const availableNow = batchScopedTests.filter((test) => {
            if (!test.scheduled_at) return true; // Tests without scheduled_at are always available
            const scheduledTime = new Date(test.scheduled_at);
            if (scheduledTime > now) return false; // Not started yet

            // Check 48-hour availability window
            if (test.available_until) {
              const availableUntilTime = new Date(test.available_until);
              return now <= availableUntilTime; // Still within 48-hour window
            }
            // If no available_until set, assume test is available (backward compatibility)
            return true;
          });

          const upcoming = batchScopedTests.filter(
            (test) => !!test.scheduled_at && new Date(test.scheduled_at) > now,
          );

          // Expired tests (past their 48-hour window)
          const expired = batchScopedTests.filter((test) => {
            if (!test.available_until) return false;
            return new Date(test.available_until) < now;
          });

          const mcqTests = availableNow.filter(
            (t) => t.test_type !== "descriptive",
          );
          const descTests = availableNow.filter(
            (t) => t.test_type === "descriptive",
          );
          setAvailableTests(mcqTests);
          setDescriptiveTests(descTests);
          setUpcomingTests(upcoming);

          const creatorIds = Array.from(
            new Set(
              batchScopedTests.map((t) => t.created_by).filter((id) => !!id),
            ),
          );
          if (creatorIds.length > 0) {
            const { data: creatorsData } = await supabase
              .from("profiles")
              .select("user_id, full_name")
              .in("user_id", creatorIds);
            if (creatorsData) {
              const nameMap: Record<string, string> = {};
              (
                creatorsData as unknown as {
                  user_id: string;
                  full_name: string;
                }[]
              ).forEach((r) => {
                nameMap[r.user_id] = r.full_name;
              });
              setFacultyNameById(nameMap);
            }
          }

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

            const descriptiveResultTestIds = Array.from(
              new Set(
                (answersData as unknown as DescriptiveAnswer[])
                  .filter((answer) => answer.marks_obtained !== null)
                  .map((answer) => answer.mock_test_id),
              ),
            );

            if (descriptiveResultTestIds.length > 0) {
              const accessToken =
                accessTokenForResults ??
                (await supabase.auth.getSession()).data.session?.access_token ??
                null;

              if (accessToken) {
                const response = await fetch("/api/student/test-results", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ testIds: descriptiveResultTestIds }),
                });

                if (response.ok) {
                  const data = (await response.json()) as {
                    summaries?: Record<string, McqResultSummary>;
                  };

                  const summaryMap: Record<number, McqResultSummary> = {};
                  Object.entries(data.summaries ?? {}).forEach(
                    ([key, value]) => {
                      summaryMap[Number(key)] = value;
                    },
                  );

                  setMcqResultsByTest((prev) => ({
                    ...prev,
                    ...summaryMap,
                  }));
                }
              }
            }
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      void load();
    }, 15 * 1000);

    return () => clearInterval(intervalId);
  }, [load]);

  async function handleLogout() {
    await signOut("student");
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
        .select(
          "id, question_text, question_order, marks, option_a, option_b, option_c, option_d, correct_option",
        )
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
      const negativePerWrong = Number(activeTest.test.negative_marking ?? 0);
      const correctMarks = answers.reduce((sum, answer) => {
        if (!answer.is_correct) return sum;
        const qMarks = Number(
          activeTest.questions.find((q) => q.id === answer.question_id)
            ?.marks ?? 1,
        );
        return sum + qMarks;
      }, 0);
      const wrongAttempts = answers.filter(
        (answer) => answer.chosen_option !== null && !answer.is_correct,
      ).length;
      const penalty = wrongAttempts * negativePerWrong;
      const rawScore =
        negativePerWrong > 0 ? correctMarks - penalty : correctMarks;
      const scored =
        negativePerWrong > 0 ? Number(rawScore.toFixed(2)) : rawScore;
      await supabase.from("mock_test_attempts").upsert(
        {
          mock_test_id: activeTest.test.id,
          student_user_id: user.id,
          scored_marks: scored,
        },
        { onConflict: "mock_test_id,student_user_id" },
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      let summary: McqResultSummary = {
        score: scored,
        rank: null,
        participantCount: 1,
      };

      if (accessToken) {
        const response = await fetch("/api/student/test-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ testIds: [activeTest.test.id] }),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            summaries?: Record<string, McqResultSummary>;
          };
          summary = data.summaries?.[String(activeTest.test.id)] ?? summary;
        }
      }

      setMcqResultsByTest((prev) => ({
        ...prev,
        [activeTest.test.id]: summary,
      }));
      setReviewTest({
        test: activeTest.test,
        summary,
        questions: activeTest.questions.map((question) => {
          const detail = qWithAnswers?.find((item) => item.id === question.id);
          const chosenOption =
            (testAnswers[question.id] as "A" | "B" | "C" | "D" | undefined) ??
            null;
          const correctOption =
            (detail?.correct_option as "A" | "B" | "C" | "D" | undefined) ??
            null;
          return {
            ...question,
            correct_option: correctOption,
            chosen_option: chosenOption,
            is_correct:
              chosenOption !== null && correctOption !== null
                ? chosenOption === correctOption
                : false,
          };
        }),
      });
      setTestSubmitted(true);
      setTestAttempted((prev) => new Set([...prev, activeTest.test.id]));
    } finally {
      setTestSubmitting(false);
    }
  }, [activeTest, testAnswers]);

  useEffect(() => {
    if (!activeTest || testSubmitted) {
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
  }, [activeTest, testSubmitted, handleSubmitTest]);

  async function startTest(test: McqTest) {
    const isAccessible = availableTests.some((t) => t.id === test.id);
    if (!isAccessible) {
      alert("This test is not available for your enrolled batch.");
      return;
    }

    const now = new Date();

    // Check if test hasn't started yet
    if (test.scheduled_at && new Date(test.scheduled_at) > now) {
      alert(
        `This test will be available from ${fmtDateTime(test.scheduled_at)}`,
      );
      return;
    }

    // Check if test is past the 48-hour availability window
    if (test.available_until && new Date(test.available_until) < now) {
      alert(
        `This test is no longer available. It was available for 48 hours from ${fmtDateTime(test.scheduled_at)}.`,
      );
      return;
    }

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
    setTestSubmitted(false);
    setTimerSecs(test.time_limit_minutes * 60);
  }

  async function openMcqReview(test: McqTest) {
    const isAccessibleNow =
      availableTests.some((t) => t.id === test.id) ||
      upcomingTests.some((t) => t.id === test.id);
    if (!isAccessibleNow) {
      alert("This test is not available for your enrolled batch.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [questionsRes, answersRes] = await Promise.all([
      supabase
        .from("mcq_questions")
        .select(
          "id, question_text, question_order, marks, option_a, option_b, option_c, option_d, correct_option",
        )
        .eq("mock_test_id", test.id)
        .order("question_order", { ascending: true }),
      supabase
        .from("mcq_student_answers")
        .select("question_id, chosen_option, is_correct")
        .eq("mock_test_id", test.id)
        .eq("student_user_id", user.id),
    ]);

    if (questionsRes.error || !questionsRes.data) {
      alert("Failed to load test review.");
      return;
    }

    const answerMap = new Map(
      (answersRes.data ?? []).map((row) => [
        row.question_id,
        {
          chosen_option: row.chosen_option as "A" | "B" | "C" | "D" | null,
          is_correct: !!row.is_correct,
        },
      ]),
    );

    setReviewTest({
      test,
      summary: mcqResultsByTest[test.id] ?? null,
      questions: (questionsRes.data as McqQuestion[]).map((question) => {
        const answer = answerMap.get(question.id);
        return {
          ...question,
          correct_option: question.correct_option ?? null,
          chosen_option: answer?.chosen_option ?? null,
          is_correct: answer?.is_correct ?? false,
        };
      }),
    });
  }

  async function loadDescriptiveQuestions(test: McqTest) {
    const isAccessible = descriptiveTests.some((t) => t.id === test.id);
    if (!isAccessible) {
      setUploadMsg({
        type: "err",
        text: "This descriptive test is not available for your enrolled batch.",
      });
      return;
    }

    const now = new Date();
    setUploadMsg(null);

    // Check if test has started (if scheduled_at is set)
    if (test.scheduled_at) {
      const scheduledTime = new Date(test.scheduled_at);
      if (now < scheduledTime) {
        setUploadMsg({
          type: "err",
          text: `This test will be available from ${fmtDateTime(test.scheduled_at)}`,
        });
        return;
      }
    }

    // Check if test is past the 48-hour availability window
    if (test.available_until) {
      const availableUntilTime = new Date(test.available_until);
      if (now > availableUntilTime) {
        setUploadMsg({
          type: "err",
          text: `This test is no longer available. It was available for 48 hours from ${fmtDateTime(test.scheduled_at)}.`,
        });
        return;
      }
    }

    setDescriptiveQuestions([]);
    setSelectedDescriptiveTest(test);
    setFullSheetFileName("No File Choosen");
  }

  async function handleFullSheetUpload(file: File | null) {
    if (!file || !selectedDescriptiveTest) return;

    const isAccessible = descriptiveTests.some(
      (t) => t.id === selectedDescriptiveTest.id,
    );
    if (!isAccessible) {
      setUploadMsg({
        type: "err",
        text: "This descriptive test is not available for your enrolled batch.",
      });
      return;
    }

    setFullSheetFileName(file.name);

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setUploadMsg({
        type: "err",
        text: "Please upload only a PDF file for the full answer sheet.",
      });
      return;
    }

    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!user.user) return;
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setUploadMsg({
        type: "err",
        text: "Session expired. Please sign in again.",
      });
      return;
    }

    setUploadingFullSheet(true);
    setUploadMsg(null);

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("mockTestId", String(selectedDescriptiveTest.id));
      payload.append("scope", "full");

      const uploadResponse = await fetch("/api/descriptive-upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: payload,
      });

      const uploadJson = (await uploadResponse.json()) as {
        publicUrl?: string;
        error?: string;
      };

      if (!uploadResponse.ok || !uploadJson.publicUrl) {
        throw new Error(uploadJson.error || "Upload failed");
      }

      const submittedAt = new Date().toISOString();

      // PDF-only descriptive flow: one combined answer sheet per student per test.
      await supabase
        .from("descriptive_student_answers")
        .delete()
        .eq("mock_test_id", selectedDescriptiveTest.id)
        .eq("student_user_id", user.user!.id)
        .is("question_id", null);

      const { error: answerError } = await supabase
        .from("descriptive_student_answers")
        .insert({
          mock_test_id: selectedDescriptiveTest.id,
          student_user_id: user.user!.id,
          question_id: null,
          answer_file_url: uploadJson.publicUrl,
          submitted_at: submittedAt,
        });

      if (answerError) throw answerError;

      const { data: updatedAnswers } = await supabase
        .from("descriptive_student_answers")
        .select("*")
        .eq("student_user_id", user.user!.id)
        .eq("mock_test_id", selectedDescriptiveTest.id);

      if (updatedAnswers) {
        setDescriptiveAnswers((prev) => [
          ...prev.filter((a) => a.mock_test_id !== selectedDescriptiveTest.id),
          ...(updatedAnswers as unknown as DescriptiveAnswer[]),
        ]);
      }

      setFullSheetFileName("No File Choosen");
      setUploadMsg({
        type: "ok",
        text: "Answer sheet submitted successfully! Your faculty will review it shortly.",
      });
    } catch (err) {
      const fallback = "Failed to upload full answer sheet.";
      const messageFromObject =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message || "")
          : "";
      const message =
        err instanceof Error
          ? err.message || fallback
          : messageFromObject || fallback;
      setUploadMsg({
        type: "err",
        text: message,
      });
    } finally {
      setUploadingFullSheet(false);
    }
  }

  async function handleRemoveFullSheetUpload() {
    if (!selectedDescriptiveTest) return;

    const isAccessible = descriptiveTests.some(
      (t) => t.id === selectedDescriptiveTest.id,
    );
    if (!isAccessible) {
      setUploadMsg({
        type: "err",
        text: "This descriptive test is not available for your enrolled batch.",
      });
      return;
    }

    const shouldRemove = confirm(
      "Remove your current uploaded answer sheet? You can upload a new PDF after removing it.",
    );
    if (!shouldRemove) return;

    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setUploadMsg({
        type: "err",
        text: "Session expired. Please sign in again.",
      });
      return;
    }

    setUploadingFullSheet(true);
    setUploadMsg(null);

    try {
      const { error: deleteError } = await supabase
        .from("descriptive_student_answers")
        .delete()
        .eq("student_user_id", user.user.id)
        .eq("mock_test_id", selectedDescriptiveTest.id);

      if (deleteError) throw deleteError;

      const { data: updatedAnswers, error: reloadError } = await supabase
        .from("descriptive_student_answers")
        .select("*")
        .eq("student_user_id", user.user.id)
        .eq("mock_test_id", selectedDescriptiveTest.id);

      if (reloadError) throw reloadError;

      setDescriptiveAnswers((prev) => [
        ...prev.filter((a) => a.mock_test_id !== selectedDescriptiveTest.id),
        ...((updatedAnswers || []) as unknown as DescriptiveAnswer[]),
      ]);

      setFullSheetFileName("No File Choosen");
      setUploadMsg({
        type: "ok",
        text: "Existing answer sheet removed. You can upload a new PDF now.",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to remove existing answer sheet.";
      setUploadMsg({ type: "err", text: message });
    } finally {
      setUploadingFullSheet(false);
    }
  }

  /* â”€â”€ Razorpay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function handlePay() {
    const amt = parseFloat(payAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setPayMsg({ type: "err", text: "Please enter a valid amount." });
      return;
    }

    setPaying(true);
    setPayMsg(null);

    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setPayMsg({
          type: "err",
          text: "Session expired. Please log in again.",
        });
        setPaying(false);
        return;
      }

      /* 1. Create Razorpay order on server */
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt, description: payDesc }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setPayMsg({
          type: "err",
          text: orderData.error || "Failed to create order.",
        });
        setPaying(false);
        return;
      }

      /* 2. Load Razorpay checkout.js */
      await new Promise<void>((resolve, reject) => {
        if ((window as unknown as Record<string, unknown>).Razorpay) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });

      /* 3. Open Razorpay checkout modal */
      await new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const RazorpayCheckout = (window as any).Razorpay;
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "LePearl Education",
          description: payDesc,
          order_id: orderData.order_id,
          prefill: {
            name: profile?.full_name ?? "",
            contact: profile?.phone ?? "",
          },
          theme: { color: "#7c3aed" },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              /* 4. Verify signature + save to DB */
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: orderData.amount,
                  description: payDesc,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                reject(
                  new Error(verifyData.error || "Payment verification failed."),
                );
                return;
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("DISMISSED")),
          },
        };
        new RazorpayCheckout(options).open();
      });

      /* 5. Success – reload payment history */
      setPayMsg({
        type: "ok",
        text: "Payment successful! Your transaction has been recorded.",
      });
      setPayAmount("");
      const { data: newPayments } = await createClient()
        .from("payments")
        .select(
          "id, amount, payment_date, payment_mode, status, razorpay_payment_id, description",
        )
        .eq("student_user_id", userId)
        .order("payment_date", { ascending: false });
      if (newPayments) {
        setPayments(
          mergePaymentHistory(
            newPayments as unknown as Payment[],
            paidRegistration,
          ),
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "DISMISSED") {
        setPayMsg({ type: "err", text: msg });
      } else {
        setPayMsg(null);
      }
    } finally {
      setPaying(false);
    }
  }

  /* â”€â”€ computed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const totalCourseFee = feePlan?.total_fee ?? paidRegistration?.final_payable;
  const pendingAmount = Math.max((totalCourseFee ?? 0) - paidAmount, 0);
  const selectedPlanLabel = paidRegistration?.selected_fee_label
    ? paidRegistration.selected_fee_label
    : paidRegistration?.payment_tenure === "instalment"
      ? "Instalment Plan"
      : paidRegistration?.payment_tenure === "full"
        ? "Full Payment"
        : "Not Recorded";
  const selectedTenureLabel = paidRegistration?.payment_tenure
    ? paidRegistration.payment_tenure === "full"
      ? "Full Payment"
      : "Instalment"
    : "N/A";
  const selectedCourseName =
    paidRegistration?.course?.trim() ||
    courses[0]?.courses?.title ||
    studentProfile?.target_exam ||
    "Not Assigned";
  const assignedFacultyForSelectedCourse =
    facultyByCourseName[normalizeCourseKey(selectedCourseName)] ||
    facultyByCourseName[DEFAULT_FACULTY_KEY] ||
    null;
  const selectedCourseFacultyName =
    assignedFacultyForSelectedCourse ||
    courses.find(
      (course) =>
        course.courses?.title?.trim().toLowerCase() ===
        selectedCourseName.trim().toLowerCase(),
    )?.instructor_name ||
    courses.find((course) => course.instructor_name)?.instructor_name ||
    "Not Assigned";
  const overallProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((s, c) => s + c.progress_percent, 0) / courses.length,
        )
      : 0;
  const liveSessions = classSessions.filter((s) => s.is_live);
  const upcomingSessions = classSessions.filter((s) =>
    isUpcomingSession(s.session_date, s.start_time),
  );
  const recentSessions = classSessions
    .filter((s) => isRecentSession(s.session_date, s.start_time))
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
      {reviewTest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-4 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  {reviewTest.test.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Review answers and correct options
                </p>
              </div>
              <button
                onClick={() => setReviewTest(null)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Score
                  </p>
                  <p className="mt-2 text-2xl font-bold text-green-800">
                    {reviewTest.summary
                      ? `${reviewTest.summary.score}/${reviewTest.test.total_marks}`
                      : `-/${reviewTest.test.total_marks}`}
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Rank
                  </p>
                  <p className="mt-2 text-2xl font-bold text-blue-800">
                    {reviewTest.summary?.rank != null
                      ? `${reviewTest.summary.rank}`
                      : "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Participants
                  </p>
                  <p className="mt-2 text-2xl font-bold text-amber-800">
                    {reviewTest.summary?.participantCount ?? 0}
                  </p>
                </div>
              </div>

              {reviewTest.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <p className="font-semibold text-gray-900 leading-7">
                      <span className="text-purple-600 mr-2">Q{idx + 1}.</span>
                      {shouldIndentMcqQuestion(q.question_text) ? (
                        <span className="block pl-6 mt-1 whitespace-pre-line border-l-2 border-gray-200">
                          {q.question_text}
                        </span>
                      ) : (
                        q.question_text
                      )}
                    </p>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${q.is_correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {q.is_correct
                        ? "Correct"
                        : q.chosen_option
                          ? "Incorrect"
                          : "Not Answered"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(["A", "B", "C", "D"] as const).map((opt) => {
                      const isCorrect = q.correct_option === opt;
                      const isChosen = q.chosen_option === opt;
                      return (
                        <div
                          key={opt}
                          className={`rounded-xl border p-3 text-sm ${isCorrect ? "border-green-300 bg-green-50" : isChosen ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-gray-800">
                              <strong className="text-purple-600">
                                {opt}.
                              </strong>{" "}
                              {optionText(q, opt)}
                            </span>
                            <span className="shrink-0 text-[11px] font-semibold text-gray-600">
                              {isCorrect
                                ? "Correct Answer"
                                : isChosen
                                  ? "Your Answer"
                                  : ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ MCQ TEST OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTest && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="h-screen w-screen bg-white flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between z-10">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  {activeTest.test.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTest.questions.length} questions |{" "}
                  {activeTest.test.total_marks} marks
                </p>
              </div>
              {testSubmitted ? (
                <button
                  onClick={() => {
                    setActiveTest(null);
                    setTestSubmitted(false);
                  }}
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

            {testSubmitted ? (
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-100 text-green-700">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Test submitted successfully
                </h3>
                <p className="text-gray-600 mb-6">
                  Your MCQ result is available now. You can review your marks,
                  rank, and the correct answers.
                </p>
                <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto mb-6 text-left">
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Score
                    </p>
                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {mcqResultsByTest[activeTest.test.id]
                        ? `${mcqResultsByTest[activeTest.test.id].score}/${activeTest.test.total_marks}`
                        : `-/${activeTest.test.total_marks}`}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Rank
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-800">
                      {mcqResultsByTest[activeTest.test.id]?.rank != null
                        ? mcqResultsByTest[activeTest.test.id].rank
                        : "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Participants
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-800">
                      {mcqResultsByTest[activeTest.test.id]?.participantCount ??
                        0}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={async () => {
                      await openMcqReview(activeTest.test);
                      setActiveTest(null);
                      setTestSubmitted(false);
                    }}
                    className="px-8 py-3 bg-white border border-purple-200 text-purple-700 rounded-xl font-semibold"
                  >
                    Review Answers
                  </button>
                  <button
                    onClick={() => {
                      setActiveTest(null);
                      setTestSubmitted(false);
                    }}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {activeTest.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                  >
                    <p className="font-semibold text-gray-900 mb-3 leading-7">
                      <span className="text-purple-600 mr-2">Q{idx + 1}.</span>
                      {shouldIndentMcqQuestion(q.question_text) ? (
                        <span className="block pl-6 mt-1 whitespace-pre-line border-l-2 border-purple-200">
                          {q.question_text}
                        </span>
                      ) : (
                        q.question_text
                      )}
                      <span className="ml-2 text-xs text-gray-500 align-middle">
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
                <div className="w-14 h-14 rounded-full bg-purple-200 overflow-hidden flex items-center justify-center text-purple-700 font-bold text-xl">
                  {profilePhotoPreview ? (
                    // Local preview keeps student profile image available without backend migration.
                    <Image
                      src={profilePhotoPreview}
                      alt="Profile"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>{profile?.full_name?.charAt(0) ?? "S"}</>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {profile?.full_name ?? "Student"}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {studentProfile?.registration_no ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    User-ID: {userId ? userId.slice(0, 8).toUpperCase() : "N/A"}
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
                  section="studyMaterials"
                  active={activeSection}
                  onClick={setActiveSection}
                  icon={BookOpen}
                  label="Study Material"
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
                      Welcome, {profile?.full_name ?? "Student"}!
                    </h1>
                    <p className="text-purple-200 text-sm">
                      Here&apos;s your learning journey at a glance
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Registration Number
                      </p>
                      <p className="mt-1 text-base font-bold text-gray-900 break-all">
                        {studentProfile?.registration_no ?? "Pending"}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        User-ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-purple-700 break-all">
                        {userId || "Pending"}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Faculty Name
                      </p>
                      <p className="mt-1 text-base font-bold text-gray-900 break-words">
                        {selectedCourseFacultyName}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Course Name
                      </p>
                      <p className="mt-1 text-sm font-semibold text-indigo-700 break-words">
                        {selectedCourseName}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Profile Picture
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Upload your profile photo for dashboard personalization.
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <label
                          htmlFor="student-profile-photo-upload"
                          className="inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Upload Picture
                        </label>
                        {profilePhotoPreview && (
                          <button
                            type="button"
                            onClick={handleRemoveProfilePhoto}
                            className="inline-flex items-center rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                          >
                            Remove Picture
                          </button>
                        )}
                        <span className="text-xs text-gray-600 truncate">
                          {profilePhotoFileName || "No File Choosen"}
                        </span>
                      </div>
                      <input
                        id="student-profile-photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleProfilePhotoChange(e.target.files?.[0] ?? null)
                        }
                        className="hidden"
                      />
                      {profilePhotoMsg && (
                        <p className="mt-2 text-xs text-emerald-700">
                          {profilePhotoMsg}
                        </p>
                      )}
                    </div>
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
                        {(() => {
                          const currentSubmission = descriptiveAnswers.find(
                            (a) =>
                              a.mock_test_id === selectedDescriptiveTest.id &&
                              !!a.answer_file_url,
                          );

                          if (!currentSubmission?.answer_file_url) {
                            return null;
                          }

                          return (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <a
                                  href={currentSubmission.answer_file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  View Current Uploaded Answer Sheet
                                </a>
                                <button
                                  type="button"
                                  disabled={uploadingFullSheet}
                                  onClick={() => {
                                    void handleRemoveFullSheetUpload();
                                  }}
                                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${uploadingFullSheet ? "cursor-not-allowed bg-gray-200 text-gray-500" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Remove
                                  Existing File
                                </button>
                              </div>

                              {(currentSubmission.evaluated_answer_file_url ||
                                currentSubmission.marks_obtained !== null ||
                                currentSubmission.faculty_notes) && (
                                <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3">
                                  <p className="text-xs font-semibold text-emerald-700">
                                    Faculty Evaluation
                                  </p>
                                  {currentSubmission.evaluated_answer_file_url && (
                                    <a
                                      href={
                                        currentSubmission.evaluated_answer_file_url
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      View Evaluated Answer Sheet
                                    </a>
                                  )}
                                  {currentSubmission.marks_obtained !==
                                    null && (
                                    <p className="mt-2 text-xs text-gray-700">
                                      <span className="font-semibold">
                                        Marks Obtained:
                                      </span>{" "}
                                      {currentSubmission.marks_obtained}/
                                      {selectedDescriptiveTest.total_marks}
                                    </p>
                                  )}
                                  {currentSubmission.faculty_notes && (
                                    <p className="mt-1 text-xs text-gray-700">
                                      <span className="font-semibold">
                                        Faculty Feedback:
                                      </span>{" "}
                                      {currentSubmission.faculty_notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {uploadMsg && (
                          <div
                            className={`p-3 rounded-lg text-sm ${uploadMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                          >
                            {uploadMsg.text}
                          </div>
                        )}

                        <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                          <p className="text-sm font-semibold text-blue-900">
                            Descriptive Question Paper
                          </p>
                          {selectedDescriptiveTest.question_paper_file_url ? (
                            <a
                              href={
                                selectedDescriptiveTest.question_paper_file_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-600 to-slate-700 px-3 py-1.5 text-xs font-semibold !text-white hover:from-emerald-700 hover:to-slate-800 hover:!text-white"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> View /
                              Download Question Paper
                            </a>
                          ) : (
                            <p className="mt-1 text-xs text-blue-700">
                              Question paper will be uploaded by faculty soon.
                            </p>
                          )}
                        </div>

                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-600">
                          Read the question paper and upload one combined PDF
                          answer sheet using the section below.
                        </div>

                        <div className="mt-2 border border-gray-200 rounded-xl p-4 bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900">
                            Upload Full Answer Sheet (PDF)
                          </p>
                          <p className="text-xs text-gray-600 mt-1 mb-3">
                            Upload one combined PDF at the end; it will be
                            submitted for all descriptive questions.
                          </p>
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="descriptive-full-sheet-upload"
                              className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold text-white ${uploadingFullSheet ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                            >
                              Upload Answer Sheet
                            </label>
                            <span className="text-xs text-gray-600 truncate">
                              {fullSheetFileName || "No File Choosen"}
                            </span>
                          </div>
                          <input
                            id="descriptive-full-sheet-upload"
                            type="file"
                            accept=".pdf,application/pdf"
                            disabled={uploadingFullSheet}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                void handleFullSheetUpload(e.target.files[0]);
                              } else {
                                setFullSheetFileName("No File Choosen");
                              }
                              e.currentTarget.value = "";
                            }}
                            className="hidden"
                          />
                          {uploadingFullSheet && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading full answer sheet...
                            </div>
                          )}
                          {uploadMsg && (
                            <p
                              className={`mt-2 text-xs font-semibold ${
                                uploadMsg.type === "ok"
                                  ? "text-green-700"
                                  : "text-red-600"
                              }`}
                            >
                              {uploadMsg.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : availableTests.length === 0 &&
                    descriptiveTests.length === 0 &&
                    upcomingTests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                      <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No tests available right now. Check back later.
                      </p>
                    </div>
                  ) : (
                    <>
                      {availableTests.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {availableTests.map((t) => {
                            const attempted = testAttempted.has(t.id);
                            const result = mcqResultsByTest[t.id];
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
                                      {fmtDateTime(t.scheduled_at)}
                                    </span>
                                  )}
                                </div>
                                {attempted ? (
                                  <div className="space-y-3">
                                    <div className="w-full py-2 text-center text-sm font-semibold text-green-600 bg-green-50 rounded-xl flex items-center justify-center gap-2">
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Completed</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                          Marks
                                        </p>
                                        <p className="text-base font-bold text-gray-900 mt-1">
                                          {result
                                            ? `${result.score}/${t.total_marks}`
                                            : `-/${t.total_marks}`}
                                        </p>
                                      </div>
                                      <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                          Rank
                                        </p>
                                        <p className="text-base font-bold text-gray-900 mt-1">
                                          {result?.rank != null
                                            ? `${result.rank}/${result.participantCount}`
                                            : "-"}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => void openMcqReview(t)}
                                      className="w-full py-2 bg-white border border-purple-200 text-purple-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                      <ChevronRight className="w-4 h-4" />{" "}
                                      Review Result
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startTest(t)}
                                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                  >
                                    <ChevronRight className="w-4 h-4" /> Start
                                    Test
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {descriptiveTests.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 mt-4">
                          <h2 className="font-bold text-gray-900 mb-3">
                            Descriptive Tests
                          </h2>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {descriptiveTests.map((t) => {
                              const result = mcqResultsByTest[t.id];
                              const testAnswers = descriptiveAnswers.filter(
                                (a) => a.mock_test_id === t.id,
                              );
                              const submittedAnswers = testAnswers.filter(
                                (a) => !!a.answer_file_url || !!a.submitted_at,
                              );
                              const currentSubmission = submittedAnswers.find(
                                (a) => !!a.answer_file_url,
                              );
                              const evaluatedAnswers = submittedAnswers.filter(
                                (a) => a.marks_obtained !== null,
                              );
                              const isEvaluated =
                                submittedAnswers.length > 0 &&
                                evaluatedAnswers.length ===
                                  submittedAnswers.length;
                              const isSubmitted =
                                submittedAnswers.length > 0 && !isEvaluated;
                              const totalObtained = evaluatedAnswers.reduce(
                                (sum, a) => sum + (a.marks_obtained ?? 0),
                                0,
                              );
                              return (
                                <div
                                  key={t.id}
                                  className={`rounded-xl border p-4 ${isEvaluated ? "border-green-200 bg-green-50" : isSubmitted ? "border-amber-200 bg-amber-50" : "border-blue-100 bg-blue-50"}`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-200 text-blue-800">
                                        Descriptive
                                      </span>
                                      <h3 className="font-bold text-gray-900 mt-2 text-sm">
                                        {t.title}
                                      </h3>
                                      <p className="text-xs text-gray-600 mt-1">
                                        {unwrapOne(t.courses)?.title ?? ""}
                                      </p>
                                    </div>
                                    {isEvaluated && (
                                      <div className="text-right shrink-0">
                                        <p className="text-lg font-bold text-green-600">
                                          {totalObtained}/{t.total_marks}
                                        </p>
                                        <p className="text-xs text-green-600">
                                          Score
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-3 mb-4">
                                    <span className="flex items-center gap-1">
                                      <BookMarked className="w-3.5 h-3.5" />
                                      {t.total_marks} marks
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Timer className="w-3.5 h-3.5" />
                                      {t.time_limit_minutes} min
                                    </span>
                                  </div>
                                  {isEvaluated ? (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-xl bg-white/80 border border-green-200 p-3">
                                          <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                            Score
                                          </p>
                                          <p className="text-base font-bold text-gray-900 mt-1">
                                            {totalObtained}/{t.total_marks}
                                          </p>
                                        </div>
                                        <div className="rounded-xl bg-white/80 border border-green-200 p-3">
                                          <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                            Rank
                                          </p>
                                          <p className="text-base font-bold text-gray-900 mt-1">
                                            {result?.rank != null
                                              ? `${result.rank}/${result.participantCount}`
                                              : "-"}
                                          </p>
                                        </div>
                                      </div>
                                      {currentSubmission?.evaluated_answer_file_url && (
                                        <a
                                          href={
                                            currentSubmission.evaluated_answer_file_url
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="w-full py-2 bg-gradient-to-r from-emerald-600 to-slate-700 !text-white hover:!text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                          Evaluated Answer Sheet
                                        </a>
                                      )}
                                      <div className="w-full py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />{" "}
                                        Completed
                                      </div>
                                    </div>
                                  ) : isSubmitted ? (
                                    <div className="flex gap-2">
                                      <div className="flex-1 py-2 bg-amber-100 text-amber-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
                                        <Timer className="w-4 h-4" /> Pending
                                        Review
                                      </div>
                                      <button
                                        onClick={() =>
                                          loadDescriptiveQuestions(t)
                                        }
                                        className="px-3 py-2 border border-blue-300 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                                      >
                                        View
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        loadDescriptiveQuestions(t)
                                      }
                                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                      <ChevronRight className="w-4 h-4" /> Open
                                      Test
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {upcomingTests.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 mt-4">
                          <h2 className="font-bold text-gray-900 mb-3">
                            Upcoming Tests
                          </h2>
                          <div className="space-y-3">
                            {upcomingTests.map((t) => (
                              <div
                                key={t.id}
                                className="border border-amber-200 bg-amber-50 rounded-xl p-4"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {t.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {unwrapOne(t.courses)?.title ?? ""}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Batch:{" "}
                                      {unwrapOne(t.batches)?.batch_name ?? "-"}
                                      {facultyNameById[t.created_by]
                                        ? ` | Published by: ${facultyNameById[t.created_by]}`
                                        : ""}
                                    </p>
                                  </div>
                                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                    {t.test_type === "descriptive"
                                      ? "Descriptive"
                                      : "MCQ"}
                                  </span>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <BookMarked className="w-3.5 h-3.5" />
                                    {t.total_marks} marks
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Timer className="w-3.5 h-3.5" />
                                    {t.time_limit_minutes} min
                                  </span>
                                  {t.scheduled_at && (
                                    <span className="flex items-center gap-1 font-semibold text-amber-700">
                                      <Clock className="w-3.5 h-3.5" />
                                      Starts: {fmtDateTime(t.scheduled_at)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
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
                          const isToday = s.session_date === localDateKey();
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
                                  {s.start_time && (
                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                                      Starts at {fmtTime(s.start_time)}
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
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 !text-white text-xs font-semibold rounded-xl hover:bg-blue-700 whitespace-nowrap"
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
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 !text-white text-xs font-semibold rounded-xl hover:bg-gray-800 whitespace-nowrap"
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
                              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 !text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
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

              {/* ══ STUDY MATERIAL ═════════════════════════ */}
              {activeSection === "studyMaterials" && (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-1">Study Material</h1>
                    <p className="text-blue-100 text-sm">
                      Click any item to open notes and study resources in Google
                      Drive
                    </p>
                  </div>
                  {studyMaterials.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No study material available yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {studyMaterials.map((material) => {
                        const batch = unwrapOne(material.batches);
                        const course = unwrapOne(batch?.courses);
                        return (
                          <div
                            key={material.id}
                            className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                  {material.title}
                                </h3>
                                {material.subject && (
                                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                                    {material.subject}
                                  </p>
                                )}
                                {course?.title && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {course.title}
                                  </p>
                                )}
                                {material.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {material.description}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {fmtDate(material.created_at)}
                                </p>
                              </div>
                            </div>
                            <a
                              href={material.drive_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 !text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
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
                      {useUpiQrPayment
                        ? "Temporary UPI QR payment mode is active while Razorpay issue is being resolved"
                        : "Pay securely via Razorpay | All transactions are encrypted"}
                    </p>
                  </div>
                  {feePlan && (
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">
                          Total Course Fee
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {fmtCurrency(totalCourseFee ?? feePlan.total_fee)}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">Total Paid</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {fmtCurrency(paidAmount)}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">Pending Fee</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                          {fmtCurrency(pendingAmount)}
                        </p>
                        {feePlan.next_due_date && pendingAmount > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            Due: {fmtDate(feePlan.next_due_date)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {paidRegistration && (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">
                          Selected Payment Plan
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {selectedPlanLabel}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tenure: {selectedTenureLabel}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">
                          Registration Number
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1 break-all">
                          {paidRegistration.registration_no ??
                            studentProfile?.registration_no ??
                            "Pending"}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">Payment Mode</p>
                        <p className="text-lg font-bold text-gray-900 mt-1 capitalize">
                          {paidRegistration.payment_mode ?? "razorpay"}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm p-5">
                        <p className="text-xs text-gray-500">
                          Registration Status
                        </p>
                        <p className="text-lg font-bold text-emerald-600 mt-1 capitalize">
                          {paidRegistration.payment_status ??
                            paidRegistration.status ??
                            "pending"}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4">
                      Make a Payment
                    </h2>
                    {useUpiQrPayment ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Please scan the UPI QR code below, complete the
                          payment, and keep the transaction screenshot/UTR for
                          confirmation.
                        </p>
                        <div className="max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <Image
                            src="/QR_Code_Payment.jpeg"
                            alt="UPI payment QR code"
                            width={640}
                            height={640}
                            className="h-auto w-full rounded-xl border border-amber-200 bg-white"
                            priority
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Razorpay checkout will be enabled again once the
                          gateway issue is resolved.
                        </p>
                      </div>
                    ) : (
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
                    )}
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
                              <th className="pb-2 font-semibold">
                                Transaction ID
                              </th>
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
                                <td className="py-3 text-gray-500 font-mono text-xs">
                                  {p.razorpay_payment_id ?? "-"}
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
