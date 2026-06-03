"use client";

import Image from "next/image";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageCircle,
  PenTool,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

const overviewPoints = [
  {
    icon: Target,
    text: "Specialised modules for GIC Lecturer (Prelims + Mains).",
  },
  {
    icon: Video,
    text: "A strategic mix of high-definition recorded lectures for conceptual clarity and Live Flipped Classes for active recall.",
  },
  {
    icon: Users,
    text: "Guided by faculty with over 15+ years of experience in state PSC education.",
  },
  {
    icon: BookOpen,
    text: "Exhaustive coverage of Subject-specific domains as per the latest UPPSC notification.",
  },
  {
    icon: TrendingUp,
    text: "Moving beyond rote memorisation to deep conceptual understanding, essential for the descriptive nature of GIC Mains.",
  },
];

const methodologyPoints = [
  "Unlike bulk coaching, each student is assigned a mentor who tracks their progress through every answer script.",
  "We teach you how to structure answers, from impactful introductions to data-backed body paragraphs and balanced conclusions.",
  'Learn how to use "High-Yield Keywords" that UPPSC evaluators look for in GIC Mains scripts.',
  "Every mock answer you write is deeply evaluated with written annotations, pointing out exactly where you can gain an extra half-mark.",
  "Real-time sessions where we pick a previous year's question and build a model answer together on screen.",
];

const featurePoints = [
  {
    icon: GraduationCap,
    title: "300+ Hours Coverage",
    description:
      "300+ hours of content covering the entire depth of the UPPSC syllabus.",
  },
  {
    icon: ClipboardCheck,
    title: "Objective + Descriptive Tests",
    description:
      "40+ Sectional Tests and 10 Full-Length Mock Tests (Objective & Descriptive).",
  },
  {
    icon: FileText,
    title: "Revision Material",
    description:
      'Crisp, printable PDFs and "Mind Maps" for quick revision of the vast syllabus.',
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Support",
    description:
      "Don't let doubts pile up; resolve them in every live class with subject experts.",
  },
  {
    icon: PenTool,
    title: "Pattern Analysis Module",
    description:
      "A special module dedicated to analysing the last 10 years of UPPSC patterns.",
  },
];

export default function GICCoursePage() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadSyllabus = () => {
    window.location.href = "/student-registration?mode=free";
  };

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToEnrollment} />

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/book7.jpeg"
            alt="GIC preparation"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Master the UPPSC GIC with Top Educators
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            A dedicated program designed to navigate the dual challenges of
            Objective Prelims and Descriptive Mains. Secure your position in
            Government Inter Colleges with our proven pedagogy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-blue-900 md:text-4xl">
              Course Overview
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {overviewPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.text}
                  className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-md"
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

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg md:p-10">
          <h2 className="mb-3 text-3xl font-bold text-blue-900 md:text-4xl">
            Specialised Answer Writing &amp; Personal Evaluation Section
          </h2>
          <p className="mb-8 text-xl font-semibold text-indigo-700">
            Master the Art of Descriptive Writing: From Draft to Distinction
          </p>

          <h3 className="mb-4 text-xl font-bold text-blue-900">
            The Methodology:
          </h3>
          <ul className="space-y-4">
            {methodologyPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-blue-900 md:text-4xl">
              Features &amp; Benefits
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featurePoints.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-blue-100 bg-white p-8 shadow-md"
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

      <section
        id="enrollment"
        className="bg-gradient-to-br from-blue-900 to-indigo-800 px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
              Enrollment Section
            </h2>
            <p className="text-blue-100">
              Choose the payment plan that works best for your preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-gray-900 shadow-2xl transition-transform hover:scale-[1.02]">
              <div className="absolute right-0 top-0 bg-amber-500 px-4 py-1 text-sm font-bold text-white">
                SINGLE PAYMENT OFFER
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-blue-900">
                  One-Time Payment
                </h3>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-900">
                    Rs. 7,995
                  </span>
                </div>
                <p className="text-gray-600">(Prelims + Mains)</p>
              </div>

              <ul className="mb-8 space-y-3">
                {[
                  "Full syllabus coverage (Prelims + Mains)",
                  "Answer writing mentorship",
                  "Mock tests + evaluation",
                  "Recorded + live classes",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/student-registration?mode=paid&course=GIC"
                className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-blue-800"
                style={{ color: "#ffffff" }}
              >
                Enroll Now
              </a>
            </div>

            <div className="relative rounded-2xl border-4 border-amber-400 bg-white p-8 text-gray-900 shadow-2xl transition-transform hover:scale-[1.02]">
              <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-500 px-6 py-2 text-sm font-bold text-white shadow-lg">
                <Sparkles className="h-4 w-4" />
                POPULAR
              </div>

              <div className="mb-6 mt-4">
                <h3 className="mb-2 text-2xl font-bold text-blue-900">
                  Installment Plan
                </h3>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-900">
                    2 Instalments of Rs. 4,397
                  </span>
                </div>
                <p className="text-gray-600">Total Cost: Rs. 8,794</p>
              </div>

              <p className="mb-6 text-base text-gray-700">
                Two equal instalments for both Prelims and Mains access.
              </p>

              <ul className="mb-8 space-y-3">
                {[
                  "Flexible two-step payment support",
                  "All live + recorded sessions included",
                  "Personal mentoring continuity",
                  "Complete test series access",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/student-registration?mode=paid&course=GIC"
                className="block w-full rounded-lg bg-amber-500 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-amber-600"
              >
                Fill Registration Form
              </a>
            </div>
          </div>
        </div>
      </section>

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
