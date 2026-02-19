package com.ehrclinic.appointment.service.impl;

import com.ehrclinic.appointment.dto.*;
import com.ehrclinic.appointment.entity.Appointment;
import com.ehrclinic.appointment.entity.DoctorAvailability;
import com.ehrclinic.appointment.enums.AppointmentStatus;
import com.ehrclinic.appointment.mapper.AppointmentMapper;
import com.ehrclinic.appointment.repository.AppointmentRepository;
import com.ehrclinic.appointment.repository.DoctorAvailabilityRepository;
import com.ehrclinic.appointment.service.AppointmentService;
import com.ehrclinic.auth.entity.User;
import com.ehrclinic.auth.repository.UserRepository;
import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.exception.BadRequestException;
import com.ehrclinic.exception.BusinessRuleException;
import com.ehrclinic.exception.ResourceNotFoundException;
import com.ehrclinic.patient.entity.Patient;
import com.ehrclinic.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AppointmentMapper mapper;

    private static final Set<String> VALID_TRANSITIONS_FROM_SCHEDULED = Set.of("CHECKED_IN", "CANCELLED", "NO_SHOW");
    private static final Set<String> VALID_TRANSITIONS_FROM_CHECKED_IN = Set.of("IN_PROGRESS", "CANCELLED");
    private static final Set<String> VALID_TRANSITIONS_FROM_IN_PROGRESS = Set.of("COMPLETED");

    @Override
    public AppointmentResponse createAppointment(AppointmentCreateRequest request, String username) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));
        User createdBy = userRepository.findByUsername(username).orElse(null);

        // Check for conflicts
        List<Appointment> existing = appointmentRepository.findByDoctorIdAndDate(
                request.getDoctorId(), request.getAppointmentDate());
        boolean conflict = existing.stream().anyMatch(a ->
                a.getStartTime().equals(request.getStartTime()));
        if (conflict) {
            throw new BusinessRuleException("Time slot is already booked for this doctor");
        }

        // Determine end time from availability
        int slotDuration = 30;
        int dayOfWeek = request.getAppointmentDate().getDayOfWeek().getValue() % 7;
        DoctorAvailability availability = availabilityRepository
                .findByDoctorIdAndDayOfWeek(request.getDoctorId(), dayOfWeek).orElse(null);
        if (availability != null) {
            slotDuration = availability.getSlotDurationMinutes();
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(slotDuration))
                .status(AppointmentStatus.SCHEDULED.name())
                .reason(request.getReason())
                .notes(request.getNotes())
                .createdBy(createdBy)
                .build();

        appointment = appointmentRepository.save(appointment);
        return mapper.toResponse(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AppointmentResponse> getAppointments(Long doctorId, Long patientId,
                                                                String status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDate", "startTime"));
        Page<Appointment> appointments;

        if (doctorId != null) {
            appointments = appointmentRepository.findByDoctorId(doctorId, pageRequest);
        } else if (patientId != null) {
            appointments = appointmentRepository.findByPatientId(patientId, pageRequest);
        } else if (status != null) {
            appointments = appointmentRepository.findByStatus(status, pageRequest);
        } else {
            appointments = appointmentRepository.findAll(pageRequest);
        }

        List<AppointmentResponse> content = appointments.getContent().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(content, page, size, appointments.getTotalElements(),
                appointments.getTotalPages(), appointments.isLast());
    }

    @Override
    public AppointmentResponse rescheduleAppointment(Long id, RescheduleRequest request) {
        Appointment appointment = findById(id);

        if (!"SCHEDULED".equals(appointment.getStatus())) {
            throw new BusinessRuleException("Only scheduled appointments can be rescheduled");
        }

        List<Appointment> conflicts = appointmentRepository.findByDoctorIdAndDate(
                appointment.getDoctor().getId(), request.getAppointmentDate());
        boolean conflict = conflicts.stream().anyMatch(a ->
                !a.getId().equals(id) && a.getStartTime().equals(request.getStartTime()));
        if (conflict) {
            throw new BusinessRuleException("New time slot is already booked");
        }

        int duration = (int) java.time.Duration.between(appointment.getStartTime(), appointment.getEndTime()).toMinutes();
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getStartTime().plusMinutes(duration));

        appointment = appointmentRepository.save(appointment);
        return mapper.toResponse(appointment);
    }

    @Override
    public AppointmentResponse cancelAppointment(Long id) {
        Appointment appointment = findById(id);
        if ("COMPLETED".equals(appointment.getStatus()) || "CANCELLED".equals(appointment.getStatus())) {
            throw new BusinessRuleException("Cannot cancel a completed or already cancelled appointment");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED.name());
        appointment = appointmentRepository.save(appointment);
        return mapper.toResponse(appointment);
    }

    @Override
    public AppointmentResponse updateStatus(Long id, StatusUpdateRequest request) {
        Appointment appointment = findById(id);
        String currentStatus = appointment.getStatus();
        String newStatus = request.getStatus().toUpperCase();

        // Validate transition
        AppointmentStatus.valueOf(newStatus);

        boolean valid = switch (currentStatus) {
            case "SCHEDULED" -> VALID_TRANSITIONS_FROM_SCHEDULED.contains(newStatus);
            case "CHECKED_IN" -> VALID_TRANSITIONS_FROM_CHECKED_IN.contains(newStatus);
            case "IN_PROGRESS" -> VALID_TRANSITIONS_FROM_IN_PROGRESS.contains(newStatus);
            default -> false;
        };

        if (!valid) {
            throw new BusinessRuleException(
                    String.format("Cannot transition from %s to %s", currentStatus, newStatus));
        }

        appointment.setStatus(newStatus);
        appointment = appointmentRepository.save(appointment);
        return mapper.toResponse(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorAvailabilityDto> getDoctorAvailability(Long doctorId) {
        return availabilityRepository.findByDoctorIdAndIsActiveTrue(doctorId).stream()
                .map(mapper::toAvailabilityDto)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorAvailabilityDto setDoctorAvailability(Long doctorId, DoctorAvailabilityDto dto) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        DoctorAvailability availability = availabilityRepository
                .findByDoctorIdAndDayOfWeek(doctorId, dto.getDayOfWeek())
                .orElse(DoctorAvailability.builder().doctor(doctor).dayOfWeek(dto.getDayOfWeek()).build());

        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setSlotDurationMinutes(dto.getSlotDurationMinutes() != null ? dto.getSlotDurationMinutes() : 30);
        availability.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        availability = availabilityRepository.save(availability);
        return mapper.toAvailabilityDto(availability);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getAvailableSlots(Long doctorId, LocalDate startDate, LocalDate endDate) {
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndIsActiveTrue(doctorId);
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);

        List<TimeSlotResponse> slots = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            int dayOfWeek = date.getDayOfWeek().getValue() % 7;
            final LocalDate currentDate = date;

            DoctorAvailability avail = availabilities.stream()
                    .filter(a -> a.getDayOfWeek().equals(dayOfWeek))
                    .findFirst().orElse(null);

            if (avail == null) continue;

            LocalTime slotStart = avail.getStartTime();
            while (slotStart.plusMinutes(avail.getSlotDurationMinutes()).isBefore(avail.getEndTime())
                    || slotStart.plusMinutes(avail.getSlotDurationMinutes()).equals(avail.getEndTime())) {

                LocalTime slotEnd = slotStart.plusMinutes(avail.getSlotDurationMinutes());
                final LocalTime finalSlotStart = slotStart;

                boolean isBooked = bookedAppointments.stream().anyMatch(a ->
                        a.getAppointmentDate().equals(currentDate) && a.getStartTime().equals(finalSlotStart));

                slots.add(TimeSlotResponse.builder()
                        .date(currentDate)
                        .startTime(slotStart)
                        .endTime(slotEnd)
                        .available(!isBooked)
                        .build());

                slotStart = slotEnd;
            }
        }

        return slots;
    }

    private Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
    }
}
