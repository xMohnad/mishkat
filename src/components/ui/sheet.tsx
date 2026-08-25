"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
        )}
      />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col gap-6 border-s border-border bg-card p-6 shadow-xl",
          "outline-none",
          "data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
          "data-[state=closed]:duration-200 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <Dialog.Title className="font-display text-lg text-foreground">القائمة</Dialog.Title>
          <Dialog.Close className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <X className="size-5" />
            <span className="sr-only">إغلاق</span>
          </Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">روابط التنقل الرئيسية للموقع</Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export { Sheet, SheetClose, SheetContent, SheetTrigger };
