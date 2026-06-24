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
import type { SeverityLevel } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type Stats = {
  totalSeniors: number;
  alertCount: number;
  confirmedTodayCount: number;
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
  const [stats, setStats]         = useState<Stats | null>(null);
  const [alertRows, setAlertRows] = useState<AlertRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [detailOpen,  setDetailOpen]  = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 순수 fetch — setState 없음
  const fetchDashboard = useCallback(async (): Promise<{ stats: Stats | null; rows: AlertRow[] }> => {
    const [statsRes, alertsRes] = await Promise.all([
      fetch(`${API_URL}/api/dashboard/stats`),
      fetch(`${API_URL}/alerts`),
    ]);
    const stats: Stats | null = statsRes.ok ? ((await statsRes.json()).data ?? (await statsRes.json())) : null;
    const rows: AlertRow[]    = alertsRes.ok ? (await alertsRes.json()).slice(0, 5) : [];
    return { stats, rows };
  }, []);

  // 모든 setState는 비동기 콜백에서만 호출
  useEffect(() => {
    let cancelled = false;
    fetchDashboard()
      .then(({ stats, rows }) => {
        if (!cancelled) { setStats(stats); setAlertRows(rows); setLoading(false); }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetchDashboard]);

  const today   = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][today.getDay()]})`;

  const columns: DataTableColumn<AlertRow>[] = [
    { key: "name",        header: "이름",    isTitle: true, cell: (r) => <span className="font-bold">{r.name}</span> },
    { key: "age",         header: "나이",    cell: (r) => `${r.age}세` },
    { key: "phone",       header: "연락처",  cell: (r) => r.phone, hideOnMobile: true },
    { key: "location",    header: "관할지역", cell: (r) => `${r.gu} ${r.dong}`, hideOnMobile: true },
    { key: "severity",    header: "중증정도", cell: (r) => <SeverityBadge level={r.severity} /> },
    { key: "registeredAt",header: "등록일",  cell: (r) => r.registeredAt, hideOnMobile: true },
    { key: "status",      header: "상태",    cell: () => <StatusBadge status="danger" /> },
  ];

  if (loading) {
    return (
      <AppLayout>
        <TopBar title="통합 대시보드" />
        <div className="flex items-center justify-center py-20"><Spinner /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TopBar
        title="통합 대시보드"
        right={<span className="text-sm text-text-sub">{dateStr} · 오전 5시~10시 기상 신호 기준</span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="전체 관리 대상자" value={stats?.totalSeniors ?? 0} sub="활성 관리 중" />
        <StatCard label="확인요망" value={stats?.alertCount ?? 0} sub="기상 신호 미수신 · 클릭하여 리스트 확인" valueColor="red" href={ROUTES.ALERT_LIST} />
        <StatCard label="오늘 확인완료" value={stats?.confirmedTodayCount ?? 0} sub="확인요망 → 확인완료 처리 건수" valueColor="blue" />
        <StatCard label="응급 호출" value={0} sub="금일 발생 건수" />
      </div>

      <SectionCard
        title="확인요망 대상자 (최근)"
        titleIcon={
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        }
        actions={<Link href={ROUTES.ALERT_LIST}><Button variant="outline" size="sm">전체 보기 →</Button></Link>}
      >
        <DataTable columns={columns} rows={alertRows} rowKey={(r) => String(r.id)} onRowClick={() => setDetailOpen(true)} />
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
        onSuccess={() => setConfirmOpen(false)}
      />
    </AppLayout>
  );
}
