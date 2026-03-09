import { Award, BookOpen, GraduationCap, Users } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Expert Guidance",
    description: "Experienced mentors with Ph.D. qualifications",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description: "From proposal writing to thesis completion",
  },
  {
    icon: Users,
    title: "Personalized Support",
    description: "One-on-one coaching tailored to your research",
  },
  {
    icon: Award,
    title: "Proven Success",
    description: "Track record of successful research completions",
  },
];

export function ResearchAssistanceCard() {
  return (
    <div style={{ paddingTop: 8, paddingBottom: 24, width: "100%" }}>
      <div className="relative" style={{ width: "100%", margin: "0 auto" }}>
        <div
          className="hero-slide-shell relative overflow-hidden shadow-2xl"
          style={{ width: "100%" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

          <div className="hero-slide-content relative z-10 h-full p-4 md:p-6">
            <div className="h-full w-full bg-white/85 backdrop-blur-sm rounded-3xl p-4 md:p-5 flex flex-col gap-4 overflow-hidden">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
                  Ph.D Research Assistance
                </h2>
                <p className="text-base md:text-lg text-gray-600 mt-2">
                  LePearl Education: Empowering Research Associates with
                  Professional Coaching
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <div className="grid grid-cols-2 gap-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-3">
                  <div className="col-span-2 rounded-lg overflow-hidden shadow-lg h-52 md:h-60">
                    <img
                      src="https://images.unsplash.com/photo-1741795822013-570c944ac5bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGQlMjByZXNlYXJjaCUyMHN0dWRlbnQlMjBsaWJyYXJ5fGVufDF8fHx8MTc3MjQ1NzAxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Research student in library"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg h-28 md:h-32">
                    <img
                      src="https://images.unsplash.com/photo-1760493828288-d2dbb70d18c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwbWljcm9zY29wZSUyMGxhYnxlbnwxfHx8fDE3NzI0NTcwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Academic research lab"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg h-28 md:h-32">
                    <img
                      src="https://images.unsplash.com/photo-1764096535068-0e9f652e03f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVzaXMlMjB3cml0aW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MjQ1NzAxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Thesis writing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-start bg-white/75 rounded-2xl p-4 md:p-5 border border-indigo-100">
                  <div className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full mb-4 w-max">
                    Professional Coaching Program
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Transform Your Research Journey
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-2 text-sm md:text-base">
                    At{" "}
                    <span className="text-indigo-700">LePearl Education</span>,
                    we understand that pursuing a Ph.D. is both challenging and
                    rewarding.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    Receive expert guidance in methodology, literature review,
                    data analysis, academic writing, and publication strategy.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white/90 border border-indigo-100 rounded-xl p-3 shadow-sm"
                  >
                    <div className="mb-2 inline-flex p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-indigo-100 text-sm md:text-base">
                  Ready to excel in your research with professional coaching?
                </p>
                <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-lg shadow-lg font-semibold hover:shadow-xl transition-shadow duration-300">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
