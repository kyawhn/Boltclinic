export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address: string;
  medicalHistory: string;
  allergies: string;
  emergencyContact: string;
  registrationDate: string;
  lastVisit?: string;
}

export interface PatientVisit {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  fees: number;
  followUpDate?: string;
  notes: string;
}