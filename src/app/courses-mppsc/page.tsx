"use client";

import { useEffect, useRef } from "react";
import {
  GraduationCap,
  Download,
  CheckCircle,
  Target,
  Video,
  Users,
  Award,
  TrendingUp,
  PlayCircle,
  FileText,
  ClipboardCheck,
  MessageCircle,
  UserCheck,
  Sparkles,
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Mail,
  Phone,
  MapPin,
  Facebook,
  X,
  Instagram,
  Linkedin,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Header
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Header() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return <CoursePageHeader onEnroll={scrollToEnrollment} />;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Hero
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hero() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadSyllabus = () => {
    window.location.href = "/student-registration?mode=free";
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758270704262-ecc82b23dc37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwY29hY2hpbmd8ZW58MXx8fHwxNzczMjk1MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Students studying"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Crack MPPSC Assistant Professor Exam with Expert Guidance
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
            Comprehensive online course: Master syllabus, key facts, and
            in-depth knowledge of the topics and secure your dream faculty role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="/student-registration?mode=paid&course=MPPSC"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Enroll Now
            </a>
            <button
              onClick={downloadSyllabus}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Syllabus
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Mock Tests", "Study Materials", "Live Doubt Sessions"].map(
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
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Course Overview
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const overviewPoints = [
  {
    icon: Target,
    text: "Tailored for MPPSC aspirants",
  },
  {
    icon: Video,
    text: "Blend of live video lectures, PDFs, and live doubt resolution sessions",
  },
  {
    icon: Users,
    text: "Flipped Live Classes with live Question and Answer solving with explanation.",
  },
  {
    icon: Award,
    text: "Subject Expertise with teaching experience of more than 15 years.",
  },
  {
    icon: TrendingUp,
    text: "No shortcuts, just proven strategies for first-attempt success.",
  },
];

function CourseOverview() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Course Overview
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overviewPoints.map((point, index) => {
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
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Features
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const features = [
  {
    icon: PlayCircle,
    title: "Video Lectures",
    description:
      "In-depth coverage of the MPPSC pattern, simplified complex topics.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Tests",
    description: "50+ Mock tests with detailed analysis.",
  },
  {
    icon: FileText,
    title: "Study Material",
    description: "Concise PDFs, live lectures, and previous papers decoded.",
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Clearing",
    description: "Weekly sessions for real-time support.",
  },
  {
    icon: UserCheck,
    title: "Personalized Attention",
    description: "One-to-one attention to each student as per their needs.",
  },
  {
    icon: Sparkles,
    title: "Holistic Development",
    description: "Holistic development of the students.",
  },
];

function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Course Features &amp; Benefits
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
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
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Testimonials
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type MPPScVideoStory = {
  id: string;
  videoId: string;
  videoUrl: string;
  studentName: string;
  role: string;
  thumbnailUrl: string;
};

const mppscStories: MPPScVideoStory[] = [
  {
    id: "mppsc-1",
    videoId: "XGYapIjesQE",
    videoUrl:
      "https://www.youtube.com/watch?v=XGYapIjesQE&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=24",
    studentName: "Dr. Babli Mallick, Assistant Professor, MPPSC-2025",
    role: "Assistant Professor, MPPSC-2025",
    thumbnailUrl: "https://img.youtube.com/vi/XGYapIjesQE/hqdefault.jpg",
  },
  {
    id: "mppsc-2",
    videoId: "sCxQ07TKzc0",
    videoUrl:
      "https://www.youtube.com/watch?v=sCxQ07TKzc0&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=25",
    studentName:
      "Mr Balram Mishra, Assistant Professor, Madhya Pradesh Public Service Commission-2025",
    role: "Assistant Professor, MPPSC-2025",
    thumbnailUrl: "https://img.youtube.com/vi/sCxQ07TKzc0/hqdefault.jpg",
  },
  {
    id: "mppsc-3",
    videoId: "lUZ-KE_LLkc",
    videoUrl:
      "https://www.youtube.com/watch?v=lUZ-KE_LLkc&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=26",
    studentName: "Shubham Singh, Assistant Professor, MPPSC-2025",
    role: "Assistant Professor, MPPSC-2025",
    thumbnailUrl: "https://img.youtube.com/vi/lUZ-KE_LLkc/hqdefault.jpg",
  },
  {
    id: "mppsc-4",
    videoId: "9-fngrO0Lc4",
    videoUrl: "https://www.youtube.com/watch?v=9-fngrO0Lc4",
    studentName: "Ms Neelu Patel, MPPSC AIR 39",
    role: "Assistant Professor, MPPSC-2025 (AIR 39)",
    thumbnailUrl: "https://img.youtube.com/vi/9-fngrO0Lc4/maxresdefault.jpg",
  },
];

function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const manualPauseUntilRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    let frameId = 0;

    const step = () => {
      if (Date.now() < manualPauseUntilRef.current) {
        frameId = requestAnimationFrame(step);
        return;
      }

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        frameId = requestAnimationFrame(step);
        return;
      }

      if (el.scrollLeft >= maxScroll - 1) {
        directionRef.current = -1;
      } else if (el.scrollLeft <= 1) {
        directionRef.current = 1;
      }

      el.scrollLeft += 0.6 * directionRef.current;
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handlePrevious = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    manualPauseUntilRef.current = Date.now() + 1200;
    directionRef.current = -1;

    el.scrollBy({ left: -el.clientWidth * 0.85, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    manualPauseUntilRef.current = Date.now() + 1200;
    directionRef.current = 1;

    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Assistant Professor Success Stories
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8">
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#d9d2ff] bg-white/95 p-3 text-[#6A0DAD] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white md:left-4 lg:left-6"
            aria-label="Previous stories"
            type="button"
          >
            <ChevronLeft className="h-6 w-6 text-[#6A0DAD]" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#d9d2ff] bg-white/95 p-3 text-[#6A0DAD] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white md:right-4 lg:right-6"
            aria-label="Next stories"
            type="button"
          >
            <ChevronRight className="h-6 w-6 text-[#6A0DAD]" />
          </button>

          <div
            ref={scrollRef}
            className="mppsc-stories-scroll overflow-x-auto px-12 py-1 sm:px-16 md:px-20 lg:px-24"
          >
            <div className="flex w-max gap-4 pb-4 md:gap-6">
              {mppscStories.map((story) => (
                <article
                  key={story.id}
                  className="relative flex-[0_0_clamp(260px,80vw,440px)] snap-start overflow-hidden rounded-lg sm:rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 shadow-md backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3">
                    <Star className="h-3 w-3 fill-[#6A0DAD] text-[#6A0DAD]" />
                    <span className="text-xs font-semibold text-[#6A0DAD]">
                      Success Story
                    </span>
                  </div>

                  <a
                    href={story.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Play ${story.studentName} success story`}
                    className="relative block aspect-video overflow-hidden bg-gray-900"
                  >
                    <ImageWithFallback
                      src={story.thumbnailUrl}
                      alt={`${story.studentName} success story`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="rounded-full bg-[#6A0DAD] p-5 shadow-2xl transition-transform duration-300 hover:scale-110">
                        <Play className="h-8 w-8 fill-white text-white" />
                      </div>
                    </div>
                  </a>

                  <div className="flex min-h-[240px] flex-col p-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {story.studentName}
                    </h3>
                    <p className="mb-4 font-medium text-[#6A0DAD]">
                      {story.role}
                    </p>
                    <a
                      href={story.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6A0DAD] to-[#1E3A8A] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4 text-white" />
                      <span className="text-white">Watch Story</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .mppsc-stories-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: none;
          scroll-padding-inline: clamp(3rem, 9vw, 8rem);
        }

        .mppsc-stories-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Pricing
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const oneTimeFeatures = [
  "Full course access",
  "Study materials",
  "Mock tests",
  "Doubt sessions",
];

const installmentFeatures = [
  "Full course access",
  "Study materials",
  "Mock tests",
  "Doubt sessions",
  "Flexible payment",
];

function Pricing() {
  const handleEnroll = () => {
    alert(
      "Enrollment form will open here. Please contact LePearl Coaching Institute for enrollment.",
    );
  };

  return (
    <section
      id="enrollment"
      className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-blue-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the MPPSC Assistant Professor Course Today
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Choose the payment plan that works best for you and start your
            journey to success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* One-Time Payment */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 text-sm font-bold">
              SAVE ₹3,001
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                One-Time Payment
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-blue-900">₹2</span>
              </div>
              <p className="text-gray-500 line-through">₹12,000</p>
            </div>

            <div className="mb-8">
              <p className="font-semibold text-blue-900 mb-4">Includes:</p>
              <ul className="space-y-3">
                {oneTimeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/student-registration?mode=paid&course=MPPSC"
              className="block w-full bg-blue-900 hover:bg-blue-800 text-white hover:text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-center"
              style={{ color: "white" }}
            >
              Enroll Now
            </a>
          </div>

          {/* Installment Plan */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform relative border-4 border-amber-400">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4" />
              POPULAR
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Installment Plan
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-blue-900">
                  2 Instalments of ₹5,499
                </span>
              </div>
              <p className="text-gray-600">Total Cost: ₹11,000</p>
            </div>

            <div className="mb-8">
              <p className="font-semibold text-blue-900 mb-4">Includes:</p>
              <ul className="space-y-3">
                {installmentFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/student-registration?mode=paid&course=MPPSC"
              className="block w-full rounded-lg bg-blue-900 py-4 text-center text-lg font-bold text-white shadow-lg transition-colors hover:bg-blue-800"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MPPSCCoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CourseOverview />
      <Features />
      <Testimonials />
      <Pricing />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
