"use client";

import Lottie from "lottie-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FloatingButtons() {
  const pathname = usePathname();
  const [whatsAppAnimation, setWhatsAppAnimation] = useState<unknown>(null);
  const [phoneAnimation, setPhoneAnimation] = useState<unknown>(null);

  useEffect(() => {
    // Fetch WhatsApp animation
    fetch("/lottie/whatsapp.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setWhatsAppAnimation(data))
      .catch((err) => console.error("Failed to load WhatsApp animation:", err));

    // Fetch Phone animation
    fetch("/lottie/phone.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPhoneAnimation(data))
      .catch((err) => console.error("Failed to load Phone animation:", err));
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919242868839", "_blank");
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+919242868839";
  };

  // Show only on the homepage
  if (pathname !== "/") {
    return null;
  }

  if (!whatsAppAnimation && !phoneAnimation) {
    return null;
  }

  return (
    <>
      {/* Phone Call Button */}
      {phoneAnimation && (
        <div
          onClick={handlePhoneClick}
          className="fixed bottom-13 left-6 z-50 cursor-pointer w-20 h-20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
          role="button"
          aria-label="Call us"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handlePhoneClick();
            }
          }}
        >
          <Lottie animationData={phoneAnimation} loop={true} />
        </div>
      )}

      {/* WhatsApp Button */}
      {whatsAppAnimation && (
        <div
          onClick={handleWhatsAppClick}
          className="fixed bottom-13 right-6 z-50 cursor-pointer w-20 h-20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
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
            <Lottie animationData={whatsAppAnimation} loop={true} />
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
      )}
    </>
  );
}
