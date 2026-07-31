import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private storageKey = 'appointments';

  private appointments: Appointment[] = [];

  constructor() {
    this.loadAppointments();
  }

  private loadAppointments(): void {

    const storedAppointments = localStorage.getItem(this.storageKey);

    if (storedAppointments) {

      this.appointments = JSON.parse(storedAppointments);

    } else {

      this.appointments = [
        {
          id: 1,
          patientName: 'John Doe',
          doctorName: 'Dr. Smith',
          department: 'Cardiology',
          date: '2026-07-30',
          time: '10:00 AM',
          status: 'Confirmed'
        },
        {
          id: 2,
          patientName: 'Sarah Johnson',
          doctorName: 'Dr. Adams',
          department: 'Neurology',
          date: '2026-07-30',
          time: '11:30 AM',
          status: 'Pending'
        }
      ];

      this.saveAppointments();
    }

  }

  getAppointments(): Appointment[] {
    return this.appointments;
  }

  saveAppointments(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.appointments)
    );
  }



 getTodayAppointmentsCount(): number {

  const today = new Date();

  const formattedToday =
    `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;



  return this.appointments.filter(
    appointment => appointment.date === formattedToday
  ).length;

}

getConfirmedAppointmentsCount(): number {

  return this.appointments.filter(
    appointment => appointment.status === 'Confirmed'
  ).length;

}

getCancelledAppointmentsCount(): number {

  return this.appointments.filter(
    appointment => appointment.status === 'Cancelled'
  ).length;

}

}