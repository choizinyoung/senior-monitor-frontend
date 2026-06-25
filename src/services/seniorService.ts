import { apiClient } from "@/lib/apiClient";
import type { ApiSenior, ApiResponse } from "@/types";
import { MOCK_SENIORS } from "@/mocks/seniors";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export interface CreateSeniorDto {
  deviceId: string;
  name: string;
  age: number;
  phone: string;
  city: string;
  gu: string;
  dong: string;
}

export interface UpdateSeniorDto {
  name?: string;
  age?: number;
  phone?: string;
  city?: string;
  gu?: string;
  dong?: string;
}

let mockStore: ApiSenior[] = [...MOCK_SENIORS];

export const seniorService = {
  list: () =>
    USE_MOCK
      ? Promise.resolve([...mockStore])
      : apiClient
          .get<ApiResponse<ApiSenior[]>>("/seniors")
          .then((res) => res.data),

  get: (id: number): Promise<ApiSenior> =>
    USE_MOCK
      ? Promise.resolve(mockStore.find((s) => s.id === id)!)
      : apiClient
          .get<ApiResponse<ApiSenior>>(`/seniors/${id}`)
          .then((res) => res.data),

  create: (dto: CreateSeniorDto) => {
    if (USE_MOCK) {
      const now = new Date().toISOString();
      const created: ApiSenior = {
        ...dto,
        id: Date.now(),
        status: "정상",
        isDeleted: "N",
        registeredAt: now,
        updatedAt: now,
      };
      mockStore = [created, ...mockStore];
      return Promise.resolve(created);
    }
    return apiClient
      .post<ApiResponse<ApiSenior>>("/seniors", dto)
      .then((res) => res.data);
  },

  update: (id: number, dto: UpdateSeniorDto) => {
    if (USE_MOCK) {
      mockStore = mockStore.map((s) =>
        s.id === id ? { ...s, ...dto, updatedAt: new Date().toISOString() } : s
      );
      return Promise.resolve(mockStore.find((s) => s.id === id)!);
    }
    return apiClient
      .post<ApiResponse<ApiSenior>>(`/seniors/${id}/update`, dto)
      .then((res) => res.data);
  },

  delete: (id: number) => {
    if (USE_MOCK) {
      mockStore = mockStore.filter((s) => s.id !== id);
      return Promise.resolve(undefined as void);
    }
    return apiClient.delete<void>(`/seniors/${id}`);
  },
};
