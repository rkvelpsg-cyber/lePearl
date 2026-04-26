"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import {
  StudentRegistrationPayload,
  studentRegistrationCourses,
} from "@/lib/studentRegistration";

const initialForm: StudentRegistrationPayload = {
  fullName: "",
  qualification: "",
  course: studentRegistrationCourses[0],
  phone: "",
  email: "",
};

type SubmissionState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function StudentRegistrationPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    type: "idle",
  });

  function updateField<K extends keyof StudentRegistrationPayload>(
    field: K,
    value: StudentRegistrationPayload[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionState({ type: "idle" });

    try {
      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "Registration could not be submitted right now.",
        );
      }

      setSubmissionState({
        type: "success",
        message:
          result.message ??
          "Registration submitted successfully. Our team will contact you soon.",
      });
      setFormData(initialForm);
    } catch (error) {
      setSubmissionState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Registration could not be submitted right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#2e1065_50%,#111827_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/login-portal"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login portal
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/8 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
            <div className="relative">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-fuchsia-200">
                <GraduationCap className="h-8 w-8" />
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-fuchsia-200/90">
                Student Registration
              </p>
              <h1 className="max-w-md text-4xl font-bold tracking-tight sm:text-5xl">
                Start your enrollment request with LePearl Education
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-purple-100/90 sm:text-lg">
                Fill in your details and select the course you want to join.
                Once submitted, the registration request will be emailed
                directly to the admissions team.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: <UserRound className="h-5 w-5" />,
                    title: "Admissions review",
                    description:
                      "Your details are sent to the LePearl admissions mailbox for follow-up.",
                  },
                  {
                    icon: <FileText className="h-5 w-5" />,
                    title: "Course-specific requests",
                    description:
                      "Choose from NET, state exams, communication training, interviews, and research support.",
                  },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    title: "Direct callback",
                    description:
                      "Share the best contact number so the team can guide you on enrollment and login access.",
                  },
                  {
                    icon: <Mail className="h-5 w-5" />,
                    title: "Credential assistance",
                    description:
                      "Students without existing login credentials can use this form to begin the process.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-fuchsia-100">
                      {item.icon}
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-purple-100/80">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-600">
                Registration Form
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Submit your enrollment details
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter accurate details so the admissions team can help you
                enroll in the right course and provide login credentials where
                applicable.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    placeholder="Enter your full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Qualification
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(event) =>
                      updateField("qualification", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    placeholder="e.g. M.A. English, M.Phil., M.Sc."
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Course Interested In
                </span>
                <select
                  required
                  value={formData.course}
                  onChange={(event) =>
                    updateField(
                      "course",
                      event.target
                        .value as StudentRegistrationPayload["course"],
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  {studentRegistrationCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Contact Number
                  </span>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    placeholder="Enter your contact number"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Email ID
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    placeholder="Enter your email address"
                  />
                </label>
              </div>

              {submissionState.type !== "idle" ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    submissionState.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {submissionState.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    ) : null}
                    <span>{submissionState.message}</span>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[linear-gradient(90deg,#7c3aed,#4f46e5)] px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Submitting registration..."
                  : "Submit Registration"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
