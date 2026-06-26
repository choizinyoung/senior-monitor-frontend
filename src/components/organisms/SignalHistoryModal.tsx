"use client";

import { useState, useEffect } from "react";
import { Modal, Spinner } from "@/components/atoms";
import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import { cn } from "@/utils/cn";

interface SignalEntry {
  id: number;
  receivedAt: string;
  signalDate: string;
}

interface SignalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorId: number | null;
  seniorName: string;
}

type DateMode = "today" | "week";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function weekAgoStr() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().split("T")[0];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

async function fetchSignalHistory(seniorId: number, mode: DateMode): Promise<SignalEntry[]> {
  const today = todayStr();
  const from = mode === "today" ? today : weekAgoStr();
  const res = await apiClient.get<ApiResponse<SignalEntry[]>>(
    `/seniors/${seniorId}/signals?from=${from}&to=${today}`
  );
  return (res.data ?? []).sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
}

export default function SignalHistoryModal({
  isOpen,
  onClose,
  seniorId,
  seniorName,
}: SignalHistoryModalProps) {
  const [signals, setSignals] = useState<SignalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("today");

  useEffect(() => {
    if (!isOpen || !seniorId) return;
    const id = seniorId;
    Promise.resolve()
      .then(() => { setDateMode("today"); setLoading(true); })
      .then(() => fetchSignalHistory(id, "today"))
      .then((data) => { setSignals(data); setLoading(false); })
      .catch(() => { setDateMode("today"); setSignals([]); setLoading(false); });
  }, [isOpen, seniorId]);

  const handleModeChange = (mode: DateMode) => {
    if (!seniorId) return;
    setDateMode(mode);
    setLoading(true);
    fetchSignalHistory(seniorId, mode)
      .then((data) => { setSignals(data); setLoading(false); })
      .catch(() => { setSignals([]); setLoading(false); });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          신호 수신 이력 — {seniorName}
        </>
      }
    >
      {/* 날짜 모드 버튼 */}
      <div className="flex gap-2 mb-4">
        {(["today", "week"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border-[1.5px]",
              dateMode === mode
                ? "bg-primary text-white border-primary"
                : "bg-bg-main text-text-sub border-border hover:bg-primary-light hover:text-primary hover:border-primary"
            )}
          >
            {mode === "today" ? "오늘" : "최근 7일"}
          </button>
        ))}
        <span className="ml-auto text-xs text-text-sub self-center">
          {!loading && `${signals.length}건`}
        </span>
      </div>

      {/* 내용 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center py-12 text-text-sub">
          <svg className="mx-auto mb-3 opacity-30" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <p className="text-sm">수신된 신호가 없습니다.</p>
        </div>
      ) : (
        <div className="max-h-[380px] overflow-y-auto -mx-1 px-1 space-y-1">
          {signals.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-bg-main border-[1.5px] border-transparent hover:border-border transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-success-light flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-success block" />
                </span>
                {dateMode === "week" && (
                  <span className="text-xs text-text-sub font-medium w-[72px]">
                    {formatDate(s.signalDate)}
                  </span>
                )}
                <span className="text-sm font-semibold text-text-main tabular-nums">
                  {formatTime(s.receivedAt)}
                </span>
              </div>
              <span className="text-[11px] text-text-sub">#{signals.length - i}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
