package com.ehrclinic.lab.service.impl;

import com.ehrclinic.auth.entity.User;
import com.ehrclinic.auth.repository.UserRepository;
import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.exception.BusinessRuleException;
import com.ehrclinic.exception.ResourceNotFoundException;
import com.ehrclinic.lab.dto.*;
import com.ehrclinic.lab.entity.*;
import com.ehrclinic.lab.mapper.LabMapper;
import com.ehrclinic.lab.repository.*;
import com.ehrclinic.lab.service.LabService;
import com.ehrclinic.patient.entity.Patient;
import com.ehrclinic.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LabServiceImpl implements LabService {

    private final LabOrderRepository labOrderRepository;
    private final LabOrderItemRepository labOrderItemRepository;
    private final LabResultRepository labResultRepository;
    private final LabTestCatalogRepository testCatalogRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final LabMapper mapper;

    private static final AtomicLong orderCounter = new AtomicLong(1);

    @Override
    public LabOrderResponse createLabOrder(LabOrderCreateRequest request, String username) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));
        User doctor = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        LabOrder order = LabOrder.builder()
                .orderNumber(generateOrderNumber())
                .patient(patient)
                .orderingDoctor(doctor)
                .status("ORDERED")
                .priority(request.getPriority() != null ? request.getPriority() : "ROUTINE")
                .clinicalNotes(request.getClinicalNotes())
                .build();

        order = labOrderRepository.save(order);

        for (Long testId : request.getTestIds()) {
            LabTestCatalog test = testCatalogRepository.findById(testId)
                    .orElseThrow(() -> new ResourceNotFoundException("LabTest", "id", testId));

            LabOrderItem item = LabOrderItem.builder()
                    .labOrder(order)
                    .test(test)
                    .status("PENDING")
                    .build();
            labOrderItemRepository.save(item);
        }

        return mapper.toOrderResponse(labOrderRepository.findById(order.getId()).orElseThrow());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<LabOrderResponse> getLabOrders(Long patientId, Long doctorId,
                                                          String status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<LabOrder> orders;

        if (patientId != null) {
            orders = labOrderRepository.findByPatientId(patientId, pageRequest);
        } else if (doctorId != null) {
            orders = labOrderRepository.findByOrderingDoctorId(doctorId, pageRequest);
        } else if (status != null) {
            orders = labOrderRepository.findByStatus(status, pageRequest);
        } else {
            orders = labOrderRepository.findAll(pageRequest);
        }

        List<LabOrderResponse> content = orders.getContent().stream()
                .map(mapper::toOrderResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(content, page, size, orders.getTotalElements(),
                orders.getTotalPages(), orders.isLast());
    }

    @Override
    @Transactional(readOnly = true)
    public LabOrderResponse getLabOrder(Long id) {
        LabOrder order = findOrderById(id);
        return mapper.toOrderResponse(order);
    }

    @Override
    public LabOrderResponse cancelLabOrder(Long id) {
        LabOrder order = findOrderById(id);
        if ("COMPLETED".equals(order.getStatus())) {
            throw new BusinessRuleException("Cannot cancel a completed lab order");
        }
        order.setStatus("CANCELLED");
        order.getItems().forEach(item -> item.setStatus("CANCELLED"));
        order = labOrderRepository.save(order);
        return mapper.toOrderResponse(order);
    }

    @Override
    public LabOrderItemResponse collectSample(Long orderId, Long itemId) {
        LabOrderItem item = findItemById(orderId, itemId);
        if (!"PENDING".equals(item.getStatus())) {
            throw new BusinessRuleException("Sample can only be collected for pending items");
        }
        item.setStatus("SAMPLE_COLLECTED");
        item = labOrderItemRepository.save(item);
        updateOrderStatus(item.getLabOrder());
        return mapper.toOrderItemResponse(item);
    }

    @Override
    public LabResultResponse enterResult(Long orderId, Long itemId, LabResultRequest request, String username) {
        LabOrderItem item = findItemById(orderId, itemId);
        if (!"SAMPLE_COLLECTED".equals(item.getStatus()) && !"PROCESSING".equals(item.getStatus())) {
            throw new BusinessRuleException("Results can only be entered for items with collected samples");
        }

        User enteredBy = userRepository.findByUsername(username).orElse(null);

        boolean isAbnormal = checkAbnormality(request.getResultValue(), item.getTest().getNormalRange());

        LabResult result = LabResult.builder()
                .labOrderItem(item)
                .resultValue(request.getResultValue())
                .isAbnormal(isAbnormal)
                .notes(request.getNotes())
                .enteredBy(enteredBy)
                .build();

        result = labResultRepository.save(result);
        item.setStatus("COMPLETED");
        labOrderItemRepository.save(item);
        updateOrderStatus(item.getLabOrder());

        return mapper.toResultResponse(result);
    }

    @Override
    public LabResultResponse verifyResult(Long orderId, Long itemId, String username) {
        LabOrderItem item = findItemById(orderId, itemId);
        if (item.getResult() == null) {
            throw new BusinessRuleException("No result to verify");
        }

        User verifiedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        LabResult result = item.getResult();
        result.setVerifiedBy(verifiedBy);
        result.setVerifiedAt(LocalDateTime.now());
        result = labResultRepository.save(result);

        return mapper.toResultResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public LabOrderResponse getLabReport(Long id) {
        return getLabOrder(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LabTestCatalogDto> getLabTests() {
        return testCatalogRepository.findByIsActiveTrue().stream()
                .map(mapper::toTestCatalogDto)
                .collect(Collectors.toList());
    }

    private void updateOrderStatus(LabOrder order) {
        List<LabOrderItem> items = labOrderItemRepository.findByLabOrderId(order.getId());
        boolean allCompleted = items.stream().allMatch(i -> "COMPLETED".equals(i.getStatus()));
        boolean anyProcessing = items.stream().anyMatch(i ->
                "PROCESSING".equals(i.getStatus()) || "SAMPLE_COLLECTED".equals(i.getStatus()));

        if (allCompleted) {
            order.setStatus("COMPLETED");
        } else if (anyProcessing) {
            order.setStatus("PROCESSING");
        }
        labOrderRepository.save(order);
    }

    private boolean checkAbnormality(String resultValue, String normalRange) {
        if (normalRange == null || normalRange.isBlank() || resultValue == null) return false;
        try {
            double value = Double.parseDouble(resultValue.trim());
            String[] parts = normalRange.split("-");
            if (parts.length == 2) {
                double low = Double.parseDouble(parts[0].trim());
                double high = Double.parseDouble(parts[1].trim());
                return value < low || value > high;
            }
        } catch (NumberFormatException e) {
            return false;
        }
        return false;
    }

    private LabOrder findOrderById(Long id) {
        return labOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LabOrder", "id", id));
    }

    private LabOrderItem findItemById(Long orderId, Long itemId) {
        findOrderById(orderId);
        return labOrderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("LabOrderItem", "id", itemId));
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("LAB-%s-%04d", date, orderCounter.getAndIncrement());
    }
}
