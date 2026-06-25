"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Label, Input } from "@/components/atoms";
import { RegionSelector } from "@/components/molecules";

export interface SeniorForm {
  name: string;
  age: string;
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

const EMPTY: SeniorForm = { name: "", age: "", phone: "", city: "", gu: "", dong: "" };

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function RegisterSeniorModal({
  isOpen, onClose, onSave, initialData, mode = "register",
}: RegisterSeniorModalProps) {
  const [form, setForm] = useState<SeniorForm>({ ...EMPTY, ...initialData });

  useEffect(() => {
    if (isOpen) {
      setForm({ ...EMPTY, ...initialData });
    }
  }, [isOpen, initialData]);

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <Label required>이름</Label>
            <Input placeholder="홍길동" value={form.name} onChange={setField("name")} />
          </div>
          <div>
            <Label required>나이</Label>
            <Input type="number" min={0} max={120} placeholder="78" value={form.age} onChange={setField("age")} />
          </div>
          <div>
            <Label required>연락처</Label>
            <Input
              type="tel"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
            />
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
