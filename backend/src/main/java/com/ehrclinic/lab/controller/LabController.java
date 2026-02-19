package com.ehrclinic.lab.controller;

import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.lab.dto.*;
import com.ehrclinic.lab.service.LabService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LabController {

    private final LabService labService;

    @PostMapping("/lab-orders")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<LabOrderResponse> createLabOrder(
            @Valid @RequestBody LabOrderCreateRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labService.createLabOrder(request, authentication.getName()));
    }

    @GetMapping("/lab-orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    public ResponseEntity<PagedResponse<LabOrderResponse>> getLabOrders(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(labService.getLabOrders(patientId, doctorId, status, page, size));
    }

    @GetMapping("/lab-orders/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    public ResponseEntity<LabOrderResponse> getLabOrder(@PathVariable Long id) {
        return ResponseEntity.ok(labService.getLabOrder(id));
    }

    @PatchMapping("/lab-orders/{id}/cancel")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<LabOrderResponse> cancelLabOrder(@PathVariable Long id) {
        return ResponseEntity.ok(labService.cancelLabOrder(id));
    }

    @PatchMapping("/lab-orders/{orderId}/items/{itemId}/collect-sample")
    @PreAuthorize("hasAnyRole('NURSE', 'LAB_TECHNICIAN')")
    public ResponseEntity<LabOrderItemResponse> collectSample(@PathVariable Long orderId,
                                                                @PathVariable Long itemId) {
        return ResponseEntity.ok(labService.collectSample(orderId, itemId));
    }

    @PostMapping("/lab-orders/{orderId}/items/{itemId}/result")
    @PreAuthorize("hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabResultResponse> enterResult(@PathVariable Long orderId,
                                                           @PathVariable Long itemId,
                                                           @Valid @RequestBody LabResultRequest request,
                                                           Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labService.enterResult(orderId, itemId, request, authentication.getName()));
    }

    @PatchMapping("/lab-orders/{orderId}/items/{itemId}/result/verify")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<LabResultResponse> verifyResult(@PathVariable Long orderId,
                                                            @PathVariable Long itemId,
                                                            Authentication authentication) {
        return ResponseEntity.ok(labService.verifyResult(orderId, itemId, authentication.getName()));
    }

    @GetMapping("/lab-orders/{id}/report")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<LabOrderResponse> getLabReport(@PathVariable Long id) {
        return ResponseEntity.ok(labService.getLabReport(id));
    }

    @GetMapping("/lab-tests")
    public ResponseEntity<List<LabTestCatalogDto>> getLabTests() {
        return ResponseEntity.ok(labService.getLabTests());
    }
}
