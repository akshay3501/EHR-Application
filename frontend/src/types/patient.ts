export interface Patient {
  id: number;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  isActive: boolean;
  createdAt: string;
  allergies?: Allergy[];
  medicalHistories?: MedicalHistory[];
  latestVitals?: VitalSign;
}

export interface PatientSummary {
  id: number;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  isActive: boolean;
}

export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export interface Allergy {
  id?: number;
  allergyType: string;
  allergen: string;
  severity: string;
  reaction?: string;
  notes?: string;
}

export interface VitalSign {
  id?: number;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
  recordedByName?: string;
  createdAt?: string;
}

export interface MedicalHistory {
  id?: number;
  conditionName: string;
  diagnosisDate?: string;
  status?: string;
  notes?: string;
  recordedByName?: string;
  createdAt?: string;
}
