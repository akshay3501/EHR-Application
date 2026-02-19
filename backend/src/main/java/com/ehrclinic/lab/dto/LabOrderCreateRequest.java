package com.ehrclinic.lab.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class LabOrderCreateRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotEmpty(message = "At least one test is required")
    private List<Long> testIds;

    private String priority;
    private String clinicalNotes;
}
