import { Component, OnInit } from '@angular/core';
import { StatCard } from '../../components/stat-card/stat-card';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../appointments/models/appointment.model';
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

 todayAppointments = 999;

 upcomingAppointments: Appointment[] = [];

 private getTodayDate(): string {

  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

}

  constructor(
    private appointmentService: AppointmentService
  ) {}

ngOnInit(): void {

  this.todayAppointments =
    this.appointmentService.getTodayAppointmentsCount();


  this.upcomingAppointments =
    this.appointmentService.getAppointments()
      .filter(appointment =>
        appointment.date >= this.getTodayDate()
      )
      .slice(0, 5);

}

}