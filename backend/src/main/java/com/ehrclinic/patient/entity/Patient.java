package com.ehrclinic.patient.entity;

import com.ehrclinic.auth.entity.User;
import com.ehrclinic.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient extends BaseEntity {

    @Column(name = "medical_record_number", nullable = false, unique = true, length = 20)
    private String medicalRecordNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(name = "blood_type", length = 5)
    private String bloodType;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(name = "insurance_provider", length = 100)
    private String insuranceProvider;

    @Column(name = "insurance_policy_number", length = 50)
    private String insurancePolicyNumber;

    @Column(name = "emergency_contact_name", length = 200)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relationship", length = 50)
    private String emergencyContactRelationship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_by")
    private User registeredBy;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Allergy> allergies = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VitalSign> vitalSigns = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MedicalHistory> medicalHistories = new ArrayList<>();
}
