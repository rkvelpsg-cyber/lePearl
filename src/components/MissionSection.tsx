export function MissionSection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10, 22, 40, 0.72), rgba(30, 58, 95, 0.62)), url('/Mission_image2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-96 w-96 animate-pulse rounded-full bg-[#d4af37]/6 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-80 w-80 animate-pulse rounded-full bg-[#4a90e2]/8 blur-[100px] delay-1000" />
        <div className="absolute left-1/4 top-0 h-full w-1 -skew-x-12 bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent" />
        <div className="absolute right-1/3 top-0 h-full w-1 skew-x-12 bg-gradient-to-b from-transparent via-[#4a90e2]/15 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
            LePearl&apos;s Mission
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-10">
            <h3 className="mb-5 text-3xl font-bold text-[#d4af37]">Aim</h3>
            <div className="space-y-5 text-[#f5f5f0]">
              <p className="text-lg leading-relaxed">
                At LePearl Education, we aim to ignite a lifelong passion for
                learning and mould every student into an upright, well-rounded
                individual and responsible citizen. We go far beyond syllabus
                completion and exam scores. Through our carefully designed
                holistic programs, we nurture the complete personality of a
                truly learned person, building intellectual depth, emotional
                resilience, confident and articulate communication, strong moral
                character, and inner harmony.
              </p>
              <p className="text-lg leading-relaxed">
                At every stage of your journey, we focus on refining your
                personality traits and communication abilities, ensuring you
                emerge as a radiant, principled human being equipped not only
                for academic success but also for life&apos;s greater
                responsibilities and contributions to society.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-10">
            <h3 className="mb-5 text-3xl font-bold text-[#4a90e2]">Vision</h3>
            <div className="space-y-5 text-[#f5f5f0]">
              <p className="text-lg leading-relaxed">
                Our vision is to create quality-oriented professors for colleges
                and universities across the nation, educators who are
                passionately committed to empowering the next generation with
                rock-solid conceptual understanding, sharp critical thinking,
                and genuine intellectual independence.
              </p>
              <p className="text-lg leading-relaxed">
                Through expert guidance, enriched knowledge, personalised
                coaching, and our unique Mind Healing Therapy, we heal mental
                blocks, dissolve anxiety, and unlock the true potential in every
                aspirant. We envision producing scholars who excel in academia,
                thrive personally, lead with empathy, and make meaningful,
                lasting contributions to higher education and society at large.
              </p>
              <p className="text-lg italic font-semibold leading-relaxed text-[#d4af37]">
                At LePearl, success is never confined to a single clearance or
                qualification; it is a lifelong, luminous journey of continuous
                growth, deep transformation, and impactful presence in the world
                of education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
