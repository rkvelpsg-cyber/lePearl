"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { SuccessStoryVideo } from "@/data/successStories";

type SuccessStoriesVideoCarouselProps = {
  stories: SuccessStoryVideo[];
  heading: string;
  description: string;
};

function parseStoryText(story: SuccessStoryVideo) {
  const lines = story.studentName
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const title = lines[0] ?? story.studentName;
  const subtitle = story.achievement || lines[1] || "NTA NET Achiever";

  return { title, subtitle };
}

export function SuccessStoriesVideoCarousel({
  stories,
  heading,
  description,
}: SuccessStoriesVideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const manualPauseUntilRef = useRef(0);

  const safeStories = useMemo(
    () => stories.filter((story) => Boolean(story.videoId)),
    [stories],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || safeStories.length <= 1) {
      return;
    }

    let frameId = 0;

    const step = () => {
      if (Date.now() < manualPauseUntilRef.current) {
        frameId = requestAnimationFrame(step);
        return;
      }

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        frameId = requestAnimationFrame(step);
        return;
      }

      if (el.scrollLeft >= maxScroll - 1) {
        directionRef.current = -1;
      } else if (el.scrollLeft <= 1) {
        directionRef.current = 1;
      }

      el.scrollLeft += 0.6 * directionRef.current;
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [safeStories.length]);

  const handlePrevious = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    manualPauseUntilRef.current = Date.now() + 1200;
    directionRef.current = -1;
    el.scrollBy({ left: -el.clientWidth * 0.85, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    manualPauseUntilRef.current = Date.now() + 1200;
    directionRef.current = 1;
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            {description}
          </p>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-amber-500" />
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8">
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#d9d2ff] bg-white/95 p-3 text-[#6A0DAD] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white md:left-4 lg:left-6"
            aria-label="Previous stories"
            type="button"
          >
            <ChevronLeft className="h-6 w-6 text-[#6A0DAD]" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#d9d2ff] bg-white/95 p-3 text-[#6A0DAD] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white md:right-4 lg:right-6"
            aria-label="Next stories"
            type="button"
          >
            <ChevronRight className="h-6 w-6 text-[#6A0DAD]" />
          </button>

          <div
            ref={scrollRef}
            className="exam-stories-scroll overflow-x-auto px-12 py-1 sm:px-16 md:px-20 lg:px-24"
          >
            <div className="flex w-max gap-4 pb-4 md:gap-6">
              {safeStories.map((story) => {
                const watchUrl =
                  story.videoUrl ??
                  `https://www.youtube.com/watch?v=${story.videoId}`;
                const { title, subtitle } = parseStoryText(story);

                return (
                  <article
                    key={story.id}
                    className="relative flex-[0_0_clamp(260px,80vw,440px)] snap-start overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-2xl"
                  >
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 shadow-md backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3">
                      <Star className="h-3 w-3 fill-[#6A0DAD] text-[#6A0DAD]" />
                      <span className="text-xs font-semibold text-[#6A0DAD]">
                        Success Story
                      </span>
                    </div>

                    <a
                      href={watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Play ${title} success story`}
                      className="relative block aspect-video overflow-hidden bg-gray-900"
                    >
                      <ImageWithFallback
                        src={story.thumbnailUrl}
                        alt={`${title} success story`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="rounded-full bg-[#6A0DAD] p-5 shadow-2xl transition-transform duration-300 hover:scale-110">
                          <Play className="h-8 w-8 fill-white text-white" />
                        </div>
                      </div>
                    </a>

                    <div className="flex min-h-[220px] flex-col p-6">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {title}
                      </h3>
                      <p className="mb-4 font-medium text-[#6A0DAD]">
                        {subtitle}
                      </p>

                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6A0DAD] to-[#1E3A8A] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <Play className="h-4 w-4 text-white" />
                        <span className="text-white">Watch Story</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .exam-stories-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: none;
          scroll-padding-inline: clamp(3rem, 9vw, 8rem);
        }

        .exam-stories-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
