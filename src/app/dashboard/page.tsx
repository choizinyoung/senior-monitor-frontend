"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";
import { SeniorDetailModal, ConfirmProcessModal } from "@/components/organisms";
import { StatCard, SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, SeverityBadge, StatusBadge } from "@/components/atoms";
import { ROUTES } from "@/constants";

type AlertRow = {
  id: string;
  name: string;
  age: string;
  phone: string;
  address: string;
  severity: "high" | "mid" | "low";
  registeredAt: string;
};

const ALERT_ROWS: AlertRow[] = [
  { id: "1", name: "김영희", age: "78세", phone: "010-1234-5678", address: "서울 종로구 삼청동 12-3", severity: "high", registeredAt: "2024.03.15" },
  { id: "2", name: "이순자", age: "82세", phone: "010-2345-6789", address: "서울 중구 을지로 45", severity: "mid", registeredAt: "2023.11.20" },
  { id: "3", name: "박철수", age: "75세", phone: "010-3456-7890", address: "서울 성동구 왕십리 78", severity: "high", registeredAt: "2024.01.08" },
];

const COLUMNS: DataTableColumn<AlertRow>[] = [
  { key: "name", header: "이름", isTitle: true, cell: (r) => <span className="font-bold">{r.name}</span> },
  { key: "age", header: "나이", cell: (r) => r.age },
  { key: "phone", header: "연락처", cell: (r) => r.phone, hideOnMobile: true },
  { key: "address", header: "주소", cell: (r) => r.address, hideOnMobile: true },
  { key: "severity", header: "중증정도", cell: (r) => <SeverityBadge level={r.severity} /> },
  { key: "registeredAt", header: "등록일", cell: (r) => r.registeredAt, hideOnMobile: true },
  { key: "status", header: "상태", cell: () => <StatusBadge status="danger" /> },
];

export default function DashboardPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <AppLayout>
      <TopBar
        title="통합 대시보드"
        right={<span className="text-sm text-text-sub">2026년 6월 11일 (수) · 오전 5시~10시 기상 신호 기준</span>}
      />

      {/* 통계 카드 — 모바일 1열 → sm 2열 → xl 4열 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="전체 관리 대상자" value={127} sub="활성 관리 중" />
        <StatCard label="확인요망" value={5} sub="기상 신호 미수신 · 클릭하여 리스트 확인" valueColor="red" href={ROUTES.ALERT_LIST} />
        <StatCard label="오늘 확인완료" value={3} sub="확인요망 → 확인완료 처리 건수" valueColor="blue" />
        <StatCard label="응급 호출" value={0} sub="금일 발생 건수" />
      </div>

      {/* 확인요망 테이블 */}
      <SectionCard
        title="확인요망 대상자 (최근)"
        titleIcon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>}
        actions={<Link href={ROUTES.ALERT_LIST}><Button variant="outline" size="sm">전체 보기 →</Button></Link>}
      >
        <DataTable
          columns={COLUMNS}
          rows={ALERT_ROWS}
          rowKey={(r) => r.id}
          onRowClick={() => setDetailOpen(true)}
        />
      </SectionCard>

      <SeniorDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        senior={null}
        onConfirm={() => { setDetailOpen(false); setConfirmOpen(true); }}
        onEmergency={() => alert("응급 호출 완료\n\n관할 기관에 응급 호출이 전송되었습니다.")}
      />
      <ConfirmProcessModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSave={() => alert("저장 완료! DB에 확인 처리 내역이 기록되었습니다.")}
      />
    </AppLayout>
  );
}
