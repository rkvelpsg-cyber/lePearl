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
          width: "min(55vw, 90vh)",
          minWidth: "320px",
          maxWidth: "95vw",
          borderRadius: "12px",
          overflow: "visible",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
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
          src="/SET.png"
          alt="Rajasthan Coaching Poster"
          width={520}
          height={720}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "12px 12px 0 0",
          }}
          priority
        />

        {/* Register Now Button */}
        <div
          style={{
            background: "#1a1a2e",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "center",
            borderRadius: "0 0 12px 12px",
            borderTop: "2px solid #e53e3e",
          }}
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdrohpM0039IaOALH7ovqnee0HfvLqEnG3S5cjsNrT5HTCgIg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "11px 42px",
              background:
                "linear-gradient(135deg, #1a6b6e 0%, #2e7d82 40%, #3a9fa5 70%, #4db6bc 100%)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "clamp(13px, 2vw, 16px)",
              letterSpacing: "0.8px",
              borderRadius: "50px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              border: "2px solid rgba(255,255,255,0.8)",
              boxShadow: "0 4px 15px rgba(46,125,130,0.5)",
              animation: "smoothBlink 2.5s ease-in-out infinite",
            }}
          >
            Register Now
          </a>
        </div>

        <style>{`
          @keyframes smoothBlink {
            0%, 100% { opacity: 1; box-shadow: 0 4px 15px rgba(46,125,130,0.5); }
            50% { opacity: 0.25; box-shadow: 0 4px 25px rgba(77,182,188,0.2); }
          }
        `}</style>
      </div>
    </div>
  );
}
