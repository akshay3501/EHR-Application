package com.ehrclinic.patient.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistoryDto {
    private Long id;

    @NotBlank(message = "Condition name is required")
    private String conditionName;

    private LocalDate diagnosisDate;
    private String status;
    private String notes;
    private String recordedByName;
    private LocalDateTime createdAt;
}
