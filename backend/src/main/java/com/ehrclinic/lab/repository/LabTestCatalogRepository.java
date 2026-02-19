package com.ehrclinic.lab.repository;

import com.ehrclinic.lab.entity.LabTestCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestCatalogRepository extends JpaRepository<LabTestCatalog, Long> {
    List<LabTestCatalog> findByIsActiveTrue();
}
