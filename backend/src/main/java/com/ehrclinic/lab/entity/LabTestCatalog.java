package com.ehrclinic.lab.entity;

import com.ehrclinic.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "lab_test_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabTestCatalog extends BaseEntity {

    @Column(name = "test_code", nullable = false, unique = true, length = 20)
    private String testCode;

    @Column(name = "test_name", nullable = false, length = 200)
    private String testName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sample_type", nullable = false, length = 50)
    private String sampleType;

    @Column(name = "normal_range", length = 100)
    private String normalRange;

    @Column(length = 30)
    private String unit;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
