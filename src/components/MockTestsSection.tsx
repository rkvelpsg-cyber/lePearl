"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Mic,
  School,
  type LucideIcon,
} from "lucide-react";

interface MockTestCategory {
  id: number;
  icon: LucideIcon;
  title: string;
  tests: string[];
  duration: string;
  buttonText: string;
  loginUrl?: string;
}

interface MockTestCardProps {
  category: MockTestCategory;
}

function MockTestCard({ category }: MockTestCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = category.icon;

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? "0 12px 35px rgba(106, 13, 173, 0.15)"
          : "0 8px 25px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 right-0 top-0 h-1 bg-[#6A0DAD]" />

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div
            className="rounded-xl p-3 transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "#6A0DAD" : "#F3F0FF",
              transform: isHovered
                ? "rotate(-5deg) scale(1.1)"
                : "rotate(0) scale(1)",
            }}
          >
            <Icon
              className="h-8 w-8"
              style={{ color: isHovered ? "#FFFFFF" : "#6A0DAD" }}
            />
          </div>
        </div>

        <h3 className="mb-3 text-xl font-semibold leading-[1.4] text-[#1E3A8A]">
          {category.title}
        </h3>

        <div className="mb-4 flex flex-wrap gap-2">
          {category.tests.map((test) => (
            <span
              key={test}
              className="rounded-lg px-3 py-1 text-sm font-medium"
              style={{ backgroundColor: "#F3F0FF", color: "#6A0DAD" }}
            >
              {test}
            </span>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#6B7280]" />
          <span className="text-sm text-[#6B7280]">
            Duration: {category.duration}
          </span>
        </div>

        <div className="my-4 h-px bg-[#E5E7EB]" />

        {category.loginUrl ? (
          <a
            href={category.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl py-3 text-center font-semibold transition-all duration-300"
            style={{
              color: "#FFFFFF",
              backgroundColor: isHovered ? "#6A0DAD" : "#1E3A8A",
              boxShadow: isHovered
                ? "0 6px 20px rgba(106, 13, 173, 0.3)"
                : "0 4px 12px rgba(30, 58, 138, 0.2)",
            }}
          >
            {category.buttonText}
          </a>
        ) : (
          <button
            type="button"
            className="w-full rounded-xl py-3 font-semibold text-white transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "#6A0DAD" : "#1E3A8A",
              boxShadow: isHovered
                ? "0 6px 20px rgba(106, 13, 173, 0.3)"
                : "0 4px 12px rgba(30, 58, 138, 0.2)",
            }}
          >
            {category.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export function MockTestsSection() {
  const mockTestCategories: MockTestCategory[] = [
    {
      id: 1,
      icon: GraduationCap,
      title: "Assistant Professor Exams",
      tests: ["MPPSC", "UPHESC", "UP GDC"],
      duration: "180 min",
      buttonText: "Start Mock Test",
      loginUrl: "/login-portal",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "NTA NET",
      tests: ["Paper I", "Paper II"],
      duration: "180 min",
      buttonText: "Start Mock Test",
      loginUrl: "/login-portal",
    },
    {
      id: 3,
      icon: School,
      title: "Other Teaching Exams",
      tests: ["GIC", "LT Grade"],
      duration: "120 min",
      buttonText: "Start Mock Test",
      loginUrl: "/login-portal",
    },
    {
      id: 4,
      icon: Mic,
      title: "Interview Preparation",
      tests: ["Communication Skills"],
      duration: "60 min",
      buttonText: "Practice Now",
      loginUrl: "/login-portal",
    },
    {
      id: 5,
      icon: FileText,
      title: "SET Examination",
      tests: ["SET Mock Test"],
      duration: "180 min",
      buttonText: "Start Mock Test",
      loginUrl: "/login-portal",
    },
  ];

  return (
    <section
      id="mock"
      className="min-h-screen py-12"
      style={{
        background:
          "linear-gradient(135deg, #0f3f8f 0%, #0e7490 52%, #0f766e 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.18)" }}
          >
            <span className="text-sm font-semibold text-white">
              Practice. Analyze. Improve.
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Ongoing Mock Tests
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-cyan-100">
            Test your preparation with real exam-pattern mock tests designed by
            experts.
          </p>
        </div>

        <div className="mb-12">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockTestCategories.slice(0, 3).map((category) => (
              <MockTestCard key={category.id} category={category} />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {mockTestCategories.slice(3, 5).map((category) => (
              <div
                key={category.id}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <MockTestCard category={category} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div
            className="rounded-2xl bg-white p-8"
            style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-[#6A0DAD]" />
              <h3 className="text-2xl font-semibold text-[#1E3A8A]">
                Prepare Smart with Expert-Designed Mock Tests
              </h3>
            </div>
            <p className="mb-6 text-[#6B7280]">
              Join thousands of students who have improved their scores with our
              comprehensive test series
            </p>
            <a
              href="/login-portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                backgroundColor: "#6A0DAD",
                boxShadow: "0 4px 15px rgba(106, 13, 173, 0.3)",
              }}
            >
              View All Tests
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
