"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/templates";
import {
  TopBar,
  SeniorDetailModal,
  ConfirmProcessModal,
  SignalHistoryModal,
} from "@/components/organisms";
import { SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import {
  Button,
  SeverityBadge,
  StatusBadge,
  Select,
  Spinner,
} from "@/components/atoms";
import { GU_OPTIONS, DONG_BY_GU } from "@/constants";
import { alertService } from "@/services";
import { apiClient } from "@/lib/apiClient";
import type { SeverityLevel, SeniorDetail, ApiResponse } from "@/types";

const SEVERITY_FILTER_MAP: Record<string, string> = {
  "중증정도: 전체": "",
  상: "high",
  중: "mid",
  하: "low",
};

type AlertRow = {
  id: number;
  name: string;
  age: number;
  phone: string;
  city: string;
  gu: string;
  dong: string;
  severity: SeverityLevel;
  status: string;
  registeredAt: string;
};

async function fetchAlertsData(severityFilter: string, guFilter: string, dongFilter: string): Promise<AlertRow[]> {
  const params = new URLSearchParams();
  if (severityFilter) params.set("severity", severityFilter);
  if (guFilter) params.set("gu", guFilter);
  if (dongFilter) params.set("dong", dongFilter);
  const query = params.toString();
  const res = await apiClient.get<ApiResponse<AlertRow[]>>(`/alerts${query ? `?${query}` : ""}`);
  return res.data ?? [];
}

export default function AlertListPage() {
  const [rows, setRows] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState("");
  const [guFilter, setGuFilter] = useState("");
  const [dongFilter, setDongFilter] = useState("");

  const [selectedSenior, setSelectedSenior] = useState<SeniorDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);
  const [confirmTargetName, setConfirmTargetName] = useState("");
  const [confirmFromDetail, setConfirmFromDetail] = useState(false);

  const [signalOpen,       setSignalOpen]       = useState(false);
  const [signalTargetId,   setSignalTargetId]   = useState<number | null>(null);
  const [signalTargetName, setSignalTargetName] = useState("");

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlertsData(severityFilter, guFilter, dongFilter);
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchAlertsData(severityFilter, guFilter, dongFilter)
      .then((data) => { if (!cancelled) { setRows(data); setError(null); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : "데이터를 불러올 수 없습니다"); setLoading(false); } });
    return () => { cancelled = true; };
  }, [severityFilter, guFilter, dongFilter]);

  const handleRowClick = async (row: AlertRow) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const detail = await alertService.getDetail(row.id);
      setSelectedSenior(detail);
    } catch {
      setSelectedSenior(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConfirmOpen = (seniorId?: number, seniorName?: string) => {
    const fromDetail = seniorId === undefined;
    setConfirmFromDetail(fromDetail);
    setDetailOpen(false);
    setConfirmTargetId(seniorId ?? selectedSenior?.id ?? null);
    setConfirmTargetName(seniorName ?? selectedSenior?.name ?? "");
    setConfirmOpen(true);
  };

  const refetchDetail = async (seniorId: number) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const detail = await alertService.getDetail(seniorId);
      setSelectedSenior(detail);
    } catch {
      setSelectedSenior(null);
    } finally {
      setDetailLoading(false);
    }
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
      fetchAlerts();
      if (confirmFromDetail) refetchDetail(confirmTargetId);
    } catch (e) {
      alert(`저장 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    }
  };

  const handleEmergency = async () => {
    if (!selectedSenior) return;
    const id = selectedSenior.id;
    try {
      await alertService.confirm(id, {
        managerName: "담당자",
        resultStatus: "응급호출",
        memo: "",
        contactedAt: new Date().toISOString().slice(0, 19),
      });
      alert("응급 호출 완료\n\n관할 기관에 응급 호출이 전송되었습니다.");
      fetchAlerts();
      refetchDetail(id);
    } catch (e) {
      alert(`응급 호출 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    }
  };

  const handleSeverityChange = (value: string) => {
    setSeverityFilter(SEVERITY_FILTER_MAP[value] ?? "");
    setLoading(true);
  };

  const handleGuChange = (value: string) => {
    const gu = value === "전체" ? "" : value;
    setGuFilter(gu);
    setDongFilter("");
    setLoading(true);
  };

  const handleDongChange = (value: string) => {
    setDongFilter(value === "전체" ? "" : value);
    setLoading(true);
  };

  const dongOptions = guFilter ? DONG_BY_GU[guFilter] ?? [] : [];

  const columns: DataTableColumn<AlertRow>[] = [
    {
      key: "name",
      header: "이름",
      isTitle: true,
      cell: (r) => <span className="font-bold">{r.name}</span>,
    },
    { key: "age", header: "나이", cell: (r) => `${r.age}세` },
    {
      key: "phone",
      header: "연락처",
      cell: (r) => r.phone,
      hideOnMobile: true,
    },
    {
      key: "location",
      header: "관할지역",
      cell: (r) => `${r.gu} ${r.dong}`,
      hideOnMobile: true,
    },
    {
      key: "severity",
      header: "중증정도",
      cell: (r) => <SeverityBadge level={r.severity} />,
    },
    {
      key: "registeredAt",
      header: "등록일",
      cell: (r) => r.registeredAt,
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "상태",
      cell: () => <StatusBadge status="danger" />,
    },
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
      key: "action",
      header: "조치",
      isAction: true,
      cell: (r) => (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleConfirmOpen(r.id, r.name);
          }}
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
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            확인요망 리스트
          </>
        }
      />

      <SectionCard
        title="확인요망 대상자"
        subTitle={
          <>
            총 <strong>{rows.length}</strong>명 · 오전 5시~10시 기상 신호 미수신
          </>
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => fetchAlerts()}>
            전체 새로고침
          </Button>
        }
      >
        {/* 필터 바 */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-border bg-[#FAFBFF] flex-wrap">
          <span className="text-sm font-semibold text-text-sub flex-shrink-0">
            필터:
          </span>
          <Select
            className="flex-1 min-w-[130px] max-w-[200px]"
            onChange={(e) => handleSeverityChange(e.target.value)}
          >
            {Object.keys(SEVERITY_FILTER_MAP).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <Select
            className="flex-1 min-w-[130px] max-w-[200px]"
            value={guFilter || "전체"}
            onChange={(e) => handleGuChange(e.target.value)}
          >
            {GU_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === "전체" ? "관할구역: 전체" : o}
              </option>
            ))}
          </Select>
          <Select
            className="flex-1 min-w-[130px] max-w-[200px]"
            value={dongFilter || "전체"}
            onChange={(e) => handleDongChange(e.target.value)}
            disabled={!guFilter}
          >
            {guFilter ? (
              dongOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "전체" ? "세부지역: 전체" : o}
                </option>
              ))
            ) : (
              <option value="전체">세부지역: 전체</option>
            )}
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Spinner />
          </div>
        ) : error ? (
          <div className="py-14 text-center text-sm text-danger">
            {error}
            <br />
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fetchAlerts()}
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => String(r.id)}
            onRowClick={handleRowClick}
          />
        )}
      </SectionCard>

      <SeniorDetailModal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedSenior(null); }}
        senior={detailLoading ? null : selectedSenior}
        onConfirm={() => handleConfirmOpen()}
        onEmergency={handleEmergency}
      />
      <ConfirmProcessModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        seniorName={confirmTargetName}
        onSave={handleConfirmSave}
      />
      <SignalHistoryModal
        isOpen={signalOpen}
        onClose={() => setSignalOpen(false)}
        seniorId={signalTargetId}
        seniorName={signalTargetName}
      />
    </AppLayout>
  );
}
