package com.ehrclinic.lab.entity;

import com.ehrclinic.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lab_order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_order_id", nullable = false)
    private LabOrder labOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private LabTestCatalog test;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";

    @OneToOne(mappedBy = "labOrderItem", cascade = CascadeType.ALL)
    private LabResult result;
}
