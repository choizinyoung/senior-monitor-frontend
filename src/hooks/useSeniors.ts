"use client";

import { useState, useEffect, useCallback } from "react";
import { seniorService } from "@/services";
import type { Senior } from "@/types";
import type { SeniorListParams, CreateSeniorDto, UpdateSeniorDto } from "@/services";

interface UseSeniorsOptions extends SeniorListParams {}

export function useSeniors(options: UseSeniorsOptions = {}) {
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await seniorService.list(options);
      setSeniors(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.page, options.size, options.name, options.severity, options.district]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (dto: CreateSeniorDto) => {
    const created = await seniorService.create(dto);
    await fetch();
    return created;
  };

  const update = async (id: string, dto: UpdateSeniorDto) => {
    const updated = await seniorService.update(id, dto);
    await fetch();
    return updated;
  };

  const remove = async (id: string) => {
    await seniorService.delete(id);
    await fetch();
  };

  return { seniors, totalElements, totalPages, isLoading, error, refetch: fetch, create, update, remove };
}
