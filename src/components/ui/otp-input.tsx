"use client";

import React, { useRef, useCallback, useEffect } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
}

/**
 * Production-grade OTP box input — one digit per box.
 * Supports:
 *  • Auto-focus next box on digit entry
 *  • Backspace navigates to previous box
 *  • Paste support (full OTP paste)
 *  • Arrow key navigation
 *  • Mobile numeric keyboard
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  error,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  // Focus first empty box on mount
  useEffect(() => {
    if (!disabled) {
      const firstEmpty = digits.findIndex((d) => !d);
      const idx = firstEmpty === -1 ? length - 1 : firstEmpty;
      inputRefs.current[idx]?.focus();
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputRefs.current[clamped]?.focus();
      inputRefs.current[clamped]?.select();
    },
    [length],
  );

  const updateValue = useCallback(
    (index: number, digit: string) => {
      const newDigits = [...digits];
      newDigits[index] = digit;
      const newValue = newDigits.join("").replace(/\D/g, "").slice(0, length);
      onChange(newValue);
    },
    [digits, length, onChange],
  );

  const handleInput = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/\D/g, "");

      if (!inputValue) return;

      // If more than one char pasted in a single box, handle as paste
      if (inputValue.length > 1) {
        const pasteDigits = inputValue.slice(0, length);
        onChange(pasteDigits);
        const nextIdx = Math.min(pasteDigits.length, length - 1);
        setTimeout(() => focusInput(nextIdx), 0);
        return;
      }

      // Single digit typed
      updateValue(index, inputValue);
      if (index < length - 1) {
        setTimeout(() => focusInput(index + 1), 0);
      }
    },
    [length, onChange, focusInput, updateValue],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Backspace":
          e.preventDefault();
          if (digits[index]) {
            // Clear current digit
            updateValue(index, "");
          } else if (index > 0) {
            // Move to previous and clear
            updateValue(index - 1, "");
            focusInput(index - 1);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (index > 0) focusInput(index - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (index < length - 1) focusInput(index + 1);
          break;
        case "Delete":
          e.preventDefault();
          updateValue(index, "");
          break;
      }
    },
    [digits, length, focusInput, updateValue],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text/plain")
        .replace(/\D/g, "")
        .slice(0, length);
      if (pasted) {
        onChange(pasted);
        const nextIdx = Math.min(pasted.length, length - 1);
        setTimeout(() => focusInput(nextIdx), 0);
      }
    },
    [length, onChange, focusInput],
  );

  const handleFocus = useCallback((index: number) => {
    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 sm:gap-3 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={length} // Allow paste of full OTP into single box
            value={digits[index] || ""}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={`
              w-11 h-13 sm:w-12 sm:h-14
              text-center text-xl font-bold
              border-2 rounded-lg
              bg-[#FFFFF0] bg-opacity-80
              transition-all duration-150
              outline-none
              focus:ring-2 focus:ring-primary/40 focus:border-primary focus:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-400 focus:ring-red-400/40"
                  : digits[index]
                    ? "border-primary"
                    : "border-gray-300"
              }
            `}
            onChange={(e) => handleInput(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
};
