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

interface VideoStory {
  id: string;
  videoId: string;
  studentName: string;
  achievement: string;
  thumbnailUrl: string;
}

const successStories: VideoStory[] = [
  {
    id: "1",
    videoId: "iRyGvGx0vkE",
    studentName: "Dr. Manju Bishnoi",
    achievement: "Assistant Professor - RPSC Rank 11",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1659355894748-0b7b60de60b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHRlYWNoZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyODgyNTMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    videoId: "I9NvDQzQzIo",
    studentName: "Priya Sharma",
    achievement: "UGC NET Qualified - JRF Holder",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1577036421869-7c8d388d2123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdyYWR1YXRlJTIwc3R1ZGVudCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzcyOTAyODU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    videoId: "iRyGvGx0vkE",
    studentName: "Rahul Verma",
    achievement: "Assistant Professor - State University",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1659080907111-7c726e435a28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBncmFkdWF0ZSUyMGNlbGVicmF0aW9uJTIwYWNoaWV2ZW1lbnR8ZW58MXx8fHwxNzcyOTAyODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "4",
    videoId: "I9NvDQzQzIo",
    studentName: "Anjali Desai",
    achievement: "UGC NET - English Literature",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1600104079803-9967c03fa48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN0dWR5aW5nJTIwYm9va3MlMjBsaWJyYXJ5fGVufDF8fHx8MTc3MjkwMjg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "5",
    videoId: "iRyGvGx0vkE",
    studentName: "Vikram Singh",
    achievement: "RPSC 1st Grade - Rank 5",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjB0ZWFjaGVyJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjkwMjg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "6",
    videoId: "I9NvDQzQzIo",
    studentName: "Neha Patel",
    achievement: "Assistant Professor - Central University",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1753351058952-a3ff77a26a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN0dWRlbnQlMjBoYXBweSUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzcyOTAyODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

function VideoCard({ story }: { story: VideoStory }) {
  return (
    <article className="relative flex-[0_0_clamp(280px,31vw,440px)] snap-start overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 shadow-md backdrop-blur-sm">
        <Star className="h-3 w-3 fill-[#6A0DAD] text-[#6A0DAD]" />
        <span className="text-xs font-semibold text-[#6A0DAD]">
          Success Story
        </span>
      </div>

      <div className="relative aspect-video overflow-hidden bg-gray-900">
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
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {story.studentName}
        </h3>
        <p className="mb-4 font-medium text-[#6A0DAD]">{story.achievement}</p>
        <a
          href={`https://www.youtube.com/watch?v=${story.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6A0DAD] to-[#1E3A8A] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <Play className="h-4 w-4" />
          Watch Story
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
    <section className="relative overflow-hidden bg-[#F3F0FF] py-20">
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#6A0DAD] opacity-5 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-[#1E3A8A] opacity-5 blur-3xl" />
      <div className="absolute left-1/4 top-1/2 h-24 w-24 rounded-full bg-[#6A0DAD] opacity-5 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center">
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
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="h-2 w-2 cursor-pointer rounded-full bg-[#6A0DAD] opacity-30 transition-opacity hover:opacity-100"
              />
            ))}
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-[#6A0DAD] to-[#1E3A8A] p-8 text-center md:p-12">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white opacity-5 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white opacity-5 blur-xl" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-center gap-3">
              <GraduationCap className="h-10 w-10 text-white" />
              <Medal className="h-10 w-10 text-white" />
            </div>

            <h3 className="mb-3 text-3xl font-bold text-white md:text-4xl">
              Your Success Story Could Be Next
            </h3>

            <p className="mx-auto mb-6 max-w-2xl text-lg text-white/90">
              Join LePearl Education and prepare with expert guidance to achieve
              your academic dreams.
            </p>

            <a
              href="#courses"
              className="inline-block rounded-full bg-white px-8 py-4 font-semibold text-[#6A0DAD] shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Explore Courses
            </a>
          </div>
        </div>
      </div>

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
