import { getSiteContent } from "@/lib/siteContent";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";

import { Header } from "@/components/Header";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { CoursesBooksSection } from "@/components/CoursesBooksSection";

// Lazy-load below-the-fold sections so the initial page paint is faster
const FounderContent = dynamic(() =>
  import("@/components/FounderContent").then((m) => ({
    default: m.FounderContent,
  })),
);
const FacultyCarousel = dynamic(() =>
  import("@/components/FacultyCarousel").then((m) => ({
    default: m.FacultyCarousel,
  })),
);
const FounderBooks = dynamic(() =>
  import("@/components/FounderBooks").then((m) => ({
    default: m.FounderBooks,
  })),
);
const LiveClassesPortalSection = dynamic(() =>
  import("@/components/LiveClassesPortalSection").then((m) => ({
    default: m.LiveClassesPortalSection,
  })),
);
const NeedHelpSection = dynamic(() =>
  import("@/components/LiveClassesPortalSection").then((m) => ({
    default: m.NeedHelpSection,
  })),
);
const PreviousPapersSection = dynamic(() =>
  import("@/components/PreviousPapersSection").then((m) => ({
    default: m.PreviousPapersSection,
  })),
);
const MissionSection = dynamic(() =>
  import("@/components/MissionSection").then((m) => ({
    default: m.MissionSection,
  })),
);
const WhyChooseSection = dynamic(() =>
  import("@/components/WhyChooseSection").then((m) => ({
    default: m.WhyChooseSection,
  })),
);
const MockTestsSection = dynamic(() =>
  import("@/components/MockTestsSection").then((m) => ({
    default: m.MockTestsSection,
  })),
);
const FAQSection = dynamic(() =>
  import("@/components/FAQSection").then((m) => ({ default: m.FAQSection })),
);
const SiteFooter = dynamic(() =>
  import("@/components/SiteFooter").then((m) => ({ default: m.SiteFooter })),
);
const WeeklyScheduleSection = dynamic(() =>
  import("@/components/WeeklyScheduleSection").then((m) => ({
    default: m.WeeklyScheduleSection,
  })),
);
const StudentReviewsSection = dynamic(() =>
  import("@/components/StudentReviewsSection").then((m) => ({
    default: m.StudentReviewsSection,
  })),
);

export default async function Home() {
  const content = await getSiteContent();
  const studentReviews = [
    {
      id: 1,
      name: "Dr. Babli Mallick",
      track: "Assistant Professor Achiever",
      exam: "MPPSC 2025",
      image: "/DrBablick.png",
      rating: 5,
      review:
        "LePearl Education gave me a complete roadmap, focused mentoring, and consistent mock practice. The personal guidance from faculty made all the difference in my MPPSC journey.",
    },
    {
      id: 2,
      name: "Ms. Rekha Bhati",
      track: "Assistant Professor Achiever",
      exam: "RPSC Rank 11, 2025",
      image: "/Rekha Bhati.jpeg",
      rating: 5,
      review:
        "Every class was exam-oriented and practical. From concept clarity to interview confidence, LePearl helped me perform with consistency and confidence.",
    },
    {
      id: 3,
      name: "Mr. Balram Mishra",
      track: "Assistant Professor Achiever",
      exam: "MPPSC 2025",
      image: "/Balram Mishra.jpeg",
      rating: 5,
      review:
        "The guidance at LePearl is structured and result-driven. Regular feedback, revision strategy, and test analysis helped me crack the exam on time.",
    },
    {
      id: 4,
      name: "Ms. Kanika Sharma",
      track: "NTA NET Achiever",
      exam: "NTA-NET English, Dec 2025",
      image: "/Kanika Sharma.jpeg",
      rating: 5,
      review:
        "LePearl's content and live doubt sessions simplified tough topics. Their notes and mock tests were exactly aligned with NTA NET expectations.",
    },
    {
      id: 5,
      name: "Ms. Shivani Tiwari",
      track: "NTA NET-JRF Achiever",
      exam: "NTA-JRF English, Dec 2024",
      image: "/Shivani Tiwari.jpeg",
      rating: 5,
      review:
        "I loved the discipline and accountability LePearl builds. The personalized mentorship and daily targets helped me stay focused and secure JRF.",
    },
    {
      id: 6,
      name: "Ms. Deepti Dwivedi",
      track: "NTA NET Achiever",
      exam: "NTA-NET English, Jun 2023",
      image: "/Deepti Dwivedi.jpeg",
      rating: 5,
      review:
        "From classes to motivation sessions, everything felt student-first. LePearl transformed my preparation and gave me confidence to clear NET.",
    },
    {
      id: 7,
      name: "Mr. Shubham Singh",
      track: "Assistant Professor Achiever",
      exam: "MPPSC 2025",
      image: "/Shubham Singh.jpeg",
      rating: 5,
      review:
        "LePearl's mentorship was practical and focused on outcomes. The practice modules and strategy sessions kept my preparation sharp till the final exam.",
    },
    {
      id: 8,
      name: "Mr. Asit Kumar Mohanty",
      track: "Assistant Professor Achiever",
      exam: "Lecturer, OPSC 2024",
      image: "/Asit Kumar Mohanty.jpeg",
      rating: 5,
      review:
        "I gained conceptual depth and confidence with LePearl's faculty support. Their revision plans and feedback system helped me perform consistently.",
    },
    {
      id: 9,
      name: "Ms. Vineeta Vijay Sharma",
      track: "NTA NET Achiever",
      exam: "NTA NET, Dec 2022",
      image: "/Vineeta Vijay Sharma.jpeg",
      rating: 5,
      review:
        "LePearl made my NET preparation structured and stress-free. Topic-wise tests and one-to-one doubt guidance improved my accuracy and confidence.",
    },
    {
      id: 10,
      name: "Ms. Nidhi Shukla",
      track: "NTA NET Achiever",
      exam: "NTA-NET, Dec 2025",
      image: "/Nidhi Shukla, NTA-NET Dec 2025.jpeg",
      rating: 5,
      review:
        "The classes were clear, engaging, and fully exam-aligned. LePearl's daily support and mock analysis played a major role in my NET result.",
    },
  ];

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Background Video - Homepage Only */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1,
          }}
        >
          <source src="/LePearlvideo3.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content Wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Top Banner */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            background: "#12606a",
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "clamp(12px, 2.5vw, 18px)",
            padding: "clamp(6px, 2vw, 12px) clamp(12px, 3vw, 20px)",
            letterSpacing: 0.2,
            overflowX: "hidden",
            overflowY: "hidden",
            scrollbarWidth: "none",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(8px, 2vw, 16px)",
          }}
        >
          {/* Social Media Icons - Right Side */}
          <div
            style={{
              display: "flex",
              gap: "clamp(8px, 1.5vw, 12px)",
              flexShrink: 0,
            }}
          >
            <a
              href="https://www.youtube.com/channel/UCnxWNpUm3iltu922GwWnRHg"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "clamp(6px, 1vw, 10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="YouTube"
            >
              <Youtube
                style={{
                  width: "clamp(14px, 2.5vw, 20px)",
                  height: "clamp(14px, 2.5vw, 20px)",
                }}
              />
            </a>
            <a
              href="https://www.facebook.com/The-Pearl-Education-104234304455338/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "clamp(6px, 1vw, 10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Facebook"
            >
              <Facebook
                style={{
                  width: "clamp(14px, 2.5vw, 20px)",
                  height: "clamp(14px, 2.5vw, 20px)",
                }}
              />
            </a>
            <a
              href="https://www.instagram.com/thepearlseducation/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "clamp(6px, 1vw, 10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Instagram"
            >
              <Instagram
                style={{
                  width: "clamp(14px, 2.5vw, 20px)",
                  height: "clamp(14px, 2.5vw, 20px)",
                }}
              />
            </a>
            <a
              href="https://twitter.com/EducationPearl"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "clamp(6px, 1vw, 10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Twitter"
            >
              <Twitter
                style={{
                  width: "clamp(14px, 2.5vw, 20px)",
                  height: "clamp(14px, 2.5vw, 20px)",
                }}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/the-pearl-education-4a43151a0/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "clamp(6px, 1vw, 10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="LinkedIn"
            >
              <Linkedin
                style={{
                  width: "clamp(14px, 2.5vw, 20px)",
                  height: "clamp(14px, 2.5vw, 20px)",
                }}
              />
            </a>
          </div>

          {/* Admission Text - Center/Left */}
          <div style={{ flex: "1 1 auto", minWidth: 0, maxWidth: "100%" }}>
            Admission opened for:{" "}
            <span
              className="top-admission-highlight"
              style={{
                display: "inline-flex",
                gap: "clamp(4px, 1vw, 8px)",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link
                href="/courses-net-paper1"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRight: "1px solid #fff",
                  paddingRight: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                NTA NET Jun 2026 Paper 1
              </Link>
              <Link
                href="/courses-net-paper2"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRight: "1px solid #fff",
                  paddingRight: "clamp(4px, 1vw, 8px)",
                  paddingLeft: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                NTA NET Jun 2026 Paper 2 (English)
              </Link>
              <Link
                href="/courses-mppsc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRight: "1px solid #fff",
                  paddingRight: "clamp(4px, 1vw, 8px)",
                  paddingLeft: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                MPPSC
              </Link>
              <Link
                href="/courses-uphesc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRight: "1px solid #fff",
                  paddingRight: "clamp(4px, 1vw, 8px)",
                  paddingLeft: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                UPHESC
              </Link>
              <Link
                href="/courses-upgdc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRight: "1px solid #fff",
                  paddingRight: "clamp(4px, 1vw, 8px)",
                  paddingLeft: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                UP GDC
              </Link>
              <Link
                href="/courses-ltgrade"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRight: "1px solid #fff",
                  paddingRight: "clamp(4px, 1vw, 8px)",
                  paddingLeft: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                LT GRADE
              </Link>
              <Link
                href="/courses-gic"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                  paddingLeft: "clamp(4px, 1vw, 8px)",
                  fontSize: "clamp(11px, 2.5vw, 16px)",
                  whiteSpace: "nowrap",
                }}
              >
                GIC
              </Link>
            </span>
          </div>
        </div>

        {/* Header */}
        <Header />

        {/* Spacing below header */}
        <div style={{ height: 28 }} />

        {/* Mobile/Tablet-only Hero Section - shows logo and video background */}
        <div
          className="lg:hidden flex flex-col items-center justify-center min-h-[45vh] px-4 py-10"
          style={{ background: "rgba(0,0,0,0.18)" }}
        >
          <Image
            src="/logo_vectorformat.png"
            alt="LePearl Education Logo"
            width={120}
            height={120}
            quality={90}
            priority
            style={{ objectFit: "contain" }}
            className="mb-3 drop-shadow-xl"
          />
          <h1
            className="text-2xl font-bold text-white text-center drop-shadow-lg"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
          >
            LePearl Education
          </h1>
          <p
            className="text-sm text-white/90 text-center mt-1 drop-shadow"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
          >
            Centre of Excellence in English Language &amp; Literature
          </p>
        </div>

        <main id="home">
          <SuccessStoriesSection />
          <CoursesBooksSection />
          <PreviousPapersSection />
          <MissionSection />
          <div
            id="founder"
            className="py-12 overflow-visible"
            style={{ background: "rgba(255,255,255,0.60)" }}
          >
            <FounderContent />
          </div>
          <div id="faculty">
            <FacultyCarousel />
          </div>
          <WhyChooseSection />
          <FounderBooks />
          <MockTestsSection />
          <LiveClassesPortalSection />
          <WeeklyScheduleSection />
        </main>

        <FAQSection />
        <NeedHelpSection />

        <StudentReviewsSection reviews={studentReviews} />

        <div className="footer-no-video">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
