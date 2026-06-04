export const studentRegistrationCourses = [
  "MPPSC",
  "UPHESC",
  "UP GDC",
  "NET Paper 1",
  "NET Paper 2 (English)",
  "GIC",
  "LT Grade",
  "Interview Preparation - Assistant Professor",
  "Interview Preparation - DU Interview",
  "Interview Preparation - Ph.D Interview",
  "Communication Skills",
  "SET",
  "Research Assistance",
] as const;

export type StudentRegistrationCourse =
  (typeof studentRegistrationCourses)[number];

export type StudentRegistrationPayload = {
  fullName: string;
  qualification: string;
  course: StudentRegistrationCourse;
  phone: string;
  email: string;
};

// Course fees are aligned with the current one-time/primary fee shown
// on individual course pages. Some courses do not publish a fixed fee yet.
export const paidRegistrationCourseFees: Partial<
  Record<StudentRegistrationCourse, number>
> = {
  MPPSC: 8999,
  UPHESC: 14995,
  "UP GDC": 13995,
  "NET Paper 1": 8995,
  "NET Paper 2 (English)": 8999,
  GIC: 9995,
  "LT Grade": 5995,
  "Interview Preparation - Assistant Professor": 7495,
  "Interview Preparation - DU Interview": 7495,
  "Interview Preparation - Ph.D Interview": 7495,
  "Communication Skills": 3995,
  SET: 12495,
  "Research Assistance": 2995,
};

export const defaultPaidRegistrationCourseFee = 15999;

export type PaymentInstalment = {
  label: string;
  amount: number;
  note: string;
};

export type CoursePaymentPlan = {
  fullAmount: number;
  instalments?: PaymentInstalment[];
};

export const coursePaymentPlans: Record<
  StudentRegistrationCourse,
  CoursePaymentPlan
> = {
  MPPSC: {
    fullAmount: 8999,
    instalments: [
      {
        label: "1st Instalment",
        amount: 5499,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 5499,
        note: "Due 30 days after enrolment",
      },
    ],
  },
  UPHESC: {
    fullAmount: 14995,
    instalments: [
      {
        label: "1st Instalment",
        amount: 5495,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 5495,
        note: "Due 30 days after enrolment",
      },
      {
        label: "3rd Instalment",
        amount: 5495,
        note: "Due 60 days after enrolment",
      },
    ],
  },
  "UP GDC": {
    fullAmount: 13995,
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
  "NET Paper 1": {
    fullAmount: 8995,
    instalments: [
      {
        label: "1st Instalment",
        amount: 3495,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 3495,
        note: "Due 30 days after enrolment",
      },
      {
        label: "3rd Instalment",
        amount: 3495,
        note: "Due 60 days after enrolment",
      },
    ],
  },
  "NET Paper 2 (English)": {
    fullAmount: 8999,
    instalments: [
      {
        label: "1st Instalment",
        amount: 2000,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 2000,
        note: "Due 30 days after enrolment",
      },
      {
        label: "3rd Instalment",
        amount: 2000,
        note: "Due 60 days after enrolment",
      },
      {
        label: "4th Instalment",
        amount: 2000,
        note: "Due 90 days after enrolment",
      },
      {
        label: "5th Instalment",
        amount: 2000,
        note: "Due 120 days after enrolment",
      },
    ],
  },
  GIC: {
    fullAmount: 9995,
  },
  "LT Grade": {
    fullAmount: 5995,
  },
  "Interview Preparation - Assistant Professor": {
    fullAmount: 7495,
  },
  "Interview Preparation - DU Interview": {
    fullAmount: 7495,
  },
  "Interview Preparation - Ph.D Interview": {
    fullAmount: 7495,
  },
  "Communication Skills": {
    fullAmount: 3995,
  },
  SET: {
    fullAmount: 12495,
    instalments: [
      {
        label: "1st Instalment",
        amount: 2995,
        note: "Pay now · Instant access",
      },
      {
        label: "2nd Instalment",
        amount: 2995,
        note: "Due 30 days after enrolment",
      },
      {
        label: "3rd Instalment",
        amount: 2995,
        note: "Due 60 days after enrolment",
      },
      {
        label: "4th Instalment",
        amount: 2995,
        note: "Due 90 days after enrolment",
      },
      {
        label: "5th Instalment",
        amount: 2995,
        note: "Due 120 days after enrolment",
      },
    ],
  },
  "Research Assistance": {
    fullAmount: 2995,
  },
};

export function isValidStudentRegistrationCourse(
  course: string,
): course is StudentRegistrationCourse {
  return studentRegistrationCourses.includes(
    course as StudentRegistrationCourse,
  );
}

export function sanitizeRegistrationValue(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
