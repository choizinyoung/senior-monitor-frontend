"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";
import { SectionCard, DataTable, RegionSelector } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, Input, Select, StatusBadge, Spinner } from "@/components/atoms";
import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

const RESULT_STATUS_OPTIONS = ["전체", "확인완료", "확인요망유지", "응급호출"] as const;
type ResultStatus = "확인완료" | "확인요망유지" | "응급호출";

const RESULT_STATUS_BADGE: Record<ResultStatus, "success" | "warning" | "danger"> = {
  "확인완료":    "success",
  "확인요망유지": "warning",
  "응급호출":    "danger",
};

type ContactRow = {
  id: number;
  seniorId: number;
  seniorName: string;
  gu: string;
  dong: string;
  managerName: string;
  resultStatus: ResultStatus;
  memo?: string;
  contactedAt: string;
  createdAt: string;
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

interface SearchParams {
  statusFilter: string;
  fromDate: string;
  toDate: string;
  nameInput: string;
  guInput: string;
  dongInput: string;
}

async function loadContacts(p: SearchParams): Promise<ContactRow[]> {
  const query = new URLSearchParams();
  if (p.statusFilter !== "전체") query.set("resultStatus", p.statusFilter);
  const qs = query.toString();
  const res = await apiClient.get<ApiResponse<ContactRow[]>>(`/contacts${qs ? `?${qs}` : ""}`);
  const data: ContactRow[] = res.data ?? [];

  return data.filter((r) => {
    const day = r.contactedAt.split("T")[0];
    if (p.fromDate && day < p.fromDate) return false;
    if (p.toDate   && day > p.toDate)   return false;
    if (p.nameInput && !r.seniorName.includes(p.nameInput)) return false;
    if (p.guInput   !== "전체" && r.gu   !== p.guInput)   return false;
    if (p.dongInput !== "전체" && r.dong !== p.dongInput) return false;
    return true;
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryPage() {
  const today = todayStr();

  const [fromDate,   setFromDate]   = useState(today);
  const [toDate,     setToDate]     = useState(today);
  const [nameInput,  setNameInput]  = useState("");
  const [cityInput,  setCityInput]  = useState("전체");
  const [guInput,    setGuInput]    = useState("전체");
  const [dongInput,  setDongInput]  = useState("전체");
  const [statusInput, setStatusInput] = useState("전체");

  const [rows,    setRows]    = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // 진입 시 오늘 데이터 자동 조회
  useEffect(() => {
    const t = todayStr();
    loadContacts({ statusFilter: "전체", fromDate: t, toDate: t, nameInput: "", guInput: "전체", dongInput: "전체" })
      .then((data) => { setRows(data); setLoading(false); })
      .catch((e) => { setError(e instanceof Error ? e.message : "데이터를 불러올 수 없습니다"); setLoading(false); });
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadContacts({ statusFilter: statusInput, fromDate, toDate, nameInput, guInput, dongInput });
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<ContactRow>[] = [
    {
      key: "seniorName",
      header: "대상자명",
      isTitle: true,
      cell: (r) => <span className="font-bold">{r.seniorName}</span>,
    },
    {
      key: "location",
      header: "관할지역",
      cell: (r) => `${r.gu} ${r.dong}`,
      hideOnMobile: true,
    },
    {
      key: "resultStatus",
      header: "처리상태",
      cell: (r) => (
        <StatusBadge
          status={RESULT_STATUS_BADGE[r.resultStatus] ?? "info"}
          label={r.resultStatus}
        />
      ),
    },
    {
      key: "managerName",
      header: "담당자",
      cell: (r) => r.managerName,
      hideOnMobile: true,
    },
    {
      key: "contactedAt",
      header: "처리일시",
      cell: (r) => formatDateTime(r.contactedAt),
    },
    {
      key: "memo",
      header: "내용",
      cell: (r) =>
        r.memo ? (
          <span className="block max-w-[200px] truncate text-text-sub text-sm" title={r.memo}>
            {r.memo}
          </span>
        ) : (
          <span className="text-text-sub text-xs">-</span>
        ),
      hideOnMobile: true,
    },
  ];

  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
              <line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="12" y2="18" />
            </svg>
            처리 내역 조회
          </>
        }
      />

      <SectionCard
        title="처리 내역 조회"
        subTitle="날짜, 대상자명, 관할구역, 처리상태별 조회"
      >
        {/* 필터 패널 */}
        <div className="px-4 sm:px-6 py-5 border-b border-border bg-[#FAFBFF]">
          {/* Row 1: 날짜 / 대상자명 / 처리상태 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold text-text-sub mb-1.5">조회 시작일</p>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-sub mb-1.5">조회 종료일</p>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-sub mb-1.5">대상자명</p>
              <Input
                placeholder="이름 입력"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-sub mb-1.5">처리상태</p>
              <Select value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
                {RESULT_STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </div>
          </div>

          {/* Row 2: 관할구역 + 조회 버튼 */}
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[320px]">
              <p className="text-xs font-semibold text-text-sub mb-1.5">관할구역</p>
              <RegionSelector
                city={cityInput}
                gu={guInput}
                dong={dongInput}
                onCityChange={setCityInput}
                onGuChange={setGuInput}
                onDongChange={setDongInput}
                showAll
              />
            </div>
            <Button onClick={handleSearch}>조회</Button>
          </div>
        </div>

        {/* 결과 영역 */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : error ? (
          <div className="py-14 text-center text-sm text-danger">
            {error}
            <br />
            <Button variant="outline" size="sm" className="mt-3" onClick={handleSearch}>
              다시 시도
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-text-sub">
            <p className="text-sm font-medium">조건에 해당하는 처리 내역이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="px-4 sm:px-6 py-3 text-xs text-text-sub border-b border-border">
              총 <strong className="text-text-main">{rows.length}</strong>건
            </div>
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(r) => String(r.id)}
            />
          </>
        )}
      </SectionCard>
    </AppLayout>
  );
}
