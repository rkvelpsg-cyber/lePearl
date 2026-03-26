import { getSiteContent } from "@/lib/siteContent";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { HomeHeroCarousel } from "@/components/HomeHeroCarousel";
import { FounderContent } from "@/components/FounderContent";
import { FacultyCarousel } from "@/components/FacultyCarousel";
import { FounderBooks } from "@/components/FounderBooks";
import { LiveClassesPortalSection } from "@/components/LiveClassesPortalSection";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
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

export default async function Home() {
  const content = await getSiteContent();
  return (
    <>
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

      {/* Background Video */}
      <div style={{ position: "relative" }}>
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

        <div style={{ position: "relative", zIndex: 1 }}>
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
                          { label: "Communication Skills", href: "/courses-communication-skills" },
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
            <section className="hero-home-section">
              <HomeHeroCarousel />
            </section>
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
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <FAQSection />
        <NeedHelpSection />

        {/* Achievers CTA Section */}
        <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent px-2">
                See Our Success Stories
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Meet the students who cracked NTA NET with LePearl Education.
                Get inspired by their journey and start yours today!
              </p>
              <div className="flex justify-center pt-2 sm:pt-4">
                <Link
                  href="/achievers"
                  className="group relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>View All Achievers</span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-no-video">
        <SiteFooter />
      </div>
    </>
  );
}
