"use client";

import {
  Mic,
  Eye,
  Ear,
  CheckCircle,
  Play,
  Award,
  Users,
  Target,
  Sparkles,
  Download,
  Quote,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function CommunicationSkillsPage() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <CoursePageHeader onEnroll={scrollToEnrollment} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlIHRhbGsIGludGVydmlldyBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzczMjk1MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Communication and Interview"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Master Communication Skills: Your Interview Superpower
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Transform nervous energy into confident presence. Learn verbal mastery, non-verbal power, and the art of listening that turns good candidates into unforgettable educators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="/login"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 min-h-[44px] flex items-center justify-center"
              >
                Enroll Now
              </a>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 min-h-[44px]">
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Download Course Details</span>
                <span className="sm:hidden">Download</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Confidence Building", "Expert Guidance", "Mock Interviews"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              What You'll Master
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Mic,
                text: "Verbal mastery: Speak with crystal-clear confidence and structured responses",
              },
              {
                icon: Eye,
                text: "Non-verbal power: Body language, posture, and presence that command respect",
              },
              {
                icon: Ear,
                text: "Active listening: Master the art of understanding and thoughtful responses",
              },
              {
                icon: Award,
                text: "Professional etiquette: Flawless documentation, dressing, and cultural awareness",
              },
              {
                icon: Target,
                text: "Interview strategies: Proven techniques to handle tough and unexpected questions",
              },
              {
                icon: Sparkles,
                text: "Authentic confidence: Let your passion shine through genuinely and contagiously",
              },
            ].map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow flex items-start gap-4"
                >
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-900" />
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

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Course Features &amp; Benefits
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Expert Communication Coaching",
                description: "Learn from experienced educators who excel in interviews and presentations.",
              },
              {
                icon: Play,
                title: "Video Demonstrations",
                description: "Watch real interview scenarios and expert demonstrations of communication excellence.",
              },
              {
                icon: Users,
                title: "Mock Interview Sessions",
                description: "Practice with realistic panel interviews and receive personalized feedback.",
              },
              {
                icon: Award,
                title: "Confidence Workshops",
                description: "Overcome nervousness and build unshakeable confidence for any interview.",
              },
              {
                icon: Download,
                title: "Study Materials",
                description: "Comprehensive guides on verbal techniques, non-verbal cues, and etiquette.",
              },
              {
                icon: Target,
                title: "Personalized Feedback",
                description: "One-on-one guidance based on your communication style and areas for improvement.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
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

      {/* Main Content - Why Communication Matters */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section Content */}
          <div className="mb-16">
            <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
              Imagine walking into the interview room for Assistant Professor or Lecturer in English
              Literature. The panel is seated. The questions begin. In that moment, it's not just your
              UGC NET score or research publications on trial, it's how you communicate that decides
              whether you shine… or fade.
            </p>
          </div>
        </div>
      </section>

      {/* Common Pitfalls */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">
            Common Pitfalls That Steal Opportunities
          </h2>

          <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-lg mb-8">
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Even strong candidates sometimes lose their edge because of small, fixable habits.
            </p>
            <ul className="space-y-3">
              {[
                "Rushing answers instead of taking thoughtful pauses",
                "Avoiding eye contact or fidgeting nervously",
                "Sounding overly rehearsed or robotic",
              ].map((pitfall, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">✕</span>
                  <span className="text-gray-700">{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-lg">
            <p className="text-base sm:text-lg font-semibold text-green-900 mb-4">Solution:</p>
            <p className="text-gray-700 leading-relaxed">
              Stay authentic. Stay enthusiastic. Let your genuine love for English Literature shine through, because passion is contagious, and panels can feel it.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Opening Content */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              Communication Skills: The Secret Weapon That Turns Knowledge into Selection
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
              <p>
                Imagine walking into the interview room for Assistant Professor or Lecturer in English Literature. The panel is seated. The questions begin. In that moment, it's not just your UGC NET score or research publications on trial, it's how you communicate that decides whether you shine… or fade.
              </p>
              
              <p>
                Will your words ignite passion for Blake's visions or Radcliffe's terrors? Will your presence command the room like a master teacher? Or will nervousness steal the spotlight?
              </p>

              <p>
                This is where masterful communication skills become your unseen superpower. Panels don't just hire subject experts, they choose future educators who can inspire classrooms, articulate ideas with clarity, and connect deeply with students and colleagues. Ready to discover how to make them remember you long after the interview ends?
              </p>
            </div>
          </div>

          {/* Why Communication Section */}
          <div className="mb-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              Why Communication Can Make or Break Your Academic Dream
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
              <p>
                In interviews for teaching positions, subject knowledge gets you to the door, but communication opens it wide.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <p className="font-semibold text-blue-900 italic">
                  "What if the way you explain The Castle of Otranto or your teaching philosophy reveals not just what you know, but who you are as an educator?"
                </p>
              </div>

              <p>
                The panel is quietly assessing: Can this person make complex literary theories accessible? Can they handle tough questions with poise? Will students hang on every word in their classroom?
              </p>

              <p>
                Strong communication transforms good candidates into unforgettable ones. Weak communication? Even brilliant scholars sometimes leave the room wondering what went wrong.
              </p>

              <p className="font-semibold text-blue-900 bg-green-50 p-6 rounded-lg">
                The good news? These skills are learnable, and the transformation begins the moment you decide to master them.
              </p>
            </div>
          </div>

          {/* The Hidden Layers */}
          <div className="mb-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-12">
              The Hidden Layers of Communication That Interviewers Notice First
            </h2>

            <div className="space-y-8">
              {/* Verbal Mastery */}
              <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-xl border-l-4 border-blue-900">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
                  Verbal Mastery: Speak Like the Scholar You Are
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base sm:text-lg">
                  <p>
                    Picture yourself answering with crystal-clear confidence, no rambling, no hesitation, just precise, passionate words flowing naturally.
                  </p>
                  <p>
                    What if you could structure every response so powerfully that the panel leans forward, captivated? Learn to balance academic depth with approachable clarity. Use strategic pauses. Choose words that paint vivid pictures of your classroom vision. The difference between "I like teaching" and delivering a compelling mini-lecture on student engagement can be the difference between selection and waiting for the next call.
                  </p>
                </div>
              </div>

              {/* Non-Verbal Power */}
              <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-xl border-l-4 border-purple-600">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
                  Non-Verbal Power: Let Your Presence Speak Before You Do
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base sm:text-lg">
                  <p>
                    Before you utter a single word, your body has already started the conversation.
                  </p>
                  <p>
                    What signals are you sending? Confident posture that says "I belong here"? Steady eye contact that builds instant trust? Or nervous gestures that whisper doubt?
                  </p>
                  <p>
                    Discover how small shifts in sitting, gesturing, and smiling can create an aura of quiet authority, the kind that makes panels think, "This is someone our students will respect and remember."
                  </p>
                </div>
              </div>

              {/* Active Listening */}
              <div className="bg-gradient-to-r from-green-50 to-white p-8 rounded-xl border-l-4 border-green-600">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
                  The Art of Listening: The Most Underrated Superpower
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base sm:text-lg">
                  <p>
                    What if the real magic happens not when you speak, but when you truly listen?
                  </p>
                  <p>
                    Master the pause. Learn to rephrase questions elegantly. Turn tricky or unexpected queries into opportunities to showcase thoughtfulness. In that silence before your answer lies the chance to stand out as reflective, composed, and genuinely engaged.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Essential Preparations */}
          <div className="mb-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              Essential Preparations You Cannot Afford to Miss
            </h2>

            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8">
              Certain things are non-negotiable. The panel notices everything, from the moment you enter to the final handshake.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                "Documents that must be flawlessly organized (because fumbling leaves a lasting impression).",
                "The power of first impressions through professional dressing and grooming.",
                "Timeless etiquette that shows respect and cultural awareness.",
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-lg border border-amber-200 flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-base sm:text-lg">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-semibold bg-blue-50 p-6 rounded-lg">
              Get these basics right, and you remove invisible barriers. Master them, and you create space for your true potential to shine.
            </p>
          </div>

          {/* Practical Ways */}
          <div className="mb-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              Practical Ways to Transform Your Communication (Before the Big Day)
            </h2>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-12 rounded-2xl">
              <p className="mb-8 text-base sm:text-lg leading-relaxed">
                Here's the exciting part: You don't have to wait for the interview to begin practicing.
              </p>

              <p className="mb-8 text-base sm:text-lg leading-relaxed">
                What if daily habits could turn you into a more fluent, confident version of yourself? Record yourself explaining a poem. Conduct mock sessions that feel real. Watch how eliminating filler words and adding natural energy changes everything.
              </p>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-lg">
                <p className="text-amber-100 font-semibold text-base sm:text-lg">
                  The candidates who treat preparation like a thrilling challenge — not a chore — are the ones who walk in calm, leave impressed, and often hear those magical words: "You're selected."
                </p>
              </div>
            </div>
          </div>

          {/* Common Pitfalls */}
          <div className="mb-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              Common Pitfalls That Steal Opportunities (And How to Avoid Them)
            </h2>

            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8">
              Even strong candidates sometimes lose their edge because of small, fixable habits.
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-lg mb-8">
              <p className="text-base sm:text-lg text-gray-700 mb-6">
                What if avoiding just a few common mistakes could dramatically increase your chances? Rushing answers, avoiding eye contact, or sounding overly rehearsed, these subtle traps have ended many promising interviews.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-lg">
              <p className="text-base sm:text-lg font-semibold text-green-900 mb-4">Solution:</p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Stay authentic. Stay enthusiastic. Let your genuine love for English Literature shine through, because passion is contagious, and panels can feel it.
              </p>
            </div>
          </div>

          {/* Your Next Step */}
          <div className="pt-12 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              Your Next Step Toward Interview Success
            </h2>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-12 rounded-2xl space-y-6">
              <p className="text-base sm:text-lg leading-relaxed">
                Communication skills are not just about "speaking well." They are about connecting, inspiring, and convincing the panel that you are the educator their department needs.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Are you ready to turn nervous energy into confident presence? To make every answer a memorable story? To walk out knowing you gave it your absolute best?
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Start practicing today. The interview room is waiting, and with polished communication, you won't just attend it, you will own it.
              </p>

              <p className="text-amber-100 font-semibold text-base sm:text-lg">
                Your future as an Assistant Professor in English Literature is closer than you think. Make sure your communication skills are ready to open every door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Success Stories: Interview Winners
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Ananya Trivedi",
                role: "Assistant Professor of English, Banaras Hindu University",
                image: "https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8fDE3NzMyOTUxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
                quote: "LePearl's communication coaching transformed my interview performance. Their guidance on non-verbal communication and listening skills gave me the confidence I needed.",
              },
              {
                name: "Prof. Rajesh Singh",
                role: "Assistant Professor, Delhi University",
                image: "https://images.unsplash.com/photo-1627776880991-808c5996527b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8fDE3NzMyOTUxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
                quote: "The mock interviews were incredibly realistic. The feedback I received helped me eliminate nervous habits and present myself with genuine confidence.",
              },
              {
                name: "Dr. Priya Sharma",
                role: "UGC NET Qualified, Assistant Professor - English",
                image: "https://images.unsplash.com/photo-1622460241924-a114e6abe1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHRlYWNoZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyOTUxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                quote: "What impressed me most was how they taught me to let my passion for literature shine through authentically. The interview felt like a conversation, not an interrogation.",
              },
            ].map((testimonial, index) => (
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
                  <h3 className="text-lg font-bold text-blue-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-amber-600 font-semibold">
                    {testimonial.role}
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center justify-center gap-1 mt-6 pt-6 border-t border-gray-200">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-amber-400">
                        ★
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="enrollment"
        className="py-16 md:py-24 bg-gradient-to-r from-blue-900 to-blue-800"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Ready to Own Your Next Interview?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-10">
            Stop letting nervousness hold you back. Start practicing today and walk into that interview room with unshakeable confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-block min-h-[44px] flex items-center justify-center"
            >
              Enroll Now & Start Your Journey
            </a>
            <a
              href="#"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all inline-block min-h-[44px] flex items-center justify-center"
            >
              Download Syllabus
            </a>
          </div>

          <p className="text-blue-200 mt-10">
            Your future as an inspiring educator is just one confident interview away.
          </p>
        </div>
      </section>

      <CoursePageFooter />
    </div>
  );
}
