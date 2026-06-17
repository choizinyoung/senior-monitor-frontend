"use client";

import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";
import { StatCard, SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { StatusBadge } from "@/components/atoms";

type Signal = {
  id: string;
  name: string;
  device: string;
  receivedAt: string;
  status: "success" | "danger";
};

const SIGNALS: Signal[] = [
  { id: "1", name: "정주영", device: "SM-S906N", receivedAt: "2026.06.11 09:42:15", status: "success" },
  { id: "2", name: "테스트계정1", device: "SM-S928N", receivedAt: "2026.06.11 08:15:33", status: "success" },
  { id: "3", name: "홍길동", device: "SM-S906N", receivedAt: "2026.06.11 07:23:41", status: "success" },
  { id: "4", name: "김병일", device: "SM-S906N", receivedAt: "2026.06.10 06:45:12", status: "danger" },
];

const COLUMNS: DataTableColumn<Signal>[] = [
  { key: "name", header: "대상자", isTitle: true, cell: (r) => <span className="font-bold">{r.name}</span> },
  { key: "device", header: "디바이스", cell: (r) => r.device },
  { key: "receivedAt", header: "수신 시각", cell: (r) => r.receivedAt },
  { key: "status", header: "상태", cell: (r) => <StatusBadge status={r.status} /> },
];

export default function MonitoringPage() {
  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            모니터링 현황
          </>
        }
      />

      {/* 통계 카드 — 모바일 1열 → sm 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Railway 서버 상태"
          value={<span className="flex items-center gap-1.5 text-lg font-extrabold"><span className="w-2 h-2 rounded-full bg-success animate-pulse-dot inline-block" />연결됨</span> as unknown as string}
          sub="senior-monitor01-production.up.railway.app"
        />
        <StatCard label="오늘 수신 신호" value={342} sub="최근 갱신: 09:42:15" valueColor="blue" />
        <StatCard label="등록 디바이스" value={24} sub="활성 APK 설치 기기" />
      </div>

      <SectionCard
        title="최근 수신 신호"
        actions={
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success bg-success-light px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
            실시간 갱신 중
          </span>
        }
      >
        <DataTable
          columns={COLUMNS}
          rows={SIGNALS}
          rowKey={(r) => r.id}
        />
      </SectionCard>
    </AppLayout>
  );
}
