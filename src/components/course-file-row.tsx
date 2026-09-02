"use client";

import {
  Download,
  ExternalLink,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CourseFileSummary } from "@/lib/types";
import { formatFileSize } from "@/lib/utils";

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

function isTelegramUrl(url: string): boolean {
  return /^https?:\/\/t\.me\//i.test(url);
}

function toForcedDownloadUrl(url: string) {
  return url.replace("/upload/", "/upload/fl_attachment/");
}

function CourseFileRow({ file }: { file: CourseFileSummary }) {
  const Icon = ICONS_BY_EXTENSION[file.extension.toLowerCase()] ?? FileIcon;
  const isTelegram = isTelegramUrl(file.url);
  const isViewable = !isTelegram && VIEWABLE_EXTENSIONS.has(file.extension.toLowerCase());

  return (
    <li className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>

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

      {isTelegram
        ? (
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              title="فتح في تيليجرام"
              aria-label="فتح في تيليجرام"
            >
              <Send className="size-4" />
            </a>
          </Button>
        )
        : (
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
        )}
    </li>
  );
}

export { CourseFileRow };
