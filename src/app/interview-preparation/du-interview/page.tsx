"use client";

import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";
import {
  GraduationCap,
  CheckCircle,
  Target,
  Users,
  Award,
  TrendingUp,
  PlayCircle,
  ClipboardCheck,
  MessageCircle,
  UserCheck,
  Sparkles,
  Check,
  BookOpen,
  Ear,
  Handshake,
  AlertTriangle,
} from "lucide-react";

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
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Delhi University Guest Faculty &amp; Assistant Professor Interview
            Preparation
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
            Communication Skills: The Decisive Edge That Turns Your Knowledge
            into Selection
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="/login-portal" target="_blank" rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Start Preparation
            </a>
            <button
              onClick={scrollToEnrollment}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              See Preparation Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Verbal Excellence",
              "Non-Verbal Presence",
              "Interview Composure",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
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
    icon: Target,
    text: "Imagine entering the interview room at a Delhi University college for a Guest Faculty or Assistant Professor position in English Literature. The selection panel is observing you closely. Your academic record and written test have brought you this far, but it is your ability to communicate that will determine whether you are remembered as an outstanding candidate or simply blend in with the rest.",
  },
  {
    icon: Users,
    text: "Will your responses reflect the depth and passion of an effective English teacher? Will you come across as confident, articulate, and student-centric? Or will anxiety dull your presence?",
  },
  {
    icon: Award,
    text: "Exceptional communication is the subtle advantage that separates good candidates from the finally selected ones. DU panels are not merely looking for subject experts; they seek teachers who can explain literary concepts with clarity, inspire students, and manage classroom discussions with poise and confidence.",
  },
  {
    icon: TrendingUp,
    text: "Here’s how mastering communication can leave a lasting impression on the interview panel.",
  },
];

function CourseOverview() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Why Communication Often Decides Your Selection?
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
                <p className="text-gray-700 leading-relaxed">{point.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white p-8 rounded-2xl shadow-md border border-blue-100">
          <p className="text-gray-700 leading-relaxed mb-4">
            Subject expertise gets you shortlisted, but refined communication
            skills frequently make the final difference in Delhi University
            interviews.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The panel quietly assesses:
          </p>
          <ul className="space-y-3">
            {[
              "Can this candidate simplify complex literary texts and critical theories for undergraduate or postgraduate students?",
              "Do they demonstrate composure and clarity when responding under pressure?",
              "Will their teaching style genuinely engage and motivate learners in the classroom?",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Strong communication transforms competent candidates into memorable
            ones. The good news is that these skills can be developed
            systematically, and the transformation begins as soon as you start
            deliberate practice.
          </p>
        </div>
      </div>
    </section>
  );
}

const keyLayers = [
  {
    icon: PlayCircle,
    title: "Verbal Excellence",
    description:
      "Speak with natural confidence, precision, and genuine enthusiasm. Structure your answers logically so the panel remains fully engaged—from discussing Shakespearean tragedy to contemporary literary theory or pedagogical approaches.",
  },
  {
    icon: UserCheck,
    title: "Non-Verbal Impact",
    description:
      "Even before you utter a word, your posture, eye contact, facial expressions, and overall presence convey authority and approachability. Subtle improvements here project quiet confidence and professional readiness.",
  },
  {
    icon: Ear,
    title: "Active Listening and Thoughtful Response",
    description:
      "The ability to listen attentively and respond thoughtfully often sets top candidates apart. A brief, considered pause before answering difficult questions (such as those on curriculum design or student engagement strategies) can turn challenging moments into opportunities to shine.",
  },
];

function KeyLayers() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            The Key Layers of Communication That Interviewers Notice Immediately
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {keyLayers.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
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

const preparationSteps = [
  {
    icon: ClipboardCheck,
    title: "Essential Preparations You Must Not Overlook",
    points: [
      "Well-organised portfolio, research papers, teaching experience documents, and certificates",
      "Professional attire and neat grooming",
      "Courteous etiquette and respectful interaction throughout",
      "Getting these fundamentals right eliminates unnecessary distractions and lets your true potential stand out.",
    ],
  },
  {
    icon: MessageCircle,
    title: "Practical Steps to Sharpen Your Communication for DU Interviews",
    points: [
      "Begin practising immediately with these effective methods:",
      "Record and review your mock answers on topics like teaching The Waste Land, designing an English syllabus, or handling diverse classrooms.",
      "Conduct regular mock interviews focused on common DU questions.",
      "Eliminate filler words and work on pace, clarity, and vocal variety.",
      "Candidates who prepare with consistency and energy are the ones who hear, “We recommend you for the position.”",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Common Mistakes That Cost Opportunities",
    points: [
      "Avoid speaking too quickly, maintaining poor eye contact, appearing overly mechanical, or giving vague responses.",
      "Stay authentic, let your real passion for literature and teaching come through naturally.",
      "Authenticity combined with clarity creates the strongest impact.",
    ],
  },
];

function PreparationPlan() {
  return (
    <section
      id="enrollment"
      className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Interview Readiness Plan
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {preparationSteps.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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

function FinalCallout() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-300/40 rounded-full px-5 py-2 mb-6">
          <GraduationCap className="w-5 h-5 text-amber-300" />
          <span className="font-semibold text-amber-100">
            Your Next Step Towards Selection
          </span>
        </div>

        <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-5">
          Communication is not just about speaking correctly; it is about
          connecting meaningfully, inspiring students, and demonstrating that
          you are the right fit for the English department.
        </p>
        <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-5">
          Ready to convert interview nervousness into a calm, confident
          presence?
        </p>
        <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
          Start refining your communication skills today. With polished
          expression and presence, you will not just attend the Delhi University
          interview; you will excel in it.
        </p>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-base md:text-lg text-blue-100 leading-relaxed">
            Your opportunity as a Guest Faculty or Assistant Professor in
            English at a Delhi University college is closer than you think.
            Ensure your communication skills are strong enough to open that
            door.
          </p>
        </div>

        <a
          href="/login-portal" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Begin DU Interview Preparation
        </a>
      </div>
    </section>
  );
}

export default function DUInterviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <KeyLayers />
      <PreparationPlan />
      <FinalCallout />

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}



