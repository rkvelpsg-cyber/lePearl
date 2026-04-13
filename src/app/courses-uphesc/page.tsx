"use client";

import { useState, useEffect } from "react";
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
  Quote,
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
              href="/login"
              className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Enroll Now
            </a>
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300">
              Download Course Details
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
  const testimonials = [
    {
      name: "Ms Priya Sharma",
      exam: "UPHESC Adv 50-2022",
      image: "/Priya%20sharma.jpeg",
      quote:
        "LePearl's comprehensive study material and expert guidance helped me clear UPHESC Adv 50-2022. Their personalized attention made all the difference.",
    },
    {
      name: "Ms Sandhya Patel",
      exam: "UPHESC Adv 50-2022",
      image: "/Sandhya%20Patel.jpeg",
      quote:
        "From comprehensive study material to answer writing practice, LePearl covered everything. I'm now proudly serving as an Assistant Professor!",
    },
    {
      name: "Ms Rashmi Verma",
      exam: "UPHESC Adv 50-2022",
      image: "/Rashmi%20verma.jpeg",
      quote:
        "LePearl's structured approach and mock tests were instrumental in my success. Their faculty support is unmatched.",
    },
    {
      name: "Ms Mahima Thakur",
      exam: "UPHESC Adv 50-2022",
      image: "/Mahima.jpeg",
      quote:
        "The live doubt sessions and personalized guidance at LePearl helped me build confidence and clear the exam successfully.",
    },
    {
      name: "Ms. Surbhi Satyabha",
      exam: "UPHESC-Adv 50-2022",
      image: "/Surbhi.jpeg",
      quote:
        "LePearl's holistic approach to preparation transformed my understanding of the subject. Grateful for their expert mentorship.",
    },
    {
      name: "Dr. Amresh",
      exam: "UPHESC, Adv 50- 2022",
      image: "/Amresh.jpeg",
      quote:
        "The comprehensive study materials and regular assessments at LePearl were key to my success in the UPHESC examination.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal-800 via-cyan-700 to-teal-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Student Success Stories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto"></div>
          <p className="text-cyan-100 mt-4">
            Success stories from UPHESC Advertisement 50 batch
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-yellow-400">
                    <ImageWithFallback
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-teal-900" />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-lg sm:text-xl text-cyan-100 mb-6 leading-relaxed italic">
                  &quot;{testimonials[currentIndex].quote}&quot;
                </p>
                <div>
                  <h4 className="text-xl font-bold text-yellow-400">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-cyan-200 mt-1">
                    {testimonials[currentIndex].exam}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-teal-900" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-teal-900" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-yellow-500"
                    : "w-2 bg-white/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EnrollmentSection() {
  const pricingOptions = [
    {
      icon: CreditCard,
      title: "One-Time Payment",
      price: "₹4,995",
      features: [
        "Full course access",
        "All video lectures",
        "50+ mock tests",
        "Study materials",
        "Live doubt sessions",
        "Lifetime validity",
      ],
    },
    {
      icon: Calendar,
      title: "Installment Plan",
      price: "₹2,250 × 2",
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
                  href="/login"
                  className={`block w-full py-4 rounded-lg font-bold text-lg text-center transition-all duration-300 ${
                    option.popular
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-teal-900 hover:shadow-xl hover:scale-105"
                      : "bg-gradient-to-r from-teal-700 to-cyan-600 text-white hover:shadow-lg hover:scale-105"
                  }`}
                >
                  Enroll Now
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-700 to-cyan-600 rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Begin Your Success Journey?
            </h3>
            <p className="text-cyan-100 mb-6">
              Fill out our registration form and our team will guide you through
              the enrollment process
            </p>
            <a
              href="/login"
              className="inline-block bg-yellow-500 text-teal-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Fill Registration Form
            </a>
          </div>
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



