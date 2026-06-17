"use client";

import { ReactNode } from "react";
import { Avatar } from "@/components/atoms";
import { useMonitorStore } from "@/store/useMonitorStore";

interface TopBarProps {
  title: ReactNode;
  right?: ReactNode;
}

export default function TopBar({ title, right }: TopBarProps) {
  const toggleSidebar = useMonitorStore((s) => s.toggleSidebar);

  return (
    <div className="flex items-center justify-between px-5 md:px-8 pt-5 md:pt-6 pb-0 sticky top-0 z-50 bg-bg-main md:static md:bg-transparent">
      <div className="flex items-center gap-3">
        {/* 햄버거 버튼 — 모바일 전용 */}
        <button
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-[10px] bg-bg-card border-[1.5px] border-border text-text-main hover:bg-border transition-colors flex-shrink-0"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h2 className="text-[18px] md:text-[22px] font-extrabold text-text-main flex items-center gap-2">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* 날짜 정보 — 태블릿 이상에서만 */}
        {right && <span className="hidden md:block">{right}</span>}
        <div className="flex items-center gap-2 text-sm font-semibold text-text-main bg-bg-card border border-border pl-1.5 md:pl-2 pr-2 md:pr-3.5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(91,103,245,0.06)]">
          <Avatar label="김" size="sm" />
          <span className="hidden sm:inline">김관리자</span>
        </div>
      </div>
    </div>
  );
}
