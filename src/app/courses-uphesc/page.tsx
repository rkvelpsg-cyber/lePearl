"use client";

import { useEffect, useRef } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  GraduationCap,
  Video,
  FileText,
  MessageCircle,
  Target,
  Users,
  Award,
  TrendingUp,
  ClipboardCheck,
  BookOpen,
  MessageSquare,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Check,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Facebook,
  X,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { OnlineCourseHighlights } from "@/components/OnlineCourseHighlights";

function Header() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return <CoursePageHeader onEnroll={scrollToEnrollment} />;
}

function HeroSection() {
  const scrollToEnrollment = () => {
    document
      .getElementById("enrollment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadSyllabus = () => {
    window.location.href = "/student-registration?mode=free";
  };

  return (
    <section className="relative bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1718327453695-4d32b94c90a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGxpYnJhcnl8ZW58MXx8fHwxNzczMjkyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="College students studying"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Dominate UPHESC Assistant Professor Exam,{" "}
            <span className="text-yellow-400">Your Path to Prestige</span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Holistic preparation: Syllabus mastery and structured learning
            designed for Uttar Pradesh&apos;s top educators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/student-registration?mode=paid&course=UPHESC"
              className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Enroll Now
            </a>
            <button
              onClick={downloadSyllabus}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Download Syllabus
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm sm:text-base font-medium">
                Recorded Lectures
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm sm:text-base font-medium">
                Mock Tests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm sm:text-base font-medium">
                Live Doubt Sessions
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseOverview() {
  const features = [
    {
      icon: Target,
      title: "Tailored for UPHESC Aspirants",
      description: "Tailored for UPHESC aspirants",
    },
    {
      icon: Video,
      title: "Comprehensive Learning Materials",
      description:
        "Blend of live video lectures, PDFs, and live doubt resolution sessions",
    },
    {
      icon: Users,
      title: "Flipped Live Classes",
      description:
        "Flipped Live Classes with live Question and Answer solving with explanation.",
    },
    {
      icon: Award,
      title: "Expert Faculty",
      description:
        "Subject Expertise with teaching experience of more than 15 years.",
    },
    {
      icon: TrendingUp,
      title: "Proven Strategies",
      description:
        "No shortcuts, just proven strategies for first-attempt success.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-800 mb-4">
            Course Overview
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-700 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-teal-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "Video Lectures",
      description:
        "In-depth coverage of the UPHESC pattern, simplified complex topics.",
    },
    {
      icon: ClipboardCheck,
      title: "Mock Tests",
      description: "50+ Mock tests with detailed analysis.",
    },
    {
      icon: BookOpen,
      title: "Study Material",
      description:
        "Concise PDFs, recorded lectures, and previous papers decoded.",
    },
    {
      icon: MessageSquare,
      title: "Live Doubt Clearing",
      description: "Weekly sessions for real-time support.",
    },
    {
      icon: UserCheck,
      title: "Personalized Attention",
      description: "One-to-one attention as per the student's needs.",
    },
    {
      icon: TrendingUp,
      title: "Holistic Development",
      description: "Holistic development of the students.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-800 mb-4">
            Course Features &amp; Benefits
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-400 hover:-translate-y-2"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-teal-800 mb-3">
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

function TestimonialsSection() {
  const stories = [
    {
      id: "uphesc-1",
      videoId: "hcwQpy5Stx0",
      videoUrl:
        "https://www.youtube.com/watch?v=hcwQpy5Stx0&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=5",
      name: "Ms Priya Sharma",
      role: "Assistant Professor, UPHESC Adv 50-2022",
      thumbnailUrl: "https://img.youtube.com/vi/hcwQpy5Stx0/maxresdefault.jpg",
    },
    {
      id: "uphesc-2",
      videoId: "l0Abm1noZIQ",
      videoUrl:
        "https://www.youtube.com/watch?v=l0Abm1noZIQ&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=2",
      name: "Ms Sandhya Patel",
      role: "Assistant Professor, UPHESC Adv 50-2022",
      thumbnailUrl: "https://img.youtube.com/vi/l0Abm1noZIQ/maxresdefault.jpg",
    },
    {
      id: "uphesc-3",
      videoId: "rOW5qTfiu1w",
      videoUrl:
        "https://www.youtube.com/watch?v=rOW5qTfiu1w&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=7",
      name: "Ms Rashmi Verma",
      role: "Assistant Professor, UPHESC Adv 50-2022",
      thumbnailUrl: "https://img.youtube.com/vi/rOW5qTfiu1w/maxresdefault.jpg",
    },
    {
      id: "uphesc-4",
      videoId: "GUFJHeMMG10",
      videoUrl:
        "https://www.youtube.com/watch?v=GUFJHeMMG10&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=7",
      name: "Ms Mahima Thakur",
      role: "Assistant Professor, UPHESC Adv 50-2022",
      thumbnailUrl: "https://img.youtube.com/vi/GUFJHeMMG10/maxresdefault.jpg",
    },
    {
      id: "uphesc-5",
      videoId: "YvGREAy7h5M",
      videoUrl:
        "https://www.youtube.com/watch?v=YvGREAy7h5M&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=9",
      name: "Dr. Amresh",
      role: "Assistant Professor, UPHESC Adv 50-2022",
      thumbnailUrl: "https://img.youtube.com/vi/YvGREAy7h5M/maxresdefault.jpg",
    },
  ];

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
            Student Success Stories
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">
            Success stories from UPHESC Advertisement 50 batch
          </p>
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
            className="uphesc-stories-scroll overflow-x-auto px-12 py-1 sm:px-16 md:px-20 lg:px-24"
          >
            <div className="flex w-max gap-4 pb-4 md:gap-6">
              {stories.map((story) => (
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
                    aria-label={`Play ${story.name} success story`}
                    className="relative block aspect-video overflow-hidden bg-gray-900"
                  >
                    <ImageWithFallback
                      src={story.thumbnailUrl}
                      alt={`${story.name} success story`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="rounded-full bg-[#6A0DAD] p-5 shadow-2xl transition-transform duration-300 hover:scale-110">
                        <Play className="h-8 w-8 fill-white text-white" />
                      </div>
                    </div>
                  </a>

                  <div className="flex min-h-[220px] flex-col p-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {story.name}
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
        .uphesc-stories-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: none;
          scroll-padding-inline: clamp(3rem, 9vw, 8rem);
        }

        .uphesc-stories-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function EnrollmentSection() {
  const pricingOptions = [
    {
      icon: CreditCard,
      title: "One-Time Payment",
      price: "Rs. 14,995",
      features: [
        "Full course access",
        "All video lectures",
        "50+ mock tests",
        "Study materials",
        "Live doubt sessions",
        "Two Years Validity from the Date of Registration or Completion of Exam whichever is Later",
      ],
    },
    {
      icon: Calendar,
      title: "Installment Plan",
      price: "Rs. 5,495 × 3",
      features: [
        "Full course access",
        "All video lectures",
        "50+ mock tests",
        "Study materials",
        "Live doubt sessions",
        "Flexible payment options",
      ],
      popular: true,
    },
  ];

  return (
    <section id="enrollment" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-800 mb-4">
            Start Your Journey to Becoming an Assistant Professor
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Choose the payment plan that works best for you and begin your
            preparation today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 ${
                  option.popular ? "ring-4 ring-yellow-400 scale-105" : ""
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-teal-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                      POPULAR CHOICE
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-teal-800 mb-2">
                    {option.title}
                  </h3>
                  <div className="text-4xl font-bold text-teal-800 mb-1">
                    {option.price}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Complete course package
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/student-registration?mode=paid&course=UPHESC"
                  className={`block w-full py-4 rounded-lg font-bold text-lg text-center transition-all duration-300 ${
                    option.popular
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-teal-900 hover:shadow-xl hover:scale-105"
                      : "bg-gradient-to-r from-teal-700 to-cyan-600 text-white hover:shadow-lg hover:scale-105"
                  }`}
                  style={{ color: "#ffffff" }}
                >
                  Enroll Now
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function UPHESCPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CourseOverview />
      <FeaturesSection />
      <TestimonialsSection />
      <EnrollmentSection />
      <OnlineCourseHighlights />
      <CoursePageFooter />
    </div>
  );
}
