"use client";

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  CreditCard,
  Download,
  MessageCircle,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="absolute inset-0 opacity-15">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
          alt="Communication training"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 md:py-32">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Communication Skills Course
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-blue-100 md:text-xl">
            Structured for Real Progress
          </p>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/login"
              className="rounded-lg bg-amber-500 px-8 py-4 text-center text-lg font-bold text-white transition-all hover:scale-[1.02] hover:bg-amber-600"
            >
              Enroll Now
            </a>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/20">
              <Download className="h-5 w-5" />
              Download Course Details
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              "Fluency & Clarity",
              "Professional Presence",
              "Interview Ready",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <CheckCircle className="h-5 w-5 text-amber-400" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseOverview() {
  const overviewPoints = [
    {
      icon: Target,
      text: "Master the art of confident and impactful communication with our carefully designed 3-level program.",
    },
    {
      icon: TrendingUp,
      text: "Each level builds upon the previous one, ensuring steady improvement in fluency, clarity, and professional presence.",
    },
    {
      icon: Users,
      text: "This is not just another theory-based course. Every session is practical, progressive, and designed to deliver visible improvement in your speaking ability.",
    },
    {
      icon: Award,
      text: "Step-by-step progression helps you build real skills month after month instead of jumping into advanced content without the basics.",
    },
    {
      icon: MessageCircle,
      text: "Interview & Career Ready support for Assistant Professor interviews, PhD viva, LT Grade Teacher/GIC interviews, and other competitive academic selections.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
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
                className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="rounded-lg bg-blue-100 p-3">
                  <Icon className="h-6 w-6 text-blue-900" />
                </div>
                <p className="pt-2 leading-relaxed text-gray-700">
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

function LevelsSection() {
  const levels = [
    {
      title: "Beginner Level",
      meta: "Duration: 1 Month | Total Hours: 25 Hours | Fee: \u20B93,995/-",
      intro:
        "Perfect for those who want to build a strong foundation. This level focuses on removing basic errors and gaining confidence in everyday speaking.",
      points: [
        "Grammar fundamentals",
        "Sentence structure and formation",
        "Basic vocabulary building",
        "Speaking practice with guided language training",
      ],
      icon: BookOpen,
    },
    {
      title: "Intermediate Level",
      meta: "Duration: 1 Month | Total Hours: 25 Hours | Fee: \u20B94,995/-",
      intro:
        "Move beyond basics and develop professional communication skills needed for interviews, classrooms, and workplace settings.",
      points: [
        "Expanded vocabulary (approx. 850 words)",
        "Advanced sentence structure and complex constructions",
        "Professional and business-level communication training",
      ],
      icon: Users,
    },
    {
      title: "Advanced Level",
      meta: "Duration: 1 Month | Total Hours: 25 Hours | Fee: \u20B95,995/-",
      intro:
        "Designed for those aiming for leadership, teaching, or academic roles. Learn to communicate with authority and impact.",
      points: [
        "Leadership & managerial communication training",
        "Public speaking for conferences and academic presentations",
      ],
      icon: Award,
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Structured for Real Progress
          </h2>
          <div className="mx-auto h-1 w-24 bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {levels.map((level) => {
            const Icon = level.icon;
            return (
              <div
                key={level.title}
                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900">
                  <Icon className="h-7 w-7 text-amber-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-blue-900">
                  {level.title}
                </h3>
                <p className="mb-4 text-sm font-semibold text-amber-700">
                  {level.meta}
                </p>
                <p className="mb-4 leading-relaxed text-gray-700">
                  {level.intro}
                </p>
                <ul className="space-y-2">
                  {level.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesBenefitsSection() {
  const featureCards = [
    {
      icon: TrendingUp,
      title: "Step-by-Step Progression",
      description:
        "You build real skills month after month instead of jumping into advanced content without the basics.",
    },
    {
      icon: Mic,
      title: "Focused Practice",
      description:
        "Regular speaking exercises, feedback, and real-life simulations help you overcome hesitation and speak naturally.",
    },
    {
      icon: Target,
      title: "Interview & Career Ready",
      description:
        "The skills you learn directly help in Assistant Professor interviews, PhD viva, LT Grade Teacher/GIC interviews, and other competitive academic selections.",
    },
    {
      icon: Sparkles,
      title: "Measurable Growth",
      description:
        "By the end of each level, you will notice clearer speech, better confidence, richer vocabulary, and stronger presence.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Why Choose This Communication Skills Course?
          </h2>
          <div className="mx-auto h-1 w-24 bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-blue-100 bg-white p-8 shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900">
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

function OutcomeAndFeeSection() {
  return (
    <section id="enrollment" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg md:p-10">
          <h2 className="mb-4 text-3xl font-bold text-blue-900">
            Outcome After Completing All Levels:
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            You will be able to express your ideas with clarity and confidence,
            handle interviews with poise, deliver effective presentations, and
            project the professional image expected from teachers, lecturers,
            and researchers.
          </p>
          <p className="mb-8 leading-relaxed text-gray-700">
            Whether you are preparing for teaching exams, PhD interviews, or
            want to enhance your overall personality, this structured program
            gives you the complete communication edge you need.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-white p-5">
              <div className="mb-2 flex items-center gap-2 text-blue-900">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold">Class Schedule</span>
              </div>
              <p className="text-gray-700">As per the availability.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white p-5">
              <div className="mb-2 flex items-center gap-2 text-blue-900">
                <CreditCard className="h-5 w-5" />
                <span className="font-semibold">Pearlians Benefit</span>
              </div>
              <p className="font-bold text-green-700">
                10% discount for all the Pearlians.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CommunicationSkillsPage() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToEnrollment} />
      <HeroSection />
      <CourseOverview />
      <LevelsSection />
      <FeaturesBenefitsSection />
      <OutcomeAndFeeSection />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}



