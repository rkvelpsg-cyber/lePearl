import assert from "node:assert/strict";
import test from "node:test";
import {
  allowedCanonicalBatchNames,
  getCanonicalPaidEnrollmentBatch,
  isCanonicalPaidEnrollmentBatch,
} from "../src/lib/paidEnrollmentBatchMapping";

test("PGT routes to Pandey and recognizes only the renamed canonical batch", () => {
  assert.deepEqual(getCanonicalPaidEnrollmentBatch("PGT"), {
    courseName: "PGT",
    batchName: "PGT-Pandey-A",
    facultyName: "Dr Prem Shankar Pandey",
  });
  assert.equal(getCanonicalPaidEnrollmentBatch(" pgt ")?.batchName, "PGT-Pandey-A");
  assert.equal(isCanonicalPaidEnrollmentBatch({
    courseName: "PGT", batchName: "PGT-Pandey-A",
  }), true);
  assert.equal(isCanonicalPaidEnrollmentBatch({
    courseName: "PGT", batchName: "PGT-Sadhana-A",
  }), false);
  assert.ok(allowedCanonicalBatchNames.includes("PGT-Pandey-A"));
  assert.ok(!allowedCanonicalBatchNames.includes("PGT-Sadhana-A"));
});

test("TGT and combined PGT + TGT assignments are unchanged", () => {
  assert.equal(getCanonicalPaidEnrollmentBatch("TGT")?.batchName, "TGT-Sadhana-A");
  assert.equal(getCanonicalPaidEnrollmentBatch("TGT")?.facultyName, "Ms. Sadhana");
  assert.equal(getCanonicalPaidEnrollmentBatch("PGT + TGT")?.batchName, "PGT-TGT-Sadhana-A");
  assert.equal(getCanonicalPaidEnrollmentBatch("PGT + TGT")?.facultyName, "Ms. Sadhana");
});
