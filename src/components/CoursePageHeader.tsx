import Image from "next/image";

type TopButton = {
  label: string;
  sectionId: string;
};

type CoursePageHeaderProps = {
  onEnroll: () => void;
  topButtons?: TopButton[];
};

export function CoursePageHeader({
  onEnroll,
  topButtons,
}: CoursePageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex w-full items-center justify-between gap-3 px-3 py-2 sm:px-5 sm:py-3">
        {/* Logo and Branding — matches homepage style */}
        <a
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 120,
          }}
        >
          <Image
            src="/logo_vectorformat.png"
            alt="LePearl logo"
            width={110}
            height={110}
            quality={100}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.2,
              textAlign: "center",
              marginTop: -10,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 16, color: "#a21caf" }}>
              LePearl Education
            </span>
            <span style={{ fontSize: 10, color: "#4c1d95", fontWeight: 500 }}>
              Centre of Excellence in English Language &amp; Literature
            </span>
          </div>
        </a>

        {topButtons && topButtons.length > 0 ? (
          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {topButtons.map(({ label, sectionId }) => (
                <button
                  key={sectionId}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(sectionId)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 lg:block" />
        )}

        <a
          href="/login"
          className="rounded-lg bg-amber-500 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-amber-600 whitespace-nowrap flex-shrink-0 ml-2"
        >
          Enroll Now
        </a>
      </div>
    </header>
  );
}
