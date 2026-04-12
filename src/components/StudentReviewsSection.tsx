"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type StudentReview = {
  id: number;
  name: string;
  track: string;
  exam: string;
  image: string;
  rating: number;
  review: string;
};

type StudentReviewsSectionProps = {
  reviews: StudentReview[];
};

export function StudentReviewsSection({ reviews }: StudentReviewsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    let frameId = 0;
    const speed = 0.55;

    const step = () => {
      if (!pausedRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          el.scrollLeft += speed * directionRef.current;

          if (el.scrollLeft >= maxScroll) {
            el.scrollLeft = maxScroll;
            directionRef.current = -1;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft = 0;
            directionRef.current = 1;
          }
        }
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      id="reviews"
      className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-16 md:py-20"
    >
      <div className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-4xl px-4 sm:px-6 text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent px-2">
          Student&apos;s Reviews
        </h3>
        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
          Real feedback from our achievers in Assistant Professor and NTA NET
          examinations.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="student-reviews-scroll relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto px-4 sm:px-6"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div className="flex w-max gap-3 sm:gap-4 md:gap-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="w-[280px] sm:w-[300px] md:w-[320px] flex-shrink-0 rounded-xl sm:rounded-2xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-indigo-200">
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">
                    {review.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-indigo-700">
                    {review.track}
                  </p>
                  <p className="text-xs text-gray-500">{review.exam}</p>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={`${review.id}-star-${index}`}
                    className="text-base leading-none text-amber-500"
                    aria-hidden="true"
                  >
                    {index < review.rating ? "★" : "☆"}
                  </span>
                ))}
                <span className="ml-1 text-sm font-semibold text-gray-700">
                  {review.rating}.0/5
                </span>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                "{review.review}"
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8 sm:pt-10 px-4 sm:px-6">
        <Link
          href="/achievers"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          style={{ color: "#FFFFFF" }}
        >
          <span className="text-white">View All Achievers</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>

      <style jsx global>{`
        .student-reviews-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .student-reviews-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
