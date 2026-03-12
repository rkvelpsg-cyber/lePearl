"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type NavSubItem = {
  label: string;
  href: string;
};

type NavDropdownProps = {
  label: string;
  href: string;
  submenu?: NavSubItem[];
  isActive?: boolean;
  isLive?: boolean;
  openInNewTab?: boolean;
  openSubmenuInNewTab?: boolean;
};

export function NavDropdown({
  label,
  href,
  submenu,
  isActive = false,
  isLive = false,
  openInNewTab = false,
  openSubmenuInNewTab = false,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = Boolean(submenu?.length);
  const shouldOpenInNewTab = openInNewTab;

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 10px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    color: isActive ? "#7c3aed" : "#374151",
    background: isActive ? "rgba(124, 58, 237, 0.12)" : "transparent",
    whiteSpace: "nowrap",
    transition: "all .2s ease",
  };

  if (!hasSubmenu) {
    return (
      <a
        href={href}
        style={baseStyle}
        aria-current={isActive ? "page" : undefined}
        target={shouldOpenInNewTab ? "_blank" : undefined}
        rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
      >
        {label}
        {isLive ? (
          <span
            style={{
              marginLeft: 2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ef4444",
              display: "inline-block",
            }}
          />
        ) : null}
      </a>
    );
  }

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        style={{
          ...baseStyle,
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s ease",
          }}
        />
      </button>

      {isOpen ? (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            minWidth: 220,
            background: "#fff",
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 10,
            boxShadow: "0 12px 30px rgba(0,0,0,.12)",
            padding: 6,
            zIndex: 100,
          }}
        >
          {submenu?.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={openSubmenuInNewTab ? "_blank" : undefined}
              rel={openSubmenuInNewTab ? "noopener noreferrer" : undefined}
              style={{
                display: "block",
                padding: "10px 12px",
                borderRadius: 8,
                color: "#111827",
                textDecoration: "none",
                fontSize: 14,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, .08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
