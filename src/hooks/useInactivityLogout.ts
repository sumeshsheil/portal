"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE = 5 * 60 * 1000; // Warn 5 minutes before

export function useInactivityLogout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout>>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      toast.warning("Your session will expire in 5 minutes due to inactivity", {
        duration: 10000,
        id: "inactivity-warning",
      });
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    timeoutRef.current = setTimeout(() => {
      toast.error("Session expired due to inactivity", {
        duration: 5000,
        id: "session-expired",
      });
      signOut({ callbackUrl: window.location.origin + "/" });
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
      "mousedown",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );

    resetTimer(); // Start initial timer

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [resetTimer]);
}
