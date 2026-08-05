export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Completed'
    | 'Cancelled';
  reason?: string;
  notes?: string;
}
