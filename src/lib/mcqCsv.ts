export const MCQ_CSV_HEADERS = [
  "question_text",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_option",
  "marks",
] as const;

export type McqCsvQuestion = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  marks: number;
};

function readCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let closedQuote = false;

  function endField() {
    row.push(field);
    field = "";
    closedQuote = false;
  }

  function endRow() {
    endField();
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    row = [];
  }

  const source = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i += 1) {
    const character = source[i];
    if (quoted) {
      if (character === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
          closedQuote = true;
        }
      } else {
        field += character;
      }
    } else if (character === ",") {
      endField();
    } else if (character === "\r" || character === "\n") {
      if (character === "\r" && source[i + 1] === "\n") i += 1;
      endRow();
    } else if (character === '"' && field === "" && !closedQuote) {
      quoted = true;
    } else if (closedQuote || character === '"') {
      throw new Error(
        `CSV row ${rows.length + 1}: invalid quotation. Quote the entire field and double any quotes inside it.`,
      );
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("The CSV contains an unclosed quoted field.");
  endRow();
  return rows;
}

export function parseMcqCsv(text: string): McqCsvQuestion[] {
  const [header, ...rows] = readCsv(text);
  if (!header || rows.length === 0) {
    throw new Error("The CSV must contain a header and at least one question.");
  }

  const headers = header.map((value) => value.trim().toLowerCase());
  if (
    headers.length !== MCQ_CSV_HEADERS.length ||
    new Set(headers).size !== headers.length ||
    MCQ_CSV_HEADERS.some((name) => !headers.includes(name))
  ) {
    throw new Error(`Use exactly these CSV columns: ${MCQ_CSV_HEADERS.join(", ")}.`);
  }

  return rows.map((row, index) => {
    const rowLabel = `CSV row ${index + 2}`;
    if (row.length !== headers.length) {
      throw new Error(
        `${rowLabel}: expected ${headers.length} columns, received ${row.length}. Put text containing commas or line breaks in double quotes.`,
      );
    }
    const values = MCQ_CSV_HEADERS.map((name) =>
      row[headers.indexOf(name)].trim(),
    );
    const [question, a, b, c, d, answer, marksText] = values;
    if ([question, a, b, c, d].some((value) => !value)) {
      throw new Error(`${rowLabel}: question text and all four options are required.`);
    }
    const correctOption = answer.toUpperCase();
    if (
      correctOption !== "A" &&
      correctOption !== "B" &&
      correctOption !== "C" &&
      correctOption !== "D"
    ) {
      throw new Error(`${rowLabel}: correct_option must be A, B, C, or D.`);
    }
    const marks = Number(marksText);
    if (!/^\d+$/.test(marksText) || !Number.isSafeInteger(marks) || marks <= 0 || marks > 2147483647) {
      throw new Error(`${rowLabel}: marks must be a positive whole number.`);
    }
    return {
      question_text: question,
      option_a: a,
      option_b: b,
      option_c: c,
      option_d: d,
      correct_option: correctOption,
      marks,
    };
  });
}
