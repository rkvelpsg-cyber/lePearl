"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCardProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQCard({ faq, isOpen, onToggle }: FAQCardProps) {
  return (
    <div className="rounded-[12px] border border-[#EAEAEA] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold leading-relaxed">
          {faq.question}
        </span>
        <span className="mt-0.5 flex-shrink-0">
          {isOpen ? (
            <Minus className="h-5 w-5 text-gray-600" />
          ) : (
            <Plus className="h-5 w-5 text-gray-600" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-0">
          <p className="text-[14px] leading-relaxed text-gray-600">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const leftColumnFAQs: FAQ[] = [
    {
      question: "Which exams do you provide coaching for?",
      answer:
        "We offer complete preparation for NTA UGC NET (Paper I & II - English Literature), SET, Assistant Professor exams (MPPSC, UPHESC, UP GDC), LT Grade, and GIC. We also provide dedicated Interview Preparation, Research Proposal writing and Communication Skills modules.",
    },
    {
      question: "What makes LePearl different from other coaching institutes?",
      answer:
        "We focus on holistic development including Mind Healing Therapy, NLP sessions, personality development, leadership training, and emotional resilience along with exam preparation.",
    },
    {
      question: "Are classes online or offline?",
      answer:
        "All classes are flexible online live interactive sessions with a personalised student dashboard and recorded lectures available 24x7 for revision.",
    },
    {
      question: "Who are the faculty members?",
      answer:
        'Led by Dr. Prem Shankar Pandey (25+ years experience, 7-time NET qualifier, author of "World Literature in Your Fist"). Faculty includes Ms. Sadhana, Dr. Babli Mallick, Ms. Neelu Patel, and GS expert Dr. Harendra K Tripathi.',
    },
    {
      question: "If I miss a live class, can I get the recording?",
      answer:
        "Yes. Every live session is recorded and available 24×7 in your personalised dashboard. You can watch, pause, and revise anytime, ensuring no gaps in your preparation.",
    },
  ];

  const rightColumnFAQs: FAQ[] = [
    {
      question: "Do you provide study material and test series?",
      answer:
        "Yes. Students receive comprehensive notes, 100+ previous year papers, mock tests, and access to bestselling preparation books.",
    },
    {
      question: "Is this suitable for working professionals?",
      answer:
        "Yes. Flexible evening and weekend timings, recorded lectures, and a self-paced dashboard help working aspirants prepare easily.",
    },
    {
      question: "What are your past results?",
      answer:
        "Over 50 students have become Assistant Professors and more than 100 students have qualified NET/SET under our guidance.",
    },
    {
      question: "What kind of support is available during preparation?",
      answer:
        "Students receive a dedicated academic coach for doubt clearing, personalised mentoring, career counselling, and interview guidance throughout their journey.",
    },
    {
      question:
        "If I am not satisfied with the process and classes, can I get a refund?",
      answer:
        "Yes, partial refunds are available based on the duration of the course attended and as per our transparent Refund Policy.",
    },
  ];

  return (
    <section
      id="faq"
      className="w-full px-6 py-16"
      style={{ background: "rgba(255, 255, 255, 0.22)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold" style={{ color: "#2d1a4a" }}>
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-base" style={{ color: "#4c1d95" }}>
            Everything you need to know about LePearl Coaching Institute.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {leftColumnFAQs.map((faq, index) => (
              <FAQCard
                key={index}
                faq={faq}
                isOpen={openIndexes.has(index)}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>

          <div className="space-y-4">
            {rightColumnFAQs.map((faq, index) => {
              const globalIndex = index + leftColumnFAQs.length;
              return (
                <FAQCard
                  key={globalIndex}
                  faq={faq}
                  isOpen={openIndexes.has(globalIndex)}
                  onToggle={() => toggleFAQ(globalIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
