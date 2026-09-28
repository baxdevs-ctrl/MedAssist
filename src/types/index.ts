export type Language = 'uz' | 'ru' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  clinic: string;
  licenseNumber: string;
  avatar?: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface Patient {
  id: string;
  fullName: string;
  dob: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  allergies: string;
  currentMedications: string;
  medicalHistory: string;
  notes: string;
  bloodType?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'consultation' | 'followup' | 'urgent' | 'routine' | 'procedure';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes: string;
}

export interface MedicalNote {
  id: string;
  patientId?: string;
  patientName?: string;
  title: string;
  rawText: string;
  chiefComplaint: string;
  symptoms: string;
  medicalHistory: string;
  examination: string;
  labResults: string;
  assessment: string;
  plan: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  isStructured: boolean;
}

export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  date: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  notes?: string;
  aiExplanation?: string;
}

export interface ChecklistTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  category: 'consultation' | 'pre-op' | 'post-op' | 'documentation' | 'custom';
  description: string;
  tasks: ChecklistTask[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}
