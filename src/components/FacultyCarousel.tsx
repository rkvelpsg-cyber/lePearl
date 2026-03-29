"use client";

import Slider, { type CustomArrowProps, type Settings } from "react-slick";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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

function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 group"
      aria-label="Previous slide"
      type="button"
    >
      <ChevronLeft className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
    </button>
  );
}

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 hover:translate-x-1 group"
      aria-label="Next slide"
      type="button"
    >
      <ChevronRight className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
    </button>
  );
}

export function FacultyCarousel() {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div
      className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-16 rounded-xl sm:rounded-2xl"
      style={{ background: "rgba(255,255,255,0.60)" }}
    >
      <h2 className="text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
        Faculty Profile
      </h2>
      <div className="faculty-carousel-wrapper max-w-7xl mx-auto">
        <Slider {...settings}>
          {facultyData.map((faculty) => (
            <div
              key={faculty.id}
              className="px-1.5 sm:px-2 md:px-3 lg:px-4 h-full"
            >
              <div className="bg-white rounded-lg sm:rounded-lg shadow-lg overflow-hidden mx-auto max-w-xs sm:max-w-sm h-full flex flex-col transition-all duration-300 hover:shadow-2xl">
                <div
                  className="w-full overflow-hidden bg-gray-100"
                  style={{ height: "280px" }}
                >
                  <Image
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
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
                <div className="p-3 sm:p-4 md:p-6 text-center flex-1 flex flex-col">
                  <h3 className="mb-1 sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-center leading-snug">
                    {faculty.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4 leading-relaxed">
                    {faculty.description}
                  </p>
                  <a
                    href={`/faculty/${faculty.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-profile-btn group inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:font-bold font-semibold border-2 border-indigo-600 text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 active:translate-y-0 active:shadow-md mt-auto self-center whitespace-nowrap"
                  >
                    <span className="relative z-10">View Profile</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <style jsx global>{`
        .faculty-carousel-wrapper .slick-track {
          display: flex !important;
        }

        .faculty-carousel-wrapper .slick-slide {
          height: inherit !important;
        }

        .faculty-carousel-wrapper .slick-slide > div {
          height: 100%;
        }

        .faculty-carousel-wrapper .slick-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .faculty-carousel-wrapper .slick-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }

        .faculty-carousel-wrapper .slick-dots li button {
          width: 12px;
          height: 12px;
          padding: 0;
          border-radius: 50%;
          background-color: #d1d5db;
          transition: all 0.3s ease;
        }

        .faculty-carousel-wrapper .slick-dots li button:before {
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

        .faculty-carousel-wrapper .slick-dots li.slick-active button {
          background-color: #3b82f6;
          width: 32px;
          border-radius: 6px;
        }

        .faculty-carousel-wrapper .slick-prev,
        .faculty-carousel-wrapper .slick-next {
          z-index: 1;
          width: 40px;
          height: 40px;
        }

        .faculty-carousel-wrapper .slick-prev {
          left: -15px;
        }

        .faculty-carousel-wrapper .slick-next {
          right: -15px;
        }

        .faculty-carousel-wrapper .slick-prev:before,
        .faculty-carousel-wrapper .slick-next:before {
          font-size: 40px;
          color: #3b82f6;
        }

        @media (max-width: 767px) {
          .faculty-carousel-wrapper .slick-dots {
            bottom: -30px;
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
