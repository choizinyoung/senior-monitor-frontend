"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";
import { SeniorDetailModal, ConfirmProcessModal } from "@/components/organisms";
import { StatCard, SectionCard, DataTable } from "@/components/molecules";
import type { DataTableColumn } from "@/components/molecules";
import { Button, SeverityBadge, StatusBadge, Spinner } from "@/components/atoms";
import { ROUTES } from "@/constants";
import { alertService } from "@/services";
import type { SeverityLevel, SeniorDetail } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Stats = {
  totalSeniors: number;
  alertCount: number;
  confirmedTodayCount: number;
  emergencyTodayCount: number;
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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [alertRows, setAlertRows] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSenior, setSelectedSenior] = useState<SeniorDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);
  const [confirmTargetName, setConfirmTargetName] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, alertsRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/stats`),
        fetch(`${API_URL}/alerts`),
      ]);

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        setStats(statsJson.data ?? statsJson);
      }

      if (alertsRes.ok) {
        const alertsJson: AlertRow[] = await alertsRes.json();
        setAlertRows(alertsJson.slice(0, 5));
      }
    } catch {
      /* 에러 시 기본값 유지 */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
      fetchDashboard();
    } catch (e) {
      alert(`저장 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
    }
  };

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][today.getDay()]})`;

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
  ];

  if (loading) {
    return (
      <AppLayout>
        <TopBar title="통합 대시보드" />
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TopBar
        title="통합 대시보드"
        right={
          <span className="text-sm text-text-sub">
            {dateStr} · 오전 5시~10시 기상 신호 기준
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="전체 관리 대상자"
          value={stats?.totalSeniors ?? 0}
          sub="활성 관리 중"
        />
        <StatCard
          label="확인요망"
          value={stats?.alertCount ?? 0}
          sub="기상 신호 미수신 · 클릭하여 리스트 확인"
          valueColor="red"
          href={ROUTES.ALERT_LIST}
        />
        <StatCard
          label="오늘 확인완료"
          value={stats?.confirmedTodayCount ?? 0}
          sub="확인요망 → 확인완료 처리 건수"
          valueColor="blue"
        />
        <StatCard label="응급 호출" value={stats?.emergencyTodayCount ?? 0} sub="금일 발생 건수" valueColor="red" />
      </div>

      <SectionCard
        title="확인요망 대상자 (최근)"
        titleIcon={
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        }
        actions={
          <Link href={ROUTES.ALERT_LIST}>
            <Button variant="outline" size="sm">전체 보기 →</Button>
          </Link>
        }
      >
        <DataTable
          columns={columns}
          rows={alertRows}
          rowKey={(r) => String(r.id)}
          onRowClick={handleRowClick}
        />
      </SectionCard>

      <SeniorDetailModal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedSenior(null); }}
        senior={detailLoading ? null : selectedSenior}
        onConfirm={handleConfirmOpen}
        onEmergency={() =>
          alert("응급 호출 완료\n\n관할 기관에 응급 호출이 전송되었습니다.")
        }
      />
      <ConfirmProcessModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        seniorName={confirmTargetName}
        onSave={handleConfirmSave}
      />
    </AppLayout>
  );
}
