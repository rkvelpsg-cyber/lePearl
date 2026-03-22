import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  ChevronLeft,
  Star,
  Mail,
  Users,
} from "lucide-react";
import { facultyProfiles } from "@/data/facultyData";

export async function generateStaticParams() {
  return facultyProfiles.map((f) => ({ id: String(f.id) }));
}

export default async function FacultyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faculty = facultyProfiles.find((f) => f.id === Number(id));
  if (!faculty) notFound();

  const others = facultyProfiles.filter((f) => f.id !== faculty.id);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #e8f5ff 50%, #f5f0ff 100%)",
      }}
    >
      {/* Top Nav Bar */}
      <div
        className="w-full py-3 px-6 flex items-center justify-between"
        style={{
          background: "linear-gradient(90deg, #12606a 0%, #1e3a8a 100%)",
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white text-sm font-semibold hover:text-cyan-200 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <span className="text-white/80 text-sm font-medium hidden sm:block">
          LePearl Education – Faculty Profile
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* ── HERO CARD ── */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl mb-10 relative"
          style={{
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #312e81 40%, #5b21b6 100%)",
          }}
        >
          {/* decorative circles */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #fff 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #818cf8 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 px-8 py-10 md:px-12 md:py-14">
            {/* Photo */}
            <div className="flex-shrink-0 relative">
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #818cf8, #c084fc)",
                  padding: 3,
                  borderRadius: 20,
                }}
              ></div>
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl relative">
                <Image
                  src={faculty.image}
                  alt={faculty.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
                {faculty.experience}
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-cyan-200 text-xs font-semibold mb-3 border border-white/20">
                <Star className="w-3.5 h-3.5 fill-cyan-300 text-cyan-300" />
                {faculty.title}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
                {faculty.name}
              </h1>
              <p className="text-indigo-200 text-base sm:text-lg font-medium mb-6">
                {faculty.designation}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-white text-sm border border-white/20">
                  <Briefcase className="w-4 h-4 text-cyan-300" />
                  {faculty.experience} Experience
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-white text-sm border border-white/20">
                  <GraduationCap className="w-4 h-4 text-indigo-300" />
                  {faculty.qualifications[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* About – spans 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-7 border border-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">About</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-base">
              {faculty.fullBio}
            </p>
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-2xl shadow-md p-7 border border-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0891b2, #0e7490)",
                }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Qualifications
              </h2>
            </div>
            <ul className="space-y-3">
              {faculty.qualifications.map((q) => (
                <li key={q} className="flex items-start gap-2.5">
                  <span
                    className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    }}
                  />
                  <span className="text-gray-700 text-sm leading-snug">
                    {q}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise */}
          <div className="bg-white rounded-2xl shadow-md p-7 border border-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Areas of Expertise
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {faculty.expertise.map((e) => (
                <span
                  key={e}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={{
                    background: "#ede9fe",
                    color: "#5b21b6",
                    borderColor: "#c4b5fd",
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Subjects Taught */}
          <div className="bg-white rounded-2xl shadow-md p-7 border border-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0f766e, #0d9488)",
                }}
              >
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Subjects Taught
              </h2>
            </div>
            <ul className="space-y-2.5">
              {faculty.subjects.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-teal-800"
                  style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-md p-7 border border-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #b45309, #d97706)",
                }}
              >
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
            </div>
            <ul className="space-y-3">
              {faculty.achievements.map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-snug">
                    {a}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── OTHER FACULTY ── */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span
              className="w-1 h-6 rounded-full inline-block"
              style={{
                background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
              }}
            />
            Other Faculty Members
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.id}
                href={`/faculty/${other.id}`}
                className="group flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 border border-indigo-50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow">
                  <Image
                    src={other.image}
                    alt={other.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate group-hover:text-indigo-700 transition-colors">
                    {other.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {other.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div
        className="mt-10 py-5 text-center text-sm text-gray-500"
        style={{ borderTop: "1px solid #e0e7ff" }}
      >
        © {new Date().getFullYear()} LePearl Education – Centre of Excellence
      </div>
    </div>
  );
}
