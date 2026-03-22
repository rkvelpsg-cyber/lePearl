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
      imageUrl: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg",
    },
    {
      id: 2,
      name: "Richa Singh",
      imageUrl: "/Richa%20Singh_NET_Dec_2026.jpeg",
    },
    {
      id: 3,
      name: "Kanika Sharma",
      imageUrl: "/Kanika%20Sharma.jpeg",
    },
    {
      id: 4,
      name: "Rashmita Sahoo",
      imageUrl: "/Rashmita%20Sahoo.jpeg",
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
    <div style={{ paddingTop: 8, paddingBottom: 24, width: "100%" }}>
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
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3">
                    Crack UGC NET English with{" "}
                    <span className="text-yellow-400">Confidence</span>
                  </h2>
                  <div className="w-16 sm:w-24 h-1 bg-yellow-400 rounded-full" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-yellow-400 mb-2 sm:mb-4">
                    What You&apos;ll Get:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {coachingPrograms.map((program, index) => (
                      <div
                        key={`${program}-${index}`}
                        className="flex items-start gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/20 hover:bg-white/20 transition-all"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="bg-green-500 rounded-full p-1">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        </div>
                        <span className="text-white font-medium text-xs sm:text-sm">
                          {program}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 sm:gap-2 bg-yellow-400/20 border-2 border-yellow-400 rounded-full px-3 sm:px-6 py-2 sm:py-3">
                  <span className="text-yellow-400 font-bold text-sm sm:text-base lg:text-lg">
                    🎯 Expert-Led Training
                  </span>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end mt-6 sm:mt-0">
                <div className="relative w-full sm:w-auto">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl blur-2xl opacity-30" />

                  <div className="relative w-full sm:w-auto max-w-sm md:max-w-[420px] rounded-2xl sm:rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-3 sm:p-4 backdrop-blur-sm">
                    <h4 className="mb-3 sm:mb-4 text-center text-base sm:text-lg lg:text-xl font-bold text-yellow-300">
                      NTA NET Achievers
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
                      {netAchievers.map((achiever) => (
                        <div
                          key={achiever.id}
                          className="rounded-lg sm:rounded-2xl border border-white/25 bg-white/10 p-1.5 sm:p-2 text-center"
                        >
                          <div className="mx-auto mb-1 sm:mb-2 h-16 sm:h-24 w-16 sm:w-24 overflow-hidden rounded-lg sm:rounded-xl border-2 border-yellow-300/80 bg-white/90">
                            <Image
                              src={achiever.imageUrl}
                              alt={achiever.name}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                            {achiever.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-12 flex justify-center">
              <Link
                href="/login"
                className="group relative inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-sm sm:text-base lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-yellow-500/50"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  Enroll Now
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
