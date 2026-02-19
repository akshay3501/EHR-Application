package com.ehrclinic.appointment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RescheduleRequest {
    @NotNull(message = "New date is required")
    private LocalDate appointmentDate;

    @NotNull(message = "New start time is required")
    private LocalTime startTime;
}
