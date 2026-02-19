package com.ehrclinic.lab.entity;

import com.ehrclinic.auth.entity.User;
import com.ehrclinic.common.BaseEntity;
import com.ehrclinic.patient.entity.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lab_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabOrder extends BaseEntity {

    @Column(name = "order_number", nullable = false, unique = true, length = 20)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordering_doctor", nullable = false)
    private User orderingDoctor;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ORDERED";

    @Column(nullable = false, length = 15)
    @Builder.Default
    private String priority = "ROUTINE";

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @OneToMany(mappedBy = "labOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LabOrderItem> items = new ArrayList<>();
}
