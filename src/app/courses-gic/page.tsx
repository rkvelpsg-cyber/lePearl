"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers3,
  MessageCircle,
  PenTool,
  Target,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

type TabId = "prelims" | "mains" | "prelims-mains";

const tabItems: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "prelims", label: "Prelims", icon: FileText },
  { id: "mains", label: "Mains", icon: PenTool },
  { id: "prelims-mains", label: "Prelims + Mains", icon: Layers3 },
];

const tabTitles: Record<TabId, string> = {
  prelims: "PRELIMS",
  mains: "MAINS",
  "prelims-mains": "PRELIMS + MAINS",
};

const tabBg: Record<TabId, string> = {
  prelims: "bg-gradient-to-b from-blue-50 via-blue-50/70 to-white",
  mains: "bg-gradient-to-b from-white via-white to-blue-50",
  "prelims-mains": "bg-gradient-to-b from-yellow-50/70 via-white to-white",
};

function ProgramTabsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("prelims");

  const contentMap: Record<TabId, React.ReactNode> = {
    prelims: (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-800 p-5 text-white">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-100">
            GIC Lecturer Course
          </p>
          <h3 className="mb-2 text-2xl font-bold">
            Master the UPPSC GIC with Top Educators
          </h3>
          <p className="text-blue-100">
            A dedicated program designed to navigate the dual challenges of
            Objective Prelims and Descriptive Mains. Secure your position in
            Government Inter Colleges with our proven pedagogy.
          </p>
        </div>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Course Overview
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>Specialised modules for GIC Lecturer (Prelims + Mains).</li>
          <li>
            A strategic mix of high-definition Live Flipped Classes for active
            recall and recorded lectures for conceptual clarity.
          </li>
          <li>
            Guided by faculty with over 15+ years of experience in state PSC
            education.
          </li>
          <li>
            Exhaustive coverage of Subject-specific domains as per the latest
            UPPSC notification.
          </li>
          <li>
            Readable PDF of every class in your registered mail for reading
            (Readable File).
          </li>
          <li>
            One year of access to the videos and PDFs post completion of the
            course.
          </li>
        </ul>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Features &amp; Benefits
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "300+ hours of content covering the entire depth of the UPPSC syllabus.",
            "40+ Sectional Tests and 10 Full-Length Mock Tests (Objective & Descriptive).",
            "You will be getting a recording of every live class to revise at your own convenience.",
            "Learning through activities like Quizzes and Discussion.",
            'Crisp, printable PDFs and "Mind Maps" for quick revision of the vast syllabus.',
            "Don't let doubts pile up; resolve them in every live class with subject experts.",
            "A special module dedicated to analysing the last 10 years of UPPSC patterns.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 w-full max-w-3xl">
          <div className="rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Fees for Prelims
            </h4>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 9,995/-
              </span>
            </div>
            <a
              href="/student-registration?mode=paid&course=GIC&gicFeeOption=prelims-only"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    ),
    mains: (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Specialised Answer Writing &amp; Personal Evaluation Section
          </p>
          <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
            Master the Art of Descriptive Writing: From Draft to Distinction
          </h3>
          <p className="max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">
            A rigorous mains-focused path to help you write analytically,
            present answers effectively, and maximize scoring consistency.
          </p>
        </div>

        <h3 className="mb-4 text-xl font-bold text-blue-900">
          The Methodology:
        </h3>
        <ul className="mb-8 space-y-4">
          {[
            "Unlike bulk coaching, each student is assigned a mentor who tracks their progress through every answer script.",
            "We teach you how to structure answers, from impactful introductions to data-backed body paragraphs and balanced conclusions.",
            'Learn how to use "High-Yield Keywords" that UPPSC evaluators look for in GIC Mains scripts.',
            "Every mock answer you write is deeply evaluated with written annotations, pointing out exactly where you can gain an extra half-mark.",
            "Real-time sessions where we pick a previous year's question and build a model answer together on screen.",
            "Moving beyond rote memorisation to deep conceptual understanding is essential for the descriptive nature of GIC Mains.",
          ].map((point) => (
            <li key={point} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="leading-relaxed text-gray-700">{point}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Mains Only (Without Study Material)
            </h4>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 7,995/-
              </span>
            </div>
            <a
              href="/student-registration?mode=paid&course=GIC&gicFeeOption=mains-without-material"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
            >
              Enroll Now
            </a>
          </div>

          <div className="rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Mains Only (With Study Material)
            </h4>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 13,995/-
              </span>
            </div>
            <a
              href="/student-registration?mode=paid&course=GIC&gicFeeOption=mains-with-material"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    ),
    "prelims-mains": (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Specialised Answer Writing &amp; Personal Evaluation Section
          </p>
          <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
            Master the Art of Descriptive Writing: From Draft to Distinction
          </h3>
          <p className="max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">
            Build complete exam confidence with integrated preparation for both
            objective prelims and descriptive mains under one roadmap.
          </p>
        </div>

        <h3 className="mb-4 text-xl font-bold text-blue-900">
          The Methodology:
        </h3>
        <ul className="mb-8 space-y-4">
          {[
            "Unlike bulk coaching, each student is assigned a mentor who tracks their progress through every answer script.",
            "We teach you how to structure answers, from impactful introductions to data-backed body paragraphs and balanced conclusions.",
            'Learn how to use "High-Yield Keywords" that UPPSC evaluators look for in GIC Mains scripts.',
            "Every mock answer you write is deeply evaluated with written annotations, pointing out exactly where you can gain an extra half-mark.",
            "Real-time sessions where we pick a previous year's question and build a model answer together on screen.",
            "Moving beyond rote memorisation to deep conceptual understanding is essential for the descriptive nature of GIC Mains.",
          ].map((point) => (
            <li key={point} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="leading-relaxed text-gray-700">{point}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Prelims + Mains
            </h4>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 14,995/-
              </span>
            </div>
            <a
              href="/student-registration?mode=paid&course=GIC&gicFeeOption=combined-full"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
            >
              Enroll Now
            </a>
          </div>

          <div className="rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Instalment Plan
            </h4>
            <div className="mb-2">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 5,495/-
              </span>
            </div>
            <p className="mb-6 text-sm font-semibold text-gray-600">
              per instalment x 3 instalments
            </p>
            <a
              href="/student-registration?mode=paid&course=GIC&gicFeeOption=combined-instalment"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
            >
              Enroll Now
            </a>
          </div>
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
              <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
            </div>
            {contentMap[activeTab]}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GICCoursePage() {
  const scrollToPrograms = () => {
    document
      .getElementById("gic-programs")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const downloadSyllabus = () => {
    window.location.href = "/student-registration?mode=free";
  };

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToPrograms} />

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Master the UPPSC GIC with Top Educators
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            A dedicated program designed to navigate the dual challenges of
            Objective Prelims and Descriptive Mains. Secure your position in
            Government Inter Colleges with our proven pedagogy.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/student-registration?mode=paid&course=GIC"
              className="rounded-lg bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-amber-600"
            >
              Enroll Now
            </a>
            <button
              type="button"
              onClick={downloadSyllabus}
              className="rounded-lg border-2 border-white bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Download Syllabus
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Video, text: "Live + Recorded Lectures" },
              { icon: ClipboardCheck, text: "Sectional + Full Mock Tests" },
              { icon: MessageCircle, text: "Live Doubt Sessions" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <Icon className="h-5 w-5 flex-shrink-0 text-amber-400" />
                  <span className="font-semibold">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-blue-900 md:text-4xl">
              Course Overview
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                icon: Target,
                text: "Specialised modules for GIC Lecturer (Prelims + Mains).",
              },
              {
                icon: Video,
                text: "A strategic mix of high-definition Live Flipped Classes and recorded lectures.",
              },
              {
                icon: Users,
                text: "Guided by faculty with over 15+ years of state PSC teaching experience.",
              },
              {
                icon: BookOpen,
                text: "Exhaustive coverage of subject-specific domains as per the latest UPPSC notification.",
              },
            ].map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.text}
                  className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm"
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

      <div id="gic-programs" className="scroll-mt-24">
        <ProgramTabsPanel />
      </div>

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
