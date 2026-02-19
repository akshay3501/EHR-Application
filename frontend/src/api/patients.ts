import api from './axios-instance';
import type { Patient, PatientSummary, PatientCreateRequest, Allergy, VitalSign, MedicalHistory } from '@/types/patient';
import type { PagedResponse } from '@/types/common';

export const patientApi = {
  getPatients: (params: { search?: string; page?: number; size?: number }) =>
    api.get<PagedResponse<PatientSummary>>('/v1/patients', { params }).then((r) => r.data),

  getPatient: (id: number) =>
    api.get<Patient>(`/v1/patients/${id}`).then((r) => r.data),

  createPatient: (data: PatientCreateRequest) =>
    api.post<Patient>('/v1/patients', data).then((r) => r.data),

  updatePatient: (id: number, data: Partial<PatientCreateRequest>) =>
    api.put<Patient>(`/v1/patients/${id}`, data).then((r) => r.data),

  deletePatient: (id: number) =>
    api.delete(`/v1/patients/${id}`),

  getAllergies: (patientId: number) =>
    api.get<Allergy[]>(`/v1/patients/${patientId}/allergies`).then((r) => r.data),

  addAllergy: (patientId: number, data: Allergy) =>
    api.post<Allergy>(`/v1/patients/${patientId}/allergies`, data).then((r) => r.data),

  getVitals: (patientId: number, params?: { page?: number; size?: number }) =>
    api.get<PagedResponse<VitalSign>>(`/v1/patients/${patientId}/vitals`, { params }).then((r) => r.data),

  getLatestVitals: (patientId: number) =>
    api.get<VitalSign>(`/v1/patients/${patientId}/vitals/latest`).then((r) => r.data),

  addVitals: (patientId: number, data: VitalSign) =>
    api.post<VitalSign>(`/v1/patients/${patientId}/vitals`, data).then((r) => r.data),

  getMedicalHistory: (patientId: number) =>
    api.get<MedicalHistory[]>(`/v1/patients/${patientId}/medical-history`).then((r) => r.data),

  addMedicalHistory: (patientId: number, data: MedicalHistory) =>
    api.post<MedicalHistory>(`/v1/patients/${patientId}/medical-history`, data).then((r) => r.data),

  updateMedicalHistory: (patientId: number, historyId: number, data: Partial<MedicalHistory>) =>
    api.put<MedicalHistory>(`/v1/patients/${patientId}/medical-history/${historyId}`, data).then((r) => r.data),
};
