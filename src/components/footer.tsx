import Link from "next/link";

import { NicheMark } from "@/components/niche-mark";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex items-center gap-2 text-muted-foreground">
          <NicheMark className="size-5" />
          <span>مشكاة — مكتبة مقررات الدفعة</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            الرئيسية
          </Link>
          <Link href="/courses" className="transition-colors hover:text-foreground">
            المقررات
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">© {year} جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}

export { Footer };
