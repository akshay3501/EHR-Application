package com.ehrclinic.patient.repository;

import com.ehrclinic.patient.entity.VitalSign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VitalSignRepository extends JpaRepository<VitalSign, Long> {
    Page<VitalSign> findByPatientIdOrderByCreatedAtDesc(Long patientId, Pageable pageable);
    Optional<VitalSign> findFirstByPatientIdOrderByCreatedAtDesc(Long patientId);
}
