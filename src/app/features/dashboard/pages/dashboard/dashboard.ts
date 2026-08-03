import { Component, OnInit } from '@angular/core';
import { StatCard } from '../../components/stat-card/stat-card';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../appointments/models/appointment.model';
import { PatientService } from '../../../patients/services/patient';
import { Patient } from '../../../patients/models/patient.model';
import { RouterLink } from '@angular/router';



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

 upcomingAppointments: Appointment[] = [];

 recentPatients: Patient[] = [];

 totalPatients = 0;

 activePatients = 0;

 inactivePatients = 0;

 private getTodayDate(): string {

  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

}

 constructor(
  private appointmentService: AppointmentService,
  private patientService: PatientService
) {}

ngOnInit(): void {

  this.todayAppointments =
    this.appointmentService.getTodayAppointmentsCount();


  this.upcomingAppointments =
    this.appointmentService.getAppointments().filter(appointment =>appointment.date >= this.getTodayDate()).slice(0, 5);

  const patients = this.patientService.getPatients();

  this.totalPatients = patients.length;

  this.activePatients = patients.filter(patient => patient.status === 'Active').length;

  this.inactivePatients = patients.filter().length;

  this.recentPatients = patients.slice(-5).reverse();

}

}