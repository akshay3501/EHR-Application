package com.ehrclinic.lab.repository;

import com.ehrclinic.lab.entity.LabOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabOrderRepository extends JpaRepository<LabOrder, Long> {
    Page<LabOrder> findByPatientId(Long patientId, Pageable pageable);
    Page<LabOrder> findByOrderingDoctorId(Long doctorId, Pageable pageable);
    Page<LabOrder> findByStatus(String status, Pageable pageable);
    long countByStatus(String status);
}
