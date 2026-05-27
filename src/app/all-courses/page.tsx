import Link from "next/link";
import { BookOpen, PlayCircle, Sparkles, Users } from "lucide-react";

type CourseCard = {
  title: string;
  track: string;
  duration: string;
  href: string;
  highlights: string[];
};

const courses: CourseCard[] = [
  {
    title: "NET Paper 1",
    track: "NTA NET",
    duration: "3-4 Months",
    href: "/courses-net-paper1",
    highlights: ["Concept clarity", "PYQ-driven strategy", "Weekly mock tests"],
  },
  {
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
    title: "MPPSC",
    track: "Assistant Professor",
    duration: "4-6 Months",
    href: "/courses-mppsc",
    highlights: ["Syllabus mapping", "Answer writing", "Interview prep"],
  },
  {
    title: "UPHESC",
    track: "Assistant Professor",
    duration: "4-6 Months",
    href: "/courses-uphesc",
    highlights: ["Paper-wise modules", "Guided revision", "Mentorship"],
  },
  {
    title: "UP GDC",
    track: "Assistant Professor",
    duration: "3-5 Months",
    href: "/courses-upgdc",
    highlights: ["Focused preparation", "Class notes", "Practice sessions"],
  },
  {
    title: "GIC",
    track: "Teaching Exams",
    duration: "3-4 Months",
    href: "/courses-gic",
    highlights: ["Topic drills", "Past papers", "Faculty support"],
  },
  {
    title: "LT Grade",
    track: "Teaching Exams",
    duration: "3-4 Months",
    href: "/courses-ltgrade",
    highlights: ["Structured modules", "Practice papers", "Doubt resolution"],
  },
  {
    title: "SET",
    track: "State Eligibility",
    duration: "3-4 Months",
    href: "/courses-set",
    highlights: ["State-level pattern", "High-yield notes", "Mock analysis"],
  },
  {
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
    title: "Research Assistance",
    track: "Academic Services",
    duration: "Custom",
    href: "/research-assistance",
    highlights: ["Research guidance", "Writing support", "Publication roadmap"],
  },
];

export default function AllCoursesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#e0f2fe,transparent_40%),radial-gradient(circle_at_80%_0%,#fde68a,transparent_35%),#f8fafc]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur">
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" /> LePearl Learning Paths
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            All Courses in One Place
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600 sm:text-lg">
            Compare every LePearl program, book a free demo class, and move to
            paid enrolment from a single hub.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/student-registration"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:brightness-110"
            >
              Paid Enrolment
            </Link>
            <Link
              href="/student-registration?mode=free"
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              Free Registration
            </Link>
          </div>
        </div>

        <section
          id="who-can-apply"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Who Can Apply</h2>
          <p className="mt-2 text-slate-600">
            Aspirants preparing for NET, Assistant Professor, SET, state-level
            teaching exams, and interview-based academic roles can apply.
          </p>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <Users className="h-3.5 w-3.5" /> {course.track}
              </p>
              <h3 className="mt-3 text-xl font-bold text-slate-900">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Duration: {course.duration}
              </p>
              <ul className="mt-4 space-y-2">
                {course.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <BookOpen className="h-4 w-4 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={course.href}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  View Course
                </Link>
                <Link
                  href="/student-registration?mode=free"
                  className="inline-flex items-center gap-1 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  <PlayCircle className="h-3.5 w-3.5" /> Demo Class
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section
          id="books"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Books</h2>
          <p className="mt-2 text-slate-600">
            Add curated study books during paid enrolment and receive aligned
            reading for your selected exam track.
          </p>
        </section>

        <section
          id="testimonials"
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Testimonials</h2>
          <p className="mt-2 text-slate-600">
            Students consistently credit LePearl for clear mentoring, live
            support, and structured test analysis that improves rank outcomes.
          </p>
        </section>

        <section
          id="faqs"
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <p>
              <strong>Can I attend a demo before enrolling?</strong> Yes, use
              Free Registration to access demo and PYQ resources.
            </p>
            <p>
              <strong>Is discount available for existing students?</strong> Yes,
              Pearlian students get 10% off on eligible paid enrolments.
            </p>
            <p>
              <strong>Do I need to accept policy checkboxes?</strong> For paid
              enrolment, Terms, Privacy, and Refund consent are mandatory.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
