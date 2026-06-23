"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { seniorService } from "@/services";
import type { ApiSenior } from "@/types";
import type { CreateSeniorDto, UpdateSeniorDto } from "@/services";

const PAGE_SIZE = 10;

export interface SeniorFilter {
  name?: string;
  status?: string;
  city?: string;
  gu?: string;
  dong?: string;
}

export function useSeniors() {
  const [allSeniors, setAllSeniors] = useState<ApiSenior[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<SeniorFilter>({});
  const [page, setPage] = useState(0);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await seniorService.list();
      setAllSeniors(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    return allSeniors.filter((s) => {
      if (filter.name   && !s.name.includes(filter.name)) return false;
      if (filter.status && s.status !== filter.status) return false;
      if (filter.city   && s.city !== filter.city) return false;
      if (filter.gu     && s.gu   !== filter.gu)   return false;
      if (filter.dong   && s.dong !== filter.dong) return false;
      return true;
    });
  }, [allSeniors, filter]);

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

  const update = async (id: number, dto: UpdateSeniorDto) => {
    const updated = await seniorService.update(id, dto);
    await fetchAll();
    return updated;
  };

  const remove = async (id: number) => {
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
