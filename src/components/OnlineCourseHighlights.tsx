import { CheckCircle } from "lucide-react";

const HIGHLIGHTS = [
  "Live classes conducted in the night slot, which is effective for the working professionals also",
  "The payment for the course is also available in an instalment format for the convenience of the students.",
  "There are fortnightly or weekly tests conducted in the course",
  "Live classes thrice a week",
  "Live classes are also provided in recorded format for the students who miss their live class for some reason.",
  "Validity of the Course: The course remains available for 6 months post completion of the course.",
];

export function OnlineCourseHighlights() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-teal-100 bg-white p-8 shadow-md md:p-10">
          <h2 className="mb-6 text-2xl font-bold text-teal-800 md:text-3xl">
            Course Delivery Highlights
          </h2>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-700" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
