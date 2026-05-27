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
  UPHESC: 4995,
  "UP GDC": 13995,
  "NET Paper 1": 8999,
  "NET Paper 2 (English)": 8999,
  "Interview Preparation - Assistant Professor": 5,
  "Interview Preparation - DU Interview": 7495,
  "Interview Preparation - Ph.D Interview": 7495,
  "Communication Skills": 3995,
  SET: 12495,
  "Research Assistance": 2995,
};

export const defaultPaidRegistrationCourseFee = 15999;

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
