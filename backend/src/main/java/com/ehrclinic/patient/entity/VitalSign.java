package com.ehrclinic.patient.entity;

import com.ehrclinic.auth.entity.User;
import com.ehrclinic.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vital_signs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalSign extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by")
    private User recordedBy;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    @Column(name = "oxygen_saturation", precision = 4, scale = 1)
    private BigDecimal oxygenSaturation;

    @Column(precision = 5, scale = 1)
    private BigDecimal weight;

    @Column(precision = 5, scale = 1)
    private BigDecimal height;

    @Column(precision = 4, scale = 1)
    private BigDecimal bmi;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
