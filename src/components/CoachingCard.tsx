import Image from "next/image";
import Link from "next/link";
import trainerImage from "../../public/PremSir_Photo.jpeg";
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

          <div className="hero-slide-content relative z-10 px-8 pt-8 pb-24 md:px-12 md:pt-12 md:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
                    Crack UGC NET English with{" "}
                    <span className="text-yellow-400">Confidence</span>
                  </h2>
                  <div className="w-24 h-1 bg-yellow-400 rounded-full" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                    What You&apos;ll Get:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {coachingPrograms.map((program, index) => (
                      <div
                        key={`${program}-${index}`}
                        className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="bg-green-500 rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <span className="text-white font-medium text-sm">
                          {program}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-yellow-400/20 border-2 border-yellow-400 rounded-full px-6 py-3">
                  <span className="text-yellow-400 font-bold text-lg">
                    🎯 Expert-Led Training
                  </span>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl blur-2xl opacity-30" />

                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-2 border-2 border-white/20">
                    <Image
                      src={trainerImage}
                      alt="UGC NET English Expert Trainer"
                      className="w-full max-w-[380px] h-auto object-contain rounded-2xl"
                      style={{ imageRendering: "-webkit-optimize-contrast" }}
                      priority
                    />
                  </div>

                  <Link
                    href="/#founder"
                    className="absolute -bottom-4 -right-4 bg-green-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl border-4 border-white max-w-[320px] hover:bg-green-600 transition-colors"
                  >
                    <span className="text-xs md:text-sm leading-tight text-center block">
                      Dr. Prem Shankar Pandey, Founder &amp; Director, LePearl
                      Education
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xl px-12 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-yellow-500/50">
                <span className="relative z-10 flex items-center gap-3">
                  Enroll Now
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
