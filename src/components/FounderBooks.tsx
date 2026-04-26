"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaAmazon } from "react-icons/fa";
import Slider, { type CustomArrowProps, type Settings } from "react-slick";
import book1 from "../../public/book1.jpeg";
import book2 from "../../public/book2.jpeg";
import book3 from "../../public/book3.jpeg";
import book4 from "../../public/book4.jpeg";
import book5 from "../../public/book5.jpeg";
import book6 from "../../public/Book_6.jpg";
import book7 from "../../public/Book_7.jpg";

interface Book {
  id: number;
  image: StaticImageData;
  title: string;
  amazonLink: string;
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex h-auto sm:h-96 md:h-[480px] lg:h-[560px] flex-col overflow-hidden rounded-lg sm:rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-3">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 25vw"
          className="object-contain object-center p-1 sm:p-2"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-gray-50 p-3 sm:p-4 md:p-6">
        <h3 className="mb-2 sm:mb-4 text-sm sm:text-base md:text-lg leading-snug text-gray-800">
          {book.title}
        </h3>
        <a
          href={book.amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-[#FF9900] to-[#FF8000] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white font-semibold shadow-md transition-all duration-200 hover:from-[#FA8900] hover:to-[#F57C00] hover:shadow-lg whitespace-nowrap"
        >
          <FaAmazon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          <span>Purchase on Amazon</span>
        </a>
      </div>
    </div>
  );
}

const books: Book[] = [
  {
    id: 1,
    image: book1,
    title: "World Literature In Your Fist - Volume 1",
    amazonLink: "https://amzn.in/d/0aj4gJS6",
  },
  {
    id: 2,
    image: book2,
    title: "Literary Theories and Criticism on Your Lips",
    amazonLink: "https://amzn.in/d/0id23cCn",
  },
  {
    id: 3,
    image: book3,
    title: "Practice Workbook of English Literature",
    amazonLink: "https://amzn.in/d/05hR80Sh",
  },
  {
    id: 4,
    image: book4,
    title: "Literature and Psychology - Volume I",
    amazonLink: "https://amzn.in/d/0bRBggeX",
  },
  {
    id: 5,
    image: book5,
    title: "Literature and Trauma - Volume II",
    amazonLink: "https://amzn.in/d/01ntjC96",
  },
  {
    id: 6,
    image: book6,
    title: "Advanced Academic Writing",
    amazonLink: "https://amzn.in/d/08xNCOhK",
  },
  {
    id: 7,
    image: book7,
    title: "Prepare Like a Shooter Reply Like a Hooter",
    amazonLink: "https://amzn.in/d/03zQI3NN",
  },
];

function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white md:left-6"
      aria-label="Previous books"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  );
}

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white md:right-6"
      aria-label="Next books"
    >
      <ChevronRight className="h-6 w-6" />
    </button>
  );
}

export function FounderBooks() {
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 767px)");
    if (!isMobile.matches) return;

    const firstSlide = container.querySelector(
      "[data-book-slide]",
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

  const sliderSettings: Settings = {
    dots: false,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 2400,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    swipeToSlide: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section
      id="books"
      className="w-full py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm tracking-wide uppercase font-semibold">
              Literary Excellence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold px-2">
            Books by Our Founder
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Explore the comprehensive collection of academic works authored by
            Dr. Prem Shankar Pandey, designed for competitive examinations and
            literary studies.
          </p>
        </div>

        <div className="md:hidden px-1">
          <div
            ref={mobileScrollRef}
            className="hide-scrollbar flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 px-1 pb-2"
          >
            {books.map((book) => (
              <div
                key={book.id}
                data-book-slide
                className="snap-center shrink-0 min-w-full py-1"
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block relative left-1/2 w-screen -translate-x-1/2 px-2 sm:px-4 md:px-6 lg:px-10">
          <div className="books-carousel-wrapper mx-auto">
            <Slider {...sliderSettings}>
              {books.map((book) => (
                <div
                  key={book.id}
                  className="px-1.5 sm:px-2 md:px-3 lg:px-4 py-1"
                >
                  <BookCard book={book} />
                </div>
              ))}
            </Slider>
          </div>
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

        .books-carousel-wrapper .slick-track {
          display: flex !important;
        }

        .books-carousel-wrapper .slick-slide {
          height: inherit !important;
        }

        .books-carousel-wrapper .slick-slide > div {
          height: 100%;
        }
      `}</style>
    </section>
  );
}
