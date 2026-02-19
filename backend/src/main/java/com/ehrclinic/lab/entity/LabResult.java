package com.ehrclinic.lab.entity;

import com.ehrclinic.auth.entity.User;
import com.ehrclinic.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabResult extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_order_item_id", nullable = false, unique = true)
    private LabOrderItem labOrderItem;

    @Column(name = "result_value", length = 200)
    private String resultValue;

    @Column(name = "is_abnormal")
    @Builder.Default
    private Boolean isAbnormal = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by")
    private User enteredBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}
