"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { seniorService } from "@/services";
import type { Senior } from "@/types";
import type { CreateSeniorDto, UpdateSeniorDto } from "@/services";

const PAGE_SIZE = 10;

export interface SeniorFilter {
  name?: string;
  severity?: string;
  district?: string;
}

export function useSeniors() {
  const [allSeniors, setAllSeniors] = useState<Senior[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<SeniorFilter>({});
  const [page, setPage] = useState(0);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await seniorService.list();
      // 백엔드가 배열 대신 페이지 객체를 반환할 경우 대비
      const data = Array.isArray(raw) ? raw : (raw as { content?: typeof raw })?.content ?? [];
      setAllSeniors(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // "상"|"중"|"하" → "high"|"mid"|"low"
  const SEVERITY_MAP: Record<string, string> = { "상": "high", "중": "mid", "하": "low" };

  // 클라이언트 필터링
  const filtered = useMemo(() => {
    return allSeniors.filter((s) => {
      if (filter.name && !s.name.includes(filter.name)) return false;
      if (filter.severity && filter.severity !== "전체") {
        const mapped = SEVERITY_MAP[filter.severity] ?? filter.severity;
        if (s.severity !== mapped) return false;
      }
      if (filter.district && filter.district !== "전체" && !s.address.includes(filter.district)) return false;
      return true;
    });
  }, [allSeniors, filter]);

  // 클라이언트 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const seniors = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const applyFilter = (f: SeniorFilter) => {
    setFilter(f);
    setPage(0);
  };

  const create = async (dto: CreateSeniorDto) => {
    const created = await seniorService.create(dto);
    await fetchAll();
    return created;
  };

  const update = async (id: string, dto: UpdateSeniorDto) => {
    const updated = await seniorService.update(id, dto);
    await fetchAll();
    return updated;
  };

  const remove = async (id: string) => {
    await seniorService.delete(id);
    await fetchAll();
  };

  return {
    seniors,
    totalElements: filtered.length,
    totalPages,
    page,
    setPage,
    filter,
    applyFilter,
    isLoading,
    error,
    refetch: fetchAll,
    create,
    update,
    remove,
  };
}
