"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import sadhanaImg from "../../public/sadhana_faculty1.jpeg";
import babliImg from "../../public/DrBablick.png";
import neeluImg from "../../public/neelu_faculty3.jpeg";
import harendraImg from "../../public/harendra_faculty4.jpeg";

interface FacultyMember {
  id: number;
  name: string;
  image: StaticImageData;
  description: string;
}

const facultyData: FacultyMember[] = [
  {
    id: 1,
    name: "Ms. Sadhana",
    image: sadhanaImg,
    description: "NTA-NET, Faculty, LePearl Education",
  },
  {
    id: 2,
    name: "Dr. Babli Mallick",
    image: babliImg,
    description: "Assistant Professor, Faculty-LePearl Education",
  },
  {
    id: 3,
    name: "Ms. Neelu Patel",
    image: neeluImg,
    description: "NET-JRF, Assistant Professor, Faculty-LePearl Education",
  },
  {
    id: 4,
    name: "Dr. Harendra K Tripathi",
    image: harendraImg,
    description: "GS Expert, Faculty-LePearl Education",
  },
];

export function FacultyCarousel() {
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 767px)");
    if (!isMobile.matches) return;

    const firstSlide = container.querySelector(
      "[data-faculty-slide]",
    ) as HTMLDivElement | null;
    if (!firstSlide) return;

    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = firstSlide.getBoundingClientRect().width + gap;

    let userInteracting = false;
    const setInteracting = () => {
      userInteracting = true;
    };
    const clearInteracting = () => {
      userInteracting = false;
    };

    container.addEventListener("touchstart", setInteracting, {
      passive: true,
    });
    container.addEventListener("touchend", clearInteracting);

    const interval = window.setInterval(() => {
      if (userInteracting) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const nextLeft = container.scrollLeft + step;

      container.scrollTo({
        left: nextLeft >= maxScrollLeft - 2 ? 0 : nextLeft,
        behavior: "smooth",
      });
    }, 2800);

    return () => {
      window.clearInterval(interval);
      container.removeEventListener("touchstart", setInteracting);
      container.removeEventListener("touchend", clearInteracting);
    };
  }, []);

  return (
    <div
      className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-16"
      style={{ background: "rgba(255,255,255,0.60)" }}
    >
      <h2 className="text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
        Faculty Profile
      </h2>
      <div className="faculty-carousel-wrapper max-w-7xl mx-auto">
        <div
          ref={mobileScrollRef}
          className="hide-scrollbar flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scroll-smooth gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-0 pb-2"
        >
          {facultyData.map((faculty) => (
            <div
              key={faculty.id}
              data-faculty-slide
              className="snap-center shrink-0 min-w-full md:min-w-0"
            >
              <div className="faculty-card bg-white rounded-lg shadow-lg overflow-hidden w-full h-full flex flex-col transition-all duration-300 hover:shadow-2xl">
                <div className="faculty-image w-full overflow-hidden bg-gray-100 h-[220px] sm:h-[230px] md:h-[280px]">
                  <Image
                    src={faculty.image}
                    alt={faculty.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer faculty-photo faculty-photo-${faculty.id}`}
                    style={{
                      objectPosition:
                        faculty.id === 1
                          ? "center 62%"
                          : faculty.id === 2
                            ? "center top"
                            : faculty.id === 3
                              ? "center 0%"
                              : "center 0%",
                    }}
                    priority={faculty.id === 1}
                  />
                </div>
                <div className="p-2.5 sm:p-4 md:p-6 text-center flex-1 flex flex-col">
                  <h3 className="faculty-name mb-1 sm:mb-2 text-[15px] sm:text-lg md:text-xl font-semibold text-center leading-snug min-h-[2.4rem] sm:min-h-0">
                    {faculty.name}
                  </h3>
                  <p className="faculty-description text-[11px] sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4 leading-relaxed min-h-[3.2rem] sm:min-h-0">
                    {faculty.description}
                  </p>
                  <a
                    href={`/faculty/${faculty.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-profile-btn group inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm md:font-bold font-semibold border-2 border-indigo-600 text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 active:translate-y-0 active:shadow-md mt-auto self-center whitespace-nowrap"
                  >
                    <span className="relative z-10">View Profile</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .view-profile-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.55s ease;
          z-index: 1;
        }
        .view-profile-btn:hover::before {
          left: 160%;
        }

        @media (max-width: 767px) {
          .faculty-carousel-wrapper .faculty-photo {
            object-fit: contain !important;
            object-position: center top !important;
            background-color: #f3f4f6;
          }

          .faculty-carousel-wrapper .faculty-name {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .faculty-carousel-wrapper .faculty-description {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        @media (min-width: 1536px) {
          .faculty-carousel-wrapper {
            max-width: 1320px;
          }
        }
      `}</style>
    </div>
  );
}
