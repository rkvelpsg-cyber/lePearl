"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function IntroPopup() {
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("intro_popup_seen");
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem("intro_popup_seen", "1");
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-3xl mx-4 rounded-xl overflow-hidden shadow-2xl bg-black">
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close intro video"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          src="/LePearl Education_ Path to Academic Excellence_720p_caption.mp4"
          autoPlay
          controls
          playsInline
          className="w-full aspect-video"
        />
      </div>
    </div>
  );
}
