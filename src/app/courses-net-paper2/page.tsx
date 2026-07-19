"use client";

import Image from "next/image";
import {
  Award,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  GraduationCap,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  X,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";
import { SuccessStoriesVideoCarousel } from "@/components/SuccessStoriesVideoCarousel";
import { getNtaNetSuccessStories } from "@/data/successStories";

function Header() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return <CoursePageHeader onEnroll={scrollToEnrollment} />;
}

function Hero() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadSyllabus = () => {
    window.location.href = "/student-registration?mode=free";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-blue-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/book5.jpeg"
          alt="English literature learners"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Conquer UGC NET Paper 2 English Literature, Become a Literary
            Scholar
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-blue-100 sm:text-xl">
            Expert-Curated Course: Dive Deep into Texts, Theories &amp;
            Criticism: Clear NTA NET, JRF, and Beyond with Confidence.
          </p>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/student-registration?mode=paid&course=NET%20Paper%202%20(English)"
              className="rounded-lg bg-amber-500 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:bg-amber-600"
            >
              Enroll Now
            </a>
            <button
              type="button"
              onClick={handleDownloadSyllabus}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/40 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Download className="h-5 w-5" />
              Download Syllabus
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              "Texts + Theory Coverage",
              "50+ Mock Tests",
              "Live Doubt Sessions",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const overviewPoints = [
  {
    icon: Award,
    text: "Crafted by English Literature maestros who've cracked NET multiple times.",
  },
  {
    icon: Target,
    text: "Rooted in the NTA syllabus.",
  },
  {
    icon: BookOpen,
    text: "Blending ancient classics with modern critiques.",
  },
  {
    icon: Users,
    text: "Affordable, flexible, and you'll emerge as a renewed expert ready for academia.",
  },
  {
    icon: TrendingUp,
    text: "Holistic prep blending NTA patterns.",
  },
  {
    icon: GraduationCap,
    text: "Real-world teaching insights.",
  },
  {
    icon: Lightbulb,
    text: "Stress-free techniques to remember hard facts.",
  },
];

function CourseOverview() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0">
        <Image
          src="/book1.jpeg"
          alt="Course overview background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-md"
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

const featureCards = [
  {
    icon: Video,
    title: "Interactive Video Lectures",
    description: "Every week for doubt clearance.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Tests & Analysis",
    description: "50+ full-length mocks with real-time simulation.",
  },
  {
    icon: FileText,
    title: "Study Materials",
    description:
      "Crisp PDFs, mind maps, and previous year papers based studies.",
  },
  {
    icon: MessageCircle,
    title: "Live Sessions",
    description: "Doubt-clearing, strategy webinars, and exam-centred prep.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Exclusive Group for peer discussions & updates.",
  },
  {
    icon: BookOpen,
    title: "Free Resources",
    description: "Downloadable e-books, sample videos, and NTA pattern guides.",
  },
];

function FeaturesBenefits() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0">
        <Image
          src="/book2.jpeg"
          alt="Features background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Features &amp; Benefits
          </h2>
          <div className="mx-auto h-1 w-24 bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => {
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

function SyllabusCoverage() {
  const syllabus = [
    "British Literature: Chaucer to Contemporary (e.g., Shakespeare, Romantic Poets).",
    "American & World Literature: Key Authors, Movements.",
    "Literary Theory & Criticism: Structuralism, Feminism, Postcolonialism.",
    "Indian Writing in English: Tagore, Rushdie, Diaspora, Dalit.",
    "Language & Linguistics: Phonetics, Semantics.",
    "Bonus: Research Methodology Tailored for Literature Scholars.",
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0">
        <Image
          src="/book3.jpeg"
          alt="Syllabus background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-50/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Syllabus Coverage
          </h2>
          <div className="mx-auto h-1 w-24 bg-amber-500" />
        </div>

        <div className="mx-auto max-w-5xl rounded-2xl border border-blue-100 bg-white p-8 shadow-lg md:p-10">
          <ul className="space-y-4">
            {syllabus.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-lg leading-relaxed text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const netAchieverVideos = getNtaNetSuccessStories();

function SuccessStories() {
  return (
    <SuccessStoriesVideoCarousel
      stories={netAchieverVideos}
      heading="NTA NET Success Stories"
      description="Watch real success stories from NTA NET achievers who cleared NET/JRF through focused preparation and expert mentorship at LePearl."
    />
  );
}

const oneTimeFeatures = [
  "Full course access",
  "Study materials",
  "Mock tests",
  "Doubt sessions",
];

const instalmentSchedule = [
  { label: "1st Instalment", amount: 4500 },
  { label: "2nd Instalment", amount: 2900 },
  { label: "3rd Instalment", amount: 2900 },
  { label: "4th Instalment", amount: 2900 },
  { label: "5th Instalment", amount: 2900 },
];

const installmentFeatures = [
  "Full course access",
  "Study materials",
  "Mock tests",
  "Doubt sessions",
  "Flexible payment",
];

function EnrollmentSection() {
  const handleEnroll = () => {
    alert(
      "Enrollment form will open here. Please contact LePearl Coaching Institute for enrollment.",
    );
  };

  return (
    <section
      id="enrollment"
      className="relative overflow-hidden py-16 text-white md:py-24"
    >
      <div className="absolute inset-0">
        <Image
          src="/book7.jpeg"
          alt="Enrollment background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 to-indigo-900/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Join the UGC NET Paper 2 English Literature Course Today
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            Choose the payment plan that works best for you and start your
            journey to success.
          </p>
        </div>

        {/* One-Time Payment Card */}
        <div className="mx-auto mb-8 max-w-sm">
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-gray-900 shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="absolute right-0 top-0 bg-amber-500 px-4 py-1 text-sm font-bold text-white">
              SAVE ₹3,001
            </div>

            <div className="mb-4 text-center">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                One-Time Payment
              </h3>
              <span className="text-4xl font-bold text-blue-900">Rs. 2/-</span>
              <p className="mt-1 text-gray-500 line-through">₹18,496</p>
            </div>

            <div className="net-paper2-scholarship-blink mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="font-semibold text-amber-700">
                Scholarship upto 100%
              </p>
              <p className="mt-1 text-sm font-medium text-blue-900">
                After UGC NET qualification – 1 year Free access to all courses
              </p>
            </div>

            <div className="mb-6">
              <ul className="space-y-2">
                {oneTimeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/student-registration?mode=paid&course=NET%20Paper%202%20(English)"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-blue-800"
              style={{ color: "#ffffff" }}
            >
              Enroll Now
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-8 max-w-5xl text-center">
          <p className="text-lg font-semibold uppercase tracking-widest text-blue-200">
            — or choose an instalment —
          </p>
        </div>

        {/* 5 Individual Instalment Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instalmentSchedule.map((inst, idx) => (
            <div
              key={inst.label}
              className="relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 text-gray-900 shadow-xl transition-transform hover:scale-[1.03]"
            >
              {/* Badge */}
              <div
                className="absolute right-0 top-0 px-3 py-1 text-xs font-bold text-white"
                style={{
                  background: idx === 0 ? "#4f46e5" : "#6366f1",
                  borderBottomLeftRadius: "10px",
                }}
              >
                {inst.label.toUpperCase()}
              </div>

              <div className="mb-4 mt-4 text-center">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                  {inst.label}
                </p>
                <span className="text-4xl font-bold text-blue-900">
                  Rs. {inst.amount.toLocaleString("en-IN")}/-
                </span>
                <p className="mt-1 text-xs text-gray-400">
                  {idx === 0
                    ? "Pay now · Instant access"
                    : `Due ${idx * 30} days after enrolment`}
                </p>
              </div>

              <div className="mb-5 flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Full course access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Study materials</span>
                  </li>
                  {idx === 0 && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                      <span>Mock tests &amp; Doubt sessions</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Flexible payment</span>
                  </li>
                </ul>
              </div>

              <a
                href="/student-registration?mode=paid&course=NET%20Paper%202%20(English)&payment=instalment"
                className="block w-full rounded-lg py-3 text-center text-base font-bold text-white transition-colors"
                style={{
                  background: idx === 0 ? "#4338ca" : "#4f46e5",
                  color: "#ffffff",
                }}
              >
                Enroll Now
              </a>
            </div>
          ))}
        </div>

        {/* Scholarship Terms & Conditions */}
        <div className="mx-auto mt-14 max-w-5xl rounded-2xl bg-white/10 p-8 text-white backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h3 className="mb-1 text-2xl font-bold">
              Terms &amp; Conditions for Scholarship
            </h3>
            <p className="text-lg font-semibold text-amber-300">
              (Upto 100% Scholarship)
            </p>
            <p className="mt-2 text-blue-200">
              📅 Announcement of Scholarship:{" "}
              <span className="font-semibold text-white">
                15th of Every Month
              </span>
            </p>
          </div>

          <p className="mb-6 leading-relaxed text-blue-100">
            The Institute will be conducting fortnightly and monthly tests to
            monitor the progress of the student. Tests will be conducted on
            Sundays on an online platform simulating the realtime NET exam
            pattern. Every month there will be 1 fortnight and 1 monthly test.
            Fortnightly tests will consist of{" "}
            <span className="font-semibold text-white">
              50 Questions in 45 minutes
            </span>
            , while monthly tests will consist of{" "}
            <span className="font-semibold text-white">
              100 Questions in 90 minutes
            </span>
            .
          </p>

          <div className="mb-6 space-y-5">
            <div className="rounded-xl border border-white/20 bg-white/10 p-5">
              <p className="mb-2 font-bold text-amber-300">
                Term 1 — Minimum 45% aggregate marks (mandatory)
              </p>
              <p className="mb-3 text-sm text-blue-100">
                In aggregate the student must secure a minimum of 45% marks as
                per the weightage given below to become eligible for
                scholarship.
              </p>
              <p className="mb-3 text-sm text-blue-200">
                <span className="font-semibold text-white">Note:</span>{" "}
                Weightage for fortnightly and monthly test is same. A total of
                150 marks will be converted into percentage.
              </p>
              <div className="overflow-hidden rounded-lg border border-white/20">
                <table className="w-full text-sm">
                  <thead className="bg-white/20 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Score Range</th>
                      <th className="px-4 py-2 text-left">Monthly Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-blue-100">
                    <tr className="bg-green-900/30">
                      <td className="px-4 py-2">Above 60%</td>
                      <td className="px-4 py-2 font-semibold text-green-300">
                        ₹0 — Full Scholarship (No fees)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">50% – 60%</td>
                      <td className="px-4 py-2">
                        Half fees —{" "}
                        <span className="font-semibold">Rs. 1,450/-</span>
                      </td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="px-4 py-2">45% – 50%</td>
                      <td className="px-4 py-2">
                        75% fees —{" "}
                        <span className="font-semibold">Rs. 2,175/-</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Below 45%</td>
                      <td className="px-4 py-2 text-red-300">
                        No scholarship — Full fees{" "}
                        <span className="font-semibold">Rs. 2,900/-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-5">
              <p className="mb-2 font-bold text-amber-300">
                Term 2 — Minimum 80% attendance (mandatory)
              </p>
              <p className="text-sm text-blue-100">
                Students must be actively present in all scheduled classes with
                a minimum of{" "}
                <span className="font-semibold text-white">80% attendance</span>{" "}
                every month. Students must participate in discussions with{" "}
                <span className="font-semibold text-white">Video ON</span>.
                Failing to maintain 80% attendance requires payment of full
                monthly fees regardless of test scores.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-center text-sm text-amber-200">
            ⭐{" "}
            <span className="font-semibold text-white">
              Students maintaining 60%+ score AND 80%+ attendance every month
              will receive full scholarship for that month.
            </span>
          </div>
        </div>

        <style jsx>{`
          @keyframes scholarshipBlink {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.35;
            }
          }

          .net-paper2-scholarship-blink {
            animation: scholarshipBlink 1.2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
}

export default function NETPaper2CoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <FeaturesBenefits />
      <SyllabusCoverage />
      <SuccessStories />
      <EnrollmentSection />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
