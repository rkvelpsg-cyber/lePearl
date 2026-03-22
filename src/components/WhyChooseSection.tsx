import {
  ArrowRight,
  BookOpen,
  Brain,
  GraduationCap,
  Heart,
  Sparkles,
  Trophy,
  type LucideIcon,
  Users,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: GraduationCap,
    title: "Diversified Discipline and Integrated Studies",
    description:
      "In a sea of coaching options promising quick success, LePearl Education stands apart as the complete ecosystem that transforms not just your scores, but your entire academic and personal journey. We don't just prepare you for exams like UGC NET, SET, PhD entrances, or Assistant Professor interviews; we empower you to emerge confident, resilient, and truly extraordinary.",
  },
  {
    icon: BookOpen,
    title: "Renowned Faculty Led by Proven Experts",
    description:
      "Our courses are personally directed by Dr Prem Shankar Pandey, the celebrated author of the international bestseller World Literature in Your Fist: An Assortment of English Literature, a resource trusted by thousands of aspirants nationwide. Supported by qualified NET-JRF holders and research scholars. Our faculty brings real-world academic depth, exam mastery, and mentorship that goes far beyond rote teaching.",
  },
  {
    icon: Users,
    title: "Enriched, Exam-Aligned Quality Content",
    description:
      "We deliver meticulously crafted, up-to-date content that mirrors the latest Exam Patterns from in-depth literary analysis and critical theories, along with strategies. Every module combines ancient wisdom with modern insights, ensuring conceptual clarity, high retention, and application-based learning.",
  },
  {
    icon: Heart,
    title: "Dedicated Academic Coach for Personalised Guidance",
    description:
      "Every student gets to communicate with a dedicated academic coach who tracks their progress and identifies weak areas early to resolve them for better results. From weekly performance reviews to customised doubt-clearing sessions, your coach acts as your personal strategist, ensuring no gap is left unaddressed. In large batch coaching, this level of individual attention is rare; at LePearl, it's standard.",
  },
  {
    icon: Trophy,
    title: "One-to-One Mentoring Sessions for All",
    description:
      "Every enrolled student receives exclusive one-to-one mentoring sessions with expert faculty. These personalised interactions allow for deeper concept exploration, tailored study plans, individual doubt resolution, and strategic guidance aligned with your unique strengths, weaknesses, and goals, ensuring focused, high-impact preparation.",
  },
  {
    icon: Sparkles,
    title: "Fortnightly Real-Time Mock Tests for All Enrolled Students",
    description:
      "To build exam temperament and real-time performance under pressure, we conduct full-length, timed mock tests every two weeks. These simulate the actual exam environment with the latest pattern, followed by detailed performance analysis, rank comparison, and personalized feedback to help you continuously improve accuracy, speed, and confidence.",
  },
  {
    icon: Brain,
    title: "Truly Student-Centric Approach",
    description:
      "We prioritise you over everything else. Flexible online live video classes let you learn from home without relocation stress. Interactive sessions, real-time feedback, career counselling, interview preparation for Assistant Professor roles, and motivational webinars keep you energised and focused. We adapt to your pace, learning style, and goals, because your success is personal to us.",
  },
  {
    icon: Trophy,
    title: "Consistent, Proven Results Year After Year",
    description:
      "Our students don't just qualify, they excel. From consistent NET/SET clearances to top ranks in Assistant Professor exams (MPPSC, UPPSC, RPSC, OPSC, HPSC and more), our track record speaks volumes. We deliver measurable outcomes because we focus on root-cause mastery, not shortcuts.",
  },
  {
    icon: Sparkles,
    title: "Holistic Growth with Genuine Mental Health Support",
    description:
      "Exams can drain your spirit; we refuse to let that happen. We integrate holistic development into every program: leadership training, fluent English communication, personality building, and regular motivational sessions. You grow academically while becoming a more confident, articulate, and balanced individual ready for academia and life.",
  },
  {
    icon: Brain,
    title: "Mind Healing Therapy: Your Secret Edge for Peak Performance",
    description:
      "What truly sets us apart is our unique Mind Healing Therapy sessions, led by Master Healer, Dr Prem Shankar Pandey. These targeted therapies release exam anxiety, overthinking, emotional blocks, and burnout, helping you stay calm, focused, and energised even during intense preparation. In an era where mental fatigue derails most aspirants, we heal the mind so you can conquer the exam. No other institute offers this level of inner transformation alongside academic rigour.",
  },
];

type FeatureCardProps = {
  feature: Feature;
  index: number;
};

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200/50 bg-white/85 p-4 sm:p-5 md:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="absolute inset-0 rounded-lg sm:rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-amber-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

      <div className="relative mb-3 sm:mb-5 inline-flex">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 opacity-20 blur-lg transition-opacity duration-300 group-hover:opacity-40" />
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-2.5 sm:p-3 md:p-4 shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
        </div>
        <div className="absolute -right-1.5 -top-1.5 sm:-right-2 sm:-top-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-xs font-bold text-blue-900 shadow-md">
          {index + 1}
        </div>
      </div>

      <h3 className="mb-2 sm:mb-3 text-base sm:text-lg md:text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-700 line-clamp-3">
        {feature.title}
      </h3>
      <p className="flex-grow text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 line-clamp-4 sm:line-clamp-5">
        {feature.description}
      </p>

      <div className="absolute bottom-0 right-0 h-20 w-20 sm:h-24 sm:w-24 rounded-tl-full bg-gradient-to-tl from-blue-100/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function WhyChooseSection() {
  return (
    <section
      id="research"
      className="relative min-h-screen w-full overflow-hidden px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 48%, #0b3a53 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-5 sm:left-10 top-10 sm:top-20 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-indigo-300/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 sm:h-[600px] sm:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-8 sm:mb-12 md:mb-16 max-w-6xl px-2 sm:px-4 text-center">
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              LePearl Education?
            </span>
          </h2>
          <p className="mx-auto max-w-4xl px-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed text-slate-200">
            In a sea of coaching institutes promising quick success, LePearl
            Education stands apart as a complete ecosystem that transforms not
            only exam results but the entire academic and personal journey.
          </p>
        </div>

        <div className="relative left-1/2 mb-8 sm:mb-12 md:mb-16 w-screen -translate-x-1/2 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="h-full">
                <FeatureCard feature={feature} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
