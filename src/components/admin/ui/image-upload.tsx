import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { upload } from "@imagekit/javascript";
import {
    FileText, Loader2, UploadCloud, X
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  maxFiles?: number;
  disabled?: boolean;
  folder?: string;
  className?: string;
  accept?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  onRemove,
  maxFiles = 1,
  disabled,
  folder = "/user-uploads",
  className,
  accept = "image/*,application/pdf",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enforce 1MB max upload size
  const maxMb = 1;
  const maxSizeBytes = maxMb * 1024 * 1024;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // 1. Fetch authentication parameters
      const authRes = await fetch("/api/auth/imagekit");
      if (!authRes.ok) throw new Error("Failed to get auth params");
      const { signature, token, expire } = await authRes.json();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate File Type
        if (accept === "image/*" && !file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not a valid image.`);
          continue;
        }
        if (accept === "application/pdf" && file.type !== "application/pdf") {
          toast.error(`File ${file.name} is not a PDF.`);
          continue;
        }

        // Validate size based on env
        if (file.size > maxSizeBytes) {
          toast.error(
            `File ${file.name} is too large. Max size is ${maxMb}MB.`,
          );
          continue;
        }

        // 2. Upload using functional SDK
        const result = await upload({
          file: file,
          fileName: file.name,
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
          signature,
          token,
          expire,
          folder: folder,
        });

        if (result && result.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast.success("Files uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf");

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center"
          >
            {!disabled && (
              <div className="absolute top-2 right-2 z-10">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {isPdf(url) ? (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <FileText className="h-12 w-12 text-red-500" />
                <span className="text-xs text-muted-foreground break-all px-2 line-clamp-2">
                  {url.split("/").pop()}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <Image fill className="object-cover" alt="Image" src={url} />
            )}
          </div>
        ))}
      </div>

      {value.length < maxFiles && (
        <div>
          <input
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="hidden"
            ref={fileInputRef}
            onChange={onUpload}
            disabled={disabled || uploading}
          />
          <Button
            type="button"
            disabled={disabled || uploading}
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-dashed border-2 flex flex-col gap-2 hover:bg-gray-50/50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {uploading
                ? "Uploading..."
                : `Upload (${value.length}/${maxFiles})`}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              Max size {maxMb}MB (Images/PDF)
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
