import Image from "next/image";

export function FounderContent() {
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-10 md:mb-12 px-4 sm:px-6">
        <div className="flex items-center justify-center text-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Dr. Prem Shankar Pandey
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-gray-700 font-semibold">
              Founder &amp; Director, LePearl Education
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-75" />
            <Image
              src="/PremSir_Photo.jpeg"
              alt="Dr. Prem Shankar Pandey"
              width={256}
              height={320}
              className="relative rounded-2xl shadow-2xl w-52 sm:w-64 h-auto max-h-80 object-contain bg-white"
              priority
            />
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
            Dr. Prem Shankar Pandey is a visionary educator, researcher, author,
            and mentor with over 25 years of extensive experience in academia
            and professional development. As the Founder and Director of LePearl
            Education, he is dedicated to transforming lives through innovative
            training programs that bridge the gap between knowledge and
            real-world success. With a passion for empowering aspiring
            professionals, Dr. Pandey has built a legacy of excellence, guiding
            countless students toward academic and career triumphs.
          </p>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 border-b-4 border-purple-400 pb-2 inline-block">
              Academic Excellence and Qualifications
            </h2>
            <p className="text-gray-700 leading-relaxed mt-4">
              Dr. Pandey holds a Doctorate in American English, specializing in
              Psychoanalytical Studies, which forms the cornerstone of his
              interdisciplinary approach to language, psychology, and human
              potential. His academic prowess is underscored by qualifying the
              National Eligibility Test (NTA-NET) seven times, alongside State
              Eligibility Tests (SET) across various states—a testament to his
              unwavering commitment to scholarly rigor.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Complementing his doctoral expertise, Dr. Pandey has pursued
              advanced certifications, including a Post Graduate Diploma in
              Computer Applications and a Post Graduate Diploma in Training and
              Development. As a certified Master Practitioner of
              Neuro-Linguistic Programming (NLP), he masterfully integrates
              psychological insights with practical communication strategies to
              foster personal and professional growth.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 border-b-4 border-purple-400 pb-2 inline-block">
              Professional Journey
            </h2>
            <p className="text-gray-700 leading-relaxed mt-4">
              Dr. Pandey&apos;s illustrious career spans leadership roles in
              premier educational institutions. He served as Head of the
              Department of Training &amp; Placement at Hindustan Institute of
              Technology and Science (HITS), Chennai, where he spearheaded
              initiatives to enhance student employability and industry
              readiness. Prior to this, as Assistant Professor of English in the
              Department of Languages at HITS, he shaped the minds of future
              leaders through dynamic teaching and curriculum development.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              In addition to his teaching and administrative contributions, Dr.
              Pandey held the pivotal role of Editor for the university,
              overseeing publications that elevated institutional scholarship.
              His expertise extends to the global academic community as a
              revered Reviewer for the Scopus-indexed Women&apos;s Studies
              International Forum, ensuring the highest standards in feminist
              and interdisciplinary research.
            </p>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-indigo-600 p-4 mt-4 rounded-r-lg">
              <p className="text-gray-800 font-semibold">
                In recognition of his outstanding contributions to teaching and
                mentorship, Dr. Pandey was awarded
                <span className="text-indigo-700">
                  {" "}
                  Best Professor of the Year in 2023
                </span>{" "}
                by Hindustan Institute of Technology and Science.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 border-b-4 border-purple-400 pb-2 inline-block">
              Research, Publications, and Literary Contributions
            </h2>
            <p className="text-gray-700 leading-relaxed mt-4">
              A prolific scholar and bestselling author, Dr. Pandey has authored
              over 80 research papers in reputed journals, earning an impressive
              H-Index of 16. His work delves into the intersections of
              literature, psychoanalysis, and language pedagogy, influencing
              discourse in American English studies and beyond.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Dr. Pandey is also a celebrated author of
              <span className="font-semibold text-indigo-700">
                {" "}
                many bestselling books
              </span>{" "}
              in the field of English Literature, widely acclaimed for making
              complex topics accessible and exam-oriented for students preparing
              for competitive examinations like UGC-NET, SET, Assistant
              Professor and others. His notable works include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {[
                "World Literature in Your Fist, Vol. 1",
                "World Literature in Your Fist, Vol. 2",
                "World Literature in Your Fist, Vol. 3",
                "Literary Theory and Criticism in Your Lips",
                "Practice Workbook of English Literature",
                "Literature and Psychology",
                "Literature and Trauma",
                "Challenging the Challenges of Life",
                "Advanced Academic Writing",
              ].map((book, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg shadow-sm"
                >
                  <span className="text-indigo-600 mr-2">📚</span>
                  <span className="text-gray-700">{book}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              These books have received high praise, and strong endorsements as
              essential resources for English Literature aspirants.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 border-b-4 border-purple-400 pb-2 inline-block">
              Mentorship and Student Success
            </h2>
            <p className="text-gray-700 leading-relaxed mt-4">
              At the heart of Dr. Pandey&apos;s mission is his profound impact
              on students. Under his able guidance, more than 50 individuals
              have secured positions as Assistant Professors by 2025, while over
              100 have successfully qualified for NET and SET exams. His
              holistic mentoring—blending academic preparation with NLP-driven
              soft skills—has empowered a generation of educators and
              professionals to thrive in competitive landscapes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-6 rounded-xl shadow-md text-center">
                <div className="text-4xl font-bold text-indigo-700 mb-2">
                  50+
                </div>
                <div className="text-gray-700">Assistant Professors Placed</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl shadow-md text-center">
                <div className="text-4xl font-bold text-purple-700 mb-2">
                  100+
                </div>
                <div className="text-gray-700">NET &amp; SET Qualified</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 border-b-4 border-purple-400 pb-2 inline-block">
              Vision for Empowerment
            </h2>
            <p className="text-gray-700 leading-relaxed mt-4">
              Dr. Pandey&apos;s ultimate aim is to empower and upskill
              hardworking students, equipping them with the tools to achieve
              excellence in their personal and professional lives. Through
              LePearl Education, he continues to champion accessible,
              transformative learning experiences that unlock untapped potential
              and inspire lifelong success.
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl text-center mt-12">
            <p className="text-xl font-semibold">
              Connect with Dr. Pandey to explore how LePearl Education can
              elevate your journey toward greatness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
