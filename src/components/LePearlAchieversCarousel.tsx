"use client";

import { useState, useEffect } from "react";
import Slider from "react-slick";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== TYPES ====================

interface Achiever {
  name: string;
  exam: string;
  session: string;
  achievement: string;
  imageUrl: string;
  group: "net" | "prof";
}

// ==================== DATA ====================

const allAchievers: Achiever[] = [
  // -- NTA NET page (slides 0-4) --
  {
    name: "Nidhi Shukla",
    exam: "NTA-NET English",
    session: "Dec 2025",
    achievement:
      "Cleared NET English with strong conceptual understanding and disciplined preparation.",
    imageUrl: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg",
    group: "net",
  },
  {
    name: "Ms Alvina Parveen",
    exam: "NTA-NET English",
    session: "Jun 2025",
    achievement:
      "Achieved success through consistency, revision strategy, and expert mentorship.",
    imageUrl: "/Alvina%20Parveen.jpeg",
    group: "net",
  },
  {
    name: "Richa Singh",
    exam: "NTA-NET English",
    session: "Dec 2025",
    achievement:
      "Excelled in NET English through concept clarity and exam-oriented practice.",
    imageUrl: "/Richa%20Singh_NET_Dec_2026.jpeg",
    group: "net",
  },
  {
    name: "Ms Kanika Sharma",
    exam: "NTA-NET English",
    session: "Dec 2025",
    achievement: "Turned focused preparation into measurable success.",
    imageUrl: "/Kanika%20Sharma.jpeg",
    group: "net",
  },
  {
    name: "Mr Abhishesh Verma",
    exam: "NTA-NET English",
    session: "Jun 2025",
    achievement:
      "Cleared NET English with disciplined strategy and guided preparation.",
    imageUrl: "/Abhishesh%20Verma.jpeg",
    group: "net",
  },
  // -- Assistant Professor page (slides 5-9) --
  {
    name: "Soumya Panigrahi",
    exam: "Odisha PSC 2025",
    session: "Lecturer",
    achievement:
      "Secured a lecturer position through focused preparation and LePearl's expert academic guidance.",
    imageUrl:
      "/Soumya%20Panigrahi,%20Lecturer,%20Odisha%20Public%20Service%20Commission-2025.jpeg",
    group: "prof",
  },
  {
    name: "Dr. Babli Mallick",
    exam: "MPPSC 2025",
    session: "Assistant Professor",
    achievement:
      "Achieved the rank of Assistant Professor through rigorous preparation and continuous mentorship.",
    imageUrl: "/babil_faculty2.jpeg",
    group: "prof",
  },
  {
    name: "Mr Shubham Singh",
    exam: "MPPSC 2025",
    session: "Assistant Professor",
    achievement:
      "Cleared MPPSC with disciplined strategy and guided preparation at LePearl.",
    imageUrl: "/Shubham%20Singh.jpeg",
    group: "prof",
  },
  {
    name: "Asit Kumar Mohanty",
    exam: "SSB Odisha PSC 2024",
    session: "Lecturer",
    achievement:
      "Secured a Lecturer post through concept clarity, mock tests, and personalised mentoring.",
    imageUrl: "/Asit%20Kumar%20Mohanty.jpeg",
    group: "prof",
  },
  {
    name: "Mr. Vishal Damahe",
    exam: "MPPSC 2025",
    session: "Assistant Professor",
    achievement:
      "Turned consistent effort and expert mentorship into a successful academic career.",
    imageUrl: "/Vishal%20Damahe.jpeg",
    group: "prof",
  },
];

const guidanceItems = [
  { icon: Users, text: "Expert Faculty Mentorship" },
  { icon: BookOpen, text: "English Literature Concept Clarity" },
  { icon: Target, text: "Mock Tests & Performance Analysis" },
  { icon: Heart, text: "Personal Guidance & Motivation" },
];

// ==================== SUB-COMPONENTS ====================

function AchieverCard({
  name,
  exam,
  session,
  achievement,
  imageUrl,
}: Achiever) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden mx-1 my-4 flex flex-col"
    >
      <div className="w-full bg-white flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full object-contain"
          style={{ display: "block", maxHeight: "420px" }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 rounded-full font-medium">
            {exam}
          </span>
          <span className="text-gray-500">{session}</span>
        </div>
        <p className="text-gray-700 text-xs leading-relaxed italic">
          &ldquo;{achievement}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}

function GuidancePoints({ isDark = false }: { isDark?: boolean }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {guidanceItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              isDark ? "bg-white/10" : "bg-white/50"
            }`}
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${
                isDark
                  ? "from-purple-400 to-indigo-400"
                  : "from-amber-400 to-orange-400"
              }`}
            >
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <p
              className={`text-sm font-medium ${isDark ? "text-purple-100" : "text-gray-800"}`}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p
          className={`text-lg italic max-w-4xl mx-auto leading-relaxed ${isDark ? "text-purple-200" : "text-gray-700"}`}
        >
          &ldquo;LePearl does not just prepare students for exams; it builds
          confidence, clarity, and consistency for long-term academic
          success.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ==================== PAGE DATA ====================

const pages = [
  {
    label: "NTA NET Achievers 2026",
    sub: "Scholars who cleared NTA UGC NET English",
    achievers: allAchievers.filter((a) => a.group === "net"),
    titleColor: "text-gray-800",
    subColor: "text-gray-500",
    dividerColor: "bg-amber-400",
    hasBgImage: false,
  },
  {
    label: "Assistant Professor Achievers 2026",
    sub: "Scholars who secured Assistant Professor & Lecturer positions",
    achievers: allAchievers.filter((a) => a.group === "prof"),
    titleColor: "text-white",
    subColor: "text-purple-200",
    dividerColor: "bg-purple-400",
    hasBgImage: true,
  },
];

// ==================== MAIN COMPONENT ====================

export function LePearlAchieversCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setCurrentPage((p) => (p + 1) % pages.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentPage((p) => (p - 1 + pages.length) % pages.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const page = pages[currentPage];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const isDark = currentPage === 1;

  return (
    <section
      className={`w-full relative overflow-hidden transition-colors duration-700 py-16 ${
        isDark
          ? "bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900"
          : "bg-gradient-to-br from-amber-100 via-orange-50 to-rose-50"
      }`}
    >
      {/* English literature background image for Professor page */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isDark ? "opacity-15" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700 bg-clip-text text-transparent">
          LePearl Achievers 2026
        </h1>
        <p
          className={`text-base max-w-3xl mx-auto leading-relaxed transition-colors duration-500 ${isDark ? "text-purple-200" : "text-gray-600"}`}
        >
          Celebrating the success of our scholars through focused mentorship,
          strategic preparation, and continuous academic guidance.
        </p>
      </div>

      {/* Page container with arrows */}
      <div className="relative w-full overflow-hidden px-10">
        {/* Left arrow */}
        <button
          onClick={goPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        {/* Right arrow */}
        <button
          onClick={goNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Section title */}
            <div className="text-center mb-6">
              <h2
                className={`text-2xl md:text-3xl font-bold mb-1 ${page.titleColor}`}
              >
                {page.label}
              </h2>
              <p className={`text-sm ${page.subColor}`}>{page.sub}</p>
              <div
                className={`mx-auto mt-3 h-1 w-20 rounded-full ${page.dividerColor}`}
              />
            </div>

            {/* 5 cards in a row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pb-8">
              {page.achievers.map((achiever, idx) => (
                <AchieverCard key={idx} {...achiever} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-2 mt-4">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentPage ? 1 : -1);
              setCurrentPage(i);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentPage
                ? isDark
                  ? "bg-purple-400 scale-125"
                  : "bg-amber-500 scale-125"
                : isDark
                  ? "bg-purple-700"
                  : "bg-amber-200"
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Guidance Points */}
      <GuidancePoints isDark={isDark} />

      {/* CTA Buttons */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="/achievers"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 inline-block text-center"
        >
          View All Achievers
        </a>
        <a
          href="/login-portal" target="_blank" rel="noopener noreferrer"
          className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 inline-block text-center"
        >
          Join LePearl Courses
        </a>
      </div>
    </section>
  );
}

export default LePearlAchieversCarousel;
