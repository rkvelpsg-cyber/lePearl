type CoursePageHeaderProps = {
  onEnroll: () => void;
};

export function CoursePageHeader({ onEnroll }: CoursePageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-blue-900 p-1.5 sm:p-2">
            <img
              src="/WebsiteLogo_final_white.png"
              alt="LePearl Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-blue-900 truncate">
              LePearl Education
            </h1>
            <p className="text-xs text-gray-600 line-clamp-1">
              Centre of Excellence
            </p>
          </div>
        </div>

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
