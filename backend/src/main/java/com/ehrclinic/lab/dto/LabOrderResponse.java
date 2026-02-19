package com.ehrclinic.lab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabOrderResponse {
    private Long id;
    private String orderNumber;
    private Long patientId;
    private String patientName;
    private String patientMrn;
    private Long doctorId;
    private String doctorName;
    private String status;
    private String priority;
    private String clinicalNotes;
    private List<LabOrderItemResponse> items;
    private LocalDateTime createdAt;
}
