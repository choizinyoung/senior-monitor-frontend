import { apiClient } from "@/lib/apiClient";
import type { Senior } from "@/types";

export interface SeniorListParams {
  page?: number;
  size?: number;
  name?: string;
  severity?: string;
  district?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export type CreateSeniorDto = Omit<Senior, "id" | "registeredAt">;
export type UpdateSeniorDto = Partial<CreateSeniorDto>;

export const seniorService = {
  list: (params: SeniorListParams = {}) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.name) query.set("name", params.name);
    if (params.severity) query.set("severity", params.severity);
    if (params.district) query.set("district", params.district);

    const qs = query.toString();
    return apiClient.get<PagedResponse<Senior>>(`/api/seniors${qs ? `?${qs}` : ""}`);
  },

  get: (id: string) =>
    apiClient.get<Senior>(`/api/seniors/${id}`),

  create: (dto: CreateSeniorDto) =>
    apiClient.post<Senior>("/api/seniors", dto),

  update: (id: string, dto: UpdateSeniorDto) =>
    apiClient.put<Senior>(`/api/seniors/${id}`, dto),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/seniors/${id}`),
};
