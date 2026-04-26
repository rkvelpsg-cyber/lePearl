"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";

const roles = [
  {
    key: "student",
    icon: GraduationCap,
    title: "Student Login",
    description:
      "Access your course dashboard, track progress, view study materials, and manage your mock tests.",
    href: "/login",
    gradient: "from-purple-600 to-indigo-600",
    border: "border-purple-300",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    btnClass:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
    features: [
      "Course Videos & PDFs",
      "Mock Test Results",
      "Live Classes",
      "Progress Tracker",
    ],
  },
  {
    key: "faculty",
    icon: Users,
    title: "Faculty Login",
    description:
      "Manage your classes, upload study materials, track student performance, and schedule sessions.",
    href: "/faculty-login",
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    btnClass:
      "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
    features: [
      "Upload Materials",
      "Manage Batches",
      "Student Reports",
      "Session Scheduling",
    ],
  },
  {
    key: "admin",
    icon: ShieldCheck,
    title: "Admin Login",
    description:
      "Full platform control — manage users, courses, payments, analytics, and institutional settings.",
    href: "/admin-login",
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-300",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    btnClass:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    features: [
      "User Management",
      "Course Control",
      "Payment Reports",
      "Platform Analytics",
    ],
  },
];

export default function LoginPortal() {
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  function handleRoleClick(role: (typeof roles)[0]) {
    if (role.href) {
      window.location.href = role.href;
    } else {
      setComingSoon(role.key);
      setTimeout(() => setComingSoon(null), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-violet-600/10 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <a href="/" className="inline-flex items-center gap-3 mb-6 group">
            <Image
              src="/LePearl_Logo_Canva_1.png"
              alt="LePearl Education"
              width={52}
              height={52}
              className="rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
              LePearl Education
            </span>
          </a>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-purple-200">
            Choose your login type to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isComingSoon = comingSoon === role.key;
            return (
              <div
                key={role.key}
                className={`relative flex flex-col rounded-2xl border-2 ${role.border} bg-white shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                {/* Top gradient bar */}
                <div
                  className={`h-2 w-full bg-gradient-to-r ${role.gradient}`}
                />

                <div className="flex flex-col flex-1 p-8">
                  {/* Icon */}
                  <div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${role.iconBg}`}
                  >
                    <Icon
                      className={`h-8 w-8 ${role.iconColor}`}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Title & description */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Feature list */}
                  <ul className="mb-8 space-y-2">
                    {role.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r ${role.gradient}`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => handleRoleClick(role)}
                    className={`mt-auto w-full rounded-xl py-3.5 text-base font-bold text-white shadow-md transition-all duration-200 active:scale-95 ${role.btnClass} ${isComingSoon ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {isComingSoon
                      ? "Coming Soon..."
                      : `Login as ${role.title.replace(" Login", "")}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-purple-300">
          New student? If you have not enrolled in a course or do not have login
          credentials yet,{" "}
          <a
            href="/student-registration"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline underline-offset-2 hover:text-purple-200"
          >
            register here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
