"use client";

import { useEffect, useRef, useState } from "react";
import { CoachingCard } from "@/components/CoachingCard";
import { SecondHeroCard } from "@/components/SecondHeroCard";
import { ResearchAssistanceCard } from "@/components/ResearchAssistanceCard";
import { QuestionPapersCard } from "@/components/QuestionPapersCard";
import { AchieversCard } from "@/components/AchieversCard";

export function HomeHeroCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const totalSlides = 5;
  const [activeIndex, setActiveIndex] = useState(0);

  const getCurrentIndex = () => {
    const track = trackRef.current;

    if (!track || track.clientWidth === 0) {
      return 0;
    }

    return Math.round(track.scrollLeft / track.clientWidth);
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const normalizedIndex = (index + totalSlides) % totalSlides;
    setActiveIndex(normalizedIndex);
    track.scrollTo({
      left: normalizedIndex * track.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const intervalId = window.setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeIndex]);

  const goToPrevious = () => {
    scrollToIndex(activeIndex - 1);
  };

  const goToNext = () => {
    scrollToIndex(activeIndex + 1);
  };

  const handleTrackScroll = () => {
    setActiveIndex(getCurrentIndex());
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleTrackScroll}
        aria-label="Home hero horizontal sections"
        className="hero-track"
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            flex: "0 0 100%",
            width: "100%",
            minWidth: "100%",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <CoachingCard />
        </div>

        <div
          style={{
            flex: "0 0 100%",
            width: "100%",
            minWidth: "100%",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <SecondHeroCard />
        </div>

        <div
          style={{
            flex: "0 0 100%",
            width: "100%",
            minWidth: "100%",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <ResearchAssistanceCard />
        </div>

        <div
          style={{
            flex: "0 0 100%",
            width: "100%",
            minWidth: "100%",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <QuestionPapersCard />
        </div>

        <div
          style={{
            flex: "0 0 100%",
            width: "100%",
            minWidth: "100%",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <AchieversCard />
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll hero left"
        onClick={goToPrevious}
        className="hero-nav-btn hero-nav-prev hidden md:flex absolute top-1/2 -translate-y-1/2 -left-2 lg:-left-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/80 bg-white/80 text-purple-700 shadow-md backdrop-blur-sm items-center justify-center hover:bg-white transition-all"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Scroll hero right"
        onClick={goToNext}
        className="hero-nav-btn hero-nav-next hidden md:flex absolute top-1/2 -translate-y-1/2 -right-2 lg:-right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/80 bg-white/80 text-purple-700 shadow-md backdrop-blur-sm items-center justify-center hover:bg-white transition-all"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 flex items-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={`hero-dot-${index}`}
            type="button"
            aria-label={`Go to hero slide ${index + 1}`}
            onClick={() => scrollToIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index
                ? "w-7 bg-white"
                : "w-2.5 bg-white/55 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
