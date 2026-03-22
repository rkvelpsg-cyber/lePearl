import { getSiteContent } from "@/lib/siteContent";
import Image from "next/image";
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
          fontSize: 18,
          padding: "8px 0",
          letterSpacing: 0.2,
        }}
      >
        Admission opened for:{" "}
        <span className="top-admission-highlight">
          NTA NET June 2026 | MPPSC | UPHESC | UP GDC | LT GRADE | GIC
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
                  minWidth: 180,
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

              {/* Navigation Menu */}
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  flexWrap: "wrap",
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
                  }}
                >
                  Home
                </span>
                <NavDropdown
                  label="Online Courses"
                  href="#"
                  openSubmenuInNewTab
                  submenu={[
                    { label: "MPPSC", href: "/courses-mppsc" },
                    { label: "NET Paper 1", href: "/courses-net-paper1" },
                    { label: "NET Paper 2", href: "/courses-net-paper2" },
                    { label: "UP GDC", href: "/courses-upgdc" },
                    { label: "UPHESC", href: "/courses-uphesc" },
                    { label: "LT Grade", href: "/courses-ltgrade" },
                    { label: "GIC", href: "/courses-gic" },
                  ]}
                />
                <a
                  href="#research"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reasearch Assistance
                </a>
                <a
                  href="#pyqs"
                  style={{
                    color: "#222",
                    fontWeight: 500,
                    textDecoration: "none",
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
                  href="#mocktest"
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
                  }}
                >
                  Books
                </a>
                <span
                  style={{
                    color: "#222",
                    fontWeight: 500,
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
                </span>
              </nav>

              {/* Right Buttons */}
              <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                <a
                  href="#contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: "1.5px solid #065f46",
                    background: "#065f46",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "7px 18px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Phone size={16} />
                  Contact
                </a>
                <a
                  href="/login"
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
      </div>
      <div className="footer-no-video">
        <SiteFooter />
      </div>
    </>
  );
}
