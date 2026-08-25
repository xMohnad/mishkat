import { cn } from "@/lib/utils";

function NicheMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("size-7", className)} aria-hidden="true">
      <path
        d="M6 29V15.5C6 9.15 10.7 4 16 4s10 5.15 10 11.5V29"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="text-foreground/70"
      />
      <path
        d="M16 20.5c2.485 0 4.5-2.239 4.5-5S16 8 16 8s-4.5 4.739-4.5 7.5 2.015 5 4.5 5Z"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}

export { NicheMark };
