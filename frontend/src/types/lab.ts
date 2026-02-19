export interface LabTestCatalog {
  id: number;
  testCode: string;
  testName: string;
  description?: string;
  sampleType: string;
  normalRange?: string;
  unit?: string;
  price?: number;
}

export interface LabOrder {
  id: number;
  orderNumber: string;
  patientId: number;
  patientName: string;
  patientMrn: string;
  doctorId: number;
  doctorName: string;
  status: string;
  priority: string;
  clinicalNotes?: string;
  items: LabOrderItem[];
  createdAt: string;
}

export interface LabOrderItem {
  id: number;
  testCode: string;
  testName: string;
  sampleType: string;
  normalRange?: string;
  unit?: string;
  status: string;
  result?: LabResult;
}

export interface LabResult {
  id: number;
  resultValue: string;
  isAbnormal: boolean;
  notes?: string;
  enteredByName?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface LabOrderCreateRequest {
  patientId: number;
  testIds: number[];
  priority?: string;
  clinicalNotes?: string;
}

export interface LabResultRequest {
  resultValue: string;
  notes?: string;
}
