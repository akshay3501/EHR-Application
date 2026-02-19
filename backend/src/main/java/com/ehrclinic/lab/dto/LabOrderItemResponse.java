package com.ehrclinic.lab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabOrderItemResponse {
    private Long id;
    private String testCode;
    private String testName;
    private String sampleType;
    private String normalRange;
    private String unit;
    private String status;
    private LabResultResponse result;
}
