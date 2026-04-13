"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Quote, Star } from "lucide-react";

export type NtaNetSuccessStory = {
  name: string;
  examName: string;
  imageUrl: string;
  quote: string;
};

type NtaNetSuccessCarouselProps = {
  stories: NtaNetSuccessStory[];
  heading?: string;
  description?: string;
};

export function NtaNetSuccessCarousel({
  stories,
  heading = "NTA NET Success Stories",
  description = "Our achievers share how focused preparation and expert guidance helped them clear the NET exam.",
}: NtaNetSuccessCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const directionRef = useRef(1);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stories.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        const lastIndex = stories.length - 1;
        let next = current + directionRef.current;

        if (next > lastIndex) {
          directionRef.current = -1;
          next = current - 1;
        } else if (next < 0) {
          directionRef.current = 1;
          next = current + 1;
        }

        return next;
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [stories.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const item = track.querySelector(
      `[data-carousel-item="${activeIndex}"]`,
    ) as HTMLElement | null;
    if (item) {
      track.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            {description}
          </p>
          <div className="mt-6 h-1 w-24 bg-amber-500 mx-auto rounded-full" />
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {stories.map((story, index) => (
              <article
                key={`${story.name}-${index}`}
                data-carousel-item={index}
                className="snap-center flex-shrink-0 w-full sm:w-[48%] lg:w-[32%] rounded-3xl bg-white p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-amber-400">
                      <Image
                        src={story.imageUrl}
                        alt={story.name}
                        width={320}
                        height={320}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 mb-1">
                        {story.name}
                      </h3>
                      <p className="text-sm font-semibold text-amber-600">
                        {story.examName}
                      </p>
                    </div>
                  </div>
                  <Quote className="h-10 w-10 text-amber-300" />
                </div>

                <div className="mb-5 flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
