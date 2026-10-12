"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Layers,
  MessageCircle,
  PlayCircle,
  Video,
  type LucideIcon,
} from "lucide-react";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

type ProgramId = "pgt" | "tgt" | "combo";

const programs: { id: ProgramId; label: string; icon: LucideIcon }[] = [
  { id: "pgt", label: "PGT", icon: GraduationCap },
  { id: "tgt", label: "TGT", icon: BookOpen },
  { id: "combo", label: "PGT + TGT", icon: Layers },
];

const programTitles: Record<ProgramId, string> = {
  pgt: "PGT ENGLISH",
  tgt: "TGT ENGLISH",
  combo: "PGT + TGT COMBO",
};

const courseModules: Record<
  Exclude<ProgramId, "combo">,
  { title: string; topics: string[] }[]
> = {
  pgt: [
    {
      title: "English: Language",
      topics: [
        "Unseen passages and comprehension strategies",
        "Grammar essentials: tenses, narration, transformation and correction of sentences, prepositions, and punctuation",
        "Vocabulary: synonyms, antonyms, homonyms, idioms and phrases, one-word substitution, prefixes and suffixes, and jumbled sentences",
      ],
    },
    {
      title: "English: Literature",
      topics: [
        "Literary periods from the Renaissance and Reformation through the Restoration, Neo-classical, Romantic and Victorian periods to the Modern age",
        "Figures of speech, rhetoric and prosody, with exam-style examples",
        "Stanza and poetic forms, including the sonnet, ballad, elegy, ode, epic and mock epic",
        "Types of novel and forms of drama",
        "Major critics: Aristotle, Longinus, Dr. Johnson, Wordsworth, Coleridge, Arnold and T.S. Eliot",
        "Key authors from Chaucer and Shakespeare to Hardy, Frost, Hemingway, Faulkner, Arthur Miller and Toni Morrison, plus Indian English voices Kamala Das, Mulk Raj Anand and Nissim Ezekiel",
      ],
    },
    {
      title: "General Studies",
      topics: [
        "Current affairs, personalities in news, and sports",
        "Indian History and the National Movement, Polity and Constitution (including education-related constitutional provisions), Economy, and Geography",
        "General Science, Environment, Health and Hygiene (vitamins, minerals, diseases, hormones, enzymes)",
        "Computers, internet terminology, ICT and educational technology",
      ],
    },
  ],
  tgt: [
    {
      title: "English: Language",
      topics: [
        "Reading comprehension with time-saving techniques",
        "Grammar rules and application: tenses, voice, narration, sentence correction and transformation",
        "Vocabulary building: synonyms, antonyms, idioms, one-word substitution, spellings, prefixes and suffixes",
      ],
    },
    {
      title: "English: Literature",
      topics: [
        "Figures of speech and literary devices",
        "Poetic forms such as the sonnet, ballad, ode and elegy",
        "An overview of literary periods and landmark authors and works",
        "Frequently asked literature facts and questions",
      ],
    },
    {
      title: "General Studies",
      topics: [
        "Current events, personalities in news, and sports",
        "History and the National Movement, Constitution and Polity, Economy, and Geography",
        "General Science, Health and Hygiene, and Environment",
        "Computer basics, ICT uses and educational technology",
      ],
    },
  ],
};

type CourseBenefit = {
  icon?: LucideIcon;
  title: string;
  description: string;
};

const pgtBenefits: CourseBenefit[] = [
  {
    icon: Video,
    title: "Live classes",
    description:
      "Learn in real time, ask questions, and stay on a steady study schedule.",
  },
  {
    icon: PlayCircle,
    title: "Recorded lectures",
    description:
      "Missed a class or need a revision? Watch any lecture, anytime, as many times as you need.",
  },
  {
    icon: FileText,
    title: "Comprehensive study material",
    description:
      "Well-organised notes built for both learning and last-minute revision.",
  },
  {
    icon: MessageCircle,
    title: "Doubt-clearing sessions",
    description:
      "Dedicated sessions where experts resolve your questions so no concept is left unclear.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock tests with results and merit lists",
    description:
      "Attempt exam-level tests, get detailed results, and see where you stand among fellow aspirants before the real exam.",
  },
];

const tgtBenefits: CourseBenefit[] = [
  {
    title: "Live classes",
    description:
      "Interactive sessions that keep you learning actively and on track.",
  },
  {
    title: "Recorded lectures",
    description:
      "Study at your own pace and revisit any topic whenever you need.",
  },
  {
    title: "Complete study material",
    description:
      "Clear, exam-focused notes that make revision quick and effective.",
  },
  {
    title: "Doubt-clearing sessions",
    description:
      "Get your questions answered directly by experienced faculty.",
  },
  {
    title: "Mock tests with results and merit lists",
    description:
      "Practise in real exam conditions, track your progress, and know your rank before exam day.",
  },
];

const comboBenefits = [
  "Full access to both courses: Complete TGT and PGT English preparation in one enrolment.",
  "Live and recorded classes: Attend live or learn at your own pace, for both courses.",
  "Study material for TGT and PGT: Everything you need to learn and revise, in one place.",
  "Doubt-clearing sessions: Expert help whenever you get stuck, across both courses.",
  "Separate mock test series with results and merit lists: Measure your readiness for each exam and see how you rank against other aspirants.",
];

const programPrices: Record<ProgramId, string> = {
  pgt: "₹4,995/-",
  tgt: "₹3,995/-",
  combo: "₹7,495/-",
};

const registrationCourses: Record<ProgramId, string> = {
  pgt: "PGT",
  tgt: "TGT",
  combo: "PGT%20%2B%20TGT",
};

function scrollToEnrollment(program: ProgramId) {
  document
    .getElementById(`enrollment-${program}`)
    ?.scrollIntoView({ behavior: "smooth" });
}

function EnrolmentCard({ program }: { program: ProgramId }) {
  const features =
    program === "combo"
      ? comboBenefits
      : (program === "pgt" ? pgtBenefits : tgtBenefits).map(
          ({ title }) => title,
        );
  const price = programPrices[program].replace("₹", "").replace("/-", "");
  const coursePackage =
    program === "combo"
      ? "Complete TGT + PGT course package"
      : "Complete course package";
  const enrolmentLabel =
    program === "combo"
      ? "Get Both for ₹7,495/- and Save ₹1,495"
      : "Enroll Now";

  return (
    <section
      id={`enrollment-${program}`}
      className="mx-auto mt-10 max-w-6xl scroll-mt-24 rounded-2xl bg-slate-50 px-4 py-8 sm:px-8 sm:py-10"
    >
      <p className="mb-8 text-center text-base text-slate-600 sm:text-lg">
        Choose the payment plan that works best for you and begin your
        preparation today
      </p>
      <div className="mx-auto max-w-xl">
        <article className="rounded-2xl bg-white p-6 text-center shadow-lg shadow-slate-900/10 sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-600">
            <CreditCard className="h-8 w-8 text-yellow-300" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-teal-800 sm:text-3xl">
            One-Time Payment
          </h3>
          <p className="mb-1 text-4xl font-bold text-teal-800 sm:text-5xl">
            Rs. {price}
          </p>
          <p className="mb-7 text-slate-600">{coursePackage}</p>
          {program === "combo" && (
            <p className="mb-5 -mt-4 font-semibold text-teal-700">
              Save ₹1,495 with the combo
            </p>
          )}
          <ul className="mb-8 space-y-3 text-left">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href={`/student-registration?mode=paid&course=${registrationCourses[program]}`}
            className="block w-full rounded-lg bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-4 text-center text-lg font-bold !text-white shadow-md transition hover:brightness-105 hover:!text-white hover:shadow-lg"
          >
            {enrolmentLabel}
          </a>
        </article>
      </div>
    </section>
  );
}

function CourseContent({ program }: { program: ProgramId }) {
  if (program === "combo") {
    return (
      <>
        <div className="mx-auto max-w-5xl rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
          <section className="mb-8">
            <h3 className="mb-3 text-2xl font-bold text-blue-900">
              Why choose the combo?
            </h3>
            <p className="leading-7 text-gray-700">
              General Studies is common to both exams, and a strong English
              base helps in both. With the combo, you study once and benefit
              twice. You move from TGT fundamentals to PGT-level depth, so
              you&apos;re ready for whichever post you target, or both.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="mb-4 text-2xl font-bold text-blue-900">
              What you get
            </h3>
            <ul className="space-y-4">
              {comboBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="leading-7 text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-blue-50 p-5">
            <h3 className="mb-2 text-xl font-bold text-blue-900">
              Who it&apos;s for
            </h3>
            <p className="leading-7 text-gray-700">
              Aspirants applying for both TGT and PGT posts who want maximum
              preparation at the best price.
            </p>
          </section>
        </div>
        <EnrolmentCard program={program} />
      </>
    );
  }

  const isPGT = program === "pgt";
  const courseName = isPGT ? "PGT" : "TGT";
  const whyThisCourse = isPGT
    ? "The PGT exam tests two things: how well you know your subject, and how current your General Studies is. Most aspirants prepare only one properly. This course covers both in a single, organised plan, so nothing is left to chance."
    : "TGT rewards clarity of fundamentals. This course builds your English from the ground up and pairs it with a focused General Studies module, so you walk into the exam confident in every section.";
  const benefits: CourseBenefit[] = isPGT ? pgtBenefits : tgtBenefits;

  return (
    <>
      <div className="mx-auto mb-8 max-w-5xl rounded-xl border border-blue-100 bg-gradient-to-r from-blue-900 to-indigo-800 p-6 text-white sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-100">
          {courseName} English Complete Course
        </p>
        <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
          {courseName} English Complete Course (General Studies + English)
        </h3>
        <p className="leading-7 text-blue-100">{whyThisCourse}</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-0 lg:grid-cols-3">
        {courseModules[program].map((module) => (
          <article
            key={module.title}
            className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8"
          >
            <h3 className="mb-5 text-xl font-bold text-blue-900">
              {module.title}
            </h3>
            <ul className="space-y-3">
              {module.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" />
                  <span className="text-sm leading-6 text-gray-700">
                    {topic}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="mx-auto mt-10 max-w-7xl">
        <h3 className="mb-6 text-2xl font-bold text-blue-900">What you get</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm"
            >
              {Icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-600">
                  <Icon className="h-6 w-6 text-yellow-300" />
                </div>
              )}
              <h4 className="mb-2 text-lg font-bold text-blue-900">{title}</h4>
              <p className="leading-6 text-gray-700">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <EnrolmentCard program={program} />
    </>
  );
}

export default function PGTPage() {
  const [activeProgram, setActiveProgram] = useState<ProgramId>("pgt");

  return (
    <div className="min-h-screen bg-white">
      <CoursePageHeader onEnroll={() => scrollToEnrollment(activeProgram)} />

      <main>
        <section className="relative overflow-hidden bg-blue-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/90 to-indigo-900/80" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="font-semibold uppercase tracking-[0.2em] text-yellow-300">
              English Teaching Exams
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              PGT &amp; TGT English Courses
            </h1>
          </div>
        </section>

        <section className="bg-gray-50 py-10 lg:py-16">
          <div className="mx-auto max-w-[1600px] lg:flex lg:items-start">
            <aside className="sticky top-20 hidden w-56 flex-shrink-0 self-start px-3 pb-8 pt-2 xl:w-64 lg:block">
              <div className="rounded-2xl border border-teal-100 bg-white p-4 shadow-lg">
                <p className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-teal-600">
                  Programs
                </p>
                <nav aria-label="Course programs" className="flex flex-col gap-1.5">
                  {programs.map(({ id, label, icon: Icon }) => {
                    const isActive = activeProgram === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveProgram(id)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-teal-800 text-white shadow-md"
                            : "text-gray-600 hover:bg-teal-50 hover:text-teal-800"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isActive ? "bg-white/15" : "bg-teal-100"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? "text-yellow-300" : "text-teal-700"
                            }`}
                          />
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <nav
              aria-label="Course programs"
              className="mb-0 flex gap-2 overflow-x-auto border-y border-teal-100 bg-white px-3 py-3 lg:hidden"
            >
              {programs.map(({ id, label, icon: Icon }) => {
                const isActive = activeProgram === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveProgram(id)}
                    className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-teal-800 text-white"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="min-w-0 flex-1 border-y border-blue-100 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-blue-900 sm:text-3xl lg:text-4xl">
                  {programTitles[activeProgram]}
                </h2>
                <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600" />
                <p className="mt-3 text-gray-600">
                  {activeProgram === "combo"
                    ? "Complete preparation for both teaching exams"
                    : "Complete Course (General Studies + English)"}
                </p>
              </div>

              <CourseContent program={activeProgram} />
            </div>
          </div>
        </section>
      </main>

      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
