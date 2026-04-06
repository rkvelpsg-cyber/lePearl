"use client";

import { CoursePageHeader } from "@/components/CoursePageHeader";
import { CoursePageFooter } from "@/components/CoursePageFooter";
import { Sparkles } from "lucide-react";

export default function ResearchAssistancePage() {
  const scrollToContact = () => {
    document
      .getElementById("contact-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const topHeaderButtons = [
    {
      label: "Art of Research Paper Writing",
      sectionId: "section-research-paper",
    },
    { label: "Art of Thesis Writing", sectionId: "section-thesis" },
    { label: "Art of PhD Proposal Making", sectionId: "section-phd-proposal" },
    {
      label: "Learn the Art of Application of MLA and APA",
      sectionId: "section-mla-apa",
    },
    {
      label: "Guidance and Mentoring for Research Paper Writing",
      sectionId: "section-mentoring",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <CoursePageHeader
        onEnroll={scrollToContact}
        topButtons={topHeaderButtons}
      />

      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-800 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.3),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.25),_transparent_40%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Research Assistance Programs
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
              Learn, Write, and Publish with Expert Mentoring
            </h1>
            <p className="text-base text-indigo-100 sm:text-lg">
              Structured guidance for research paper writing and thesis writing,
              designed with live support and practical drafting workflows.
            </p>
          </div>
        </div>
      </section>

      <section
        id="section-research-paper"
        className="bg-gradient-to-b from-indigo-50 to-white px-0 py-12"
      >
        <div className="w-full">
          <div className="w-full mb-8 text-center px-6 sm:px-10 lg:px-14">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of Research Paper Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
          </div>

          <div className="w-full border-y border-indigo-100 bg-white p-6 sm:p-10 lg:p-14">
            <h1 className="mb-4 text-3xl font-bold text-indigo-900 sm:text-4xl">
              Master the Art of Research Paper Writing
            </h1>

            <h2 className="mb-4 text-2xl font-semibold text-indigo-800 sm:text-3xl">
              From Idea to Publication
            </h2>

            <p className="mb-8 leading-relaxed text-gray-700">
              Transform your research into impactful, publishable papers with
              expert guidance. Whether you&apos;re a PhD scholar, early-career
              researcher, or academic professional, this program equips you with
              the complete skill set to craft high-quality research papers that
              meet international standards.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Why Choose This Program?
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Pre-recorded lectures for flexible, self-paced learning</li>
              <li>Live interactive classes with real-time doubt clearing</li>
              <li>One-to-one personalised mentoring sessions</li>
              <li>
                Hands-on practical experiments and paper drafting exercises
              </li>
              <li>Comprehensive feedback on your actual research drafts</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              What You Will Master
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Identifying research gaps and formulating strong research
                questions
              </li>
              <li>
                Structuring a compelling Introduction, Literature Review,
                Methodology, Results, Discussion, and Conclusion
              </li>
              <li>
                Effective data presentation, visualisation, and interpretation
              </li>
              <li>
                Avoiding common pitfalls in academic writing (plagiarism, weak
                arguments, poor flow)
              </li>
              <li>
                Targeting high-impact journals and navigating the peer-review
                process
              </li>
              <li>Ethical considerations and journal submission strategies</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Program Format
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Pre-Recorded Lectures: 40+ hours of in-depth modules accessible
                anytime
              </li>
              <li>
                Live Classes: Weekly sessions with expert faculty for
                interactive learning
              </li>
              <li>
                One-to-One Interaction: Personal mentoring calls to review your
                drafts
              </li>
              <li>
                Practical Experiments: Real-time paper writing workshops, peer
                review simulations, and revision exercises
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Who Should Enrol?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              PhD scholars, MPhil students, college teachers, and independent
              researchers who want to publish on various platforms to enhance
              their portfolios.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">Outcome</h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              By the end of the program, you will have a complete,
              publication-ready research paper with expert feedback and a clear
              roadmap for successful journal submission.
            </p>

            <div
              id="contact-section"
              className="rounded-xl bg-indigo-900 px-5 py-4 text-center text-base font-semibold text-white sm:text-lg"
            >
              Enrol Now – Limited seats | Fee- 2995/-
            </div>
          </div>
        </div>
      </section>

      <section
        id="section-thesis"
        className="bg-gradient-to-b from-white to-indigo-50 px-0 py-12"
      >
        <div className="w-full">
          <div className="w-full mb-8 text-center px-6 sm:px-10 lg:px-14">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of Thesis Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
          </div>

          <div className="w-full border-y border-indigo-100 bg-white p-6 sm:p-10 lg:p-14">
            <h2 className="mb-4 text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of Thesis Writing
            </h2>

            <p className="mb-8 leading-relaxed text-gray-700">
              Craft a Scholarly Masterpiece That Stands the Test of Time
              <br />
              Turn months (or years) of research into a well-structured,
              coherent, and impactful thesis. This program demystifies thesis
              writing and guides you step-by-step from proposal to final
              submission.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Program Highlights
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Pre-recorded lectures covering every chapter of a thesis</li>
              <li>Live classes with one-to-one interaction</li>
              <li>Practical experiments in chapter drafting and revision</li>
              <li>Comprehensive feedback on your ongoing thesis work</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Key Skills You Will Develop
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Designing a logical thesis structure and chapter flow</li>
              <li>Writing a powerful abstract, introduction, and conclusion</li>
              <li>Conducting and presenting a robust literature review</li>
              <li>Justifying methodology with clarity and rigour</li>
              <li>
                Presenting findings with effective tables, figures, and
                statistical interpretation
              </li>
              <li>
                Defending your thesis with confidence (viva preparation
                included)
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Program Format
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Pre-Recorded Lectures: Detailed video modules on thesis
                components
              </li>
              <li>
                Live Classes: Regular interactive sessions for doubt resolution
              </li>
              <li>
                One-to-One Mentoring: Dedicated faculty reviews of your thesis
                chapters
              </li>
              <li>
                Practical Learning: Weekly writing sprints, peer feedback
                sessions, and revision workshops
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Who This Program Is For
            </h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              PhD candidates, MPhil students, and research scholars across
              disciplines who want to complete their thesis on time and with
              excellence.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">Outcome</h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              Submit a thesis that is academically sound, well-written, and
              ready for evaluation, while gaining lifelong academic writing
              confidence.
            </p>

            <div className="rounded-xl bg-indigo-900 px-5 py-4 text-center text-base font-semibold text-white sm:text-lg">
              Join the Program – Start your thesis journey with clarity and
              expert support at only 5995/-
            </div>
          </div>
        </div>
      </section>

      <section
        id="section-phd-proposal"
        className="bg-gradient-to-b from-indigo-50 to-white px-0 py-12"
      >
        <div className="w-full">
          <div className="w-full mb-8 text-center px-6 sm:px-10 lg:px-14">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of PhD Proposal Making
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
          </div>

          <div className="w-full border-y border-indigo-100 bg-white p-6 sm:p-10 lg:p-14">
            <h2 className="mb-4 text-3xl font-bold text-indigo-900 sm:text-4xl">
              Art of PhD Proposal Making
            </h2>

            <p className="mb-8 leading-relaxed text-gray-700">
              Get Your Research Idea Approved on the First Attempt
              <br />A strong PhD proposal is your gateway to admission and
              funding. Learn the art of crafting a winning research proposal
              that impresses selection committees and funding agencies.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              What Makes This Program Unique?
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Pre-recorded lectures on proposal essentials</li>
              <li>Live classes with direct faculty interaction</li>
              <li>One-to-one proposal review and refinement</li>
              <li>
                Practical experiments through proposal drafting and presentation
                practice
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              You Will Learn
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                How to identify a novel, feasible, and significant research
                problem
              </li>
              <li>Writing a clear research aim, objectives, and hypotheses</li>
              <li>
                Framing a compelling theoretical framework and methodology
              </li>
              <li>Budget justification and timeline planning</li>
              <li>Preparing for PhD interview and synopsis presentation</li>
              <li>
                Aligning your proposal with the university and funding
                guidelines
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Program Format
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Pre-Recorded Lectures: Step-by-step modules on proposal writing
              </li>
              <li>Live Classes: Interactive workshops and Q&amp;A</li>
              <li>
                One-to-One Interaction: Personalised feedback on your draft
                proposal
              </li>
              <li>
                Practical Experiments: Mock presentations, peer reviews, and
                iterative revisions
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Ideal For
            </h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              Aspiring PhD scholars, candidates preparing for entrance
              tests/interviews, and researchers seeking fellowships (UGC-JRF,
              ICSSR, etc.).
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">Outcome</h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              A polished, approval-ready PhD proposal that clearly communicates
              your research vision and increases your chances of selection and
              funding.
            </p>

            <div className="rounded-xl bg-indigo-900 px-5 py-4 text-center text-base font-semibold text-white sm:text-lg">
              Enrol Today – Turn your research dream into a funded reality at a
              minimal cost of 1995/-
            </div>
          </div>
        </div>
      </section>

      <section
        id="section-mla-apa"
        className="bg-gradient-to-b from-white to-indigo-50 px-0 py-12"
      >
        <div className="w-full">
          <div className="w-full mb-8 text-center px-6 sm:px-10 lg:px-14">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Learn the Art of Application of MLA and APA
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
          </div>

          <div className="w-full border-y border-indigo-100 bg-white p-6 sm:p-10 lg:p-14">
            <h2 className="mb-4 text-3xl font-bold text-indigo-900 sm:text-4xl">
              Learn the Art of Application of MLA and APA
            </h2>

            <p className="mb-8 leading-relaxed text-gray-700">
              Master Citation Styles with Precision and Confidence
              <br />
              Citation errors can cost you marks, publication rejection, or even
              accusations of plagiarism. Master both MLA (9th edition) and APA
              (7th edition) with practical application.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Program Features
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Pre-recorded lectures with real examples</li>
              <li>Live classes for interactive doubt clearing</li>
              <li>One-to-one mentoring on your documents</li>
              <li>
                Hands-on practical experiments using your own research material
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              What You Will Master
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>In-text citations, direct quotes, and paraphrasing rules</li>
              <li>Formatting Works Cited / References pages</li>
              <li>
                Handling books, journal articles, websites, social media, AI
                tools, and more
              </li>
              <li>Differences between MLA and APA - when to use which style</li>
              <li>Creating accurate tables, figures, and appendices</li>
              <li>
                Common mistakes and how to avoid them in research papers,
                theses, and dissertations
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Program Format
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Pre-Recorded Lectures: Clear, visual explanations of rules and
                examples
              </li>
              <li>Live Classes: Weekly practice sessions</li>
              <li>
                One-to-One Interaction: Personal review of your citations and
                bibliography
              </li>
              <li>
                Practical Experiments: Live editing workshops on real student
                documents
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Who is this course for?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              Research scholars, thesis writers, journal authors, and students
              submitting assignments in the humanities, social sciences, and
              education.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">Outcome</h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              Error-free, professionally formatted citations and references that
              meet university and journal standards.
            </p>

            <div className="rounded-xl bg-indigo-900 px-5 py-4 text-center text-base font-semibold text-white sm:text-lg">
              Enrol Now – Never lose marks on formatting again with our
              cost-effective course at just 1995/-
            </div>
          </div>
        </div>
      </section>

      <section
        id="section-mentoring"
        className="bg-gradient-to-b from-indigo-50 to-white px-0 py-12"
      >
        <div className="w-full">
          <div className="w-full mb-8 text-center px-6 sm:px-10 lg:px-14">
            <h2 className="text-3xl font-bold text-indigo-900 sm:text-4xl">
              Guidance and Mentoring for Research Paper Writing
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
          </div>

          <div className="w-full border-y border-indigo-100 bg-white p-6 sm:p-10 lg:p-14">
            <h2 className="mb-4 text-3xl font-bold text-indigo-900 sm:text-4xl">
              Guidance and Mentoring for Research Paper Writing
            </h2>

            <p className="mb-8 leading-relaxed text-gray-700">
              Personalised Expert Support from Draft to Publication
              <br />
              Not every researcher needs a full course. Sometimes you just need
              focused, one-to-one guidance on your specific research paper.
            </p>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Our Mentoring Approach
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Completely personalised one-to-one sessions with experienced
                faculty
              </li>
              <li>
                Pre-recorded micro-lectures on topics relevant to your paper
              </li>
              <li>Live interactive feedback calls</li>
              <li>Hands-on practical help with your actual manuscript</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Services Offered
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Topic refinement and research gap identification</li>
              <li>Full paper structuring and chapter-wise guidance</li>
              <li>Literature review development</li>
              <li>Methodology design and data analysis support</li>
              <li>Draft review, editing, and language polishing</li>
              <li>Journal selection and submission strategy</li>
              <li>Response to reviewer comments (revision support)</li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              How It Works
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Share your current draft/research idea</li>
              <li>Schedule one-to-one sessions as per your convenience</li>
              <li>Receive detailed written feedback + live discussion</li>
              <li>
                Revise with practical experiments and iterative improvement
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">
              Who Benefits Most?
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Scholars are stuck at any stage of paper writing</li>
              <li>Researchers aiming for Scopus/UGC-CARE publications</li>
              <li>
                Those who have completed data collection but struggle with
                writing
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-bold text-indigo-900">Outcome</h3>
            <p className="mb-8 leading-relaxed text-gray-700">
              A high-quality, submission-ready research paper with expert
              validation and an increased publication success rate.
            </p>

            <div className="rounded-xl bg-indigo-900 px-5 py-4 text-center text-base font-semibold text-white sm:text-lg">
              Book Your Personalised Mentoring Session
              <br />
              For one hour- 1000/-
              <br />
              For 30 minutes- 750/-
              <br />
              <br />
              10% discount for all the Pearlians.
            </div>
          </div>
        </div>
      </section>

      <CoursePageFooter />
    </div>
  );
}
