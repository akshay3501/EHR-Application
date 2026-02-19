package com.ehrclinic.lab.mapper;

import com.ehrclinic.lab.dto.*;
import com.ehrclinic.lab.entity.*;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface LabMapper {

    LabTestCatalogDto toTestCatalogDto(LabTestCatalog catalog);

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "patientName", expression = "java(order.getPatient().getFirstName() + \" \" + order.getPatient().getLastName())")
    @Mapping(target = "patientMrn", source = "patient.medicalRecordNumber")
    @Mapping(target = "doctorId", source = "orderingDoctor.id")
    @Mapping(target = "doctorName", expression = "java(order.getOrderingDoctor().getFirstName() + \" \" + order.getOrderingDoctor().getLastName())")
    @Mapping(target = "items", source = "items")
    LabOrderResponse toOrderResponse(LabOrder order);

    @Mapping(target = "testCode", source = "test.testCode")
    @Mapping(target = "testName", source = "test.testName")
    @Mapping(target = "sampleType", source = "test.sampleType")
    @Mapping(target = "normalRange", source = "test.normalRange")
    @Mapping(target = "unit", source = "test.unit")
    LabOrderItemResponse toOrderItemResponse(LabOrderItem item);

    @Mapping(target = "enteredByName", expression = "java(result.getEnteredBy() != null ? result.getEnteredBy().getFirstName() + \" \" + result.getEnteredBy().getLastName() : null)")
    @Mapping(target = "verifiedByName", expression = "java(result.getVerifiedBy() != null ? result.getVerifiedBy().getFirstName() + \" \" + result.getVerifiedBy().getLastName() : null)")
    LabResultResponse toResultResponse(LabResult result);
}
