"use client";

import {
  GraduationCap,
  Download,
  CheckCircle,
  Target,
  Video,
  Users,
  Award,
  TrendingUp,
  PlayCircle,
  FileText,
  ClipboardCheck,
  MessageCircle,
  UserCheck,
  Sparkles,
  Star,
  Quote,
  Check,
  Mail,
  Phone,
  MapPin,
  Facebook,
  X,
  Instagram,
  Linkedin,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
function Header() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return <CoursePageHeader onEnroll={scrollToEnrollment} />;
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
function Hero() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758270704262-ecc82b23dc37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwY29hY2hpbmd8ZW58MXx8fHwxNzczMjk1MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Students studying"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Crack MPPSC Assistant Professor Exam with Expert Guidance
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
            Comprehensive online course: Master syllabus, key facts, and
            in-depth knowledge of the topics and secure your dream faculty role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={scrollToEnrollment}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Enroll Now
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Course Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Mock Tests", "Study Materials", "Live Doubt Sessions"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
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

// ─────────────────────────────────────────────────────────────
// Course Overview
// ─────────────────────────────────────────────────────────────
const overviewPoints = [
  {
    icon: Target,
    text: "Tailored specifically for MPPSC Assistant Professor aspirants",
  },
  {
    icon: Video,
    text: "Blend of recorded video lectures, PDFs, and live doubt resolution sessions",
  },
  {
    icon: Users,
    text: "Flipped live classes with live question and answer solving and explanations",
  },
  {
    icon: Award,
    text: "Subject expertise with more than 15 years of teaching experience",
  },
  {
    icon: TrendingUp,
    text: "No shortcuts, only proven strategies for first-attempt success",
  },
];

function CourseOverview() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Course Overview
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overviewPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow flex items-start gap-4"
              >
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Icon className="w-6 h-6 text-blue-900" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-2">
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

// ─────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────
const features = [
  {
    icon: PlayCircle,
    title: "Video Lectures",
    description:
      "In-depth coverage of the MPPSC exam pattern with simplified explanations.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Tests",
    description:
      "50+ mock tests with detailed analysis and performance tracking.",
  },
  {
    icon: FileText,
    title: "Study Material",
    description:
      "Concise PDFs, recorded lectures, and decoded previous year papers.",
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Clearing",
    description: "Weekly sessions to clarify doubts in real time.",
  },
  {
    icon: UserCheck,
    title: "Personalized Attention",
    description: "One-to-one academic support based on student needs.",
  },
  {
    icon: Sparkles,
    title: "Holistic Development",
    description: "Focus on academic growth, confidence, and subject mastery.",
  },
];

function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Course Features &amp; Benefits
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-blue-100"
              >
                <div className="bg-blue-900 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Sharma",
    image:
      "https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMjk1MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    role: "MPPSC Assistant Professor - History",
    quote:
      "The structured lectures and mock tests from LePearl helped me crack the MPPSC Assistant Professor exam in my first attempt.",
  },
  {
    name: "Rajesh Kumar",
    image:
      "https://images.unsplash.com/photo-1627776880991-808c5996527b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwc3R1ZGVudCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzI5NTEzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    role: "MPPSC Assistant Professor - Economics",
    quote:
      "LePearl's personalized attention and expert faculty guidance made all the difference in my preparation journey.",
  },
  {
    name: "Anita Deshmukh",
    image:
      "https://images.unsplash.com/photo-1622460241924-a114e6abe1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHRlYWNoZXIlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyOTUxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    role: "MPPSC Assistant Professor - Political Science",
    quote:
      "The comprehensive study materials and weekly doubt sessions were instrumental in building my confidence and clearing the exam.",
  },
];

function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Assistant Professor Success Stories
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-200" />

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-amber-400">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-blue-900 mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-amber-600 font-semibold mb-3">
                  {testimonial.role}
                </p>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────
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

function Pricing() {
  const handleEnroll = () => {
    alert(
      "Enrollment form will open here. Please contact LePearl Coaching Institute for enrollment.",
    );
  };

  return (
    <section
      id="enrollment"
      className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-blue-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the MPPSC Assistant Professor Course Today
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Choose the payment plan that works best for you and start your
            journey to success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* One-Time Payment */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 text-sm font-bold">
              SAVE ₹3,001
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                One-Time Payment
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-blue-900">₹8,999</span>
              </div>
              <p className="text-gray-500 line-through">₹12,000</p>
            </div>

            <div className="mb-8">
              <p className="font-semibold text-blue-900 mb-4">Includes:</p>
              <ul className="space-y-3">
                {oneTimeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleEnroll}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Enroll Now
            </button>
          </div>

          {/* Installment Plan */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform relative border-4 border-amber-400">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4" />
              POPULAR
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Installment Plan
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-blue-900">
                  5 Instalments of ₹2,000
                </span>
              </div>
              <p className="text-gray-600">Total Cost: ₹10,000</p>
            </div>

            <div className="mb-8">
              <p className="font-semibold text-blue-900 mb-4">Includes:</p>
              <ul className="space-y-3">
                {installmentFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleEnroll}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Fill Registration Form
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-blue-100">
            Need help choosing?{" "}
            <a
              href="#"
              className="text-amber-400 hover:text-amber-300 font-semibold underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  return <CoursePageFooter />;
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function MPPSCCoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}
