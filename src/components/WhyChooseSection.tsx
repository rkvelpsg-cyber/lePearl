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
    title: "Renowned Faculty Led by Proven Experts",
    description:
      "Courses are directed by Dr. Prem Shankar Pandey, author of the international bestseller World Literature in Your Fist. Supported by NET-JRF holders and research scholars, the faculty offers deep academic expertise and mentorship beyond traditional coaching.",
  },
  {
    icon: BookOpen,
    title: "Enriched Exam-Aligned Quality Content",
    description:
      "Meticulously designed study material aligned with the latest exam patterns. Combines literary insights, critical theories, and exam strategies to ensure strong conceptual clarity and high retention.",
  },
  {
    icon: Users,
    title: "Dedicated Academic Coach",
    description:
      "Every student receives personalized academic guidance through a dedicated coach who monitors progress, identifies weak areas, and offers customized doubt-clearing sessions.",
  },
  {
    icon: Heart,
    title: "Truly Student-Centric Learning",
    description:
      "Flexible online live classes, interactive learning, career counseling, interview preparation, and motivational sessions designed to support each student's unique learning journey.",
  },
  {
    icon: Trophy,
    title: "Consistent Proven Results",
    description:
      "Students achieve NET/SET qualifications and top ranks in Assistant Professor exams such as MPPSC, UPPSC, Punjab PSC, and OPSC through strong conceptual mastery.",
  },
  {
    icon: Sparkles,
    title: "Holistic Student Development",
    description:
      "Programs include communication skills, personality development, leadership training, and motivational workshops to build confident academic professionals.",
  },
  {
    icon: Brain,
    title: "Mind Healing Therapy (Unique Feature)",
    description:
      "Exclusive Mind Healing Therapy sessions led by Dr. Prem Shankar Pandey help students overcome anxiety, burnout, and mental blocks to maintain peak performance during exam preparation.",
  },
];

type FeatureCardProps = {
  feature: Feature;
  index: number;
};

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="group relative flex h-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-amber-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

      <div className="relative mb-5 inline-flex">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 opacity-20 blur-lg transition-opacity duration-300 group-hover:opacity-40" />
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-xs font-bold text-blue-900 shadow-md">
          {index + 1}
        </div>
      </div>

      <h3 className="mb-3 text-2xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-700">
        {feature.title}
      </h3>
      <p className="flex-grow text-lg leading-relaxed text-slate-600">
        {feature.description}
      </p>

      <div className="absolute bottom-0 right-0 h-24 w-24 rounded-tl-full bg-gradient-to-tl from-blue-100/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function WhyChooseSection() {
  return (
    <section
      id="research"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 px-4 py-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-amber-100/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-16 max-w-6xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-800 md:text-5xl lg:text-6xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent">
              LePearl Education?
            </span>
          </h2>
          <p className="mx-auto max-w-4xl px-4 text-base leading-relaxed text-slate-600 md:text-lg lg:text-xl">
            In a sea of coaching institutes promising quick success, LePearl
            Education stands apart as a complete ecosystem that transforms not
            only exam results but the entire academic and personal journey.
          </p>
        </div>

        <div className="relative left-1/2 mb-16 w-screen -translate-x-1/2 px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-8 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`h-full md:col-span-1 lg:col-span-2 ${index === 4 ? "lg:col-start-2" : ""}`}
              >
                <FeatureCard feature={feature} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
