"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type NavSubItem = {
  label: string;
  href?: string;
  isSection?: boolean;
  submenu?: NavSubItem[];
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
  const [openNested, setOpenNested] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  const hasSubmenu = Boolean(submenu?.length);
  const shouldOpenInNewTab = openInNewTab;

  // Detect if device is mobile
  const handleMouseEnter = () => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  const handleTouchStart = () => {
    setIsMobile(true);
  };

  const baseStyle: React.CSSProperties = {
    display: "flex",
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
    minHeight: "44px",
    overflow: "hidden",
    textOverflow: "ellipsis",
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

  const renderSubmenuItem = (
    item: NavSubItem,
    index: number,
  ): React.ReactNode => {
    const itemKey = `${item.label}-${index}`;
    const hasNested = Boolean(item.submenu?.length);

    if (item.isSection && hasNested) {
      // Nested dropdown section with side menu on hover
      return (
        <div
          key={itemKey}
          style={{ position: "relative" }}
          onMouseEnter={() => {
            if (!isMobile) {
              setOpenNested((prev) => ({
                ...prev,
                [itemKey]: true,
              }));
            }
          }}
          onMouseLeave={() => {
            if (!isMobile) {
              setOpenNested((prev) => ({
                ...prev,
                [itemKey]: false,
              }));
            }
          }}
        >
          <div
            onClick={() => {
              if (isMobile) {
                setOpenNested((prev) => ({
                  ...prev,
                  [itemKey]: !prev[itemKey],
                }));
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: isMobile ? "14px 16px" : "10px 12px",
              borderRadius: isMobile ? 0 : 8,
              border: "none",
              background: openNested[itemKey]
                ? "rgba(59, 130, 246, .08)"
                : "transparent",
              color: "#111827",
              fontSize: isMobile ? 15 : 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background .2s ease",
              touchAction: "manipulation",
              userSelect: "none",
            }}
          >
            {item.label}
            <ChevronRight
              size={isMobile ? 20 : 16}
              style={{
                transform: openNested[itemKey]
                  ? "rotate(90deg)"
                  : "rotate(0deg)",
                transition: "transform .2s ease",
                marginLeft: 8,
              }}
            />
          </div>

          {openNested[itemKey] && (
            <div
              style={{
                position: isMobile ? "relative" : "absolute",
                left: isMobile ? 0 : "100%",
                top: isMobile ? 0 : 0,
                marginLeft: isMobile ? 0 : 4,
                minWidth: isMobile ? "100%" : 180,
                background: isMobile ? "#f3f4f6" : "#fff",
                border: isMobile ? "none" : "1px solid rgba(0,0,0,.08)",
                borderRadius: isMobile ? 0 : 10,
                boxShadow: isMobile ? "none" : "0 12px 30px rgba(0,0,0,.12)",
                padding: isMobile ? 0 : 6,
                zIndex: 101,
              }}
            >
              {item.submenu?.map((subitem, subindex) => (
                <a
                  key={`${subitem.href}-${subitem.label}`}
                  href={subitem.href}
                  target={openSubmenuInNewTab ? "_blank" : undefined}
                  rel={openSubmenuInNewTab ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    padding: isMobile ? "14px 16px" : "10px 12px",
                    borderRadius: isMobile ? 0 : 8,
                    color: "#111827",
                    textDecoration: "none",
                    fontSize: isMobile ? 15 : 14,
                    transition: "background .2s ease",
                    minHeight: isMobile ? "44px" : "auto",
                    alignItems: "center",
                    borderLeft: isMobile ? "4px solid #7c3aed" : "none",
                    paddingLeft: isMobile ? 12 : 12,
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, .08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, .08)";
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {subitem.label}
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (item.isSection) {
      // Non-nested section header
      return (
        <div
          key={itemKey}
          style={{
            padding: isMobile
              ? index === 0
                ? "12px 16px 8px"
                : "16px 16px 8px"
              : index === 0
                ? "8px 12px 6px"
                : "12px 12px 6px",
            fontSize: isMobile ? 13 : 12,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: "#6b7280",
          }}
        >
          {item.label}
        </div>
      );
    }

    // Regular menu item
    return (
      <a
        key={itemKey}
        href={item.href}
        target={openSubmenuInNewTab ? "_blank" : undefined}
        rel={openSubmenuInNewTab ? "noopener noreferrer" : undefined}
        style={{
          display: "flex",
          padding: isMobile ? "14px 16px" : "10px 12px",
          borderRadius: isMobile ? 0 : 8,
          color: "#111827",
          textDecoration: "none",
          fontSize: isMobile ? 15 : 14,
          minHeight: isMobile ? "44px" : "auto",
          alignItems: "center",
          transition: "background .2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.background = "rgba(59, 130, 246, .08)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.background = "transparent";
          }
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.background = "rgba(59, 130, 246, .08)";
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {item.label}
      </a>
    );
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
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
            minWidth: isMobile ? "100vw" : 220,
            maxWidth: isMobile ? "100vw" : 360,
            background: "#fff",
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: isMobile ? 0 : 10,
            boxShadow: "0 12px 30px rgba(0,0,0,.12)",
            padding: isMobile ? 0 : 6,
            zIndex: 100,
            maxHeight: isMobile ? "60vh" : "auto",
            overflowY: isMobile ? "auto" : "visible",
            marginLeft: isMobile ? "calc(-50vw + 50%)" : 0,
          }}
        >
          {submenu?.map((item, index) => renderSubmenuItem(item, index))}
        </div>
      ) : null}
    </div>
  );
}
