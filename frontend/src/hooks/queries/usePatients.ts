import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '@/api/patients';
import type { PatientCreateRequest, Allergy, VitalSign, MedicalHistory } from '@/types/patient';

export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: number) => [...patientKeys.details(), id] as const,
};

export function usePatients(params: { search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientApi.getPatients(params),
  });
}

export function usePatient(id: number) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientApi.getPatient(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatientCreateRequest) => patientApi.createPatient(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PatientCreateRequest> }) =>
      patientApi.updatePatient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patientApi.deletePatient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
  });
}

export function useAddAllergy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: number; data: Allergy }) =>
      patientApi.addAllergy(patientId, data),
    onSuccess: (_, { patientId }) =>
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) }),
  });
}

export function useAddVitals() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: number; data: VitalSign }) =>
      patientApi.addVitals(patientId, data),
    onSuccess: (_, { patientId }) =>
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) }),
  });
}

export function useAddMedicalHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: number; data: MedicalHistory }) =>
      patientApi.addMedicalHistory(patientId, data),
    onSuccess: (_, { patientId }) =>
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) }),
  });
}
