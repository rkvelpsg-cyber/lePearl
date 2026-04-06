"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#6A0DAD] text-white shadow-lg transition-all duration-300 hover:bg-[#1E3A8A] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] focus:ring-offset-2"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
