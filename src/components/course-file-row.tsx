"use client";

import {
  Clock,
  Download,
  ExternalLink,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseFileSummary } from "@/lib/types";
import { cn, formatFileSize } from "@/lib/utils";

const TELEGRAM_MAX_FILE_BYTES = 20 * 1024 * 1024;

const ICONS_BY_EXTENSION: Record<string, typeof FileIcon> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  ppt: FileText,
  pptx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  zip: FileArchive,
  rar: FileArchive,
  "7z": FileArchive,
  mp3: FileAudio,
  wav: FileAudio,
  mp4: FileVideo,
  mkv: FileVideo,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  webp: FileImage,
};

const VIEWABLE_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "webp", "mp4", "mkv", "mp3", "wav"]);

const UNAVAILABLE_COPY: Record<
  "pending" | "too-large",
  { badge: string; message: string; icon: typeof FileIcon; tone: "muted" | "destructive" }
> = {
  pending: {
    badge: "قيد التوفر",
    message: "الملف غير متاح حاليًا، حاول لاحقًا أو نزّله من البوت مباشرة.",
    icon: Clock,
    tone: "muted",
  },
  "too-large": {
    badge: "حجم غير مدعوم",
    message: "حجم هذا الملف يتجاوز الحد الأقصى.",
    icon: TriangleAlert,
    tone: "destructive",
  },
};

function toForcedDownloadUrl(url: string) {
  return url.replace("/upload/", "/upload/fl_attachment/");
}

function UnavailableFileRow({ file, Icon }: { file: CourseFileSummary; Icon: typeof FileIcon }) {
  const reason = file.sizeBytes > TELEGRAM_MAX_FILE_BYTES ? "too-large" : "pending";
  const { badge, message, icon: StatusIcon, tone } = UNAVAILABLE_COPY[reason];
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function trigger() {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 3500);
  }

  return (
    <li>
      <button
        type="button"
        onClick={trigger}
        className="flex w-full items-center gap-3 p-4 text-start opacity-75 transition-colors hover:bg-accent/50"
      >
        <FileIconBadge Icon={Icon} tone={tone} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{file.title}</p>
          <p className="truncate text-xs text-muted-foreground">{file.originalName}</p>
        </div>

        <Badge
          variant="outline"
          className={cn("shrink-0", tone === "destructive" && "border-destructive/40 text-destructive")}
        >
          {badge}
        </Badge>

        <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(file.sizeBytes)}</span>

        <StatusIcon
          className={cn("size-4 shrink-0 text-muted-foreground", tone === "destructive" && "text-destructive")}
        />
      </button>

      {visible && (
        <div
          role="status"
          aria-live="polite"
          className={"fixed inset-x-4 top-4 z-50 mx-auto flex w-fit max-w-sm items-start gap-2.5 rounded-xl "
            + "border border-border bg-card px-4 py-3 text-sm text-foreground shadow-lg sm:inset-x-auto sm:end-4"}
        >
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          {message}
        </div>
      )}
    </li>
  );
}

function CourseFileRow({ file }: { file: CourseFileSummary }) {
  const Icon = ICONS_BY_EXTENSION[file.extension.toLowerCase()] ?? FileIcon;

  if (!file.url) {
    return <UnavailableFileRow file={file} Icon={Icon} />;
  }

  const isViewable = VIEWABLE_EXTENSIONS.has(file.extension.toLowerCase());

  return (
    <li className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
      <FileIconBadge Icon={Icon} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.title}</p>
        <p className="truncate text-xs text-muted-foreground">{file.originalName}</p>
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(file.sizeBytes)}</span>

      {isViewable && (
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            title="فتح في المتصفح"
            aria-label="فتح في المتصفح"
          >
            <ExternalLink className="size-4" />
          </a>
        </Button>
      )}

      <Button asChild variant="ghost" size="icon" className="shrink-0">
        <a
          href={toForcedDownloadUrl(file.url)}
          download={file.originalName}
          title="تنزيل"
          aria-label="تنزيل"
        >
          <Download className="size-4" />
        </a>
      </Button>
    </li>
  );
}

function FileIconBadge(
  { Icon, tone = "default" }: { Icon: typeof FileIcon; tone?: "default" | "muted" | "destructive" },
) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted",
        tone === "muted" && "border border-dashed border-muted-foreground/40 bg-muted/50",
        tone === "destructive" && "border border-dashed border-destructive/40 bg-destructive/10",
      )}
    >
      <Icon className={cn("size-4 text-muted-foreground", tone === "destructive" && "text-destructive")} />
    </div>
  );
}

export { CourseFileRow };
