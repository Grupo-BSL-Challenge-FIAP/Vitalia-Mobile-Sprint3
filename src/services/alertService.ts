import { api } from "../api/api";

export interface AlertResponse {
  id: number;
  alertType?: string | null;
  message?: string | null;
  severity?: "LOW" | "MEDIUM" | "HIGH" | null;
  status?: string | null;
  createdAt?: string | null;
  resolvedAt?: string | null;
  petId?: number | null;
}

interface AlertPageResponse {
  content: AlertResponse[];
}

export const alertService = {
  getByPetId: async (petId: number): Promise<AlertResponse[]> => {
    const response = await api.get<
      AlertResponse[] | AlertPageResponse
    >(`/alerts/pet/${petId}`);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response.data.content ?? [];
  },
};