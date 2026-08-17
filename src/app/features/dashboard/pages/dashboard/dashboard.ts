import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatCard } from '../../components/stat-card/stat-card';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../appointments/models/appointment.model';
import { PatientService } from '../../../patients/services/patient';
import { Patient } from '../../../patients/models/patient.model';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialog } from '../../../calendar/components/appointment-dialog/appointment-dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    StatCard,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  todayAppointments = 0;

  totalAppointments = 0;

  pendingAppointments = 0;

  confirmedAppointments = 0;

  completedAppointments = 0;

  cancelledAppointments = 0;

  upcomingAppointments: Appointment[] = [];

  recentPatients: Patient[] = [];

  recentDoctors: Doctor[] = [];



  totalPatients = 0;

  activePatients = 0;

  inactivePatients = 0;


  totalDoctors = 0;

  availableDoctors = 0;



  constructor(
  private appointmentService: AppointmentService,
  private patientService: PatientService,
  private doctorService: DoctorService,
  private dialog: MatDialog
) {}



  private getTodayDate(): string {

    const today = new Date();

    return `${today.getFullYear()}-${String( today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  }


  getPatientName(patientId: number): string {

    const patient = this.patientService.getPatient(patientId);
        if (!patient) {
      return 'Unknown Patient';
    }

    return `${patient.firstName} ${patient.lastName}`;

  }

  getDoctorName(doctorId: number): string {

    const doctor = this.doctorService.getDoctor(doctorId);
        if (!doctor) {
      return 'Unknown Doctor';
    }

    return `Dr. ${doctor.firstName} ${doctor.lastName}`;

  }


  getDepartment(doctorId: number): string {

    const doctor = this.doctorService.getDoctor(doctorId);

    return doctor?.department ?? 'Unknown';

  }


  ngOnInit(): void {
  this.loadDashboard();
}


private loadDashboard(): void {

const appointments = this.appointmentService.getAppointments();

this.todayAppointments = this.appointmentService.getTodayAppointmentsCount();

this.totalAppointments = appointments.length;

this.pendingAppointments = appointments.filter(appointment => appointment.status === 'Pending').length;

this.confirmedAppointments = appointments.filter(appointment => appointment.status === 'Confirmed').length;

this.completedAppointments = appointments.filter(appointment => appointment.status === 'Completed').length;

this.cancelledAppointments = appointments.filter(appointment => appointment.status === 'Cancelled').length;

  this.upcomingAppointments =
  this.appointmentService.getAppointments().filter(appointment =>appointment.date >= this.getTodayDate())
  .sort(
    (a,b) =>
      new Date(`${a.date} ${a.time}`).getTime()
      -
      new Date(`${b.date} ${b.time}`).getTime()).slice(0,5);


  const patients = this.patientService.getPatients();

  this.totalPatients = patients.length;

  this.activePatients = patients.filter(patient => patient.status === 'Active').length;

  this.inactivePatients = patients.filter(patient => patient.status === 'Inactive').length;

  this.recentPatients = patients.slice(-5).reverse();


   const doctors = this.doctorService.getDoctors();

  this.totalDoctors = doctors.length;

  this.availableDoctors = doctors.filter(doctor =>doctor.availability === 'Available').length;

  this.recentDoctors = doctors.slice(-5).reverse();

}

openAppointment(appointment: Appointment): void {

  const patient = this.patientService.getPatient(appointment.patientId);

  const doctor = this.doctorService.getDoctor(appointment.doctorId);

  this.dialog.open(
    AppointmentDialog,
    {
      width: '450px',

      data: {appointment, patient, doctor}
    }
  );


}


}