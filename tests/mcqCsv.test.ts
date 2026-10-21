import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { MCQ_CSV_HEADERS, parseMcqCsv } from "../src/lib/mcqCsv";

const header = MCQ_CSV_HEADERS.join(",");
const validRow = "Who wrote Hamlet?,Shakespeare,Milton,Austen,Dickens,A,2";

test("imports 100 questions in file order with correct answer keys and marks", () => {
  const csv = [
    header,
    ...Array.from({ length: 100 }, (_, i) =>
      `Question ${i + 1},A${i},B${i},C${i},D${i},${"ABCD"[i % 4]},3`,
    ),
  ].join("\r\n");
  const questions = parseMcqCsv(csv);
  assert.equal(questions.length, 100);
  assert.equal(questions[0].question_text, "Question 1");
  assert.equal(questions[99].question_text, "Question 100");
  assert.equal(questions[99].correct_option, "D");
  assert.equal(questions[99].option_d, "D99");
  assert.equal(questions.reduce((sum, q) => sum + q.marks, 0), 300);
});

test("reads the downloadable template", () => {
  const template = readFileSync(
    path.join(process.cwd(), "public", "templates", "mcq-questions.csv"),
    "utf8",
  );
  const questions = parseMcqCsv(template);
  assert.equal(questions.length, 2);
  assert.equal(questions[1].question_text, 'Which novel begins with "Call me Ishmael"?');
});

test("supports BOM, CRLF, escaped quotes, commas, multiline and Unicode text", () => {
  const csv = `\uFEFF${header}\r\n"पहला प्रश्न,\r\n""Hamlet""",Yes,No,Maybe,None,b,1\r\n`;
  const [question] = parseMcqCsv(csv);
  assert.equal(question.question_text, 'पहला प्रश्न,\r\n"Hamlet"');
  assert.equal(question.correct_option, "B");
});

test("accepts reordered case-insensitive headers and ignores blank rows", () => {
  const questions = parseMcqCsv(
    `MARKS, correct_option ,option_d,option_c,option_b,option_a,question_text\n\n2,c,D,C,B,A,Question\n,,,,,,\n`,
  );
  assert.equal(questions.length, 1);
  assert.deepEqual(questions[0], {
    question_text: "Question",
    option_a: "A",
    option_b: "B",
    option_c: "C",
    option_d: "D",
    correct_option: "C",
    marks: 2,
  });
});

test("rejects empty files, header-only files and incorrect headers", () => {
  for (const csv of ["", header, `${header.replace("option_d", "option_a")}\n${validRow}`, `question,answer\nQuestion,A`]) {
    assert.throws(() => parseMcqCsv(csv));
  }
});

test("rejects invalid later rows instead of returning a partial import", () => {
  assert.throws(
    () => parseMcqCsv(`${header}\n${validRow}\nQuestion,A,B,C,D,E,1`),
    /row 3: correct_option/,
  );
});

test("rejects missing options and wrong column counts", () => {
  assert.throws(() => parseMcqCsv(`${header}\nQuestion,A,,C,D,A,1`), /all four options/);
  assert.throws(() => parseMcqCsv(`${header}\nQuestion,A,B,C,D,A`), /expected 7 columns/);
  assert.throws(() => parseMcqCsv(`${header}\nQuestion, with comma,A,B,C,D,A,1`), /expected 7 columns/);
});

test("rejects zero, negative, fractional, empty, nonnumeric and oversized marks", () => {
  for (const marks of ["0", "-1", "1.5", "", "NaN", "Infinity", "2147483648", "1e2", "0x10"]) {
    assert.throws(() => parseMcqCsv(`${header}\nQuestion,A,B,C,D,A,${marks}`), /positive whole number/);
  }
});

test("rejects malformed CSV quotation", () => {
  for (const row of ['"Question,A,B,C,D,A,1', 'Q"uestion,A,B,C,D,A,1', '"Question"text,A,B,C,D,A,1']) {
    assert.throws(() => parseMcqCsv(`${header}\n${row}`), /quot/);
  }
});
