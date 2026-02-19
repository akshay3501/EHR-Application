package com.ehrclinic.lab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabResultResponse {
    private Long id;
    private String resultValue;
    private Boolean isAbnormal;
    private String notes;
    private String enteredByName;
    private String verifiedByName;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
}
