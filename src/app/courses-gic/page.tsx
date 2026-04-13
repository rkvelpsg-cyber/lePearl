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
  "Real-time sessions where we pick a previous year’s question and build a model answer together on screen.",
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
      "Don’t let doubts pile up; resolve them in every live class with subject experts.",
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
          <p className="text-lg text-blue-100">
            A dedicated program designed to navigate the dual challenges of
            Objective Prelims and Descriptive Mains. Secure your position in
            Government Inter Colleges with our proven pedagogy.
          </p>
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
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-900">
                <Sparkles className="h-4 w-4" />
                Single Payment Offer
              </div>
              <p className="mb-6 text-lg text-gray-700">
                Get complete course access with one-time payment. Contact us for
                the latest offer details.
              </p>
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
                href="/login"
                className="block w-full rounded-lg bg-blue-900 py-3.5 text-center font-bold text-white hover:bg-blue-800"
              >
                Enroll Now
              </a>
            </div>

            <div className="rounded-2xl border-4 border-amber-400 bg-white p-8 text-gray-900 shadow-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700">
                Instalment
              </div>
              <p className="mb-6 text-lg text-gray-700">
                Flexible instalment option available. Connect with us to choose
                the best plan as per your preparation timeline.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "Flexible monthly payment support",
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
                href="/login"
                className="block w-full rounded-lg bg-amber-500 py-3.5 text-center font-bold text-white hover:bg-amber-600"
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



