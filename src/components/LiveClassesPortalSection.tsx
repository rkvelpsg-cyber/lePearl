"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Chrome,
  Clock,
  FileText,
  HelpCircle,
  Lock,
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
    subject: "UGC NET English Literature",
    faculty: "Dr Prem Shankar Pandey",
    date: "Today",
    time: "7:45 PM - 9:00 PM",
    status: "live",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=500&fit=crop",
  },
  {
    id: "2",
    subject: "Advanced Grammar and Composition",
    faculty: "Prof. Sarah Williams",
    date: "Tomorrow",
    time: "6:00 PM - 7:30 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=500&fit=crop",
  },
  {
    id: "3",
    subject: "British Romantic Poetry",
    faculty: "Dr. Rajesh Kumar",
    date: "March 9, 2026",
    time: "8:00 PM - 9:30 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=500&fit=crop",
  },
  {
    id: "4",
    subject: "Shakespeare Studies",
    faculty: "Prof. Emily Thompson",
    date: "March 10, 2026",
    time: "7:00 PM - 8:30 PM",
    status: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=500&fit=crop",
  },
];

export function NeedHelpSection() {
  return (
    <section
      id="need-help"
      className="w-full bg-slate-100 px-4 py-16 sm:px-6 lg:px-8"
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section
      id="live-class"
      className="w-full bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-indigo-700 shadow-sm">
            <Video className="h-4 w-4" />
            <span className="text-sm font-semibold">Live Classes Portal</span>
          </div>
          <h2 className="mb-3 text-4xl font-bold text-indigo-900">
            Join Live Class Sessions
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Access your live classes with expert faculty, track upcoming
            sessions, and get support when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg lg:col-span-2">
            <h3 className="mb-2 text-2xl font-bold text-indigo-900">
              Student Login
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Access your personalized dashboard and join live sessions
              instantly.
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email / Username
                </span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or username"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 outline-none ring-indigo-200 transition focus:ring-2"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 outline-none ring-indigo-200 transition focus:ring-2"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-700 py-3 font-semibold text-white transition hover:bg-indigo-800"
              >
                Login to Attend Class
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Chrome className="h-4 w-4" />
                Sign in with Google
              </button>
            </form>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-700" />
              <h3 className="text-2xl font-bold text-indigo-900">
                Upcoming Live Classes
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {mockClasses.map((classItem) => (
                <article
                  key={classItem.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-44">
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
                  <div className="space-y-2 p-4">
                    <h4 className="text-lg font-bold text-slate-800">
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
                    <button
                      type="button"
                      className={`mt-2 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition ${
                        classItem.status === "live"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-indigo-700 hover:bg-indigo-800"
                      }`}
                    >
                      {classItem.status === "live"
                        ? "Join Live Class Now"
                        : "Join Class"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
