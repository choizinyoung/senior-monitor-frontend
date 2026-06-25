import { apiClient } from "@/lib/apiClient";
import type { ApiResponse, SeniorDetail, ContactHistory, ApiSenior } from "@/types";

export interface AlertListParams {
  severity?: string;
  gu?: string;
  dong?: string;
}

export interface ConfirmDto {
  managerName: string;
  resultStatus: string;
  memo: string;
  contactedAt: string;
}

export const alertService = {
  list: (params: AlertListParams = {}) => {
    const query = new URLSearchParams();
    if (params.severity) query.set("severity", params.severity);
    if (params.gu) query.set("gu", params.gu);
    if (params.dong) query.set("dong", params.dong);

    const qs = query.toString();
    return apiClient
      .get<ApiResponse<unknown>>(`/api/alerts${qs ? `?${qs}` : ""}`)
      .then((res) => res.data);
  },

  getDetail: async (seniorId: number): Promise<SeniorDetail> => {
    const [seniorRes, contactsRes] = await Promise.all([
      apiClient.get<ApiResponse<ApiSenior>>(`/api/seniors/${seniorId}`),
      apiClient.get<ApiResponse<ContactHistory[]>>(`/api/seniors/${seniorId}/contacts`),
    ]);

    const s = seniorRes.data;
    return {
      id: s.id,
      name: s.name,
      age: s.age,
      phone: s.phone,
      city: s.city,
      gu: s.gu,
      dong: s.dong,
      status: s.status,
      registeredAt: s.registeredAt,
      contacts: contactsRes.data ?? [],
    };
  },

  confirm: (seniorId: number, dto: ConfirmDto) =>
    apiClient
      .post<ApiResponse<ApiSenior>>(`/api/alerts/${seniorId}/confirm`, dto)
      .then((res) => res.data),
};
