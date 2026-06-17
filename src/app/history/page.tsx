"use client";

import { AppLayout } from "@/components/templates";
import { TopBar } from "@/components/organisms";
import { SectionCard } from "@/components/molecules";
import { Button, Input, Select } from "@/components/atoms";
import { DISTRICT_OPTIONS } from "@/constants";

export default function HistoryPage() {
  return (
    <AppLayout>
      <TopBar
        title={
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="12" y2="18" /></svg>
            처리 내역 조회
          </>
        }
      />

      <SectionCard
        title="처리 내역 조회"
        subTitle="날짜별, 대상자명, 확인요망 횟수, 관할구역별 조회"
      >
        {/* 필터 패널 — 모바일 1열 → sm 2열 → lg 5열 */}
        <div className="px-4 sm:px-6 py-5 border-b border-border bg-[#FAFBFF]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3.5">
            {[
              { label: "조회 시작일", el: <Input type="date" defaultValue="2026-06-01" /> },
              { label: "조회 종료일", el: <Input type="date" defaultValue="2026-06-11" /> },
              { label: "대상자명", el: <Input type="text" placeholder="이름 입력" /> },
              {
                label: "관할구역",
                el: (
                  <Select>
                    {DISTRICT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </Select>
                ),
              },
              {
                label: "확인요망 횟수",
                el: (
                  <Select>
                    {["전체", "3회 이상", "5회 이상", "10회 이상"].map((o) => <option key={o}>{o}</option>)}
                  </Select>
                ),
              },
            ].map(({ label, el }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-text-sub mb-1.5">{label}</p>
                {el}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button>조회</Button>
          </div>
        </div>

        {/* Empty state */}
        <div className="text-center py-16 text-text-sub">
          <div className="w-17 h-17 rounded-[18px] bg-primary-light flex items-center justify-center mx-auto mb-5 text-primary">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
          </div>
          <h3 className="text-base font-bold text-text-main mb-2">조회 조건을 선택하고 &apos;조회&apos; 버튼을 클릭해주세요</h3>
          <p className="text-sm mb-5 max-w-md mx-auto">날짜, 대상자명, 관할구역, 확인요망 횟수 등의 조건으로 처리 내역을 조회할 수 있습니다.</p>
          <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-warning-light text-warning">데모 버전 — 실제 조회 기능 미구현</span>
        </div>
      </SectionCard>
    </AppLayout>
  );
}
