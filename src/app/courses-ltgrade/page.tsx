"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Layers3,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

type TabId = "prelims" | "prelims-mains" | "mains";

const tabItems: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "prelims", label: "Prelims", icon: FileText },
  { id: "prelims-mains", label: "Prelims + Mains", icon: Layers3 },
  { id: "mains", label: "Mains", icon: PenTool },
];

const tabTitles: Record<TabId, string> = {
  prelims: "PRELIMS",
  "prelims-mains": "PRELIMS + MAINS",
  mains: "MAINS",
};

const tabBg: Record<TabId, string> = {
  prelims: "bg-gradient-to-b from-blue-50 via-blue-50/70 to-white",
  "prelims-mains": "bg-gradient-to-b from-yellow-50/70 via-white to-white",
  mains: "bg-gradient-to-b from-white via-white to-blue-50",
};

function ProgramTabsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("prelims");

  const contentMap: Record<TabId, React.ReactNode> = {
    prelims: (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-800 p-5 text-white">
          <h3 className="mb-2 text-2xl font-bold">
            Build a Strong Foundation for Assistant Teacher Selection
          </h3>
          <p className="text-blue-100">
            A focused, high-impact program designed to excel in the Objective
            Prelims of the UPPSC LT Grade Teacher Exam with expert guidance and
            smart strategies.
          </p>
        </div>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Course Overview
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>Specialised modules for LT Grade Teacher Prelims</li>
          <li>
            Strategic mix of high-definition Live Flipped Classes and recorded
            lectures
          </li>
          <li>
            Guided by faculty with 15+ years of experience in state PSC exams
          </li>
          <li>Exhaustive coverage of the latest UPPSC syllabus</li>
          <li>One-year access to all videos and study materials</li>
        </ul>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Key Features &amp; Benefits
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>
            300+ hours of comprehensive content covering the full Prelims
            syllabus
          </li>
          <li>40+ Sectional Tests + 10 Full-Length Mock Tests (Objective)</li>
          <li>Recordings of every live class available for revision</li>
          <li>Interactive learning through quizzes and discussions</li>
          <li>Crisp, printable PDFs and Mind Maps for quick revision</li>
          <li>Real-time doubt resolution in every live class</li>
          <li>
            Special module analysing the last 10 years of UPPSC question
            patterns
          </li>
        </ul>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Prelims (Full Payment)
            </h4>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 9,995/-
              </span>
            </div>
            <a
              href="/student-registration?mode=paid&course=LT%20Grade&ltGradeFeeOption=prelims-full"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              style={{ color: "#ffffff" }}
            >
              Enroll Now
            </a>
          </div>

          <div className="rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Prelims (3 Instalments)
            </h4>
            <div className="mb-2">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 3,400/-
              </span>
            </div>
            <p className="mb-6 text-sm font-semibold text-gray-600">
              per instalment x 3 instalments
            </p>
            <a
              href="/student-registration?mode=paid&course=LT%20Grade&ltGradeFeeOption=prelims-instalment"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              style={{ color: "#ffffff" }}
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    ),
    "prelims-mains": (
      <div className="w-full rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-800 p-5 text-white">
          <h3 className="mb-2 text-2xl font-bold">
            Secure Your Position as Assistant Teacher
          </h3>
          <p className="text-blue-100">
            A dedicated, complete program designed to navigate the dual
            challenges of Objective Prelims and Descriptive Mains with proven
            pedagogy and expert mentorship.
          </p>
        </div>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Course Overview
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>Specialised modules for LT Grade Teacher (Prelims + Mains)</li>
          <li>
            High-definition Live Flipped Classes + recorded lectures for
            conceptual clarity and active recall
          </li>
          <li>
            Guided by highly experienced faculty with 15+ years in state PSC
            education
          </li>
          <li>
            Exhaustive coverage of subject-specific domains as per the latest
            UPPSC notification
          </li>
          <li>One-year access to all videos, PDFs, and study materials</li>
        </ul>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Key Features &amp; Benefits - Prelims Preparation
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>
            300+ hours of in-depth content covering the entire Prelims syllabus
          </li>
          <li>40+ Sectional Tests + 10 Full-Length Mock Tests (Objective)</li>
          <li>Live class recordings for flexible revision</li>
          <li>Quizzes, discussions, and interactive learning</li>
          <li>Crisp PDFs and Mind Maps for fast revision</li>
          <li>Special analysis of last 10 years of UPPSC patterns</li>
          <li>Real-time doubt clearing with subject experts</li>
        </ul>

        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
          <h4 className="mb-2 text-2xl font-bold text-blue-900">
            Mains Answer Writing Program
          </h4>
          <p className="mb-4 text-lg font-semibold text-indigo-700">
            Master the Art of Descriptive Writing: From Draft to Distinction
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
            <li>
              Personal mentor assigned to track progress on every answer script
            </li>
            <li>
              Structured answer writing: impactful introductions, data-backed
              body paragraphs, and balanced conclusions
            </li>
            <li>
              Focus on “High-Yield Keywords” preferred by UPPSC evaluators in LT
              Grade Mains
            </li>
            <li>
              Detailed evaluation of every mock answer with specific annotations
              for score improvement
            </li>
            <li>
              Real-time model answer building sessions using previous year
              questions
            </li>
            <li>
              Emphasis on deep conceptual understanding instead of rote
              memorisation
            </li>
          </ul>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Prelims + Mains (Full Payment)
            </h4>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 14,994/-
              </span>
            </div>
            <a
              href="/student-registration?mode=paid&course=LT%20Grade&ltGradeFeeOption=combined-full"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              style={{ color: "#ffffff" }}
            >
              Enroll Now
            </a>
          </div>

          <div className="rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-2xl font-bold text-blue-900 sm:text-4xl">
              Prelims + Mains (3 Instalments)
            </h4>
            <div className="mb-2">
              <span className="text-4xl font-bold text-blue-900 sm:text-6xl">
                Rs 5,995/-
              </span>
            </div>
            <p className="mb-6 text-sm font-semibold text-gray-600">
              per instalment x 3 instalments
            </p>
            <a
              href="/student-registration?mode=paid&course=LT%20Grade&ltGradeFeeOption=combined-instalment"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              style={{ color: "#ffffff" }}
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
            LT Grade (Assistant Teacher) Course
          </p>
          <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
            Master the UPPSC LT Grade Teacher with Top Educators
          </h3>
          <p className="max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">
            A dedicated program designed to navigate the dual challenges of
            Objective Prelims and Descriptive Mains. Secure your position in LT
            Grade Teacher with our proven pedagogy.
          </p>
        </div>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Course Overview
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>Specialised modules for LT Grade Teacher (Mains)</li>
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
            Moving beyond rote memorisation to deep conceptual understanding is
            essential for the descriptive nature of the LT Grade Mains.
          </li>
        </ul>

        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
          <h4 className="mb-2 text-2xl font-bold text-blue-900">
            Specialised Answer Writing &amp; Personal Evaluation Section
          </h4>
          <p className="mb-4 text-lg font-semibold text-indigo-700">
            Master the Art of Descriptive Writing: From Draft to Distinction
          </p>
          <h5 className="mb-3 text-lg font-bold text-blue-900">
            The Methodology:
          </h5>
          <ul className="space-y-3">
            {[
              "Unlike bulk coaching, each student is assigned a mentor who tracks their progress through every answer script.",
              "We teach you how to structure answers, from impactful introductions to data-backed body paragraphs and balanced conclusions.",
              'Learn how to use "High-Yield Keywords" that UPPSC evaluators look for in LT Grade Mains scripts.',
              "Every mock answer you write is deeply evaluated with written annotations, pointing out exactly where you can gain an extra half-mark.",
              "Real-time sessions where we pick a previous year's question and build a model answer together on screen.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mb-3 text-xl font-bold text-blue-900">
          Features &amp; Benefits
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700 marker:text-yellow-500">
          <li>
            300+ hours of content covering the entire depth of the UPPSC
            syllabus.
          </li>
          <li>
            40+ Sectional Tests and 10 Full-Length Mock Tests (Objective &amp;
            Descriptive).
          </li>
          <li>
            Crisp, printable PDFs and "Mind Maps" for quick revision of the vast
            syllabus.
          </li>
          <li>
            Don&apos;t let doubts pile up; resolve them in every live class with
            subject experts.
          </li>
          <li>
            A special module dedicated to analysing the last 10 years of UPPSC
            patterns.
          </li>
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
              href="/student-registration?mode=paid&course=LT%20Grade&ltGradeFeeOption=mains-without-material"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              style={{ color: "#ffffff" }}
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
              href="/student-registration?mode=paid&course=LT%20Grade&ltGradeFeeOption=mains-with-material"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              style={{ color: "#ffffff" }}
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <section className="bg-gray-50 py-12 lg:py-16" id="enrollment">
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

export default function LTGradeCoursePage() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToEnrollment} />
      <ProgramTabsPanel />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
