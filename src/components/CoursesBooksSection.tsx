"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Slider, { type CustomArrowProps, type Settings } from "react-slick";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Mic,
  School,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import bookCover from "../../public/book1.jpeg";

interface Category {
  id: string;
  icon: LucideIcon;
  title: string;
  items: string[];
  button: string;
  color: string;
}

type SliderItem =
  | { kind: "category"; data: Category }
  | { kind: "featured-book" };

const categories: Category[] = [
  {
    id: "assistant-professor",
    icon: GraduationCap,
    title: "Assistant Professor",
    items: ["MPPSC", "UPHESC", "UP GDC"],
    button: "Explore Courses",
    color: "#6A0DAD",
  },
  {
    id: "nta-net",
    icon: BookOpen,
    title: "NTA NET",
    items: ["Paper I", "Paper II"],
    button: "Start Learning",
    color: "#1E3A8A",
  },
  {
    id: "other-exams",
    icon: School,
    title: "Other Teaching Exams",
    items: ["GIC", "LT Grade"],
    button: "View Materials",
    color: "#6A0DAD",
  },
  {
    id: "interview",
    icon: Mic,
    title: "Interview Preparation",
    items: ["Communication Skills"],
    button: "Improve Skills",
    color: "#1E3A8A",
  },
  {
    id: "set",
    icon: FileText,
    title: "SET Examination",
    items: ["SET Preparation"],
    button: "Start Preparation",
    color: "#6A0DAD",
  },
];

const filterOptions = [
  "NET",
  "Assistant Professor",
  "Teaching Exams",
  "Interview Preparation",
];

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#6A0DAD] shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Next"
    >
      <ChevronRight className="h-6 w-6 text-white" />
    </button>
  );
}

function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#6A0DAD] shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Previous"
    >
      <ChevronLeft className="h-6 w-6 text-white" />
    </button>
  );
}

function FeaturedBookCard({ cover }: { cover: StaticImageData }) {
  return (
    <div className="px-3">
      <div
        className="flex h-[380px] flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #6A0DAD 0%, #1E3A8A 100%)",
          boxShadow: "0 10px 30px rgba(106, 13, 173, 0.3)",
        }}
      >
        <div className="flex h-full flex-col text-white">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs opacity-90">Featured Book</span>
          </div>

          <h3 className="mb-1 text-lg">World Literature in Your Fist</h3>
          <p className="mb-3 text-xs opacity-90">by Dr Prem Shankar Pandey</p>

          <div className="mb-3 flex flex-grow items-center justify-center">
            <Image
              src={cover}
              alt="World Literature in Your Fist book cover"
              className="h-32 w-full object-contain"
            />
          </div>

          <div className="mt-auto space-y-2">
            <button
              type="button"
              className="w-full rounded-xl bg-white px-4 py-2.5 text-[#6A0DAD] transition-all duration-300 hover:shadow-md"
            >
              View Details
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-2.5 text-white transition-all duration-300 hover:shadow-md"
            >
              Buy / Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoursesBooksSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return categories.filter((category) => {
      const filterMatch =
        !activeFilter ||
        category.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
        category.items.some((item) =>
          item.toLowerCase().includes(activeFilter.toLowerCase()),
        );

      const searchMatch =
        !query ||
        category.title.toLowerCase().includes(query) ||
        category.items.some((item) => item.toLowerCase().includes(query));

      return filterMatch && searchMatch;
    });
  }, [activeFilter, searchQuery]);

  const sliderItems: SliderItem[] = [
    ...filtered.map((category) => ({
      kind: "category" as const,
      data: category,
    })),
    { kind: "featured-book" },
  ];

  const carouselSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section
      id="courses"
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, rgba(224, 242, 247, 0.38) 0%, rgba(240, 249, 255, 0.32) 50%, rgba(243, 240, 255, 0.38) 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-8 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-white"
            style={{ backgroundColor: "#6A0DAD" }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">LePearl Learning Resources</span>
          </div>
          <h2 className="mb-4 text-4xl text-[#1E3A8A] md:text-5xl">
            Courses &amp; Books
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-[#4B5563]">
            Explore expert-designed courses and study resources to prepare for
            NET, SET, Assistant Professor, and other teaching examinations.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search courses or books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-2 bg-white py-4 pl-12 pr-4 transition-all focus:outline-none"
              style={{
                borderColor: activeFilter ? "#6A0DAD" : "#E5E7EB",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            />
          </div>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() =>
                setActiveFilter(activeFilter === filter ? null : filter)
              }
              className="rounded-full px-5 py-2 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor:
                  activeFilter === filter ? "#6A0DAD" : "#FFFFFF",
                color: activeFilter === filter ? "#FFFFFF" : "#4B5563",
                border: `2px solid ${
                  activeFilter === filter ? "#6A0DAD" : "#E5E7EB"
                }`,
                boxShadow:
                  activeFilter === filter
                    ? "0 4px 12px rgba(106, 13, 173, 0.2)"
                    : "0 2px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative left-1/2 mb-12 w-screen -translate-x-1/2 px-6 sm:px-8 md:px-10 lg:px-14">
          <Slider {...carouselSettings}>
            {sliderItems.map((item) => {
              if (item.kind === "featured-book") {
                return (
                  <FeaturedBookCard key="featured-book" cover={bookCover} />
                );
              }

              const { data } = item;
              const Icon = data.icon;

              return (
                <div key={data.id} className="px-3">
                  <div
                    className="group flex h-[380px] cursor-pointer flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    style={{
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <div className="mb-4">
                      <div
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${data.color}15` }}
                      >
                        <Icon
                          className="h-7 w-7"
                          style={{ color: data.color }}
                        />
                      </div>
                      <h3 className="mb-3 text-xl text-[#1F2937]">
                        {data.title}
                      </h3>
                    </div>

                    <div className="mb-5 flex-grow">
                      <ul className="space-y-2">
                        {data.items.map((course) => (
                          <li
                            key={course}
                            className="flex items-center text-sm text-[#6B7280]"
                          >
                            <div
                              className="mr-2 h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto space-y-2">
                      <button
                        type="button"
                        className="w-full rounded-xl px-4 py-2.5 text-white transition-all duration-300 hover:shadow-md"
                        style={{ backgroundColor: data.color }}
                      >
                        {data.button}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}
