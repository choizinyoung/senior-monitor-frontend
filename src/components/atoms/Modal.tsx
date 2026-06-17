"use client";

import { useEffect, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "max-w-[96%] sm:max-w-[520px]",
  md: "max-w-[96%] sm:max-w-[660px]",
  lg: "max-w-[96%] sm:max-w-[800px]",
};

export default function Modal({ isOpen, onClose, title, footer, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(26,29,59,0.5)] backdrop-blur-sm modal-overlay-enter px-2 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          "bg-white rounded-2xl w-full max-h-[88vh] overflow-y-auto flex flex-col border border-border shadow-[0_24px_64px_rgba(91,103,245,0.18)]",
          sizeStyles[size]
        )}
      >
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-border flex-shrink-0">
          <h3 className="text-base sm:text-[17px] font-bold text-text-main flex items-center gap-2">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-main border border-border text-text-sub hover:bg-border hover:text-text-main transition-all text-sm flex-shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="px-5 sm:px-7 py-5 sm:py-6 flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex gap-2.5 justify-end px-5 sm:px-7 py-3.5 sm:py-4 border-t border-border flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
