"use client";

import { useState } from "react";
import { Modal, Button, StatusBadge } from "@/components/atoms";
import type { SeniorDetail, ContactHistory, SeniorStatusType } from "@/types";

interface SeniorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorDetail | null;
  onConfirm?: () => void;
  onEmergency?: () => void;
}

const STATUS_BADGE_MAP: Record<SeniorStatusType, "danger" | "success" | "warning" | "info"> = {
  "정상":      "success",
  "확인요망":   "danger",
  "확인완료":   "info",
  "확인요망유지": "warning",
  "응급호출":   "danger",
};

const MOCK_CONTACTS: ContactHistory[] = [
  { id: 1, seniorId: 1, managerName: "박담당", resultStatus: "확인완료",    memo: "오전 10시 30분 전화 연결됨.\n\"어제 저녁에 잠을 못 잤다\"고 하심.\n식사는 하셨으나 약간 기운이 없다고 함.", contactedAt: "2026-06-10T10:30:00", createdAt: "2026-06-10T10:31:00" },
  { id: 2, seniorId: 1, managerName: "이담당", resultStatus: "확인완료",    contactedAt: "2026-06-07T14:00:00", createdAt: "2026-06-07T14:01:00" },
  { id: 3, seniorId: 1, managerName: "박담당", resultStatus: "확인요망유지", contactedAt: "2026-06-03T09:15:00", createdAt: "2026-06-03T09:16:00" },
  { id: 4, seniorId: 1, managerName: "김담당", resultStatus: "확인완료",    contactedAt: "2026-05-28T11:00:00", createdAt: "2026-05-28T11:01:00" },
];

const MOCK_DETAIL: SeniorDetail = {
  id: 1, name: "김영희", age: 78, phone: "010-1234-5678",
  city: "서울", gu: "종로구", dong: "삼청동",
  status: "확인요망", registeredAt: "2024-03-15T09:00:00",
  contacts: MOCK_CONTACTS,
};

const RESULT_STATUS_BADGE: Record<string, "danger" | "success" | "warning" | "info"> = {
  "확인완료":    "success",
  "확인요망유지": "warning",
  "응급호출":    "danger",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function SeniorDetailModal({ isOpen, onClose, senior, onConfirm, onEmergency }: SeniorDetailModalProps) {
  const data = senior ?? MOCK_DETAIL;
  const [activeContact, setActiveContact] = useState<ContactHistory>(data.contacts[0]);

  const locationLabel = [data.city, data.gu, data.dong].filter(Boolean).join(" ");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          대상자 상세 — {data.name}
        </>
      }
      footer={
        <>
          <Button variant="danger" size="sm" onClick={onEmergency}>응급 호출</Button>
          <Button size="sm" onClick={onConfirm}>확인 처리</Button>
        </>
      }
    >
      {/* 기본 정보 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: "상태", value: <StatusBadge status={STATUS_BADGE_MAP[data.status]} label={data.status} /> },
          { label: "나이", value: `${data.age}세` },
          { label: "연락처", value: data.phone },
          { label: "관할지역", value: locationLabel },
          { label: "등록일", value: formatDateTime(data.registeredAt) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-text-sub mb-1">{label}</p>
            <p className="text-[15px] font-semibold text-text-main flex items-center">{value}</p>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-bold text-text-main mb-3">최근 연락 이력</h4>

      <div className="flex flex-col sm:grid sm:gap-4" style={{ gridTemplateColumns: "190px 1fr" }}>
        {/* 이력 탭 */}
        <ul className="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 mb-3 sm:mb-0">
          {data.contacts.map((c) => (
            <li
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={`flex-shrink-0 flex flex-col gap-0.5 px-3 py-2.5 rounded-[10px] cursor-pointer border-[1.5px] transition-all duration-150 ${
                activeContact.id === c.id
                  ? "bg-primary-light border-[#C7CBF9]"
                  : "border-transparent hover:bg-bg-main"
              }`}
            >
              <span className="text-sm font-bold text-text-main whitespace-nowrap">
                {formatDateTime(c.contactedAt).split(" ")[0]}
              </span>
              <span className="text-xs text-text-sub whitespace-nowrap">{c.managerName} 담당</span>
            </li>
          ))}
        </ul>

        {/* 이력 상세 */}
        <div className="bg-bg-main border-[1.5px] border-border rounded-xl p-4 text-sm text-text-main leading-relaxed whitespace-pre-line">
          <div className="flex items-center justify-between mb-3">
            <strong>{formatDateTime(activeContact.contactedAt)} 연락 처리</strong>
            <StatusBadge
              status={RESULT_STATUS_BADGE[activeContact.resultStatus] ?? "info"}
              label={activeContact.resultStatus}
            />
          </div>
          <p className="text-xs text-text-sub mb-1">담당자: {activeContact.managerName}</p>
          {activeContact.memo ? (
            <p className="mt-2">{activeContact.memo}</p>
          ) : (
            <p className="text-text-sub text-center py-4">메모가 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
