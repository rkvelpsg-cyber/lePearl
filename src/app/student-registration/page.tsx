"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  StudentRegistrationPayload,
  studentRegistrationCourses,
} from "@/lib/studentRegistration";

type RegistrationFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  course: StudentRegistrationPayload["course"];
  educationLevel: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  heardAboutUs: string;
  additionalComments: string;
};

const initialForm: RegistrationFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  zipCode: "",
  country: "",
  course:
    studentRegistrationCourses[0] ??
    ("" as StudentRegistrationPayload["course"]),
  educationLevel: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  heardAboutUs: "",
  additionalComments: "",
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
  const safeFormData: RegistrationFormState = { ...initialForm, ...formData };

  function updateField<K extends keyof RegistrationFormState>(
    field: K,
    value: RegistrationFormState[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionState({ type: "idle" });

    try {
      const payload: StudentRegistrationPayload = {
        fullName: `${safeFormData.firstName} ${safeFormData.lastName}`.trim(),
        qualification: safeFormData.educationLevel,
        course: safeFormData.course,
        phone: safeFormData.phone,
        email: safeFormData.email,
      };

      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const inputClassName =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  const labelClassName = "text-xl font-semibold text-violet-700";

  const sectionDividerClassName = "mt-2 h-[2px] w-full bg-violet-200";

  return (
    <main className="min-h-screen bg-[#ebe8f0] px-3 py-4 sm:px-6 sm:py-8">
      <header className="mx-auto mb-4 flex w-full max-w-5xl items-center justify-end">
        <Link
          href="/login-portal"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login portal
        </Link>
      </header>

      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <section className="px-5 pb-8 pt-10 text-center sm:px-10">
          <Image
            src="/LePearl_Logo_Canva_1.png"
            alt="LePearl Education"
            width={150}
            height={85}
            className="mx-auto h-auto w-[150px] object-contain"
            priority
          />
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Student Registration Form
          </h1>
          <p className="mt-3 text-xl text-slate-600">
            Begin your journey with LePearl Education - Pioneering Human
            Excellence
          </p>
        </section>

        <div className="h-[4px] w-full bg-violet-600" />

        <form className="space-y-12 px-5 py-9 sm:px-10" onSubmit={handleSubmit}>
          <section>
            <h2 className={labelClassName}>Personal Information</h2>
            <div className={sectionDividerClassName} />
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <label className="text-lg font-medium text-slate-700">
                First Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={safeFormData.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Enter your first name"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Last Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={safeFormData.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Enter your last name"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Email Address <span className="text-red-500">*</span>
                <input
                  type="email"
                  required
                  value={safeFormData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={inputClassName}
                  placeholder="your.email@example.com"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Phone Number <span className="text-red-500">*</span>
                <input
                  type="tel"
                  required
                  value={safeFormData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={inputClassName}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Date of Birth
                <input
                  type="date"
                  value={safeFormData.dob}
                  onChange={(event) => updateField("dob", event.target.value)}
                  className={inputClassName}
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Gender
                <select
                  value={safeFormData.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value)
                  }
                  className={inputClassName}
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </label>
            </div>
          </section>

          <section>
            <h2 className={labelClassName}>Address Information</h2>
            <div className={sectionDividerClassName} />
            <div className="mt-7 grid gap-6 md:grid-cols-4">
              <label className="text-lg font-medium text-slate-700 md:col-span-4">
                Street Address
                <input
                  type="text"
                  value={safeFormData.streetAddress}
                  onChange={(event) =>
                    updateField("streetAddress", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="123 Main Street"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                City
                <input
                  type="text"
                  value={safeFormData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className={inputClassName}
                  placeholder="City"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                State/Province
                <input
                  type="text"
                  value={safeFormData.stateProvince}
                  onChange={(event) =>
                    updateField("stateProvince", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="State"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                ZIP/Postal Code
                <input
                  type="text"
                  value={safeFormData.zipCode}
                  onChange={(event) =>
                    updateField("zipCode", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="12345"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Country
                <input
                  type="text"
                  value={safeFormData.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Country"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className={labelClassName}>Academic Information</h2>
            <div className={sectionDividerClassName} />
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <label className="text-lg font-medium text-slate-700">
                Course of Interest <span className="text-red-500">*</span>
                <select
                  required
                  value={safeFormData.course}
                  onChange={(event) =>
                    updateField(
                      "course",
                      event.target
                        .value as StudentRegistrationPayload["course"],
                    )
                  }
                  className={inputClassName}
                >
                  {studentRegistrationCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-lg font-medium text-slate-700">
                Previous/Current Education Level
                <input
                  type="text"
                  required
                  value={safeFormData.educationLevel}
                  onChange={(event) =>
                    updateField("educationLevel", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="e.g. B.A., M.A., NET qualified"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className={labelClassName}>Guardian/Parent Information</h2>
            <div className={sectionDividerClassName} />
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <label className="text-lg font-medium text-slate-700">
                Guardian Name
                <input
                  type="text"
                  value={safeFormData.guardianName}
                  onChange={(event) =>
                    updateField("guardianName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Parent/Guardian full name"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Guardian Phone
                <input
                  type="tel"
                  value={safeFormData.guardianPhone}
                  onChange={(event) =>
                    updateField("guardianPhone", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label className="text-lg font-medium text-slate-700 md:col-span-2">
                Guardian Email
                <input
                  type="email"
                  value={safeFormData.guardianEmail}
                  onChange={(event) =>
                    updateField("guardianEmail", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="guardian@example.com"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className={labelClassName}>Emergency Contact</h2>
            <div className={sectionDividerClassName} />
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <label className="text-lg font-medium text-slate-700">
                Emergency Contact Name
                <input
                  type="text"
                  value={safeFormData.emergencyContactName}
                  onChange={(event) =>
                    updateField("emergencyContactName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Emergency contact full name"
                />
              </label>

              <label className="text-lg font-medium text-slate-700">
                Emergency Contact Phone
                <input
                  type="tel"
                  value={safeFormData.emergencyContactPhone}
                  onChange={(event) =>
                    updateField("emergencyContactPhone", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="+91 98765 43210"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className={labelClassName}>Additional Information</h2>
            <div className={sectionDividerClassName} />
            <div className="mt-7 grid gap-6">
              <label className="text-lg font-medium text-slate-700">
                How did you hear about us?
                <select
                  value={safeFormData.heardAboutUs}
                  onChange={(event) =>
                    updateField("heardAboutUs", event.target.value)
                  }
                  className={inputClassName}
                >
                  <option value="">Please select</option>
                  <option value="google">Google Search</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="friend">Friend/Referral</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="text-lg font-medium text-slate-700">
                Additional Comments/Questions
                <textarea
                  value={safeFormData.additionalComments}
                  onChange={(event) =>
                    updateField("additionalComments", event.target.value)
                  }
                  className={`${inputClassName} min-h-36 resize-y`}
                  placeholder="Please share any additional information or questions you may have..."
                />
              </label>
            </div>
          </section>

          {submissionState.type !== "idle" ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
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
            className="w-full rounded-xl bg-[linear-gradient(90deg,#9333ea,#2563eb)] px-6 py-4 text-2xl font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Submitting registration..."
              : "Submit Registration"}
          </button>

          <p className="text-center text-sm leading-7 text-slate-600 sm:text-lg">
            By submitting this form, you agree to our terms and conditions. Our
            admissions team will review your application and contact you within
            2-3 business days.
          </p>
        </form>

        <footer className="border-t border-slate-200 bg-violet-50 px-4 py-5 text-center text-sm text-slate-600 sm:text-base">
          © 2026 LePearl Education. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
