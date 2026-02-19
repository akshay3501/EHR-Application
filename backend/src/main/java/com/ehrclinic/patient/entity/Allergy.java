package com.ehrclinic.patient.entity;

import com.ehrclinic.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "allergies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Allergy extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "allergy_type", nullable = false, length = 30)
    private String allergyType;

    @Column(nullable = false, length = 200)
    private String allergen;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(columnDefinition = "TEXT")
    private String reaction;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
