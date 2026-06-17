"use client";

import { useState } from "react";
import { Modal, Button, SeverityBadge } from "@/components/atoms";
import { SeniorDetail, ContactHistory } from "@/types";

interface SeniorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorDetail | null;
  onConfirm?: () => void;
  onEmergency?: () => void;
}

const MOCK_DETAIL: SeniorDetail = {
  id: "1", name: "김영희", age: 78, phone: "010-1234-5678",
  address: "서울 종로구 삼청동 12-3", severity: "high",
  registeredAt: "2024.03.15", status: "danger",
  lastWakeSignal: "2026.06.10 07:23 (어제)",
  communityCenter: "삼청동 주민센터",
  contacts: [
    { id: "1", date: "2026.06.10", type: "전화 통화", memo: "오전 10시 30분 전화 연결됨.\n\"어제 저녁에 잠을 못 잤다\"고 하심.\n식사는 하셨으나 약간 기운이 없다고 함.", note: "수면 패턴 불규칙 — 지속 관찰 필요" },
    { id: "2", date: "2026.06.07", type: "방문 확인" },
    { id: "3", date: "2026.06.03", type: "전화 통화" },
    { id: "4", date: "2026.05.28", type: "안부 전화" },
  ],
};

export default function SeniorDetailModal({ isOpen, onClose, senior, onConfirm, onEmergency }: SeniorDetailModalProps) {
  const data = senior ?? MOCK_DETAIL;
  const [activeContact, setActiveContact] = useState<ContactHistory>(data.contacts[0]);
  const severityLabel: Record<string, string> = { high: "고위험", mid: "중간위험", low: "저위험" };

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
      {/* 정보 그리드 — 모바일 1열, sm 이상 2열 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: "관리 중요도", value: <><SeverityBadge level={data.severity} className="mr-1.5" />{severityLabel[data.severity]}</> },
          { label: "마지막 기상 신호", value: <span className="text-danger">{data.lastWakeSignal}</span> },
          { label: "연락처", value: data.phone },
          { label: "주소", value: data.address },
          { label: "담당 주민센터", value: data.communityCenter },
          { label: "등록일", value: data.registeredAt },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-text-sub mb-1">{label}</p>
            <p className="text-[15px] font-semibold text-text-main flex items-center">{value}</p>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-bold text-text-main mb-3">최근 연락 이력</h4>

      {/* 연락 이력 — 모바일 세로, sm 이상 가로 2열 */}
      <div className="flex flex-col sm:grid sm:gap-4" style={{ gridTemplateColumns: "190px 1fr" }}>
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
              <span className="text-sm font-bold text-text-main whitespace-nowrap">{c.date}</span>
              <span className="text-xs text-text-sub whitespace-nowrap">{c.type}</span>
            </li>
          ))}
        </ul>
        <div className="bg-bg-main border-[1.5px] border-border rounded-xl p-4 text-sm text-text-main leading-relaxed whitespace-pre-line">
          {activeContact.memo ? (
            <>
              <strong className="block mb-2">{activeContact.date} 대화 메모</strong>
              {activeContact.memo}
              {activeContact.note && (
                <p className="mt-2.5 text-danger font-semibold">특이사항: {activeContact.note}</p>
              )}
            </>
          ) : (
            <p className="text-text-sub text-center py-6">메모가 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
