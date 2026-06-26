"use client";

import { useState, useEffect } from "react";
import { Modal, Button, StatusBadge, Spinner } from "@/components/atoms";
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

const RESULT_STATUS_BADGE: Record<string, "danger" | "success" | "warning" | "info"> = {
  "확인완료":    "success",
  "확인요망유지": "warning",
  "응급호출":    "danger",
  "확인요망":    "danger",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function SeniorDetailModal({ isOpen, onClose, senior, onConfirm, onEmergency }: SeniorDetailModalProps) {
  const [activeContact, setActiveContact] = useState<ContactHistory | null>(null);

  const sortedContacts = senior?.contacts
    ? [...senior.contacts].sort(
        (a, b) => new Date(b.contactedAt).getTime() - new Date(a.contactedAt).getTime()
      )
    : [];

  useEffect(() => {
    if (sortedContacts.length) {
      setActiveContact(sortedContacts[0]);
    } else {
      setActiveContact(null);
    }
  }, [senior]);

  if (!isOpen) return null;

  if (!senior) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="대상자 상세">
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      </Modal>
    );
  }

  const locationLabel = [senior.city, senior.gu, senior.dong].filter(Boolean).join(" ");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          대상자 상세 — {senior.name}
        </>
      }
      footer={
        <>
          <Button variant="danger" size="sm" onClick={onEmergency}>응급 호출</Button>
          <Button size="sm" onClick={onConfirm}>확인 처리</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: "상태", value: <StatusBadge status={STATUS_BADGE_MAP[senior.status]} label={senior.status} /> },
          { label: "나이", value: `${senior.age}세` },
          { label: "연락처", value: senior.phone },
          { label: "관할지역", value: locationLabel },
          { label: "등록일", value: formatDateTime(senior.registeredAt) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-text-sub mb-1">{label}</p>
            <p className="text-[15px] font-semibold text-text-main flex items-center">{value}</p>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-bold text-text-main mb-3">최근 연락 이력</h4>

      {sortedContacts.length === 0 ? (
        <p className="text-sm text-text-sub text-center py-6">연락 이력이 없습니다.</p>
      ) : (
        <div className="flex flex-col sm:grid sm:gap-4" style={{ gridTemplateColumns: "190px 1fr" }}>
          <ul className="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 mb-3 sm:mb-0">
            {sortedContacts.map((c) => (
              <li
                key={c.id}
                onClick={() => setActiveContact(c)}
                className={`flex-shrink-0 flex flex-col gap-0.5 px-3 py-2.5 rounded-[10px] cursor-pointer border-[1.5px] transition-all duration-150 ${
                  activeContact?.id === c.id
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

          {activeContact && (
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
          )}
        </div>
      )}
    </Modal>
  );
}
