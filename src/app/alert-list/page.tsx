"use client";

import { useState } from "react";
import { AppLayout } from "@/components/templates";
import { TopBar, SeniorDetailModal, ConfirmProcessModal } from "@/components/organisms";
import { SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, SeverityBadge, StatusBadge, Select } from "@/components/atoms";
import { DISTRICT_OPTIONS } from "@/constants";

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
  { id: "4", name: "최말순", age: "80세", phone: "010-4567-8901", address: "서울 마포구 연남동 33", severity: "low", registeredAt: "2024.05.22" },
  { id: "5", name: "정복순", age: "85세", phone: "010-5678-9012", address: "서울 강북구 수유동 56", severity: "mid", registeredAt: "2023.09.10" },
];

export default function AlertListPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: DataTableColumn<AlertRow>[] = [
    { key: "name", header: "이름", isTitle: true, cell: (r) => <span className="font-bold">{r.name}</span> },
    { key: "age", header: "나이", cell: (r) => r.age },
    { key: "phone", header: "연락처", cell: (r) => r.phone, hideOnMobile: true },
    { key: "address", header: "주소", cell: (r) => r.address, hideOnMobile: true },
    { key: "severity", header: "중증정도", cell: (r) => <SeverityBadge level={r.severity} /> },
    { key: "registeredAt", header: "등록일", cell: (r) => r.registeredAt, hideOnMobile: true },
    { key: "status", header: "상태", cell: () => <StatusBadge status="danger" /> },
    {
      key: "action",
      header: "조치",
      isAction: true,
      cell: (r) => (
        <Button
          size="sm"
          onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
        >
          확인
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            확인요망 리스트
          </>
        }
      />

      <SectionCard
        title="확인요망 대상자"
        subTitle={<>총 <strong>{ALERT_ROWS.length}</strong>명 · 오전 5시~10시 기상 신호 미수신</>}
        actions={<Button variant="outline" size="sm">전체 새로고침</Button>}
      >
        {/* 필터 바 */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-border bg-[#FAFBFF] flex-wrap">
          <span className="text-sm font-semibold text-text-sub flex-shrink-0">필터:</span>
          <Select className="flex-1 min-w-[130px] max-w-[200px]">
            {["중증정도: 전체", "상", "중", "하"].map((o) => <option key={o}>{o}</option>)}
          </Select>
          <Select className="flex-1 min-w-[130px] max-w-[200px]">
            {DISTRICT_OPTIONS.map((o) => <option key={o}>{o === "전체" ? "관할구역: 전체" : o}</option>)}
          </Select>
        </div>

        <DataTable
          columns={columns}
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
