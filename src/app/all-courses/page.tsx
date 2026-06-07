"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

type CourseCard = {
  id: string;
  title: string;
  track: string;
  duration: string;
  href: string;
  highlights: string[];
};

const courses: CourseCard[] = [
  {
    id: "net-paper-1",
    title: "NET Paper 1",
    track: "NTA NET",
    duration: "3-4 Months",
    href: "/courses-net-paper1",
    highlights: ["Concept clarity", "PYQ-driven strategy", "Weekly mock tests"],
  },
  {
    id: "net-paper-2",
    title: "NET Paper 2 (English)",
    track: "NTA NET",
    duration: "4-6 Months",
    href: "/courses-net-paper2",
    highlights: [
      "Text-based coverage",
      "Critical theories",
      "Live doubt clinics",
    ],
  },
  {
    id: "mppsc",
    title: "MPPSC",
    track: "Assistant Professor",
    duration: "4-6 Months",
    href: "/courses-mppsc",
    highlights: ["Syllabus mapping", "Answer writing", "Interview prep"],
  },
  {
    id: "uphesc",
    title: "UPHESC",
    track: "Assistant Professor",
    duration: "4-6 Months",
    href: "/courses-uphesc",
    highlights: ["Paper-wise modules", "Guided revision", "Mentorship"],
  },
  {
    id: "upgdc",
    title: "UP GDC",
    track: "Assistant Professor",
    duration: "3-5 Months",
    href: "/courses-upgdc",
    highlights: ["Focused preparation", "Class notes", "Practice sessions"],
  },
  {
    id: "gic",
    title: "GIC",
    track: "Teaching Exams",
    duration: "3-4 Months",
    href: "/courses-gic",
    highlights: ["Topic drills", "Past papers", "Faculty support"],
  },
  {
    id: "lt-grade",
    title: "LT Grade",
    track: "Teaching Exams",
    duration: "3-4 Months",
    href: "/courses-ltgrade",
    highlights: ["Structured modules", "Practice papers", "Doubt resolution"],
  },
  {
    id: "set",
    title: "SET",
    track: "State Eligibility",
    duration: "3-4 Months",
    href: "/courses-set",
    highlights: ["State-level pattern", "High-yield notes", "Mock analysis"],
  },
  {
    id: "communication",
    title: "Communication Skills",
    track: "Professional Development",
    duration: "6-8 Weeks",
    href: "/courses-communication-skills",
    highlights: [
      "Spoken communication",
      "Interview confidence",
      "Presentation",
    ],
  },
  {
    id: "research-assistance",
    title: "Research Assistance",
    track: "Academic Services",
    duration: "Custom",
    href: "/research-assistance",
    highlights: ["Research guidance", "Writing support", "Publication roadmap"],
  },
  {
    id: "assistant-professor-interview",
    title: "Assistant Professor Interview",
    track: "Interview Preparation",
    duration: "4-6 Weeks",
    href: "/interview-preparation/assistant-professor-1",
    highlights: [
      "Communication training",
      "Mock panel interviews",
      "Expert mentoring",
    ],
  },
  {
    id: "phd-interview",
    title: "PhD Interview Preparation",
    track: "Interview Preparation",
    duration: "4-6 Weeks",
    href: "/interview-preparation/phd-interview",
    highlights: ["Research clarity", "Viva confidence", "Selection mindset"],
  },
];

const overviewPoints = [
  { icon: GraduationCap, text: "Single hub for all LePearl exam tracks" },
  { icon: Video, text: "Live lectures, recordings, PDFs, and test support" },
  { icon: Users, text: "Faculty mentorship with exam-specific strategies" },
  { icon: Target, text: "Focused preparation for NET, SET, and AP exams" },
  { icon: TrendingUp, text: "Structured plans for faster rank improvement" },
];

const features = [
  {
    icon: PlayCircle,
    title: "Demo + Paid Path",
    description:
      "Start with free registration, then move to paid enrollment when ready.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Test Ecosystem",
    description: "Regular mocks with feedback to improve exam performance.",
  },
  {
    icon: FileText,
    title: "Study Materials",
    description: "Course-specific PDFs, PYQ practice, and revision resources.",
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Clinics",
    description: "Weekly doubt-solving sessions with faculty guidance.",
  },
];

function Header() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return <CoursePageHeader onEnroll={scrollToEnrollment} />;
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-100">
            <Sparkles className="h-3.5 w-3.5" /> LePearl Learning Paths
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            All Courses in One Place
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-blue-100 md:text-xl">
            Compare every LePearl program, choose your exam track, and move from
            free demo to paid enrollment with one clear roadmap.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/student-registration"
              className="rounded-lg bg-amber-500 px-8 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-amber-600"
            >
              Paid Enrollment
            </Link>
            <Link
              href="/student-registration?mode=free"
              className="rounded-lg border-2 border-white/40 bg-white/10 px-8 py-4 text-center text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Free Registration
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseOverview() {
  return (
    <section id="who-can-apply" className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Course Overview
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Aspirants preparing for NET, Assistant Professor, SET, state-level
            teaching exams, and interview-focused academic roles can apply.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {overviewPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.text}
                className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="rounded-lg bg-blue-100 p-3">
                  <Icon className="h-6 w-6 text-blue-900" />
                </div>
                <p className="pt-1 leading-relaxed text-gray-700">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Course Features &amp; Benefits
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900">
                  <Icon className="h-7 w-7 text-amber-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-blue-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CoursesGrid() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Explore Available Courses
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <p className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                <Users className="h-3.5 w-3.5" /> {course.track}
              </p>
              <h3 className="mt-3 text-xl font-bold text-blue-900">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Duration: {course.duration}
              </p>

              <ul className="mt-4 space-y-2">
                {course.highlights.map((item) => (
                  <li
                    key={`${course.id}-${item}`}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <BookOpen className="h-4 w-4 text-amber-500" /> {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={course.href}
                  className="rounded-lg bg-blue-900 px-3 py-2 text-xs font-semibold !text-white hover:!text-white focus:!text-white transition-colors hover:bg-blue-800"
                >
                  View Course
                </Link>
                <Link
                  href="/student-registration?mode=free"
                  className="inline-flex items-center gap-1 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
                >
                  <PlayCircle className="h-3.5 w-3.5" /> Demo Class
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AllCoursesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <Features />
      <CoursesGrid />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
