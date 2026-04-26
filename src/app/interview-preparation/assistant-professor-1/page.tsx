"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  MessageCircle,
  Users,
  Eye,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
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

// ─── New content sections (framer-motion) ───────────────────────────────────

function InterviewContent() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <>
      {/* The Moment That Defines Your Future */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
              The Moment That Defines Everything
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Imagine stepping into the interview room for an Assistant
              Professor or Lecturer in English Literature. The panel is
              watching. The questions begin. In that single moment, your UGC NET
              score and publications are important, but it&apos;s your{" "}
              <span className="font-bold text-indigo-600">communication</span>{" "}
              that decides whether you shine brightly… or quietly fade away.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Will your words spark genuine passion for Blake&apos;s mystical
              visions or Radcliffe&apos;s chilling gothic worlds? Will you
              command the room like a natural educator? Or will hidden
              nervousness dim your true potential?
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1758691737207-e75821e080cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBqb2IlMjBpbnRlcnZpZXclMjB0d28lMjBwZW9wbGUlMjBvZmZpY2V8ZW58MXx8fHwxNzc3MTkzMTI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional conversation"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* Why Communication Matters */}
      <Section className="bg-gradient-to-br from-indigo-100 to-purple-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
            Why Communication Can Make or Break Your Academic Dream
          </h2>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            Subject knowledge may get you shortlisted, but the way you
            communicate often decides the outcome.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <MessageCircle className="w-12 h-12" />,
              title: "Can you inspire?",
              description:
                "Can this candidate make difficult literary ideas come alive for students?",
              color: "from-blue-500 to-indigo-600",
            },
            {
              icon: <Users className="w-12 h-12" />,
              title: "Can you connect?",
              description:
                "Will their classroom presence truly engage young minds?",
              color: "from-purple-500 to-pink-600",
            },
            {
              icon: <Eye className="w-12 h-12" />,
              title: "Can you stay composed?",
              description:
                "Can they stay composed under pressure and handle difficult questions?",
              color: "from-indigo-500 to-purple-600",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
            >
              <div
                className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}
              >
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* The Three Pillars */}
      <Section>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-indigo-900 mb-16"
        >
          The Hidden Layers Interviewers Notice First
        </motion.h2>

        <SkillCard
          number="01"
          title="Verbal Mastery: Speak Like the Scholar You Are"
          description="Imagine answering every question with natural confidence — clear, passionate, and precise, without rambling or hesitation. What if you could structure your responses so powerfully that the panel leans in, completely engaged? There's a subtle art to balancing academic depth with approachable clarity, and mastering it can dramatically shift the interview in your favour."
          image="https://images.unsplash.com/photo-1659355894238-58f5ca590878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25maWRlbnQlMjBwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHByZXNlbnRpbmd8ZW58MXx8fHwxNzc3MTkzMTI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          gradient="from-blue-500 to-indigo-600"
        />

        <SkillCard
          number="02"
          title="Non-Verbal Power: Let Your Presence Speak Before You Do"
          description="Before you say a single word, your body language has already begun the conversation. Are you sending signals of quiet confidence and belonging? Or are small nervous habits quietly undermining your message? Small, intentional shifts in posture, eye contact, and presence can create an aura of natural authority that panels instantly notice and respect."
          image="https://images.unsplash.com/photo-1758519288355-fe5b6fcc9f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBqb2IlMjBpbnRlcnZpZXclMjB0d28lMjBwZW9wbGUlMjBvZmZpY2V8ZW58MXx8fHwxNzc3MTkzMTI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          reverse={true}
          gradient="from-purple-500 to-pink-600"
        />

        <SkillCard
          number="03"
          title="The Art of Listening: The Most Underrated Superpower"
          description="Sometimes the real advantage lies not in speaking, but in how you listen. What if mastering the strategic pause and thoughtful rephrasing could turn even difficult questions into opportunities to shine as a reflective and composed educator?"
          image="https://images.unsplash.com/photo-1758519290111-bfbd61b32d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBqb2IlMjBpbnRlcnZpZXclMjB0d28lMjBwZW9wbGUlMjBvZmZpY2V8ZW58MXx8fHwxNzc3MTkzMTI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          gradient="from-indigo-500 to-purple-600"
        />
      </Section>

      {/* Essential Preparations */}
      <Section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Essential Preparations You Cannot Afford to Miss
          </h2>
          <p className="text-xl text-center mb-16 text-white/90 max-w-3xl mx-auto">
            The panel observes everything, from your entry to the final moment.
            Certain basics can quietly make or break first impressions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle />,
                title: "Flawless Organisation",
                desc: "Keep your documents perfectly organized and accessible",
              },
              {
                icon: <Users />,
                title: "Professional Presence",
                desc: "Dressing and grooming that creates instant impact",
              },
              {
                icon: <Lightbulb />,
                title: "Timeless Etiquette",
                desc: "Reflect respect and awareness in every gesture",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="text-indigo-300 mb-4 w-12 h-12">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Common Pitfalls */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center text-indigo-900 mb-6">
            Common Pitfalls That Steal Opportunities
          </h2>
          <p className="text-xl text-center mb-16 text-slate-700 max-w-3xl mx-auto">
            Even well-prepared candidates sometimes lose their edge due to
            small, avoidable habits.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Losing authenticity by trying to be someone you're not",
              "Letting nervousness override your genuine passion",
              "Over-rehearsing to the point of sounding robotic",
              "Forgetting to let your love for literature shine through",
            ].map((pitfall, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-4 bg-red-50 rounded-xl p-6 border-l-4 border-red-500"
              >
                <AlertTriangle className="text-red-500 flex-shrink-0 w-6 h-6 mt-1" />
                <p className="text-slate-700">{pitfall}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Your Future Classroom */}
      <Section className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1757192420329-39acf20a12b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGVjdHVyZSUyMGhhbGwlMjBjbGFzc3Jvb218ZW58MXx8fHwxNzc3MTkzMTI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="University classroom"
              className="w-full h-auto"
            />
          </motion.div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
              Your Next Step Toward Interview Success
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Communication is far more than &quot;speaking well.&quot;
              It&apos;s about connecting, inspiring, and convincing the panel
              that you are exactly the educator their department needs.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              Are you ready to convert nervous energy into calm confidence? To
              turn every answer into something memorable?
            </p>
            <motion.a
              href="/login-portal"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full shadow-xl transition-all"
              style={{ color: "#ffffff" }}
            >
              Begin Your Transformation Today
            </motion.a>
          </div>
        </motion.div>
      </Section>

      {/* Pricing */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
            Investment in Your Success
          </h2>
          <p className="text-xl text-slate-700 mb-16 max-w-3xl mx-auto">
            Choose the package that best fits your preparation needs
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Complete Package */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-yellow-400 text-indigo-900 px-6 py-2 rounded-bl-2xl font-bold text-sm">
                COMPLETE
              </div>
              <div className="mb-6 mt-4">
                <h3 className="text-3xl font-bold mb-3">
                  Full Preparation Package
                </h3>
                <p className="text-white/90 mb-6">Classes + Mock Interviews</p>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl md:text-6xl font-bold">₹7,495</span>
                  <span className="text-white/80">/-</span>
                </div>
              </div>
              <div className="space-y-4 mb-8 text-left">
                {[
                  "Complete communication skills training",
                  "Comprehensive mock interviews",
                  "Personalized feedback and improvement strategies",
                  "Expert guidance on verbal and non-verbal communication",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-300 mt-1" />
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
                className="block w-full bg-white text-black py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all text-center"
                style={{ color: "#000000" }}
              >
                Enroll Now
              </motion.a>
            </motion.div>

            {/* Mock Interview Only */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-indigo-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 px-6 py-2 rounded-bl-2xl font-bold text-sm">
                FOCUSED
              </div>
              <div className="mb-6 mt-4">
                <h3 className="text-3xl font-bold text-indigo-900 mb-3">
                  Mock Interview Package
                </h3>
                <p className="text-slate-600 mb-6">Practice Makes Perfect</p>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl md:text-6xl font-bold text-indigo-900">
                    ₹2,000
                  </span>
                  <span className="text-slate-600">/-</span>
                </div>
              </div>
              <div className="space-y-4 mb-8 text-left">
                {[
                  "1-2 comprehensive mock interviews",
                  "Detailed performance feedback",
                  "Real interview simulation experience",
                  "Practical tips for improvement",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 text-indigo-600 mt-1" />
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
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all text-center"
                style={{ color: "#ffffff" }}
              >
                Book Mock Interview
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Your Future Awaits
          </h2>
          <p className="text-2xl mb-8 text-white/90">
            Your future as an Assistant Professor in English Literature is
            nearer than you think.
          </p>
          <p className="text-xl mb-12 text-white/80">
            Make sure your communication is ready to open every door.
          </p>
          <motion.a
            href="/login-portal"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-black px-12 py-5 rounded-full text-xl font-bold shadow-2xl transition-all"
            style={{ color: "#000000" }}
          >
            Start Preparing Today
          </motion.a>
        </motion.div>
      </Section>
    </>
  );
}

// ─── Reusable Section Component ─────────────────────────────────────────────
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

// ─── Skill Card Component ────────────────────────────────────────────────────
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
      className={`grid md:grid-cols-2 gap-12 items-center mb-20 ${reverse ? "md:grid-flow-dense" : ""}`}
    >
      <div className={reverse ? "md:col-start-2" : ""}>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`bg-gradient-to-br ${gradient} text-white text-6xl font-bold w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-2xl`}
        >
          {number}
        </motion.div>
        <h3 className="text-3xl font-bold text-indigo-900 mb-4">{title}</h3>
        <p className="text-lg text-slate-700 leading-relaxed">{description}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className={`rounded-2xl overflow-hidden shadow-2xl ${reverse ? "md:col-start-1 md:row-start-1" : ""}`}
      >
        <img src={image} alt={title} className="w-full h-auto" />
      </motion.div>
    </motion.div>
  );
}
export default function AssistantProfessorInterviewPage() {
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
