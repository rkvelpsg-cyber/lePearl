"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Medal,
  Play,
  Star,
} from "lucide-react";
import {
  successStoriesData,
  type SuccessStoryVideo,
} from "@/data/successStories";

type VideoStory = SuccessStoryVideo;

const successStories: VideoStory[] = successStoriesData;

function VideoCard({ story }: { story: VideoStory }) {
  const watchUrl =
    story.videoUrl ?? `https://www.youtube.com/watch?v=${story.videoId}`;

  return (
    <article className="relative flex-[0_0_clamp(260px,80vw,440px)] snap-start overflow-hidden rounded-lg sm:rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute left-3 sm:left-4 top-3 sm:top-4 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2 sm:px-3 py-1 shadow-md backdrop-blur-sm">
        <Star className="h-3 w-3 fill-[#6A0DAD] text-[#6A0DAD]" />
        <span className="text-xs font-semibold text-[#6A0DAD]">
          Success Story
        </span>
      </div>

      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Play ${story.studentName} success story`}
        className="relative block aspect-video overflow-hidden bg-gray-900"
      >
        <Image
          src={story.thumbnailUrl}
          alt={`${story.studentName} success story`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 84vw, (max-width: 1024px) 52vw, 31vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="rounded-full bg-[#6A0DAD] p-5 shadow-2xl transition-transform duration-300 hover:scale-110">
            <Play className="h-8 w-8 fill-white text-white" />
          </div>
        </div>
      </a>

      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {story.studentName}
        </h3>
        <p className="mb-4 font-medium text-[#6A0DAD]">{story.achievement}</p>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6A0DAD] to-[#1E3A8A] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <Play className="h-4 w-4 text-white" />
          <span className="text-white">Watch Story</span>
        </a>
      </div>
    </article>
  );
}

export function SuccessStoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const manualPauseUntilRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    let frameId = 0;

    const step = () => {
      if (Date.now() < manualPauseUntilRef.current) {
        frameId = requestAnimationFrame(step);
        return;
      }

      el.scrollLeft += 0.65;

      const loopWidth = el.scrollWidth / 2;

      if (el.scrollLeft >= loopWidth) {
        el.scrollLeft -= loopWidth;
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const handlePrevious = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    manualPauseUntilRef.current = Date.now() + 1400;

    const loopWidth = el.scrollWidth / 2;
    if (el.scrollLeft <= 0) {
      el.scrollLeft += loopWidth;
    }

    el.scrollBy({ left: -el.clientWidth * 0.85, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    manualPauseUntilRef.current = Date.now() + 1400;

    const loopWidth = el.scrollWidth / 2;
    if (el.scrollLeft >= loopWidth) {
      el.scrollLeft -= loopWidth;
    }

    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section
      id="success-stories"
      className="relative overflow-hidden bg-[#F3F0FF] pt-0 pb-6"
    >
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#6A0DAD] opacity-5 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-[#1E3A8A] opacity-5 blur-3xl" />
      <div className="absolute left-1/4 top-1/2 h-24 w-24 rounded-full bg-[#6A0DAD] opacity-5 blur-2xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-2 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <Star className="h-4 w-4 fill-[#6A0DAD] text-[#6A0DAD]" />
            <span className="text-sm font-semibold text-[#6A0DAD]">
              Real Student Achievements
            </span>
          </div>

          <h2 className="mb-4 bg-gradient-to-r from-[#6A0DAD] to-[#1E3A8A] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Success Stories of Our Scholars
          </h2>

          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Hear directly from our students who achieved success in UGC NET,
            Assistant Professor, and other competitive exams with LePearl
            Education.
          </p>
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
            className="success-stories-scroll overflow-x-auto px-12 py-1 sm:px-16 md:px-20 lg:px-24"
          >
            <div className="flex w-max gap-4 pb-4 md:gap-6">
              {[...successStories, ...successStories].map((story, index) => (
                <VideoCard key={`${story.id}-${index}`} story={story} />
              ))}
            </div>{" "}
            {/* Close flex container */}
          </div>{" "}
          {/* Close scroll container */}
        </div>{" "}
        {/* Close relative container */}
      </div>{" "}
      {/* Close max-w-7xl container */}
      <style jsx global>{`
        .success-stories-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: none;
          scroll-padding-inline: clamp(3rem, 9vw, 8rem);
        }

        .success-stories-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
