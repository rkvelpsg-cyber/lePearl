type CoursePageHeaderProps = {
  onEnroll: () => void;
};

export function CoursePageHeader({ onEnroll }: CoursePageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-900 p-2">
            <img
              src="/WebsiteLogo_final_white.png"
              alt="LePearl Logo"
              className="h-12 w-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight text-blue-900">
              LePearl Education
            </h1>
            <p className="text-xs text-gray-600">
              Centre of Excellence in English Language & Literature
            </p>
          </div>
        </div>

        <button
          onClick={onEnroll}
          className="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-amber-600"
        >
          Enroll Now
        </button>
      </div>
    </header>
  );
}
