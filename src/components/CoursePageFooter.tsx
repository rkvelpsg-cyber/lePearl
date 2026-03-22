import { Facebook, Instagram, Linkedin, Mail, Phone, X } from "lucide-react";

export function CoursePageFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-900 p-2">
                <img
                  src="/WebsiteLogo_final_white.png"
                  alt="LePearl Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight text-white">
                  LePearl Education
                </h3>
                <p className="text-xs text-gray-400">
                  Centre of Excellence in English Language & Literature
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering aspirants with quality coaching and complete academic
              support.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <a
                  href="tel:+919876543210"
                  className="text-sm transition-colors hover:text-amber-400"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <a
                  href="mailto:info@lepearlcoaching.com"
                  className="text-sm transition-colors hover:text-amber-400"
                >
                  info@lepearlcoaching.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, X, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="rounded-full bg-blue-800 p-3 transition-colors hover:bg-amber-500"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} LePearl Education. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
