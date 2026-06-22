import { apiClient } from "@/lib/apiClient";
import type { AlertTarget, ConfirmForm } from "@/types";

export interface AlertListParams {
  page?: number;
  size?: number;
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

export const alertService = {
  list: (params: AlertListParams = {}) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.severity) query.set("severity", params.severity);
    if (params.district) query.set("district", params.district);

    const qs = query.toString();
    return apiClient.get<PagedResponse<AlertTarget>>(`/api/alerts${qs ? `?${qs}` : ""}`);
  },

  get: (id: string) =>
    apiClient.get<AlertTarget>(`/api/alerts/${id}`),

  confirm: (id: string, form: ConfirmForm) =>
    apiClient.post<void>(`/api/alerts/${id}/confirm`, form),
};
