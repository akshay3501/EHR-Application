package com.ehrclinic.patient.service.impl;

import com.ehrclinic.auth.entity.User;
import com.ehrclinic.auth.repository.UserRepository;
import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.exception.ResourceNotFoundException;
import com.ehrclinic.patient.dto.*;
import com.ehrclinic.patient.entity.*;
import com.ehrclinic.patient.mapper.PatientMapper;
import com.ehrclinic.patient.repository.*;
import com.ehrclinic.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final AllergyRepository allergyRepository;
    private final VitalSignRepository vitalSignRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final UserRepository userRepository;
    private final PatientMapper patientMapper;

    private static final AtomicLong mrnCounter = new AtomicLong(1);

    @Override
    public PatientResponse createPatient(PatientCreateRequest request, String username) {
        Patient patient = patientMapper.toEntity(request);
        patient.setMedicalRecordNumber(generateMRN());
        patient.setIsActive(true);

        User registeredBy = userRepository.findByUsername(username).orElse(null);
        patient.setRegisteredBy(registeredBy);

        patient = patientRepository.save(patient);
        return patientMapper.toResponse(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatient(Long id) {
        Patient patient = findPatientById(id);
        PatientResponse response = patientMapper.toResponse(patient);

        response.setAllergies(patient.getAllergies().stream()
                .map(patientMapper::toAllergyDto)
                .collect(Collectors.toList()));

        response.setMedicalHistories(patient.getMedicalHistories().stream()
                .map(patientMapper::toMedicalHistoryDto)
                .collect(Collectors.toList()));

        vitalSignRepository.findFirstByPatientIdOrderByCreatedAtDesc(id)
                .ifPresent(v -> response.setLatestVitals(patientMapper.toVitalSignDto(v)));

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PatientSummaryResponse> getPatients(String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Patient> patients;

        if (StringUtils.hasText(search)) {
            patients = patientRepository.searchPatients(search, pageRequest);
        } else {
            patients = patientRepository.findByIsActiveTrue(pageRequest);
        }

        List<PatientSummaryResponse> content = patients.getContent().stream()
                .map(patientMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(content, page, size, patients.getTotalElements(),
                patients.getTotalPages(), patients.isLast());
    }

    @Override
    public PatientResponse updatePatient(Long id, PatientUpdateRequest request) {
        Patient patient = findPatientById(id);
        patientMapper.updateEntity(request, patient);
        patient = patientRepository.save(patient);
        return patientMapper.toResponse(patient);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = findPatientById(id);
        patient.setIsActive(false);
        patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AllergyDto> getPatientAllergies(Long patientId) {
        findPatientById(patientId);
        return allergyRepository.findByPatientId(patientId).stream()
                .map(patientMapper::toAllergyDto)
                .collect(Collectors.toList());
    }

    @Override
    public AllergyDto addAllergy(Long patientId, AllergyDto dto) {
        Patient patient = findPatientById(patientId);
        Allergy allergy = patientMapper.toAllergyEntity(dto);
        allergy.setPatient(patient);
        allergy = allergyRepository.save(allergy);
        return patientMapper.toAllergyDto(allergy);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<VitalSignDto> getPatientVitals(Long patientId, int page, int size) {
        findPatientById(patientId);
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<VitalSign> vitals = vitalSignRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageRequest);

        List<VitalSignDto> content = vitals.getContent().stream()
                .map(patientMapper::toVitalSignDto)
                .collect(Collectors.toList());

        return PagedResponse.of(content, page, size, vitals.getTotalElements(),
                vitals.getTotalPages(), vitals.isLast());
    }

    @Override
    @Transactional(readOnly = true)
    public VitalSignDto getLatestVitals(Long patientId) {
        findPatientById(patientId);
        return vitalSignRepository.findFirstByPatientIdOrderByCreatedAtDesc(patientId)
                .map(patientMapper::toVitalSignDto)
                .orElse(null);
    }

    @Override
    public VitalSignDto addVitals(Long patientId, VitalSignDto dto, String username) {
        Patient patient = findPatientById(patientId);
        User recordedBy = userRepository.findByUsername(username).orElse(null);

        VitalSign vitalSign = VitalSign.builder()
                .patient(patient)
                .recordedBy(recordedBy)
                .systolicBp(dto.getSystolicBp())
                .diastolicBp(dto.getDiastolicBp())
                .heartRate(dto.getHeartRate())
                .temperature(dto.getTemperature())
                .respiratoryRate(dto.getRespiratoryRate())
                .oxygenSaturation(dto.getOxygenSaturation())
                .weight(dto.getWeight())
                .height(dto.getHeight())
                .notes(dto.getNotes())
                .build();

        if (dto.getWeight() != null && dto.getHeight() != null && dto.getHeight().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal heightM = dto.getHeight().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            BigDecimal bmi = dto.getWeight().divide(heightM.multiply(heightM), 1, RoundingMode.HALF_UP);
            vitalSign.setBmi(bmi);
        }

        vitalSign = vitalSignRepository.save(vitalSign);
        return patientMapper.toVitalSignDto(vitalSign);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalHistoryDto> getMedicalHistory(Long patientId) {
        findPatientById(patientId);
        return medicalHistoryRepository.findByPatientIdOrderByDiagnosisDateDesc(patientId).stream()
                .map(patientMapper::toMedicalHistoryDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalHistoryDto addMedicalHistory(Long patientId, MedicalHistoryDto dto, String username) {
        Patient patient = findPatientById(patientId);
        User recordedBy = userRepository.findByUsername(username).orElse(null);

        MedicalHistory history = MedicalHistory.builder()
                .patient(patient)
                .conditionName(dto.getConditionName())
                .diagnosisDate(dto.getDiagnosisDate())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .notes(dto.getNotes())
                .recordedBy(recordedBy)
                .build();

        history = medicalHistoryRepository.save(history);
        return patientMapper.toMedicalHistoryDto(history);
    }

    @Override
    public MedicalHistoryDto updateMedicalHistory(Long patientId, Long historyId, MedicalHistoryDto dto) {
        findPatientById(patientId);
        MedicalHistory history = medicalHistoryRepository.findById(historyId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalHistory", "id", historyId));

        if (dto.getConditionName() != null) history.setConditionName(dto.getConditionName());
        if (dto.getDiagnosisDate() != null) history.setDiagnosisDate(dto.getDiagnosisDate());
        if (dto.getStatus() != null) history.setStatus(dto.getStatus());
        if (dto.getNotes() != null) history.setNotes(dto.getNotes());

        history = medicalHistoryRepository.save(history);
        return patientMapper.toMedicalHistoryDto(history);
    }

    private Patient findPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
    }

    private String generateMRN() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("MRN-%s-%04d", date, mrnCounter.getAndIncrement());
    }
}
