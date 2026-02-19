package com.ehrclinic.patient.mapper;

import com.ehrclinic.patient.dto.*;
import com.ehrclinic.patient.entity.Allergy;
import com.ehrclinic.patient.entity.MedicalHistory;
import com.ehrclinic.patient.entity.Patient;
import com.ehrclinic.patient.entity.VitalSign;
import org.mapstruct.*;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface PatientMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicalRecordNumber", ignore = true)
    @Mapping(target = "registeredBy", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "allergies", ignore = true)
    @Mapping(target = "vitalSigns", ignore = true)
    @Mapping(target = "medicalHistories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Patient toEntity(PatientCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicalRecordNumber", ignore = true)
    @Mapping(target = "registeredBy", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "allergies", ignore = true)
    @Mapping(target = "vitalSigns", ignore = true)
    @Mapping(target = "medicalHistories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(PatientUpdateRequest request, @MappingTarget Patient patient);

    @Mapping(target = "allergies", ignore = true)
    @Mapping(target = "medicalHistories", ignore = true)
    @Mapping(target = "latestVitals", ignore = true)
    PatientResponse toResponse(Patient patient);

    PatientSummaryResponse toSummaryResponse(Patient patient);

    AllergyDto toAllergyDto(Allergy allergy);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Allergy toAllergyEntity(AllergyDto dto);

    @Mapping(target = "recordedByName", expression = "java(vitalSign.getRecordedBy() != null ? vitalSign.getRecordedBy().getFirstName() + \" \" + vitalSign.getRecordedBy().getLastName() : null)")
    VitalSignDto toVitalSignDto(VitalSign vitalSign);

    @Mapping(target = "recordedByName", expression = "java(history.getRecordedBy() != null ? history.getRecordedBy().getFirstName() + \" \" + history.getRecordedBy().getLastName() : null)")
    MedicalHistoryDto toMedicalHistoryDto(MedicalHistory history);
}
