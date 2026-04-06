import { getSiteContent } from "@/lib/siteContent";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { FounderContent } from "@/components/FounderContent";
import { FacultyCarousel } from "@/components/FacultyCarousel";
import { FounderBooks } from "@/components/FounderBooks";
import { LiveClassesPortalSection } from "@/components/LiveClassesPortalSection";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { LePearlAchieversCarousel } from "@/components/LePearlAchieversCarousel";
import { CoursesBooksSection } from "@/components/CoursesBooksSection";
import { PreviousPapersSection } from "@/components/PreviousPapersSection";
import { MissionSection } from "@/components/MissionSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { MockTestsSection } from "@/components/MockTestsSection";
import { FAQSection } from "@/components/FAQSection";
import { NeedHelpSection } from "@/components/LiveClassesPortalSection";
import { SiteFooter } from "@/components/SiteFooter";
import { WeeklyScheduleSection } from "@/components/WeeklyScheduleSection";
import { NavDropdown } from "@/components/NavDropdown";
import { StudentReviewsSection } from "@/components/StudentReviewsSection";

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
    <div style={{ position: "relative" }}>
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
      <div style={{ position: "relative", zIndex: 1 }}>
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
            overflowX: "auto",
          }}
        >
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

        {/* Header */}
        <header
          style={{
            position: "relative",
            zIndex: 10,
            background: "transparent",
            borderBottom: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "12px 32px",
            }}
          >
            {/* Logo and Branding */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 150,
              }}
            >
              <Image
                src="/logo_vectorformat.png"
                alt="LePearl logo"
                width={220}
                height={220}
                quality={100}
                style={{ objectFit: "contain" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.2,
                  textAlign: "center",
                  marginTop: -22,
                }}
              >
                <span
                  style={{ fontWeight: 700, fontSize: 22, color: "#a21caf" }}
                >
                  LePearl Education
                </span>
                <span
                  style={{ fontSize: 12, color: "#4c1d95", fontWeight: 500 }}
                >
                  Centre of Excellence in English Language &amp; Literature
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 20,
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Navigation Menu */}
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  flex: "0 1 auto",
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  marginRight: 20,
                }}
              >
                <span
                  style={{
                    background: "#ede9fe",
                    color: "#7c3aed",
                    fontWeight: 600,
                    borderRadius: 10,
                    padding: "6px 18px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Home
                </span>
                <NavDropdown
                  label="Online Courses"
                  href="#"
                  openSubmenuInNewTab
                  submenu={[
                    {
                      label: "Assistant Professor",
                      isSection: true,
                      submenu: [
                        { label: "MPPSC", href: "/courses-mppsc" },
                        { label: "UPHESC", href: "/courses-uphesc" },
                        { label: "UP GDC", href: "/courses-upgdc" },
                      ],
                    },
                    {
                      label: "NTA NET",
                      isSection: true,
                      submenu: [
                        { label: "NET Paper 1", href: "/courses-net-paper1" },
                        { label: "NET Paper 2", href: "/courses-net-paper2" },
                      ],
                    },
                    {
                      label: "Other Teaching Exams",
                      isSection: true,
                      submenu: [
                        { label: "GIC", href: "/courses-gic" },
                        { label: "LT Grade", href: "/courses-ltgrade" },
                      ],
                    },
                    {
                      label: "Interview Preparation",
                      isSection: true,
                      submenu: [
                        {
                          label: "Communication Skills",
                          href: "/courses-communication-skills",
                        },
                      ],
                    },
                  ]}
                />
                <a
                  href="/research-assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Research Assistance
                </a>
                <a
                  href="#pyqs"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  PYQs
                </a>
                <a
                  href="/achievers"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  LePearl Achievers
                </a>
                <a
                  href="#reviews"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {"Student's Reviews"}
                </a>
                <a
                  href="#mock"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Mock Test
                </a>
                <a
                  href="#books"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Books
                </a>
              </nav>

              {/* Right Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                <a
                  href="#live-class"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  Live Class
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ef4444",
                      marginLeft: 2,
                    }}
                  />
                </a>
                <a
                  href="#contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1.5px solid #065f46",
                    background: "#065f46",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "9px 14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: 15,
                    whiteSpace: "nowrap",
                  }}
                  aria-label="Contact"
                >
                  <Phone size={16} />
                </a>
                <a
                  href="/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "7px 22px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Spacing below header */}
        <div style={{ height: 28 }} />

        <main id="home">
          <SuccessStoriesSection />
          <LePearlAchieversCarousel />
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
          <FacultyCarousel />
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
