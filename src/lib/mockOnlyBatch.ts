export const UPHESC_MOCK_ONLY_COURSE = "UPHESC-Mock Only";
export const UPHESC_MOCK_ONLY_FEE = 1;

export function isMockOnlyCourse(courseName: string | null | undefined) {
  return courseName?.trim().toLowerCase() === UPHESC_MOCK_ONLY_COURSE.toLowerCase();
}

export function isMockOnlyBatch(batch: {
  batchName?: string | null;
  courseName?: string | null;
}) {
  return isMockOnlyCourse(batch.batchName) || isMockOnlyCourse(batch.courseName);
}

export function canAccessStudentSection(section: string, mockOnly: boolean) {
  return !mockOnly || ["overview", "tests", "fees"].includes(section);
}

export function canAccessFacultySection(section: string, mockOnly: boolean) {
  return !mockOnly || ["dashboard", "mcq", "evaluations"].includes(section);
}

export function isValidMockOnlyPurchase(purchase: {
  paymentTenure?: string | null;
  paymentAmount?: number;
  finalPayable?: number;
  includeBooksAddon?: boolean;
  discountAmount?: number;
  booksFee?: number;
}) {
  return (
    purchase.paymentTenure === "full" &&
    purchase.paymentAmount === UPHESC_MOCK_ONLY_FEE &&
    purchase.finalPayable === UPHESC_MOCK_ONLY_FEE &&
    !purchase.includeBooksAddon &&
    (purchase.discountAmount ?? 0) === 0 &&
    (purchase.booksFee ?? 0) === 0
  );
}
