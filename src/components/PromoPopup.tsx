"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup only once per session
    const hasSeenPopup = sessionStorage.getItem("rajastanPopupSeen");
    if (!hasSeenPopup) {
      setIsOpen(true);
      sessionStorage.setItem("rajastanPopupSeen", "true");
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rajasthan promotion poster"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.65)",
        padding: "clamp(16px, 4vw, 40px)",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          position: "relative",
          width: "25vw",
          minWidth: "280px",
          maxWidth: "92vw",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close popup"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={18} />
        </button>

        <Image
          src="/rajastanposter.png"
          alt="Rajasthan Coaching Poster"
          width={520}
          height={720}
          style={{ width: "100%", height: "auto", display: "block" }}
          priority
        />
      </div>
    </div>
  );
}
