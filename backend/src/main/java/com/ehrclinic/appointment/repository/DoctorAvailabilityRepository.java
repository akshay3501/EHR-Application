package com.ehrclinic.appointment.repository;

import com.ehrclinic.appointment.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorIdAndIsActiveTrue(Long doctorId);
    Optional<DoctorAvailability> findByDoctorIdAndDayOfWeek(Long doctorId, Integer dayOfWeek);
}
