"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

interface SmartAutoRefreshProps {
  interval?: number; // Frequency to check for refresh (in ms)
  idleThreshold?: number; // Time of no activity before pausing (in ms)
}

/**
 * A "Smart" refresh component that only pulls data when:
 * 1. The window is focused and visible.
 * 2. The user has been active recently.
 *
 * This ensures real-time updates while working, but allows
 * inactivity logout and session timeouts to work when user is away.
 */
export default function SmartAutoRefresh({
  interval = 30000,
  idleThreshold = 60000, // 1 minute
}: SmartAutoRefreshProps) {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const performRefresh = useCallback(() => {
    const isVisible = document.visibilityState === "visible";
    const isIdle = Date.now() - lastActivityRef.current > idleThreshold;

    if (isVisible && !isIdle) {
      router.refresh();
    }
  }, [router, idleThreshold]);

  useEffect(() => {
    // 1. Listen for user activity to track idleness
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) =>
      window.addEventListener(event, updateActivity, { passive: true }),
    );

    // 2. Refresh immediately when returning to the tab (if visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    // 3. Set up the check interval
    timerRef.current = setInterval(performRefresh, interval);

    // Cleanup
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interval, updateActivity, performRefresh, router]);

  return null;
}
