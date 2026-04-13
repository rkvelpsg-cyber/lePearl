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
            <a
              href="/login"
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

const netAchievers = [
  {
    name: "Nidhi Shukla",
    examName: "NTA-NET Dec 2025",
    imageUrl: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg",
    quote:
      "The NET course at LePearl helped me build confidence and score high in both teaching and research aptitude.",
  },
  {
    name: "Richa Singh",
    examName: "NTA-NET Dec 2026",
    imageUrl: "/Richa%20Singh_NET_Dec_2026.jpeg",
    quote:
      "Mock tests, live sessions, and expert mentorship made the NET exam preparation clear and strong.",
  },
  {
    name: "Kanika Sharma",
    examName: "NTA-NET Dec 2025",
    imageUrl: "/Kanika%20Sharma.jpeg",
    quote:
      "LePearl's structured NET training gave me the discipline I needed to clear the exam.",
  },
  {
    name: "Abhishesh Verma",
    examName: "NTA-NET Jun 2025",
    imageUrl: "/Abhishesh%20Verma.jpeg",
    quote:
      "Strategic practice and personalized guidance made all the difference for my NET success.",
  },
  {
    name: "Rashmita Sahoo",
    examName: "NTA-NET Dec 2024",
    imageUrl: "/Rashmita%20Sahoo.jpeg",
    quote:
      "The clarity and confidence I gained at LePearl helped me excel in NET English.",
  },
  {
    name: "Hemlata",
    examName: "NTA-NET Jun 2023",
    imageUrl: "/Hemlata.jpeg",
    quote:
      "Focused revision and regular doubt clearing sessions made NET prep far easier.",
  },
  {
    name: "Shabnam Khatun",
    examName: "NTA-NET Jun 2023",
    imageUrl: "/Shabnam%20Khatun.jpeg",
    quote:
      "LePearl's approach made concepts stick and helped me perform confidently in NET.",
  },
  {
    name: "Shivani Tiwari",
    examName: "NTA-NET JRF Dec 2024",
    imageUrl: "/Shivani%20Tiwari.jpeg",
    quote:
      "Expert coaching and mocks helped me secure JRF with a strong NET score.",
  },
  {
    name: "Vineeta Vijay Sharma",
    examName: "NTA-NET Dec 2022",
    imageUrl: "/Vineeta%20Vijay%20Sharma.jpeg",
    quote:
      "Structured preparation and support from LePearl were key to my NET success.",
  },
  {
    name: "Alvina Parveen",
    examName: "NTA-NET Jun 2025",
    imageUrl: "/Alvina%20Parveen.jpeg",
    quote:
      "LePearl's teaching made even difficult NET topics easy to understand.",
  },
  {
    name: "Brijesh Kumar Pal",
    examName: "NTA-NET Jan 2025",
    imageUrl: "/Brijesh%20Kumar%20Pal.jpeg",
    quote:
      "Regular tests and expert feedback gave me the edge in NET preparation.",
  },
  {
    name: "Akanksha Singham",
    examName: "NTA-NET Jan 2025",
    imageUrl: "/Akanksha%20Singham.jpeg",
    quote:
      "The NET course kept me focused and confident all the way through exam day.",
  },
  {
    name: "Neelu Patel",
    examName: "NTA-NET Jun 2023",
    imageUrl: "/Neelu%20Patel.jpeg",
    quote:
      "My NET success was built on LePearl's strong concept clarity and practice.",
  },
  {
    name: "Deepti Dwivedi",
    examName: "NTA-NET Jun 2023",
    imageUrl: "/Deepti%20Dwivedi.jpeg",
    quote:
      "Supportive faculty and structured mock tests helped me clear NET with confidence.",
  },
  {
    name: "Revathy",
    examName: "NTA-NET Dec 2022",
    imageUrl: "/Revathy.jpeg",
    quote:
      "The NET course gave me the right strategy, practice, and motivation to clear the exam.",
  },
  {
    name: "Namit Kumar",
    examName: "NTA-NET 2020",
    imageUrl: "/Namit%20Kumar.jpeg",
    quote:
      "LePearl helped me build a strong foundation and finish NET preparation on time.",
  },
  {
    name: "Shyam Pal Singh",
    examName: "NTA-NET 2020",
    imageUrl: "/Shyam%20Pal%20Singh.jpeg",
    quote:
      "Consistent practice and expert guidance made the NET exam achievable.",
  },
];

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

            <a
              href="/login"
              className="block w-full rounded-lg bg-blue-900 py-4 text-lg font-bold text-white text-center transition-colors hover:bg-blue-800"
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
              href="/login"
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

export default function NETPaper1CoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <FeaturesBenefits />
      <SyllabusCoverage />
      <NtaNetSuccessCarousel stories={netAchievers} />
      <EnrollmentSection />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}



