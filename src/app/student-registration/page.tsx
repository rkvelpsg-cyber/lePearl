"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import {
  coursePaymentPlans,
  defaultPaidRegistrationCourseFee,
  isValidStudentRegistrationCourse,
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

type ResearchAssistanceFeeOptionId =
  | "research-paper"
  | "thesis"
  | "phd-proposal"
  | "mla-apa"
  | "mentoring";

type UPGDCFeeOptionId =
  | "combined-full"
  | "combined-instalment"
  | "prelims-full"
  | "prelims-instalment"
  | "mains-without-material"
  | "mains-with-material";

type PaidEnrollmentFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  course: StudentRegistrationPayload["course"];
  researchAssistanceFeeType: ResearchAssistanceFeeOptionId;
  upgdcFeeOption: UPGDCFeeOptionId;
  username: string;
  password: string;
  registrationNo: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedRefund: boolean;
  isPearlian: boolean;
  pearlianEligible: boolean;
  includeBooksAddon: boolean;
  paymentTenure: "full" | "instalment" | null;
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
  researchAssistanceFeeType: "research-paper",
  upgdcFeeOption: "combined-full",
  username: "",
  password: "",
  registrationNo: generateRegistrationNo(),
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedRefund: false,
  isPearlian: false,
  pearlianEligible: false,
  includeBooksAddon: false,
  paymentTenure: null,
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
const PAID_REGISTRATION_DRAFT_KEY = "lepearl-paid-registration-draft";
const PAID_REGISTRATION_COURSE_BACK_KEY = "lepearl-paid-course-back-href";

const researchAssistanceFeeOptions: {
  id: ResearchAssistanceFeeOptionId;
  title: string;
  amount: number;
  note?: string;
}[] = [
  {
    id: "research-paper",
    title: "Art of Research Paper Writing",
    amount: 2995,
  },
  {
    id: "thesis",
    title: "Art of Thesis Writing",
    amount: 5995,
  },
  {
    id: "phd-proposal",
    title: "Art of PhD Proposal Making",
    amount: 1995,
  },
  {
    id: "mla-apa",
    title: "Learn the Art of Application of MLA and APA",
    amount: 1995,
  },
  {
    id: "mentoring",
    title: "Guidance and Mentoring for Research Paper Writing",
    amount: 1000,
    note: "30 minutes option is also available at Rs. 750",
  },
];

const upgdcFeeOptions: {
  id: UPGDCFeeOptionId;
  title: string;
  totalAmount: number;
  tenure: "full" | "instalment";
  note: string;
  instalments?: { label: string; amount: number; note: string }[];
}[] = [
  {
    id: "combined-full",
    title: "One-time payment for both Prelims + Mains",
    totalAmount: 13995,
    tenure: "full",
    note: "Best value · Discounts eligible",
  },
  {
    id: "combined-instalment",
    title: "Instalments for both Prelims + Mains",
    totalAmount: 14985,
    tenure: "instalment",
    note: "Pay Rs. 4,995 now · split across 3 payments",
    instalments: [
      {
        label: "1st Instalment",
        amount: 4995,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 4995,
        note: "Due 30 days after enrolment",
      },
      {
        label: "3rd Instalment",
        amount: 4995,
        note: "Due 60 days after enrolment",
      },
    ],
  },
  {
    id: "prelims-full",
    title: "Full fee of Only Prelims",
    totalAmount: 10995,
    tenure: "full",
    note: "One-time payment for Prelims track",
  },
  {
    id: "prelims-instalment",
    title: "Instalments for Only Prelims",
    totalAmount: 11985,
    tenure: "instalment",
    note: "Pay Rs. 3,995 now · split across 3 payments",
    instalments: [
      {
        label: "1st Instalment",
        amount: 3995,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 3995,
        note: "Due 30 days after enrolment",
      },
      {
        label: "3rd Instalment",
        amount: 3995,
        note: "Due 60 days after enrolment",
      },
    ],
  },
  {
    id: "mains-without-material",
    title: "GDC Mains (Without Study Material)",
    totalAmount: 5,
    tenure: "full",
    note: "Mains-only access without study material",
  },
  {
    id: "mains-with-material",
    title: "GDC Mains (With Study Material)",
    totalAmount: 15995,
    tenure: "full",
    note: "Mains-only access with study material",
  },
];

function isUPGDCFeeOptionId(value: string | null): value is UPGDCFeeOptionId {
  return !!value && upgdcFeeOptions.some((option) => option.id === value);
}

function StudentRegistrationContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const useUpiQrPayment = process.env.NEXT_PUBLIC_PAYMENT_MODE !== "razorpay";
  const [activeMode, setActiveMode] = useState<"paid" | "free">("paid");
  const [courseBackHref, setCourseBackHref] = useState<string | null>(null);
  const [hasLoadedPaidDraft, setHasLoadedPaidDraft] = useState(false);
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
  const [showFeePlanModal, setShowFeePlanModal] = useState(false);
  const [modalPlanChoice, setModalPlanChoice] = useState<"full" | "instalment">(
    "full",
  );
  const [modalUPGDCFeeChoice, setModalUPGDCFeeChoice] =
    useState<UPGDCFeeOptionId>("combined-full");
  const [modalResearchFeeChoice, setModalResearchFeeChoice] =
    useState<ResearchAssistanceFeeOptionId>("research-paper");
  const safePaidFormData: PaidEnrollmentFormState = {
    ...initialPaidForm(),
    ...paidFormData,
  };
  const safeFreeFormData: FreeRegistrationFormState = {
    ...initialFreeForm,
    ...freeFormData,
  };

  const isResearchAssistanceCourse =
    safePaidFormData.course === "Research Assistance";
  const isUPGDCCourse = safePaidFormData.course === "UP GDC";
  const selectedResearchAssistanceFee = researchAssistanceFeeOptions.find(
    (option) => option.id === safePaidFormData.researchAssistanceFeeType,
  );
  const selectedUPGDCFee = upgdcFeeOptions.find(
    (option) => option.id === safePaidFormData.upgdcFeeOption,
  );

  const currentPlan = coursePaymentPlans[safePaidFormData.course];
  const researchAssistanceBaseFee =
    selectedResearchAssistanceFee?.amount ?? 2995;
  const upgdcBaseFee = selectedUPGDCFee?.totalAmount ?? 13995;
  const baseCourseFee =
    (isResearchAssistanceCourse
      ? researchAssistanceBaseFee
      : isUPGDCCourse
        ? upgdcBaseFee
        : currentPlan?.fullAmount) ??
    paidRegistrationCourseFees[safePaidFormData.course] ??
    defaultPaidRegistrationCourseFee;
  const hasPublishedFee = baseCourseFee > 0;
  // Discounts apply only on full payment
  const pearlianDiscount =
    !isResearchAssistanceCourse &&
    safePaidFormData.paymentTenure === "full" &&
    safePaidFormData.isPearlian &&
    safePaidFormData.pearlianEligible
      ? Math.round(baseCourseFee * 0.1)
      : 0;
  const additionalAccessDiscount =
    !isResearchAssistanceCourse &&
    safePaidFormData.paymentTenure === "full" &&
    safePaidFormData.includeBooksAddon
      ? Math.round(baseCourseFee * 0.1)
      : 0;
  const totalDiscount = pearlianDiscount + additionalAccessDiscount;
  const booksFee = 0;
  const activeInstalments =
    isUPGDCCourse && selectedUPGDCFee?.tenure === "instalment"
      ? selectedUPGDCFee.instalments
      : currentPlan?.instalments;
  const firstInstalmentAmount = activeInstalments?.[0]?.amount ?? 0;
  const instalmentTotal =
    activeInstalments?.reduce((sum, item) => sum + item.amount, 0) ??
    baseCourseFee;
  const finalPayable =
    safePaidFormData.paymentTenure === "instalment"
      ? firstInstalmentAmount
      : Math.max(baseCourseFee - totalDiscount, 0);

  const allConsentsChecked =
    safePaidFormData.acceptedTerms &&
    safePaidFormData.acceptedPrivacy &&
    safePaidFormData.acceptedRefund &&
    safePaidFormData.paymentTenure !== null &&
    hasPublishedFee;

  const passwordValidation = useMemo(() => {
    const v = safePaidFormData.password;
    const hasUpper = /[A-Z]/.test(v);
    const hasLower = /[a-z]/.test(v);
    const hasNumber = /\d/.test(v);
    const hasSpecial = /[^A-Za-z0-9]/.test(v);
    return v.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
  }, [safePaidFormData.password]);

  const isPaidWhatsappValid = /^\d{10}$/.test(safePaidFormData.whatsapp);

  const paidRegistrationReturnTo = useMemo(() => {
    const query = searchParams.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);
  const encodedPaidRegistrationReturnTo = encodeURIComponent(
    paidRegistrationReturnTo,
  );

  useEffect(() => {
    try {
      const persistedPaidDraft = window.sessionStorage.getItem(
        PAID_REGISTRATION_DRAFT_KEY,
      );
      if (persistedPaidDraft) {
        const parsedDraft = JSON.parse(
          persistedPaidDraft,
        ) as Partial<PaidEnrollmentFormState>;
        if (parsedDraft && typeof parsedDraft === "object") {
          setPaidFormData((current) => ({
            ...current,
            ...parsedDraft,
            // Never restore passwords from storage.
            password: "",
          }));
        }
      }

      const persistedCourseBackHref = window.sessionStorage.getItem(
        PAID_REGISTRATION_COURSE_BACK_KEY,
      );
      if (persistedCourseBackHref) {
        setCourseBackHref(persistedCourseBackHref);
      }
    } catch {
      // Ignore invalid draft payload and continue with fresh state.
    }

    const searchParams = new URLSearchParams(window.location.search);
    const modeParam = searchParams.get("mode");
    const courseParam = searchParams.get("course");
    const upgdcFeeOptionParam = searchParams.get("upgdcFeeOption");
    const hasPaidCourseFlow =
      modeParam === "paid" &&
      !!courseParam &&
      isValidStudentRegistrationCourse(courseParam);

    // Show "Back to Course Page" only when this page was opened from a course-route enrol flow.
    if (hasPaidCourseFlow) {
      try {
        if (document.referrer) {
          const refUrl = new URL(document.referrer);
          const isSameOrigin = refUrl.origin === window.location.origin;
          const refPath = refUrl.pathname;
          const isCourseRoute =
            /^\/courses-[a-z0-9-]+$/i.test(refPath) ||
            refPath === "/all-courses" ||
            refPath === "/research-assistance" ||
            refPath === "/interview-preparation";

          if (isSameOrigin && isCourseRoute) {
            const resolvedCourseBackHref = `${refPath}${refUrl.search}${refUrl.hash}`;
            setCourseBackHref(resolvedCourseBackHref);
            window.sessionStorage.setItem(
              PAID_REGISTRATION_COURSE_BACK_KEY,
              resolvedCourseBackHref,
            );
          }
        }
      } catch {
        // Keep previously restored course back link if any.
      }
    } else {
      // Non course-flow: clear stale course back links.
      setCourseBackHref(null);
      window.sessionStorage.removeItem(PAID_REGISTRATION_COURSE_BACK_KEY);
    }

    if (courseParam && isValidStudentRegistrationCourse(courseParam)) {
      const hasUPGDCSelectionFromCoursePage =
        courseParam === "UP GDC" && isUPGDCFeeOptionId(upgdcFeeOptionParam);
      const resolvedUPGDCOption: UPGDCFeeOptionId =
        hasUPGDCSelectionFromCoursePage && upgdcFeeOptionParam
          ? upgdcFeeOptionParam
          : "combined-full";
      const resolvedUPGDCTenure =
        upgdcFeeOptions.find((option) => option.id === resolvedUPGDCOption)
          ?.tenure ?? "full";

      setPaidFormData((current) => ({
        ...current,
        course: courseParam,
        researchAssistanceFeeType: "research-paper",
        upgdcFeeOption: resolvedUPGDCOption,
        paymentTenure: hasUPGDCSelectionFromCoursePage
          ? resolvedUPGDCTenure
          : null,
      }));

      // Auto-open fee plan modal when arriving from course pages, except when
      // UP GDC has an explicit fee option selected from the course card.
      setModalPlanChoice(resolvedUPGDCTenure);
      setModalUPGDCFeeChoice(resolvedUPGDCOption);
      setModalResearchFeeChoice("research-paper");
      setShowFeePlanModal(!hasUPGDCSelectionFromCoursePage);
    }

    if (modeParam === "free") {
      setActiveMode("free");
    } else if (modeParam === "paid") {
      setActiveMode("paid");
    }

    setHasLoadedPaidDraft(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPaidDraft) return;
    const { password: _ignoredPassword, ...paidDraftToPersist } =
      safePaidFormData;
    window.sessionStorage.setItem(
      PAID_REGISTRATION_DRAFT_KEY,
      JSON.stringify(paidDraftToPersist),
    );
  }, [safePaidFormData, hasLoadedPaidDraft]);

  function handleCourseChange(newCourse: StudentRegistrationPayload["course"]) {
    setPaidFormData((current) => ({
      ...current,
      course: newCourse,
      researchAssistanceFeeType:
        newCourse === "Research Assistance"
          ? "research-paper"
          : current.researchAssistanceFeeType,
      upgdcFeeOption:
        newCourse === "UP GDC" ? "combined-full" : current.upgdcFeeOption,
      paymentTenure: null,
    }));
    setModalPlanChoice("full");
    setModalUPGDCFeeChoice("combined-full");
    setModalResearchFeeChoice("research-paper");
    setShowFeePlanModal(true);
  }

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
    if (!allConsentsChecked || !passwordValidation || !isPaidWhatsappValid)
      return;

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

      const paymentDescription = isResearchAssistanceCourse
        ? `Paid Enrolment - ${safePaidFormData.course} (${selectedResearchAssistanceFee?.title ?? "Selected Service"})`
        : isUPGDCCourse
          ? `Paid Enrolment - ${safePaidFormData.course} (${selectedUPGDCFee?.title ?? "Selected Plan"})`
          : `Paid Enrolment - ${safePaidFormData.course}`;

      let orderData: RazorpayOrderResponse | null = null;
      let payment:
        | RazorpaySuccessResponse
        | {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          } = {
        razorpay_payment_id: "",
        razorpay_order_id: "",
        razorpay_signature: "",
      };

      if (!useUpiQrPayment) {
        const orderResponse = await fetch(
          "/api/student-registration/create-payment-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: finalPayable,
              description: paymentDescription,
              fullName: payload.fullName,
              email: payload.email,
              whatsapp: payload.phone,
              course: payload.course,
              researchAssistanceFeeType: isResearchAssistanceCourse
                ? safePaidFormData.researchAssistanceFeeType
                : undefined,
              upgdcFeeOption: isUPGDCCourse
                ? safePaidFormData.upgdcFeeOption
                : undefined,
              registrationNo: safePaidFormData.registrationNo,
            }),
          },
        );

        orderData = (await orderResponse.json()) as RazorpayOrderResponse;
        if (!orderResponse.ok) {
          throw new Error(
            orderData.error ?? "Unable to create secure payment order.",
          );
        }

        await loadRazorpayCheckoutScript();

        payment = await new Promise<RazorpaySuccessResponse>(
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
              key: orderData?.key_id,
              amount: orderData?.amount,
              currency: orderData?.currency,
              name: "LePearl Education",
              description: paymentDescription,
              order_id: orderData?.order_id,
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
      }

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
          password: safePaidFormData.password,
          paymentTenure: safePaidFormData.paymentTenure,
          acceptedTerms: safePaidFormData.acceptedTerms,
          acceptedPrivacy: safePaidFormData.acceptedPrivacy,
          acceptedRefund: safePaidFormData.acceptedRefund,
          isPearlian: safePaidFormData.isPearlian,
          pearlianEligible: safePaidFormData.pearlianEligible,
          includeBooksAddon: safePaidFormData.includeBooksAddon,
          researchAssistanceFeeType: isResearchAssistanceCourse
            ? safePaidFormData.researchAssistanceFeeType
            : undefined,
          researchAssistanceFeeLabel: isResearchAssistanceCourse
            ? selectedResearchAssistanceFee?.title
            : undefined,
          upgdcFeeOption: isUPGDCCourse
            ? safePaidFormData.upgdcFeeOption
            : undefined,
          upgdcFeeLabel: isUPGDCCourse ? selectedUPGDCFee?.title : undefined,
          baseCourseFee,
          discountAmount: totalDiscount,
          booksFee,
          finalPayable,
          paymentMode: useUpiQrPayment ? "upi_qr" : "razorpay",
          paymentAmount: useUpiQrPayment
            ? Number(finalPayable)
            : Number(orderData?.amount ?? 0) / 100,
          razorpayOrderId: payment.razorpay_order_id || undefined,
          razorpayPaymentId: payment.razorpay_payment_id || undefined,
          razorpaySignature: payment.razorpay_signature || undefined,
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
          (useUpiQrPayment
            ? "Registration submitted in UPI/manual mode. Our team will verify your payment and share login details after confirmation."
            : "Payment successful. Your paid registration is completed. Confirmation details have been sent to your email, and our admin team has received your registration."),
      });
      window.sessionStorage.removeItem(PAID_REGISTRATION_DRAFT_KEY);
      window.sessionStorage.removeItem(PAID_REGISTRATION_COURSE_BACK_KEY);
      setPaidFormData(initialPaidForm());
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
      const selectedCourse = (safeFreeFormData.examPreparingFor ||
        studentRegistrationCourses[0] ||
        "MPPSC") as StudentRegistrationPayload["course"];

      const payload: StudentRegistrationPayload = {
        fullName: safeFreeFormData.fullName.trim(),
        qualification: safeFreeFormData.examPreparingFor,
        course: selectedCourse,
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
      <header className="mx-auto mb-4 flex w-full max-w-5xl items-center justify-end gap-2">
        {courseBackHref && (
          <Link
            href={courseBackHref}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-violet-300 bg-violet-600 px-4 py-2 text-sm font-medium !text-white hover:!text-white focus:!text-white transition hover:bg-violet-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course Page
          </Link>
        )}
        <Link
          href="/login-portal"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-teal-700 bg-teal-700 px-4 py-2 text-sm font-medium !text-white hover:!text-white focus:!text-white transition hover:bg-teal-800"
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
                    updatePaidField(
                      "whatsapp",
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className={inputClassName}
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  placeholder="9876543210"
                />
                {!isPaidWhatsappValid &&
                  safePaidFormData.whatsapp.length > 0 && (
                    <p className="mt-2 text-xs text-rose-600">
                      WhatsApp number must be exactly 10 digits.
                    </p>
                  )}
              </label>
              <label className="text-base font-semibold text-slate-700">
                Course <span className="text-red-500">*</span>
                <select
                  required
                  value={safePaidFormData.course}
                  onChange={(event) =>
                    handleCourseChange(
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
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-violet-800">
                  <CreditCard className="h-5 w-5" /> Payment Details
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setModalPlanChoice(
                      safePaidFormData.paymentTenure ?? "full",
                    );
                    setModalUPGDCFeeChoice(safePaidFormData.upgdcFeeOption);
                    setModalResearchFeeChoice(
                      safePaidFormData.researchAssistanceFeeType,
                    );
                    setShowFeePlanModal(true);
                  }}
                  className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  {safePaidFormData.paymentTenure === null
                    ? "⚠ Select Fee Plan"
                    : "Change Plan"}
                </button>
              </div>

              {safePaidFormData.paymentTenure === null ? (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Please select a payment plan by clicking{" "}
                  <strong>Select Fee Plan</strong> above to view fee details and
                  proceed.
                </div>
              ) : !hasPublishedFee ? (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Fee details for this course are provided by the admissions
                  team on request. Please contact support to proceed with
                  enrolment.
                </div>
              ) : safePaidFormData.paymentTenure === "full" ? (
                <>
                  <p className="mt-2 text-sm text-violet-700/80">
                    {isResearchAssistanceCourse
                      ? "Selected fee type from Research Assistance course page."
                      : isUPGDCCourse
                        ? "Selected UP GDC plan from course page."
                        : "Full payment selected · Discounts eligible."}
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-700">
                    {isResearchAssistanceCourse && (
                      <div className="flex items-center justify-between">
                        <span>Selected Service</span>
                        <span className="font-semibold text-violet-700">
                          {selectedResearchAssistanceFee?.title}
                        </span>
                      </div>
                    )}
                    {isUPGDCCourse && (
                      <div className="flex items-center justify-between">
                        <span>Selected Plan</span>
                        <span className="font-semibold text-violet-700">
                          {selectedUPGDCFee?.title}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Course Fee</span>
                      <span className="font-semibold">Rs. {baseCourseFee}</span>
                    </div>
                    {!isResearchAssistanceCourse && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={safePaidFormData.includeBooksAddon}
                          onChange={(event) =>
                            updatePaidField(
                              "includeBooksAddon",
                              event.target.checked,
                            )
                          }
                          className="h-4 w-4 cursor-pointer accent-violet-600"
                        />
                        Additional one-year availability of course credentials,
                        like recorded classes and study material
                      </label>
                    )}
                    {!isResearchAssistanceCourse && (
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
                    )}
                    {!isResearchAssistanceCourse &&
                      safePaidFormData.isPearlian && (
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
                          Confirm: not a mock-test-only account and eligible for
                          10% off
                        </label>
                      )}
                    {!isResearchAssistanceCourse && pearlianDiscount > 0 && (
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>Pearlian Discount (10%)</span>
                        <span className="font-semibold">
                          - Rs. {pearlianDiscount}
                        </span>
                      </div>
                    )}
                    {!isResearchAssistanceCourse &&
                      additionalAccessDiscount > 0 && (
                        <div className="flex items-center justify-between text-emerald-700">
                          <span>Additional Access Discount (10%)</span>
                          <span className="font-semibold">
                            - Rs. {additionalAccessDiscount}
                          </span>
                        </div>
                      )}
                    <div className="h-px bg-violet-200" />
                    <div className="flex items-center justify-between text-base font-bold text-slate-900">
                      <span>Final Payable</span>
                      <span>Rs. {finalPayable}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm text-violet-700/80">
                    Instalment plan selected · Pay the 1st instalment now for
                    instant access.
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    {activeInstalments?.map((inst, idx) => (
                      <div
                        key={`${inst.label}-${idx}`}
                        className={`flex items-start justify-between rounded-lg px-4 py-2.5 ${
                          idx === 0
                            ? "border border-violet-300 bg-violet-100"
                            : "border border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 font-medium text-slate-800">
                            {inst.label}
                            {idx === 0 && (
                              <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs text-white">
                                Pay Now
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{inst.note}</p>
                        </div>
                        <span
                          className={`font-semibold ${idx === 0 ? "text-violet-700" : "text-slate-500"}`}
                        >
                          Rs. {inst.amount}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700">
                      <span>Total Course Fee</span>
                      <span>Rs. {instalmentTotal}</span>
                    </div>
                    <p className="text-xs text-amber-600">
                      * Pearlian and additional access discounts are available
                      on full payment only.
                    </p>
                  </div>
                  <div className="mt-4 h-px bg-violet-200" />
                  <div className="mt-3 flex items-center justify-between text-base font-bold text-slate-900">
                    <span>Paying Now (1st Instalment)</span>
                    <span className="text-violet-700">Rs. {finalPayable}</span>
                  </div>
                </>
              )}
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
                  href={`/terms-conditions?returnTo=${encodedPaidRegistrationReturnTo}`}
                  className="font-semibold !text-blue-600 visited:!text-blue-600 !underline decoration-blue-600 underline-offset-2 hover:!text-blue-700"
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
                  href={`/privacy-policy?returnTo=${encodedPaidRegistrationReturnTo}`}
                  className="font-semibold !text-blue-600 visited:!text-blue-600 !underline decoration-blue-600 underline-offset-2 hover:!text-blue-700"
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
                  href={`/terms-conditions?returnTo=${encodedPaidRegistrationReturnTo}#refund-policy`}
                  className="font-semibold !text-blue-600 visited:!text-blue-600 !underline decoration-blue-600 underline-offset-2 hover:!text-blue-700"
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
                isSubmittingPaid ||
                !allConsentsChecked ||
                !passwordValidation ||
                !isPaidWhatsappValid
              }
              className="w-full cursor-pointer rounded-xl bg-[linear-gradient(90deg,#9333ea,#2563eb)] px-6 py-4 text-xl font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingPaid
                ? "Opening secure payment..."
                : !hasPublishedFee
                  ? "Contact support for latest fee"
                  : safePaidFormData.paymentTenure === null
                    ? "Select a payment plan to continue"
                    : useUpiQrPayment
                      ? "Submit Registration (UPI Mode)"
                      : "Proceed to Payment & Enrol"}
            </button>

            {useUpiQrPayment ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Razorpay is currently unavailable in this environment. Your
                registration will be submitted in UPI/manual mode and our team
                will verify payment before sharing credentials.
              </div>
            ) : null}
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
                  {studentRegistrationCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
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
              className="w-full cursor-pointer rounded-xl bg-[linear-gradient(90deg,#0f766e,#2563eb)] px-6 py-4 text-xl font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
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
      {/* ── Fee Plan Selection Modal (centered dialog) ── */}
      {showFeePlanModal && activeMode === "paid" && (
        <>
          {/* Backdrop – only dismissible if plan already chosen */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (safePaidFormData.paymentTenure !== null)
                setShowFeePlanModal(false);
            }}
          />

          {/* Centered dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="p-6">
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    Choose Payment Plan
                  </h2>
                  {safePaidFormData.paymentTenure !== null && (
                    <button
                      type="button"
                      onClick={() => setShowFeePlanModal(false)}
                      className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="mb-5 text-sm text-slate-500">
                  Course:{" "}
                  <span className="font-semibold text-violet-700">
                    {safePaidFormData.course}
                  </span>
                  {hasPublishedFee
                    ? ` · Full Fee: Rs. ${baseCourseFee}`
                    : " · Fee shared by admissions support"}
                </p>

                {isResearchAssistanceCourse ? (
                  <div className="space-y-3">
                    {researchAssistanceFeeOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setModalResearchFeeChoice(option.id)}
                        className={`w-full rounded-xl border-2 p-4 text-left transition ${
                          modalResearchFeeChoice === option.id
                            ? "border-violet-600 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {option.title}
                            </p>
                            {option.note && (
                              <p className="mt-1 text-xs text-slate-500">
                                {option.note}
                              </p>
                            )}
                          </div>
                          <span className="text-lg font-bold text-violet-700">
                            Rs. {option.amount}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : isUPGDCCourse ? (
                  <div className="space-y-3">
                    {upgdcFeeOptions.map((option) => {
                      const isSelected = modalUPGDCFeeChoice === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setModalUPGDCFeeChoice(option.id)}
                          className={`w-full rounded-xl border-2 p-4 text-left transition ${
                            isSelected
                              ? "border-violet-600 bg-violet-50"
                              : "border-slate-200 bg-white hover:border-violet-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <div
                                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                  isSelected
                                    ? "border-violet-600"
                                    : "border-slate-400"
                                }`}
                              >
                                {isSelected && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900">
                                  {option.title}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {option.note}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-violet-700">
                                Rs. {option.totalAmount}
                              </p>
                              <p className="text-xs text-slate-400">
                                {option.tenure === "instalment"
                                  ? "Instalment"
                                  : "Full Payment"}
                              </p>
                            </div>
                          </div>
                          {option.instalments && (
                            <div className="ml-8 mt-3 space-y-1.5">
                              {option.instalments.map((inst, idx) => (
                                <div
                                  key={`${option.id}-${inst.label}-${idx}`}
                                  className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-1.5 text-sm"
                                >
                                  <div>
                                    <span className="font-medium text-slate-700">
                                      {inst.label}
                                    </span>
                                    <span className="ml-2 text-xs text-slate-400">
                                      · {inst.note}
                                    </span>
                                  </div>
                                  <span
                                    className={`font-semibold ${
                                      idx === 0
                                        ? "text-violet-700"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    Rs. {inst.amount}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Full Payment */}
                    <button
                      type="button"
                      onClick={() => setModalPlanChoice("full")}
                      className={`w-full rounded-xl border-2 p-4 text-left transition ${
                        modalPlanChoice === "full"
                          ? "border-violet-600 bg-violet-50"
                          : "border-slate-200 bg-white hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              modalPlanChoice === "full"
                                ? "border-violet-600"
                                : "border-slate-400"
                            }`}
                          >
                            {modalPlanChoice === "full" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              Full Payment
                            </p>
                            <p className="text-sm text-slate-500">
                              One-time payment · Best value · Discounts eligible
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">
                            {hasPublishedFee
                              ? `Rs. ${baseCourseFee}`
                              : "Contact Support"}
                          </p>
                          {hasPublishedFee && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              Save with discounts
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Instalment Plan – only shown if plan data has instalments */}
                    {currentPlan?.instalments && (
                      <button
                        type="button"
                        onClick={() => setModalPlanChoice("instalment")}
                        className={`w-full rounded-xl border-2 p-4 text-left transition ${
                          modalPlanChoice === "instalment"
                            ? "border-violet-600 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              modalPlanChoice === "instalment"
                                ? "border-violet-600"
                                : "border-slate-400"
                            }`}
                          >
                            {modalPlanChoice === "instalment" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              Pay in Instalments
                            </p>
                            <p className="text-sm text-slate-500">
                              Split across {currentPlan.instalments.length}{" "}
                              payments
                            </p>
                          </div>
                        </div>
                        <div className="ml-8 space-y-1.5">
                          {currentPlan.instalments.map((inst, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm"
                            >
                              <div>
                                <span className="font-medium text-slate-700">
                                  {inst.label}
                                </span>
                                <span className="ml-2 text-xs text-slate-400">
                                  · {inst.note}
                                </span>
                              </div>
                              <span
                                className={`font-semibold ${
                                  idx === 0
                                    ? "text-violet-700"
                                    : "text-slate-500"
                                }`}
                              >
                                Rs. {inst.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isResearchAssistanceCourse) {
                      updatePaidField(
                        "researchAssistanceFeeType",
                        modalResearchFeeChoice,
                      );
                      updatePaidField("paymentTenure", "full");
                    } else if (isUPGDCCourse) {
                      const selectedOption = upgdcFeeOptions.find(
                        (option) => option.id === modalUPGDCFeeChoice,
                      );
                      updatePaidField("upgdcFeeOption", modalUPGDCFeeChoice);
                      updatePaidField(
                        "paymentTenure",
                        selectedOption?.tenure ?? "full",
                      );
                    } else {
                      updatePaidField("paymentTenure", modalPlanChoice);
                    }
                    setShowFeePlanModal(false);
                  }}
                  className="mt-5 w-full rounded-xl bg-violet-600 py-3.5 text-base font-semibold text-white transition hover:bg-violet-700"
                >
                  Confirm —{" "}
                  {isResearchAssistanceCourse
                    ? "Selected Research Assistance Service"
                    : isUPGDCCourse
                      ? `Selected - ${
                          upgdcFeeOptions.find(
                            (option) => option.id === modalUPGDCFeeChoice,
                          )?.title ?? "UP GDC Plan"
                        }`
                      : modalPlanChoice === "full"
                        ? "Full Payment"
                        : "Instalment Plan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default function StudentRegistrationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
          <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            Loading registration form...
          </div>
        </main>
      }
    >
      <StudentRegistrationContent />
    </Suspense>
  );
}
