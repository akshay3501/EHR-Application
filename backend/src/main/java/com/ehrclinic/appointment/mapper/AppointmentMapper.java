package com.ehrclinic.appointment.mapper;

import com.ehrclinic.appointment.dto.AppointmentResponse;
import com.ehrclinic.appointment.dto.DoctorAvailabilityDto;
import com.ehrclinic.appointment.entity.Appointment;
import com.ehrclinic.appointment.entity.DoctorAvailability;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface AppointmentMapper {

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "patientName", expression = "java(appointment.getPatient().getFirstName() + \" \" + appointment.getPatient().getLastName())")
    @Mapping(target = "patientMrn", source = "patient.medicalRecordNumber")
    @Mapping(target = "doctorId", source = "doctor.id")
    @Mapping(target = "doctorName", expression = "java(appointment.getDoctor().getFirstName() + \" \" + appointment.getDoctor().getLastName())")
    @Mapping(target = "doctorSpecialization", source = "doctor.specialization")
    AppointmentResponse toResponse(Appointment appointment);

    DoctorAvailabilityDto toAvailabilityDto(DoctorAvailability availability);
}
