"use client";

import {
  Award,
  BookOpen,
  Check,
  CheckCircle,
  ClipboardCheck,
  MessageCircle,
  MessageSquare,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
          alt="PhD interview preparation"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            PhD Interview Preparation Course
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-cyan-100 sm:text-xl">
            Communication Skills: The Secret Weapon That Turns Knowledge into
            Selection
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Target className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-medium">Research Clarity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Users className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-medium">Panel Confidence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Award className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-medium">Selection Mindset</span>
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
      icon: BookOpen,
      title: "Interview Reality",
      description:
        "Imagine walking into the PhD interview room at a university. The doctoral panel is seated. The questions begin. Your research proposal and academic record got you here, but it is how you communicate that decides whether you get selected... or fade away.",
    },
    {
      icon: MessageCircle,
      title: "Communication Decides",
      description:
        "Will your words clearly convey the importance of your research? Will you defend your ideas with confidence and clarity? Or will nervousness overshadow your potential?",
    },
    {
      icon: TrendingUp,
      title: "Hidden Edge",
      description:
        "Masterful communication is the hidden edge that turns strong candidates into selected PhD scholars. Universities do not just want subject experts; they want researchers who can articulate ideas sharply, defend their work, and show real academic promise.",
    },
    {
      icon: Target,
      title: "Why It Matters",
      description:
        "Subject knowledge and research proposal may get you shortlisted, but exceptional communication often seals the final decision.",
    },
    {
      icon: Users,
      title: "What Panels Evaluate",
      description:
        "Can this candidate explain complex research clearly? Can they defend their ideas with poise under pressure? Do they show the potential to become an independent researcher?",
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

        <p className="mx-auto mt-10 max-w-5xl rounded-xl bg-white p-6 text-center text-gray-700 shadow-sm">
          Strong communication turns good applicants into unforgettable ones.
          The best part? These skills are learnable, and the change starts now.
        </p>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "1. Verbal Mastery",
      description:
        "Answer with natural confidence, clear, precise, and passionate. Structure your responses so the panel leans in, fully engaged.",
    },
    {
      icon: UserCheck,
      title: "2. Non-Verbal Power",
      description:
        "Before you speak, your posture, eye contact, and presence already send a powerful message. Small shifts create quiet authority and instant respect.",
    },
    {
      icon: CheckCircle,
      title: "3. The Art of Listening",
      description:
        "Sometimes the real advantage lies in how you listen. Master the pause and thoughtful reply, turning tough questions into opportunities to shine.",
    },
    {
      icon: ClipboardCheck,
      title: "Essential Preparations",
      description:
        "Perfectly organised documents and research proposal, professional dressing and grooming, proper etiquette and respect. Get these basics right and remove hidden barriers.",
    },
    {
      icon: TrendingUp,
      title: "Practical Transformation",
      description:
        "Start today: record yourself explaining your research, do mock viva sessions, cut filler words. Candidates who prepare with energy are the ones who walk out hearing 'You are selected.'",
    },
    {
      icon: Target,
      title: "Common Pitfalls to Avoid",
      description:
        "Avoid rushing answers, weak eye contact, or sounding too rehearsed. Stay authentic and let your genuine passion for research show; it makes all the difference.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-teal-800 sm:text-4xl">
            The Hidden Layers of Communication That Interviewers Notice First
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
                <h3 className="mb-3 text-xl font-bold text-teal-800">
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

function FinalSection() {
  return (
    <section
      id="enrollment"
      className="bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 py-20 text-white"
    >
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          Your Next Step Toward PhD Selection
        </h2>
        <p className="mb-5 text-lg leading-relaxed text-cyan-100">
          Communication is more than speaking well; it is about connecting,
          convincing, and proving you belong in their research community.
        </p>
        <p className="mb-5 text-lg leading-relaxed text-cyan-100">
          Ready to turn nervousness into a confident presence? Start practising
          now. With polished communication, you will not just attend the PhD
          interview; you will own it.
        </p>
        <p className="mb-8 text-lg leading-relaxed text-cyan-100">
          Your PhD journey at top universities is closer than you think. Make
          sure your communication skills are ready to open the door.
        </p>

        <a
          href="/login"
          className="inline-block rounded-lg bg-yellow-500 px-10 py-4 text-lg font-bold text-teal-900 transition hover:bg-yellow-400"
        >
          Start Preparing Now
        </a>
      </div>
    </section>
  );
}

export default function PhDInterviewPage() {
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
      <FinalSection />

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}



