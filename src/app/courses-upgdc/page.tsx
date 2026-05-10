"use client";

import { useState } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Facebook,
  FileText,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

type Testimonial = {
  name: string;
  exam: string;
  photo: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Dr. Priya Sharma",
    exam: "UP Assistant Professor - 2024",
    photo:
      "https://images.unsplash.com/photo-1719245309441-c577e0d1959d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwc3VjY2Vzc3xlbnwxfHx8fDE3NzMzMDc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "LePearl's expert guidance and structured approach helped me clear the exam in my first attempt. The mock tests were exactly like the real exam!",
  },
  {
    name: "Rahul Verma",
    exam: "UP GDC Assistant Professor - 2023",
    photo:
      "https://images.unsplash.com/flagged/photo-1571367061913-be59eefdfc66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwc3R1ZGVudCUyMHN0dWR5aW5nfGVufDF8fHx8MTc3MzMwNzYwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "The personalized attention and live doubt sessions made all the difference. Faculty's 15+ years experience truly shows in their teaching methods.",
  },
  {
    name: "Anjali Singh",
    exam: "UP Assistant Professor - 2025",
    photo:
      "https://images.unsplash.com/photo-1594256347468-5cd43df8fbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwcHJvZmVzc29yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzczMzA3NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "From comprehensive study material to answer writing practice, LePearl covered everything. I'm now proudly serving as an Assistant Professor!",
  },
];

type TabId = "general-studies" | "prelims" | "mains";

const tabItems: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "general-studies", label: "General Studies", icon: GraduationCap },
  { id: "prelims", label: "Prelims", icon: FileText },
  { id: "mains", label: "Mains", icon: MessageCircle },
];

const tabTitles: Record<TabId, string> = {
  "general-studies": "GENERAL STUDIES",
  prelims: "PRELIMS",
  mains: "MAINS",
};

const tabBg: Record<TabId, string> = {
  "general-studies": "bg-gradient-to-b from-blue-50 via-blue-50/70 to-white",
  prelims: "bg-gradient-to-b from-white via-white to-blue-50",
  mains: "bg-gradient-to-b from-yellow-50 via-yellow-50/70 to-white",
};

function ProgramTabsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("general-studies");

  const contentMap: Record<TabId, React.ReactNode> = {
    "general-studies": (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
          <h3 className="mb-3 text-xl font-bold text-blue-900">
            Strategic GS Preparation for UP GDC
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The Uttar Pradesh Government Degree College (GDC) Assistant
            Professor examination demands a strategic approach to the General
            Studies (GS) paper. This section is often the "rank-decider,"
            bridging the gap between a candidate and their final selection.
          </p>
        </div>

        <p className="mb-6 text-gray-700 leading-relaxed">
          Our platform offers a comprehensive ecosystem: Live Interactive
          Classes, Curated Study Material, and Pattern-Aligned Mock Tests to
          ensure you stay ahead of the curve.
        </p>

        <h3 className="mb-4 text-xl font-bold text-blue-900">
          Comprehensive Syllabus Breakdown
        </h3>
        <p className="mb-5 text-gray-700 leading-relaxed">
          The GS paper covers a diverse range of topics designed to test your
          awareness and analytical ability. We break it down into high-yield
          segments:
        </p>

        <div className="mb-8 overflow-x-auto rounded-xl border border-blue-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Key Focus Areas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 bg-white text-gray-700">
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  Current Affairs
                </td>
                <td className="px-4 py-3">
                  National and International importance; Latest awards, sports,
                  and summits.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  History of India
                </td>
                <td className="px-4 py-3">
                  Emphasis on the Indian National Movement and Socio-Religious
                  reform movements.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  Geography
                </td>
                <td className="px-4 py-3">
                  Physical, Social, and Economic Geography of India and the
                  World.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  Indian Polity
                </td>
                <td className="px-4 py-3">
                  Constitution, Panchayati Raj, Public Policy, and Rights
                  Issues.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  Indian Economy
                </td>
                <td className="px-4 py-3">
                  Sustainable Development, Poverty, Inclusion, and Demographics.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  General Science
                </td>
                <td className="px-4 py-3">
                  Everyday observations and experience (Physics, Chemistry,
                  Biology).
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  UP Special
                </td>
                <td className="px-4 py-3">
                  History, Culture, Geography, and Administrative setup of Uttar
                  Pradesh.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-blue-900">
                  Elementary Math
                </td>
                <td className="px-4 py-3">
                  Basic Arithmetic, Algebra, and Geometry (up to Class 10
                  level).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mb-4 text-xl font-bold text-blue-900">
          Why Choose Our GS Program?
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>
            Live &amp; Recorded Sessions: Dynamic classes that simplify complex
            concepts, available for replay anytime.
          </li>
          <li>
            Precision Mock Tests: Experience the actual exam environment with
            tests designed strictly on the latest UPPSC patterns.
          </li>
          <li>
            Holistic Mentorship: We don&apos;t just teach subjects; we guide
            students. Our one-on-one sessions address academic doubts and
            provide non-academic support, such as time management and exam-day
            anxiety.
          </li>
          <li>
            Crisp PDF Notes: Eliminate the fluff. Get structured notes that are
            easy to revise in the final weeks.
          </li>
        </ul>

        <h3 className="mb-4 text-xl font-bold text-blue-900">
          Beyond the Books: Our Holistic Edge
        </h3>
        <p className="mb-3 text-gray-700 leading-relaxed">
          We believe that a candidate&apos;s mental and emotional well-being is
          as crucial as their subject knowledge. Our mentors provide:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>
            Personalised Feedback: Detailed analysis of your mock test
            performance.
          </li>
          <li>
            Strategic Planning: Tailored study schedules that fit your routine.
          </li>
          <li>
            Wellness Support: Guidance on maintaining focus and motivation
            throughout the preparation journey.
          </li>
        </ul>
      </div>
    ),
    prelims: (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-900 to-blue-700 p-5 text-white">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-100">
            UP GDC Assistant Professor Exam
          </p>
          <h3 className="mb-2 text-2xl font-bold">
            Excel in UP GDC Asst Prof Exam, Ignite Your Teaching Career
          </h3>
          <p className="text-blue-100">
            Proven course: Deep dive into syllabus, mocks, and strategies for
            Government Degree College placements.
          </p>
        </div>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Course Overview
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>Tailored for UP GDC aspirants</li>
          <li>
            Blend of live video lectures, PDFs, and live doubt resolution
            sessions
          </li>
          <li>One year of access to the videos and PDFs</li>
          <li>
            Flipped Live Classes with live Question and Answer solving with
            explanation.
          </li>
          <li>
            Subject Expertise with teaching experience of more than 15 years.
          </li>
          <li>
            No shortcuts, just proven strategies for first-attempt success.
          </li>
        </ul>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Features &amp; Benefits
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Free Demo Class",
            "Complete Coverage of Syllabus for Prelims + Mains",
            "Video Lectures: In-depth coverage of the UP GDC pattern, simplified complex topics.",
            "Mock Tests: 50+ Mock tests with detailed analysis.",
            "Study Material: Concise PDFs, recorded lectures, and previous papers decoded.",
            "Live Doubt Clearing: Weekly sessions for real-time support.",
            "One-to-one attention for each student as needed.",
            "Holistic development of the students.",
            "Important points of every topic are highlighted",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    mains: (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Answer Writing for Descriptive Examination
        </h3>
        <p className="mb-6 text-lg font-semibold text-blue-800">
          Master the Art of Descriptive Writing: From Draft to Distinction
        </p>

        <h4 className="mb-3 text-lg font-bold text-blue-900">
          The Methodology:
        </h4>
        <div className="mb-8 space-y-3">
          {[
            "Unlike bulk coaching, each student is assigned a mentor who tracks their progress through every answer script.",
            "We teach you how to structure answers, from impactful introductions to data-backed body paragraphs and balanced conclusions.",
            'Learn how to use "High-Yield Keywords" that UPPSC evaluators look for in GDC Mains scripts.',
            "Every mock answer you write is deeply evaluated with written annotations, pointing out exactly where you can gain an extra half-mark.",
            "Real-time sessions where we pick a previous year's question and build a model answer together on screen.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50/60 p-4 text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="w-full max-w-none px-0">
        <div className="lg:flex lg:items-start">
          <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0 sticky top-20 self-start pl-0 pr-3 pt-2 pb-8">
            <div className="bg-white border border-teal-100 rounded-2xl shadow-lg p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3 px-2">
                Programs
              </p>
              <nav className="flex flex-col gap-1.5">
                {tabItems.map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 w-full group ${isActive ? "bg-teal-800 text-white shadow-md" : "text-gray-600 hover:bg-teal-50 hover:text-teal-800"}`}
                    >
                      <span
                        className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isActive ? "bg-white/20" : "bg-teal-100 group-hover:bg-teal-200"}`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-teal-700"}`}
                        />
                      </span>
                      <span className="leading-tight">{label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="lg:hidden overflow-x-auto flex gap-2 px-3 py-3 bg-white border-y border-teal-100 rounded-none mb-0">
            {tabItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive ? "bg-teal-800 text-white" : "bg-teal-50 text-teal-700"}`}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>

          <div
            className={`flex-1 min-w-0 ${tabBg[activeTab]} rounded-none border-y border-blue-100 px-4 py-10 sm:px-6 sm:py-12 lg:px-8`}
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-blue-900 sm:text-3xl lg:text-4xl">
                {tabTitles[activeTab]}
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
            </div>
            {contentMap[activeTab]}
          </div>
        </div>
      </div>
    </section>
  );
}

function UPGDCPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const scrollToEnroll = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadSyllabus = () => {
    const a = document.createElement("a");
    a.href = "/GDC Syllabus-2025.pdf";
    a.download = "GDC Syllabus-2025.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const activeTestimonial = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToEnroll} />

      <section className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwbGVjdHVyZXxlbnwxfHx8fDE3NzMzMDc2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Students studying"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Excel in UP GDC Assistant Professor Exam, Ignite Your Teaching
              Career
            </h2>
            <p className="mb-8 text-lg text-blue-100 sm:text-xl">
              Proven course: Deep dive into syllabus, mock tests, and winning
              strategies for Government Degree College placements.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-yellow-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-600 hover:shadow-xl"
              >
                Enroll Now
              </a>
              <button
                type="button"
                onClick={downloadSyllabus}
                className="rounded-lg border-2 border-white bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                Download Syllabus
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-yellow-400" />
                <span>Recorded Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-400" />
                <span>Mock Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-yellow-400" />
                <span>Live Doubt Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgramTabsPanel />

      <section className="bg-blue-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Student Success Stories
          </h2>

          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm sm:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 h-24 w-24 overflow-hidden rounded-full border-4 border-yellow-400">
                  <ImageWithFallback
                    src={activeTestimonial.photo}
                    alt={activeTestimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mb-6 text-lg italic leading-relaxed sm:text-xl">
                  &quot;{activeTestimonial.quote}&quot;
                </p>
                <h4 className="text-xl font-bold text-yellow-400">
                  {activeTestimonial.name}
                </h4>
                <p className="text-blue-200">{activeTestimonial.exam}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 flex h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-500 shadow-lg transition-colors duration-300 hover:bg-yellow-600"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-blue-900" />
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 flex h-12 w-12 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-500 shadow-lg transition-colors duration-300 hover:bg-yellow-600"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-blue-900" />
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentTestimonial(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "w-8 bg-yellow-400"
                    : "w-3 bg-white/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="enrollment"
        className="bg-gradient-to-br from-blue-50 to-white py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-blue-900 sm:text-4xl">
            Enroll Today and Begin Your Journey to Become a Government College
            Professor
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
            Choose the payment plan that works best for you and start your
            preparation today.
          </p>

          <div className="mx-auto mb-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
              <div className="absolute right-0 top-0 bg-yellow-500 px-4 py-1 text-sm font-bold text-blue-900">
                BEST VALUE
              </div>
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                One-time payment for both Prelims + Mains
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-900">
                  Rs.13,995
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Full course access for Prelims + Mains",
                  "All study materials included",
                  "50+ mock tests",
                  "Live doubt clearing sessions",
                  "Answer writing practice",
                  "One year access to videos and PDFs",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
                style={{ color: "#ffffff" }}
              >
                Enroll Now
              </a>
            </div>

            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                Instalments for both Prelims + Mains
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-900">
                  Rs.4,995 × 3
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Full course access for Prelims + Mains",
                  "All study materials included",
                  "50+ mock tests",
                  "Flexible payment terms",
                  "Live doubt clearing sessions",
                  "Answer writing practice",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-yellow-500 py-4 text-center text-lg font-bold text-blue-900 shadow-lg transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl"
              >
                Fill Registration Form
              </a>
            </div>
          </div>

          <div className="mx-auto mb-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                Full fee of Only Prelims
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-900">
                  Rs.10,995
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Full course access for Prelims only",
                  "All study materials included",
                  "50+ mock tests",
                  "Live doubt clearing sessions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
                style={{ color: "#ffffff" }}
              >
                Enroll Now
              </a>
            </div>

            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                Instalments for Only Prelims
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-900">
                  Rs.3,995 × 3
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Full course access for Prelims only",
                  "All study materials included",
                  "50+ mock tests",
                  "Flexible payment terms",
                  "Live doubt clearing sessions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-yellow-500 py-4 text-center text-lg font-bold text-blue-900 shadow-lg transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl"
              >
                Fill Registration Form
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block rounded-lg bg-yellow-500 px-6 py-3 text-blue-900">
              <p className="font-bold">10% discount for all the Perlians</p>
            </div>
          </div>
        </div>
      </section>

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}

export default UPGDCPage;
