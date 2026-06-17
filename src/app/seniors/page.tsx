"use client";

import { useState } from "react";
import { AppLayout } from "@/components/templates";
import { TopBar, RegisterSeniorModal } from "@/components/organisms";
import { SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, SeverityBadge, Input, Select } from "@/components/atoms";
import { DISTRICT_OPTIONS } from "@/constants";

type Senior = {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  severity: "high" | "mid" | "low";
  communityCenter: string;
  registeredAt: string;
};

const SENIORS: Senior[] = [
  { id: "1", name: "김영희", birthDate: "1948.05.12", phone: "010-1234-5678", address: "서울 종로구 삼청동 12-3", severity: "high", communityCenter: "삼청동 주민센터", registeredAt: "2024.03.15" },
  { id: "2", name: "이순자", birthDate: "1944.08.23", phone: "010-2345-6789", address: "서울 중구 을지로 45", severity: "mid", communityCenter: "을지로 주민센터", registeredAt: "2023.11.20" },
  { id: "3", name: "박철수", birthDate: "1951.02.14", phone: "010-3456-7890", address: "서울 성동구 왕십리 78", severity: "high", communityCenter: "왕십리 주민센터", registeredAt: "2024.01.08" },
  { id: "4", name: "최말순", birthDate: "1946.11.05", phone: "010-4567-8901", address: "서울 마포구 연남동 33", severity: "low", communityCenter: "연남동 주민센터", registeredAt: "2024.05.22" },
  { id: "5", name: "정복순", birthDate: "1941.03.18", phone: "010-5678-9012", address: "서울 강북구 수유동 56", severity: "mid", communityCenter: "수유동 주민센터", registeredAt: "2023.09.10" },
];

export default function SeniorsPage() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Senior | null>(null);

  const columns: DataTableColumn<Senior>[] = [
    { key: "name", header: "이름", isTitle: true, cell: (r) => <span className="font-bold">{r.name}</span> },
    { key: "birthDate", header: "생년월일", cell: (r) => r.birthDate, hideOnMobile: true },
    { key: "phone", header: "연락처", cell: (r) => r.phone },
    { key: "address", header: "주소", cell: (r) => r.address, hideOnMobile: true },
    { key: "severity", header: "중증도", cell: (r) => <SeverityBadge level={r.severity} /> },
    { key: "communityCenter", header: "담당 주민센터", cell: (r) => r.communityCenter, hideOnMobile: true },
    { key: "registeredAt", header: "등록일", cell: (r) => r.registeredAt, hideOnMobile: true },
    {
      key: "actions",
      header: "관리",
      isAction: true,
      cell: (r) => (
        <div className="flex gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); setEditTarget(r); }}
            className="px-2 py-1 text-sm font-semibold text-primary rounded-md hover:bg-primary-light transition-colors"
          >
            수정
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 text-sm font-semibold text-danger rounded-md hover:bg-danger-light transition-colors"
          >
            삭제
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            대상자 관리
          </>
        }
      />

      <SectionCard
        title="관리 대상자 목록 (127명)"
        actions={<Button onClick={() => setRegisterOpen(true)}>+ 신규 등록</Button>}
      >
        {/* 검색 바 */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-border bg-[#FAFBFF] flex-wrap">
          <span className="text-sm font-semibold text-text-sub flex-shrink-0">검색:</span>
          <Input placeholder="이름으로 검색..." className="flex-1 min-w-[150px] max-w-[240px]" />
          <Select className="flex-1 min-w-[130px] max-w-[200px]">
            {["중증정도: 전체", "상", "중", "하"].map((o) => <option key={o}>{o}</option>)}
          </Select>
          <Select className="flex-1 min-w-[130px] max-w-[200px]">
            {DISTRICT_OPTIONS.map((o) => <option key={o}>{o === "전체" ? "관할구역: 전체" : o}</option>)}
          </Select>
          <Button variant="outline" size="sm">검색</Button>
        </div>

        <DataTable
          columns={columns}
          rows={SENIORS}
          rowKey={(r) => r.id}
        />

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-1 py-5">
          {[1, 2, 3, "...", 13].map((p, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-lg border-[1.5px] text-sm font-semibold transition-all ${
                p === 1
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-sub border-border hover:bg-bg-main hover:text-text-main"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </SectionCard>

      <RegisterSeniorModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        mode="register"
        onSave={() => alert("등록 완료! DB에 저장되었습니다.")}
      />
      <RegisterSeniorModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        mode="edit"
        initialData={editTarget ? { name: editTarget.name } : undefined}
        onSave={() => alert("수정 완료! DB에 저장되었습니다.")}
      />
    </AppLayout>
  );
}
