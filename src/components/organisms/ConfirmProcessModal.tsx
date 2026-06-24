"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Label, Input, Select, Textarea } from "@/components/atoms";
import { alertService } from "@/services";
import { PROCESS_STATUS_OPTIONS } from "@/constants";
import type { ResultStatusType } from "@/types";

interface ConfirmProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorId?: number;
  seniorName?: string;
  onSuccess?: () => void;
}

interface FormData {
  managerName: string;
  date: string;
  time: string;
  resultStatus: ResultStatusType | "";
  memo: string;
}

const EMPTY: FormData = { managerName: "", date: "", time: "", resultStatus: "", memo: "" };

const ERROR_MESSAGES: Record<string, string> = {
  ERR_INVALID_STATUS: "이미 정상 상태인 대상자입니다.",
  ERR_INVALID_VALUE:  "잘못된 처리 상태 값입니다.",
  ERR_NOT_FOUND:      "대상자를 찾을 수 없습니다.",
};

export default function ConfirmProcessModal({
  isOpen, onClose, seniorId, seniorName = "대상자", onSuccess,
}: ConfirmProcessModalProps) {
  const [form, setForm]       = useState<FormData>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const now = new Date();
    setForm({
      managerName: "",
      date: now.toISOString().split("T")[0],
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      resultStatus: "",
      memo: "",
    });
    setError(null);
  }, [isOpen]);

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const canSave = form.managerName.trim() && form.resultStatus && form.date && form.time;

  const handleSave = async () => {
    if (!canSave) return;
    setIsLoading(true);
    setError(null);
    try {
      await alertService.confirm(seniorId ?? 0, {
        managerName:  form.managerName.trim(),
        resultStatus: form.resultStatus as ResultStatusType,
        memo:         form.memo,
        contactedAt:  `${form.date}T${form.time}:00`,
      });
      onSuccess?.();
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      const code = Object.keys(ERROR_MESSAGES).find((k) => msg.includes(k));
      setError(code ? ERROR_MESSAGES[code] : "저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          확인 처리 — {seniorName}
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>취소</Button>
          <Button onClick={handleSave} disabled={!canSave || isLoading}>
            {isLoading ? "저장 중…" : "저장 (DB 기록)"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <Label required>처리 담당자</Label>
          <Input placeholder="담당자 이름 입력" value={form.managerName} onChange={set("managerName")} />
        </div>
        <div>
          <Label required>확인 날짜</Label>
          <Input type="date" value={form.date} onChange={set("date")} />
        </div>
        <div>
          <Label required>확인 시간</Label>
          <Input type="time" value={form.time} onChange={set("time")} />
        </div>
        <div className="sm:col-span-2">
          <Label required>처리 상태</Label>
          <Select value={form.resultStatus} onChange={set("resultStatus")}>
            <option value="" disabled>상태를 선택해주세요</option>
            {PROCESS_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>확인 내용 (대화 메모)</Label>
          <Textarea
            value={form.memo}
            onChange={set("memo")}
            placeholder={"전화 통화 결과 및 특이사항을 기록해주세요...\n\n예) 오전 9시 45분 전화 연결됨. 건강 상태 양호하다고 하심."}
          />
        </div>
        {error && (
          <p className="sm:col-span-2 text-sm text-danger font-medium">{error}</p>
        )}
      </div>
    </Modal>
  );
}
