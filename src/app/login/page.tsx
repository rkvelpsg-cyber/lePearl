// @ts-nocheck
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  TrendingUp,
  Calendar,
  Video,
  PlayCircle,
  LogOut,
  Bell,
  Menu,
  X,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Download,
  User,
  Clock,
  Award,
  Target,
  XCircle,
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const studentData = {
  id: "STU2024-NTA-00847",
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  photo:
    "https://images.unsplash.com/photo-1600178572204-6ac8886aae63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MjA3MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  registrationNumber: "NTA-2024-847",
  registrationDate: "2024-01-15",
  enrolledCourses: [
    {
      id: 1,
      name: "NTA NET Paper 1",
      duration: "6 months",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      examDate: "NTA NET June 2025",
      progress: 68,
      instructor: "Dr. Rajesh Kumar",
      status: "active",
    },
    {
      id: 2,
      name: "NTA NET Paper 2 (English)",
      duration: "6 months",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      examDate: "NTA NET June 2025",
      progress: 72,
      instructor: "Prof. Meera Singh",
      status: "active",
    },
    {
      id: 3,
      name: "Assistant Professor Preparation",
      duration: "8 months",
      startDate: "2024-02-01",
      endDate: "2024-10-01",
      examDate: "University Recruitment 2025",
      progress: 55,
      instructor: "Dr. Anil Verma",
      status: "active",
    },
  ],
  fees: {
    totalAmount: 45000,
    paidAmount: 30000,
    pendingAmount: 15000,
    nextDueDate: "2025-04-30",
    paymentHistory: [
      { date: "2024-01-15", amount: 15000, method: "UPI", status: "Paid" },
      {
        date: "2024-02-15",
        amount: 15000,
        method: "Credit Card",
        status: "Paid",
      },
    ],
  },
  currentScores: [
    {
      subject: "NTA NET Paper 1",
      score: 75,
      maxScore: 100,
      test: "Mock Test 5",
    },
    {
      subject: "NTA NET Paper 2 (English)",
      score: 82,
      maxScore: 100,
      test: "Mock Test 4",
    },
    {
      subject: "Assistant Professor Prep",
      score: 68,
      maxScore: 100,
      test: "Mock Test 3",
    },
  ],
  pastScores: [
    {
      date: "2024-02-20",
      subject: "NTA NET Paper 1",
      score: 65,
      test: "Mock Test 1",
    },
    {
      date: "2024-03-05",
      subject: "NTA NET Paper 1",
      score: 70,
      test: "Mock Test 2",
    },
    {
      date: "2024-03-20",
      subject: "NTA NET Paper 1",
      score: 72,
      test: "Mock Test 3",
    },
    {
      date: "2024-04-05",
      subject: "NTA NET Paper 1",
      score: 73,
      test: "Mock Test 4",
    },
    {
      date: "2024-04-20",
      subject: "NTA NET Paper 1",
      score: 75,
      test: "Mock Test 5",
    },
    {
      date: "2024-02-22",
      subject: "NTA NET Paper 2 (English)",
      score: 70,
      test: "Mock Test 1",
    },
    {
      date: "2024-03-08",
      subject: "NTA NET Paper 2 (English)",
      score: 75,
      test: "Mock Test 2",
    },
    {
      date: "2024-03-25",
      subject: "NTA NET Paper 2 (English)",
      score: 78,
      test: "Mock Test 3",
    },
    {
      date: "2024-04-10",
      subject: "NTA NET Paper 2 (English)",
      score: 82,
      test: "Mock Test 4",
    },
  ],
  attendance: {
    totalClasses: 120,
    attended: 108,
    percentage: 90,
    monthlyData: [
      { month: "Jan", attended: 18, total: 20 },
      { month: "Feb", attended: 20, total: 22 },
      { month: "Mar", attended: 22, total: 24 },
      { month: "Apr", attended: 21, total: 23 },
      { month: "May", attended: 19, total: 20 },
      { month: "Jun", attended: 8, total: 11 },
    ],
  },
  liveClasses: [
    {
      id: 1,
      title: "NTA NET Paper 1 - Teaching Aptitude",
      instructor: "Dr. Rajesh Kumar",
      date: "2025-03-23",
      time: "10:00 AM - 12:00 PM",
      meetingLink: "https://meet.example.com/live-class-1",
      status: "upcoming",
    },
    {
      id: 2,
      title: "English Literature - Modernism",
      instructor: "Prof. Meera Singh",
      date: "2025-03-23",
      time: "3:00 PM - 5:00 PM",
      meetingLink: "https://meet.example.com/live-class-2",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Research Methodology Session",
      instructor: "Dr. Anil Verma",
      date: "2025-03-24",
      time: "11:00 AM - 1:00 PM",
      meetingLink: "https://meet.example.com/live-class-3",
      status: "scheduled",
    },
  ],
  recordedClasses: [
    {
      id: 1,
      title: "NTA NET Paper 1 - Introduction to Teaching Aptitude",
      instructor: "Dr. Rajesh Kumar",
      duration: "2h 15m",
      date: "2024-03-15",
      views: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400",
    },
    {
      id: 2,
      title: "English Literature - Romantic Period Deep Dive",
      instructor: "Prof. Meera Singh",
      duration: "1h 45m",
      date: "2024-03-18",
      views: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    },
    {
      id: 3,
      title: "Research Methodology - Basics and Advanced Concepts",
      instructor: "Dr. Anil Verma",
      duration: "2h 30m",
      date: "2024-03-20",
      views: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    },
    {
      id: 4,
      title: "NTA NET Paper 1 - Communication Skills",
      instructor: "Dr. Rajesh Kumar",
      duration: "2h 00m",
      date: "2024-03-10",
      views: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    },
    {
      id: 5,
      title: "English Poetry Analysis - Victorian Era",
      instructor: "Prof. Meera Singh",
      duration: "1h 50m",
      date: "2024-03-12",
      views: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400",
    },
  ],
};

const Card = ({ children, className = "" }: any) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  onClick,
  disabled,
}: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-indigo-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
  } as const;

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }: any) => (
  <input
    type={type}
    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className = "" }: any) => (
  <label
    htmlFor={htmlFor}
    className={`mb-1 block text-sm font-medium text-gray-700 ${className}`}
  >
    {children}
  </label>
);

const Badge = ({ children, variant = "default", className = "" }: any) => {
  const variantClasses = {
    default: "bg-indigo-100 text-indigo-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 bg-white text-gray-700",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Progress = ({ value, className = "" }: any) => (
  <div
    className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
  >
    <div
      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

const Avatar = ({ children, className = "" }: any) => (
  <div
    className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);

const AvatarImage = ({ src, alt }: any) => (
  <img
    src={src}
    alt={alt}
    className="h-full w-full object-cover object-center"
  />
);

const AvatarFallback = ({ children }: any) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
    {children}
  </div>
);

const toast = {
  success: (message: string, options?: any) => {
    console.log("Success:", message, options);
  },
  error: (message: string, options?: any) => {
    console.log("Error:", message, options);
  },
};

function SoftVideoBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover opacity-25"
      >
        <source src="/LePearlvideo2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/45 via-purple-500/18 to-transparent" />
      <div className="absolute inset-0 bg-white/62 backdrop-blur-[1px]" />
    </div>
  );
}

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-2">
        <div className="hidden text-center md:block">
          <div className="mb-6 flex items-center justify-center">
            <GraduationCap className="h-20 w-20 text-indigo-600" />
          </div>
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-lg bg-blue-900 p-2">
              <img
                src="/WebsiteLogo_final_white.png"
                alt="LePearl Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              LePearl Education
            </h1>
          </div>
          <p className="mb-6 text-lg text-gray-600">
            Your Gateway to Academic Excellence
          </p>
          <div className="mx-auto max-w-md space-y-3 text-left">
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <BookOpen className="h-5 w-5 flex-shrink-0 text-indigo-600" />
              <span className="text-sm text-gray-700">
                NTA NET Paper 1 & Paper 2 (English)
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <BookOpen className="h-5 w-5 flex-shrink-0 text-indigo-600" />
              <span className="text-sm text-gray-700">
                Assistant Professor Preparation
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <BookOpen className="h-5 w-5 flex-shrink-0 text-indigo-600" />
              <span className="text-sm text-gray-700">
                Competitive Exam Coaching
              </span>
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mb-4 flex items-center justify-center md:hidden">
              <GraduationCap className="h-12 w-12 text-indigo-600" />
            </div>
            <CardTitle className="text-center text-2xl">
              Student Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Login to Dashboard
              </Button>
              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Register here
                </a>
              </div>
            </form>
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-center text-xs text-gray-600">
                <strong>Demo credentials:</strong> Any username and password
                will work
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OverviewTab({ data }: any) {
  const overallProgress = Math.round(
    data.enrolledCourses.reduce(
      (acc: number, course: any) => acc + course.progress,
      0,
    ) / data.enrolledCourses.length,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {data.name}!
        </h2>
        <p className="mt-1 text-gray-600">
          Here&apos;s what&apos;s happening with your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {data.enrolledCourses.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {data.attendance.percentage}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {Math.round(
                    data.currentScores.reduce(
                      (acc: number, s: any) => acc + s.score,
                      0,
                    ) / data.currentScores.length,
                  )}
                  %
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {overallProgress}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Current Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.enrolledCourses.map((course: any) => (
              <div
                key={course.id}
                className="space-y-2 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {course.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Instructor: {course.instructor}
                    </p>
                  </div>
                  <Badge variant="secondary">{course.progress}%</Badge>
                </div>
                <Progress value={course.progress} className="h-2.5" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Duration: {course.duration}</span>
                  <span>Exam: {course.examDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Fee Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                <span>Total Fee</span>
                <span>Paid</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-gray-900">
                  ₹{data.fees.totalAmount.toLocaleString()}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{data.fees.paidAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {data.fees.pendingAmount > 0 && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900">
                      Pending Payment
                    </p>
                    <p className="mt-1 text-sm text-orange-700">
                      ₹{data.fees.pendingAmount.toLocaleString()} due by{" "}
                      {new Date(data.fees.nextDueDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-orange-600 hover:bg-orange-700"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h5 className="font-semibold text-gray-700">Recent Payments</h5>
              {data.fees.paymentHistory.map((payment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(payment.date).toLocaleDateString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-500">{payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1 border-green-200 bg-green-50 text-green-700"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Upcoming Live Classes</CardTitle>
            <Video className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.liveClasses.map((liveClass: any) => (
              <div
                key={liveClass.id}
                className="rounded-xl border border-gray-200 p-4 transition-colors hover:border-indigo-300"
              >
                <h4 className="mb-2 font-semibold text-gray-900">
                  {liveClass.title}
                </h4>
                <p className="mb-2 text-sm text-gray-600">
                  {liveClass.instructor}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(liveClass.date).toLocaleDateString("en-IN")}
                </p>
                <p className="mb-4 text-sm text-gray-500">{liveClass.time}</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Join Class
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Latest Test Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.currentScores.map((score: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{score.subject}</p>
                  <p className="text-sm text-gray-500">{score.test}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {score.score}/{score.maxScore}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {score.score >= 75
                      ? "Excellent"
                      : score.score >= 60
                        ? "Good"
                        : "Average"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CoursesTab({ courses }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          My Enrolled Courses
        </h2>
        <p className="mt-1 text-gray-600">
          Track your progress and course details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((course: any) => (
          <Card key={course.id} className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={
                        course.status === "active" ? "default" : "secondary"
                      }
                    >
                      {course.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{course.progress}% Complete</Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium text-gray-900">
                    {course.progress}%
                  </span>
                </div>
                <Progress value={course.progress} className="h-3" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium text-gray-900">
                    {course.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {course.duration}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Target Exam
                  </span>
                </div>
                <p className="text-sm text-blue-700">{course.examDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FeesTab({ feesData }: any) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Payment processed successfully!", {
      description: `₹${paymentAmount} paid via ${paymentMethod}`,
    });
    setShowPaymentForm(false);
    setPaymentAmount("");
    setPaymentMethod("");
  };

  const progressPercentage = (feesData.paidAmount / feesData.totalAmount) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fees & Payments</h2>
        <p className="mt-1 text-gray-600">
          Manage your course fees and payment history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="outline">Total</Badge>
            </div>
            <p className="text-sm text-gray-600">Total Fee Amount</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              ₹{feesData.totalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-green-700"
              >
                Paid
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Amount Paid</p>
            <p className="mt-1 text-3xl font-bold text-green-600">
              ₹{feesData.paidAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <Badge
                variant="outline"
                className="border-orange-200 bg-orange-50 text-orange-700"
              >
                Pending
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Pending Amount</p>
            <p className="mt-1 text-3xl font-bold text-orange-600">
              ₹{feesData.pendingAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Overall Payment Status
              </span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {feesData.pendingAmount > 0 && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900">
                    Next Payment Due
                  </p>
                  <p className="mt-1 text-sm text-orange-700">
                    ₹{feesData.pendingAmount.toLocaleString()} due by{" "}
                    {new Date(feesData.nextDueDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => setShowPaymentForm(true)}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showPaymentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Make Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="paymentAmount">Amount</Label>
                <Input
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e: any) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Input
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Payment</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PerformanceTab({ currentScores, pastScores }: any) {
  const getProgressData = () => {
    const subjects = ["NTA NET Paper 1", "NTA NET Paper 2 (English)"];
    const data: any[] = [];

    subjects.forEach((subject) => {
      const subjectScores = pastScores.filter(
        (s: any) => s.subject === subject,
      );
      subjectScores.forEach((score: any) => {
        const existingDate = data.find((d) => d.date === score.date);
        if (existingDate) {
          existingDate[subject] = score.score;
        } else {
          data.push({
            date: score.date,
            [subject]: score.score,
          });
        }
      });
    });

    return data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      }));
  };

  const currentScoresData = currentScores.map((score: any) => ({
    name: score.subject.split(" ").slice(2).join(" ") || score.subject,
    score: score.score,
    maxScore: score.maxScore,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Performance Analytics
        </h2>
        <p className="mt-1 text-gray-600">
          Track your test scores and academic progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Test Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            {currentScores.map((score: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-medium text-gray-900">
                      {score.subject}
                    </h4>
                    <Badge
                      variant={score.score >= 75 ? "default" : "secondary"}
                    >
                      {score.score >= 75
                        ? "Excellent"
                        : score.score >= 60
                          ? "Good"
                          : "Needs Improvement"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{score.test}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {score.score}
                  </p>
                  <p className="text-sm text-gray-500">
                    out of {score.maxScore}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentScoresData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#6366f1" name="Your Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="NTA NET Paper 1"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="NTA NET Paper 2 (English)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceTab({ attendanceData }: any) {
  const absent = attendanceData.totalClasses - attendanceData.attended;

  const pieData = [
    { name: "Attended", value: attendanceData.attended, color: "#10b981" },
    { name: "Absent", value: absent, color: "#ef4444" },
  ];

  const monthlyChartData = attendanceData.monthlyData.map((month: any) => ({
    month: month.month,
    attended: month.attended,
    missed: month.total - month.attended,
    total: month.total,
    percentage: Math.round((month.attended / month.total) * 100),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance Tracker</h2>
        <p className="mt-1 text-gray-600">
          Monitor your class attendance and progress
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }: any) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attended" fill="#10b981" name="Attended" />
                  <Bar dataKey="missed" fill="#ef4444" name="Missed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LiveClassesTab({ liveClasses }: any) {
  const handleJoinClass = (liveClass: any) => {
    toast.success("Joining live class...", {
      description: `Connecting to ${liveClass.title}`,
    });
  };

  const upcomingClasses = liveClasses.filter(
    (c: any) => c.status === "upcoming",
  );
  const scheduledClasses = liveClasses.filter(
    (c: any) => c.status === "scheduled",
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Live Classes</h2>
        <p className="mt-1 text-gray-600">
          Join your scheduled live classes and interactive sessions
        </p>
      </div>

      {upcomingClasses.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">Starting Soon</CardTitle>
              <Badge className="bg-green-600">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((liveClass: any) => (
              <div
                key={liveClass.id}
                className="rounded-lg border-2 border-green-300 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {liveClass.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{liveClass.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(liveClass.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{liveClass.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="animate-pulse bg-green-600 hover:bg-green-700"
                    onClick={() => handleJoinClass(liveClass)}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <CardTitle>Upcoming Schedule</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledClasses.map((liveClass: any) => (
              <div
                key={liveClass.id}
                className="rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 font-semibold text-gray-900">
                        {liveClass.title}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {liveClass.instructor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {new Date(liveClass.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{liveClass.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="justify-center">
                    Scheduled
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecordedClassesTab({ recordedClasses }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handlePlayVideo = (recordedClass: any) => {
    toast.success("Loading video...", {
      description: recordedClass.title,
    });
  };

  const filteredClasses = recordedClasses.filter((rc: any) => {
    const matchesSearch =
      rc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rc.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "unwatched") return matchesSearch && rc.views === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recorded Classes</h2>
        <p className="mt-1 text-gray-600">
          Access past lectures and study materials anytime
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search by title or instructor..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === "unwatched" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("unwatched")}
              >
                Unwatched
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((recordedClass: any) => (
          <Card
            key={recordedClass.id}
            className="group overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={recordedClass.thumbnail}
                alt={recordedClass.title}
                className="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => handlePlayVideo(recordedClass)}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Play Video
                </Button>
              </div>
              <div className="absolute right-2 top-2">
                <Badge className="bg-black bg-opacity-75">
                  {recordedClass.duration}
                </Badge>
              </div>
              {recordedClass.views === 0 && (
                <div className="absolute left-2 top-2">
                  <Badge className="bg-orange-600">New</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                {recordedClass.title}
              </h3>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="truncate">{recordedClass.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(recordedClass.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>
                    Watched {recordedClass.views}{" "}
                    {recordedClass.views === 1 ? "time" : "times"}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handlePlayVideo(recordedClass)}
              >
                <PlayCircle className="mr-1 h-4 w-4" />
                Watch Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StudentDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "fees", label: "Fees & Payments", icon: CreditCard },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "live", label: "Live Classes", icon: Video },
    { id: "recorded", label: "Recorded Classes", icon: PlayCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={studentData} />;
      case "courses":
        return <CoursesTab courses={studentData.enrolledCourses} />;
      case "fees":
        return <FeesTab feesData={studentData.fees} />;
      case "performance":
        return (
          <PerformanceTab
            currentScores={studentData.currentScores}
            pastScores={studentData.pastScores}
          />
        );
      case "attendance":
        return <AttendanceTab attendanceData={studentData.attendance} />;
      case "live":
        return <LiveClassesTab liveClasses={studentData.liveClasses} />;
      case "recorded":
        return (
          <RecordedClassesTab recordedClasses={studentData.recordedClasses} />
        );
      default:
        return <OverviewTab data={studentData} />;
    }
  };

  return (
    <div className="relative z-10 min-h-screen bg-transparent">
      <header className="sticky top-0 z-30 border-b border-indigo-200/70 bg-gradient-to-r from-white via-indigo-50/90 to-purple-100/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gradient-to-br from-indigo-700 to-purple-700 p-1.5 shadow-sm">
                <img
                  src="/WebsiteLogo_final_white.png"
                  alt="LePearl Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                LePearl Education
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onLogout}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sign Out
            </Button>
            <div className="flex min-w-0 items-center gap-3 border-l border-indigo-200 pl-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={studentData.photo} alt={studentData.name} />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium leading-tight text-gray-900">
                  {studentData.name}
                </p>
                <p className="truncate text-xs leading-tight text-gray-500">
                  {studentData.registrationNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed left-0 top-[57px] z-20 h-[calc(100vh-57px)] w-64 transform border-r border-indigo-200/70 bg-gradient-to-b from-violet-100/70 via-white/88 to-indigo-100/65 backdrop-blur-sm transition-transform duration-200 ease-in-out lg:sticky ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-indigo-200/70 bg-gradient-to-r from-indigo-100/75 to-purple-100/70 p-4">
              <div className="flex w-full flex-col items-center px-2 text-center">
                <Avatar className="mb-3 h-16 w-16 border border-gray-200">
                  <AvatarImage src={studentData.photo} alt={studentData.name} />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <h3 className="w-full truncate text-base font-semibold leading-tight text-gray-900">
                  {studentData.name}
                </h3>
                <p className="mt-1 w-full truncate text-xs leading-tight text-gray-500">
                  {studentData.registrationNumber}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Active Student
                </Badge>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeTab === item.id ? "bg-indigo-50 font-medium text-indigo-600" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-gray-200 p-4">
              <Button
                variant="outline"
                className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function StudentDashboardApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="relative min-h-screen">
      <SoftVideoBackground />
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <StudentDashboard onLogout={() => setIsLoggedIn(false)} />
      )}
    </div>
  );
}
