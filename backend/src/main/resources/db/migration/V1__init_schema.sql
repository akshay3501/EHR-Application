-- Roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Roles join table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Patients table
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    medical_record_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_type VARCHAR(5),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(50),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    registered_by BIGINT REFERENCES users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patients_mrn ON patients(medical_record_number);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

-- Allergies table
CREATE TABLE allergies (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergy_type VARCHAR(30) NOT NULL,
    allergen VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    reaction TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_allergies_patient ON allergies(patient_id);

-- Vital Signs table
CREATE TABLE vital_signs (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recorded_by BIGINT REFERENCES users(id),
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    heart_rate INTEGER,
    temperature DECIMAL(4,1),
    respiratory_rate INTEGER,
    oxygen_saturation DECIMAL(4,1),
    weight DECIMAL(5,1),
    height DECIMAL(5,1),
    bmi DECIMAL(4,1),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vitals_patient ON vital_signs(patient_id);

-- Medical Histories table
CREATE TABLE medical_histories (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    condition_name VARCHAR(200) NOT NULL,
    diagnosis_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    recorded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medical_history_patient ON medical_histories(patient_id);

-- Doctor Availability table
CREATE TABLE doctor_availability (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(doctor_id, day_of_week)
);

-- Appointments table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    doctor_id BIGINT NOT NULL REFERENCES users(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    reason TEXT,
    notes TEXT,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(doctor_id, appointment_date, start_time)
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);

-- Lab Test Catalog table
CREATE TABLE lab_test_catalog (
    id BIGSERIAL PRIMARY KEY,
    test_code VARCHAR(20) NOT NULL UNIQUE,
    test_name VARCHAR(200) NOT NULL,
    description TEXT,
    sample_type VARCHAR(50) NOT NULL,
    normal_range VARCHAR(100),
    unit VARCHAR(30),
    price DECIMAL(10,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Lab Orders table
CREATE TABLE lab_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    ordering_doctor BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'ORDERED',
    priority VARCHAR(15) NOT NULL DEFAULT 'ROUTINE',
    clinical_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX idx_lab_orders_doctor ON lab_orders(ordering_doctor);

-- Lab Order Items table
CREATE TABLE lab_order_items (
    id BIGSERIAL PRIMARY KEY,
    lab_order_id BIGINT NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
    test_id BIGINT NOT NULL REFERENCES lab_test_catalog(id),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lab_order_items_order ON lab_order_items(lab_order_id);

-- Lab Results table
CREATE TABLE lab_results (
    id BIGSERIAL PRIMARY KEY,
    lab_order_item_id BIGINT NOT NULL UNIQUE REFERENCES lab_order_items(id),
    result_value VARCHAR(200),
    is_abnormal BOOLEAN DEFAULT FALSE,
    notes TEXT,
    entered_by BIGINT REFERENCES users(id),
    verified_by BIGINT REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
