export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Regular' | 'Follow-up' | 'Emergency' | 'Consultation';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  notes: string;
  fees?: number;
}