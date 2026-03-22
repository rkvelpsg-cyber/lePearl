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

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-white p-2">
                <Image
                  src="/WebsiteLogo_final_white.png"
                  alt="LePearl Education Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">LePearl Education</h3>
                <p className="text-xs text-gray-200">
                  Centre of Excellence in English Language &amp; Literature
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-200">
              LePearl Education empowers aspirants to succeed in UGC NET, SET,
              PhD Entrance, and Assistant Professor examinations through expert
              mentorship, quality content, and holistic development.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="mb-4 border-b border-white/20 pb-2 text-lg font-bold">
              Courses &amp; Exams
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <BookOpen className="h-4 w-4" />
                  UGC NET Coaching
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <FileText className="h-4 w-4" />
                  SET Exam Preparation
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <GraduationCap className="h-4 w-4" />
                  PhD Entrance Preparation
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <Award className="h-4 w-4" />
                  UPHESC Assistant Professor
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <Award className="h-4 w-4" />
                  MPPSC Assistant Professor
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="flex items-center gap-2 text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  <FileText className="h-4 w-4" />
                  LT Grade Preparation
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="mb-4 border-b border-white/20 pb-2 text-lg font-bold">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#founder"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#achievers"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Faculty
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="#live-class"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Weekly Schedule
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#books"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Books
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="inline-block text-sm text-gray-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="mb-4 border-b border-white/20 pb-2 text-lg font-bold">
              Contact Information
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-200" />
                <span className="text-sm text-gray-200">India</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-200" />
                <span className="text-sm text-gray-200">+91-99949 90639</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-200" />
                <span className="text-sm text-gray-200">
                  info@lepearleducation.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-200" />
                <span className="text-sm text-gray-200">
                  www.lepearleducation.com
                </span>
              </li>
            </ul>

            <div className="pt-4">
              <h5 className="mb-3 text-sm font-semibold">Follow Us</h5>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2.5 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#6A0DAD]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p className="text-gray-200">
            © 2026 LePearl Education. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-200 transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-200 transition-colors duration-200 hover:text-white"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
