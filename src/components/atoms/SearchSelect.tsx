"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

interface SearchSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchSelect({
  value, onChange, options, placeholder = "선택", disabled, className,
}: SearchSelectProps) {
  const [query, setQuery]           = useState("");
  const [open, setOpen]             = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // scroll highlighted into view
  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.children[highlighted] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted, open]);

  // reset highlight when options change
  useEffect(() => { setHighlighted(0); }, [query]);

  const select = (opt: string) => {
    onChange(opt);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") { setOpen(true); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted] !== undefined) select(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        type="text"
        value={open ? query : value}
        onChange={(e) => { setQuery(e.target.value); setHighlighted(0); setOpen(true); }}
        onFocus={() => { setQuery(""); setOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder={open ? (value || placeholder) : placeholder}
        disabled={disabled}
        autoComplete="off"
        className={cn(
          "w-full rounded-[10px] border-[1.5px] border-border bg-bg-main px-3.5 py-2.5 pr-8 text-sm text-text-main transition-all duration-150",
          "placeholder:text-text-sub",
          "focus:border-primary focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(91,103,245,0.10)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          open && "border-primary bg-white shadow-[0_0_0_3px_rgba(91,103,245,0.10)]",
        )}
      />
      {/* caret icon */}
      <span
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-sub transition-transform duration-150",
          open && "rotate-180",
        )}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L1 3h10z" />
        </svg>
      </span>

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl border-[1.5px] border-border bg-white shadow-lg"
        >
          {filtered.length > 0 ? (
            filtered.map((opt, i) => (
              <li
                key={opt}
                onMouseDown={(e) => { e.preventDefault(); select(opt); }}
                onMouseEnter={() => setHighlighted(i)}
                className={cn(
                  "px-3.5 py-2.5 text-sm cursor-pointer transition-colors",
                  i === highlighted ? "bg-primary-light" : "hover:bg-bg-main",
                  opt === value ? "font-semibold text-primary" : "text-text-main",
                )}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-3.5 py-2.5 text-sm text-text-sub text-center">검색 결과 없음</li>
          )}
        </ul>
      )}
    </div>
  );
}
