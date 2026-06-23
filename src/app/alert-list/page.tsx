"use client";

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/templates";
import {
  TopBar,
  SeniorDetailModal,
  ConfirmProcessModal,
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
import type { SeverityLevel } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

export default function AlertListPage() {
  const [rows, setRows] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState("");
  const [guFilter, setGuFilter] = useState("");
  const [dongFilter, setDongFilter] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (severityFilter) params.set("severity", severityFilter);
      if (guFilter) params.set("gu", guFilter);
      if (dongFilter) params.set("dong", dongFilter);

      const query = params.toString();
      const url = `${API_URL}/alerts${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`서버 오류 (${res.status})`);
      const data: AlertRow[] = await res.json();
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  }, [severityFilter, guFilter, dongFilter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleSeverityChange = (value: string) => {
    setSeverityFilter(SEVERITY_FILTER_MAP[value] ?? "");
  };

  const handleGuChange = (value: string) => {
    const gu = value === "전체" ? "" : value;
    setGuFilter(gu);
    setDongFilter("");
  };

  const handleDongChange = (value: string) => {
    setDongFilter(value === "전체" ? "" : value);
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
      key: "action",
      header: "조치",
      isAction: true,
      cell: () => (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
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
            onRowClick={() => setDetailOpen(true)}
          />
        )}
      </SectionCard>

      <SeniorDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        senior={null}
        onConfirm={() => {
          setDetailOpen(false);
          setConfirmOpen(true);
        }}
        onEmergency={() =>
          alert("응급 호출 완료\n\n관할 기관에 응급 호출이 전송되었습니다.")
        }
      />
      <ConfirmProcessModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSave={() => alert("저장 완료! DB에 확인 처리 내역이 기록되었습니다.")}
      />
    </AppLayout>
  );
}
