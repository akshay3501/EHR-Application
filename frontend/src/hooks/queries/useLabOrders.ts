import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labApi } from '@/api/lab';
import type { LabOrderCreateRequest, LabResultRequest } from '@/types/lab';

export const labKeys = {
  all: ['lab-orders'] as const,
  lists: () => [...labKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...labKeys.lists(), params] as const,
  detail: (id: number) => [...labKeys.all, 'detail', id] as const,
  tests: ['lab-tests'] as const,
};

export function useLabOrders(params: {
  patientId?: number;
  doctorId?: number;
  status?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: labKeys.list(params),
    queryFn: () => labApi.getLabOrders(params),
  });
}

export function useLabOrder(id: number) {
  return useQuery({
    queryKey: labKeys.detail(id),
    queryFn: () => labApi.getLabOrder(id),
    enabled: !!id,
  });
}

export function useLabTests() {
  return useQuery({
    queryKey: labKeys.tests,
    queryFn: () => labApi.getLabTests(),
  });
}

export function useCreateLabOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LabOrderCreateRequest) => labApi.createLabOrder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: labKeys.lists() }),
  });
}

export function useCancelLabOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => labApi.cancelLabOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: labKeys.lists() }),
  });
}

export function useCollectSample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) =>
      labApi.collectSample(orderId, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: labKeys.all }),
  });
}

export function useEnterResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId, data }: { orderId: number; itemId: number; data: LabResultRequest }) =>
      labApi.enterResult(orderId, itemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: labKeys.all }),
  });
}

export function useVerifyResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) =>
      labApi.verifyResult(orderId, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: labKeys.all }),
  });
}
