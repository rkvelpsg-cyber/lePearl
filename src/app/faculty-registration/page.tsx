"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type FacultyFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  education: string;
  netCategory: string;
  address: string;
  guardianName: string;
  skills: string;
  teachingMode: string;
  researchExperience: string;
  papersPublished: string;
  expertise: string;
};

const initialForm: FacultyFormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  education: "",
  netCategory: "",
  address: "",
  guardianName: "",
  skills: "",
  teachingMode: "",
  researchExperience: "",
  papersPublished: "",
  expertise: "",
};

type SubmissionState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function FacultyRegistrationPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    type: "idle",
  });

  function updateField<K extends keyof FacultyFormState>(
    key: K,
    value: FacultyFormState[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionState({ type: "idle" });

    try {
      const response = await fetch("/api/faculty-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to submit faculty form.");
      }

      setSubmissionState({
        type: "success",
        message:
          result.message ??
          "Faculty registration submitted successfully. Admin will review your profile.",
      });
      setFormData(initialForm);
    } catch (error) {
      setSubmissionState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit faculty form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_bottom_right,#fce7f3,transparent_35%),#f8fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <section className="px-6 pb-8 pt-10 text-center sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Become a Faculty at LePearl
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Faculty Registration Form
          </h1>
          <p className="mt-3 text-slate-600">
            Submit your profile for academic review and onboarding.
          </p>
        </section>

        <div className="h-[4px] w-full bg-violet-600" />

        <form onSubmit={handleSubmit} className="space-y-7 px-6 py-8 sm:px-10">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Name *
              <input
                required
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={inputClassName}
                placeholder="Full name"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Email *
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClassName}
                placeholder="you@example.com"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              WhatsApp *
              <input
                required
                value={formData.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                className={inputClassName}
                placeholder="+91 9876543210"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Education *
              <input
                required
                value={formData.education}
                onChange={(e) => updateField("education", e.target.value)}
                className={inputClassName}
                placeholder="Highest qualification"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              NET/JRF/PhD Category *
              <select
                required
                value={formData.netCategory}
                onChange={(e) => updateField("netCategory", e.target.value)}
                className={inputClassName}
              >
                <option value="">Select category</option>
                <option value="NET">NET</option>
                <option value="JRF">JRF</option>
                <option value="PhD">PhD</option>
                <option value="NET + JRF">NET + JRF</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Guardian Name
              <input
                value={formData.guardianName}
                onChange={(e) => updateField("guardianName", e.target.value)}
                className={inputClassName}
                placeholder="Guardian/parent"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Address *
              <input
                required
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className={inputClassName}
                placeholder="Full address"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Skills *
              <textarea
                required
                value={formData.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                className={`${inputClassName} min-h-24 resize-y`}
                placeholder="Teaching, content creation, mentoring, etc."
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Teaching Mode *
              <select
                required
                value={formData.teachingMode}
                onChange={(e) => updateField("teachingMode", e.target.value)}
                className={inputClassName}
              >
                <option value="">Select mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Research Experience
              <input
                value={formData.researchExperience}
                onChange={(e) =>
                  updateField("researchExperience", e.target.value)
                }
                className={inputClassName}
                placeholder="Years / area"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Papers Published
              <input
                value={formData.papersPublished}
                onChange={(e) => updateField("papersPublished", e.target.value)}
                className={inputClassName}
                placeholder="Count or key journals"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Expertise *
              <input
                required
                value={formData.expertise}
                onChange={(e) => updateField("expertise", e.target.value)}
                className={inputClassName}
                placeholder="Primary subject expertise"
              />
            </label>
          </div>

          {submissionState.type !== "idle" && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                submissionState.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              <div className="flex items-start gap-2">
                {submissionState.type === "success" && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
                <span>{submissionState.message}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[linear-gradient(90deg,#7c3aed,#2563eb)] px-6 py-4 text-lg font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Submitting faculty profile..."
              : "Submit Faculty Registration"}
          </button>
        </form>
      </div>
    </main>
  );
}
