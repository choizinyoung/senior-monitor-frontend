"use client";

import { useState } from "react";
import { Modal, Button, Label, Input, Select, Textarea } from "@/components/atoms";
import { SEVERITY_OPTIONS, WAKE_WINDOW_OPTIONS } from "@/constants";

interface RegisterSeniorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: SeniorForm) => void;
  initialData?: Partial<SeniorForm>;
  mode?: "register" | "edit";
}

interface SeniorForm {
  name: string;
  birthDate: string;
  phone: string;
  severity: string;
  address: string;
  communityCenter: string;
  wakeWindow: string;
  memo: string;
}

const EMPTY: SeniorForm = {
  name: "", birthDate: "", phone: "", severity: "",
  address: "", communityCenter: "", wakeWindow: WAKE_WINDOW_OPTIONS[0], memo: "",
};

export default function RegisterSeniorModal({
  isOpen, onClose, onSave, initialData, mode = "register",
}: RegisterSeniorModalProps) {
  const [form, setForm] = useState<SeniorForm>({ ...EMPTY, ...initialData });

  const set = (key: keyof SeniorForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "register" ? "대상자 신규 등록" : `대상자 수정 — ${form.name}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={() => { onSave?.(form); onClose(); }}>
            {mode === "register" ? "등록" : "저장"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label required>이름</Label>
          <Input placeholder="홍길동" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <Label required>생년월일</Label>
          <Input type="date" value={form.birthDate} onChange={set("birthDate")} />
        </div>
        <div>
          <Label required>연락처</Label>
          <Input type="tel" placeholder="010-0000-0000" value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <Label required>중증도</Label>
          <Select value={form.severity} onChange={set("severity")}>
            <option value="">선택</option>
            {["상", "중", "하"].map((o) => <option key={o}>{o}</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label required>주소</Label>
          <Input placeholder="서울특별시 종로구 ..." value={form.address} onChange={set("address")} />
        </div>
        <div>
          <Label>담당 주민센터</Label>
          <Input placeholder="삼청동 주민센터" value={form.communityCenter} onChange={set("communityCenter")} />
        </div>
        <div>
          <Label>기상 확인 시간대</Label>
          <Select value={form.wakeWindow} onChange={set("wakeWindow")}>
            {WAKE_WINDOW_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>메모</Label>
          <Textarea
            placeholder="대상자에 대한 특이사항을 기록해주세요..."
            value={form.memo}
            onChange={set("memo")}
          />
        </div>
      </div>
    </Modal>
  );
}
