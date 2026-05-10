"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
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
  paperFiles?: string[];
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
      {
        name: "MPPSC",
        papersCount: 14,
        latestYear: "2024",
        paperFiles: ["MPPSC 2017 Paper.pdf", "MPPSC ENGLISH 2024.pdf"],
      },
      {
        name: "UPHESC",
        papersCount: 23,
        latestYear: "2025",
        paperFiles: [
          "English-master-Adv 51.pdf",
          "Question Paper English Adv 50.pdf",
          "Question Paper English Adv. 46.pdf",
          "Question Paper English Adv. 47.pdf",
          "uphesc Adv 51_english literature reexam paper.pdf",
        ],
      },
      {
        name: "UP GDC",
        papersCount: 16,
        latestYear: "2024",
        paperFiles: ["GDC English 2022.pdf"],
      },
    ],
  },
  {
    id: "nta-net",
    name: "NTA NET",
    subItems: [
      {
        name: "Paper I",
        papersCount: 24,
        latestYear: "2025",
        paperFiles: [
          "NET English 2023 Morning.pdf",
          "Eng_Jun 23_Morning Shift.pdf",
          "English Jun 2024.pdf",
        ],
      },
      {
        name: "Paper II",
        papersCount: 20,
        latestYear: "2025",
        paperFiles: [
          "NET English 2023 Afternoon.pdf",
          "A_N Shift_NTA JUNE 2024.pdf",
        ],
      },
    ],
  },
  {
    id: "teaching-exams",
    name: "Other Teaching Exams",
    subItems: [
      {
        name: "GIC",
        papersCount: 10,
        latestYear: "2024",
        paperFiles: [
          "UPPSC-GIC-English-Official-Paper-Held-On_-2017.pdf",
          "UPPSC-GIC-English-Official-Paper-Held-On_-2021.pdf",
        ],
      },
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
const REGISTRATION_UNLOCK_KEY = "lepearl-registration-submitted";

export function PreviousPapersSection() {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["assistant-professor"]),
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

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

  const buildPaperManifest = (categoryName: string, subItem: SubItem) => {
    const latestYear = Number.parseInt(subItem.latestYear, 10);
    const yearBuckets = Array.from(
      { length: subItem.papersCount },
      (_, index) => {
        if (Number.isNaN(latestYear)) {
          return subItem.latestYear;
        }
        return String(latestYear - Math.floor(index / 2));
      },
    );

    const lines = [
      "LePearl Education - Previous Year Question Papers",
      `Category: ${categoryName}`,
      `Exam: ${subItem.name}`,
      `Total Papers: ${subItem.papersCount}`,
      "",
      "Included Papers:",
      ...yearBuckets.map(
        (year, index) => `${index + 1}. ${subItem.name} PYQ - ${year}`,
      ),
    ];

    return lines.join("\n");
  };

  const handleDownload = async (
    categoryName: string,
    subItem: SubItem,
    selectedFile?: string,
  ) => {
    const actionKey = selectedFile
      ? `${categoryName}-${subItem.name}-${selectedFile}`
      : `${categoryName}-${subItem.name}`;
    setDownloadingKey(actionKey);
    setDownloadMessage(null);

    try {
      const formRegistrationSubmitted =
        window.localStorage.getItem(REGISTRATION_UNLOCK_KEY) !== null;

      if (!formRegistrationSubmitted) {
        const supabase = createClient("student");
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setDownloadMessage({
            type: "err",
            text: "Please complete student registration to download question papers.",
          });
          router.push("/student-registration");
          return;
        }

        const [{ data: profileRow }, { data: studentProfileRow }] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("registration_no")
              .eq("user_id", user.id)
              .maybeSingle(),
            supabase
              .from("student_profiles")
              .select("registration_no")
              .eq("user_id", user.id)
              .maybeSingle(),
          ]);

        const registrationNo =
          profileRow?.registration_no ??
          studentProfileRow?.registration_no ??
          null;

        if (!registrationNo) {
          setDownloadMessage({
            type: "err",
            text: "Student registration is required before downloading papers.",
          });
          router.push("/student-registration");
          return;
        }
      }

      const filesToDownload = selectedFile
        ? [selectedFile]
        : (subItem.paperFiles ?? []);

      if (filesToDownload.length > 0) {
        filesToDownload.forEach((fileName) => {
          const anchor = document.createElement("a");
          anchor.href = encodeURI(`/${fileName}`);
          anchor.download = fileName;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        });

        setDownloadMessage({
          type: "ok",
          text: selectedFile
            ? `Download started for ${selectedFile}.`
            : `Download started for ${subItem.name} papers.`,
        });
        window.setTimeout(() => {
          setDownloadMessage(null);
        }, 3000);
        return;
      }

      const content = buildPaperManifest(categoryName, subItem);
      const fileBlob = new Blob([content], {
        type: "text/plain;charset=utf-8",
      });
      const blobUrl = window.URL.createObjectURL(fileBlob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${subItem.name.replace(/\s+/g, "-").toLowerCase()}-previous-year-papers.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(blobUrl);

      setDownloadMessage({
        type: "ok",
        text: `Download started for ${subItem.name}.`,
      });
      window.setTimeout(() => {
        setDownloadMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to process paper download:", error);
      setDownloadMessage({
        type: "err",
        text: "Unable to download papers right now. Please try again.",
      });
      window.setTimeout(() => {
        setDownloadMessage(null);
      }, 5000);
    } finally {
      setDownloadingKey(null);
    }
  };

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

              {downloadMessage && (
                <div
                  className="mb-4 rounded-lg border px-4 py-3 text-sm"
                  style={{
                    borderColor:
                      downloadMessage.type === "ok" ? "#22C55E" : "#EF4444",
                    backgroundColor:
                      downloadMessage.type === "ok" ? "#F0FDF4" : "#FEF2F2",
                    color:
                      downloadMessage.type === "ok" ? "#166534" : "#991B1B",
                  }}
                >
                  {downloadMessage.text}
                </div>
              )}

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
                                    {subItem.paperFiles &&
                                      subItem.paperFiles.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {subItem.paperFiles.map(
                                            (fileName) => (
                                              <button
                                                key={fileName}
                                                type="button"
                                                onClick={() =>
                                                  void handleDownload(
                                                    category.name,
                                                    subItem,
                                                    fileName,
                                                  )
                                                }
                                                disabled={
                                                  downloadingKey ===
                                                  `${category.name}-${subItem.name}-${fileName}`
                                                }
                                                className="rounded-md border border-[#D8B4FE] bg-white px-2 py-1 text-xs text-[#5B21B6] transition-colors hover:bg-[#F3E8FF]"
                                              >
                                                {downloadingKey ===
                                                `${category.name}-${subItem.name}-${fileName}`
                                                  ? "Checking..."
                                                  : fileName}
                                              </button>
                                            ),
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="flex gap-2 sm:ml-auto">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleDownload(
                                        category.name,
                                        subItem,
                                      )
                                    }
                                    disabled={
                                      downloadingKey ===
                                      `${category.name}-${subItem.name}`
                                    }
                                    className="flex items-center gap-2 rounded-lg bg-[#6A0DAD] px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span>
                                      {downloadingKey ===
                                      `${category.name}-${subItem.name}`
                                        ? "Checking..."
                                        : subItem.paperFiles?.length
                                          ? "Download All"
                                          : "Download"}
                                    </span>
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
