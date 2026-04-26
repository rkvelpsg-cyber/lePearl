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
