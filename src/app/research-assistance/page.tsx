"use client";

import {
  BookOpen,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  MessageCircle,
  PenTool,
  Search,
  Sparkles,
  Target,
  Users,
  Lightbulb,
  ClipboardList,
  Award,
  Library,
  Edit3,
  Microscope,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const supportServices = [
  {
    icon: Target,
    title: "Topic Selection & Research Proposal",
    description:
      "Get expert guidance in identifying a viable, original, and academically rigorous Ph.D. topic in English Literature, Linguistics, or ELT. We help you craft a compelling research proposal that meets UGC and university requirements.",
  },
  {
    icon: Library,
    title: "Literature Review Assistance",
    description:
      "We guide you in conducting a thorough review of existing scholarship — identifying key theorists, critical debates, and research gaps — so your thesis stands on a strong scholarly foundation.",
  },
  {
    icon: Edit3,
    title: "Thesis Writing & Structuring",
    description:
      "From the introductory chapter to the conclusion, our mentors assist at every stage — framing research questions, developing arguments, structuring chapters, and maintaining academic tone and coherence.",
  },
  {
    icon: Microscope,
    title: "Research Methodology Guidance",
    description:
      "Whether your research is qualitative, quantitative, or mixed-method, we help you choose and apply the right methodology — including textual analysis, discourse analysis, survey methods, and more.",
  },
  {
    icon: FileText,
    title: "Citation & Academic Writing Standards",
    description:
      "Master MLA, APA, Chicago, and other citation styles. We ensure your thesis adheres to the prescribed format of your university and is free from plagiarism concerns.",
  },
  {
    icon: PenTool,
    title: "Synopsis & Chapter Submission Support",
    description:
      "We provide hands-on support for preparing and submitting your research synopsis and individual thesis chapters as per your university's academic calendar and guidelines.",
  },
  {
    icon: MessageCircle,
    title: "Viva Voce Preparation",
    description:
      "Prepare confidently for your Ph.D. viva examination with mock sessions, common question practice, and strategies to present and defend your research to an expert panel.",
  },
  {
    icon: Search,
    title: "Research Paper & Journal Publication",
    description:
      "Get support in publishing research papers in UGC-approved and SCOPUS-indexed journals — a key requirement for Ph.D. completion and academic career advancement.",
  },
];

const whyLePearl = [
  {
    icon: GraduationCap,
    title: "Subject-Specialist Mentors",
    description:
      "Our mentors are Ph.D. holders and NET-qualified scholars specialising in English Literature, Linguistics, Comparative Literature, and ELT — offering deep domain expertise.",
  },
  {
    icon: Users,
    title: "Personalised One-on-One Mentorship",
    description:
      "Unlike generic coaching, each research scholar is assigned a dedicated mentor who understands your specific research area and provides tailored guidance throughout your journey.",
  },
  {
    icon: Award,
    title: "Proven Academic Track Record",
    description:
      "LePearl scholars have successfully completed Ph.D. programmes from central and state universities across India, with several publishing in reputed academic journals.",
  },
  {
    icon: BookOpen,
    title: "Resource-Rich Learning Environment",
    description:
      "Access curated bibliographies, annotated reading lists, chapter templates, and model synopses developed by our academic team for the Ph.D. in English.",
  },
  {
    icon: ClipboardList,
    title: "University-Aligned Support",
    description:
      "We stay updated with the research regulations of major universities and help you navigate specific requirements — whether it's JNU, BHU, CSJMU, Dr. RML, or any other Indian university.",
  },
  {
    icon: Lightbulb,
    title: "End-to-End Guidance",
    description:
      "From the initial research concept to the final submission and viva, LePearl is with you at every step — reducing stress, saving time, and building your scholarly confidence.",
  },
];

const phdPhases = [
  {
    phase: "01",
    title: "Research Concept & Topic Finalisation",
    points: [
      "Identifying gaps in existing literature",
      "Aligning topic with current academic trends",
      "Consultations on theoretical frameworks (Feminism, Post-colonialism, Deconstruction, Ecocriticism, etc.)",
      "Drafting the initial research outline",
    ],
  },
  {
    phase: "02",
    title: "Synopsis Preparation",
    points: [
      "Structuring the synopsis as per university format",
      "Writing objectives, scope, and significance of the study",
      "Identifying primary and secondary sources",
      "Preparing bibliography in the required citation style",
    ],
  },
  {
    phase: "03",
    title: "Thesis Writing — Chapter by Chapter",
    points: [
      "Introduction: Background, rationale, and research questions",
      "Literature Review: Critical survey of secondary sources",
      "Methodology: Research design and analytical framework",
      "Core Chapters: Textual analysis and argument development",
      "Conclusion: Findings, limitations, and future scope",
    ],
  },
  {
    phase: "04",
    title: "Revision, Editing & Submission",
    points: [
      "Language editing for academic tone and clarity",
      "Plagiarism check and resolution",
      "Formatting as per university guidelines",
      "Final review before submission",
    ],
  },
  {
    phase: "05",
    title: "Publication & Viva Voce",
    points: [
      "Identifying suitable journals (UGC-CARE, SCOPUS)",
      "Drafting and submitting research papers",
      "Mock viva sessions with expert faculty",
      "Strategies to handle critical questions from examiners",
    ],
  },
];

const researchAreas = [
  "British Literature (Medieval to Contemporary)",
  "American Literature & Postmodern Fiction",
  "Indian Writing in English (IWE)",
  "Postcolonial Literature & Theory",
  "Women's Writing & Feminist Literary Criticism",
  "Comparative Literature",
  "Linguistics & Applied Linguistics",
  "English Language Teaching (ELT) & Pedagogy",
  "Diaspora Studies",
  "Ecocriticism & Environmental Literature",
  "Translation Studies",
  "Cultural Studies & New Historicism",
];

const faqs = [
  {
    q: "Who can enrol for Research Assistance at LePearl?",
    a: "Any student who is pursuing or planning to pursue a Ph.D. in English (Literature, Linguistics, ELT, or related fields) from any Indian university can enrol. We also assist NET/JRF qualified scholars and those preparing research proposals for university entrance tests.",
  },
  {
    q: "Do you help with university-specific formats and regulations?",
    a: "Yes. We are familiar with the research guidelines of major central and state universities including BHU, JNU, CSJMU, AKTU, University of Lucknow, Dr. RML Avadh University, and others. We tailor our guidance according to your university's prescribed norms.",
  },
  {
    q: "Can I get help only for a specific chapter or section of my thesis?",
    a: "Absolutely. We offer flexible support — you can seek assistance for a specific chapter, your synopsis, literature review, methodology section, or only for viva preparation. You are not required to enrol for end-to-end support.",
  },
  {
    q: "How are the mentoring sessions conducted?",
    a: "Sessions are conducted online via video calls (Google Meet / Zoom), supplemented by written feedback on shared documents. We provide a structured timeline and regular check-ins to keep your research on track.",
  },
  {
    q: "How does LePearl help with journal publication?",
    a: "We guide you in identifying appropriate UGC-CARE and SCOPUS-indexed journals for your research area, assist in drafting the paper, formatting it as per journal requirements, and preparing a compelling cover letter for submission.",
  },
];

// ─────────────────────────────────────────────────────────────
// FAQ Accordion Component
// ─────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="font-semibold text-indigo-900 text-base leading-snug pr-4">
          {q}
        </span>
        {open ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0 text-indigo-600" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-indigo-600" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-indigo-50 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function ResearchAssistancePage() {
  const scrollToContact = () => {
    document
      .getElementById("contact-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={scrollToContact} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&q=80')",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/40 bg-white/10 px-5 py-2 text-sm font-semibold text-indigo-100 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Academic Research Support for Ph.D. in English
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Research Assistance for{" "}
            <span className="text-amber-400">Ph.D. in English</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-indigo-100 leading-relaxed md:text-xl">
            From topic selection to thesis submission and viva voce — LePearl
            provides comprehensive, personalised academic support to help you
            complete your Ph.D. in English with confidence and distinction.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={scrollToContact}
              className="rounded-xl bg-amber-500 px-10 py-4 font-bold text-white text-lg shadow-xl transition-all hover:bg-amber-600 hover:scale-105"
            >
              Get Personalised Guidance
            </button>
            <a
              href="#services"
              className="rounded-xl border-2 border-white/60 px-10 py-4 font-semibold text-white text-lg transition-all hover:bg-white/10"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* ── What is Ph.D. in English ── */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-700">
                About Ph.D. in English
              </span>
              <h2 className="mb-5 text-3xl font-bold text-indigo-900 md:text-4xl">
                What Does a Ph.D. in English Involve?
              </h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                A Doctor of Philosophy (Ph.D.) in English is a rigorous academic
                programme that requires original scholarly research in areas
                such as English Literature, Linguistics, Applied Linguistics, or
                English Language Teaching (ELT). It typically spans 3–5 years
                and requires candidates to produce an original thesis that
                contributes new knowledge to the field.
              </p>
              <p className="mb-6 text-gray-700 leading-relaxed">
                In India, Ph.D. admission is governed by UGC regulations.
                Candidates must clear a university-level entrance test or hold a
                valid JRF/NET qualification, followed by a research proposal
                interview with a doctoral committee.
              </p>
              <ul className="space-y-3">
                {[
                  "Minimum eligibility: Master's degree in English (55% marks)",
                  "JRF / NET qualification preferred for fellowship",
                  "Coursework in Research Methodology is mandatory (UGC 2022 guidelines)",
                  "Minimum 3 years (full-time) to 6 years (part-time) duration",
                  "Thesis submission followed by open viva voce examination",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Years Average Duration",
                  value: "3–5",
                  color: "bg-indigo-900",
                },
                {
                  label: "UGC-Recognised Journals Required",
                  value: "2+",
                  color: "bg-amber-500",
                },
                {
                  label: "Research Areas Supported",
                  value: "12+",
                  color: "bg-purple-700",
                },
                {
                  label: "Scholars Guided",
                  value: "100+",
                  color: "bg-teal-700",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`${stat.color} flex flex-col items-center justify-center rounded-2xl p-6 text-center text-white shadow-md`}
                >
                  <span className="text-4xl font-bold">{stat.value}</span>
                  <span className="mt-2 text-sm font-medium opacity-90 leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Support Services ── */}
      <section id="services" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-700">
              Our Services
            </span>
            <h2 className="mb-3 text-3xl font-bold text-indigo-900 md:text-4xl">
              Comprehensive Ph.D. Support at Every Stage
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {supportServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group flex flex-col rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-900">
                    <Icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-indigo-900">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 flex-1">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Ph.D. Journey Phases ── */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-700">
              Step-by-Step Journey
            </span>
            <h2 className="mb-3 text-3xl font-bold text-indigo-900 md:text-4xl">
              How LePearl Guides You Through Every Phase
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>

          <div className="space-y-6">
            {phdPhases.map((phase) => (
              <div
                key={phase.phase}
                className="flex flex-col gap-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm md:flex-row md:items-start"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-900 text-xl font-bold text-amber-400">
                  {phase.phase}
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold text-indigo-900">
                    {phase.title}
                  </h3>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {phase.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Areas ── */}
      <section className="bg-indigo-900 px-4 py-16 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
              Research Areas We Support
            </h2>
            <p className="text-indigo-200 max-w-2xl mx-auto">
              Our mentors have expertise across a wide range of specialisations
              within English Studies.
            </p>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-400" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-3 rounded-xl border border-indigo-700 bg-indigo-800/60 px-5 py-4"
              >
                <BookOpen className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <span className="text-sm font-medium text-indigo-100">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why LePearl ── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">
              Why LePearl?
            </span>
            <h2 className="mb-3 text-3xl font-bold text-indigo-900 md:text-4xl">
              What Sets Us Apart
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyLePearl.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900">
                    <Icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-indigo-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-700">
              FAQs
            </span>
            <h2 className="mb-3 text-3xl font-bold text-indigo-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto h-1 w-24 bg-amber-500" />
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section
        id="contact-section"
        className="bg-gradient-to-br from-indigo-900 to-purple-900 px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
              Start Your Ph.D. Journey with LePearl
            </h2>
            <p className="mx-auto max-w-2xl text-indigo-200 leading-relaxed">
              Whether you are at the beginning — searching for the right topic —
              or halfway through your thesis, our experts are ready to guide you
              to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-bold text-indigo-900">
                <HelpCircle className="h-4 w-4" />
                Free Initial Consultation
              </div>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Book a free 30-minute consultation session with our senior
                research mentor to discuss your research topic, current stage,
                and how LePearl can support you.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "Personalised research roadmap",
                  "Topic viability assessment",
                  "Guidance on university selection",
                  "No-obligation discussion",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="tel:+919876543210"
                className="block w-full rounded-lg bg-indigo-900 py-3.5 text-center font-bold text-white hover:bg-indigo-800 transition-colors"
              >
                Call Now for Free Consultation
              </a>
            </div>

            <div className="rounded-2xl border-4 border-amber-400 bg-white p-8 text-gray-900 shadow-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700">
                <Sparkles className="h-4 w-4" />
                Complete Research Programme
              </div>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Enrol in our comprehensive Ph.D. Research Assistance Programme
                for end-to-end support — from topic selection to thesis defence.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "Dedicated personal research mentor",
                  "Weekly one-on-one sessions",
                  "Chapter-wise feedback and revision",
                  "Journal publication assistance",
                  "Viva preparation mock sessions",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:info@lepearlcoaching.com"
                className="block w-full rounded-lg bg-amber-500 py-3.5 text-center font-bold text-white hover:bg-amber-600 transition-colors"
              >
                Enquire About the Programme
              </a>
            </div>
          </div>
        </div>
      </section>

      <CoursePageFooter />
    </div>
  );
}
