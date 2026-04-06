import Image from "next/image";
import {
  BookOpen,
  Download,
  FileText,
  MessageCircle,
  Users,
  Video,
} from "lucide-react";

const features = [
  {
    icon: Video,
    text: "Interactive Video Lectures every week for doubt clearance",
  },
  {
    icon: FileText,
    text: "Mock Tests & Analysis: 50+ full-length mocks with real-time simulation",
  },
  {
    icon: BookOpen,
    text: "Study Materials: Crisp PDFs, mind maps, and previous year papers based studies",
  },
  {
    icon: Users,
    text: "Live Sessions: Doubt-clearing, strategy webinars, and exam-centred prep",
  },
  {
    icon: MessageCircle,
    text: "Community Support: Exclusive Group for peer discussions & updates",
  },
  {
    icon: Download,
    text: "Free Resources: Downloadable e-books, sample videos, and NTA pattern guides",
  },
];

export function NTANetHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-purple-600 via-violet-500 to-fuchsia-600 py-6 lg:py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-1/2 w-1/3 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1774108436551-c05e0561096c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Literature"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-1/4 right-0 h-1/3 w-1/4 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1762554907633-e2f14e742413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Poetry"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-1/4 h-1/2 w-1/3 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1662582631700-676a217d511f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Library"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute right-1/4 bottom-1/4 h-1/3 w-1/4 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1585521551675-64daba4ba31e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Books"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="hidden lg:col-span-3 lg:flex lg:flex-col lg:justify-start lg:gap-4">
            <div className="relative rounded-3xl bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
              <div className="relative h-80 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Education"
                  fill
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-purple-600 shadow-xl">
                Online Learning
              </div>
            </div>

            <div className="rounded-2xl border-2 border-white bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div className="text-left">
                  <p className="mb-1 text-xs text-white sm:text-sm">
                    Course Investment
                  </p>
                  <p className="mb-1 text-xl font-bold text-white sm:text-2xl">
                    Total Fees: <span className="font-bold">Rs 15,300/-</span>
                  </p>
                  <p className="text-xs text-white sm:text-sm">
                    (Initial Registration Fees ={" "}
                    <span className="font-bold">Rs 4,500/-</span>)
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                    Rs 2,700 in 4 installments
                  </p>
                </div>
                <div className="-rotate-3 rounded-lg bg-red-600 px-3 py-2 text-white shadow-xl">
                  <p className="text-xs uppercase tracking-wide">
                    Limited Seats
                  </p>
                  <p className="text-base font-bold">Available!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-1.5 text-white shadow-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
              <span className="text-xs font-bold tracking-wide sm:text-sm">
                NEW BATCH LAUNCH
              </span>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              NTA NET Paper 1 + Paper 2 (English)
            </h2>

            <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
              <p className="text-base font-semibold text-purple-600 sm:text-lg">
                Complete Preparation for NTA NET English
              </p>
              <p className="mt-0.5 text-sm text-gray-700 sm:text-base">
                Interactive Video Lectures Every Week
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.text}
                    className="rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                      <p className="text-xs leading-snug text-gray-800 sm:text-sm">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border-2 border-white bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 p-4 shadow-2xl lg:hidden">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="text-center sm:text-left">
                  <p className="mb-1 text-xs text-white sm:text-sm">
                    Course Investment
                  </p>
                  <p className="mb-1 text-2xl font-bold text-white sm:text-3xl">
                    Total Fees: <span className="font-bold">Rs 15,300/-</span>
                  </p>
                  <p className="text-xs text-white sm:text-sm">
                    (Initial Registration Fees ={" "}
                    <span className="font-bold">Rs 4,500/-</span>)
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                    Rs 2,700 in 4 installments
                  </p>
                </div>
                <div className="-rotate-3 rounded-lg bg-red-600 px-4 py-2 text-white shadow-xl">
                  <p className="text-xs uppercase tracking-wide">
                    Limited Seats
                  </p>
                  <p className="text-base font-bold">Available!</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-base font-semibold text-purple-600 shadow-2xl transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                <span>Enroll Now</span>
              </button>
              <button className="rounded-full border-2 border-white bg-transparent px-6 py-2.5 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-white hover:text-purple-600">
                View Course Details
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-white">
              <div className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-1.5 shadow-lg">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold sm:text-sm">
                  WhatsApp: +91 XXXXX XXXXX
                </span>
              </div>
              <div className="rounded-full bg-red-600 px-3 py-1.5 shadow-lg">
                <span className="text-xs font-bold uppercase sm:text-sm">
                  Admissions Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
