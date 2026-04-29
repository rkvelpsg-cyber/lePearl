import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LePearl Education | NTA NET, MPPSC, UPHESC & More Coaching";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a3f4d 0%, #0f5a63 60%, #0a3f4d 100%)",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          background: "#f5a024",
        }}
      />

      {/* Brand name */}
      <div
        style={{
          fontSize: "80px",
          fontWeight: "bold",
          color: "#f5a024",
          letterSpacing: "-2px",
          marginBottom: "8px",
        }}
      >
        LePearl Education
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "32px",
          color: "#f6fff9",
          marginBottom: "40px",
          fontWeight: "400",
        }}
      >
        India&apos;s Trusted Coaching for Competitive Exams
      </div>

      {/* Exam badges */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["NTA NET", "MPPSC", "UPHESC", "UP GDC", "GIC", "LT Grade", "SET"].map(
          (exam) => (
            <div
              key={exam}
              style={{
                background: "rgba(245,160,36,0.18)",
                border: "2px solid #f5a024",
                borderRadius: "8px",
                padding: "8px 20px",
                fontSize: "22px",
                color: "#f5a024",
                fontWeight: "600",
              }}
            >
              {exam}
            </div>
          ),
        )}
      </div>

      {/* Website URL */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          fontSize: "22px",
          color: "rgba(246,255,249,0.6)",
          letterSpacing: "1px",
        }}
      >
        www.lepearleducation.com
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "8px",
          background: "#f5a024",
        }}
      />
    </div>,
    { ...size },
  );
}
