"use client";

import { useState } from "react";
import { AppLayout } from "@/components/templates";
import { TopBar, RegisterSeniorModal } from "@/components/organisms";
import { SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, SeverityBadge, Input, Select, Spinner } from "@/components/atoms";
import { DISTRICT_OPTIONS, SEVERITY_LABEL } from "@/constants";
import { useSeniors } from "@/hooks/useSeniors";
import type { Senior } from "@/types";

const SEVERITY_OPTIONS_KO = ["전체", "상", "중", "하"];
// "high"|"mid"|"low" → "상"|"중"|"하"
const toKo = (s: string) => SEVERITY_LABEL[s] ?? s;
// "상"|"중"|"하" → "high"|"mid"|"low"
const SEVERITY_MAP_TO_API: Record<string, Senior["severity"]> = { "상": "high", "중": "mid", "하": "low" };

export default function SeniorsPage() {
  const {
    seniors,
    totalElements,
    totalPages,
    page,
    setPage,
    applyFilter,
    isLoading,
    error,
    create,
    update,
    remove,
  } = useSeniors();

  // 검색 폼 (미적용 상태)
  const [nameInput, setNameInput] = useState("");
  const [severityInput, setSeverityInput] = useState("전체");
  const [districtInput, setDistrictInput] = useState("전체");

  // 모달
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Senior | null>(null);

  const handleSearch = () => {
    applyFilter({
      name: nameInput || undefined,
      severity: severityInput !== "전체" ? severityInput : undefined,
      district: districtInput !== "전체" ? districtInput : undefined,
    });
  };

  const handleCreate = async (form: { name: string; birthDate: string; phone: string; severity: string; address: string; communityCenter: string; wakeWindow: string; memo: string }) => {
    await create({
      name: form.name,
      birthDate: form.birthDate,
      phone: form.phone,
      severity: SEVERITY_MAP_TO_API[form.severity] ?? "low",
      address: form.address,
      communityCenter: form.communityCenter,
      memo: form.memo,
    });
  };

  const handleUpdate = async (form: { name: string; birthDate: string; phone: string; severity: string; address: string; communityCenter: string; wakeWindow: string; memo: string }) => {
    if (!editTarget) return;
    await update(editTarget.id, {
      name: form.name,
      birthDate: form.birthDate,
      phone: form.phone,
      severity: SEVERITY_MAP_TO_API[form.severity] ?? "low",
      address: form.address,
      communityCenter: form.communityCenter,
      memo: form.memo,
    });
  };

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
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm(`"${r.name}" 대상자를 삭제하시겠습니까?`)) {
                await remove(r.id);
              }
            }}
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
        title={`관리 대상자 목록 (${totalElements}명)`}
        actions={<Button onClick={() => setRegisterOpen(true)}>+ 신규 등록</Button>}
      >
        {/* 검색 바 */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-border bg-[#FAFBFF] flex-wrap">
          <span className="text-sm font-semibold text-text-sub flex-shrink-0">검색:</span>
          <Input
            placeholder="이름으로 검색..."
            className="flex-1 min-w-[150px] max-w-[240px]"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Select
            className="flex-1 min-w-[130px] max-w-[200px]"
            value={severityInput}
            onChange={(e) => setSeverityInput(e.target.value)}
          >
            {SEVERITY_OPTIONS_KO.map((o) => (
              <option key={o} value={o}>{o === "전체" ? "중증정도: 전체" : o}</option>
            ))}
          </Select>
          <Select
            className="flex-1 min-w-[130px] max-w-[200px]"
            value={districtInput}
            onChange={(e) => setDistrictInput(e.target.value)}
          >
            {DISTRICT_OPTIONS.map((o) => (
              <option key={o} value={o}>{o === "전체" ? "관할구역: 전체" : o}</option>
            ))}
          </Select>
          <Button variant="outline" size="sm" onClick={handleSearch}>검색</Button>
        </div>

        {/* 로딩 / 에러 / 데이터 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16 text-danger text-sm font-medium">
            {error}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={seniors}
            rowKey={(r) => r.id}
          />
        )}

        {/* 페이지네이션 */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 py-5">
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg border-[1.5px] text-sm font-semibold transition-all ${
                  p === page
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-sub border-border hover:bg-bg-main hover:text-text-main"
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      <RegisterSeniorModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        mode="register"
        onSave={async (form) => {
          await handleCreate(form);
          setRegisterOpen(false);
        }}
      />
      <RegisterSeniorModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        mode="edit"
        initialData={editTarget ? {
          name: editTarget.name,
          birthDate: editTarget.birthDate,
          phone: editTarget.phone,
          severity: toKo(editTarget.severity),
          address: editTarget.address,
          communityCenter: editTarget.communityCenter,
          memo: editTarget.memo ?? "",
        } : undefined}
        onSave={async (form) => {
          await handleUpdate(form);
          setEditTarget(null);
        }}
      />
    </AppLayout>
  );
}
