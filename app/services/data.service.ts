import { File, Folder, knownFolders, path } from '@nativescript/core';
import { Patient, PatientVisit } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';
import { FinancialRecord } from '../models/financial.model';

export class DataService {
  private static instance: DataService;
  private dataFolder: Folder;

  private constructor() {
    this.dataFolder = knownFolders.documents().getFolder('clinic_data');
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private async ensureFileExists(fileName: string, headers: string): Promise<File> {
    const file = this.dataFolder.getFile(fileName);
    if (!File.exists(file.path)) {
      await file.writeText(headers);
    }
    return file;
  }

  private csvToArray(csvText: string): any[] {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      return obj;
    });
  }

  private arrayToCsv(data: any[], headers: string[]): string {
    const csvRows = [headers.join(',')];
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csvRows.push(row.join(','));
    });
    return csvRows.join('\n');
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    try {
      const file = await this.ensureFileExists('patients.csv', 
        'id,name,age,gender,phone,email,address,medicalHistory,allergies,emergencyContact,registrationDate,lastVisit');
      const csvText = await file.readText();
      return this.csvToArray(csvText) as Patient[];
    } catch (error) {
      console.error('Error reading patients:', error);
      return [];
    }
  }

  async savePatient(patient: Patient): Promise<void> {
    try {
      const patients = await this.getPatients();
      const existingIndex = patients.findIndex(p => p.id === patient.id);
      
      if (existingIndex >= 0) {
        patients[existingIndex] = patient;
      } else {
        patients.push(patient);
      }

      const csvData = this.arrayToCsv(patients, 
        ['id', 'name', 'age', 'gender', 'phone', 'email', 'address', 'medicalHistory', 'allergies', 'emergencyContact', 'registrationDate', 'lastVisit']);
      
      const file = this.dataFolder.getFile('patients.csv');
      await file.writeText(csvData);
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  }

  // Patient Visits
  async getPatientVisits(patientId?: string): Promise<PatientVisit[]> {
    try {
      const file = await this.ensureFileExists('patient_visits.csv',
        'id,patientId,date,diagnosis,treatment,prescription,fees,followUpDate,notes');
      const csvText = await file.readText();
      const visits = this.csvToArray(csvText) as PatientVisit[];
      return patientId ? visits.filter(v => v.patientId === patientId) : visits;
    } catch (error) {
      console.error('Error reading patient visits:', error);
      return [];
    }
  }

  async savePatientVisit(visit: PatientVisit): Promise<void> {
    try {
      const visits = await this.getPatientVisits();
      const existingIndex = visits.findIndex(v => v.id === visit.id);
      
      if (existingIndex >= 0) {
        visits[existingIndex] = visit;
      } else {
        visits.push(visit);
      }

      const csvData = this.arrayToCsv(visits,
        ['id', 'patientId', 'date', 'diagnosis', 'treatment', 'prescription', 'fees', 'followUpDate', 'notes']);
      
      const file = this.dataFolder.getFile('patient_visits.csv');
      await file.writeText(csvData);
    } catch (error) {
      console.error('Error saving patient visit:', error);
    }
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    try {
      const file = await this.ensureFileExists('appointments.csv',
        'id,patientId,patientName,date,time,type,status,notes,fees');
      const csvText = await file.readText();
      return this.csvToArray(csvText) as Appointment[];
    } catch (error) {
      console.error('Error reading appointments:', error);
      return [];
    }
  }

  async saveAppointment(appointment: Appointment): Promise<void> {
    try {
      const appointments = await this.getAppointments();
      const existingIndex = appointments.findIndex(a => a.id === appointment.id);
      
      if (existingIndex >= 0) {
        appointments[existingIndex] = appointment;
      } else {
        appointments.push(appointment);
      }

      const csvData = this.arrayToCsv(appointments,
        ['id', 'patientId', 'patientName', 'date', 'time', 'type', 'status', 'notes', 'fees']);
      
      const file = this.dataFolder.getFile('appointments.csv');
      await file.writeText(csvData);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  }

  // Financial Records
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    try {
      const file = await this.ensureFileExists('financial_records.csv',
        'id,date,type,category,amount,description,patientId,appointmentId');
      const csvText = await file.readText();
      return this.csvToArray(csvText) as FinancialRecord[];
    } catch (error) {
      console.error('Error reading financial records:', error);
      return [];
    }
  }

  async saveFinancialRecord(record: FinancialRecord): Promise<void> {
    try {
      const records = await this.getFinancialRecords();
      const existingIndex = records.findIndex(r => r.id === record.id);
      
      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }

      const csvData = this.arrayToCsv(records,
        ['id', 'date', 'type', 'category', 'amount', 'description', 'patientId', 'appointmentId']);
      
      const file = this.dataFolder.getFile('financial_records.csv');
      await file.writeText(csvData);
    } catch (error) {
      console.error('Error saving financial record:', error);
    }
  }

  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}