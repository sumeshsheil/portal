import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Portal",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.12 0.015 260)",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(112,160,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "-5%",
          width: "30vw",
          height: "30vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.7 0.2 150 / 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "520px",
          width: "100%",
          background: "oklch(0.16 0.02 260)",
          border: "1px solid oklch(0.25 0.03 260 / 0.5)",
          borderRadius: "1.5rem",
          padding: "3rem 2.5rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Icon */}
        <div
          aria-hidden="true"
          style={{
            fontSize: "3.5rem",
            marginBottom: "1rem",
          }}
        >
          🗺️
        </div>

        {/* 404 */}
        <div
          style={{
            fontSize: "clamp(5rem, 15vw, 8rem)",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, oklch(0.7 0.2 150), oklch(0.6 0.15 260))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </div>

        <h1
          style={{
            color: "oklch(0.985 0.01 260)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontWeight: 700,
            margin: "0 0 0.75rem",
            letterSpacing: "-0.01em",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: "oklch(0.7 0.02 260)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            marginBottom: "2.25rem",
            fontFamily: "var(--font-open-sans, sans-serif)",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to access it.
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "oklch(0.7 0.2 150)",
              color: "oklch(0.12 0.015 260)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.7rem 1.75rem",
              borderRadius: "0.75rem",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            ← Go to Dashboard
          </Link>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              color: "oklch(0.7 0.02 260)",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "0.7rem 1.75rem",
              borderRadius: "0.75rem",
              border: "1.5px solid oklch(0.25 0.03 260 / 0.5)",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Footer hint */}
      <p
        style={{
          marginTop: "2rem",
          color: "oklch(0.4 0.01 260)",
          fontSize: "0.8rem",
          zIndex: 1,
          position: "relative",
        }}
      >
        Error 404 · Budget Travel Packages Portal
      </p>
    </main>
  );
}
