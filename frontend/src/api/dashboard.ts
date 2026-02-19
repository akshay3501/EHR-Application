import api from './axios-instance';

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingLabOrders: number;
  totalUsers: number;
}

export const dashboardApi = {
  getStats: () =>
    api.get<DashboardStats>('/v1/dashboard/stats').then((r) => r.data),
};
