import { Trophy, Award, GraduationCap, Star } from "lucide-react";

interface Achiever {
  id: number;
  name: string;
  exam: string;
  rank?: string;
  score: string;
  year: string;
  image: string;
  achievement: string;
  testimonial: string;
}

const achievers: Achiever[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    exam: "UGC NET English",
    rank: "AIR 12",
    score: "95.2%",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1686628178397-97ae6c6db940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwZ3JhZHVhdGUlMjBkZWdyZWUlMjBjZXJ0aWZpY2F0ZXxlbnwxfHx8fDE3NzI0NTg2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    achievement: "Assistant Professor, Delhi University",
    testimonial:
      "LePearl Education's comprehensive study material and expert guidance helped me achieve my dream of becoming a professor.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    exam: "UGC NET English & SET",
    rank: "AIR 28",
    score: "92.8%",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1579438856893-73c65ab9436f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwZ3JhZHVhdGUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzI0NTg2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    achievement: "Lecturer, Government College",
    testimonial:
      "The structured approach at LePearl Education made complex topics easy to understand. I cleared both NET and SET exams in my first attempt.",
  },
  {
    id: 3,
    name: "Dr. Aisha Begum",
    exam: "UGC NET English",
    rank: "AIR 45",
    score: "90.5%",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1659080907105-64d884411c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50JTIwZ3JhZHVhdGlvbiUyMHN1Y2Nlc3MlMjB0cm9waHl8ZW58MXx8fHwxNzcyNDU4NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    achievement: "PhD Scholar & Teaching Fellow",
    testimonial:
      "LePearl's faculty members are exceptional. Their teaching methodology and constant motivation helped me crack NET and pursue my PhD dreams.",
  },
];

export function AchieversCard() {
  return (
    <div style={{ paddingTop: 8, paddingBottom: 24, width: "100%" }}>
      <div className="relative" style={{ width: "100%", margin: "0 auto" }}>
        <div
          className="hero-slide-shell relative overflow-hidden shadow-2xl"
          style={{ width: "100%" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

          <div className="hero-slide-content relative z-10 h-full p-4 md:p-6">
            <div className="h-full w-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/70 flex flex-col">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 md:px-6 md:py-5">
                <div className="absolute inset-0 opacity-10">
                  <img
                    src="https://images.unsplash.com/photo-1524591282491-edb48a0fca8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBib29rcyUyMGxpYnJhcnklMjBzdHVkeXxlbnwxfHx8fDE3NzI0NTg2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Education background"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-7 h-7" />
                      <GraduationCap className="w-7 h-7" />
                      <Award className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      LePearl Achievers
                    </h2>
                    <p className="text-sm md:text-base text-blue-50">
                      Success stories of UGC NET & SET qualifiers in English
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl md:text-2xl font-bold">200+</div>
                      <div className="text-[10px] md:text-xs opacity-90">
                        Qualified
                      </div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold">95%</div>
                      <div className="text-[10px] md:text-xs opacity-90">
                        Success
                      </div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold">20+</div>
                      <div className="text-[10px] md:text-xs opacity-90">
                        Top Rankers
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 pt-4 md:px-6 md:pt-5">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Our Pride: NET & SET Qualified Scholars
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  LePearl achievers have cleared UGC NET and SET in English
                  Literature and now serve as Assistant Professors, Lecturers,
                  and PhD scholars across reputed institutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 md:p-6 flex-1 min-h-0">
                {achievers.map((achiever) => (
                  <div
                    key={achiever.id}
                    className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={achiever.image}
                        alt={achiever.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div className="absolute top-3 right-3 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <Trophy className="w-4 h-4 text-yellow-900" />
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <h4 className="text-base font-bold leading-tight">
                          {achiever.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">
                            {achiever.rank}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-medium">
                          {achiever.exam}
                        </span>
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-medium">
                          Score: {achiever.score}
                        </span>
                        <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-full font-medium">
                          {achiever.year}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold text-gray-800">
                          {achiever.achievement}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-2">
                        <p className="text-[11px] text-gray-600 italic leading-relaxed">
                          "{achiever.testimonial}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
