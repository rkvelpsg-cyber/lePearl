"use client";

import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Slider, { type CustomArrowProps, type Settings } from "react-slick";
import book1 from "../../public/book1.jpeg";
import book2 from "../../public/book2.jpeg";
import book3 from "../../public/book3.jpeg";
import book4 from "../../public/book4.jpeg";
import book5 from "../../public/book5.jpeg";
import book6 from "../../public/book6.jpeg";

interface Book {
  id: number;
  image: StaticImageData;
  title: string;
  amazonLink: string;
}

const books: Book[] = [
  {
    id: 1,
    image: book1,
    title: "Literary Theories and Criticism on Your Lips",
    amazonLink: "https://www.amazon.com/dp/YOUR_BOOK_ID_1",
  },
  {
    id: 2,
    image: book2,
    title: "World Literature In Your Fist - Volume 1",
    amazonLink: "https://www.amazon.com/dp/YOUR_BOOK_ID_2",
  },
  {
    id: 3,
    image: book3,
    title: "Literature and Trauma - Volume II",
    amazonLink: "https://www.amazon.com/dp/YOUR_BOOK_ID_3",
  },
  {
    id: 4,
    image: book4,
    title: "Practice Workbook of English Literature",
    amazonLink: "https://www.amazon.com/dp/YOUR_BOOK_ID_4",
  },
  {
    id: 5,
    image: book5,
    title: "Challenging the Challenges of Life",
    amazonLink: "https://www.amazon.com/dp/YOUR_BOOK_ID_5",
  },
  {
    id: 6,
    image: book6,
    title: "Literature and Psychology - Volume I",
    amazonLink: "https://www.amazon.com/dp/YOUR_BOOK_ID_6",
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
      className="w-full py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full mb-4">
            <span className="text-sm tracking-wide uppercase">
              Literary Excellence
            </span>
          </div>
          <h2 className="text-4xl mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Books by Our Founder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the comprehensive collection of academic works authored by
            Dr. Prem Shankar Pandey, designed for competitive examinations and
            literary studies.
          </p>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 px-6 md:px-10 lg:px-14">
          <div className="books-carousel-wrapper">
            <Slider {...sliderSettings}>
              {books.map((book) => (
                <div key={book.id} className="px-3 py-1">
                  <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Image
                        src={book.image}
                        alt={book.title}
                        className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    </div>

                    <div className="flex flex-grow flex-col bg-gradient-to-b from-white to-gray-50 p-6">
                      <h3 className="mb-4 flex-grow text-lg text-gray-800">
                        {book.title}
                      </h3>
                      <a
                        href={book.amazonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#FF9900] to-[#FF8000] px-6 py-3 text-white shadow-md transition-all duration-200 hover:from-[#FA8900] hover:to-[#F57C00] hover:shadow-lg"
                      >
                        <span>Purchase on Amazon</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
