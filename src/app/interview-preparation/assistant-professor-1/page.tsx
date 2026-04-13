"use client";

import {
  GraduationCap,
  Target,
  Users,
  Award,
  TrendingUp,
  MessageCircle,
  ClipboardCheck,
  UserCheck,
  Sparkles,
  Mic,
  CheckCircle,
  Ear,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

function Header() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return <CoursePageHeader onEnroll={scrollToEnrollment} />;
}

function HeroSection() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
          alt="Interview preparation"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Assistant Professor Interview Preparation Course
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-cyan-100 sm:text-xl">
            Communication Skills: The Secret Weapon That Turns Knowledge into
            Selection
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/login"
              className="rounded-lg bg-yellow-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-yellow-400"
            >
              Enroll Now
            </a>
            <button
              onClick={scrollToEnrollment}
              className="rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              View Course Details
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Mic className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Communication Training
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <ClipboardCheck className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Mock Interviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <MessageCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Expert Mentoring
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="enrollment" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-teal-800 sm:text-4xl">
            Course Fee Options
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-7 shadow-md">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
              Plan 1
            </p>
            <p className="text-2xl font-bold text-teal-800">
              Both classes and mock interview- 7495/-
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-7 shadow-md">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
              Plan 2
            </p>
            <p className="text-2xl font-bold text-teal-800">
              Only mock interview- 2000/- (1-2 mock interviews)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const overviewPoints = [
  {
    icon: Target,
    title: "Communication Is the Difference",
    text: "Imagine stepping into the interview room for an Assistant Professor or Lecturer in English Literature. The panel is watching. The questions begin. In that single moment, your UGC NET score and publications are important, but it’s your communication that decides whether you shine brightly… or quietly fade away.",
  },
  {
    icon: Users,
    title: "Your Presence Matters",
    text: "Will your words spark genuine passion for Blake’s mystical visions or Radcliffe’s chilling gothic worlds? Will you command the room like a natural educator? Or will hidden nervousness dim your true potential?",
  },
  {
    icon: Award,
    title: "What Panels Really Seek",
    text: "Masterful communication is the hidden superpower that separates selected candidates from the rest. Panels don’t just seek subject experts; they choose future teachers who can inspire classrooms, express ideas with clarity, and build real connections.",
  },
  {
    icon: TrendingUp,
    title: "Your Turning Point",
    text: "Curious how the right communication can make the panel remember you long after you leave the room?",
  },
];

function CourseOverview() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-teal-800 sm:text-4xl">
            Why Communication Can Make or Break Your Academic Dream
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {overviewPoints.map((point) => {
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
                  <p className="leading-relaxed text-gray-600">{point.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <p className="mb-3 leading-relaxed text-gray-700">
            Subject knowledge may get you shortlisted, but the way you
            communicate often decides the outcome.
          </p>
          <p className="mb-3 leading-relaxed text-gray-700">
            What if the manner in which you explain The Castle of Otranto or
            share your teaching philosophy reveals something deeper, not just
            what you know, but the kind of educator you truly are?
          </p>
          <p className="mb-3 leading-relaxed text-gray-700">
            The panel is silently evaluating questions you may not even hear:
            Can this candidate make difficult literary ideas come alive for
            students? Can they stay composed under pressure? Will their
            classroom presence truly engage young minds?
          </p>
          <p className="leading-relaxed text-gray-700">
            Strong communication turns good candidates into unforgettable ones.
            The good news? These powerful skills are learnable, and the change
            can begin sooner than you think.
          </p>
        </div>
      </div>
    </section>
  );
}

const featureCards = [
  {
    icon: Mic,
    title: "1. Verbal Mastery: Speak Like the Scholar You Are",
    description:
      "Imagine answering every question with natural confidence, clear, passionate, and precise, without rambling or hesitation. What if you could structure your responses so powerfully that the panel leans in, completely engaged? There’s a subtle art to balancing academic depth with approachable clarity, and mastering it can dramatically shift the interview in your favour.",
  },
  {
    icon: UserCheck,
    title: "2. Non-Verbal Power: Let Your Presence Speak Before You Do",
    description:
      "Before you say a single word, your body language has already begun the conversation. Are you sending signals of quiet confidence and belonging? Or are small nervous habits quietly undermining your message? Small, intentional shifts in posture, eye contact, and presence can create an aura of natural authority that panels instantly notice and respect.",
  },
  {
    icon: Ear,
    title: "3. The Art of Listening: The Most Underrated Superpower",
    description:
      "Sometimes the real advantage lies not in speaking, but in how you listen. What if mastering the strategic pause and thoughtful rephrasing could turn even difficult questions into opportunities to shine as a reflective and composed educator?",
  },
  {
    icon: BookOpen,
    title: "Essential Preparations You Cannot Afford to Miss",
    description:
      "The panel observes everything, from your entry to the final moment. Certain basics can quietly make or break first impressions: Flawless organisation of your documents. Professional dressing and grooming that creates instant impact. Timeless etiquette that reflects respect and awareness. Get these right, and you eliminate unnecessary barriers to your success.",
  },
  {
    icon: MessageCircle,
    title:
      "Practical Ways to Transform Your Communication (Before the Big Day)",
    description:
      "You don’t need to wait for the actual interview to start improving. Simple daily practices can rapidly build fluency and confidence. The candidates who approach preparation with curiosity and excitement, rather than as a burden — are often the ones who walk out hearing the words they’ve been waiting for.",
  },
  {
    icon: AlertTriangle,
    title: "Common Pitfalls That Steal Opportunities (And How to Avoid Them)",
    description:
      "Even well-prepared candidates sometimes lose their edge due to small, avoidable habits. What if sidestepping just a few common mistakes could significantly boost your chances? Staying authentic, enthusiastic, and letting your genuine passion for English Literature shine through can make all the difference.",
  },
];

function FeaturesAndBenefits() {
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
          {featureCards.map((feature) => {
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

function FinalCallout() {
  return (
    <section className="bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 py-20 text-white">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-500/20 px-5 py-2">
          <GraduationCap className="h-5 w-5 text-yellow-300" />
          <span className="font-semibold text-yellow-100">
            Your Next Step Toward Interview Success
          </span>
        </div>

        <p className="mb-4 text-lg leading-relaxed text-cyan-100 sm:text-xl">
          Communication is far more than “speaking well.” It’s about connecting,
          inspiring, and convincing the panel that you are exactly the educator
          their department needs.
        </p>
        <p className="mb-4 text-lg leading-relaxed text-cyan-100 sm:text-xl">
          Are you ready to convert nervous energy into calm confidence? To turn
          every answer into something memorable?
        </p>
        <p className="mb-4 text-lg leading-relaxed text-cyan-100 sm:text-xl">
          Start preparing today. With refined communication skills, you won’t
          just attend the interview; you will own the room.
        </p>
        <p className="mb-8 text-lg leading-relaxed text-cyan-100 sm:text-xl">
          Your future as an Assistant Professor in English Literature is nearer
          than you think. Make sure your communication is ready to open every
          door.
        </p>

        <a
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-yellow-400"
        >
          <Sparkles className="h-5 w-5" />
          Start Interview Preparation
        </a>
      </div>
    </section>
  );
}

export default function AssistantProfessorInterviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <PricingSection />
      <CourseOverview />
      <FeaturesAndBenefits />
      <FinalCallout />

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}



