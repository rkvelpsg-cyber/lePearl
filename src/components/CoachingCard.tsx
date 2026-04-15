import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

export function CoachingCard() {
  const booksBackground =
    "https://images.unsplash.com/photo-1625053376622-e462848c453f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwYm9va3MlMjBjb2xsZWN0aW9uJTIwc3R1ZHl8ZW58MXx8fHwxNzcyNDQwNTgxfDA&ixlib=rb-4.1.0&q=80&w=1920&q=100";

  const coachingPrograms = [
    "120+ Recorded Lectures",
    "Unit Wise Notes",
    "Practice Test Series",
    "Previous Year Papers",
    "Study Materials & E-Books",
    "Live Doubt Sessions",
  ];

  const backgroundLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];

  const netAchievers = [
    {
      id: 1,
      name: "Nidhi Shukla",
      year: "NTA-NET Dec 2025",
      imageUrl: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg",
    },
    {
      id: 2,
      name: "Richa Singh",
      year: "NTA-NET Dec 2026",
      imageUrl: "/Richa%20Singh_NET_Dec_2026.jpeg",
    },
    {
      id: 3,
      name: "Kanika Sharma",
      year: "NTA-NET Dec 2025",
      imageUrl: "/Kanika%20Sharma.jpeg",
    },
    {
      id: 4,
      name: "Rashmita Sahoo",
      year: "NTA-NET Dec 2024",
      imageUrl: "/Rashmita%20Sahoo.jpeg",
    },
    {
      id: 5,
      name: "Abhishesh Verma",
      year: "NTA-NET Jun 2025",
      imageUrl: "/Abhishesh%20Verma.jpeg",
    },
    {
      id: 6,
      name: "Hemlata",
      year: "NTA-NET Jun 2023",
      imageUrl: "/Hemlata.jpeg",
    },
    {
      id: 7,
      name: "Shabnam Khatun",
      year: "NTA-NET Jun 2023",
      imageUrl: "/Shabnam%20Khatun.jpeg",
    },
    {
      id: 8,
      name: "Shivani Tiwari",
      year: "NTA-NET JRF Dec 2024",
      imageUrl: "/Shivani%20Tiwari.jpeg",
    },
    {
      id: 9,
      name: "Vineeta Vijay Sharma",
      year: "NTA-NET Dec 2022",
      imageUrl: "/Vineeta%20Vijay%20Sharma.jpeg",
    },
    {
      id: 10,
      name: "Deepti Dwivedi",
      year: "NTA-NET Jun 2023",
      imageUrl: "/Deepti%20Dwivedi.jpeg",
    },
  ];

  const getLetterStyle = (index: number) => ({
    fontSize: `${80 + ((index * 23) % 100)}px`,
    left: `${(index * 17 + 11) % 100}%`,
    top: `${(index * 29 + 7) % 100}%`,
    transform: `rotate(${((index * 13) % 41) - 20}deg)`,
    fontFamily: "serif",
  });

  return (
    <div style={{ paddingTop: 0, paddingBottom: 24, width: "100%" }}>
      <div className="relative" style={{ width: "100%", margin: "0 auto" }}>
        <div
          className="hero-slide-shell relative overflow-hidden shadow-2xl"
          style={{
            width: "100%",
            imageRendering: "crisp-edges",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${booksBackground})`,
              imageRendering: "-webkit-optimize-contrast",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/75 via-purple-900/80 to-blue-900/75" />
          </div>

          <div className="absolute inset-0 overflow-hidden opacity-5">
            {backgroundLetters.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="absolute text-white font-bold select-none pointer-events-none"
                style={getLetterStyle(index)}
              >
                {letter}
              </span>
            ))}
          </div>

          <div className="hero-slide-content relative z-10 px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:px-12 md:pt-12 md:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 min-w-0">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3 break-words">
                    Crack UGC NET English with{" "}
                    <span className="text-yellow-400">Confidence</span>
                  </h2>
                  <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-1 bg-yellow-400 rounded-full" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-yellow-400 mb-2 sm:mb-4">
                    What You&apos;ll Get:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {coachingPrograms.map((program, index) => (
                      <div
                        key={`${program}-${index}`}
                        className="flex items-start gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/20 hover:bg-white/20 transition-all min-w-0"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="bg-green-500 rounded-full p-1">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        </div>
                        <span className="text-white font-medium text-xs sm:text-sm break-words">
                          {program}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 sm:gap-2 bg-yellow-400/20 border-2 border-yellow-400 rounded-full px-3 sm:px-6 py-2 sm:py-3 flex-wrap">
                  <span className="text-yellow-400 font-bold text-xs sm:text-sm md:text-base lg:text-lg">
                    🎯 Expert-Led Training
                  </span>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end mt-6 sm:mt-8 lg:mt-0 w-full">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl blur-2xl opacity-30" />

                  <div className="relative w-full rounded-2xl sm:rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-3 sm:p-4 backdrop-blur-sm">
                    <h4 className="mb-3 sm:mb-4 text-center text-xs sm:text-base md:text-lg lg:text-xl font-bold text-yellow-300">
                      NTA NET Achievers
                    </h4>
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {netAchievers.map((achiever) => (
                        <div
                          key={achiever.id}
                          className="rounded-lg border border-white/25 bg-white/10 p-1 sm:p-1.5 text-center min-w-0"
                        >
                          <div className="mx-auto mb-1 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 overflow-hidden rounded-lg border-2 border-yellow-300/80 bg-white/90 flex-shrink-0">
                            <Image
                              src={achiever.imageUrl}
                              alt={achiever.name}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-[9px] sm:text-xs font-semibold text-white leading-tight line-clamp-2 break-words">
                            {achiever.name}
                          </p>
                          <p className="mt-0.5 text-[8px] sm:text-[10px] text-yellow-300 leading-tight line-clamp-1 break-words">
                            {achiever.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 w-full px-2">
              <Link
                href="/login-portal" target="_blank" rel="noopener noreferrer"
                className="group relative inline-flex items-center w-full sm:w-auto justify-center bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50 whitespace-nowrap min-h-[44px]"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3 justify-center">
                  Enroll Now
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0"
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
                </span>

                <span className="absolute inset-0 rounded-full bg-white/30 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
              <Link
                href="/achievers"
                className="inline-flex items-center w-full sm:w-auto justify-center gap-2 sm:gap-3 rounded-full border-2 border-yellow-400 px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-yellow-300 transition-all duration-300 hover:scale-105 hover:bg-yellow-400/20 whitespace-nowrap min-h-[44px]"
              >
                More Achievers
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
