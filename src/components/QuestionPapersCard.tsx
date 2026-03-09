import { BookOpen, Download, FileText, GraduationCap } from "lucide-react";

const questionPapers = [
  {
    year: "2023",
    month: "December",
    title: "NET Exam - English Literature",
    topics: ["Literary Criticism", "British Literature", "American Literature"],
  },
  {
    year: "2023",
    month: "June",
    title: "NET Exam - English Literature",
    topics: ["Poetry Analysis", "Drama Studies", "Literary Theory"],
  },
  {
    year: "2022",
    month: "December",
    title: "NET Exam - English Literature",
    topics: ["Postcolonial Literature", "Indian Writing", "Modernism"],
  },
  {
    year: "2022",
    month: "June",
    title: "NET Exam - English Literature",
    topics: ["Shakespeare Studies", "Victorian Literature", "Romanticism"],
  },
];

export function QuestionPapersCard() {
  return (
    <div style={{ paddingTop: 8, paddingBottom: 24, width: "100%" }}>
      <div className="relative" style={{ width: "100%", margin: "0 auto" }}>
        <div
          className="hero-slide-shell relative overflow-hidden shadow-2xl"
          style={{
            width: "100%",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1606326608690-4e0281b1e588?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0JTIwcGFwZXIlMjBxdWl6JTIwc2hlZXR8ZW58MXx8fHwxNzcyNDU4MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-white/40" />

          <div className="hero-slide-content relative z-10 h-full p-4 md:p-6">
            <div className="h-full bg-white/85 backdrop-blur-sm rounded-3xl p-4 md:p-5 flex flex-col gap-4 overflow-hidden">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <GraduationCap className="w-9 h-9 text-indigo-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Previous Year Question Papers
                </h2>
                <p className="text-base md:text-lg text-slate-600 mt-1">
                  NET Exam - English Literature
                </p>
              </div>

              <div className="max-w-5xl mx-auto bg-white/90 border border-indigo-100 shadow-lg rounded-2xl px-4 py-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-1">
                      LePearl Education
                    </h3>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                      Professional coaching for UGC NET English Literature with
                      expert guidance, PYQ analysis, structured curriculum, and
                      personalized mentorship.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {questionPapers.map((paper, index) => (
                  <div
                    key={`${paper.month}-${paper.year}-${index}`}
                    className="bg-white/92 border border-slate-200 rounded-xl p-3 shadow-sm"
                  >
                    <span className="inline-flex text-xs px-2 py-1 rounded-full bg-indigo-600 text-white mb-2">
                      {paper.month} {paper.year}
                    </span>

                    <h4 className="flex items-center gap-1 text-sm font-semibold text-slate-900 mb-1">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      {paper.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-2">
                      Previous Year Paper
                    </p>

                    <p className="text-xs text-slate-600 mb-1">Key Topics:</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {paper.topics.slice(0, 2).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] border border-indigo-300 text-indigo-700 rounded-full px-2 py-0.5"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg py-2 inline-flex items-center justify-center gap-1">
                      <Download className="w-3 h-3" />
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-4 py-3 shadow-xl mt-auto">
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    Why Practice with Previous Year Papers?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-medium">
                        Understand Pattern
                      </h4>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-medium">Boost Confidence</h4>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-medium">Identify Topics</h4>
                    </div>
                  </div>
                  <button className="mt-3 bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 text-sm rounded-lg font-semibold">
                    Contact Us for Coaching
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
