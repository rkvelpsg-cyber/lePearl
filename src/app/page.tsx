import { getSiteContent } from "@/lib/siteContent";
import Image from "next/image";
import { Phone } from "lucide-react";
import { HomeHeroCarousel } from "@/components/HomeHeroCarousel";
import { FounderContent } from "@/components/FounderContent";
import { FacultyCarousel } from "@/components/FacultyCarousel";
import { FounderBooks } from "@/components/FounderBooks";
import {
  LiveClassesPortalSection,
  NeedHelpSection,
} from "@/components/LiveClassesPortalSection";
import { MissionSection } from "@/components/MissionSection";
import { MockTestsSection } from "@/components/MockTestsSection";
import { CoursesBooksSection } from "@/components/CoursesBooksSection";
import { PreviousPapersSection } from "@/components/PreviousPapersSection";
import { NavDropdown } from "@/components/NavDropdown";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { WeeklyScheduleSection } from "@/components/WeeklyScheduleSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { FAQSection } from "@/components/FAQSection";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <section
        className="page-bg-video relative h-screen w-full overflow-hidden"
        aria-hidden="true"
      >
        <video autoPlay muted loop playsInline className="page-bg-video-media">
          <source
            src="https://videos.pexels.com/video-files/5198158/5198158-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="page-bg-video-overlay" />
      </section>

      <div className="page-content-layer">
        {/* Full-width Admission Banner */}
        <div
          style={{
            position: "relative",
            zIndex: 50,
            width: "100%",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            padding: "12px 24px",
          }}
        >
          <div
            className="top-admission-banner"
            role="status"
            aria-live="polite"
            style={{ margin: 0, textAlign: "center" }}
          >
            <p className="top-admission-text" style={{ margin: 0 }}>
              Admission opened for June 2026 NET Exam.{" "}
              <a href="#contact">Apply here</a>
            </p>
          </div>
        </div>

        {/* Navigation Bar */}
        <div
          style={{
            position: "relative",
            zIndex: 50,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Center: Navigation Links */}
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {content.navItems.map((item) => (
              <NavDropdown
                key={item.href}
                label={item.label}
                href={item.href}
                submenu={item.submenu}
                isActive={item.href === "#home"}
                isLive={item.href === "#live-class"}
                openInNewTab={item.href === "/achievers"}
                openSubmenuInNewTab={item.label === "Online Courses"}
              />
            ))}
          </nav>

          {/* Right: Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <a
              href="tel:+919876543210"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "1px solid #9333ea",
                color: "#9333ea",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              <Phone size={16} />
              Contact
            </a>

            <a
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "#9333ea",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Login
            </a>
          </div>
        </div>

        {/* Header with Logo */}
        <header
          className="site-header"
          style={{
            position: "relative",
            zIndex: 10,
            background: "transparent",
            backdropFilter: "none",
            paddingTop: 24,
          }}
        >
          <div
            className="header-top-row"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              position: "relative",
            }}
          >
            <div
              className="header-brand-block"
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 8,
                fontWeight: 900,
                letterSpacing: ".2px",
              }}
            >
              <Image
                src="/logo_vectorformat.png"
                alt="LePearl logo"
                className="header-brand-logo scale-125 origin-top-left -translate-x-[40px] -translate-y-[28px] -ml-3 -mt-3"
                width={220}
                height={220}
                style={{
                  borderRadius: 0,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  boxShadow: "none",
                  filter: "none",
                  objectFit: "contain",
                }}
              />

              <div className="header-brand-copy">
                <h1 className="text-left mb-1 leading-none">
                  <span className="block text-xl md:text-2xl font-serif tracking-tight bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
                    LePearl Education
                  </span>
                </h1>
                <p className="text-left text-[11px] md:text-sm text-purple-700 tracking-wide font-medium">
                  Centre of Excellence in English Language &amp; Literature
                </p>
              </div>
            </div>
          </div>
        </header>

        <main id="home">
          <section className="hero-home-section">
            <HomeHeroCarousel />
          </section>

          <CoursesBooksSection />

          <PreviousPapersSection />

          <SuccessStoriesSection />

          <MissionSection />

          <section className="section alt2" id="achievers">
            <div
              id="founder"
              className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12"
            >
              <FounderContent />
            </div>
          </section>

          <section className="section">
            <FacultyCarousel />
          </section>

          <WhyChooseSection />

          <FounderBooks />

          <MockTestsSection />

          <LiveClassesPortalSection />

          <WeeklyScheduleSection />
        </main>
      </div>

      <FAQSection />

      <NeedHelpSection />

      <div className="footer-no-video">
        <SiteFooter />
      </div>
    </>
  );
}
