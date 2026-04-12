"use client";

import { useEffect } from "react";

export function VideoPrefetcher() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href =
      "/LePearl Education_ Path to Academic Excellence_720p_caption.mp4";
    link.as = "video";
    link.type = "video/mp4";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
