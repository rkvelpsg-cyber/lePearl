"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import book1 from "../../public/book1.jpeg";
import book2 from "../../public/book2.jpeg";
import book3 from "../../public/book3.jpeg";
import book4 from "../../public/book4.jpeg";
import {
  Award,
  Book,
  BookOpen,
  Check,
  FlaskConical,
  GraduationCap,
  Landmark,
  Mic,
  PenTool,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type CourseCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  border: string;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  Icon: typeof BookOpen;
  href: string;
};

type OrbitCard =
  | { id: string; kind: "course"; course: CourseCard }
  | { id: "interview"; kind: "interview" }
  | { id: "books"; kind: "books" }
  | { id: "net-achievers"; kind: "net-achievers" }
  | { id: "assistant-prof-achievers"; kind: "assistant-prof-achievers" };

const courseCards: CourseCard[] = [
  {
    id: "nta-net-paper-1",
    title: "NTA NET Paper 1",
    subtitle: "Teaching & Research Aptitude",
    description:
      "Master the fundamentals of teaching, research methodology, logical reasoning, and higher education with our comprehensive curriculum.",
    points: [
      "Expert-led Live Classes",
      "5000+ Practice Questions",
      "Monthly Mock Tests",
      "Personalized Mentoring",
    ],
    border: "rgba(59,130,246,0.2)",
    iconColor: "#60A5FA",
    iconBg:
      "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(59,130,246,0.05))",
    iconBorder: "1px solid rgba(59,130,246,0.3)",
    Icon: BookOpen,
    href: "/courses-net-paper1",
  },
  {
    id: "nta-net-paper-2",
    title: "NTA NET Paper 2",
    subtitle: "English Literature & Language",
    description:
      "Deep dive into English literature, language theory, critical analysis, and specialized knowledge required for NET Paper 2 (English).",
    points: [
      "Literature & Language Units",
      "Critical Analysis Sessions",
      "Essay Writing Workshops",
      "Answer Writing Practice",
    ],
    border: "rgba(168,85,247,0.2)",
    iconColor: "#A855F7",
    iconBg:
      "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(168,85,247,0.05))",
    iconBorder: "1px solid rgba(168,85,247,0.3)",
    Icon: PenTool,
    href: "/courses-net-paper2",
  },
  {
    id: "mppsc",
    title: "MPPSC",
    subtitle: "Madhya Pradesh Public Service",
    description:
      "Complete preparation for MPPSC Prelims & Mains with focus on MPSC-specific questions, current affairs, and state-level policies.",
    points: [
      "Prelims & Mains Strategy",
      "MP GK & Current Affairs",
      "Interview Coaching",
      "Doubt Resolution Forums",
    ],
    border: "rgba(34,197,94,0.2)",
    iconColor: "#22C55E",
    iconBg: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(34,197,94,0.05))",
    iconBorder: "1px solid rgba(34,197,94,0.3)",
    Icon: Landmark,
    href: "/courses-mppsc",
  },
  {
    id: "up-teaching-exams",
    title: "UP Teaching Exams",
    subtitle: "UPHESC, GDC, GIC & LT Grade",
    description:
      "Specialized coaching for UP higher education and teaching recruitment exams with subject-specific and general knowledge modules.",
    points: [
      "Subject Mastery Programs",
      "UP GK Specialization",
      "Previous Year Papers",
      "Rapid Revision Modules",
    ],
    border: "rgba(251,146,60,0.2)",
    iconColor: "#FB923C",
    iconBg:
      "linear-gradient(135deg,rgba(251,146,60,0.2),rgba(251,146,60,0.05))",
    iconBorder: "1px solid rgba(251,146,60,0.3)",
    Icon: GraduationCap,
    href: "/courses-uphesc",
  },
  {
    id: "set-and-interview",
    title: "SET & Interview",
    subtitle: "State Eligibility Test & Interviews",
    description:
      "Comprehensive preparation for State-level teaching eligibility tests and expert interview coaching for civil services and academic positions.",
    points: [
      "SET Exam Coaching",
      "Mock Interview Sessions",
      "Personality Development",
      "Communication Skills",
    ],
    border: "rgba(236,72,153,0.2)",
    iconColor: "#EC4899",
    iconBg:
      "linear-gradient(135deg,rgba(236,72,153,0.2),rgba(236,72,153,0.05))",
    iconBorder: "1px solid rgba(236,72,153,0.3)",
    Icon: Award,
    href: "/courses-set",
  },
  {
    id: "phd-research",
    title: "Ph.D Research",
    subtitle: "Thesis Guidance & Publication",
    description:
      "Expert guidance for Ph.D candidates including research methodology, thesis writing, publication strategy, and conference presentations.",
    points: [
      "Research Methodology",
      "Thesis Writing Coaching",
      "Publication Strategy",
      "Conference Presentations",
    ],
    border: "rgba(212,175,55,0.3)",
    iconColor: "#D4AF37",
    iconBg:
      "linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.05))",
    iconBorder: "1px solid rgba(212,175,55,0.3)",
    Icon: FlaskConical,
    href: "/research-assistance",
  },
];

const netAchieverThumbs = [
  { src: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg", name: "Nidhi Shukla" },
  { src: "/Alvina%20Parveen.jpeg", name: "Ms Alvina Parveen" },
  { src: "/Richa%20Singh_NET_Dec_2026.jpeg", name: "Richa Singh" },
  { src: "/Kanika%20Sharma.jpeg", name: "Ms Kanika Sharma" },
  { src: "/Abhishesh%20Verma.jpeg", name: "Mr Abhishesh Verma" },
];

const assistantProfessorThumbs = [
  {
    src: "/Soumya%20Panigrahi,%20Lecturer,%20Odisha%20Public%20Service%20Commission-2025.jpeg",
    name: "Soumya Panigrahi",
  },
  { src: "/babil_faculty2.jpeg", name: "Dr. Babli Mallick" },
  { src: "/Shubham%20Singh.jpeg", name: "Mr Shubham Singh" },
  { src: "/Asit%20Kumar%20Mohanty.jpeg", name: "Asit Kumar Mohanty" },
  { src: "/Vishal%20Damahe.jpeg", name: "Mr. Vishal Damahe" },
];

function AchieversShowcaseCard({
  title,
  subtitle,
  accentColor,
  thumbs,
}: {
  title: string;
  subtitle: string;
  accentColor: string;
  thumbs: { src: string; name: string }[];
}) {
  return (
    <div
      className="rounded-2xl p-7"
      style={{
        background:
          "linear-gradient(135deg, rgba(109,40,217,0.84) 0%, rgba(99,102,241,0.78) 100%)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 20px 50px rgba(76,29,149,0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
        height: 450,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}14)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${accentColor}55`,
          marginBottom: "1rem",
        }}
      >
        <Award style={{ width: 24, height: 24, color: accentColor }} />
      </div>

      <h3
        style={{
          fontFamily: "Playfair Display, serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "#FFFFFF",
          marginBottom: "0.45rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.78rem",
          color: accentColor,
          fontWeight: 600,
          marginBottom: "0.9rem",
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "0.4rem",
        }}
      >
        {thumbs.map((thumb) => (
          <div key={thumb.name} className="text-center">
            <div
              style={{
                width: "100%",
                height: 84,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.25)",
                marginBottom: "0.25rem",
                position: "relative",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={thumb.src}
                alt={thumb.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="96px"
              />
            </div>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.62rem",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={thumb.name}
            >
              {thumb.name}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
        <Link
          href="/achievers"
          className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}16)`,
            border: `1px solid ${accentColor}55`,
            color: accentColor,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          View All Achievers →
        </Link>
      </div>
    </div>
  );
}

function NtaNetAchieversCard() {
  return (
    <AchieversShowcaseCard
      title="NTA NET Achievers 2026"
      subtitle="Top Selections in NET English"
      accentColor="#F59E0B"
      thumbs={netAchieverThumbs}
    />
  );
}

function AssistantProfessorAchieversCard() {
  return (
    <AchieversShowcaseCard
      title="Assistant Professor Achievers 2026"
      subtitle="Scholars Secured Lecturer Positions"
      accentColor="#22D3EE"
      thumbs={assistantProfessorThumbs}
    />
  );
}

function CourseProgramCard({ course }: { course: CourseCard }) {
  return (
    <div
      className="rounded-2xl p-7"
      style={{
        background:
          "linear-gradient(135deg, rgba(109,40,217,0.84) 0%, rgba(99,102,241,0.78) 100%)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 20px 50px rgba(76,29,149,0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
        height: 450,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background: course.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: course.iconBorder,
          marginBottom: "1.2rem",
        }}
      >
        <course.Icon
          style={{ width: 26, height: 26, color: course.iconColor }}
        />
      </div>

      <h3
        style={{
          fontFamily: "Playfair Display, serif",
          fontWeight: 700,
          fontSize: "1.35rem",
          color: "#FFFFFF",
          marginBottom: "0.5rem",
        }}
      >
        {course.title}
      </h3>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.8rem",
          color: course.iconColor,
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        {course.subtitle}
      </p>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.6,
          marginBottom: "1.25rem",
        }}
      >
        {course.description}
      </p>

      <ul className="mb-5 space-y-2">
        {course.points.map((point) => (
          <li
            key={point}
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Check style={{ width: 14, height: 14, color: course.iconColor }} />
            {point}
          </li>
        ))}
      </ul>

      {/* CTA button — pushes to the bottom via mt-auto */}
      <div style={{ marginTop: "auto" }}>
        <Link
          href={course.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${course.iconColor}33, ${course.iconColor}18)`,
            border: `1px solid ${course.iconColor}55`,
            color: course.iconColor,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Explore Course →
        </Link>
      </div>
    </div>
  );
}

function InterviewCard() {
  return (
    <div
      className="rounded-2xl p-7"
      style={{
        background:
          "linear-gradient(135deg, rgba(109,40,217,0.84) 0%, rgba(99,102,241,0.78) 100%)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 20px 50px rgba(76,29,149,0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
        height: 450,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background:
            "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(34,211,238,0.05))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(34,211,238,0.3)",
          marginBottom: "1.2rem",
        }}
      >
        <Mic style={{ width: 26, height: 26, color: "#22D3EE" }} />
      </div>

      <h3
        style={{
          fontFamily: "Playfair Display, serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "#FFFFFF",
          marginBottom: "0.5rem",
        }}
      >
        Interview Preparation
      </h3>
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.8rem",
          color: "#22D3EE",
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        Master Your Interview Skills
      </p>
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.6,
          marginBottom: "1rem",
        }}
      >
        Expert coaching for Assistant Professor, DU interviews, Ph.D vivas, and
        academic position interviews.
      </p>
      <ul className="space-y-2">
        {["Assistant Professor", "DU Interview", "Ph.D Interview"].map(
          (item) => (
            <li
              key={item}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Check style={{ width: 13, height: 13, color: "#22D3EE" }} />
              {item}
            </li>
          ),
        )}
      </ul>

      <div style={{ marginTop: "auto" }}>
        <Link
          href="/interview-preparation/assistant-professor-1"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          style={{
            background:
              "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(34,211,238,0.08))",
            border: "1px solid rgba(34,211,238,0.35)",
            color: "#22D3EE",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Prepare for Interview →
        </Link>
      </div>
    </div>
  );
}

function BooksCard() {
  return (
    <div
      className="rounded-2xl p-7"
      style={{
        background:
          "linear-gradient(135deg, rgba(109,40,217,0.84) 0%, rgba(99,102,241,0.78) 100%)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 20px 50px rgba(76,29,149,0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
        height: 450,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background:
            "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(251,191,36,0.3)",
          marginBottom: "1.2rem",
        }}
      >
        <Book style={{ width: 26, height: 26, color: "#FBB924" }} />
      </div>

      <h3
        style={{
          fontFamily: "Playfair Display, serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "#FFFFFF",
          marginBottom: "0.5rem",
        }}
      >
        Books by Dr. Prem Shankar Pandey
      </h3>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.8rem",
          color: "#FBB924",
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        Authored & Published
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { src: book1, title: "World Literature In Your Fist" },
          { src: book2, title: "Literary Theories and Criticism" },
          { src: book3, title: "Practice Workbook of English" },
          { src: book4, title: "Literature and Psychology" },
        ].map((book) => (
          <div key={book.title} className="text-center">
            <div
              style={{
                width: "100%",
                height: 76,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(251,191,36,0.25)",
                background: "rgba(15,12,41,0.35)",
                marginBottom: "0.2rem",
                position: "relative",
              }}
            >
              <Image
                src={book.src}
                alt={book.title}
                fill
                style={{ objectFit: "contain" }}
                sizes="120px"
              />
            </div>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={book.title}
            >
              {book.title}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
        <Link
          href="/#founder"
          className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          style={{
            background:
              "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.08))",
            border: "1px solid rgba(251,191,36,0.35)",
            color: "#FBB924",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Books by Our Founder →
        </Link>
      </div>
    </div>
  );
}

function renderOrbitCard(card: OrbitCard) {
  if (card.kind === "course") {
    return <CourseProgramCard course={card.course} />;
  }

  if (card.kind === "interview") {
    return <InterviewCard />;
  }

  if (card.kind === "net-achievers") {
    return <NtaNetAchieversCard />;
  }

  if (card.kind === "assistant-prof-achievers") {
    return <AssistantProfessorAchieversCard />;
  }

  return <BooksCard />;
}

function getWrappedDistance(index: number, active: number, total: number) {
  // Keep distance in the shortest circular direction for smooth infinite looping.
  let distance = index - active;
  const half = Math.floor(total / 2);

  if (distance > half) {
    distance -= total;
  }

  if (distance < -half) {
    distance += total;
  }

  return distance;
}

export function CoursesBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const touchStartX = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const orbitCards = useMemo<OrbitCard[]>(
    () => [
      { id: courseCards[0].id, kind: "course", course: courseCards[0] },
      { id: "net-achievers", kind: "net-achievers" },
      { id: courseCards[1].id, kind: "course", course: courseCards[1] },
      { id: courseCards[2].id, kind: "course", course: courseCards[2] },
      { id: "interview", kind: "interview" },
      { id: courseCards[3].id, kind: "course", course: courseCards[3] },
      { id: "assistant-prof-achievers", kind: "assistant-prof-achievers" },
      { id: courseCards[4].id, kind: "course", course: courseCards[4] },
      { id: courseCards[5].id, kind: "course", course: courseCards[5] },
      { id: "books", kind: "books" },
    ],
    [],
  );

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % orbitCards.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [isPaused, orbitCards.length]);

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % orbitCards.length);
  };

  const goPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + orbitCards.length) % orbitCards.length,
    );
  };

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

  const cardWidth = isMobile
    ? Math.min(Math.floor(viewportWidth * 0.86), 300)
    : isTablet
      ? 340
      : 520;
  // Wider spread so side cards don't overlap the enlarged centre card
  const orbitSpread = isMobile
    ? Math.max(140, Math.floor(cardWidth * 0.75))
    : isTablet
      ? 340
      : 560;
  // Stage = card height (450) * centre scale (1.4) = 630 + bottom curve offset (115) → round up
  const stageHeight = isMobile ? 820 : 780;

  return (
    <section
      id="courses"
      className="relative overflow-x-hidden overflow-y-visible border-y px-4 pt-6 pb-24 md:px-12 md:pt-8 md:pb-32 lg:px-20"
      style={{
        borderColor: "rgba(168,85,247,0.22)",
        background:
          "linear-gradient(135deg, #f8f5ff 0%, #f3e8ff 40%, #fde2ff 100%)",
      }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="purpleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#f5d0fe" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="purpleGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.14" />
          </linearGradient>
          <pattern
            id="bookPattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <g opacity="0.08">
              <rect
                x="30"
                y="40"
                width="30"
                height="50"
                fill="#c4b5fd"
                rx="2"
              />
              <line
                x1="32"
                y1="50"
                x2="58"
                y2="50"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
              <line
                x1="32"
                y1="60"
                x2="58"
                y2="60"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
              <line
                x1="32"
                y1="70"
                x2="58"
                y2="70"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
              <rect
                x="100"
                y="35"
                width="28"
                height="55"
                fill="#c4b5fd"
                rx="2"
              />
              <line
                x1="102"
                y1="48"
                x2="126"
                y2="48"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
              <line
                x1="102"
                y1="60"
                x2="126"
                y2="60"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
              <line
                x1="102"
                y1="72"
                x2="126"
                y2="72"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
            </g>
          </pattern>
          <pattern
            id="penPattern"
            x="0"
            y="0"
            width="250"
            height="250"
            patternUnits="userSpaceOnUse"
          >
            <g opacity="0.06">
              <path
                d="M 50 150 Q 70 50 120 100"
                stroke="#d8b4fe"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="50" cy="150" r="8" fill="#d8b4fe" />
            </g>
          </pattern>
        </defs>
        <rect width="1400" height="900" fill="#fdfbff" />
        <rect width="1400" height="900" fill="url(#purpleGrad1)" />
        <rect width="1400" height="900" fill="url(#purpleGrad2)" />
        <rect width="1400" height="900" fill="url(#bookPattern)" />
        <rect width="1400" height="900" fill="url(#penPattern)" />
        <circle cx="100" cy="150" r="120" fill="#c4b5fd" opacity="0.16" />
        <circle cx="1200" cy="700" r="180" fill="#f9a8d4" opacity="0.14" />
        <circle cx="700" cy="0" r="100" fill="#ddd6fe" opacity="0.2" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.75rem",
              color: "#7c3aed",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "1rem",
            }}
          >
            Our Programs
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 800,
              fontSize: "clamp(2rem,4vw,3rem)",
              color: "#221b4a",
              marginBottom: "1rem",
            }}
          >
            Comprehensive Exam Coaching
          </h2>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
              color: "rgba(49,46,129,0.72)",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            LePearl Education offers expertly designed programs for competitive
            exams with personalized mentorship, strategic study materials, and
            proven preparation methodology.
          </p>
        </div>

        <div
          className="relative"
          style={{
            height: stageHeight,
            perspective: 1300,
            transformStyle: "preserve-3d",
            cursor: "grab",
            userSelect: "none",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onPointerDown={(event) => {
            pointerStartX.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (pointerStartX.current === null) {
              return;
            }

            const deltaX = event.clientX - pointerStartX.current;

            if (Math.abs(deltaX) > 50) {
              if (deltaX < 0) {
                goNext();
              } else {
                goPrev();
              }
            }

            pointerStartX.current = null;
          }}
          onPointerCancel={() => {
            pointerStartX.current = null;
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) {
              return;
            }

            const touchEndX =
              event.changedTouches[0]?.clientX ?? touchStartX.current;
            const deltaX = touchEndX - touchStartX.current;

            if (Math.abs(deltaX) > 40) {
              if (deltaX < 0) {
                goNext();
              } else {
                goPrev();
              }
            }

            touchStartX.current = null;
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "44%",
              width: "min(74vw, 920px)",
              height: "min(50vw, 520px)",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(ellipse at center, rgba(168,85,247,0.14) 0%, rgba(244,114,182,0.1) 45%, rgba(255,255,255,0) 82%)",
              filter: "blur(120px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <button
            type="button"
            aria-label="Show previous card"
            onClick={goPrev}
            className="absolute left-1 top-1/2 z-[130] -translate-y-1/2 rounded-full border px-2 py-2 transition-all duration-300 hover:scale-105 sm:left-2 sm:px-3"
            style={{
              background: "rgba(76,29,149,0.72)",
              borderColor: "rgba(255,255,255,0.28)",
              color: "#ffffff",
              backdropFilter: "blur(10px)",
            }}
          >
            <ChevronLeft style={{ width: 18, height: 18 }} />
          </button>

          <button
            type="button"
            aria-label="Show next card"
            onClick={goNext}
            className="absolute right-1 top-1/2 z-[130] -translate-y-1/2 rounded-full border px-2 py-2 transition-all duration-300 hover:scale-105 sm:right-2 sm:px-3"
            style={{
              background: "rgba(76,29,149,0.72)",
              borderColor: "rgba(255,255,255,0.28)",
              color: "#ffffff",
              backdropFilter: "blur(10px)",
            }}
          >
            <ChevronRight style={{ width: 18, height: 18 }} />
          </button>

          {orbitCards.map((card, index) => {
            const distance = getWrappedDistance(
              index,
              activeIndex,
              orbitCards.length,
            );
            const absDistance = Math.abs(distance);

            // Parabolic orbit: centre card is dramatically larger and elevated;
            // cards scale down and drop lower as they move away from centre.
            const scale =
              absDistance === 0
                ? 1.4 // centre — prominent & large
                : absDistance === 1
                  ? 0.88 // immediate neighbours — noticeably smaller
                  : absDistance === 2
                    ? 0.72 // further away — small
                    : 0.6; // far edge — smallest
            const translateY =
              absDistance === 0
                ? 0 // centre sits at the top of the stage
                : absDistance === 1
                  ? 60 // curve downward
                  : absDistance === 2
                    ? 95
                    : 115;
            const opacity =
              absDistance === 0
                ? 1
                : absDistance === 1
                  ? 0.8
                  : absDistance === 2
                    ? 0.58
                    : 0.38;
            const zIndex = 100 - absDistance * 10;
            const rotateY = distance * -7;
            const isHiddenOnMobile = isMobile && absDistance > 1;

            return (
              <motion.div
                key={card.id}
                // Anchor card at the very top of the stage; orbit y values push cards downward from there
                className="absolute left-1/2 top-0"
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest("a,button")) {
                    return;
                  }

                  if (absDistance !== 0) {
                    setActiveIndex(index);
                  }
                }}
                initial={false}
                animate={{
                  x: distance * orbitSpread,
                  y: translateY,
                  scale,
                  opacity: isHiddenOnMobile ? 0 : opacity,
                  zIndex,
                  rotateY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 0.8,
                }}
                style={{
                  width: cardWidth,
                  marginLeft: -(cardWidth / 2),
                  pointerEvents: isHiddenOnMobile ? "none" : "auto",
                  transformStyle: "preserve-3d",
                }}
              >
                {renderOrbitCard(card)}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
