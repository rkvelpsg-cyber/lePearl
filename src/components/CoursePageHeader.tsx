import Image from "next/image";

type CoursePageHeaderProps = {
  onEnroll: () => void;
};

export function CoursePageHeader({ onEnroll }: CoursePageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
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
