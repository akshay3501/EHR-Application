package com.ehrclinic.appointment.service;

import com.ehrclinic.appointment.dto.*;
import com.ehrclinic.common.dto.PagedResponse;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse createAppointment(AppointmentCreateRequest request, String username);
    PagedResponse<AppointmentResponse> getAppointments(Long doctorId, Long patientId, String status, int page, int size);
    AppointmentResponse rescheduleAppointment(Long id, RescheduleRequest request);
    AppointmentResponse cancelAppointment(Long id);
    AppointmentResponse updateStatus(Long id, StatusUpdateRequest request);

    List<DoctorAvailabilityDto> getDoctorAvailability(Long doctorId);
    DoctorAvailabilityDto setDoctorAvailability(Long doctorId, DoctorAvailabilityDto dto);
    List<TimeSlotResponse> getAvailableSlots(Long doctorId, LocalDate startDate, LocalDate endDate);
}
