import {
  Award,
  BookOpen,
  Clock,
  Globe,
  GraduationCap,
  Users,
} from "lucide-react";

const categories = [
  "UGC Net Paper-1",
  "UGC Net Paper-2 (English Literature)",
  "Reaserch Assistance",
  "SET English",
];

export function SecondHeroCard() {
  return (
    <div style={{ paddingTop: 8, paddingBottom: 24, width: "100%" }}>
      <div className="relative" style={{ width: "100%", margin: "0 auto" }}>
        <div
          className="hero-slide-shell relative overflow-hidden shadow-2xl"
          style={{ width: "100%" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1729575559925-671e80a415b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBvbmxpbmUlMjBsZWFybmluZyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzI0NTM2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)",
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="hero-slide-content relative z-10 p-5 md:p-8">
            <div className="mx-auto w-[95%] md:w-[92%] bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 md:p-4 mx-3 mt-3 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-10 h-10" />
                  <h1 className="text-3xl md:text-4xl font-bold">
                    LePearl Education
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-blue-50">
                  Unlock Your Potential with Our Premium Online Courses
                </p>
              </div>

              <div className="p-3 md:p-4 mx-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Learn Anywhere, Anytime
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    LePearl Education offers world-class online courses designed
                    to help you excel in your career and personal growth. Our
                    expert instructors and cutting-edge curriculum ensure you
                    receive the highest quality education from the comfort of
                    your home.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-10 h-10 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Flexible Schedule
                    </h3>
                    <p className="text-sm text-gray-600">
                      Learn at your own pace, on your own time
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-lg">
                    <Award className="w-10 h-10 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Certified Programs
                    </h3>
                    <p className="text-sm text-gray-600">
                      Earn recognized certificates upon completion
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 bg-indigo-50 rounded-lg">
                    <Users className="w-10 h-10 text-indigo-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Expert Instructors
                    </h3>
                    <p className="text-sm text-gray-600">
                      Learn from industry professionals
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Popular Course Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="bg-gray-100 px-4 py-3 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 py-5 border-y border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">200+</div>
                    <div className="text-sm text-gray-600 mt-1">Course</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      500+
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Active Students
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      95%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Success Rate
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pb-3">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5" />
                    Explore Courses
                  </button>
                  <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Get Started Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
