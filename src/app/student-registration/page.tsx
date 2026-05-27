"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import {
  defaultPaidRegistrationCourseFee,
  paidRegistrationCourseFees,
  StudentRegistrationPayload,
  studentRegistrationCourses,
} from "@/lib/studentRegistration";

type RazorpayOrderResponse = {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  error?: string;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type PaidEnrollmentFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  course: StudentRegistrationPayload["course"];
  username: string;
  password: string;
  registrationNo: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedRefund: boolean;
  isPearlian: boolean;
  pearlianEligible: boolean;
  includeBooksAddon: boolean;
};

type FreeRegistrationFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  examPreparingFor: string;
  heardAboutUs: string;
};

function generateRegistrationNo() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const seed = Math.floor(1000 + Math.random() * 9000);
  return `LP-${stamp}-${seed}`;
}

function loadRazorpayCheckoutScript() {
  return new Promise<void>((resolve, reject) => {
    if ((window as unknown as Record<string, unknown>).Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Razorpay checkout script."));
    document.body.appendChild(script);
  });
}

const initialPaidForm = (): PaidEnrollmentFormState => ({
  fullName: "",
  email: "",
  whatsapp: "",
  course:
    studentRegistrationCourses[0] ??
    ("" as StudentRegistrationPayload["course"]),
  username: "",
  password: "",
  registrationNo: generateRegistrationNo(),
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedRefund: false,
  isPearlian: false,
  pearlianEligible: false,
  includeBooksAddon: false,
});

const initialFreeForm: FreeRegistrationFormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  examPreparingFor: "",
  heardAboutUs: "",
};

type SubmissionState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const REGISTRATION_UNLOCK_KEY = "lepearl-registration-submitted";

const booksAddonFee = 2499;

export default function StudentRegistrationPage() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<"paid" | "free">("paid");
  const [paidFormData, setPaidFormData] =
    useState<PaidEnrollmentFormState>(initialPaidForm());
  const [freeFormData, setFreeFormData] =
    useState<FreeRegistrationFormState>(initialFreeForm);
  const [isSubmittingPaid, setIsSubmittingPaid] = useState(false);
  const [isSubmittingFree, setIsSubmittingFree] = useState(false);
  const [paidSubmissionState, setPaidSubmissionState] =
    useState<SubmissionState>({
      type: "idle",
    });
  const [freeSubmissionState, setFreeSubmissionState] =
    useState<SubmissionState>({
      type: "idle",
    });
  const safePaidFormData: PaidEnrollmentFormState = {
    ...initialPaidForm(),
    ...paidFormData,
  };
  const safeFreeFormData: FreeRegistrationFormState = {
    ...initialFreeForm,
    ...freeFormData,
  };

  const baseCourseFee =
    paidRegistrationCourseFees[safePaidFormData.course] ??
    defaultPaidRegistrationCourseFee;
  const pearlianDiscount =
    safePaidFormData.isPearlian && safePaidFormData.pearlianEligible
      ? Math.round(baseCourseFee * 0.1)
      : 0;
  const booksFee = safePaidFormData.includeBooksAddon ? booksAddonFee : 0;
  const finalPayable = Math.max(baseCourseFee - pearlianDiscount + booksFee, 0);

  const allConsentsChecked =
    safePaidFormData.acceptedTerms &&
    safePaidFormData.acceptedPrivacy &&
    safePaidFormData.acceptedRefund;

  const passwordValidation = useMemo(() => {
    const v = safePaidFormData.password;
    const hasUpper = /[A-Z]/.test(v);
    const hasLower = /[a-z]/.test(v);
    const hasNumber = /\d/.test(v);
    const hasSpecial = /[^A-Za-z0-9]/.test(v);
    return v.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
  }, [safePaidFormData.password]);

  useEffect(() => {
    const modeParam = new URLSearchParams(window.location.search).get("mode");
    if (modeParam === "free") {
      setActiveMode("free");
    }
  }, []);

  function updatePaidField<K extends keyof PaidEnrollmentFormState>(
    field: K,
    value: PaidEnrollmentFormState[K],
  ) {
    setPaidFormData((current) => ({ ...current, [field]: value }));
  }

  function updateFreeField<K extends keyof FreeRegistrationFormState>(
    field: K,
    value: FreeRegistrationFormState[K],
  ) {
    setFreeFormData((current) => ({ ...current, [field]: value }));
  }

  async function handlePaidSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allConsentsChecked || !passwordValidation) return;

    setIsSubmittingPaid(true);
    setPaidSubmissionState({ type: "idle" });

    try {
      const payload: StudentRegistrationPayload = {
        fullName: safePaidFormData.fullName.trim(),
        qualification: "Paid Enrolment",
        course: safePaidFormData.course,
        phone: safePaidFormData.whatsapp,
        email: safePaidFormData.email,
      };

      const orderResponse = await fetch(
        "/api/student-registration/create-payment-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finalPayable,
            description: `Paid Enrolment - ${safePaidFormData.course}`,
            fullName: payload.fullName,
            email: payload.email,
            whatsapp: payload.phone,
            course: payload.course,
            registrationNo: safePaidFormData.registrationNo,
          }),
        },
      );

      const orderData = (await orderResponse.json()) as RazorpayOrderResponse;
      if (!orderResponse.ok) {
        throw new Error(
          orderData.error ?? "Unable to create secure payment order.",
        );
      }

      await loadRazorpayCheckoutScript();

      const payment = await new Promise<RazorpaySuccessResponse>(
        (resolve, reject) => {
          const RazorpayCheckout = (
            window as unknown as {
              Razorpay: new (options: Record<string, unknown>) => {
                open: () => void;
              };
            }
          ).Razorpay;

          if (!RazorpayCheckout) {
            reject(new Error("Razorpay checkout is unavailable."));
            return;
          }

          const checkout = new RazorpayCheckout({
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "LePearl Education",
            description: `Paid Enrolment - ${safePaidFormData.course}`,
            order_id: orderData.order_id,
            prefill: {
              name: payload.fullName,
              email: payload.email,
              contact: payload.phone,
            },
            theme: { color: "#7c3aed" },
            handler: (response: RazorpaySuccessResponse) => resolve(response),
            modal: {
              ondismiss: () => reject(new Error("PAYMENT_CANCELLED")),
            },
          });

          checkout.open();
        },
      );

      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          mode: "paid",
          registrationNo: safePaidFormData.registrationNo,
          username: safePaidFormData.username,
          acceptedTerms: safePaidFormData.acceptedTerms,
          acceptedPrivacy: safePaidFormData.acceptedPrivacy,
          acceptedRefund: safePaidFormData.acceptedRefund,
          isPearlian: safePaidFormData.isPearlian,
          pearlianEligible: safePaidFormData.pearlianEligible,
          includeBooksAddon: safePaidFormData.includeBooksAddon,
          baseCourseFee,
          discountAmount: pearlianDiscount,
          booksFee,
          finalPayable,
          paymentMode: "razorpay",
          paymentAmount: Number(orderData.amount) / 100,
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "Paid enrolment could not be submitted right now.",
        );
      }

      setPaidSubmissionState({
        type: "success",
        message:
          result.message ??
          "Paid enrolment completed successfully. Redirecting to dashboard...",
      });
      setPaidFormData(initialPaidForm());
      window.setTimeout(() => {
        router.push("/login-portal");
      }, 1400);
    } catch (error) {
      setPaidSubmissionState({
        type: "error",
        message:
          error instanceof Error
            ? error.message === "PAYMENT_CANCELLED"
              ? "Payment was cancelled. Complete secure payment to finish paid enrolment."
              : error.message
            : "Paid enrolment could not be submitted right now.",
      });
    } finally {
      setIsSubmittingPaid(false);
    }
  }

  async function handleFreeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingFree(true);
    setFreeSubmissionState({ type: "idle" });

    try {
      const payload: StudentRegistrationPayload = {
        fullName: safeFreeFormData.fullName.trim(),
        qualification: safeFreeFormData.examPreparingFor,
        course: (studentRegistrationCourses[0] ??
          "MPPSC") as StudentRegistrationPayload["course"],
        phone: safeFreeFormData.whatsapp,
        email: safeFreeFormData.email,
      };

      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          mode: "free",
          heardAboutUs: safeFreeFormData.heardAboutUs,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "Free registration could not be submitted right now.",
        );
      }

      setFreeSubmissionState({
        type: "success",
        message:
          result.message ??
          "Free registration submitted. Redirecting you to PYQ library...",
      });
      window.localStorage.setItem(
        REGISTRATION_UNLOCK_KEY,
        JSON.stringify({
          submittedAt: new Date().toISOString(),
          email: payload.email,
          phone: payload.phone,
        }),
      );
      setFreeFormData(initialFreeForm);
      window.setTimeout(() => {
        router.push("/#pyqs");
      }, 1200);
    } catch (error) {
      setFreeSubmissionState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Free registration could not be submitted right now.",
      });
    } finally {
      setIsSubmittingFree(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_35%),radial-gradient(circle_at_bottom_right,#fbcfe8,transparent_35%),#f8fafc] px-3 py-4 sm:px-6 sm:py-8">
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
            Enrolment & Registration Hub
          </h1>
          <p className="mt-3 text-xl text-slate-600">
            Choose paid enrolment for full dashboard access or free registration
            for PYQs and demo content.
          </p>
        </section>

        <div className="h-[4px] w-full bg-violet-600" />

        <div className="px-5 pt-8 sm:px-10">
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => setActiveMode("paid")}
              className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold transition ${
                activeMode === "paid"
                  ? "bg-white text-violet-700 shadow"
                  : "text-slate-600"
              }`}
            >
              Paid Enrolment
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("free")}
              className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold transition ${
                activeMode === "free"
                  ? "bg-white text-violet-700 shadow"
                  : "text-slate-600"
              }`}
            >
              Free Registration
            </button>
          </div>
        </div>

        {activeMode === "paid" ? (
          <form
            className="space-y-9 px-5 py-9 sm:px-10"
            onSubmit={handlePaidSubmit}
          >
            <section className="grid gap-6 md:grid-cols-2">
              <label className="text-base font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={safePaidFormData.fullName}
                  onChange={(event) =>
                    updatePaidField("fullName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Enter your full name"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
                <input
                  type="email"
                  required
                  value={safePaidFormData.email}
                  onChange={(event) =>
                    updatePaidField("email", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="you@example.com"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                WhatsApp Number <span className="text-red-500">*</span>
                <input
                  type="tel"
                  required
                  value={safePaidFormData.whatsapp}
                  onChange={(event) =>
                    updatePaidField("whatsapp", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="+91 9876543210"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                Course <span className="text-red-500">*</span>
                <select
                  required
                  value={safePaidFormData.course}
                  onChange={(event) =>
                    updatePaidField(
                      "course",
                      event.target
                        .value as StudentRegistrationPayload["course"],
                    )
                  }
                  className={`${inputClassName} cursor-pointer`}
                >
                  {studentRegistrationCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-base font-semibold text-slate-700">
                Username <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={safePaidFormData.username}
                  onChange={(event) =>
                    updatePaidField("username", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Choose your username"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                Case-sensitive Password <span className="text-red-500">*</span>
                <input
                  type="password"
                  required
                  value={safePaidFormData.password}
                  onChange={(event) =>
                    updatePaidField("password", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="At least 8 chars + special character"
                />
                {!passwordValidation &&
                  safePaidFormData.password.length > 0 && (
                    <p className="mt-2 text-xs text-rose-600">
                      Password must include uppercase, lowercase, number and one
                      special character.
                    </p>
                  )}
              </label>
              <label className="text-base font-semibold text-slate-700 md:col-span-2">
                Auto-generated Registration Number
                <input
                  type="text"
                  value={safePaidFormData.registrationNo}
                  readOnly
                  className={`${inputClassName} bg-slate-100 font-semibold text-violet-700`}
                />
              </label>
            </section>

            <section className="rounded-xl border border-violet-100 bg-violet-50/60 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-violet-800">
                <CreditCard className="h-5 w-5" /> Payment Details
              </h2>
              <p className="mt-2 text-sm text-violet-700/80">
                Review the payment summary, optional books add-on, and Pearlian
                discount before proceeding.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Course Fee</span>
                  <span className="font-semibold">Rs. {baseCourseFee}</span>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={safePaidFormData.includeBooksAddon}
                    onChange={(event) =>
                      updatePaidField("includeBooksAddon", event.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer accent-violet-600"
                  />
                  Add Books Package (+ Rs. {booksAddonFee})
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={safePaidFormData.isPearlian}
                    onChange={(event) =>
                      updatePaidField("isPearlian", event.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer accent-violet-600"
                  />
                  Already enrolled in a LePearl paid course? (Pearlian)
                </label>
                {safePaidFormData.isPearlian && (
                  <label className="ml-6 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={safePaidFormData.pearlianEligible}
                      onChange={(event) =>
                        updatePaidField(
                          "pearlianEligible",
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 cursor-pointer accent-violet-600"
                    />
                    Confirm: not a mock-test-only account and eligible for 10%
                    off
                  </label>
                )}
                {pearlianDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Pearlian Discount (10%)</span>
                    <span className="font-semibold">
                      - Rs. {pearlianDiscount}
                    </span>
                  </div>
                )}
                {booksFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Books Add-on</span>
                    <span className="font-semibold">+ Rs. {booksFee}</span>
                  </div>
                )}
                <div className="h-px bg-violet-200" />
                <div className="flex items-center justify-between text-base font-bold text-slate-900">
                  <span>Final Payable</span>
                  <span>Rs. {finalPayable}</span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5" /> Required Consent
              </h2>
              <p className="text-sm text-slate-600">
                All 3 boxes must be ticked before proceeding.
              </p>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={safePaidFormData.acceptedTerms}
                  onChange={(event) =>
                    updatePaidField("acceptedTerms", event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-violet-600"
                />
                I agree to{" "}
                <Link
                  href="/terms-conditions"
                  className="text-violet-700 underline"
                >
                  Terms & Conditions
                </Link>
                .
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={safePaidFormData.acceptedPrivacy}
                  onChange={(event) =>
                    updatePaidField("acceptedPrivacy", event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-violet-600"
                />
                I agree to{" "}
                <Link
                  href="/privacy-policy"
                  className="text-violet-700 underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={safePaidFormData.acceptedRefund}
                  onChange={(event) =>
                    updatePaidField("acceptedRefund", event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-violet-600"
                />
                I have read and accept{" "}
                <Link
                  href="/terms-conditions#refund-policy"
                  className="text-violet-700 underline"
                >
                  Refund Rules
                </Link>
                .
              </label>
            </section>

            {paidSubmissionState.type !== "idle" ? (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  paidSubmissionState.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {paidSubmissionState.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  ) : null}
                  <span>{paidSubmissionState.message}</span>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={
                isSubmittingPaid || !allConsentsChecked || !passwordValidation
              }
              className="w-full rounded-xl bg-[linear-gradient(90deg,#9333ea,#2563eb)] px-6 py-4 text-xl font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingPaid
                ? "Opening secure payment..."
                : "Proceed to Payment & Enrol"}
            </button>
          </form>
        ) : (
          <form
            className="space-y-7 px-5 py-9 sm:px-10"
            onSubmit={handleFreeSubmit}
          >
            <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
              <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Free Registration for PYQs &
                Demo Class
              </h2>
              <p className="mt-2 text-sm text-emerald-800/90">
                Submit this 5-field form for instant PYQ access and demo-class
                updates. No payment required.
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <label className="text-base font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={safeFreeFormData.fullName}
                  onChange={(event) =>
                    updateFreeField("fullName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Enter your full name"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
                <input
                  type="email"
                  required
                  value={safeFreeFormData.email}
                  onChange={(event) =>
                    updateFreeField("email", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="you@example.com"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                WhatsApp Number <span className="text-red-500">*</span>
                <input
                  type="tel"
                  required
                  value={safeFreeFormData.whatsapp}
                  onChange={(event) =>
                    updateFreeField("whatsapp", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="+91 9876543210"
                />
              </label>
              <label className="text-base font-semibold text-slate-700">
                Exam Preparing For <span className="text-red-500">*</span>
                <select
                  required
                  value={safeFreeFormData.examPreparingFor}
                  onChange={(event) =>
                    updateFreeField("examPreparingFor", event.target.value)
                  }
                  className={inputClassName}
                >
                  <option value="">Select one</option>
                  <option value="Assistant Professor">
                    Assistant Professor
                  </option>
                  <option value="NET">NET</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="text-base font-semibold text-slate-700 md:col-span-2">
                How did you hear about us?{" "}
                <span className="text-red-500">*</span>
                <select
                  required
                  value={safeFreeFormData.heardAboutUs}
                  onChange={(event) =>
                    updateFreeField("heardAboutUs", event.target.value)
                  }
                  className={inputClassName}
                >
                  <option value="">Please select</option>
                  <option value="Google">Google</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Friend/Referral">Friend/Referral</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </section>

            {freeSubmissionState.type !== "idle" ? (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  freeSubmissionState.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {freeSubmissionState.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  ) : null}
                  <span>{freeSubmissionState.message}</span>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmittingFree}
              className="w-full rounded-xl bg-[linear-gradient(90deg,#0f766e,#2563eb)] px-6 py-4 text-xl font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingFree
                ? "Submitting free registration..."
                : "Get Free PYQ & Demo Access"}
            </button>
          </form>
        )}

        <footer className="border-t border-slate-200 bg-violet-50 px-4 py-5 text-center text-sm text-slate-600 sm:text-base">
          © 2026 LePearl Education. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
