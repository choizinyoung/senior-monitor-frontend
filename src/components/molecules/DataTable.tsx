"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** 모바일 카드의 헤더 영역으로 사용 (이름 등 식별자 컬럼) */
  isTitle?: boolean;
  /** 모바일 카드 하단 액션 영역으로 사용 (버튼 컬럼) */
  isAction?: boolean;
  /** 모바일에서 숨김 */
  hideOnMobile?: boolean;
  thClassName?: string;
  tdClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = "데이터가 없습니다.",
}: DataTableProps<T>) {
  const titleCol = columns.find((c) => c.isTitle);
  const actionCols = columns.filter((c) => c.isAction);
  const bodyCols = columns.filter((c) => !c.isTitle && !c.isAction && !c.hideOnMobile);

  if (rows.length === 0) {
    return (
      <div className="py-14 text-center text-sm text-text-sub">{emptyMessage}</div>
    );
  }

  return (
    <>
      {/* ── 데스크톱 테이블 (md 이상) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAFBFF] border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-sub",
                    col.thClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-[#F5F6FC] hover:bg-[#FAFBFF] transition-colors last:border-0",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-5 py-3.5 text-sm text-text-main align-middle", col.tdClassName)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 모바일 카드 목록 (md 미만) ── */}
      <div className="md:hidden flex flex-col gap-2.5 p-4">
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              "bg-white rounded-2xl border-[1.5px] border-border overflow-hidden shadow-sm",
              onRowClick && "cursor-pointer hover:shadow-md hover:border-[#C7CBF9] transition-all duration-150"
            )}
          >
            {/* 카드 헤더 (식별자 컬럼) */}
            {titleCol && (
              <div className="bg-primary-light px-4 py-3 border-b border-border">
                <span className="text-[15px] font-bold text-primary">{titleCol.cell(row)}</span>
              </div>
            )}

            {/* 일반 컬럼 rows */}
            {bodyCols.map((col) => (
              <div
                key={col.key}
                className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#F5F6FC] last:border-b-0"
              >
                <span className="text-[11px] font-bold text-text-sub uppercase tracking-wide min-w-[60px] flex-shrink-0">
                  {col.header}
                </span>
                <span className="text-sm text-text-main">{col.cell(row)}</span>
              </div>
            ))}

            {/* 액션 컬럼 */}
            {actionCols.length > 0 && (
              <div
                className="flex items-center justify-end gap-2 px-4 py-2.5 bg-[#FAFBFF] border-t border-border"
                onClick={(e) => e.stopPropagation()}
              >
                {actionCols.map((col) => (
                  <span key={col.key}>{col.cell(row)}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
