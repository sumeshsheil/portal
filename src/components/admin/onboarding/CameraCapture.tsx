"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  label: string;
  capturedImage?: string | null;
  autoStart?: boolean;
}

export function CameraCapture({
  onCapture,
  label,
  capturedImage,
  autoStart,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(capturedImage || null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);

    // Check for Secure Context
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera access requires a Secure Context (HTTPS or localhost).");
      return;
    }

    // Stop any existing stream first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      // For Aadhaar/PAN we likely want back camera on mobile
      const isDocument =
        label.toLowerCase().includes("aadhaar") ||
        label.toLowerCase().includes("pan");
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: isDocument ? { ideal: "environment" } : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraActive(true);
      setPreview(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Camera access denied or not available. Please check permissions.",
      );
    }
  }, [stream, label]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Use actual video dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPreview(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    }
  }, [onCapture, stopCamera]);

  const retake = useCallback(() => {
    setPreview(null);
    startCamera();
  }, [startCamera]);

  // Sync stream to video element
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [isCameraActive, stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Auto-start camera if prop is set
  useEffect(() => {
    if (autoStart && !preview && !isCameraActive && !error) {
      startCamera();
    }
  }, [autoStart, preview, isCameraActive, error, startCamera]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">{label}</p>

      {/* Canvas for capturing (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview or Camera */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 aspect-4/3 flex items-center justify-center">
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`${label} capture`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-emerald-500 text-white rounded-full p-1.5">
              <Check className="h-4 w-4" />
            </div>
          </>
        ) : isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6">
            <Camera className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              Camera preview will appear here
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Controls */}
      <div className="flex gap-2">
        {preview ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={retake}
            className="flex-1 rounded-lg"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Retake
          </Button>
        ) : isCameraActive ? (
          <Button
            type="button"
            size="sm"
            onClick={capture}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5" />
            Capture
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={startCamera}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5" />
            Open Camera
          </Button>
        )}
      </div>
    </div>
  );
}
