"use client";

import { useState } from "react";
import { Modal, Button, Label, Input } from "@/components/atoms";
import { RegionSelector } from "@/components/molecules";

export interface SeniorForm {
  name: string;
  phone: string;
  city: string;
  gu: string;
  dong: string;
}

interface RegisterSeniorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: SeniorForm) => void;
  initialData?: Partial<SeniorForm>;
  mode?: "register" | "edit";
}

const EMPTY: SeniorForm = { name: "", phone: "", city: "", gu: "", dong: "" };

export default function RegisterSeniorModal({
  isOpen, onClose, onSave, initialData, mode = "register",
}: RegisterSeniorModalProps) {
  const [form, setForm] = useState<SeniorForm>({ ...EMPTY, ...initialData });

  const setField = (key: keyof SeniorForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
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
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <Label required>이름</Label>
            <Input placeholder="홍길동" value={form.name} onChange={setField("name")} />
          </div>
          <div>
            <Label required>연락처</Label>
            <Input type="tel" placeholder="010-0000-0000" value={form.phone} onChange={setField("phone")} />
          </div>
        </div>
        <div>
          <Label required>관할지역</Label>
          <RegionSelector
            city={form.city}
            gu={form.gu}
            dong={form.dong}
            onCityChange={(v) => setForm((prev) => ({ ...prev, city: v }))}
            onGuChange={(v) => setForm((prev) => ({ ...prev, gu: v }))}
            onDongChange={(v) => setForm((prev) => ({ ...prev, dong: v }))}
            showAll={false}
          />
        </div>
      </div>
    </Modal>
  );
}
