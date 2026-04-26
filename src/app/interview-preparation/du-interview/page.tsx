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
          src="/research-assistance/bg-mentoring.jpg"
          alt="Delhi University interview preparation"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Delhi University Interview Preparation Course
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-cyan-100 sm:text-xl">
            Communication Skills: The Edge That Turns Strong Subject Knowledge
            into Final Selection
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <Mic className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Teaching-Focused Answers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <ClipboardCheck className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Mock Panel Practice
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                <MessageCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium sm:text-base">
                Confident Classroom Presence
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
              The DU Interview Moment Changes Everything
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              Imagine stepping into a Delhi University college interview for a
              Guest Faculty or Assistant Professor position in English. The
              panel already knows your academic background. Now they are asking
              a sharper question: can you explain ideas with clarity, authority,
              and warmth?
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              In that room, knowledge alone is not enough. Your ability to make
              literary concepts teachable, answer with composure, and sound like
              someone students would trust can shift the result decisively in
              your favour.
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
                alt="Delhi University interview discussion"
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
            Why Communication Decides So Many DU Interviews
          </h2>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-slate-700">
            Delhi University panels are not only evaluating scholarship. They
            are imagining you in front of real students, handling live
            questions, discussion-driven classes, and high expectations.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: <MessageCircle className="h-12 w-12" />,
              title: "Can you teach, not just answer?",
              description:
                "Panels listen for explanations that sound classroom-ready, not merely academic.",
              color: "from-blue-500 to-indigo-600",
            },
            {
              icon: <Users className="h-12 w-12" />,
              title: "Can you connect with students?",
              description:
                "Your tone, pace, and clarity signal whether students would stay engaged with you.",
              color: "from-purple-500 to-pink-600",
            },
            {
              icon: <Eye className="h-12 w-12" />,
              title: "Can you stay composed under scrutiny?",
              description:
                "Strong candidates keep their structure and confidence even when questions become pointed.",
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
          The Hidden Layers DU Panels Notice First
        </motion.h2>

        <SkillCard
          number="01"
          title="Teaching-Focused Verbal Clarity"
          description="DU interviews often move quickly from literary theory to classroom application. You need answers that sound precise, teachable, and compelling. When your responses have shape and flow, the panel can instantly imagine you handling lectures, tutorials, and student doubts with ease."
          image="/research-assistance/bg-research-paper.jpg"
          gradient="from-blue-500 to-indigo-600"
        />

        <SkillCard
          number="02"
          title="Non-Verbal Credibility and Presence"
          description="Before the panel evaluates your ideas, they register your posture, eye contact, and sense of calm. A steady presence suggests you can manage a classroom, speak with authority, and remain professional under pressure. That silent first impression can work strongly for or against you."
          image="/research-assistance/bg-mentoring.jpg"
          reverse={true}
          gradient="from-purple-500 to-pink-600"
        />

        <SkillCard
          number="03"
          title="Listening Before Responding"
          description="Many DU candidates lose marks by rushing. Stronger candidates listen fully, identify what the panel is really testing, and then answer with purpose. That short pause before speaking often communicates maturity, self-control, and intellectual discipline."
          image="/research-assistance/bg-phd-proposal.jpg"
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
            Essential Preparation for DU Interviews
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-xl text-white/90">
            Panels notice your readiness long before the interview ends. Small
            details often reinforce or weaken your overall impression.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <CheckCircle />,
                title: "Academic Readiness",
                desc: "Keep documents, publications, teaching records, and CV details instantly accessible.",
              },
              {
                icon: <Users />,
                title: "Classroom Professionalism",
                desc: "Dress, posture, and tone should match the role of a confident university teacher.",
              },
              {
                icon: <Lightbulb />,
                title: "Interview Etiquette",
                desc: "Respectful listening, clean structure, and measured responses create trust quickly.",
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
            Common Mistakes That Cost DU Opportunities
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-xl text-slate-700">
            Good candidates often slip because they sound less ready than they
            actually are.
          </p>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              "Giving academically correct answers that still sound difficult for students to follow",
              "Speaking too quickly when demo-teaching or describing pedagogy",
              "Over-rehearsing until every answer feels mechanical",
              "Forgetting to show authentic enthusiasm for literature and teaching",
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
              src="/research-assistance/bg-thesis.jpg"
              alt="Delhi University classroom readiness"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div>
            <h2 className="mb-6 text-4xl font-bold text-indigo-900 md:text-5xl">
              Your Next Step Toward DU Interview Success
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              Communication is what helps the panel trust that you can teach,
              guide, and manage a real classroom. It turns your knowledge into a
              credible academic presence.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-slate-700">
              If you want your answers to sound like a future Delhi University
              teacher rather than just another applicant, this is where the
              shift begins.
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
              Begin Your DU Transformation
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
            Investment in Your DU Success
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-xl text-slate-700">
            Choose the preparation format that best fits your interview needs.
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
                <h3 className="mb-3 text-3xl font-bold">Full DU Preparation</h3>
                <p className="mb-6 text-white/90">Classes + Mock Interviews</p>
                <div className="mb-6 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold md:text-6xl">₹7,495</span>
                  <span className="text-white/80">/-</span>
                </div>
              </div>
              <div className="mb-8 space-y-4 text-left">
                {[
                  "Complete communication skills training for DU interview settings",
                  "Mock panel interviews with teaching-focused feedback",
                  "Answer structuring for subject and pedagogy questions",
                  "Guidance on verbal and non-verbal classroom presence",
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
                className="block w-full rounded-full bg-white py-4 text-center font-bold text-black shadow-xl transition-all hover:shadow-2xl"
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
                  Mock Interview Package
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
                  "1-2 focused DU-style mock interviews",
                  "Detailed performance feedback",
                  "Practice for teaching and panel questions",
                  "Actionable tips for immediate improvement",
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
                Book Mock Interview
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
            Your DU Opportunity Awaits
          </h2>
          <p className="mb-8 text-2xl text-white/90">
            Your next Delhi University interview can become the one that changes
            your academic journey.
          </p>
          <p className="mb-12 text-xl text-white/80">
            Make sure your communication is strong enough to open that door.
          </p>
          <motion.a
            href="/login-portal"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-full bg-white px-12 py-5 text-xl font-bold text-black shadow-2xl transition-all"
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

export default function DUInterviewPage() {
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
