"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

const COLORS = {
  purple: "#6A0DAD",
  blue: "#1E3A8A",
  white: "#FFFFFF",
  lavender: "#F5F3FF",
  gray: "#E5E7EB",
  textGray: "#4B5563",
  lightGray: "#9CA3AF",
};

interface SubItem {
  name: string;
  papersCount: number;
  latestYear: string;
}

interface Category {
  id: string;
  name: string;
  subItems: SubItem[];
}

const categories: Category[] = [
  {
    id: "assistant-professor",
    name: "Assistant Professor",
    subItems: [
      { name: "MPPSC", papersCount: 12, latestYear: "2025" },
      { name: "UPHESC", papersCount: 18, latestYear: "2025" },
      { name: "UP GDC", papersCount: 15, latestYear: "2024" },
    ],
  },
  {
    id: "nta-net",
    name: "NTA NET",
    subItems: [
      { name: "Paper I", papersCount: 24, latestYear: "2025" },
      { name: "Paper II", papersCount: 20, latestYear: "2025" },
    ],
  },
  {
    id: "teaching-exams",
    name: "Other Teaching Exams",
    subItems: [
      { name: "GIC", papersCount: 10, latestYear: "2024" },
      { name: "LT Grade", papersCount: 14, latestYear: "2025" },
    ],
  },
  {
    id: "interview-prep",
    name: "Interview Preparation",
    subItems: [
      { name: "Communication Skills", papersCount: 8, latestYear: "2026" },
    ],
  },
  {
    id: "set",
    name: "SET",
    subItems: [{ name: "SET Papers", papersCount: 16, latestYear: "2025" }],
  },
];

const filterChips = ["NET", "SET", "Assistant Professor", "Teaching Exams"];

export function PreviousPapersSection() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["assistant-professor"]),
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return categories
      .map((category) => {
        const byFilter =
          !activeFilter ||
          category.name.toLowerCase().includes(activeFilter.toLowerCase()) ||
          category.subItems.some((s) =>
            s.name.toLowerCase().includes(activeFilter.toLowerCase()),
          );

        const subItems = category.subItems.filter((sub) => {
          if (!query) {
            return true;
          }
          return (
            category.name.toLowerCase().includes(query) ||
            sub.name.toLowerCase().includes(query) ||
            sub.latestYear.includes(query)
          );
        });

        return byFilter ? { ...category, subItems } : null;
      })
      .filter((category): category is Category => !!category)
      .filter((category) => category.subItems.length > 0);
  }, [activeFilter, searchQuery]);

  return (
    <section id="pyqs" className="min-h-screen bg-[#F5F3FF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
          >
            <Archive className="h-4 w-4" />
            <span className="text-sm">Exam Resource Library</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div
              className="rounded-2xl border bg-white p-8 shadow-lg"
              style={{
                borderColor: COLORS.gray,
                backgroundColor: COLORS.white,
              }}
            >
              <div className="mb-6 flex items-center justify-center">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full"
                  style={{ backgroundColor: COLORS.lavender }}
                >
                  <BookOpen className="h-12 w-12 text-[#6A0DAD]" />
                </div>
              </div>
              <h3 className="mb-4 text-center text-xl text-[#1E3A8A]">
                Your Complete Exam Archive
              </h3>
              <p className="mb-6 text-center text-[#4B5563]">
                Browse through our comprehensive collection of previous year
                papers organized by exam categories and subjects.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: COLORS.lavender }}
                  >
                    <FileText className="h-4 w-4 text-[#6A0DAD]" />
                  </div>
                  <span>100+ Papers Available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: COLORS.lavender }}
                  >
                    <GraduationCap className="h-4 w-4 text-[#6A0DAD]" />
                  </div>
                  <span>All Major Exams Covered</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: COLORS.lavender }}
                  >
                    <Download className="h-4 w-4 text-[#6A0DAD]" />
                  </div>
                  <span>Instant PDF Download</span>
                </div>
              </div>
            </div>

            <div
              className="mt-6 rounded-2xl p-6 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6A0DAD 0%, #1E3A8A 100%)",
                color: COLORS.white,
              }}
            >
              <Sparkles className="mb-4 h-8 w-8" />
              <h4 className="mb-2 text-lg">
                Prepare Better with Real Exam Papers
              </h4>
              <p className="mb-4 text-sm text-white/90">
                Practice with previous year papers to understand exam trends,
                question patterns, and important topics.
              </p>
              <button
                type="button"
                className="w-full rounded-lg px-6 py-3 transition-transform hover:scale-105"
                style={{ backgroundColor: COLORS.white, color: COLORS.purple }}
              >
                Explore All Papers
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div
              className="rounded-2xl border bg-white p-6 shadow-lg"
              style={{
                borderColor: COLORS.gray,
                backgroundColor: COLORS.white,
              }}
            >
              <h3 className="mb-6 text-xl text-[#1E3A8A]">
                Browse by Category
              </h3>

              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const isExpanded = expandedCategories.has(category.id);

                  return (
                    <div
                      key={category.id}
                      className="overflow-hidden rounded-xl border"
                      style={{ borderColor: COLORS.gray }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="w-full p-5 transition-colors hover:bg-[#F9FAFB]"
                        style={{
                          backgroundColor: COLORS.white,
                          cursor: "pointer",
                        }}
                      >
                        <span className="flex items-center justify-between">
                          <span className="flex items-center gap-3">
                            <span
                              className="flex h-10 w-10 items-center justify-center rounded-lg"
                              style={{ backgroundColor: COLORS.lavender }}
                            >
                              <FileText
                                className="h-5 w-5"
                                style={{ color: COLORS.purple }}
                              />
                            </span>
                            <span className="text-[#1E3A8A]">
                              {category.name}
                            </span>
                          </span>

                          {isExpanded ? (
                            <ChevronDown
                              className="h-5 w-5"
                              style={{ color: COLORS.lightGray }}
                            />
                          ) : (
                            <ChevronRight
                              className="h-5 w-5"
                              style={{ color: COLORS.lightGray }}
                            />
                          )}
                        </span>
                      </button>

                      {isExpanded && (
                        <div
                          className="border-t"
                          style={{
                            borderColor: COLORS.gray,
                            backgroundColor: COLORS.lavender,
                          }}
                        >
                          {category.subItems.map((subItem, index) => (
                            <div
                              key={`${subItem.name}-${subItem.latestYear}`}
                              className="px-5 py-4 transition-colors hover:bg-white/50"
                              style={{
                                borderBottom:
                                  index < category.subItems.length - 1
                                    ? `1px solid ${COLORS.gray}`
                                    : "none",
                              }}
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText
                                    className="h-5 w-5 flex-shrink-0"
                                    style={{ color: COLORS.purple }}
                                  />
                                  <div>
                                    <p className="text-[#1E3A8A]">
                                      {subItem.name}
                                    </p>
                                    <p className="text-sm text-[#4B5563]">
                                      {subItem.papersCount} Papers Available -
                                      Latest: {subItem.latestYear}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 sm:ml-auto">
                                  <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-white"
                                    style={{
                                      borderColor: COLORS.purple,
                                      color: COLORS.purple,
                                      backgroundColor: "transparent",
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg bg-[#6A0DAD] px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredCategories.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#E5E7EB] p-6 text-center text-[#6B7280]">
                    No papers found for your current search/filter.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
