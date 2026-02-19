package com.ehrclinic.patient.service;

import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.patient.dto.*;

import java.util.List;

public interface PatientService {
    PatientResponse createPatient(PatientCreateRequest request, String username);
    PatientResponse getPatient(Long id);
    PagedResponse<PatientSummaryResponse> getPatients(String search, int page, int size);
    PatientResponse updatePatient(Long id, PatientUpdateRequest request);
    void deletePatient(Long id);

    List<AllergyDto> getPatientAllergies(Long patientId);
    AllergyDto addAllergy(Long patientId, AllergyDto dto);

    PagedResponse<VitalSignDto> getPatientVitals(Long patientId, int page, int size);
    VitalSignDto getLatestVitals(Long patientId);
    VitalSignDto addVitals(Long patientId, VitalSignDto dto, String username);

    List<MedicalHistoryDto> getMedicalHistory(Long patientId);
    MedicalHistoryDto addMedicalHistory(Long patientId, MedicalHistoryDto dto, String username);
    MedicalHistoryDto updateMedicalHistory(Long patientId, Long historyId, MedicalHistoryDto dto);
}
