"use client";

import { useState } from "react";
import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";
import { SectionCard, LogItem } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { LogEntry, LogType } from "@/types";
import { cn } from "@/utils/cn";

const TABS: { label: string; value: LogType | "all" }[] = [
  { label: "전체 로그", value: "all" },
  { label: "조회 로그", value: "query" },
  { label: "처리 로그", value: "action" },
  { label: "시스템 로그", value: "system" },
  { label: "로그인 로그", value: "login" },
];

const LOGS: LogEntry[] = [
  { id: "1", timestamp: "2026-06-11 09:45:12", type: "query", user: "김관리자", message: "확인요망 리스트 조회 — 필터: 전체" },
  { id: "2", timestamp: "2026-06-11 09:43:08", type: "action", user: "김관리자", message: "대상자 '이순자' 확인완료 처리" },
  { id: "3", timestamp: "2026-06-11 09:40:55", type: "system", user: "시스템", message: "확인요망 자동 등록: 김영희 (기상 신호 미수신)" },
  { id: "4", timestamp: "2026-06-11 09:38:22", type: "query", user: "김관리자", message: "대상자 상세 조회 — ID: 1023 (김영희)" },
  { id: "5", timestamp: "2026-06-11 09:35:10", type: "login", user: "김관리자", message: "시스템 로그인 성공" },
  { id: "6", timestamp: "2026-06-11 05:00:00", type: "system", user: "시스템", message: "기상 모니터링 시작 (05:00~10:00)" },
  { id: "7", timestamp: "2026-06-10 18:30:00", type: "system", user: "시스템", message: "일일 리포트 생성 완료 — 확인요망: 3건, 확인완료: 124건" },
  { id: "8", timestamp: "2026-06-10 17:22:45", type: "action", user: "박담당", message: "대상자 '정복순' 확인완료 처리 — 메모: 전화 통화 완료" },
];

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<LogType | "all">("all");

  const filtered = activeTab === "all" ? LOGS : LOGS.filter((l) => l.type === activeTab);

  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            로그 시스템
          </>
        }
        right={<span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-warning-light text-warning">디자인만 적용</span>}
      />

      <SectionCard
        title="시스템 활동 로그"
        actions={<Button variant="outline" size="sm">상세 보기</Button>}
      >
        {/* 탭 — 모바일 가로 스크롤 */}
        <div className="flex gap-1 px-4 sm:px-5 py-3.5 border-b border-border bg-[#FAFBFF] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150",
                activeTab === tab.value
                  ? "bg-primary-light text-primary font-bold"
                  : "text-text-sub hover:text-text-main hover:bg-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.map((log) => (
          <LogItem key={log.id} log={log} />
        ))}
      </SectionCard>
    </AppLayout>
  );
}
