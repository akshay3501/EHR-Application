package com.ehrclinic.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalSignDto {
    private Long id;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer heartRate;
    private BigDecimal temperature;
    private Integer respiratoryRate;
    private BigDecimal oxygenSaturation;
    private BigDecimal weight;
    private BigDecimal height;
    private BigDecimal bmi;
    private String notes;
    private String recordedByName;
    private LocalDateTime createdAt;
}
