import Image from "next/image";

export function MissionSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0a1628] px-6 py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-96 w-96 animate-pulse rounded-full bg-[#d4af37]/10 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-80 w-80 animate-pulse rounded-full bg-[#4a90e2]/15 blur-[100px] delay-1000" />
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

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
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
                  resilience, confident and articulate communication, strong
                  moral character, and inner harmony.
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
                  Our vision is to create quality-oriented professors for
                  colleges and universities across the nation, educators who are
                  passionately committed to empowering the next generation with
                  rock-solid conceptual understanding, sharp critical thinking,
                  and genuine intellectual independence.
                </p>
                <p className="text-lg leading-relaxed">
                  Through expert guidance, enriched knowledge, personalised
                  coaching, and our unique Mind Healing Therapy, we heal mental
                  blocks, dissolve anxiety, and unlock the true potential in
                  every aspirant. We envision producing scholars who excel in
                  academia, thrive personally, lead with empathy, and make
                  meaningful, lasting contributions to higher education and
                  society at large.
                </p>
                <p className="text-lg italic font-semibold leading-relaxed text-[#d4af37]">
                  At LePearl, success is never confined to a single clearance or
                  qualification; it is a lifelong, luminous journey of
                  continuous growth, deep transformation, and impactful presence
                  in the world of education.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 via-transparent to-[#4a90e2]/20 blur-xl" />
              <Image
                src="https://images.unsplash.com/photo-1758270704113-9fb2ac81788f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxlYXJuaW5nJTIwZ3Jvd3RoJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3Mjg5ODUxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students learning and growing together"
                width={1080}
                height={720}
                className="relative h-auto w-full rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />
              <div className="absolute right-6 top-6 h-16 w-16 rounded-tr-3xl border-r-2 border-t-2 border-[#d4af37]/60" />
              <div className="absolute bottom-6 left-6 h-16 w-16 rounded-bl-3xl border-b-2 border-l-2 border-[#4a90e2]/60" />
            </div>

            <div className="absolute -right-8 -top-8 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 animate-pulse rounded-full bg-gradient-to-tr from-[#4a90e2]/20 to-transparent blur-2xl delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
