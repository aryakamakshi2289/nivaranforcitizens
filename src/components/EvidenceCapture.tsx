import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Two clear evidence options. "Take Photo" asks the device for its camera via the
 * standard file-capture attribute — on desktop browsers that quietly falls back to
 * the file picker, so nothing here claims a custom camera integration.
 */
export function EvidenceCapture({
  image,
  fileName,
  onImage,
  onClear,
  className,
}: {
  image: string | null;
  fileName: string;
  onImage: (file: File) => void;
  onClear: () => void;
  className?: string;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("rounded-xl border border-dashed border-input bg-navy-deep/60 p-5", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="group flex items-center gap-3 rounded-xl bg-accent/12 px-4 py-3.5 text-left ring-1 ring-inset ring-accent/35 transition duration-300 hover:bg-accent/20"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-accent/25">
            <span className="size-3 rounded-full ring-2 ring-primary" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-primary">Take Photo</span>
            <span className="block text-xs text-muted-foreground">Uses your device camera</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="group flex items-center gap-3 rounded-xl bg-soft/60 px-4 py-3.5 text-left ring-1 ring-inset ring-border transition duration-300 hover:bg-soft"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-soft">
            <span className="block h-3 w-4 rounded-sm border-2 border-primary border-b-0" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-primary">Upload from Device</span>
            <span className="block text-xs text-muted-foreground">Choose an existing photo</span>
          </span>
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImage(file);
        }}
      />
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImage(file);
        }}
      />

      {image ? (
        <div className="animate-in fade-in mt-4 flex items-center gap-3 duration-500">
          <div className="rounded-xl bg-field p-1.5">
            <img
              src={image}
              alt="Selected evidence preview"
              className="size-16 rounded-lg object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-primary">{fileName}</p>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-challenged transition hover:opacity-80"
            >
              Remove photo
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">
          A photo makes the record much harder to dispute later.
        </p>
      )}
    </div>
  );
}
