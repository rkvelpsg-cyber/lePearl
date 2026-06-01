"use client";

import Link from "next/link";
import {
  BookOpen,
  Check,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Quote,
  Sparkles,
  Star,
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

const testimonials = [
  {
    id: "t1",
    name: "NTA NET Qualifier",
    quote:
      "I used the all-courses page to compare options and picked the right track quickly.",
  },
  {
    id: "t2",
    name: "Assistant Professor Aspirant",
    quote:
      "The structured modules and mock analysis helped me stay consistent throughout prep.",
  },
  {
    id: "t3",
    name: "UPHESC Candidate",
    quote:
      "Faculty mentoring and regular follow-up made my preparation focused and practical.",
  },
];

const oneTimeFeatures = [
  "Full access to selected course",
  "Study materials and PDFs",
  "Mock tests and practice sets",
  "Doubt sessions",
];

const installmentFeatures = [
  "Full access to selected course",
  "Study materials and PDFs",
  "Mock tests and practice sets",
  "Doubt sessions",
  "Flexible payment schedule",
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
                  className="rounded-lg bg-blue-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
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

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Student Success Feedback
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="relative rounded-2xl bg-white p-8 shadow-lg"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-amber-200" />
              <h3 className="text-lg font-bold text-blue-900">
                {testimonial.name}
              </h3>
              <div className="mb-4 mt-2 flex gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={`${testimonial.id}-${idx}`}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="leading-relaxed text-gray-600">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section
      id="enrollment"
      className="bg-gradient-to-br from-blue-900 to-blue-800 py-16 text-white md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Join Your Target Course Today
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-blue-100">
            Select your preferred payment route and complete your registration
            in minutes.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-gray-900 shadow-2xl transition-transform hover:scale-105">
            <div className="absolute right-0 top-0 bg-amber-500 px-4 py-1 text-sm font-bold text-white">
              BEST VALUE
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                One-Time Payment
              </h3>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-900">₹8,999</span>
              </div>
              <p className="text-gray-500 line-through">₹12,000</p>
            </div>

            <div className="mb-8">
              <p className="mb-4 font-semibold text-blue-900">Includes:</p>
              <ul className="space-y-3">
                {oneTimeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/student-registration"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-blue-800"
            >
              Paid Enrollment
            </Link>
          </div>

          <div className="relative rounded-2xl border-4 border-amber-400 bg-white p-8 text-gray-900 shadow-2xl transition-transform hover:scale-105">
            <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-500 px-6 py-2 text-sm font-bold text-white shadow-lg">
              <Sparkles className="h-4 w-4" /> FLEXIBLE
            </div>

            <div className="mb-6 mt-4">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                Installment Plan
              </h3>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-900">
                  2 Installments
                </span>
              </div>
              <p className="text-gray-600">Total Cost: ₹11,000</p>
            </div>

            <div className="mb-8">
              <p className="mb-4 font-semibold text-blue-900">Includes:</p>
              <ul className="space-y-3">
                {installmentFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/student-registration"
              className="block w-full rounded-lg bg-amber-500 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-amber-600"
            >
              Fill Registration Form
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center text-blue-100">
          Need help choosing? Contact us for personalized guidance.
        </div>
      </div>
    </section>
  );
}

function BooksAndFaq() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section
          id="books"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Books</h2>
          <p className="mt-2 text-slate-600">
            Add curated study books during paid enrollment and receive aligned
            reading for your selected exam track.
          </p>
        </section>

        <section
          id="faqs"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <p>
              <strong>Can I attend a demo before enrolling?</strong> Yes, use
              free registration to access demo and PYQ resources.
            </p>
            <p>
              <strong>Is discount available for existing students?</strong> Yes,
              Pearlian students get 10% off on eligible paid enrollments.
            </p>
            <p>
              <strong>Do I need to accept policy checkboxes?</strong> For paid
              enrollment, terms, privacy, and refund consent are mandatory.
            </p>
          </div>
        </section>
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
      <Testimonials />
      <Pricing />
      <BooksAndFaq />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
