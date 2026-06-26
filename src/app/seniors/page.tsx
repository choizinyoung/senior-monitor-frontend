"use client";

import { useState } from "react";
import { AppLayout } from "@/components/templates";
import { TopBar, RegisterSeniorModal, SeniorDetailModal, ConfirmProcessModal, SignalHistoryModal } from "@/components/organisms";
import { SectionCard, DataTable, RegionSelector } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, StatusBadge, Input, Select, Spinner } from "@/components/atoms";
import { SENIOR_STATUS_OPTIONS } from "@/constants";
import { useSeniors } from "@/hooks/useSeniors";
import { seniorService, alertService } from "@/services";
import type { ApiSenior, SeniorDetail, SeniorStatusType } from "@/types";

const STATUS_BADGE_MAP: Record<SeniorStatusType, "danger" | "success" | "warning" | "info"> = {
  "정상":       "success",
  "확인요망":    "danger",
  "확인완료":    "info",
  "확인요망유지": "warning",
  "응급호출":    "danger",
};

function formatDate(iso: string) {
  return iso.split("T")[0];
}

export default function SeniorsPage() {
  const {
    seniors, totalElements, totalPages, page,
    setPage, applyFilter, isLoading, error,
    refetch, create, update, remove,
  } = useSeniors();

  const [nameInput,   setNameInput]   = useState("");
  const [statusInput, setStatusInput] = useState("전체");
  const [cityInput,   setCityInput]   = useState("전체");
  const [guInput,     setGuInput]     = useState("전체");
  const [dongInput,   setDongInput]   = useState("전체");

  const [registerOpen,  setRegisterOpen]  = useState(false);
  const [editTarget,    setEditTarget]    = useState<ApiSenior | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<number | null>(null);

  const [signalOpen,       setSignalOpen]       = useState(false);
  const [signalTargetId,   setSignalTargetId]   = useState<number | null>(null);
  const [signalTargetName, setSignalTargetName] = useState("");

  const [selectedSenior,  setSelectedSenior]  = useState<SeniorDetail | null>(null);
  const [detailOpen,      setDetailOpen]      = useState(false);
  const [detailLoading,   setDetailLoading]   = useState(false);
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);
  const [confirmTargetName, setConfirmTargetName] = useState("");

  const handleRowClick = async (r: ApiSenior) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const detail = await alertService.getDetail(r.id);
      setSelectedSenior(detail);
    } catch {
      setSelectedSenior(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConfirmOpen = () => {
    setDetailOpen(false);
    setConfirmTargetId(selectedSenior?.id ?? null);
    setConfirmTargetName(selectedSenior?.name ?? "");
    setConfirmOpen(true);
  };

  const handleConfirmSave = async (data: { date: string; time: string; processStatus: string; memo: string }) => {
    if (!confirmTargetId) return;
    try {
      await alertService.confirm(confirmTargetId, {
        managerName: "담당자",
        resultStatus: data.processStatus,
        memo: data.memo,
        contactedAt: `${data.date}T${data.time}:00`,
      });
      alert("저장 완료! 확인 처리 내역이 기록되었습니다.");
      setConfirmOpen(false);
      refetch();
    } catch (e) {
      alert(`저장 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    }
  };

  const handleEditClick = async (r: ApiSenior) => {
    setEditLoadingId(r.id);
    try {
      const fresh = await seniorService.get(r.id);
      setEditTarget(fresh);
    } catch {
      setEditTarget(r); // 조회 실패 시 목록 데이터로 폴백
    } finally {
      setEditLoadingId(null);
    }
  };

  const handleSearch = () => {
    applyFilter({
      name:   nameInput   || undefined,
      status: statusInput !== "전체" ? statusInput : undefined,
      city:   cityInput   !== "전체" ? cityInput   : undefined,
      gu:     guInput     !== "전체" ? guInput     : undefined,
      dong:   dongInput   !== "전체" ? dongInput   : undefined,
    });
  };

  const columns: DataTableColumn<ApiSenior>[] = [
    { key: "name",        header: "이름",       isTitle: true, cell: (r) => <span className="font-bold">{r.name}</span> },
    { key: "age",         header: "나이",       cell: (r) => `${r.age}세` },
    { key: "phone",       header: "연락처",     cell: (r) => r.phone },
    { key: "location",    header: "관할지역",    cell: (r) => `${r.city} ${r.gu} ${r.dong}`, hideOnMobile: true },
    { key: "deviceId",    header: "디바이스 ID", cell: (r) => r.deviceId, hideOnMobile: true },
    { key: "status",      header: "상태",       cell: (r) => <StatusBadge status={STATUS_BADGE_MAP[r.status]} label={r.status} /> },
    { key: "registeredAt",header: "등록일",     cell: (r) => formatDate(r.registeredAt), hideOnMobile: true },
    {
      key: "signals",
      header: "신호이력",
      isAction: true,
      cell: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSignalTargetId(r.id); setSignalTargetName(r.name); setSignalOpen(true); }}
          className="px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-all duration-150 cursor-pointer shadow-[0_4px_14px_rgba(45,206,137,0.3)] hover:bg-[#24B576] hover:shadow-[0_6px_18px_rgba(45,206,137,0.4)] hover:-translate-y-px" style={{ backgroundColor: "#2dce89" }}
        >
          신호이력
        </button>
      ),
    },
    {
      key: "actions",
      header: "관리",
      isAction: true,
      cell: (r) => (
        <div className="flex gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); handleEditClick(r); }}
            disabled={editLoadingId === r.id}
            className="px-2 py-1 text-sm font-semibold text-primary rounded-md hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {editLoadingId === r.id ? "…" : "수정"}
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
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
          >
            <option value="전체">상태: 전체</option>
            {SENIOR_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
          <RegionSelector
            city={cityInput}
            gu={guInput}
            dong={dongInput}
            onCityChange={setCityInput}
            onGuChange={setGuInput}
            onDongChange={setDongInput}
            showAll
            className="flex-1 min-w-[380px]"
          />
          <Button variant="outline" size="sm" onClick={handleSearch}>검색</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16"><Spinner /></div>
        ) : error ? (
          <div className="flex justify-center items-center py-16 text-danger text-sm font-medium">{error}</div>
        ) : (
          <DataTable columns={columns} rows={seniors} rowKey={(r) => String(r.id)} onRowClick={handleRowClick} />
        )}

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

      <SignalHistoryModal
        isOpen={signalOpen}
        onClose={() => setSignalOpen(false)}
        seniorId={signalTargetId}
        seniorName={signalTargetName}
      />
      <SeniorDetailModal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedSenior(null); }}
        senior={detailLoading ? null : selectedSenior}
        onConfirm={handleConfirmOpen}
        onEmergency={() => alert("응급 호출 완료\n\n관할 기관에 응급 호출이 전송되었습니다.")}
      />
      <ConfirmProcessModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        seniorName={confirmTargetName}
        onSave={handleConfirmSave}
      />
      <RegisterSeniorModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        mode="register"
        onSave={async (form) => {
          await create({ deviceId: "", name: form.name, age: Number(form.age), phone: form.phone, city: form.city, gu: form.gu, dong: form.dong });
          setRegisterOpen(false);
        }}
      />
      <RegisterSeniorModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        mode="edit"
        initialData={editTarget ? {
          name: editTarget.name,
          age: String(editTarget.age),
          phone: editTarget.phone,
          city: editTarget.city,
          gu: editTarget.gu,
          dong: editTarget.dong,
        } : undefined}
        onSave={async (form) => {
          if (!editTarget) return;
          await update(editTarget.id, { name: form.name, age: Number(form.age), phone: form.phone, city: form.city, gu: form.gu, dong: form.dong });
          setEditTarget(null);
        }}
      />
    </AppLayout>
  );
}
