"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export function WhatsAppButton() {
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    // Fetch the animation JSON from the public folder
    fetch("/lottie/whatsapp.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error("Failed to load WhatsApp animation:", error);
      });
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919242868839", "_blank");
  };

  if (!animationData) {
    return null; // Don't render anything until animation is loaded
  }

  return (
    <div
      onClick={handleWhatsAppClick}
      className="fixed bottom-16 right-6 z-50 cursor-pointer w-20 h-20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
      style={{ position: "fixed" }}
      role="button"
      aria-label="Contact us on WhatsApp"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleWhatsAppClick();
        }
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <Lottie animationData={animationData} loop={true} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "#dc2626",
          color: "white",
          fontSize: "11px",
          fontWeight: 700,
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: "2px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }}
      >
        1
      </div>
    </div>
  );
}
