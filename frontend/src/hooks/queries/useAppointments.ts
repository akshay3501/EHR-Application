import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointments';
import type { AppointmentCreateRequest } from '@/types/appointment';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...appointmentKeys.lists(), params] as const,
  slots: (doctorId: number, start: string, end: string) =>
    [...appointmentKeys.all, 'slots', doctorId, start, end] as const,
  availability: (doctorId: number) => [...appointmentKeys.all, 'availability', doctorId] as const,
};

export function useAppointments(params: {
  doctorId?: number;
  patientId?: number;
  status?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => appointmentApi.getAppointments(params),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentCreateRequest) => appointmentApi.createAppointment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() }),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointmentApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() }),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      appointmentApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() }),
  });
}

export function useAvailableSlots(doctorId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: appointmentKeys.slots(doctorId, startDate, endDate),
    queryFn: () => appointmentApi.getAvailableSlots(doctorId, startDate, endDate),
    enabled: !!doctorId && !!startDate && !!endDate,
  });
}

export function useDoctorAvailability(doctorId: number) {
  return useQuery({
    queryKey: appointmentKeys.availability(doctorId),
    queryFn: () => appointmentApi.getDoctorAvailability(doctorId),
    enabled: !!doctorId,
  });
}
