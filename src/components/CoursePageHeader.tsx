import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { VideoPrefetcher } from "@/components/VideoPrefetcher";

type TopButton = {
  label: string;
  sectionId: string;
};

type CoursePageHeaderProps = {
  onEnroll: () => void;
  topButtons?: TopButton[];
};

const socialLinks = [
  {
    href: "https://www.youtube.com/channel/UCnxWNpUm3iltu922GwWnRHg",
    label: "YouTube",
    Icon: Youtube,
  },
  {
    href: "https://www.facebook.com/The-Pearl-Education-104234304455338/",
    label: "Facebook",
    Icon: Facebook,
  },
  {
    href: "https://www.instagram.com/thepearlseducation/",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://twitter.com/EducationPearl",
    label: "Twitter",
    Icon: Twitter,
  },
  {
    href: "https://www.linkedin.com/in/the-pearl-education-4a43151a0/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
];

export function CoursePageHeader({
  onEnroll,
  topButtons,
}: CoursePageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm overflow-x-hidden">
      <VideoPrefetcher />

      {/* Mobile Header - Logo and Button Only */}
      <div className="md:hidden flex items-center justify-between gap-2 px-3 py-2 min-h-[60px]">
        <a href="/" className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src="/LePearl_Logo_Canva_1.png"
              alt="LePearl logo"
              fill
              quality={100}
              className="object-contain"
            />
          </div>
          <div className="min-w-0 hidden xs:flex flex-col">
            <p className="text-sm font-bold text-purple-700 truncate">
              LePearl
            </p>
            <p className="text-[9px] leading-tight text-slate-600 truncate">
              Excellence in English
            </p>
          </div>
        </a>
        <div className="flex items-center gap-1">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={`mobile-${label}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-teal-700/90 p-1.5 text-white transition-colors hover:bg-teal-600"
              aria-label={label}
            >
              <Icon className="h-3.5 w-3.5" color="#ffffff" />
            </a>
          ))}
        </div>
        <a
          href="/login-portal" target="_blank" rel="noopener noreferrer"
          className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600 whitespace-nowrap flex-shrink-0"
        >
          Enroll
        </a>
      </div>

      {/* Desktop Header - Full Logo and Branding */}
      <div className="hidden md:flex w-full flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo and Branding — homepage-style company brand for all course pages */}
        <a href="/" className="flex min-w-0 items-center gap-3 text-left">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
            <Image
              src="/LePearl_Logo_Canva_1.png"
              alt="LePearl logo"
              fill
              quality={100}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-purple-700 sm:text-lg">
              LePearl Education
            </p>
            <p className="text-[10px] leading-tight text-slate-600 sm:text-xs">
              Centre of Excellence in English Language &amp; Literature
            </p>
          </div>
        </a>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          {topButtons && topButtons.length > 0 ? (
            <div className="hidden flex-wrap justify-center gap-2 lg:flex">
              {topButtons.map(({ label, sectionId }) => (
                <button
                  key={sectionId}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(sectionId)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 cursor-pointer whitespace-nowrap"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-teal-700/90 p-2 text-white transition-all duration-300 hover:scale-110 hover:bg-teal-600"
                aria-label={label}
              >
                <Icon className="h-4 w-4" color="#ffffff" />
              </a>
            ))}

            <a
              href="/login-portal" target="_blank" rel="noopener noreferrer"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 whitespace-nowrap"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
