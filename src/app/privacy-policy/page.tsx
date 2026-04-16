import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export default function PrivacyPolicy() {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <div style={{ height: 28 }} />

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <h1 className="mb-8 text-4xl font-bold text-[#1E3A8A]">
              Privacy Policy
            </h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  1. Introduction
                </h2>
                <p>
                  LePearl Education ("we," "us," "our," or "Company") is
                  committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you visit our website located at
                  lepearleducation.com and use our services.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  2. Information We Collect
                </h2>
                <p className="mb-3">
                  We may collect information about you in a variety of ways:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong>Personal Data:</strong> Name, email address, phone
                    number, address, and other information you voluntarily
                    provide through forms, registration, or account creation.
                  </li>
                  <li>
                    <strong>Automatically Collected Data:</strong> IP address,
                    browser type, operating system, pages visited, and time
                    spent on pages.
                  </li>
                  <li>
                    <strong>Cookies and Tracking:</strong> We use cookies to
                    enhance your experience and analyze site usage.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  3. How We Use Your Information
                </h2>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>
                    Send marketing communications (with your consent where
                    required)
                  </li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>Analyze usage patterns and improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  4. Information Sharing
                </h2>
                <p>
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share information with service providers
                  who assist us in operating our website and conducting our
                  business, subject to confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  6. Cookies and Tracking Technologies
                </h2>
                <p>
                  Our website uses cookies and similar tracking technologies to
                  enhance functionality and analyze usage. You can control
                  cookie settings through your browser. Disabling cookies may
                  affect the functionality of our website.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  7. Third-Party Links
                </h2>
                <p>
                  Our website may contain links to third-party websites. We are
                  not responsible for the privacy practices of external sites.
                  We encourage you to review their privacy policies before
                  providing your information.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  8. Your Rights
                </h2>
                <p className="mb-3">
                  Depending on your location, you may have:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate information</li>
                  <li>The right to request deletion of your information</li>
                  <li>The right to opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  9. Contact Us
                </h2>
                <p>
                  If you have questions or concerns about this Privacy Policy,
                  please contact us at:
                </p>
                <div className="mt-3 space-y-2">
                  <p>
                    <strong>Email:</strong> info@lepearl.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +91-99949 90639
                  </p>
                  <p>
                    <strong>Address:</strong> India
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                  10. Policy Changes
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Changes
                  will be posted on this page with an updated effective date.
                  Your continued use of our website constitutes acceptance of
                  any changes.
                </p>
              </section>

              <p className="mt-8 text-sm text-gray-600">
                Last Updated: April 2026
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
