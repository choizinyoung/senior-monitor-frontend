import { apiClient } from "@/lib/apiClient";
import type { ApiSenior, ApiResponse, ResultStatusType } from "@/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export interface AlertListParams {
  page?: number;
  size?: number;
  severity?: string;
  district?: string;
}

export interface ConfirmDto {
  managerName: string;
  resultStatus: ResultStatusType;
  memo: string;
  contactedAt: string; // ISO 8601: "2026-06-23T14:30:00"
}

export const alertService = {
  confirm: (seniorId: number, dto: ConfirmDto): Promise<ApiSenior | null> => {
    if (USE_MOCK) return Promise.resolve(null);
    return apiClient
      .post<ApiResponse<ApiSenior>>(`/api/alerts/${seniorId}/confirm`, dto)
      .then((res) => res.data);
  },
};
