"use client";

import Image from "next/image";
import {
  Calendar,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  User,
  Video,
} from "lucide-react";

type ClassData = {
  id: string;
  subject: string;
  faculty: string;
  date: string;
  time: string;
  status: "live" | "upcoming";
  thumbnail: string;
};

const mockClasses: ClassData[] = [
  {
    id: "1",
    subject: "MPPSC",
    faculty: "Dr Prem Shankar Pandey",
    date: "Today",
    time: "7:45 PM - 9:00 PM",
    status: "live",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=500&fit=crop",
  },
  {
    id: "2",
    subject: "NTA NET Paper 1 & Paper 2 (English)",
    faculty: "Prof. Sarah Williams",
    date: "Tomorrow",
    time: "6:00 PM - 7:30 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=500&fit=crop",
  },
  {
    id: "3",
    subject: "LT Grade",
    faculty: "Dr. Rajesh Kumar",
    date: "March 9, 2026",
    time: "8:00 PM - 9:30 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=500&fit=crop",
  },
  {
    id: "4",
    subject: "UP GDC",
    faculty: "Prof. Emily Thompson",
    date: "March 10, 2026",
    time: "7:00 PM - 8:30 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=500&fit=crop",
  },
  {
    id: "5",
    subject: "UPHESC",
    faculty: "Prof. Sarah Williams",
    date: "March 11, 2026",
    time: "6:30 PM - 8:00 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=500&fit=crop",
  },
  {
    id: "6",
    subject: "GIC",
    faculty: "Dr Prem Shankar Pandey",
    date: "March 12, 2026",
    time: "7:15 PM - 8:45 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=500&fit=crop",
  },
];

export function NeedHelpSection() {
  return (
    <section
      id="need-help"
      className="w-full px-4 py-16 sm:px-6 lg:px-8"
      style={{ background: "rgba(255, 255, 255, 0.22)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-700" />
          <h3 className="text-2xl font-bold text-indigo-900">Need Help?</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <HelpCircle className="mb-2 h-8 w-8 text-indigo-700" />
            <h4 className="mb-1 text-lg font-bold text-slate-800">
              Technical Support
            </h4>
            <p className="text-sm text-slate-600">
              Resolve connection, audio, and video issues quickly.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <FileText className="mb-2 h-8 w-8 text-indigo-700" />
            <h4 className="mb-1 text-lg font-bold text-slate-800">
              Class Guidelines
            </h4>
            <p className="text-sm text-slate-600">
              Learn online class etiquette and participation best practices.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Mail className="mb-2 h-8 w-8 text-indigo-700" />
            <h4 className="mb-1 text-lg font-bold text-slate-800">
              Contact Admin
            </h4>
            <p className="text-sm text-slate-600">
              Reach out for schedule, enrollment, and general support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiveClassesPortalSection() {
  return (
    <section
      id="live-class"
      className="w-full bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-teal-700 shadow-sm">
            <Video className="h-4 w-4" />
            <span className="text-sm font-semibold">Live Classes Portal</span>
          </div>
          <h2 className="mb-3 text-4xl font-bold text-teal-900">
            Join Live Class Sessions
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Access your live classes with expert faculty, track upcoming
            sessions, and get support when you need it.
          </p>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-700" />
            <h3 className="text-2xl font-bold text-teal-900">
              Upcoming Live Classes
            </h3>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockClasses.map((classItem) => (
              <article
                key={classItem.id}
                className="flex h-full min-h-[460px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52">
                  <Image
                    src={classItem.thumbnail}
                    alt={classItem.subject}
                    fill
                    className="object-cover"
                  />
                  {classItem.status === "live" && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      LIVE NOW
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col space-y-2.5 p-5">
                  <h4 className="min-h-[3.5rem] text-xl font-bold text-slate-800">
                    {classItem.subject}
                  </h4>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="h-4 w-4" />
                    Faculty: {classItem.faculty}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    {classItem.date}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    {classItem.time}
                  </p>
                  <a
                    href="/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto block w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white transition ${
                      classItem.status === "live"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-teal-700 hover:bg-teal-800"
                    }`}
                    style={{ color: "#FFFFFF" }}
                  >
                    {classItem.status === "live"
                      ? "Join Live Class Now"
                      : "Join Class"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
