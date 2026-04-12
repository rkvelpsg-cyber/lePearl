"use client";

import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import {
  BookOpen,
  FileText,
  Users,
  Award,
  Target,
  Sparkles,
  Quote,
  Star,
  Check,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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
    <section className="relative bg-gradient-to-r from-indigo-900 to-violet-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHBhcGVyJTIwd3JpdGluZ3xlbnwxfHx8fDE3NzMyOTUxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Research writing"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Learn, Write, and Publish with Expert Mentoring
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed">
            Structured guidance for research paper writing, thesis writing, and
            PhD proposals. Master the art of academic writing with live support
            and practical workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="/login"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Explore Programs
            </a>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Download Program Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Research Papers", "Thesis Writing", "PhD Proposals"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg"
                >
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
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
// Programs Overview
// ─────────────────────────────────────────────────────────────
const programsOverview = [
  {
    icon: FileText,
    text: "Master the complete process: from identifying research gaps to publishing in high-impact journals",
  },
  {
    icon: BookOpen,
    text: "Structured guidance covering research paper writing, thesis writing, and PhD proposals",
  },
  {
    icon: Users,
    text: "One-to-one personalized mentoring with experienced faculty",
  },
  {
    icon: Target,
    text: "Live interactive classes and doubt clearing sessions with real-time feedback",
  },
  {
    icon: Award,
    text: "Expert guidance on MLA and APA citation styles and academic formatting",
  },
];

function ProgramsOverview() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Why Choose Our Research Programs
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programsOverview.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow flex items-start gap-4"
              >
                <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                  <Icon className="w-6 h-6 text-indigo-900" />
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
// Programs Features
// ─────────────────────────────────────────────────────────────
const programFeatures = [
  {
    icon: FileText,
    title: "Research Paper Writing",
    description:
      "Master the art of crafting publication-ready research papers with expert guidance on structure, methodology, and journal submission.",
  },
  {
    icon: BookOpen,
    title: "Thesis Writing",
    description:
      "Complete guidance from proposal to final submission, including chapter structuring, literature review, and viva preparation.",
  },
  {
    icon: Target,
    title: "PhD Proposals",
    description:
      "Learn to craft winning research proposals that impress selection committees and secure funding.",
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Sessions",
    description:
      "Weekly interactive classes with faculty for real-time doubt clearing and personalized feedback.",
  },
  {
    icon: Award,
    title: "Citation Mastery",
    description:
      "Expert training in MLA and APA citation styles with practical application to your research.",
  },
  {
    icon: Users,
    title: "One-to-One Mentoring",
    description:
      "Personalized guidance on your actual manuscript with comprehensive feedback and revision support.",
  },
];

function ProgramFeatures() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Our Research Programs &amp; Services
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-indigo-100"
              >
                <div className="bg-indigo-900 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">
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
// Program Details Sections
// ─────────────────────────────────────────────────────────────
function ProgramDetails() {
  return (
    <>
      {/* Research Paper Writing */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of Research Paper Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="bg-white border-y border-indigo-100 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Master the Art of Research Paper Writing
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Transform your research into impactful, publishable papers with
              expert guidance. Whether you're a PhD scholar or academic
              professional, learn the complete skill set to craft high-quality
              research papers.
            </p>
            <h4 className="font-bold text-indigo-900 mb-3">
              Why Choose This Program?
            </h4>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 mb-6">
              <li>Pre-recorded lectures for flexible, self-paced learning</li>
              <li>Live interactive classes with real-time doubt clearing</li>
              <li>One-to-one personalised mentoring sessions</li>
              <li>
                Hands-on practical experiments and paper drafting exercises
              </li>
              <li>Comprehensive feedback on your actual research drafts</li>
            </ul>
            <div className="rounded-lg bg-indigo-900 px-4 py-3 text-center text-white font-semibold">
              Enrol Now – Fee: ₹2,995/-
            </div>
          </div>
        </div>
      </section>

      {/* Thesis Writing */}
      <section className="bg-gradient-to-b from-white to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of Thesis Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="bg-white border-y border-indigo-100 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Craft a Scholarly Masterpiece
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Turn months (or years) of research into a well-structured,
              coherent, and impactful thesis. This program demystifies thesis
              writing and guides you step-by-step from proposal to final
              submission.
            </p>
            <h4 className="font-bold text-indigo-900 mb-3">
              Program Highlights
            </h4>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 mb-6">
              <li>Pre-recorded lectures covering every chapter of a thesis</li>
              <li>Live classes with one-to-one interaction</li>
              <li>Practical experiments in chapter drafting and revision</li>
              <li>Comprehensive feedback on your ongoing thesis work</li>
            </ul>
            <div className="rounded-lg bg-indigo-900 px-4 py-3 text-center text-white font-semibold">
              Join the Program – Fee: ₹5,995/-
            </div>
          </div>
        </div>
      </section>

      {/* PhD Proposal */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of PhD Proposal Making
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="bg-white border-y border-indigo-100 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Get Your Research Idea Approved on the First Attempt
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              A strong PhD proposal is your gateway to admission and funding.
              Learn the art of crafting a winning research proposal that
              impresses selection committees and funding agencies.
            </p>
            <h4 className="font-bold text-indigo-900 mb-3">
              What You Will Learn
            </h4>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 mb-6">
              <li>
                How to identify novel, feasible, and significant research
                problems
              </li>
              <li>Writing clear research aims, objectives, and hypotheses</li>
              <li>
                Framing compelling theoretical frameworks and methodologies
              </li>
              <li>Budget justification and timeline planning</li>
              <li>Preparing for PhD interviews and synopsis presentations</li>
            </ul>
            <div className="rounded-lg bg-indigo-900 px-4 py-3 text-center text-white font-semibold">
              Enrol Today – Fee: ₹1,995/-
            </div>
          </div>
        </div>
      </section>

      {/* MLA & APA */}
      <section className="bg-gradient-to-b from-white to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Learn the Art of Application of MLA and APA
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="bg-white border-y border-indigo-100 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Master Citation Styles with Precision and Confidence
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Citation errors can cost you marks, publication rejection, or
              accusations of plagiarism. Master both MLA (9th edition) and APA
              (7th edition) with practical application.
            </p>
            <h4 className="font-bold text-indigo-900 mb-3">
              What You Will Master
            </h4>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 mb-6">
              <li>In-text citations, direct quotes, and paraphrasing rules</li>
              <li>Formatting Works Cited / References pages</li>
              <li>Handling books, journal articles, websites, and AI tools</li>
              <li>Differences between MLA and APA - when to use which style</li>
              <li>Creating accurate tables, figures, and appendices</li>
            </ul>
            <div className="rounded-lg bg-indigo-900 px-4 py-3 text-center text-white font-semibold">
              Enrol Now – Fee: ₹1,995/-
            </div>
          </div>
        </div>
      </section>

      {/* Mentoring */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Guidance and Mentoring for Research Paper Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="bg-white border-y border-indigo-100 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Personalised Expert Support from Draft to Publication
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Not every researcher needs a full course. Sometimes you just need
              focused, one-to-one guidance on your specific research paper.
            </p>
            <h4 className="font-bold text-indigo-900 mb-3">
              Our Mentoring Approach
            </h4>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 mb-6">
              <li>
                Completely personalized one-to-one sessions with experienced
                faculty
              </li>
              <li>
                Pre-recorded micro-lectures on topics relevant to your paper
              </li>
              <li>Live interactive feedback calls</li>
              <li>Hands-on practical help with your actual manuscript</li>
            </ul>
            <div className="rounded-lg bg-indigo-900 px-4 py-3 text-center text-white font-semibold">
              Get Started – Flexible Pricing Based on Your Needs
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "PhD Scholar, Literature",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyOTUxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "The mentoring support from LePearl transformed my research paper from a rough draft to a publication-ready manuscript.",
  },
  {
    name: "Prof. Rajesh Patel",
    role: "Assistant Professor, Research",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlIHByb2Zlc3Npb25hbCBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyOTUxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "Their thesis writing program gave me the structure and confidence I needed to complete my research with excellence.",
  },
  {
    name: "Ms. Anjali Desai",
    role: "MPhil Student, Education",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzMyOTUxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "The citation mastery course eliminated my confusion about MLA and APA. Now I format my papers perfectly every time.",
  },
];

function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Success Stories from Our Scholars
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
                <h3 className="font-bold text-lg text-indigo-900 mb-1">
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
// Enrollment Section
// ─────────────────────────────────────────────────────────────
function EnrollmentSection() {
  return (
    <section
      id="enrollment"
      className="py-16 md:py-24 bg-gradient-to-br from-indigo-900 to-violet-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Master Academic Writing?
          </h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Choose the program that matches your needs and start your research
            journey with expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Quick Start */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">
              Quick Start Guide
            </h3>
            <p className="text-gray-600 mb-4">
              Explore all programs to find the perfect fit
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Research Paper Writing",
                "Thesis Writing",
                "PhD Proposals",
                "Citation Mastery",
                "Personal Mentoring",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/login"
              className="block w-full bg-indigo-900 hover:bg-indigo-800 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-center"
            >
              Explore Programs
            </a>
          </div>

          {/* Schedule Consultation */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform relative border-4 border-amber-400">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4" />
              RECOMMENDED
            </div>

            <h3 className="text-2xl font-bold text-indigo-900 mb-2 mt-4">
              One-to-One Consultation
            </h3>
            <p className="text-gray-600 mb-4">
              Get personalized guidance for your research needs
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Personalized Assessment",
                "Custom Program Selection",
                "Flexible Scheduling",
                "Expert Faculty Matching",
                "Money-Back Guarantee",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/login"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-center"
            >
              Schedule Free Consultation
            </a>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-indigo-100">
            Questions?{" "}
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

export default function ResearchAssistancePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <ProgramsOverview />
      <ProgramFeatures />
      <ProgramDetails />
      <Testimonials />
      <EnrollmentSection />
      <CoursePageFooter />
    </div>
  );
}
