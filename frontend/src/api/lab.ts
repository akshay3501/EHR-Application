import api from './axios-instance';
import type { LabOrder, LabOrderCreateRequest, LabTestCatalog, LabOrderItem, LabResult, LabResultRequest } from '@/types/lab';
import type { PagedResponse } from '@/types/common';

export const labApi = {
  getLabOrders: (params: { patientId?: number; doctorId?: number; status?: string; page?: number; size?: number }) =>
    api.get<PagedResponse<LabOrder>>('/v1/lab-orders', { params }).then((r) => r.data),

  getLabOrder: (id: number) =>
    api.get<LabOrder>(`/v1/lab-orders/${id}`).then((r) => r.data),

  createLabOrder: (data: LabOrderCreateRequest) =>
    api.post<LabOrder>('/v1/lab-orders', data).then((r) => r.data),

  cancelLabOrder: (id: number) =>
    api.patch<LabOrder>(`/v1/lab-orders/${id}/cancel`).then((r) => r.data),

  collectSample: (orderId: number, itemId: number) =>
    api.patch<LabOrderItem>(`/v1/lab-orders/${orderId}/items/${itemId}/collect-sample`).then((r) => r.data),

  enterResult: (orderId: number, itemId: number, data: LabResultRequest) =>
    api.post<LabResult>(`/v1/lab-orders/${orderId}/items/${itemId}/result`, data).then((r) => r.data),

  verifyResult: (orderId: number, itemId: number) =>
    api.patch<LabResult>(`/v1/lab-orders/${orderId}/items/${itemId}/result/verify`).then((r) => r.data),

  getLabReport: (id: number) =>
    api.get<LabOrder>(`/v1/lab-orders/${id}/report`).then((r) => r.data),

  getLabTests: () =>
    api.get<LabTestCatalog[]>('/v1/lab-tests').then((r) => r.data),
};
