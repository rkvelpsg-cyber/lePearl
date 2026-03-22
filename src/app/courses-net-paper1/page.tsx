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
  Quote,
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
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/book4.jpeg"
          alt="Students learning"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Ace UGC NET Paper 1, Ignite Your Academic Journey
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-blue-100 sm:text-xl">
            Master Teaching &amp; Research Aptitude with Proven Strategies:
            Clear NTA NET on First Try, Secure JRF &amp; Lectureship.
          </p>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={scrollToEnrollment}
              className="rounded-lg bg-amber-500 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:bg-amber-600"
            >
              Enroll Now
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/40 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
              <Download className="h-5 w-5" />
              Download Course Details
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["Weekly Live Sessions", "50+ Mock Tests", "Mind Maps + PDFs"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  <span className="font-semibold">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const overviewPoints = [
  {
    icon: Award,
    text: "Led by NET-qualified experts with 15+ years of experience.",
  },
  {
    icon: Target,
    text: "Holistic prep blending NTA patterns.",
  },
  {
    icon: Users,
    text: "Real-world teaching insights.",
  },
  {
    icon: Brain,
    text: "Stress-free techniques.",
  },
  {
    icon: Lightbulb,
    text: "No rote learning and focus on conceptual clarity.",
  },
];

function CourseOverview() {
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
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
    "Teaching Aptitude: Methods, Evaluation, Learner Characteristics.",
    "Research Aptitude: Types, Ethics, Methodology, Data Interpretation.",
    "Comprehension & Reasoning: Logical, Mathematical, Verbal.",
    "Communication, ICT, Environment, Higher Education System.",
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Syllabus Coverage
          </h2>
          <div className="mx-auto h-1 w-24 bg-amber-500" />
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-white p-8 shadow-lg md:p-10">
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

function Testimonials() {
  const stories = [
    "Many success stories are available; add here.",
    "Many success stories are available; add here.",
    "Many success stories are available; add here.",
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Testimonials
          </h2>
          <div className="mx-auto h-1 w-24 bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative rounded-2xl bg-blue-50 p-8 shadow-lg"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-amber-300" />
              <p className="mt-6 italic leading-relaxed text-gray-700">
                &ldquo;{story}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
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
      className="bg-gradient-to-br from-blue-900 to-indigo-800 py-16 text-white md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Join the UGC NET Paper 1 Course Today
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

            <button
              onClick={handleEnroll}
              className="w-full rounded-lg bg-blue-900 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-800"
            >
              Enroll Now
            </button>
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

            <button
              onClick={handleEnroll}
              className="w-full rounded-lg bg-amber-500 py-4 text-lg font-bold text-white transition-colors hover:bg-amber-600"
            >
              Fill Registration Form
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-900 p-2">
                <img
                  src="/WebsiteLogo_final_white.png"
                  alt="LePearl Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight text-white">
                  LePearl Education
                </h3>
                <p className="text-xs text-gray-400">
                  Centre of Excellence in English Language & Literature
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering NET aspirants with quality coaching and complete
              academic support.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <a
                  href="tel:+911234567890"
                  className="text-sm hover:text-amber-400"
                >
                  +91 1234 567 890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <a
                  href="mailto:info@lepearl.edu"
                  className="text-sm hover:text-amber-400"
                >
                  info@lepearl.edu
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, X, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="rounded-full bg-blue-800 p-3 transition-colors hover:bg-amber-500"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2026 LePearl Coaching Institute. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function NETPaper1CoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <FeaturesBenefits />
      <SyllabusCoverage />
      <Testimonials />
      <EnrollmentSection />
      <Footer />
    </div>
  );
}
