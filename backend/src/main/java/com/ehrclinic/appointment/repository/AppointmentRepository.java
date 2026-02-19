package com.ehrclinic.appointment.repository;

import com.ehrclinic.appointment.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    Page<Appointment> findByStatus(String status, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.status != 'CANCELLED'")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :startDate AND :endDate AND a.status != 'CANCELLED'")
    List<Appointment> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    long countByAppointmentDateAndStatus(LocalDate date, String status);

    long countByAppointmentDate(LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date ORDER BY a.startTime")
    List<Appointment> findTodayAppointments(@Param("date") LocalDate date);
}
