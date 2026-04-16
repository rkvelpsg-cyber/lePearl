"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { NavDropdown } from "@/components/NavDropdown";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      style={{
        position: "relative",
        zIndex: 10,
        background: "transparent",
        borderBottom: "none",
      }}
    >
      {/* Mobile/Tablet Header - visible below lg */}
      <div className="lg:hidden flex items-center justify-between gap-2 px-2 py-2 min-h-[56px] bg-white">
        {/* Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={20} className="text-gray-800" />
          ) : (
            <Menu size={20} className="text-gray-800" />
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Side Buttons - WhatsApp and Login */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919994990639"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex-shrink-0"
            aria-label="WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.207-.243-.579-.49-.5-.672-.51-.173-.009-.372-.011-.571-.011-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347z" />
              <path d="M12.004 2.002C6.478 2.002 2 6.48 2 12.006c0 2.115.655 4.075 1.782 5.732L2 22l4.43-1.16c1.57.857 3.337 1.344 5.574 1.344 5.523 0 10.004-4.479 10.004-10.004S17.527 2.002 12.004 2.002zm0 18.067c-2.15 0-3.867-.707-5.297-1.882l-.379-.275-2.626.688.701-2.561-.247-.412C3.066 15.458 2.5 13.776 2.5 12.006 2.5 7.081 6.582 3 11.999 3c5.417 0 9.5 4.081 9.5 9.006 0 4.924-4.083 9.063-9.495 9.063z" />
            </svg>
          </a>

          {/* Login Button */}
          <a
            href="/login-portal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors flex-shrink-0 whitespace-nowrap"
          >
            Login
          </a>
        </div>
      </div>

      {/* Desktop Header Content */}
      <DesktopHeader />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        ref={drawerRef}
        className={`fixed left-0 top-0 h-screen w-64 max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden z-50 overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-base">Menu</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 hover:bg-purple-700 rounded transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="p-4 space-y-1">
          <DrawerLink
            href="#"
            label="Home"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Online Courses */}
          <DrawerSection label="Online Courses">
            <DrawerSubSection label="Assistant Professor">
              <DrawerLink href="/courses-mppsc" label="MPPSC" />
              <DrawerLink href="/courses-uphesc" label="UPHESC" />
              <DrawerLink href="/courses-upgdc" label="UP GDC" />
            </DrawerSubSection>
            <DrawerSubSection label="NTA NET">
              <DrawerLink href="/courses-net-paper1" label="NET Paper 1" />
              <DrawerLink href="/courses-net-paper2" label="NET Paper 2" />
            </DrawerSubSection>
            <DrawerSubSection label="Other Teaching Exams">
              <DrawerLink href="/courses-gic" label="GIC" />
              <DrawerLink href="/courses-ltgrade" label="LT Grade" />
            </DrawerSubSection>
            <DrawerSubSection label="Interview Preparation">
              <DrawerLink
                href="/interview-preparation/assistant-professor-1"
                label="Assistant Professor 1"
                target="_blank"
                rel="noopener noreferrer"
              />
              <DrawerLink
                href="/interview-preparation/du-interview"
                label="DU Interview"
                target="_blank"
                rel="noopener noreferrer"
              />
              <DrawerLink
                href="/interview-preparation/phd-interview"
                label="PhD Interview"
                target="_blank"
                rel="noopener noreferrer"
              />
            </DrawerSubSection>
            <DrawerLink
              href="/courses-communication-skills"
              label="Communication Skills"
            />
            <DrawerLink
              href="/courses-set"
              label="SET"
              target="_blank"
              rel="noopener noreferrer"
            />
          </DrawerSection>

          <DrawerLink
            href="/research-assistance"
            label="Research Assistance"
            onClick={() => setMobileMenuOpen(false)}
          />
          <DrawerLink
            href="#pyqs"
            label="PYQs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <DrawerLink
            href="/achievers"
            label="LePearl Achievers"
            onClick={() => setMobileMenuOpen(false)}
          />
          <DrawerLink
            href="#reviews"
            label="Student Reviews"
            onClick={() => setMobileMenuOpen(false)}
          />
          <DrawerLink
            href="#mock"
            label="Mock Test"
            onClick={() => setMobileMenuOpen(false)}
          />
          <DrawerLink
            href="#books"
            label="Books"
            onClick={() => setMobileMenuOpen(false)}
          />
          <DrawerLink
            href="#live-class"
            label="Live Class"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Footer */}
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <a
              href="#live-class"
              className="block px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Live Class
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function DesktopHeader() {
  return (
    <div
      className="hidden lg:flex items-center justify-between gap-4 px-8 lg:px-12 py-3"
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 32px",
      }}
    >
      {/* Logo and Branding */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 150,
        }}
      >
        <Image
          src="/logo_vectorformat.png"
          alt="LePearl logo"
          width={220}
          height={220}
          quality={100}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.2,
            textAlign: "center",
            marginTop: -22,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 22, color: "#a21caf" }}>
            LePearl Education
          </span>
          <span style={{ fontSize: 12, color: "#4c1d95", fontWeight: 500 }}>
            Centre of Excellence in English Language &amp; Literature
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 20,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Navigation Menu */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flex: "0 1 auto",
            minWidth: 0,
            whiteSpace: "nowrap",
            marginRight: 20,
          }}
        >
          <span
            style={{
              background: "#ede9fe",
              color: "#7c3aed",
              fontWeight: 600,
              borderRadius: 10,
              padding: "6px 18px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Home
          </span>
          <NavDropdown
            label="Online Courses"
            href="#"
            openSubmenuInNewTab
            submenu={[
              {
                label: "Assistant Professor",
                isSection: true,
                submenu: [
                  { label: "MPPSC", href: "/courses-mppsc" },
                  { label: "UPHESC", href: "/courses-uphesc" },
                  { label: "UP GDC", href: "/courses-upgdc" },
                ],
              },
              {
                label: "NTA NET",
                isSection: true,
                submenu: [
                  { label: "NET Paper 1", href: "/courses-net-paper1" },
                  { label: "NET Paper 2", href: "/courses-net-paper2" },
                ],
              },
              {
                label: "Other Teaching Exams",
                isSection: true,
                submenu: [
                  { label: "GIC", href: "/courses-gic" },
                  { label: "LT Grade", href: "/courses-ltgrade" },
                ],
              },
              {
                label: "Interview Preparation",
                isSection: true,
                submenu: [
                  {
                    label: "Assistant Professor 1",
                    href: "/interview-preparation/assistant-professor-1",
                  },
                  {
                    label: "DU Interview",
                    href: "/interview-preparation/du-interview",
                  },
                  {
                    label: "PhD Interview",
                    href: "/interview-preparation/phd-interview",
                  },
                ],
              },
              {
                label: "Communication Skills",
                href: "/courses-communication-skills",
              },
              {
                label: "SET",
                href: "/courses-set",
              },
            ]}
          />
          <a
            href="/research-assistance"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Research Assistance
          </a>
          <a
            href="#pyqs"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            PYQs
          </a>
          <a
            href="/achievers"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            LePearl Achievers
          </a>
          <a
            href="#reviews"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {"Student's Reviews"}
          </a>
          <a
            href="#mock"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Mock Test
          </a>
          <a
            href="#books"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Books
          </a>
        </nav>

        {/* Right Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <a
            href="#live-class"
            style={{
              color: "#222",
              fontWeight: 500,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
            }}
          >
            Live Class
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ef4444",
                marginLeft: 2,
              }}
            />
          </a>
          <a
            href="https://wa.me/919994990639"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              border: "1.5px solid #065f46",
              background: "#065f46",
              color: "#fff",
              borderRadius: 8,
              padding: "9px 14px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 15,
              whiteSpace: "nowrap",
            }}
            aria-label="WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.207-.243-.579-.49-.5-.672-.51-.173-.009-.372-.011-.571-.011-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347z" />
              <path d="M12.004 2.002C6.478 2.002 2 6.48 2 12.006c0 2.115.655 4.075 1.782 5.732L2 22l4.43-1.16c1.57.857 3.337 1.344 5.574 1.344 5.523 0 10.004-4.479 10.004-10.004S17.527 2.002 12.004 2.002zm0 18.067c-2.15 0-3.867-.707-5.297-1.882l-.379-.275-2.626.688.701-2.561-.247-.412C3.066 15.458 2.5 13.776 2.5 12.006 2.5 7.081 6.582 3 11.999 3c5.417 0 9.5 4.081 9.5 9.006 0 4.924-4.083 9.063-9.495 9.063z" />
            </svg>
          </a>
          <a
            href="/login-portal"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
              color: "#fff",
              borderRadius: 8,
              padding: "7px 22px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              whiteSpace: "nowrap",
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

interface DrawerLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

function DrawerLink({ href, label, onClick, target, rel }: DrawerLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors"
    >
      {label}
    </a>
  );
}

interface DrawerSectionProps {
  label: string;
  children: React.ReactNode;
}

function DrawerSection({ label, children }: DrawerSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-purple-50 rounded flex items-center justify-between transition-colors"
      >
        {label}
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <div className="ml-2">{children}</div>}
    </div>
  );
}

interface DrawerSubSectionProps {
  label: string;
  children: React.ReactNode;
}

function DrawerSubSection({ label, children }: DrawerSubSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-purple-100 rounded flex items-center justify-between transition-colors"
      >
        {label}
        <span
          className={`transform transition-transform text-xs ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <div className="ml-2 space-y-1">{children}</div>}
    </div>
  );
}
