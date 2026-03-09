"use client";

import Slider, { type CustomArrowProps, type Settings } from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import sadhanaImg from "../../public/sadhana_faculty1.jpeg";
import babliImg from "../../public/babil_faculty2.jpeg";
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
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-gradient-to-br from-violet-100 via-purple-50 to-white rounded-2xl">
      <h2 className="text-center mb-8 md:mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl font-bold">
        Faculty Profile
      </h2>
      <div className="faculty-carousel-wrapper max-w-7xl mx-auto">
        <Slider {...settings}>
          {facultyData.map((faculty) => (
            <div key={faculty.id} className="px-2 sm:px-3 md:px-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-md transition-all duration-300 hover:shadow-2xl">
                <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                    priority={faculty.id === 1}
                  />
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="mb-2 text-lg sm:text-xl font-semibold">
                    {faculty.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {faculty.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <style jsx global>{`
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
