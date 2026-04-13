"use client";

import {
  Video,
  FileText,
  MessageCircle,
  Target,
  Users,
  Award,
  TrendingUp,
  ClipboardCheck,
  BookOpen,
  UserCheck,
  Calendar,
  CreditCard,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80"
          alt="SET preparation"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            State Eligibility Test (SET) English Literature Course
          </h1>
          <p className="mb-10 text-lg text-cyan-100 sm:text-xl">
            This comprehensive online course is specifically designed for
            aspirants preparing for the State Eligibility Test (SET) in English
            Literature conducted by various states.
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Video className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-medium">Live Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <ClipboardCheck className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-medium">Practice Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <MessageCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-medium">Doubt Clearance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseOverview() {
  const points = [
    {
      icon: Target,
      title: "Salient Features",
      description:
        "Comprehensive online course for SET English Literature aspirants across various states.",
    },
    {
      icon: Video,
      title: "Live & Flexible Learning Experience",
      description:
        "One-hour Live Online Video Classes for real-time interaction with flexible learning from home.",
    },
    {
      icon: BookOpen,
      title: "Complete Syllabus Coverage",
      description:
        "Full coverage of the Prescribed UGC Syllabus for English Literature with completion in 6 months.",
    },
    {
      icon: FileText,
      title: "Study Material & Resources",
      description:
        "PDF Notes provided for every class with high-quality, well-organised content for easy revision.",
    },
    {
      icon: TrendingUp,
      title: "Regular Assessment & Practice",
      description:
        "Monthly quiz contests, weekly progressive tests, and 20 full-length real-time practice tests.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-teal-800 sm:text-4xl">
            Course Overview
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex gap-4 rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-teal-700 to-cyan-600">
                    <Icon className="h-7 w-7 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-teal-800">
                    {point.title}
                  </h3>
                  <p className="text-gray-600">{point.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "Live & Flexible Learning Experience",
      items: [
        "One-hour Live Online Video Classes for real-time interaction",
        "Attend classes comfortably from your home",
        "Recorded Videos provided for every missed class",
      ],
    },
    {
      icon: BookOpen,
      title: "Complete Syllabus Coverage",
      items: [
        "Full coverage of the Prescribed UGC Syllabus for English Literature",
        "Systematic completion of the entire syllabus in 6 months",
      ],
    },
    {
      icon: FileText,
      title: "Study Material & Resources",
      items: [
        "PDF Notes provided for every class",
        "High-quality, well-organised content for easy revision",
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Regular Assessment & Practice",
      items: [
        "Monthly Quiz Contests to enhance comprehension and analytical skills",
        "Weekly Progressive Assessment Tests on the covered syllabus",
        "20 Full-Length Real-Time Practice Tests before the final examination",
      ],
    },
    {
      icon: UserCheck,
      title: "Personalized Support",
      items: ["One-to-One Doubt Clearance sessions for individual guidance"],
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-teal-800 sm:text-4xl">
            Salient Features
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl"
              >
                <div className="mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-teal-800">
                  {feature.title}
                </h3>
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-gray-600 leading-relaxed"
                    >
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-yellow-500" />
                      <span>{item}</span>
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

function ScheduleAndFeeSection() {
  return (
    <section
      id="enrollment"
      className="bg-gradient-to-b from-cyan-50 to-white py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-teal-800 sm:text-4xl">
            Class Schedule &amp; Fee
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-md md:col-span-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                <Calendar className="h-6 w-6 text-teal-800" />
              </div>
              <h3 className="text-xl font-bold text-teal-800">Schedule</h3>
            </div>
            <p className="text-gray-700">As per the availability.</p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                <CreditCard className="h-6 w-6 text-teal-800" />
              </div>
              <h3 className="text-xl font-bold text-teal-800">One-Time</h3>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              Full one-time payment: 12495/-
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-md md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                <CreditCard className="h-6 w-6 text-teal-800" />
              </div>
              <h3 className="text-xl font-bold text-teal-800">Installments</h3>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              Five equal instalments: 2995/-
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CoursesSetPage() {
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
      <FeaturesSection />
      <ScheduleAndFeeSection />

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}



