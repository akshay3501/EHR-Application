package com.ehrclinic.patient.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllergyDto {
    private Long id;

    @NotBlank(message = "Allergy type is required")
    private String allergyType;

    @NotBlank(message = "Allergen is required")
    private String allergen;

    @NotBlank(message = "Severity is required")
    private String severity;

    private String reaction;
    private String notes;
}
