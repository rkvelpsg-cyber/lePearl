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
        <div className="top-admission-banner" role="status" aria-live="polite">
          <p className="top-admission-text">
            Admission opened for June 2026 NET Exam.{" "}
            <a href="#contact">Apply here</a>
          </p>
        </div>

        <header
          className="site-header"
          style={{
            position: "relative",
            zIndex: 10,
            background: "transparent",
            backdropFilter: "none",
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

            <div
              className="header-action-wrap"
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                position: "absolute",
                top: 28,
                right: 36,
                zIndex: 60,
              }}
            >
              <a
                className="btn cool header-action-btn"
                href="#contact"
                style={{ marginRight: 8 }}
              >
                <Phone className="h-5 w-5 text-white" aria-hidden="true" />
                <span className="sr-only">Contact us</span>
              </a>
              <a className="btn primary header-action-btn" href="/admin">
                Login
              </a>
            </div>
          </div>

          <div className="container">
            <div
              className="header-nav-wrap"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                flexWrap: "wrap",
                width: "100%",
                padding: "0 0 12px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <nav
                aria-label="Primary"
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {content.navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`header-nav-link ${item.href === "#home" ? "is-active" : ""} ${item.href === "#live-class" ? "is-live" : ""}`}
                    style={{
                      fontSize: 15,
                      fontWeight: 650,
                      color: "var(--text)",
                      padding: "10px 14px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,.72)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 4px 14px rgba(0,0,0,.06)",
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
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
