// ...existing code...
// ...existing code...
import React, { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Feature {
  text: string;
}

interface CourseCard {
  id: number;
  title: string;
  description: string;
  features: Feature[];
  gradient: string;
  image: string;
  color: string;
}

const courseData: CourseCard[] = [
  {
    id: 1,
    title: "NTA NET 2026 Achievers",
    description:
      "Our students achieved top ranks in NTA NET 2026 through expert mentoring and structured learning.",
    features: [
      { text: "Concept-based preparation" },
      { text: "Weekly live + recorded sessions" },
      { text: "50+ mock tests with analysis" },
      { text: "Personal mentorship" },
    ],
    gradient: "from-blue-500/20 to-blue-600/20",
    color: "blue",
    image: "",
  },
  {
    id: 2,
    title: "Assistant Professor 2026 Success",
    description:
      "Transform your dream into reality with proven success strategies.",
    features: [
      { text: "Interview guidance" },
      { text: "Previous year insights" },
      { text: "Smart preparation plans" },
      { text: "Career mentorship" },
    ],
    gradient: "from-purple-500/20 to-purple-600/20",
    color: "purple",
    image: "",
  },
  {
    id: 3,
    title: "UPHESC Assistant Professor",
    description:
      "Comprehensive preparation for UPHESC Assistant Professor exam.",
    features: [
      { text: "Syllabus coverage" },
      { text: "Practice questions" },
      { text: "Doubt clearing sessions" },
      { text: "Expert faculty support" },
    ],
    gradient: "from-yellow-500/20 to-yellow-600/20",
    color: "yellow",
    image: "",
  },
  {
    id: 5,
    title: "UP LT Grade (Main) – English",
    description: "Master English subject for LT Grade success.",
    features: [
      { text: "Literature coverage" },
      { text: "Grammar + writing skills" },
      { text: "Mock exams" },
      { text: "Exam-focused strategy" },
    ],
    gradient: "from-orange-500/20 to-orange-600/20",
    color: "orange",
    image: "",
  },
  {
    id: 6,
    title: "UPPSC GIC Lecturer (English)",
    description: "Prepare for Prelims & Mains with confidence.",
    features: [
      { text: "Dual exam strategy" },
      { text: "Subject expertise" },
      { text: "PYQs discussion" },
      { text: "Answer writing practice" },
    ],
    gradient: "from-red-500/20 to-red-600/20",
    color: "red",
    image: "",
  },
  {
    id: 7,
    title: "Interview Preparation Program",
    description: "Crack your final stage with confidence.",
    features: [
      { text: "Mock interviews" },
      { text: "Communication skills" },
      { text: "Personality development" },
      { text: "NLP-based training" },
    ],
    gradient: "from-pink-500/20 to-pink-600/20",
    color: "pink",
    image: "",
  },
  {
    id: 8,
    title: "NTA NET Paper 1 & Paper 2 (English)",
    description: "Comprehensive preparation for both papers.",
    features: [
      { text: "Teaching & Research Aptitude" },
      { text: "English literature modules" },
      { text: "PYQs + mock tests" },
      { text: "Strategy sessions" },
    ],
    gradient: "from-indigo-500/20 to-indigo-600/20",
    color: "indigo",
    image: "",
  },
  {
    id: 9,
    title: "Ph.D Research Support (English)",
    description: "End-to-end guidance for research scholars.",
    features: [
      { text: "Research proposal writing" },
      { text: "Thesis support" },
      { text: "Literature review guidance" },
      { text: "Academic writing training" },
    ],
    gradient: "from-teal-500/20 to-teal-600/20",
    color: "teal",
    image: "",
  },
];

export default function App() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    arrows: false,
    centerMode: false,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "0",
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="size-full">
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Hero Overlay Text */}
        <div className="relative z-10 pt-6 pb-3 sm:pt-8 sm:pb-4 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight break-words"
          >
            Shape Your Academic Career with{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LePearl Education
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-blue-200 mb-4 px-2 break-words"
          >
            From NET to Assistant Professor – we guide your journey
          </motion.p>
        </div>

        {/* Carousel Section */}
        <div className="relative z-10 pb-6 sm:pb-8">
          <div className="w-full">
            <Slider ref={sliderRef} {...settings}>
              {courseData.map((course) => (
                <div key={course.id}>
                  <motion.div
                    whileHover={{ scale: 1.01, y: -3 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-gradient-to-br ${course.gradient} backdrop-blur-lg overflow-hidden shadow-2xl border-y border-white/20 h-[480px] sm:h-[550px] md:h-[600px] lg:h-[650px]`}
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                    }}
                  >
                    {/* Dark overlay to improve text readability without changing card background */}
                    <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
                    <div className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-6 sm:p-10 md:p-14 lg:p-16 h-full max-w-[1600px] mx-auto max-h-full overflow-y-auto md:overflow-y-visible">
                      {/* Left Side - Content */}
                      <div className="flex flex-col justify-center space-y-4 sm:space-y-6 min-w-0">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <h2
                            className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 break-words"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                          >
                            {course.title}
                          </h2>
                          <p
                            className="text-sm sm:text-lg text-white/95 mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-4 break-words"
                            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                          >
                            {course.description}
                          </p>
                        </motion.div>

                        {/* Features */}
                        <div className="space-y-2 sm:space-y-3">
                          {course.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex items-start space-x-2 sm:space-x-3 min-w-0"
                            >
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span
                                className="text-white text-xs sm:text-sm md:text-base break-words"
                                style={{
                                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                }}
                              >
                                {feature.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full md:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold transition-all border border-white/30 shadow-lg text-sm sm:text-base`}
                        >
                          Explore Program
                        </motion.button>
                      </div>

                      {/* Right Side - Image */}
                      <div className="hidden md:flex items-center justify-center min-w-0">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="relative w-full h-full"
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${course.gradient} rounded-2xl opacity-60`}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${course.gradient} rounded-full opacity-40 blur-2xl`}
                            ></div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>

            {/* Custom Navigation Arrows */}
            <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="p-2 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all border border-white/20 group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="p-2 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all border border-white/20 group"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
