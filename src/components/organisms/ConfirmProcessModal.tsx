"use client";

import { useState } from "react";
import { Modal, Button, Label, Input, Select, Textarea } from "@/components/atoms";
import { PROCESS_STATUS_OPTIONS } from "@/constants";

interface ConfirmProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorName?: string;
  onSave?: (data: ConfirmData) => void;
}

interface ConfirmData {
  date: string;
  time: string;
  processStatus: string;
  memo: string;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function nowTimeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ConfirmProcessModal({
  isOpen,
  onClose,
  seniorName = "김영희",
  onSave,
}: ConfirmProcessModalProps) {
  const [form, setForm] = useState<ConfirmData>({
    date: todayStr(),
    time: nowTimeStr(),
    processStatus: PROCESS_STATUS_OPTIONS[0],
    memo: "",
  });

  const set = (key: keyof ConfirmData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={() => { onSave?.(form); onClose(); }}>저장 (DB 기록)</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label>확인 날짜</Label>
          <Input type="date" value={form.date} onChange={set("date")} />
        </div>
        <div>
          <Label>확인 시간</Label>
          <Input type="time" value={form.time} onChange={set("time")} />
        </div>
        <div className="sm:col-span-2">
          <Label>처리 상태</Label>
          <Select value={form.processStatus} onChange={set("processStatus")}>
            {PROCESS_STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
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
      </div>
    </Modal>
  );
}
