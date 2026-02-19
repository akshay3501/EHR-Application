import api from './axios-instance';
import type { Appointment, AppointmentCreateRequest, DoctorAvailability, TimeSlot } from '@/types/appointment';
import type { PagedResponse } from '@/types/common';

export const appointmentApi = {
  getAppointments: (params: { doctorId?: number; patientId?: number; status?: string; page?: number; size?: number }) =>
    api.get<PagedResponse<Appointment>>('/v1/appointments', { params }).then((r) => r.data),

  createAppointment: (data: AppointmentCreateRequest) =>
    api.post<Appointment>('/v1/appointments', data).then((r) => r.data),

  reschedule: (id: number, data: { appointmentDate: string; startTime: string }) =>
    api.patch<Appointment>(`/v1/appointments/${id}/reschedule`, data).then((r) => r.data),

  cancel: (id: number) =>
    api.patch<Appointment>(`/v1/appointments/${id}/cancel`).then((r) => r.data),

  updateStatus: (id: number, status: string) =>
    api.patch<Appointment>(`/v1/appointments/${id}/status`, { status }).then((r) => r.data),

  getDoctorAvailability: (doctorId: number) =>
    api.get<DoctorAvailability[]>(`/v1/doctors/${doctorId}/availability`).then((r) => r.data),

  setDoctorAvailability: (doctorId: number, data: DoctorAvailability) =>
    api.post<DoctorAvailability>(`/v1/doctors/${doctorId}/availability`, data).then((r) => r.data),

  getAvailableSlots: (doctorId: number, startDate: string, endDate: string) =>
    api.get<TimeSlot[]>(`/v1/doctors/${doctorId}/slots`, { params: { startDate, endDate } }).then((r) => r.data),
};
