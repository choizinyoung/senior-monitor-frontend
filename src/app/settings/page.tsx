import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";

const ADMIN_PERMISSIONS = [
  { ok: true, label: "통합 대시보드 전체 조회" },
  { ok: true, label: "대상자 등록 / 수정 / 삭제" },
  { ok: true, label: "확인요망 처리 및 메모 작성" },
  { ok: true, label: "처리 내역 조회" },
  { ok: true, label: "로그 시스템 열람" },
  { ok: true, label: "담당자 관리" },
  { ok: true, label: "시스템 설정 변경" },
];

const STAFF_PERMISSIONS = [
  { ok: true, label: "담당 구역 대시보드 조회" },
  { ok: true, label: "담당 대상자 확인 처리" },
  { ok: true, label: "메모 작성 및 열람" },
  { ok: false, label: "대상자 등록 / 삭제 (불가)" },
  { ok: false, label: "타 구역 조회 (불가)" },
  { ok: false, label: "시스템 설정 (불가)" },
  { ok: false, label: "로그 시스템 (불가)" },
];

function PermissionCard({
  title,
  icon,
  permissions,
}: {
  title: string;
  icon: React.ReactNode;
  permissions: { ok: boolean; label: string }[];
}) {
  return (
    <div className="bg-bg-card rounded-2xl border border-border shadow-[0_2px_10px_rgba(91,103,245,0.06)] p-6 sm:p-7">
      <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-5">
        {icon}
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {permissions.map(({ ok, label }) => (
          <li
            key={label}
            className={`flex items-center gap-2.5 text-sm ${ok ? "text-text-main" : "text-text-sub"}`}
          >
            <span className={`text-base font-bold ${ok ? "text-success" : "text-text-sub"}`}>
              {ok ? "✓" : "—"}
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            설정
          </>
        }
      />

      {/* 권한 카드 — 모바일 1열 → lg 2열 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PermissionCard
          title="관리자 권한"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          }
          permissions={ADMIN_PERMISSIONS}
        />
        <PermissionCard
          title="담당자 권한"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
            </svg>
          }
          permissions={STAFF_PERMISSIONS}
        />
      </div>
    </AppLayout>
  );
}
