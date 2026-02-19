export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  LAB_TECHNICIAN: 'LAB_TECHNICIAN',
  RECEPTIONIST: 'RECEPTIONIST',
} as const;

export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  CHECKED_IN: 'CHECKED_IN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export const LAB_ORDER_STATUSES = {
  ORDERED: 'ORDERED',
  SAMPLE_COLLECTED: 'SAMPLE_COLLECTED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'blue',
  CHECKED_IN: 'cyan',
  IN_PROGRESS: 'orange',
  COMPLETED: 'green',
  CANCELLED: 'red',
  NO_SHOW: 'volcano',
  ORDERED: 'blue',
  SAMPLE_COLLECTED: 'cyan',
  PROCESSING: 'orange',
  PENDING: 'default',
  ACTIVE: 'green',
  RESOLVED: 'blue',
  CHRONIC: 'orange',
  MILD: 'green',
  MODERATE: 'orange',
  SEVERE: 'red',
  LIFE_THREATENING: 'magenta',
  ROUTINE: 'default',
  URGENT: 'orange',
  STAT: 'red',
};
