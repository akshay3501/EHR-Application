export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientMrn: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface AppointmentCreateRequest {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  startTime: string;
  reason?: string;
  notes?: string;
}

export interface DoctorAvailability {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes?: number;
  isActive?: boolean;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}
