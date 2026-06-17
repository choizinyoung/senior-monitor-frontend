"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants";
import { Avatar } from "@/components/atoms";
import { useMonitorStore } from "@/store/useMonitorStore";

const NAV_GROUPS = [
  {
    label: "메인",
    items: [
      {
        href: ROUTES.DASHBOARD,
        label: "통합 대시보드",
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="4" rx="1" />
            <rect x="14" y="10" width="7" height="11" rx="1" /><rect x="3" y="13" width="7" height="8" rx="1" />
          </svg>
        ),
      },
      {
        href: ROUTES.ALERT_LIST,
        label: "확인요망 리스트",
        badge: 5,
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "관리",
    items: [
      {
        href: ROUTES.SENIORS,
        label: "대상자 관리",
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
      {
        href: ROUTES.HISTORY,
        label: "처리 내역 조회",
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="12" y2="18" />
          </svg>
        ),
      },
      {
        href: ROUTES.MONITORING,
        label: "모니터링 현황",
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "시스템",
    items: [
      {
        href: ROUTES.LOGS,
        label: "로그 시스템",
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        ),
      },
      {
        href: ROUTES.SETTINGS,
        label: "설정",
        icon: (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

export default function SideNav() {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar } = useMonitorStore();

  // 모바일에서 라우트 이동 시 사이드바 닫기
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <nav
      className={cn(
        // 공통
        "fixed left-0 top-0 bottom-0 w-60 bg-bg-card border-r border-border flex flex-col z-[100]",
        "shadow-[2px_0_12px_rgba(0,0,0,0.04)] transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        // 모바일: 기본 숨김, open 시 보임
        "-translate-x-full md:translate-x-0",
        sidebarOpen && "translate-x-0"
      )}
    >
      {/* Header */}
      <div className="px-6 pt-7 pb-5">
        <h1 className="text-xl font-extrabold text-primary leading-snug whitespace-pre-line">
          {"독거노인 안전\n관리 시스템"}
        </h1>
        <p className="text-[11px] text-text-sub mt-0.5 tracking-wide">Senior Safety Monitoring</p>
      </div>

      {/* Nav */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-sub px-3 py-2 opacity-70">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium mb-0.5 transition-all duration-150",
                    active
                      ? "bg-primary-light text-primary font-bold"
                      : "text-text-sub hover:bg-bg-main hover:text-text-main"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-primary rounded-r-sm" />
                  )}
                  <span className={cn("flex items-center", active ? "text-primary" : "text-text-sub")}>
                    {item.icon}
                  </span>
                  {item.label}
                  {"badge" in item && item.badge && (
                    <span className="ml-auto bg-danger text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-t border-border">
        <Avatar label="관" size="md" />
        <div>
          <p className="text-sm font-bold text-text-main">김관리자</p>
          <p className="text-[11px] text-text-sub">관리자 · 전체 권한</p>
        </div>
      </div>
    </nav>
  );
}
