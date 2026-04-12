import Image from "next/image";
import {
  Award,
  BookOpen,
  Facebook,
  FileText,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
  Twitter,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#6A0DAD] to-[#1E3A8A] text-white"
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/WebsiteLogo_final_white.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-10 top-10">
          <GraduationCap className="h-32 w-32" />
        </div>
        <div className="absolute bottom-20 right-20">
          <BookOpen className="h-24 w-24" />
        </div>
        <div className="absolute right-1/4 top-1/3">
          <Award className="h-20 w-20" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="mb-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="mb-4 flex items-start gap-3 sm:gap-4">
              <Image
                src="/logo_vectorformat.png"
                alt="LePearl Education Logo"
                width={80}
                height={80}
                className="object-contain flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20"
              />
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold break-words">
                  LePearl Education
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 leading-tight break-words">
                  Centre of Excellence in English Language &amp; Literature
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-200 break-words">
              LePearl Education empowers aspirants to succeed in UGC NET, SET,
              PhD Entrance, and Assistant Professor examinations through expert
              mentorship, quality content, and holistic development.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="mb-3 sm:mb-4 border-b border-white/20 pb-2 text-sm sm:text-lg font-bold">
              Courses &amp; Exams
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white min-w-0"
                >
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">UGC NET Coaching</span>
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white min-w-0"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">SET Exam Preparation</span>
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white min-w-0"
                >
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">PhD Entrance Prep</span>
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white min-w-0"
                >
                  <Award className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">UPHESC Prof</span>
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white min-w-0"
                >
                  <Award className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">MPPSC Prof</span>
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white min-w-0"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">LT Grade Prep</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="mb-3 sm:mb-4 border-b border-white/20 pb-2 text-sm sm:text-lg font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#founder"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#achievers"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  Faculty
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="#live-class"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  Schedule
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#books"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  Books
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="inline-block text-xs sm:text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white truncate w-full"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="mb-3 sm:mb-4 border-b border-white/20 pb-2 text-sm sm:text-lg font-bold">
              Contact Information
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3 min-w-0">
                <MapPin className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-200" />
                <span className="text-xs sm:text-sm text-gray-200 break-words">
                  India
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 min-w-0">
                <Phone className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-200" />
                <span className="text-xs sm:text-sm text-gray-200">
                  +91-99949 90639
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 min-w-0">
                <Mail className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-200" />
                <span className="text-xs sm:text-sm text-gray-200 truncate">
                  info@lepearl.com
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 min-w-0">
                <Globe className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-200" />
                <span className="text-xs sm:text-sm text-gray-200 truncate">
                  lepearleducation.com
                </span>
              </li>
            </ul>

            <div className="pt-4">
              <h5 className="mb-3 text-xs sm:text-sm font-semibold">
                Follow Us
              </h5>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href="https://www.youtube.com/channel/UCnxWNpUm3iltu922GwWnRHg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href="https://www.facebook.com/The-Pearl-Education-104234304455338/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href="https://www.instagram.com/thepearlseducation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href="https://twitter.com/EducationPearl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/the-pearl-education-4a43151a0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm md:flex-row">
          <p className="text-gray-200 text-center md:text-left">
            © 2026 LePearl Education. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <a
              href="#"
              className="text-gray-200 transition-colors duration-200 hover:text-white whitespace-nowrap"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-200 transition-colors duration-200 hover:text-white whitespace-nowrap"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
