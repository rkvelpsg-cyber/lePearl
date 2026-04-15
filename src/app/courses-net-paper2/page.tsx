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
import { NtaNetSuccessCarousel } from "@/components/NtaNetSuccessCarousel";

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
              href="/login-portal" target="_blank" rel="noopener noreferrer"
              className="rounded-lg bg-amber-500 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:bg-amber-600"
            >
              Enroll Now
            </a>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/40 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
              <Download className="h-5 w-5" />
              Download Course Details
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

const netSuccessStories = [
  {
    name: "Nidhi Shukla",
    examName: "NTA-NET Dec 2025",
    imageUrl: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg",
    quote:
      "LePearl's structured NET coaching helped me build confidence and score high in both teaching and research aptitude.",
  },
  {
    name: "Ms Alvina Parveen",
    examName: "NTA-NET Jun 2025",
    imageUrl: "/Alvina%20Parveen.jpeg",
    quote:
      "Weekly doubts, mock tests, and expert guidance turned a difficult syllabus into a clear success path.",
  },
  {
    name: "Richa Singh",
    examName: "NTA-NET Dec 2026",
    imageUrl: "/Richa%20Singh_NET_Dec_2026.jpeg",
    quote:
      "The course made literature preparation logical, memorable, and aligned with the NET exam pattern.",
  },
  {
    name: "Ms Kanika Sharma",
    examName: "NTA-NET Dec 2025",
    imageUrl: "/Kanika%20Sharma.jpeg",
    quote:
      "Focused revision strategies and live mentorship helped me clear NET with confidence.",
  },
  {
    name: "Mr Abhishesh Verma",
    examName: "NTA-NET Jun 2025",
    imageUrl: "/Abhishesh%20Verma.jpeg",
    quote:
      "Practical teaching methods and constant evaluation made all the difference in my NET journey.",
  },
];

function SuccessStories() {
  return <NtaNetSuccessCarousel stories={netSuccessStories} />;
}

const oneTimeFeatures = [
  "Full course access",
  "Study materials",
  "Mock tests",
  "Doubt sessions",
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

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-gray-900 shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="absolute right-0 top-0 bg-amber-500 px-4 py-1 text-sm font-bold text-white">
              SAVE ₹3,001
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

            <a
              href="/login-portal" target="_blank" rel="noopener noreferrer"
              className="block w-full rounded-lg bg-blue-900 py-4 text-lg font-bold text-white text-center transition-colors hover:bg-blue-800"
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
                  5 Instalments of ₹2,000
                </span>
              </div>
              <p className="text-gray-600">Total Cost: ₹10,000</p>
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

            <a
              href="/login-portal" target="_blank" rel="noopener noreferrer"
              className="block w-full rounded-lg bg-amber-500 py-4 text-lg font-bold text-white text-center transition-colors hover:bg-amber-600"
            >
              Fill Registration Form
            </a>
          </div>
        </div>
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
