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
  videoUrl?: string;
  studentName: string;
  achievement: string;
  thumbnailUrl: string;
}

const successStories: VideoStory[] = [
  {
    id: "1",
    videoId: "0PIBA0lrFL4",
    videoUrl:
      "https://www.youtube.com/watch?v=0PIBA0lrFL4&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=1&t=4s",
    studentName: "Dr. Manju Bishnoi",
    achievement: "Assistant Professor - RPSC Rank 11",
    thumbnailUrl: "https://img.youtube.com/vi/0PIBA0lrFL4/maxresdefault.jpg",
  },
  {
    id: "2",
    videoId: "hcwQpy5Stx0",
    videoUrl:
      "https://www.youtube.com/watch?v=hcwQpy5Stx0&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=5",
    studentName: "Priya Sharma",
    achievement: "UGC NET Qualified - JRF Holder",
    thumbnailUrl: "https://img.youtube.com/vi/hcwQpy5Stx0/maxresdefault.jpg",
  },
  {
    id: "3",
    videoId: "l0Abm1noZIQ",
    videoUrl:
      "https://www.youtube.com/watch?v=l0Abm1noZIQ&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=2",
    studentName: "Rahul Verma",
    achievement: "Assistant Professor - State University",
    thumbnailUrl: "https://img.youtube.com/vi/l0Abm1noZIQ/maxresdefault.jpg",
  },
  {
    id: "4",
    videoId: "RvN82vHXVVk",
    videoUrl:
      "https://www.youtube.com/watch?v=RvN82vHXVVk&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=4&t=4s",
    studentName: "Anjali Desai",
    achievement: "UGC NET - English Literature",
    thumbnailUrl: "https://img.youtube.com/vi/RvN82vHXVVk/maxresdefault.jpg",
  },
  {
    id: "5",
    videoId: "Ysi39RnFEL4",
    videoUrl:
      "https://www.youtube.com/watch?v=Ysi39RnFEL4&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=4",
    studentName: "Vikram Singh",
    achievement: "RPSC 1st Grade - Rank 5",
    thumbnailUrl: "https://img.youtube.com/vi/Ysi39RnFEL4/maxresdefault.jpg",
  },
  {
    id: "6",
    videoId: "rOW5qTfiu1w",
    videoUrl:
      "https://www.youtube.com/watch?v=rOW5qTfiu1w&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=7",
    studentName: "Neha Patel",
    achievement: "Assistant Professor - Central University",
    thumbnailUrl: "https://img.youtube.com/vi/rOW5qTfiu1w/maxresdefault.jpg",
  },
  {
    id: "7",
    videoId: "GUFJHeMMG10",
    videoUrl:
      "https://www.youtube.com/watch?v=GUFJHeMMG10&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=7",
    studentName: "Success Story 7",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/GUFJHeMMG10/maxresdefault.jpg",
  },
  {
    id: "8",
    videoId: "Q3y5vQ-Z004",
    videoUrl:
      "https://www.youtube.com/watch?v=Q3y5vQ-Z004&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=8",
    studentName: "Success Story 8",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/Q3y5vQ-Z004/maxresdefault.jpg",
  },
  {
    id: "9",
    videoId: "YvGREAy7h5M",
    videoUrl:
      "https://www.youtube.com/watch?v=YvGREAy7h5M&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=9",
    studentName: "Success Story 9",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/YvGREAy7h5M/maxresdefault.jpg",
  },
  {
    id: "10",
    videoId: "GGxsz153m64",
    videoUrl:
      "https://www.youtube.com/watch?v=GGxsz153m64&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=10",
    studentName: "Success Story 10",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/GGxsz153m64/maxresdefault.jpg",
  },
  {
    id: "11",
    videoId: "RG1R7bZqj58",
    videoUrl:
      "https://www.youtube.com/watch?v=RG1R7bZqj58&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=11",
    studentName: "Success Story 11",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/RG1R7bZqj58/maxresdefault.jpg",
  },
  {
    id: "12",
    videoId: "r4D1zpWeoOI",
    videoUrl:
      "https://www.youtube.com/watch?v=r4D1zpWeoOI&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=12",
    studentName: "Success Story 12",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/r4D1zpWeoOI/maxresdefault.jpg",
  },
  {
    id: "13",
    videoId: "WVCRXF6Tll4",
    videoUrl:
      "https://www.youtube.com/watch?v=WVCRXF6Tll4&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=13",
    studentName: "Success Story 13",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/WVCRXF6Tll4/maxresdefault.jpg",
  },
  {
    id: "14",
    videoId: "9-R9Ru0m6qI",
    videoUrl:
      "https://www.youtube.com/watch?v=9-R9Ru0m6qI&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=14",
    studentName: "Success Story 14",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/9-R9Ru0m6qI/maxresdefault.jpg",
  },
  {
    id: "15",
    videoId: "trOTas0tliI",
    videoUrl:
      "https://www.youtube.com/watch?v=trOTas0tliI&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=15",
    studentName: "Success Story 15",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/trOTas0tliI/maxresdefault.jpg",
  },
  {
    id: "16",
    videoId: "_X__5pLpQEw",
    videoUrl:
      "https://www.youtube.com/watch?v=_X__5pLpQEw&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=16",
    studentName: "Success Story 16",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/_X__5pLpQEw/maxresdefault.jpg",
  },
  {
    id: "17",
    videoId: "YkSe5s8P1Qg",
    videoUrl:
      "https://www.youtube.com/watch?v=YkSe5s8P1Qg&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=17",
    studentName: "Success Story 17",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/YkSe5s8P1Qg/maxresdefault.jpg",
  },
  {
    id: "18",
    videoId: "CysvSKdL3gM",
    videoUrl:
      "https://www.youtube.com/watch?v=CysvSKdL3gM&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=18",
    studentName: "Success Story 18",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/CysvSKdL3gM/maxresdefault.jpg",
  },
  {
    id: "19",
    videoId: "cAiBXu7oDoM",
    videoUrl:
      "https://www.youtube.com/watch?v=cAiBXu7oDoM&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=19",
    studentName: "Success Story 19",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/cAiBXu7oDoM/maxresdefault.jpg",
  },
  {
    id: "20",
    videoId: "0KF-VxoZ8C0",
    videoUrl:
      "https://www.youtube.com/watch?v=0KF-VxoZ8C0&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=20",
    studentName: "Success Story 20",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/0KF-VxoZ8C0/maxresdefault.jpg",
  },
  {
    id: "21",
    videoId: "BkkPjBRmBB8",
    videoUrl:
      "https://www.youtube.com/watch?v=BkkPjBRmBB8&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=21",
    studentName: "Success Story 21",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/BkkPjBRmBB8/maxresdefault.jpg",
  },
  {
    id: "22",
    videoId: "5Kli84ncJ94",
    videoUrl:
      "https://www.youtube.com/watch?v=5Kli84ncJ94&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=22",
    studentName: "Success Story 22",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/5Kli84ncJ94/maxresdefault.jpg",
  },
  {
    id: "23",
    videoId: "sz5Va4QyGNg",
    videoUrl:
      "https://www.youtube.com/watch?v=sz5Va4QyGNg&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=23",
    studentName: "Success Story 23",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/sz5Va4QyGNg/hqdefault.jpg",
  },
  {
    id: "24",
    videoId: "XGYapIjesQE",
    videoUrl:
      "https://www.youtube.com/watch?v=XGYapIjesQE&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=24",
    studentName: "Success Story 24",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/XGYapIjesQE/hqdefault.jpg",
  },
  {
    id: "25",
    videoId: "sCxQ07TKzc0",
    videoUrl:
      "https://www.youtube.com/watch?v=sCxQ07TKzc0&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=25",
    studentName: "Success Story 25",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/sCxQ07TKzc0/hqdefault.jpg",
  },
  {
    id: "26",
    videoId: "lUZ-KE_LLkc",
    videoUrl:
      "https://www.youtube.com/watch?v=lUZ-KE_LLkc&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=26",
    studentName: "Success Story 26",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/lUZ-KE_LLkc/hqdefault.jpg",
  },
  {
    id: "27",
    videoId: "4cqnt2DkIPw",
    videoUrl:
      "https://www.youtube.com/watch?v=4cqnt2DkIPw&list=PLAx-8DhWebAVV345Gtu7HxAjplsZ9UYIt&index=27",
    studentName: "Success Story 27",
    achievement: "LePearl Scholar Achievement",
    thumbnailUrl: "https://img.youtube.com/vi/4cqnt2DkIPw/hqdefault.jpg",
  },
];

function VideoCard({ story }: { story: VideoStory }) {
  const watchUrl =
    story.videoUrl ?? `https://www.youtube.com/watch?v=${story.videoId}`;

  return (
    <article className="relative flex-[0_0_clamp(280px,31vw,440px)] snap-start overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 shadow-md backdrop-blur-sm">
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
      className="relative overflow-hidden bg-[#F3F0FF] py-20"
    >
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
