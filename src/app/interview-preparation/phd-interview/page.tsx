"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  MessageCircle,
  Users,
  Eye,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ClipboardCheck,
  Mic,
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
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 text-white">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="/research-assistance/bg-thesis.jpg"
          alt="PhD interview preparation"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            PhD Interview Preparation Course
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-cyan-100 sm:text-xl">
            Communication Skills: The Secret Weapon That Turns Research
            Potential into PhD Selection
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Mic className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Research Clarity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <ClipboardCheck className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Viva Confidence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <MessageCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Selection Mindset
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InterviewContent() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <>
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid items-center gap-12 md:grid-cols-2"
        >
          <div>
            <h2 className="mb-6 text-4xl font-bold text-indigo-900 md:text-5xl">
              The PhD Interview Moment That Defines Your Research Future
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              Imagine walking into the PhD interview room at a university. The
              doctoral panel is seated. The questions begin. Your research
              proposal and academic record got you here — but it is how you
              communicate that decides whether you are selected… or fade away.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              Will your words clearly convey the importance of your research?
              Will you defend your ideas with confidence and clarity? Or will
              nervousness overshadow your potential?
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
            style={{ opacity, scale }}
          >
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <ImageWithFallback
                src="/research-assistance/hero-research.jpg"
                alt="PhD interview discussion with panel"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      <Section className="bg-gradient-to-br from-indigo-100 to-purple-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-indigo-900 md:text-5xl">
            Why Communication Can Make or Break Your PhD Selection
          </h2>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-slate-700">
            Universities do not just want subject experts. They want researchers
            who can articulate ideas sharply, defend their work under scrutiny,
            and show real academic promise.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: <MessageCircle className="h-12 w-12" />,
              title: "Can you explain your research?",
              description:
                "Panels want clarity — can you make your topic sound significant and accessible?",
              color: "from-blue-500 to-indigo-600",
            },
            {
              icon: <Users className="h-12 w-12" />,
              title: "Can you defend your ideas?",
              description:
                "Will you hold your position calmly when the panel pushes back on your methodology?",
              color: "from-purple-500 to-pink-600",
            },
            {
              icon: <Eye className="h-12 w-12" />,
              title: "Do you show research potential?",
              description:
                "Composure, curiosity, and intellectual depth are visible in how you speak.",
              color: "from-indigo-500 to-purple-600",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl"
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}
              >
                {item.icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-800">
                {item.title}
              </h3>
              <p className="leading-relaxed text-slate-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-4xl font-bold text-indigo-900 md:text-5xl"
        >
          The Hidden Layers PhD Panels Notice First
        </motion.h2>

        <SkillCard
          number="01"
          title="Verbal Mastery: Articulate Your Research with Precision"
          description="Answer every question with natural confidence — clear, precise, and passionate. Structure your responses so the panel stays fully engaged, whether you are explaining your research gap, defending your methodology, or describing your contribution to the field. The ability to make complex ideas sound compelling is a rare skill that doctoral panels remember."
          image="/research-assistance/bg-phd-proposal.jpg"
          gradient="from-blue-500 to-indigo-600"
        />

        <SkillCard
          number="02"
          title="Non-Verbal Power: Command the Room Before You Speak"
          description="Before you say a single word, your posture, eye contact, and presence have already made an impression. A steady, open demeanour signals intellectual maturity and confidence. Small intentional shifts in how you carry yourself can immediately signal that you belong in a doctoral programme."
          image="/research-assistance/bg-mentoring.jpg"
          reverse={true}
          gradient="from-purple-500 to-pink-600"
        />

        <SkillCard
          number="03"
          title="The Art of Listening: The Researcher's Hidden Advantage"
          description="PhD candidates who listen strategically and respond thoughtfully stand out sharply from those who rush. A deliberate pause before answering a difficult question on your research design or theoretical framework can turn a challenging moment into a demonstration of scholarly composure."
          image="/research-assistance/bg-research-paper.jpg"
          gradient="from-indigo-500 to-purple-600"
        />
      </Section>

      <Section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-center text-4xl font-bold md:text-5xl">
            Essential Preparations You Cannot Afford to Miss
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-xl text-white/90">
            The panel observes everything from your entry to your final answer.
            Certain basics quietly make or break first impressions.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <CheckCircle />,
                title: "Research Documentation",
                desc: "Keep your proposal, synopsis, publications, and certificates perfectly organised and accessible.",
              },
              {
                icon: <Users />,
                title: "Scholarly Presence",
                desc: "Dress and carry yourself like someone who already belongs in a doctoral programme.",
              },
              {
                icon: <Lightbulb />,
                title: "Academic Etiquette",
                desc: "Respectful engagement, thoughtful pauses, and measured confidence create lasting trust.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg"
              >
                <div className="mb-4 h-12 w-12 text-indigo-300">
                  {item.icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-center text-4xl font-bold text-indigo-900 md:text-5xl">
            Common Pitfalls That Cost PhD Candidates Their Seat
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-xl text-slate-700">
            Even well-prepared researchers sometimes lose their edge due to
            small, avoidable communication habits.
          </p>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              "Rushing answers without fully understanding what the panel is really testing",
              "Sounding over-rehearsed instead of genuinely passionate about the research",
              "Weak eye contact that signals low confidence in your own work",
              "Failing to let authentic curiosity and research enthusiasm show naturally",
            ].map((pitfall, index) => (
              <motion.div
                key={pitfall}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-4 rounded-xl border-l-4 border-red-500 bg-red-50 p-6"
              >
                <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                <p className="text-slate-700">{pitfall}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      <Section className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid items-center gap-12 md:grid-cols-2"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-2xl shadow-2xl"
          >
            <ImageWithFallback
              src="/research-assistance/bg-mla-apa.jpg"
              alt="PhD research journey"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div>
            <h2 className="mb-6 text-4xl font-bold text-indigo-900 md:text-5xl">
              Your Next Step Toward PhD Selection
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              Communication is more than speaking well. It is about connecting,
              convincing, and proving you belong in their research community.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-slate-700">
              Ready to turn nervousness into confident, scholarly presence?
              Start practising now. With polished communication, you will not
              just attend the PhD interview — you will own it.
            </p>
            <motion.a
              href="/login-portal"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-full bg-indigo-600 px-8 py-4 text-white shadow-xl transition-all hover:bg-indigo-700"
              style={{ color: "#ffffff" }}
            >
              Begin Your PhD Transformation
            </motion.a>
          </div>
        </motion.div>
      </Section>

      <Section>
        <motion.div
          id="enrollment"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-indigo-900 md:text-5xl">
            Investment in Your PhD Success
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-xl text-slate-700">
            Choose the preparation format that best fits your viva and interview
            needs.
          </p>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl"
            >
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-yellow-400 px-6 py-2 text-sm font-bold text-indigo-900">
                COMPLETE
              </div>
              <div className="mb-6 mt-4">
                <h3 className="mb-3 text-3xl font-bold">
                  Full PhD Preparation
                </h3>
                <p className="mb-6 text-white/90">Classes + Mock Viva</p>
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold md:text-6xl">₹7,495</span>
                  <span className="text-white/80">/-</span>
                </div>
              </div>
              <div className="mb-8 space-y-4 text-left">
                {[
                  "Complete communication skills training for PhD interviews",
                  "Mock viva sessions with subject-specific panel questions",
                  "Research articulation and proposal defence coaching",
                  "Guidance on verbal, non-verbal, and scholarly presence",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block w-full rounded-full bg-white py-4 text-center font-bold shadow-xl transition-all hover:shadow-2xl"
                style={{ color: "#000000" }}
              >
                Enroll Now
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-white p-8 shadow-2xl"
            >
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-indigo-100 px-6 py-2 text-sm font-bold text-indigo-700">
                FOCUSED
              </div>
              <div className="mb-6 mt-4">
                <h3 className="mb-3 text-3xl font-bold text-indigo-900">
                  Mock Viva Package
                </h3>
                <p className="mb-6 text-slate-600">Practice Makes Perfect</p>
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-indigo-900 md:text-6xl">
                    ₹2,000
                  </span>
                  <span className="text-slate-600">/-</span>
                </div>
              </div>
              <div className="mb-8 space-y-4 text-left">
                {[
                  "1-2 focused PhD-style mock viva sessions",
                  "Detailed feedback on research communication",
                  "Real interview simulation with panel-style questions",
                  "Practical tips for immediate improvement",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-indigo-600" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href="/login-portal"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block w-full rounded-full bg-indigo-600 py-4 text-center font-bold text-white shadow-xl transition-all hover:bg-indigo-700 hover:shadow-2xl"
                style={{ color: "#ffffff" }}
              >
                Book Mock Viva
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      <Section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-6 text-4xl font-bold md:text-6xl">
            Your PhD Journey Starts Here
          </h2>
          <p className="mb-8 text-2xl text-white/90">
            Your future as a PhD scholar at a top university is closer than you
            think.
          </p>
          <p className="mb-12 text-xl text-white/80">
            Make sure your communication is ready to open that door.
          </p>
          <motion.a
            href="/login-portal"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-full bg-white px-12 py-5 text-xl font-bold shadow-2xl transition-all"
            style={{ color: "#000000" }}
          >
            Start Preparing Today
          </motion.a>
        </motion.div>
      </Section>
    </>
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-6 py-20 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function SkillCard({
  number,
  title,
  description,
  image,
  reverse = false,
  gradient,
}: {
  number: string;
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`mb-20 grid items-center gap-12 md:grid-cols-2 ${reverse ? "md:grid-flow-dense" : ""}`}
    >
      <div className={reverse ? "md:col-start-2" : ""}>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-6xl font-bold text-white shadow-2xl`}
        >
          {number}
        </motion.div>
        <h3 className="mb-4 text-3xl font-bold text-indigo-900">{title}</h3>
        <p className="text-lg leading-relaxed text-slate-700">{description}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className={`overflow-hidden rounded-2xl shadow-2xl ${reverse ? "md:col-start-1 md:row-start-1" : ""}`}
      >
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

export default function PhDInterviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <HeroSection />
      <InterviewContent />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
