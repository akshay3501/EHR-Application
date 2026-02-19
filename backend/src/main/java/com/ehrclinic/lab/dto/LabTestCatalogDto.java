package com.ehrclinic.lab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTestCatalogDto {
    private Long id;
    private String testCode;
    private String testName;
    private String description;
    private String sampleType;
    private String normalRange;
    private String unit;
    private BigDecimal price;
}
