type PaidEnrollmentBatchMapping = {
  courseName: string;
  batchName: string;
  facultyName: string;
  aliases?: string[];
};

export const paidEnrollmentBatchMappings: PaidEnrollmentBatchMapping[] = [
  {
    courseName: "MPPSC",
    batchName: "MPPSC-Patel-A",
    facultyName: "Ms. Neelu Patel",
  },
  {
    courseName: "UPHESC",
    batchName: "UPHESC-Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
  },
  {
    courseName: "UP GDC",
    batchName: "UP-GDC-Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
  },
  {
    courseName: "NET Paper 1",
    batchName: "NET-PAPER--Sadhana-A",
    facultyName: "Ms. Sadhana",
    aliases: ["NTA NET Paper 1"],
  },
  {
    courseName: "NET Paper 2 (English)",
    batchName: "NET Paper 2 (English)",
    facultyName: "Ms. Sadhana",
    aliases: ["NTA NET Paper 2 (English)"],
  },
  {
    courseName: "GIC",
    batchName: "GIC-Sadhana-A",
    facultyName: "Ms. Sadhana",
  },
  {
    courseName: "LT Grade",
    batchName: "LT-GRADE-Sadhana-A",
    facultyName: "Ms. Sadhana",
  },
  {
    courseName: "Interview Preparation - Assistant Professor",
    batchName: "INTERVIEW--Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
    aliases: ["Assistant Professor Preparation"],
  },
  {
    courseName: "Interview Preparation - Ph.D Interview",
    batchName: "INTERVIEW--Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
  },
  {
    courseName: "Communication Skills",
    batchName: "COMMUNICAT-Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
  },
  {
    courseName: "SET",
    batchName: "SET-Sadhana-A",
    facultyName: "Ms. Sadhana",
  },
  {
    courseName: "Research Assistance",
    batchName: "RESEARCH-A-Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
  },
];

export const allowedCanonicalBatchNames = Array.from(
  new Set(paidEnrollmentBatchMappings.map((mapping) => mapping.batchName)),
);

function normalizeCourseLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getCanonicalPaidEnrollmentBatch(courseName: string) {
  const normalized = normalizeCourseLabel(courseName);

  return (
    paidEnrollmentBatchMappings.find((mapping) => {
      if (normalizeCourseLabel(mapping.courseName) === normalized) {
        return true;
      }

      return (mapping.aliases ?? []).some(
        (alias) => normalizeCourseLabel(alias) === normalized,
      );
    }) ?? null
  );
}

export function isCanonicalPaidEnrollmentBatch(params: {
  courseName: string | null | undefined;
  batchName: string | null | undefined;
}) {
  const courseName = String(params.courseName ?? "").trim();
  const batchName = String(params.batchName ?? "")
    .trim()
    .toLowerCase();

  if (!courseName || !batchName) {
    return false;
  }

  const mapping = getCanonicalPaidEnrollmentBatch(courseName);
  if (!mapping) {
    return false;
  }

  return mapping.batchName.trim().toLowerCase() === batchName;
}
