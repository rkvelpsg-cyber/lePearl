"use client";

import { useState } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Facebook,
  FileText,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  PenTool,
  Phone,
  TrendingUp,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type OverviewPoint = {
  icon: LucideIcon;
  text: string;
};

type Testimonial = {
  name: string;
  exam: string;
  photo: string;
  quote: string;
};

const features: Feature[] = [
  {
    icon: Video,
    title: "Video Lectures",
    description:
      "In-depth coverage of the UP GDC exam pattern with simplified explanations.",
  },
  {
    icon: FileText,
    title: "Mock Tests",
    description:
      "50+ mock tests with detailed analysis and performance insights.",
  },
  {
    icon: BookOpen,
    title: "Study Material",
    description:
      "Concise PDFs, recorded lectures, and decoded previous year question papers.",
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Clearing",
    description: "Weekly sessions providing real-time academic support.",
  },
  {
    icon: Users,
    title: "Personalized Attention",
    description:
      "One-to-one academic attention based on individual student needs.",
  },
  {
    icon: TrendingUp,
    title: "Holistic Development",
    description: "Focus on academic growth, confidence, and subject mastery.",
  },
  {
    icon: PenTool,
    title: "Answer Writing Practice",
    description:
      "Special guidance for descriptive answer writing required in the UP GDC examination.",
  },
];

const overviewPoints: OverviewPoint[] = [
  {
    icon: Award,
    text: "Tailored specifically for UP GDC Assistant Professor aspirants",
  },
  {
    icon: Video,
    text: "Blend of recorded video lectures, PDFs, and live doubt resolution sessions",
  },
  {
    icon: Users,
    text: "Flipped live classes with live question and answer solving and detailed explanation",
  },
  {
    icon: GraduationCap,
    text: "Subject expertise with more than 15 years of teaching experience",
  },
  {
    icon: CheckCircle2,
    text: "No shortcuts, only proven strategies for first-attempt success",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Dr. Priya Sharma",
    exam: "UP Assistant Professor - 2024",
    photo:
      "https://images.unsplash.com/photo-1719245309441-c577e0d1959d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwc3VjY2Vzc3xlbnwxfHx8fDE3NzMzMDc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "LePearl's expert guidance and structured approach helped me clear the exam in my first attempt. The mock tests were exactly like the real exam!",
  },
  {
    name: "Rahul Verma",
    exam: "UP GDC Assistant Professor - 2023",
    photo:
      "https://images.unsplash.com/flagged/photo-1571367061913-be59eefdfc66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwc3R1ZGVudCUyMHN0dWR5aW5nfGVufDF8fHx8MTc3MzMwNzYwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "The personalized attention and live doubt sessions made all the difference. Faculty's 15+ years experience truly shows in their teaching methods.",
  },
  {
    name: "Anjali Singh",
    exam: "UP Assistant Professor - 2025",
    photo:
      "https://images.unsplash.com/photo-1594256347468-5cd43df8fbaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwcHJvZmVzc29yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzczMzA3NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "From comprehensive study material to answer writing practice, LePearl covered everything. I'm now proudly serving as an Assistant Professor!",
  },
];

function UPGDCPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const scrollToEnroll = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const activeTestimonial = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToEnroll} />

      <section className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwbGVjdHVyZXxlbnwxfHx8fDE3NzMzMDc2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Students studying"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Excel in UP GDC Assistant Professor Exam, Ignite Your Teaching
              Career
            </h2>
            <p className="mb-8 text-lg text-blue-100 sm:text-xl">
              Proven course: Deep dive into syllabus, mock tests, and winning
              strategies for Government Degree College placements.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={scrollToEnroll}
                className="rounded-lg bg-yellow-500 px-8 py-4 text-lg font-bold text-blue-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-600 hover:shadow-xl"
              >
                Enroll Now
              </button>
              <button
                type="button"
                className="rounded-lg border-2 border-white bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                Download Course Details
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-yellow-400" />
                <span>Recorded Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-400" />
                <span>Mock Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-yellow-400" />
                <span>Live Doubt Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold text-blue-900">
            Course Overview
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {overviewPoints.map((point, index) => {
              const Icon = point.icon;

              return (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-blue-700">
                    <Icon className="h-6 w-6 text-yellow-400" />
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold text-blue-900">
            Course Features &amp; Benefits
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500">
                    <Icon className="h-8 w-8 text-blue-900" />
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

      <section className="bg-blue-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Student Success Stories
          </h2>

          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm sm:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 h-24 w-24 overflow-hidden rounded-full border-4 border-yellow-400">
                  <ImageWithFallback
                    src={activeTestimonial.photo}
                    alt={activeTestimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mb-6 text-lg italic leading-relaxed sm:text-xl">
                  &quot;{activeTestimonial.quote}&quot;
                </p>
                <h4 className="text-xl font-bold text-yellow-400">
                  {activeTestimonial.name}
                </h4>
                <p className="text-blue-200">{activeTestimonial.exam}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 flex h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-500 shadow-lg transition-colors duration-300 hover:bg-yellow-600"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-blue-900" />
            </button>
            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 flex h-12 w-12 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-500 shadow-lg transition-colors duration-300 hover:bg-yellow-600"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-blue-900" />
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentTestimonial(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "w-8 bg-yellow-400"
                    : "w-3 bg-white/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="enrollment"
        className="bg-gradient-to-br from-blue-50 to-white py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-blue-900 sm:text-4xl">
            Enroll Today and Begin Your Journey to Become a Government College
            Professor
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
            Choose the payment plan that works best for you and start your
            preparation today.
          </p>

          <div className="mx-auto mb-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-900 bg-white p-8 shadow-xl">
              <div className="absolute right-0 top-0 bg-yellow-500 px-4 py-1 text-sm font-bold text-blue-900">
                BEST VALUE
              </div>
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                One-Time Payment
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-900">
                  Rs.14,000
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Full course access",
                  "All study materials included",
                  "50+ mock tests",
                  "Live doubt clearing sessions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="w-full rounded-lg bg-blue-900 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl"
              >
                Enroll Now
              </button>
            </div>

            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
              <h3 className="mb-2 text-2xl font-bold text-blue-900">
                Installment Plan
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-900">
                  Rs.15,000
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Full course access",
                  "All study materials included",
                  "50+ mock tests",
                  "Flexible payment terms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="w-full rounded-lg bg-yellow-500 py-4 text-lg font-bold text-blue-900 shadow-lg transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl"
              >
                Fill Registration Form
              </button>
            </div>
          </div>
        </div>
      </section>

      <CoursePageFooter />
    </div>
  );
}

export default UPGDCPage;
