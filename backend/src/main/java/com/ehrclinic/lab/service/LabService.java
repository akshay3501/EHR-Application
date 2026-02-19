package com.ehrclinic.lab.service;

import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.lab.dto.*;

import java.util.List;

public interface LabService {
    LabOrderResponse createLabOrder(LabOrderCreateRequest request, String username);
    PagedResponse<LabOrderResponse> getLabOrders(Long patientId, Long doctorId, String status, int page, int size);
    LabOrderResponse getLabOrder(Long id);
    LabOrderResponse cancelLabOrder(Long id);
    LabOrderItemResponse collectSample(Long orderId, Long itemId);
    LabResultResponse enterResult(Long orderId, Long itemId, LabResultRequest request, String username);
    LabResultResponse verifyResult(Long orderId, Long itemId, String username);
    LabOrderResponse getLabReport(Long id);
    List<LabTestCatalogDto> getLabTests();
}
