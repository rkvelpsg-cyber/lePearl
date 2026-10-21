"use client";

import { useRef, useState } from "react";
import { FileDown, Loader2, Upload } from "lucide-react";
import { MCQ_CSV_HEADERS, parseMcqCsv, type McqCsvQuestion } from "@/lib/mcqCsv";
import { createClient } from "@/lib/supabase/client";

type Props = {
  testId: number;
  totalMarks: number;
  published: boolean;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
  onImported: () => void;
};

export default function McqCsvImport({
  testId,
  totalMarks,
  published,
  disabled,
  onBusyChange,
  onImported,
}: Props) {
  const [questions, setQuestions] = useState<McqCsvQuestion[]>([]);
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);
  const operationInProgress = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function readFile(file: File) {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setQuestions([]);
    setFilename("");
    setMessage(null);
    setBusy(true);
    onBusyChange(true);
    try {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Choose a CSV file, not an Excel workbook. Save the spreadsheet as CSV UTF-8 first.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("The CSV file must be 5 MB or smaller.");
      }
      const parsed = parseMcqCsv(await file.text());
      setQuestions(parsed);
      setFilename(file.name);
    } catch (error) {
      setMessage({
        error: true,
        text: error instanceof Error ? error.message : "Failed to read the CSV file.",
      });
    } finally {
      operationInProgress.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  }

  async function importQuestions() {
    if (operationInProgress.current || questions.length === 0) return;
    operationInProgress.current = true;
    setBusy(true);
    onBusyChange(true);
    setMessage(null);
    try {
      const supabase = createClient("faculty");
      const { data: test, error: testError } = await supabase
        .from("mock_tests")
        .select("is_published, test_type")
        .eq("id", testId)
        .single();
      if (testError) throw testError;
      if (test.is_published || test.test_type !== "mcq") {
        throw new Error("CSV import is available only for draft MCQ tests. Unpublish the test before importing.");
      }
      const { data: existing, error: existingError } = await supabase
        .from("mcq_questions")
        .select("question_order")
        .eq("mock_test_id", testId)
        .order("question_order", { ascending: false })
        .limit(1);
      if (existingError) throw existingError;
      const lastOrder = existing?.[0]?.question_order ?? 0;
      const { error } = await supabase.from("mcq_questions").insert(
        questions.map((question, index) => ({
          ...question,
          mock_test_id: testId,
          question_order: lastOrder + index + 1,
        })),
      );
      if (error) throw error;
      const count = questions.length;
      setQuestions([]);
      setFilename("");
      if (fileInput.current) fileInput.current.value = "";
      setMessage({
        error: false,
        text: `${count} questions imported. Review the questions and total test marks before publishing.`,
      });
      onImported();
    } catch (error) {
      console.error("MCQ CSV import failed:", error);
      setMessage({
        error: true,
        text:
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Failed to import questions. No questions were added.",
      });
    } finally {
      operationInProgress.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  }

  return (
    <section className="mb-4 rounded-xl border border-purple-100 bg-purple-50 p-4">
      <h3 className="text-sm font-bold text-gray-900">Bulk import MCQ questions</h3>
      <p className="mt-1 text-xs text-gray-600">
        Keep using Add Question, or upload all your questions in one CSV.
        Import appends questions in file order without replacing existing questions.
        The test details and publishing status are not changed.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-purple-200 bg-white p-3">
        <a
          href="/templates/mcq-questions.csv"
          download
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-100 px-4 py-2.5 text-sm font-semibold !text-purple-800 shadow-sm transition-colors hover:bg-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        >
          <FileDown className="h-4 w-4" /> Download CSV Template
        </a>
        <button
          type="button"
          disabled={disabled || busy || published}
          onClick={() => fileInput.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
        >
          <Upload className="h-4 w-4" /> Choose CSV File
        </button>
        <span
          role="status"
          className="min-w-0 max-w-full break-all text-xs text-gray-600"
        >
          {filename || "No CSV file selected"}
        </span>
        <input
            ref={fileInput}
            type="file"
            aria-label="Choose CSV file"
            accept=".csv,text/csv"
            disabled={disabled || busy || published}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readFile(file);
              event.target.value = "";
            }}
            className="hidden"
          />
      </div>
      <p className="mt-2 text-xs text-gray-600">
        Columns: {MCQ_CSV_HEADERS.join(", ")}. Use A/B/C/D for the correct answer
        and positive whole numbers for marks. Save as CSV UTF-8 (up to 5 MB).
        Quoted commas, quotes, and multiline questions are supported.
      </p>
      {published && (
        <p className="mt-2 text-xs text-amber-800">
          Unpublish this test before importing questions.
        </p>
      )}
      {questions.length > 0 && (
        <div className="mt-3 space-y-3">
          <p className="text-sm font-semibold text-purple-900">
            {filename}: {questions.length} questions,{" "}
            {questions.reduce((sum, question) => sum + question.marks, 0)} marks to add.
            {" "}Configured test maximum: {totalMarks} marks.
          </p>
          <p className="text-xs text-gray-600">
            Preview (first 3 questions). Nothing is saved until you select Import Questions.
            Use Details to adjust the total test marks if needed.
          </p>
          <ol className="space-y-2 text-xs text-gray-700">
            {questions.slice(0, 3).map((question, index) => (
              <li key={index} className="rounded-lg bg-white p-3">
                <p className="whitespace-pre-wrap font-semibold">{index + 1}. {question.question_text}</p>
                <p>A. {question.option_a} | B. {question.option_b}</p>
                <p>C. {question.option_c} | D. {question.option_d}</p>
                <p>Correct: {question.correct_option} | Marks: {question.marks}</p>
              </li>
            ))}
          </ol>
          <button
            type="button"
            disabled={disabled || busy || published}
            onClick={() => void importQuestions()}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import {questions.length} Questions
          </button>
        </div>
      )}
      {busy && <p role="status" className="mt-2 text-xs text-purple-700">Processing CSV...</p>}
      {message && (
        <p role={message.error ? "alert" : "status"} className={`mt-2 text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}
