import {
  Download,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";

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

function CourseFileRow({ file }: { file: CourseFileSummary }) {
  const Icon = ICONS_BY_EXTENSION[file.extension.toLowerCase()] ?? FileIcon;

  return (
    <li>
      <a
        href={`/api/file/${file.id}/${encodeURIComponent(file.originalName)}`}
        download={file.originalName}
        className="group flex items-center gap-3 p-4 transition-colors hover:bg-accent/50"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{file.title}</p>
          <p className="truncate text-xs text-muted-foreground">{file.originalName}</p>
        </div>

        <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(file.sizeBytes)}</span>
        <Download className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </a>
    </li>
  );
}

export { CourseFileRow };
