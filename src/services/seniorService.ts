import { apiClient } from "@/lib/apiClient";
import type { Senior } from "@/types";
import { MOCK_SENIORS } from "@/mocks/seniors";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export type CreateSeniorDto = Omit<Senior, "id" | "registeredAt">;
export type UpdateSeniorDto = Partial<CreateSeniorDto>;

let mockStore: Senior[] = [...MOCK_SENIORS];

export const seniorService = {
  list: () =>
    USE_MOCK
      ? Promise.resolve([...mockStore])
      : apiClient.get<Senior[]>("/api/seniors"),

  get: (id: string) =>
    USE_MOCK
      ? Promise.resolve(mockStore.find((s) => s.id === id)!)
      : apiClient.get<Senior>(`/api/seniors/${id}`),

  create: (dto: CreateSeniorDto) => {
    if (USE_MOCK) {
      const created: Senior = { ...dto, id: String(Date.now()), registeredAt: new Date().toISOString().split("T")[0] };
      mockStore = [created, ...mockStore];
      return Promise.resolve(created);
    }
    return apiClient.post<Senior>("/api/seniors", dto);
  },

  update: (id: string, dto: UpdateSeniorDto) => {
    if (USE_MOCK) {
      mockStore = mockStore.map((s) => s.id === id ? { ...s, ...dto } : s);
      return Promise.resolve(mockStore.find((s) => s.id === id)!);
    }
    return apiClient.put<Senior>(`/api/seniors/${id}`, dto);
  },

  delete: (id: string) => {
    if (USE_MOCK) {
      mockStore = mockStore.filter((s) => s.id !== id);
      return Promise.resolve(undefined as void);
    }
    return apiClient.delete<void>(`/api/seniors/${id}`);
  },
};
