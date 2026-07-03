/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Clinician' | 'Researcher' | 'Admin' | 'Patient';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  fullName: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
}

export interface MedicationSchedule {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[]; // e.g. ["08:00", "20:00"]
  adherenceRate: number; // percentage of doses taken
  history: { date: string; taken: boolean }[];
}

export interface VitalRecord {
  timestamp: string; // ISO string
  heartRate: number;
  spo2: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  respiratoryRate: number;
  temperature: number;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  bloodType: string;
  dateOfBirth: string;
  status: 'ICU' | 'Ward' | 'Home' | 'Discharged';
  riskLevel: 'Low' | 'Medium' | 'Critical';
  assignedClinician: string;
  roomNumber: string;
  admittedAt: string;
  medications: MedicationSchedule[];
  vitalsHistory: VitalRecord[];
  medicalHistoryNotes?: string;
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  patientName: string;
  roomNumber: string;
  timestamp: string;
  type: 'Heart Rate' | 'SpO2' | 'Blood Pressure' | 'Temperature' | 'System';
  value: string;
  message: string;
  severity: 'Low' | 'Medium' | 'Critical';
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

export interface MedicalImageRecord {
  id: string;
  patientId: string;
  patientName: string;
  modality: 'X-Ray' | 'MRI' | 'CT' | 'Ultrasound';
  uploadedAt: string;
  fileName: string;
  url: string;
  analysis?: {
    findings: string;
    diagnostics: string;
    suggestedActions: string;
    confidence: number;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  hipaaCompliant: boolean;
}

export interface EHRIntegrationLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT';
  resourceType: 'Patient' | 'Observation' | 'MedicationRequest';
  payload: string;
  response: string;
  status: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  size: '1K' | '2K' | '4K';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface VideoGenerationRequest {
  prompt: string;
  imageBytes?: string;
  aspectRatio: '16:9' | '9:16';
}
