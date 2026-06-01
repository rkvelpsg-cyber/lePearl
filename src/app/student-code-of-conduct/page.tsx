import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export default function StudentCodeOfConduct() {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <div style={{ height: 28 }} />

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <h1 className="mb-2 text-4xl font-bold text-[#1E3A8A]">
              Student Code of Conduct
            </h1>
            <p className="mb-2 text-lg font-semibold text-gray-700">
              LePearl Education
            </p>
            <p className="mb-10 text-sm text-gray-500">
              Effective Date: May 30, 2026
            </p>

            <div className="space-y-8 text-gray-700">
              <section>
                <p className="leading-relaxed">
                  At LePearl Education, we are committed to creating a
                  respectful, professional, and focused learning environment
                  that supports every student&rsquo;s success in competitive
                  English Literature examinations. This Student Code of Conduct
                  outlines the expectations for all enrolled students to ensure
                  a positive and productive learning experience for everyone.
                </p>
                <p className="mt-4 leading-relaxed font-medium">
                  By enrolling in any course at LePearl Education, you agree to
                  abide by this Code of Conduct.
                </p>
              </section>

              {/* 1. Purpose */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  1. Purpose
                </h2>
                <p className="leading-relaxed">
                  This Code of Conduct promotes academic excellence, mutual
                  respect, and ethical behaviour. It helps maintain the
                  integrity of our courses and protects the rights of all
                  learners and faculty.
                </p>
              </section>

              {/* 2. Respect and Professionalism */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  2. Respect and Professionalism
                </h2>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>
                    Treat all faculty members, staff, and fellow students with
                    courtesy and respect at all times.
                  </li>
                  <li>
                    Use professional and polite language in all communications
                    (live classes, discussion forums, WhatsApp groups, emails,
                    etc.).
                  </li>
                  <li>
                    Respect diverse opinions and perspectives during discussions
                    and doubt-clearing sessions.
                  </li>
                  <li>
                    Avoid any form of discrimination, harassment, bullying, or
                    offensive behaviour based on caste, religion, gender,
                    region, or personal background.
                  </li>
                </ol>
              </section>

              {/* 3. Academic Integrity */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  3. Academic Integrity
                </h2>
                <p className="mb-3 leading-relaxed">
                  LePearl Education maintains a zero-tolerance policy towards
                  academic dishonesty. You must:
                </p>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>
                    Submit only your own original work in all assignments,
                    tests, and mock examinations.
                  </li>
                  <li>
                    Do not engage in cheating, plagiarism, impersonation, or any
                    form of unfair means during assessments.
                  </li>
                  <li>
                    Do not share, distribute, or publish answers to mock tests,
                    previous year questions (PYQs), or any internal assessments.
                  </li>
                  <li>
                    Acknowledge and respect the intellectual property of all
                    course materials.
                  </li>
                </ol>
                <p className="mt-4 leading-relaxed text-red-700 font-medium">
                  Violation of academic integrity will result in strict
                  disciplinary action, including possible permanent expulsion.
                </p>
              </section>

              {/* 4. Use of Course Content and Platform */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  4. Use of Course Content and Platform
                </h2>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>
                    You are granted a limited, non-transferable license to
                    access course materials only for your personal learning.
                  </li>
                  <li>
                    You shall not record, download (except where explicitly
                    permitted), copy, reproduce, distribute, share, sell, or
                    upload LePearl Education&rsquo;s content (videos, notes,
                    PDFs, mock tests, live sessions, etc.) on any other
                    platform.
                  </li>
                  <li>
                    Do not share your login credentials with anyone. You are
                    solely responsible for all activity under your account.
                  </li>
                  <li>
                    Access the platform only through authorised means and
                    devices.
                  </li>
                </ol>
              </section>

              {/* 5. Participation and Commitment */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  5. Participation and Commitment
                </h2>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>
                    Actively participate in classes, discussions, and
                    assignments to gain maximum benefit from our four-stage
                    learning methodology.
                  </li>
                  <li>
                    Complete all assigned tasks, quizzes, and mock tests with
                    sincerity.
                  </li>
                  <li>
                    Attend live sessions on time and maintain proper decorum
                    (camera on if required by faculty).
                  </li>
                  <li>
                    Inform the support team in advance in case of genuine
                    inability to attend scheduled sessions.
                  </li>
                </ol>
              </section>

              {/* 6. Communication Guidelines */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  6. Communication Guidelines
                </h2>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>
                    Use official communication channels (student dashboard,
                    official WhatsApp groups, support email) for all academic
                    and administrative queries.
                  </li>
                  <li>
                    Do not spam, forward irrelevant messages, or engage in
                    unnecessary discussions in official groups.
                  </li>
                  <li>
                    Resolve doubts through proper academic channels instead of
                    personal messaging faculty outside designated hours.
                  </li>
                </ol>
              </section>

              {/* 7. Prohibited Conduct */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  7. Prohibited Conduct
                </h2>
                <p className="mb-3 leading-relaxed">
                  The following behaviours are strictly prohibited:
                </p>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>Misconduct during live classes or doubt sessions</li>
                  <li>
                    Posting abusive, defamatory, or obscene content anywhere on
                    the platform
                  </li>
                  <li>Promoting external courses, coaching, or products</li>
                  <li>Creating fake accounts or impersonating others</li>
                  <li>
                    Attempting to hack, disrupt, or interfere with the
                    platform&rsquo;s functioning
                  </li>
                  <li>
                    Any activity that damages the reputation of LePearl
                    Education
                  </li>
                </ol>
              </section>

              {/* 8. Consequences of Violation */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  8. Consequences of Violation
                </h2>
                <p className="mb-3 leading-relaxed">
                  Any breach of this Code of Conduct may result in the following
                  actions (depending on severity):
                </p>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>Warning (verbal or written)</li>
                  <li>Temporary suspension from classes and platform access</li>
                  <li>Permanent expulsion from the course without refund</li>
                  <li>Legal action, where applicable</li>
                </ol>
                <p className="mt-4 leading-relaxed">
                  LePearl Education reserves the sole right to determine the
                  appropriate disciplinary action.
                </p>
              </section>

              {/* 9. Reporting Violations */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  9. Reporting Violations
                </h2>
                <p className="leading-relaxed">
                  If you witness or experience any violation of this Code of
                  Conduct, please report it immediately to the support team at{" "}
                  <a
                    href="mailto:heal.mindshift@gmail.com"
                    className="text-[#1E3A8A] underline hover:text-blue-700"
                  >
                    heal.mindshift@gmail.com
                  </a>
                  . All reports will be handled confidentially and investigated
                  fairly.
                </p>
              </section>

              {/* 10. Acknowledgement */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#1E3A8A]">
                  10. Acknowledgement
                </h2>
                <p className="leading-relaxed">
                  By enrolling in any course at LePearl Education, you confirm
                  that you have read, understood, and agree to comply with this
                  Student Code of Conduct. You also acknowledge that failure to
                  adhere to these standards may result in disciplinary action as
                  outlined above.
                </p>
                <p className="mt-4 leading-relaxed">
                  We believe that discipline, respect, and dedication are
                  essential for success in competitive examinations. We look
                  forward to supporting you on your journey toward academic and
                  professional excellence.
                </p>
              </section>

              {/* Footer note */}
              <section className="border-t border-gray-200 pt-6">
                <p className="font-semibold text-gray-800">LePearl Education</p>
                <p className="mt-1 text-sm text-gray-600">
                  Website:{" "}
                  <a
                    href="https://lepearleducation.com"
                    className="text-[#1E3A8A] underline hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://lepearleducation.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
