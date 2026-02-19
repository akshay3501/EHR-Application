package com.ehrclinic.lab.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LabResultRequest {
    @NotBlank(message = "Result value is required")
    private String resultValue;
    private String notes;
}
