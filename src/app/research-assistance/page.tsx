"use client";

import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";
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
    <section className="relative bg-gradient-to-r from-teal-800 to-cyan-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="/research-assistance/hero-research.jpg"
          alt="Research writing"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Learn, Write, and Publish with Expert Mentoring
          </h1>

          <p className="text-lg md:text-xl text-cyan-100 mb-8 leading-relaxed">
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
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
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
                <div className="bg-teal-100 p-3 rounded-lg flex-shrink-0">
                  <Icon className="w-6 h-6 text-teal-800" />
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
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
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
                className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-teal-100"
              >
                <div className="bg-teal-800 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-teal-800 mb-3">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50 via-cyan-50/70 to-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="/research-assistance/bg-research-paper.jpg"
            alt="Research desk background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-teal-800 sm:text-3xl lg:text-4xl">
              Art of Research Paper Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="max-w-5xl mx-auto bg-white/95 border border-teal-100 p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_-30px_rgba(13,148,136,0.35)] backdrop-blur">
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 mb-4 leading-snug">
              Master the Art of Research Paper Writing
            </h3>
            <p className="text-teal-700 font-semibold mb-4">
              From Idea to Publication
            </p>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Transform your research into impactful, publishable papers with
              expert guidance. Whether you&apos;re a PhD scholar, early-career
              researcher, or academic professional, this program equips you with
              the complete skill set to craft high-quality research papers that
              meet international standards.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Why Choose This Program?
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Pre-recorded lectures for flexible, self-paced learning</li>
              <li>Live interactive classes with real-time doubt clearing</li>
              <li>One-to-one personalised mentoring sessions</li>
              <li>
                Hands-on practical experiments and paper drafting exercises
              </li>
              <li>Comprehensive feedback on your actual research drafts</li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              What You Will Master
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>
                Identifying research gaps and formulating strong research
                questions
              </li>
              <li>
                Structuring a compelling Introduction, Literature Review,
                Methodology, Results, Discussion, and Conclusion
              </li>
              <li>
                Effective data presentation, visualisation, and interpretation
              </li>
              <li>
                Avoiding common pitfalls in academic writing (plagiarism, weak
                arguments, poor flow)
              </li>
              <li>
                Targeting high-impact journals and navigating the peer-review
                process
              </li>
              <li>Ethical considerations and journal submission strategies</li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Program Format
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>
                Pre-Recorded Lectures: 40+ hours of in-depth modules accessible
                anytime
              </li>
              <li>
                Live Classes: Weekly sessions with expert faculty for
                interactive learning
              </li>
              <li>
                One-to-One Interaction: Personal mentoring calls to review your
                drafts
              </li>
              <li>
                Practical Experiments: Real-time paper writing workshops, peer
                review simulations, and revision exercises
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Who Should Enrol?
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              PhD scholars, MPhil students, college teachers, and independent
              researchers who want to publish on various platforms to enhance
              their portfolios.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Outcome
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              By the end of the program, you will have a complete,
              publication-ready research paper with expert feedback and a clear
              roadmap for successful journal submission.
            </p>
            <div className="rounded-xl bg-gradient-to-r from-teal-800 to-cyan-700 px-4 py-3.5 sm:py-4 text-center text-white font-semibold leading-relaxed text-sm sm:text-base shadow-lg ring-1 ring-white/20">
              Enrol Now - Limited seats | Fee- 2995/-
            </div>
          </div>
        </div>
      </section>

      {/* Thesis Writing */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-cyan-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="/research-assistance/bg-thesis.jpg"
            alt="Thesis writing background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-teal-800 sm:text-3xl lg:text-4xl">
              Art of Thesis Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="max-w-5xl mx-auto bg-white/95 border border-teal-100 p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_-30px_rgba(13,148,136,0.35)] backdrop-blur">
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 mb-4 leading-snug">
              Art of Thesis Writing
            </h3>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Craft a Scholarly Masterpiece That Stands the Test of Time
            </p>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Turn months (or years) of research into a well-structured,
              coherent, and impactful thesis. This program demystifies thesis
              writing and guides you step-by-step from proposal to final
              submission.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Program Highlights
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Pre-recorded lectures covering every chapter of a thesis</li>
              <li>Live classes with one-to-one interaction</li>
              <li>Practical experiments in chapter drafting and revision</li>
              <li>Comprehensive feedback on your ongoing thesis work</li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Key Skills You Will Develop
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Designing a logical thesis structure and chapter flow</li>
              <li>Writing a powerful abstract, introduction, and conclusion</li>
              <li>Conducting and presenting a robust literature review</li>
              <li>Justifying methodology with clarity and rigour</li>
              <li>
                Presenting findings with effective tables, figures, and
                statistical interpretation
              </li>
              <li>
                Defending your thesis with confidence (viva preparation
                included)
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Program Format
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>
                Pre-Recorded Lectures: Detailed video modules on thesis
                components
              </li>
              <li>
                Live Classes: Regular interactive sessions for doubt resolution
              </li>
              <li>
                One-to-One Mentoring: Dedicated faculty reviews of your thesis
                chapters
              </li>
              <li>
                Practical Learning: Weekly writing sprints, peer feedback
                sessions, and revision workshops
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Who This Program Is For
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              PhD candidates, MPhil students, and research scholars across
              disciplines who want to complete their thesis on time and with
              excellence.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Outcome
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Submit a thesis that is academically sound, well-written, and
              ready for evaluation, while gaining lifelong academic writing
              confidence.
            </p>
            <div className="rounded-xl bg-gradient-to-r from-teal-800 to-cyan-700 px-4 py-3.5 sm:py-4 text-center text-white font-semibold leading-relaxed text-sm sm:text-base shadow-lg ring-1 ring-white/20">
              Join the Program - Start your thesis journey with clarity and
              expert support at only 5995/-
            </div>
          </div>
        </div>
      </section>

      {/* PhD Proposal */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50 via-cyan-50/70 to-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="/research-assistance/bg-phd-proposal.jpg"
            alt="PhD proposal planning background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-teal-800 sm:text-3xl lg:text-4xl">
              Art of PhD Proposal Making
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="max-w-5xl mx-auto bg-white/95 border border-teal-100 p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_-30px_rgba(13,148,136,0.35)] backdrop-blur">
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 mb-4 leading-snug">
              Get Your Research Idea Approved on the First Attempt
            </h3>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              A strong PhD proposal is your gateway to admission and funding.
              Learn the art of crafting a winning research proposal that
              impresses selection committees and funding agencies.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              What Makes This Program Unique?
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Pre-recorded lectures on proposal essentials</li>
              <li>Live classes with direct faculty interaction</li>
              <li>One-to-one proposal review and refinement</li>
              <li>
                Practical experiments through proposal drafting and presentation
                practice
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              You Will Learn
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>
                How to identify a novel, feasible, and significant research
                problem
              </li>
              <li>Writing a clear research aim, objectives, and hypotheses</li>
              <li>
                Framing a compelling theoretical framework and methodology
              </li>
              <li>Budget justification and timeline planning</li>
              <li>Preparing for PhD interview and synopsis presentation</li>
              <li>
                Aligning your proposal with the university and funding
                guidelines
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Program Format
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>
                Pre-Recorded Lectures: Step-by-step modules on proposal writing
              </li>
              <li>Live Classes: Interactive workshops and Q&amp;A</li>
              <li>
                One-to-One Interaction: Personalised feedback on your draft
                proposal
              </li>
              <li>
                Practical Experiments: Mock presentations, peer reviews, and
                iterative revisions
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Ideal For
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Aspiring PhD scholars, candidates preparing for entrance
              tests/interviews, and researchers seeking fellowships (UGC-JRF,
              ICSSR, etc.).
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Outcome
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              A polished, approval-ready PhD proposal that clearly communicates
              your research vision and increases your chances of selection and
              funding.
            </p>
            <div className="rounded-xl bg-gradient-to-r from-teal-800 to-cyan-700 px-4 py-3.5 sm:py-4 text-center text-white font-semibold leading-relaxed text-sm sm:text-base shadow-lg ring-1 ring-white/20">
              Enrol Today - Turn your research dream into a funded reality at a
              minimal cost of 1995/-
            </div>
          </div>
        </div>
      </section>

      {/* MLA & APA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-cyan-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="/research-assistance/bg-mla-apa.jpg"
            alt="Citation and books background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-teal-800 sm:text-3xl lg:text-4xl">
              Learn the Art of Application of MLA and APA
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="max-w-5xl mx-auto bg-white/95 border border-teal-100 p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_-30px_rgba(13,148,136,0.35)] backdrop-blur">
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 mb-4 leading-snug">
              Master Citation Styles with Precision and Confidence
            </h3>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Citation errors can cost you marks, publication rejection, or
              accusations of plagiarism. Master both MLA (9th edition) and APA
              (7th edition) with practical application.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Program Features
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Pre-recorded lectures with real examples</li>
              <li>Live classes for interactive doubt clearing</li>
              <li>One-to-one mentoring on your documents</li>
              <li>
                Hands-on practical experiments using your own research material
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              What You Will Master
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>In-text citations, direct quotes, and paraphrasing rules</li>
              <li>Formatting Works Cited / References pages</li>
              <li>
                Handling books, journal articles, websites, social media, AI
                tools, and more
              </li>
              <li>Differences between MLA and APA - when to use which style</li>
              <li>Creating accurate tables, figures, and appendices</li>
              <li>
                Common mistakes and how to avoid them in research papers,
                theses, and dissertations
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Program Format
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>
                Pre-Recorded Lectures: Clear, visual explanations of rules and
                examples
              </li>
              <li>Live Classes: Weekly practice sessions</li>
              <li>
                One-to-One Interaction: Personal review of your citations and
                bibliography
              </li>
              <li>
                Practical Experiments: Live editing workshops on real student
                documents
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Who is this course for?
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Research scholars, thesis writers, journal authors, and students
              submitting assignments in the humanities, social sciences, and
              education.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Outcome
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Error-free, professionally formatted citations and references that
              meet university and journal standards.
            </p>
            <div className="rounded-xl bg-gradient-to-r from-teal-800 to-cyan-700 px-4 py-3.5 sm:py-4 text-center text-white font-semibold leading-relaxed text-sm sm:text-base shadow-lg ring-1 ring-white/20">
              Enrol Now - Never lose marks on formatting again with our
              cost-effective course at just 1995/-
            </div>
          </div>
        </div>
      </section>

      {/* Mentoring */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50 via-cyan-50/70 to-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="/research-assistance/bg-mentoring.jpg"
            alt="Research mentoring background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-teal-800 sm:text-3xl lg:text-4xl">
              Guidance and Mentoring for Research Paper Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500"></div>
          </div>

          <div className="max-w-5xl mx-auto bg-white/95 border border-teal-100 p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_-30px_rgba(13,148,136,0.35)] backdrop-blur">
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 mb-4 leading-snug">
              Personalised Expert Support from Draft to Publication
            </h3>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              Not every researcher needs a full course. Sometimes you just need
              focused, one-to-one guidance on your specific research paper.
            </p>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Our Mentoring Approach
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
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
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Services Offered
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Topic refinement and research gap identification</li>
              <li>Full paper structuring and chapter-wise guidance</li>
              <li>Literature review development</li>
              <li>Methodology design and data analysis support</li>
              <li>Draft review, editing, and language polishing</li>
              <li>Journal selection and submission strategy</li>
              <li>Response to reviewer comments (revision support)</li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              How It Works
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Share your current draft/research idea</li>
              <li>Schedule one-to-one sessions as per your convenience</li>
              <li>Receive detailed written feedback + live discussion</li>
              <li>
                Revise with practical experiments and iterative improvement
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Who Benefits Most?
            </h4>
            <ul className="list-disc space-y-2.5 pl-5 sm:pl-6 text-gray-700 mb-6 leading-7 text-[15px] sm:text-base marker:text-amber-500 marker:text-base">
              <li>Scholars are stuck at any stage of paper writing</li>
              <li>Researchers aiming for Scopus/UGC-CARE publications</li>
              <li>
                Those who have completed data collection but struggle with
                writing
              </li>
            </ul>
            <h4 className="inline-flex items-center rounded-full border border-teal-100 bg-cyan-50 px-4 py-1.5 text-base sm:text-lg font-bold text-teal-800 mb-3 mt-7">
              Outcome
            </h4>
            <p className="text-gray-700 mb-6 leading-7 text-[15px] sm:text-base">
              A high-quality, submission-ready research paper with expert
              validation and an increased publication success rate.
            </p>
            <div className="rounded-xl bg-gradient-to-r from-teal-800 to-cyan-700 px-4 py-3.5 sm:py-4 text-center text-white font-semibold leading-relaxed text-sm sm:text-base shadow-lg ring-1 ring-white/20">
              Book Your Personalised Mentoring Session | For one hour- 1000/- |
              For 30 minutes- 750/- | 10% discount for all the Pearlians.
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
    image: "/research-assistance/testimonial-1.jpg",
    quote:
      "The mentoring support from LePearl transformed my research paper from a rough draft to a publication-ready manuscript.",
  },
  {
    name: "Prof. Rajesh Patel",
    role: "Assistant Professor, Research",
    image: "/research-assistance/testimonial-2.jpg",
    quote:
      "Their thesis writing program gave me the structure and confidence I needed to complete my research with excellence.",
  },
  {
    name: "Ms. Anjali Desai",
    role: "MPhil Student, Education",
    image: "/research-assistance/testimonial-3.jpg",
    quote:
      "The citation mastery course eliminated my confusion about MLA and APA. Now I format my papers perfectly every time.",
  },
];

function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-cyan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
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
                <h3 className="font-bold text-lg text-teal-800 mb-1">
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
      className="py-16 md:py-24 bg-gradient-to-br from-teal-800 to-cyan-700 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Master Academic Writing?
          </h2>
          <p className="text-cyan-100 text-lg max-w-2xl mx-auto">
            Choose the program that matches your needs and start your research
            journey with expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Quick Start */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold text-teal-800 mb-2">
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
              className="block w-full bg-teal-800 hover:bg-teal-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-center"
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

            <h3 className="text-2xl font-bold text-teal-800 mb-2 mt-4">
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
          <p className="text-cyan-100">
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
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
